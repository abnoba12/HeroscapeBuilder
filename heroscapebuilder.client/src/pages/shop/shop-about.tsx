import { Alert, Button, Paper, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopCatalog } from '../../models/shop';
import { formatDays, formatMoney, getCatalog } from '../../services/shop-service';
import { DiscountTierList } from './shop-parts';

const CONTACT_URL = 'https://github.com/abnoba12/HeroscapeBuilder/discussions';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>{title}</Typography>
        {children}
    </Paper>
);

/** How ordering works, plus the shipping, refund and contact policies customers (and Stripe) expect to find. */
const ShopAbout: React.FC = () => {
    const [catalog, setCatalog] = useState<ShopCatalog | null>(null);

    useEffect(() => {
        getCatalog().then(setCatalog).catch(() => setCatalog(null));
    }, []);

    return (
        <div className="container-fluid">
            <Stack spacing={2} sx={{ maxWidth: 900 }}>
                <Typography variant="h4">How Ordering Works</Typography>

                <Section title="Made to order">
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Heroscape Builder does not keep printed cards in stock. Every card is printed, cut and finished by hand after
                        you order it, so each format has an estimated production time before your order ships.
                    </Typography>
                    {catalog && (
                        <ul>
                            {catalog.formats.map(format => (
                                <li key={format.code}>
                                    <Typography variant="body2">
                                        <strong>{format.name}</strong>: {formatMoney(format.unitPriceCents)} each, {formatDays(format.turnaroundMinDays, format.turnaroundMaxDays)} to produce.
                                        {format.description ? ` ${format.description}` : ''}
                                    </Typography>
                                </li>
                            ))}
                        </ul>
                    )}
                    <Typography variant="body2">
                        An order with more than one format ships together once everything is made, so the longest production time applies.
                    </Typography>
                </Section>

                <Section title="Quantity discounts">
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Discounts are based on the total number of cards in your order, across all formats combined.
                    </Typography>
                    {catalog && <DiscountTierList tiers={catalog.discountTiers} />}
                </Section>

                <Section title="Shipping">
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Shipping is chosen and paid for at checkout. We currently ship within the United States.
                    </Typography>
                    {catalog && (
                        <ul>
                            {catalog.shippingOptions.map(option => (
                                <li key={option.id}>
                                    <Typography variant="body2">
                                        <strong>{option.name}</strong>: {formatMoney(option.amountCents)}, delivered {formatDays(option.minBusinessDays, option.maxBusinessDays)} after it ships.
                                    </Typography>
                                </li>
                            ))}
                        </ul>
                    )}
                    <Typography variant="body2">
                        When your order ships, its status page is updated with the carrier and tracking number.
                    </Typography>
                </Section>

                <Section title="Secure payment with Stripe">
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        All payments are processed by <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">Stripe</a>,
                        one of the world's largest payment processors. When you check out you are taken to Stripe's own secure checkout
                        page (checkout.stripe.com), where you enter your payment details over an encrypted connection.
                    </Typography>
                    <Typography variant="body2">
                        Stripe is certified to PCI DSS Level 1, the highest level of security certification in the payment card industry.
                        Your card number goes directly to Stripe and is never seen, handled or stored by Heroscape Builder. We only receive
                        your name, email and shipping address so we can deliver your order. Stripe emails you a receipt once payment is complete.
                    </Typography>
                </Section>

                <Section title="Cancellations and refunds">
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Because every order is custom made, orders can be cancelled for a full refund only until production starts.
                        Once your order status shows "In production" it can no longer be cancelled.
                    </Typography>
                    <Typography variant="body2">
                        If cards arrive damaged or misprinted, contact us within 30 days of delivery with your order number and a photo,
                        and we will reprint the affected cards or refund them.
                    </Typography>
                </Section>

                <Section title="About the cards">
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>You are paying for labor and materials only.</strong> The price of each card covers the printing, paper,
                        cutting, finishing and time it takes to make it by hand. No charge is made for the card artwork, text or game
                        content, which remain the property of their respective owners.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        These cards are replica replacement cards, meant for players who have lost, damaged or never received a
                        card for a figure they own. Replacements are only offered for cards that are not available from the original
                        manufacturer. If the manufacturer makes a card available again, it will be removed from the shop.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Every printed card is marked as a reproduction and is not intended to be sold or passed off as an original.
                    </Typography>
                    <Typography variant="body2">
                        Heroscape Builder is a fan project and is not affiliated with or endorsed by Hasbro, Wizards of the Coast or
                        Renegade Game Studios. Custom units remain the work of their community creators. If you own the rights to any
                        card offered here and would like it removed, please contact us and it will be taken down.
                    </Typography>
                </Section>

                <Section title="Contact">
                    <Typography variant="body2">
                        For questions about an order, post on the <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer">Heroscape Builder discussion board</a> and
                        include your order number (for example HSB-00001). Please don't post your address or other personal details publicly.
                    </Typography>
                </Section>

                <Alert severity="info" icon={false}>
                    <Button variant="contained" component={Link} to="/shop">Browse the card shop</Button>
                </Alert>
            </Stack>
        </div>
    );
};

export default ShopAbout;
