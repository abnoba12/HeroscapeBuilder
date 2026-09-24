using HeroscapeBuilder.Server.Common.Mapping;
using HeroscapeBuilder.Server.Data.Entities.Shop;
using HeroscapeBuilder.Server.Data.Repositories;
using HeroscapeBuilder.Server.Domain.Entities;
using HeroscapeBuilder.Server.Domain.Exceptions;
using HeroscapeBuilder.Server.Domain.Requests;
using HeroscapeBuilder.Server.Domain.Shop;
using HeroscapeBuilder.Server.Integrations.StripePayments;
using Stripe;
using Stripe.Checkout;

namespace HeroscapeBuilder.Server.Services
{
    /// <summary>
    /// Payment flow. The cart is priced on the server and saved as a Pending order (with every card on it) BEFORE the
    /// customer is sent to the Stripe-hosted checkout page, so card details never touch this site and there is never a
    /// payment without an order row. The order becomes Paid when Stripe confirms it, through whichever arrives first:
    /// the webhook, the checkout success page, or the background reconciliation that polls Stripe every few minutes.
    /// </summary>
    public class ShopCheckoutService
    {
        private const string OrderIdMetadataKey = "order_id";

        /// <summary>
        /// How far back reconciliation looks for checkouts. Stripe sessions expire long before this.
        /// </summary>
        private static readonly TimeSpan ReconcileWindow = TimeSpan.FromDays(3);

        /// <summary>
        /// How long a customer has to finish paying on Stripe (Stripe allows 30 minutes to 24 hours).
        /// </summary>
        private static readonly TimeSpan CheckoutLifetime = TimeSpan.FromHours(2);

        private readonly ShopRepository _shopRepository;
        private readonly ShopService _shopService;
        private readonly ShopEmailService _emailService;
        private readonly StripeClientProvider _stripe;
        private readonly ShopSettings _settings;
        private readonly ILogger<ShopCheckoutService> _logger;

        public ShopCheckoutService(ShopRepository shopRepository, ShopService shopService, ShopEmailService emailService, StripeClientProvider stripe, ShopSettings settings, ILogger<ShopCheckoutService> logger)
        {
            _shopRepository = shopRepository;
            _shopService = shopService;
            _emailService = emailService;
            _stripe = stripe;
            _settings = settings;
            _logger = logger;
        }

