import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    IconButton,
    LinearProgress,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartItem, ShopQuote } from '../../models/shop';
import {
    CART_CHANGED_EVENT,
    MAX_QUANTITY_PER_LINE,
    clearCart,
    createCheckout,
    formatDays,
    formatMoney,
    formatPercent,
    getCart,
    getErrorMessages,
    getQuote,
    removeFromCart,
    setCartQuantity,
} from '../../services/shop-service';
import { Loading, ShopClosedBanner } from './shop-parts';
import './shop.scss';

const ShopCart: React.FC = () => {
    const [cart, setCart] = useState<CartItem[]>(getCart);
    const [quote, setQuote] = useState<ShopQuote | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string[] | null>(null);
    const [notices, setNotices] = useState<string[]>([]);
    const [checkingOut, setCheckingOut] = useState(false);
    const requestId = useRef(0);

    const refresh = useCallback(async (items: CartItem[]) => {
        const id = ++requestId.current;
        if (items.length === 0) {
            setQuote(null);
            setLoading(false);
            return;
        }
        try {
            const result = await getQuote(items);
            if (id !== requestId.current) return; // a newer cart change is already being priced
            setQuote(result);
            setError(null);
            if (result.invalidFileIds.length > 0) {
                // Cards that left the catalog are dropped from the saved cart; the message explains why.
                setNotices(result.errors);
                removeFromCart(result.invalidFileIds);
            }
        } catch (err) {
            if (id === requestId.current) setError(getErrorMessages(err, 'Failed to price your cart.'));
        } finally {
            if (id === requestId.current) setLoading(false);
        }
    }, []);

    useEffect(() => {
        const onCartChanged = () => setCart(getCart());
        window.addEventListener(CART_CHANGED_EVENT, onCartChanged);
        return () => window.removeEventListener(CART_CHANGED_EVENT, onCartChanged);
    }, []);

    // Re-price shortly after the last change so typing a quantity doesn't send a request per keystroke.
    useEffect(() => {
        const timer = window.setTimeout(() => refresh(cart), 300);
        return () => window.clearTimeout(timer);
    }, [cart, refresh]);

    const handleCheckout = async () => {
        try {
            setCheckingOut(true);
            setError(null);
            const url = await createCheckout(cart);
            window.location.assign(url);
        } catch (err) {
            setError(getErrorMessages(err, 'Checkout could not be started. Please try again.'));
            setCheckingOut(false);
        }
    };

    if (loading) return <Loading />;

    const quantityErrors = quote?.errors.filter(x => !notices.includes(x)) ?? [];
    const storeOpen = quote?.store?.isOpen ?? true;
    const canCheckout = !!quote && storeOpen && quote.cardCount > 0 && quote.errors.length === 0 && !checkingOut;

    return (
        <div className="container-fluid shop">
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h4">Your Cart</Typography>
                <Button component={Link} to="/shop">Continue shopping</Button>
            </Stack>

            <ShopClosedBanner store={quote?.store} />

            {notices.length > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }} onClose={() => setNotices([])}>
                    {notices.map(x => <div key={x}>{x}</div>)}
                </Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error.map(x => <div key={x}>{x}</div>)}
                </Alert>
            )}

            {(!quote || quote.lines.length === 0) ? (
                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
                    <Typography sx={{ mb: 2 }}>Your cart is empty.</Typography>
                    <Button variant="contained" component={Link} to="/shop">Browse cards</Button>
                </Paper>
            ) : (
                <div className="row gy-3">
                    <div className="col-lg-8">
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell />
                                        <TableCell>Card</TableCell>
                                        <TableCell align="right">Each</TableCell>
                                        <TableCell align="center">Qty</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                        <TableCell />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {quote.lines.map(line => {
                                        const cartQuantity = cart.find(x => x.armyCardFileId === line.armyCardFileId)?.quantity ?? line.quantity;
                                        return (
                                            <TableRow key={line.armyCardFileId}>
                                                <TableCell sx={{ width: 72 }}>
                                                    {line.thumb && <img className="shop-cart-thumb" src={line.thumb} alt="" loading="lazy" />}
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{line.unitName}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{line.formatName}</Typography>
                                                </TableCell>
                                                <TableCell align="right">{formatMoney(line.unitPriceCents)}</TableCell>
                                                <TableCell align="center">
                                                    <QuantityInput
                                                        value={cartQuantity}
                                                        label={`Quantity of ${line.unitName}`}
                                                        onChange={value => setCartQuantity(line.armyCardFileId, value)}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">{formatMoney(line.lineTotalCents)}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton aria-label={`Remove ${line.unitName}`} size="small" onClick={() => removeFromCart([line.armyCardFileId])}>
                                                        ✕
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Button color="error" size="small" sx={{ mt: 1 }} onClick={() => clearCart()}>Empty cart</Button>
                    </div>

                    <div className="col-lg-4">
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>Order summary</Typography>
                            <Stack spacing={0.5}>
                                {quote.formats.map(format => (
                                    <SummaryRow
                                        key={format.formatCode}
                                        label={`${format.formatName} × ${format.quantity}`}
                                        value={formatMoney(format.subtotalCents)}
                                    />
                                ))}
                                <Divider sx={{ my: 0.5 }} />
                                <SummaryRow label={`Subtotal (${quote.cardCount} cards)`} value={formatMoney(quote.subtotalCents)} />
                                {quote.discountCents > 0 && (
                                    <SummaryRow
                                        label={`Quantity discount (${formatPercent(quote.discountPercent)})`}
                                        value={`-${formatMoney(quote.discountCents)}`}
                                        color="success.main"
                                    />
                                )}
                                <SummaryRow label="Shipping" value="Calculated at checkout" muted />
                                <Divider sx={{ my: 0.5 }} />
                                <SummaryRow label="Total before shipping" value={formatMoney(quote.totalCents)} bold />
                            </Stack>

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                {`Made to order: estimated production time is ${formatDays(quote.turnaroundMinDays, quote.turnaroundMaxDays)}, then shipping.`}
                            </Typography>

                            {quantityErrors.length > 0 && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {quantityErrors.map(x => <div key={x}>{x}</div>)}
                                </Alert>
                            )}

                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                sx={{ mt: 2 }}
                                disabled={!canCheckout}
                                onClick={handleCheckout}
                            >
                                {checkingOut
                                    ? <CircularProgress size={24} color="inherit" />
                                    : storeOpen ? '🔒 Secure checkout with Stripe' : 'Checkout is closed'}
                            </Button>
                            <SecureCheckoutNotice />
                        </Paper>
                        {(quote.discountTiers?.length ?? 0) > 0 && <DiscountProgress quote={quote} />}
                        <Box sx={{ mt: 1 }}>
                            <Link to="/shop/about">Shipping, turnaround and refund policy</Link>
                        </Box>
                    </div>
                </div>
            )}
        </div>
    );
};

/** Explains that payment happens on Stripe's page, so customers know their card details are safe. */
const SecureCheckoutNotice: React.FC = () => (
    <Box sx={{ mt: 1.5, p: 1.5, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>🔒 Your payment is handled by Stripe</Typography>
        <Typography variant="caption" component="div" color="text.secondary">
            Checkout takes you to Stripe's secure payment page, where you enter your shipping address and payment details.
            Stripe processes payments for millions of businesses and is certified to the highest level of the card
            industry's security standard (PCI DSS Level 1). Your card number goes straight to Stripe and is never seen or
            stored by Heroscape Builder.
        </Typography>
    </Box>
);

/**
 * Every quantity discount tier with progress toward the next one. Discounts count all cards across all formats,
 * so a customer close to a tier is nudged to top up their order.
 */
const DiscountProgress: React.FC<{ quote: ShopQuote }> = ({ quote }) => {
    const tiers = [...quote.discountTiers].sort((a, b) => a.minQuantity - b.minQuantity);
    const next = quote.nextTier;
    const previousMin = tiers.filter(x => x.minQuantity <= quote.cardCount).pop()?.minQuantity ?? 0;
    const progress = next ? Math.min(100, ((quote.cardCount - previousMin) / (next.minQuantity - previousMin)) * 100) : 100;
    // Lower bound: the next tier's percent applied to what is already in the cart, minus the current discount.
    const extraSavingsCents = next ? Math.round(quote.subtotalCents * next.percentOff / 100) - quote.discountCents : 0;
    const close = !!next && next.cardsNeeded <= Math.max(5, Math.ceil(next.minQuantity * 0.25));

    return (
        <Paper variant="outlined" sx={{ p: 2, mt: 2, borderColor: close ? 'success.main' : undefined, borderWidth: close ? 2 : 1 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Quantity discounts</Typography>
            {next ? (
                <>
                    <Typography variant="body2" sx={{ fontWeight: close ? 700 : 400, color: close ? 'success.dark' : undefined }}>
                        {close
                            ? `You're only ${next.cardsNeeded} card${next.cardsNeeded === 1 ? '' : 's'} away from ${formatPercent(next.percentOff)} off!`
                            : `Add ${next.cardsNeeded} more card${next.cardsNeeded === 1 ? '' : 's'} to get ${formatPercent(next.percentOff)} off.`}
                    </Typography>
                    {extraSavingsCents > 0 && (
                        <Typography variant="caption" color="text.secondary" component="div">
                            {`That saves at least ${formatMoney(extraSavingsCents)} more on what's already in your cart.`}
                        </Typography>
                    )}
                    <LinearProgress variant="determinate" value={progress} color="success" sx={{ height: 8, borderRadius: 4, my: 1 }} />
                </>
            ) : (
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.dark', mb: 1 }}>
                    {`You've unlocked the biggest discount: ${formatPercent(quote.discountPercent)} off!`}
                </Typography>
            )}
            <Stack spacing={0.5}>
                {tiers.map(tier => {
                    const reached = quote.cardCount >= tier.minQuantity;
                    const applied = reached && tier.percentOff === quote.discountPercent;
                    return (
                        <Stack key={tier.minQuantity} direction="row" justifyContent="space-between">
                            <Typography variant="body2" sx={{ fontWeight: applied ? 700 : 400, color: reached ? 'success.dark' : 'text.secondary' }}>
                                {`${reached ? '✓' : '○'} ${tier.minQuantity}+ cards`}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: applied ? 700 : 400, color: reached ? 'success.dark' : 'text.secondary' }}>
                                {`${formatPercent(tier.percentOff)} off${applied ? ' (applied)' : ''}`}
                            </Typography>
                        </Stack>
                    );
                })}
            </Stack>
            <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 1 }}>
                Every card counts toward the discount, in any format and any mix.
            </Typography>
            <Button size="small" component={Link} to="/shop" sx={{ mt: 1 }}>Add more cards</Button>
        </Paper>
    );
};

const SummaryRow: React.FC<{ label: string; value: string; bold?: boolean; muted?: boolean; color?: string }> = ({ label, value, bold, muted, color }) => (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Typography variant="body2" sx={{ fontWeight: bold ? 700 : 400, color: color ?? (muted ? 'text.secondary' : undefined) }}>{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: bold ? 700 : 400, color: color ?? (muted ? 'text.secondary' : undefined), textAlign: 'right' }}>{value}</Typography>
    </Stack>
);

/** Number box that only commits whole numbers from 1 to the per-line maximum. */
const QuantityInput: React.FC<{ value: number; label: string; onChange: (value: number) => void }> = ({ value, label, onChange }) => {
    const [text, setText] = useState(String(value));
    useEffect(() => setText(String(value)), [value]);

    const parsed = Number(text);
    const valid = Number.isInteger(parsed) && parsed >= 1 && parsed <= MAX_QUANTITY_PER_LINE;

    return (
        <TextField
            type="number"
            size="small"
            value={text}
            error={!valid}
            onChange={e => {
                setText(e.target.value);
                const next = Number(e.target.value);
                if (Number.isInteger(next) && next >= 1 && next <= MAX_QUANTITY_PER_LINE) onChange(next);
            }}
            onBlur={() => { if (!valid) setText(String(value)); }}
            inputProps={{ min: 1, max: MAX_QUANTITY_PER_LINE, 'aria-label': label }}
            sx={{ width: 80 }}
        />
    );
};

export default ShopCart;
