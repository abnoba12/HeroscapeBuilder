import { Alert, Box, Chip, Divider, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { OrderStatus, ShopAddress, ShopDiscountTier, ShopFormat, ShopOrder, ShopStoreStatus } from '../../models/shop';
import { STATUS_COLORS, STATUS_LABELS, formatCalendarDate, formatDays, formatMoney, formatPercent } from '../../services/shop-service';

export const Loading: React.FC = () => (
    <div className="loading"><img src="/Hexes.gif" alt="Loading..." className="img-fluid" /></div>
);

/** Shown to customers while the shop isn't taking orders. */
export const ShopClosedBanner: React.FC<{ store?: ShopStoreStatus | null }> = ({ store }) => {
    if (!store || store.isOpen) return null;
    return (
        <Alert severity="warning" variant="filled" sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>The card shop is closed right now</Typography>
            {store.closedMessage && <Typography variant="body2">{store.closedMessage}</Typography>}
            {store.reopensOn && <Typography variant="body2">{`We expect to reopen on ${formatCalendarDate(store.reopensOn)}.`}</Typography>}
            <Typography variant="body2">You can still browse and fill your cart; it will be saved until checkout reopens.</Typography>
        </Alert>
    );
};

export const StatusChip: React.FC<{ status: OrderStatus }> = ({ status }) => (
    <Chip label={STATUS_LABELS[status] ?? status} color={STATUS_COLORS[status] ?? 'default'} size="small" />
);

/** "Buy 25+ cards, save 5%" list. */
export const DiscountTierList: React.FC<{ tiers: ShopDiscountTier[] }> = ({ tiers }) => {
    if (tiers.length === 0) return null;
    return (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {tiers.map(tier => (
                <Chip
                    key={tier.minQuantity}
                    color="success"
                    variant="outlined"
                    label={`${tier.minQuantity}+ cards: ${formatPercent(tier.percentOff)} off`}
                />
            ))}
        </Stack>
    );
};

/** Made-to-order notice with each format's price and production time. */
export const MadeToOrderNotice: React.FC<{ formats: ShopFormat[]; tiers: ShopDiscountTier[] }> = ({ formats, tiers }) => (
    <Alert severity="info" icon={false} sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Every card is made to order</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
            Nothing is pre-printed, so each order is produced after you place it. Estimated production time before shipping:
        </Typography>
        <Box component="ul" sx={{ mt: 0, mb: 1, pl: 3 }}>
            {formats.map(format => (
                <li key={format.code}>
                    <Typography variant="body2">
                        <strong>{format.name}</strong> - {formatMoney(format.unitPriceCents)} each, {formatDays(format.turnaroundMinDays, format.turnaroundMaxDays)}
                    </Typography>
                </li>
            ))}
        </Box>
        {tiers.length > 0 && (
            <>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Quantity discounts count every card in your cart, across all formats:
                </Typography>
                <DiscountTierList tiers={tiers} />
            </>
        )}
        <Typography variant="body2" sx={{ mt: 1 }}>
            🔒 Checkout is handled securely by Stripe. Your card details go straight to Stripe and are never stored on this site.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
            <Link to="/shop/about">How ordering works, shipping and refunds</Link>
        </Typography>
    </Alert>
);

export const AddressBlock: React.FC<{ address?: ShopAddress | null }> = ({ address }) => {
    if (!address) return <Typography color="text.secondary">No shipping address.</Typography>;
    const cityLine = [address.city, [address.state, address.postalCode].filter(Boolean).join(' ')].filter(Boolean).join(', ');
    return (
        <Typography component="div" variant="body2">
            {[address.name, address.line1, address.line2, cityLine, address.country].filter(Boolean).map(line => (
                <div key={line as string}>{line}</div>
            ))}
        </Typography>
    );
};

const TotalRow: React.FC<{ label: string; value: string; bold?: boolean; color?: string }> = ({ label, value, bold, color }) => (
    <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" sx={{ fontWeight: bold ? 700 : 400, color }}>{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: bold ? 700 : 400, color }}>{value}</Typography>
    </Stack>
);

export const OrderTotals: React.FC<{ order: ShopOrder }> = ({ order }) => (
    <Stack spacing={0.5}>
        <TotalRow label={`Subtotal (${order.cardCount} cards)`} value={formatMoney(order.subtotalCents)} />
        {order.discountCents > 0 && (
            <TotalRow label={`Quantity discount (${formatPercent(order.discountPercent)})`} value={`-${formatMoney(order.discountCents)}`} color="success.main" />
        )}
        <TotalRow label={`Shipping${order.shippingMethod ? ` - ${order.shippingMethod}` : ''}`} value={formatMoney(order.shippingCents)} />
        {order.taxCents > 0 && <TotalRow label="Tax" value={formatMoney(order.taxCents)} />}
        <Divider />
        <TotalRow label="Total" value={formatMoney(order.totalCents)} bold />
    </Stack>
);

/** Line items of an order. Admins get links to the card files for printing. */
export const OrderItemsTable: React.FC<{ order: ShopOrder; showFiles?: boolean }> = ({ order, showFiles }) => (
    <TableContainer component={Paper} variant="outlined">
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Card</TableCell>
                    <TableCell>Format</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Each</TableCell>
                    <TableCell align="right">Total</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {order.items.map((item, index) => (
                    <TableRow key={`${item.armyCardFileId ?? 'x'}-${index}`}>
                        <TableCell>
                            {showFiles && item.filePath
                                ? <a href={item.filePath} target="_blank" rel="noopener noreferrer">{item.unitName}</a>
                                : item.unitName}
                            {item.creator && <Typography component="span" variant="caption" color="text.secondary"> ({item.creator.toUpperCase()})</Typography>}
                        </TableCell>
                        <TableCell>{item.formatName}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{formatMoney(item.unitPriceCents)}</TableCell>
                        <TableCell align="right">{formatMoney(item.lineTotalCents)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
);