        public async Task<ShopCheckoutEntity> CreateCheckout(ShopCartRequest request, Guid? userId, string? userEmail)
        {
            var status = await _shopRepository.GetStoreStatus();
            if (!status.IsOpen)
            {
                throw new ShopException(ShopErrorKind.Conflict, ShopService.ClosedMessage(status));
            }

            var client = _stripe.Client;
            var priced = await _shopService.PriceCart(request);
            var quote = priced.Quote;

            // Checkout only goes ahead for exactly what the customer was shown; any problem sends them back to the cart.
            if (quote.Errors.Count > 0)
            {
                throw new ShopException(ShopErrorKind.Validation, quote.Errors.ToArray());
            }
            if (quote.CardCount == 0)
            {
                throw new ShopException(ShopErrorKind.Validation, "Your cart is empty.");
            }

            var shippingOptions = await _shopRepository.GetShippingOptions(activeOnly: true);
            if (shippingOptions.Count == 0)
            {
                throw new ShopException(ShopErrorKind.Unavailable, "Shipping is not set up yet, so orders can't be placed right now.");
            }

            var now = DateTime.UtcNow;
            var order = new CustomerOrder
            {
                UserId = userId?.ToString(),
                AccessKey = Guid.NewGuid(),
                Status = OrderStatus.Pending,
                CardCount = quote.CardCount,
                SubtotalCents = quote.SubtotalCents,
                DiscountPercent = quote.DiscountPercent,
                DiscountCents = quote.DiscountCents,
                TotalCents = quote.TotalCents,
                Email = userEmail,
                CreatedAt = now,
                UpdatedAt = now,
                OrderItems = quote.Lines
                    .Select(line => new OrderItem
                    {
                        ArmyCardFileId = line.ArmyCardFileId,
                        ArmyCardId = line.ArmyCardId,
                        FormatCode = line.FormatCode,
                        FormatName = line.FormatName,
                        UnitName = line.UnitName,
                        Creator = line.Creator,
                        FilePath = priced.Files[line.ArmyCardFileId].FilePath,
                        Quantity = line.Quantity,
                        UnitPriceCents = line.UnitPriceCents,
                    })
                    .ToList(),
            };

            // The order and its cards are committed before Stripe is involved. If anything later fails, the order id
            // travels to Stripe in the session metadata, so a payment can always be matched back to this row.
            _shopRepository.AddOrder(order);
            await _shopRepository.SaveChanges();

            Session session;
            try
            {
                session = await CreateStripeSession(client, order, quote, shippingOptions, userEmail);
            }
            catch (StripeException ex)
            {
                _logger.LogError(ex, "Stripe checkout session could not be created for order {OrderId}.", order.Id);

                // The customer never reached a payment page, so nothing was charged. The row is kept (not deleted) as a record.
                order.Status = OrderStatus.Expired;
                order.AdminNotes = $"Checkout could not be started: {ex.StripeError?.Message ?? ex.Message}";
                order.UpdatedAt = DateTime.UtcNow;
                await _shopRepository.SaveChanges();

                throw new ShopException(ShopErrorKind.Unavailable, "We couldn't start checkout. Please try again in a few minutes.");
            }

            // If this save fails the customer can still pay: reconciliation finds the session by its order_id metadata.
            order.StripeCheckoutSessionId = session.Id;
            order.UpdatedAt = DateTime.UtcNow;
            await _shopRepository.SaveChanges();

            return new ShopCheckoutEntity { Url = session.Url };
        }

        private async Task<Session> CreateStripeSession(IStripeClient client, CustomerOrder order, ShopQuoteEntity quote, List<ShippingOption> shippingOptions, string? userEmail)
        {
            var orderNumber = OrderStatus.FormatNumber(order.Id);
            var metadata = new Dictionary<string, string> { [OrderIdMetadataKey] = order.Id.ToString() };

            // Stripe limits a session to 100 line items, so the charge is one line per format. The per-card breakdown
            // lives on the order in our database.
            var options = new SessionCreateOptions
            {
                Mode = "payment",
                ClientReferenceId = order.Id.ToString(),
                CustomerEmail = string.IsNullOrWhiteSpace(userEmail) ? null : userEmail,
                SuccessUrl = $"{_settings.SiteUrl}/shop/checkout/success?session_id={{CHECKOUT_SESSION_ID}}",
                CancelUrl = $"{_settings.SiteUrl}/shop/cart",
                ExpiresAt = DateTime.UtcNow.Add(CheckoutLifetime),
                Metadata = metadata,
                PaymentIntentData = new SessionPaymentIntentDataOptions
                {
                    Description = $"Heroscape Builder order {orderNumber}",
                    Metadata = metadata,
                },
                LineItems = quote.Formats
                    .Select(format => new SessionLineItemOptions
                    {
                        Quantity = format.Quantity,
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency = _settings.Currency,
                            UnitAmount = format.UnitPriceCents,
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = $"Heroscape army cards - {format.FormatName}",
                                Description = $"Made-to-order. Order {orderNumber}.",
                            },
                        },
                    })
                    .ToList(),
                ShippingAddressCollection = new SessionShippingAddressCollectionOptions
                {
                    AllowedCountries = _settings.ShippingCountries,
                },
                // Stripe allows at most 5 shipping options.
                ShippingOptions = shippingOptions
                    .Take(5)
                    .Select(option => new SessionShippingOptionOptions
                    {
                        ShippingRateData = new SessionShippingOptionShippingRateDataOptions
                        {
                            DisplayName = option.Name,
                            Type = "fixed_amount",
                            FixedAmount = new SessionShippingOptionShippingRateDataFixedAmountOptions
                            {
                                Amount = option.AmountCents,
                                Currency = _settings.Currency,
                            },
                            DeliveryEstimate = new SessionShippingOptionShippingRateDataDeliveryEstimateOptions
                            {
                                Minimum = new SessionShippingOptionShippingRateDataDeliveryEstimateMinimumOptions { Unit = "business_day", Value = option.MinBusinessDays },
                                Maximum = new SessionShippingOptionShippingRateDataDeliveryEstimateMaximumOptions { Unit = "business_day", Value = option.MaxBusinessDays },
                            },
                        },
                    })
                    .ToList(),
                AutomaticTax = new SessionAutomaticTaxOptions { Enabled = _settings.AutomaticTax },
                CustomText = new SessionCustomTextOptions
                {
                    Submit = new SessionCustomTextSubmitOptions
                    {
                        Message = $"Cards are made to order. Estimated production time is {quote.TurnaroundMinDays}-{quote.TurnaroundMaxDays} business days before your order ships; the delivery estimate above starts after that.",
                    },
                },
            };

