import {
    Alert,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShopAdminOrder } from '../../../models/shop';
import {
    STATUS_LABELS,
    adminGetOrder,
    adminRefundOrder,
    adminUpdateOrder,
    formatDate,
    formatMoney,
    getErrorMessages,
    orderUrl,
} from '../../../services/shop-service';
import { AddressBlock, Loading, OrderItemsTable, OrderTotals, StatusChip } from '../shop-parts';

/** Statuses the owner sets by hand; the rest are driven by Stripe (matches OrderStatus.AdminSettable). */
const ADMIN_STATUSES = ['Paid', 'InProduction', 'Shipped', 'Cancelled'] as const;

const ShopAdminOrderPage: React.FC = () => {
    const { id } = useParams();
    const orderId = Number(id);
    const [order, setOrder] = useState<ShopAdminOrder | null>(null);
    const [status, setStatus] = useState('');
    const [carrier, setCarrier] = useState('');
    const [tracking, setTracking] = useState('');
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [saved, setSaved] = useState(false);
    const [busy, setBusy] = useState(false);
    const [confirmRefund, setConfirmRefund] = useState(false);

    const load = (value: ShopAdminOrder) => {
        setOrder(value);
        setStatus(value.status);
        setCarrier(value.carrier ?? '');
        setTracking(value.trackingNumber ?? '');
        setNotes(value.adminNotes ?? '');
    };

    useEffect(() => {
        adminGetOrder(orderId)
            .then(load)
            .catch(err => setErrors(getErrorMessages(err, 'Failed to load the order.')));
    }, [orderId]);

    const handleSave = async () => {
        try {
            setBusy(true);
            setErrors([]);
            load(await adminUpdateOrder(orderId, { status, carrier, trackingNumber: tracking, adminNotes: notes }));
            setSaved(true);
            window.setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            setErrors(getErrorMessages(err, 'Failed to save the order.'));
        } finally {
            setBusy(false);
        }
    };

    const handleRefund = async () => {
        try {
            setBusy(true);
            setErrors([]);
            load(await adminRefundOrder(orderId));
        } catch (err) {
            setErrors(getErrorMessages(err, 'The refund failed.'));
        } finally {
            setBusy(false);
            setConfirmRefund(false);
        }
    };

    if (!order) {
        return errors.length > 0 ? <Alert severity="error">{errors.join(' ')}</Alert> : <Loading />;
    }

    const editable = (ADMIN_STATUSES as readonly string[]).includes(order.status);

    return (
        <div className="container-fluid">
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
                <Button component={Link} to="/shop/admin/orders">← Orders</Button>
                <Typography variant="h4">{order.orderNumber}</Typography>
                <StatusChip status={order.status} />
                <Typography variant="body2" color="text.secondary">
                    {`Paid ${formatDate(order.paidAt) || '-'} · Updated ${formatDate(order.updatedAt)}`}
                </Typography>
            </Stack>

            {errors.length > 0 && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrors([])}>
                    {errors.map(x => <div key={x}>{x}</div>)}
                </Alert>
            )}

            <div className="row gy-3">
                <div className="col-lg-8">
                    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>To make</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {order.formats.map(format => (
                                <Chip key={format.formatCode} color="primary" label={`${format.quantity} × ${format.formatName}`} />
                            ))}
                        </Stack>
                    </Paper>
                    <OrderItemsTable order={order} showFiles />
                </div>

                <div className="col-lg-4">
                    <Stack spacing={2}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Fulfillment</Typography>
                            {editable ? (
                                <Stack spacing={2}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel id="order-status">Status</InputLabel>
                                        <Select labelId="order-status" label="Status" value={status} onChange={e => setStatus(e.target.value)}>
                                            {ADMIN_STATUSES.map(x => <MenuItem key={x} value={x}>{STATUS_LABELS[x]}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    <TextField size="small" label="Carrier" value={carrier} onChange={e => setCarrier(e.target.value)} placeholder="USPS" />
                                    <TextField size="small" label="Tracking number" value={tracking} onChange={e => setTracking(e.target.value)} />
                                    <TextField size="small" label="Private notes" value={notes} onChange={e => setNotes(e.target.value)} multiline minRows={3} helperText="Only visible to admins." />
                                    <Button variant="contained" onClick={handleSave} disabled={busy} color={saved ? 'success' : 'primary'}>
                                        {saved ? 'Saved' : 'Save'}
                                    </Button>
                                    {status === 'Cancelled' && order.status !== 'Cancelled' && (
                                        <Alert severity="warning">Cancelling does not refund the customer. Use Refund below to return their money.</Alert>
                                    )}
                                </Stack>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    {`${STATUS_LABELS[order.status]} orders are managed by Stripe.`}
                                </Typography>
                            )}
                        </Paper>

                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <OrderTotals order={order} />
                        </Paper>

                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Customer</Typography>
                            <Typography variant="body2">{order.customerName ?? '-'}</Typography>
                            {order.email && <Typography variant="body2"><a href={`mailto:${order.email}`}>{order.email}</a></Typography>}
                            {order.phone && <Typography variant="body2">{order.phone}</Typography>}
                            {order.accountEmail && order.accountEmail !== order.email && (
                                <Typography variant="caption" color="text.secondary">{`Account: ${order.accountEmail}`}</Typography>
                            )}
                            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Ship to</Typography>
                            <AddressBlock address={order.shipTo} />
                            <Typography variant="subtitle2" sx={{ mt: 2 }}>Customer status link</Typography>
                            <Typography variant="caption" sx={{ wordBreak: 'break-all' }}>
                                <a href={orderUrl(order.accessKey)} target="_blank" rel="noopener noreferrer">{orderUrl(order.accessKey)}</a>
                            </Typography>
                        </Paper>

                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Payment</Typography>
                            <Typography variant="caption" component="div" sx={{ wordBreak: 'break-all' }}>{`Payment intent: ${order.stripePaymentIntentId ?? '-'}`}</Typography>
                            <Typography variant="caption" component="div" sx={{ wordBreak: 'break-all', mb: 1 }}>{`Checkout session: ${order.stripeCheckoutSessionId ?? '-'}`}</Typography>
                            {editable && order.stripePaymentIntentId && (
                                <Button color="error" variant="outlined" size="small" onClick={() => setConfirmRefund(true)} disabled={busy}>
                                    {`Refund ${formatMoney(order.totalCents)}`}
                                </Button>
                            )}
                        </Paper>
                    </Stack>
                </div>
            </div>

            <Dialog open={confirmRefund} onClose={() => !busy && setConfirmRefund(false)}>
                <DialogTitle>{`Refund ${order.orderNumber}?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {`This refunds the full ${formatMoney(order.totalCents)} to the customer through Stripe and marks the order Refunded. It can't be undone. For a partial refund, use the Stripe dashboard instead.`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmRefund(false)} disabled={busy}>Keep order</Button>
                    <Button color="error" variant="contained" onClick={handleRefund} disabled={busy}>Refund</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ShopAdminOrderPage;
