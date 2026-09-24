using System.Text;
using HeroscapeBuilder.Server.Data.Entities.Shop;
using HeroscapeBuilder.Server.Domain.Exceptions;
using HeroscapeBuilder.Server.Domain.Shop;

namespace HeroscapeBuilder.Server.Services
{
    /// <summary>
    /// Emails the shop owner about new orders and payment problems.
    /// </summary>
    public class ShopEmailService
    {
        private readonly EmailSettings _email;
        private readonly ShopSettings _shop;
        private readonly EmailSender _sender;

        public ShopEmailService(EmailSettings email, ShopSettings shop, EmailSender sender)
        {
            _email = email;
            _shop = shop;
            _sender = sender;
        }

        public bool IsConfigured => _email.IsConfigured;

        public Task SendNewOrder(CustomerOrder order)
        {
            var number = OrderStatus.FormatNumber(order.Id);
            var text = new StringBuilder();
            text.AppendLine($"New card shop order {number} - {Money(order.TotalCents)} paid.");
            text.AppendLine();
            text.AppendLine($"Open it: {_shop.SiteUrl}/shop/admin/orders/{order.Id}");
            text.AppendLine();
            text.AppendLine("TO MAKE");
            foreach (var format in order.OrderItems.GroupBy(x => x.FormatName))
            {
                text.AppendLine($"  {format.Sum(x => x.Quantity)} x {format.Key}");
            }
            text.AppendLine();
            text.AppendLine("CARDS");
            foreach (var item in order.OrderItems.OrderBy(x => x.FormatName).ThenBy(x => x.UnitName))
            {
                text.AppendLine($"  {item.Quantity} x {item.UnitName} ({item.FormatName})");
            }
            text.AppendLine();
            text.AppendLine("CUSTOMER");
            text.AppendLine($"  {order.CustomerName ?? order.ShipName ?? "(no name)"}");
            text.AppendLine($"  {order.Email ?? "(no email)"}");
            if (!string.IsNullOrWhiteSpace(order.Phone))
            {
                text.AppendLine($"  {order.Phone}");
            }
            text.AppendLine();
            text.AppendLine("SHIP TO");
            foreach (var line in new[]
            {
                order.ShipName,
                order.ShipLine1,
                order.ShipLine2,
                string.Join(" ", new[] { order.ShipCity is null ? null : order.ShipCity + ",", order.ShipState, order.ShipPostalCode }.Where(x => !string.IsNullOrWhiteSpace(x))),
                order.ShipCountry,
            }.Where(x => !string.IsNullOrWhiteSpace(x)))
            {
                text.AppendLine($"  {line}");
            }
            text.AppendLine($"  Shipping: {order.ShippingMethod ?? "-"}");
            text.AppendLine();
            text.AppendLine("TOTALS");
            text.AppendLine($"  Cards ({order.CardCount}): {Money(order.SubtotalCents)}");
            if (order.DiscountCents > 0)
            {
                text.AppendLine($"  Discount ({order.DiscountPercent:0.##}%): -{Money(order.DiscountCents)}");
            }
            text.AppendLine($"  Shipping: {Money(order.ShippingCents)}");
            if (order.TaxCents > 0)
            {
                text.AppendLine($"  Tax: {Money(order.TaxCents)}");
            }
            text.AppendLine($"  Total: {Money(order.TotalCents)}");

            return Send($"New order {number}: {order.CardCount} cards, {Money(order.TotalCents)}", text.ToString());
        }

        /// <summary>
        /// Stripe took a payment that no order in the database matches. The owner has to sort it out by hand.
        /// </summary>
        public Task SendUnmatchedPayment(string sessionId, string? orderId, long? amountCents, string? customerEmail, string? customerName)
        {
            var text = new StringBuilder();
            text.AppendLine("Stripe received a card shop payment that doesn't match any order in the database.");
            text.AppendLine("The customer has been charged, so please look the payment up in the Stripe dashboard and");
            text.AppendLine("contact them (or refund it).");
            text.AppendLine();
            text.AppendLine($"  Checkout session: {sessionId}");
            text.AppendLine($"  Order id in Stripe metadata: {orderId ?? "(none)"}");
            text.AppendLine($"  Amount: {(amountCents.HasValue ? Money((int)amountCents.Value) : "unknown")}");
            text.AppendLine($"  Customer: {customerName ?? "(no name)"} <{customerEmail ?? "no email"}>");

            return Send("ACTION NEEDED: unmatched card shop payment", text.ToString());
        }

        public Task SendTest()
        {
            return Send("Card shop test email",
                $"This is a test from the Heroscape Builder card shop at {_shop.SiteUrl}.\n\nIf you received it, new order emails will reach you too.");
        }

        private Task Send(string subject, string body)
        {
            if (!_email.IsConfigured)
            {
                throw new ShopException(ShopErrorKind.Unavailable, "Email is not configured.");
            }

            return _sender.Send(_email.NotifyTo!, "Heroscape Builder Shop", subject, body);
        }

        private static string Money(int cents) => $"${cents / 100m:0.00}";
    }
}