            if (quote.DiscountCents > 0)
            {
                // A single-use coupon carries the quantity discount so it shows as its own line on the Stripe page and receipt.
                var coupon = await new CouponService(client).CreateAsync(new CouponCreateOptions
                {
                    AmountOff = quote.DiscountCents,
                    Currency = _settings.Currency,
                    Duration = "once",
                    MaxRedemptions = 1,
                    Name = $"{quote.DiscountPercent:0.##}% quantity discount",
                    Metadata = metadata,
                }, new RequestOptions { IdempotencyKey = $"hsb-order-{order.Id}-coupon" });

                options.Discounts = new List<SessionDiscountOptions> { new SessionDiscountOptions { Coupon = coupon.Id } };
            }

            return await new SessionService(client).CreateAsync(options, new RequestOptions { IdempotencyKey = $"hsb-order-{order.Id}-session" });
        }

        /// <summary>
        /// Called by the checkout success page. Confirms the payment with Stripe directly (so the order shows as paid
        /// even if the webhook hasn't arrived yet) and returns the order.
        /// </summary>
        public async Task<ShopOrderEntity> CompleteCheckout(string sessionId)
        {
            var order = await _shopRepository.GetOrderByCheckoutSession(sessionId);

            // Pending, or not found because the session id never got saved: ask Stripe, which also links the session.
            if (order == null || order.Status == OrderStatus.Pending)
            {
                try
                {
                    await FulfillCheckoutSession(sessionId);
                }
                catch (StripeException ex)
                {
                    _logger.LogError(ex, "Could not confirm checkout session {SessionId} with Stripe.", sessionId);
                }
                order = await _shopRepository.GetOrderByCheckoutSession(sessionId);
            }

            if (order == null)
            {
                throw new ShopException(ShopErrorKind.NotFound, "Order not found.");
            }

            return order.ToShopOrderEntity(await _shopService.GetAllFormats());
        }

        /// <summary>
        /// The order a checkout session belongs to: by the saved session id, or failing that by the order id Stripe
        /// carries in the session metadata (covers a session id that was never saved to the order).
        /// </summary>
        private async Task<CustomerOrder?> FindOrderForSession(Session session, bool track)
        {
            var order = await _shopRepository.GetOrderByCheckoutSession(session.Id, track);
            if (order != null)
            {
                return order;
            }

            var metadataId = session.Metadata != null && session.Metadata.TryGetValue(OrderIdMetadataKey, out var value) ? value : session.ClientReferenceId;
            if (int.TryParse(metadataId, out var orderId))
            {
                order = await _shopRepository.GetOrder(orderId, track);
                if (order != null && (order.StripeCheckoutSessionId == null || order.StripeCheckoutSessionId == session.Id))
                {
                    return order;
                }
            }

            return null;
        }

        /// <summary>
        /// Marks the order for a checkout session as Paid once Stripe reports it paid, copying the customer, shipping
        /// and final totals from Stripe, then emails the owner. Safe to call repeatedly.
        /// </summary>
        public async Task FulfillCheckoutSession(string sessionId)
        {
            var session = await new SessionService(_stripe.Client).GetAsync(sessionId, new SessionGetOptions
            {
                Expand = new List<string> { "shipping_cost.shipping_rate" },
            });

            var order = await FindOrderForSession(session, track: true);
            if (order == null)
            {
                // Reconciliation emails the owner about paid sessions without an order.
                _logger.LogWarning("Stripe checkout session {SessionId} does not match any order.", session.Id);
                return;
            }

            if (session.Metadata != null && session.Metadata.TryGetValue(OrderIdMetadataKey, out var orderId) && orderId != order.Id.ToString())
            {
                _logger.LogError("Stripe checkout session {SessionId} is for order {MetadataOrderId} but is stored on order {OrderId}.", session.Id, orderId, order.Id);
                return;
            }

            order.StripeCheckoutSessionId ??= session.Id;

            var paid = session.PaymentStatus == "paid" || session.PaymentStatus == "no_payment_required";
            if (!paid)
            {
                if (session.Status == "expired" && order.Status == OrderStatus.Pending)
                {
                    order.Status = OrderStatus.Expired;
                    order.UpdatedAt = DateTime.UtcNow;
                }
                await _shopRepository.SaveChanges();
                return;
            }

            if (order.Status != OrderStatus.Pending && order.Status != OrderStatus.Expired)
            {
                await _shopRepository.SaveChanges();
                return;
            }

            var now = DateTime.UtcNow;
            order.Status = OrderStatus.Paid;
            order.PaidAt = now;
            order.UpdatedAt = now;
            order.StripePaymentIntentId = session.PaymentIntentId;

            // Stripe's amounts are what was actually charged.
            order.TotalCents = (int)(session.AmountTotal ?? order.TotalCents);
            order.ShippingCents = (int)(session.TotalDetails?.AmountShipping ?? 0);
            order.TaxCents = (int)(session.TotalDetails?.AmountTax ?? 0);
            order.DiscountCents = (int)(session.TotalDetails?.AmountDiscount ?? order.DiscountCents);
            order.ShippingMethod = session.ShippingCost?.ShippingRate?.DisplayName;

            order.Email = session.CustomerDetails?.Email ?? order.Email;
            order.CustomerName = session.CustomerDetails?.Name;
            order.Phone = session.CustomerDetails?.Phone;

            var shipping = session.CollectedInformation?.ShippingDetails;
            order.ShipName = shipping?.Name;
            order.ShipLine1 = shipping?.Address?.Line1;
            order.ShipLine2 = shipping?.Address?.Line2;
            order.ShipCity = shipping?.Address?.City;
            order.ShipState = shipping?.Address?.State;
            order.ShipPostalCode = shipping?.Address?.PostalCode;
            order.ShipCountry = shipping?.Address?.Country;

            await _shopRepository.SaveChanges();
            _logger.LogInformation("Order {OrderNumber} paid ({TotalCents} cents).", OrderStatus.FormatNumber(order.Id), order.TotalCents);

            await NotifyOwner(order.Id);
        }

        /// <summary>
        /// Emails the owner about a paid order unless that already happened. The order is only marked as notified
        /// after the email is sent, so a failure is retried by reconciliation. (A rare duplicate email is preferred
        /// over a missed one.)
        /// </summary>
        public async Task NotifyOwner(int orderId)
        {
            var order = await _shopRepository.GetOrder(orderId, track: true);
            if (order == null || order.OwnerNotifiedAt != null || order.PaidAt == null)
            {
                return;
            }

            if (!_emailService.IsConfigured)
            {
                _logger.LogError("Order {OrderNumber} is paid but email is not configured, so the owner was not notified.", OrderStatus.FormatNumber(order.Id));
                return;
            }

            try
            {
                await _emailService.SendNewOrder(order);
                order.OwnerNotifiedAt = DateTime.UtcNow;
            }
            catch (Exception ex)
            {
                order.NotifyAttempts++;
                _logger.LogError(ex, "New order email for {OrderNumber} failed (attempt {Attempt}); it will be retried.", OrderStatus.FormatNumber(order.Id), order.NotifyAttempts);
            }
            await _shopRepository.SaveChanges();
        }

        /// <summary>
        /// Safety net run every few minutes by <see cref="Background.ShopReconciliationWorker"/>:
        /// 1. re-checks recent Pending orders with Stripe, so a missed webhook never leaves a paid order unrecorded;
        /// 2. walks every completed Stripe checkout from the last few days and makes sure it has a Paid order, emailing
        ///    the owner about any payment that matches no order at all;
        /// 3. retries "new order" emails that have not been sent.
        /// </summary>
        public async Task Reconcile(CancellationToken cancellationToken)
        {
            if (_settings.StripeConfigured && _stripe.IsAvailable)
            {
                var since = DateTime.UtcNow.Subtract(ReconcileWindow);

                foreach (var pending in await _shopRepository.GetPendingOrders(since))
                {
                    if (pending.StripeCheckoutSessionId == null)
                    {
                        continue; // No session id saved: found through step 2 if the customer paid.
                    }
                    try
                    {
                        await FulfillCheckoutSession(pending.StripeCheckoutSessionId);
                    }
                    catch (StripeException ex)
                    {
                        _logger.LogError(ex, "Reconciliation could not check order {OrderId} with Stripe.", pending.Id);
                    }
                }

                var sessions = new SessionService(_stripe.Client).ListAutoPagingAsync(
                    new SessionListOptions { Created = new DateRangeOptions { GreaterThanOrEqual = since }, Status = "complete", Limit = 100 },
                    cancellationToken: cancellationToken);

                await foreach (var session in sessions.WithCancellation(cancellationToken))
                {
                    var metadataId = session.Metadata != null && session.Metadata.TryGetValue(OrderIdMetadataKey, out var value) ? value : null;
                    if (metadataId == null)
                    {
                        continue; // Not a card shop checkout (e.g. a payment link made in the dashboard).
                    }

                    var order = await FindOrderForSession(session, track: false);
                    if (order == null)
                    {
                        await AlertUnmatchedPayment(session, metadataId);
                    }
                    else if (order.Status == OrderStatus.Pending || order.Status == OrderStatus.Expired || order.StripeCheckoutSessionId == null)
                    {
                        await FulfillCheckoutSession(session.Id);
                    }
                }
            }

            foreach (var orderId in await _shopRepository.GetOrderIdsAwaitingNotification())
            {
                await NotifyOwner(orderId);
            }
        }

        /// <summary>
        /// Emails the owner (once per session) about money Stripe took that no order accounts for.
        /// </summary>
        private async Task AlertUnmatchedPayment(Session session, string metadataOrderId)
        {
            var alertId = $"alert:unmatched:{session.Id}";
            if (await _shopRepository.EventProcessed(alertId))
            {
                return;
            }

            _logger.LogError("Stripe checkout session {SessionId} was paid but matches no order (metadata order id {OrderId}).", session.Id, metadataOrderId);
            if (!_emailService.IsConfigured)
            {
                return; // Retried on the next run, once email works.
            }

            try
            {
                await _emailService.SendUnmatchedPayment(session.Id, metadataOrderId, session.AmountTotal, session.CustomerDetails?.Email, session.CustomerDetails?.Name);
                _shopRepository.AddEvent(new StripeEvent { EventId = alertId, EventType = "alert.unmatched_payment", ReceivedAt = DateTime.UtcNow });
                await _shopRepository.SaveChanges();
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                _logger.LogError(ex, "Could not email the unmatched payment alert for {SessionId}; it will be retried.", session.Id);
            }
        }

        /// <summary>
        /// Expires every open Stripe checkout so nobody can finish paying after the shop closes.
        /// </summary>
        public async Task<int> ExpireOpenCheckouts()
        {
            if (!_settings.StripeConfigured || !_stripe.IsAvailable)
            {
                return 0;
            }

            var expired = 0;
            var service = new SessionService(_stripe.Client);
            foreach (var pending in await _shopRepository.GetPendingOrders(DateTime.UtcNow.Subtract(ReconcileWindow)))
            {
                if (pending.StripeCheckoutSessionId == null)
                {
                    continue;
                }
                try
                {
                    await service.ExpireAsync(pending.StripeCheckoutSessionId);
                    expired++;
                }
                catch (StripeException)
                {
                    // Already expired, or paid a moment ago: the fulfillment below records whichever it was.
                }

                try
                {
                    await FulfillCheckoutSession(pending.StripeCheckoutSessionId);
                }
                catch (StripeException ex)
                {
                    _logger.LogError(ex, "Could not check order {OrderId} with Stripe while closing the shop.", pending.Id);
                }
            }
            return expired;
        }

        /// <summary>
        /// Handles a Stripe webhook call. Throws <see cref="StripeException"/> when the signature is invalid.
        /// Each event is processed once; Stripe retries delivery until this succeeds.
        /// </summary>
        public async Task HandleWebhook(string json, string? signature)
        {
            if (!_settings.WebhookConfigured)
            {
                throw new ShopException(ShopErrorKind.Unavailable, "Webhook signing secret is not configured.");
            }

            var stripeEvent = EventUtility.ConstructEvent(json, signature, _settings.StripeWebhookSecret, throwOnApiVersionMismatch: false);

            if (await _shopRepository.EventProcessed(stripeEvent.Id))
            {
                return;
            }

            switch (stripeEvent.Type)
            {
                case EventTypes.CheckoutSessionCompleted:
                case EventTypes.CheckoutSessionAsyncPaymentSucceeded:
                    if (stripeEvent.Data.Object is Session completed)
                    {
                        await FulfillCheckoutSession(completed.Id);
                    }
                    break;

                case EventTypes.CheckoutSessionExpired:
                    if (stripeEvent.Data.Object is Session expired)
                    {
                        await SetStatusIf(await _shopRepository.GetOrderByCheckoutSession(expired.Id, track: true), OrderStatus.Pending, OrderStatus.Expired);
                    }
                    break;

                case EventTypes.CheckoutSessionAsyncPaymentFailed:
                    if (stripeEvent.Data.Object is Session failed)
                    {
                        await SetStatusIf(await _shopRepository.GetOrderByCheckoutSession(failed.Id, track: true), OrderStatus.Pending, OrderStatus.Cancelled);
                    }
                    break;

                case EventTypes.ChargeRefunded:
                    if (stripeEvent.Data.Object is Charge charge && charge.PaymentIntentId != null)
                    {
                        await RecordRefund(charge);
                    }
                    break;
            }

            _shopRepository.AddEvent(new StripeEvent { EventId = stripeEvent.Id, EventType = stripeEvent.Type, ReceivedAt = DateTime.UtcNow });
            await _shopRepository.SaveChanges();
        }

        private async Task RecordRefund(Charge charge)
        {
            var order = await _shopRepository.GetOrderByPaymentIntent(charge.PaymentIntentId, track: true);
            if (order == null)
            {
                return;
            }

            if (charge.Refunded)
            {
                order.Status = OrderStatus.Refunded;
            }
            else
            {
                // Partial refunds keep the order's status; the owner gets a note instead.
                var note = $"{DateTime.UtcNow:yyyy-MM-dd}: partial refund in Stripe, ${charge.AmountRefunded / 100m:0.00} refunded so far.";
                order.AdminNotes = string.IsNullOrWhiteSpace(order.AdminNotes) ? note : $"{order.AdminNotes}\n{note}";
            }
            order.UpdatedAt = DateTime.UtcNow;
            await _shopRepository.SaveChanges();
        }

        private async Task SetStatusIf(CustomerOrder? order, string fromStatus, string toStatus)
        {
            if (order == null || order.Status != fromStatus)
            {
                return;
            }

            order.Status = toStatus;
            order.UpdatedAt = DateTime.UtcNow;
            await _shopRepository.SaveChanges();
        }
    }
}
