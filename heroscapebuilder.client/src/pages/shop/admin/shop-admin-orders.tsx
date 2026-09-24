import { Alert, Button, Paper, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShopOrderSummary } from '../../../models/shop';
import { adminGetOrders, formatDate, formatMoney, getErrorMessages } from '../../../services/shop-service';
import { Loading, StatusChip } from '../shop-parts';

// "" = every placed order; "Abandoned" = checkouts that were never paid.
const FILTERS: { value: string; label: string }[] = [
    { value: 'Paid', label: 'To do' },
    { value: 'InProduction', label: 'In production' },
    { value: 'Shipped', label: 'Shipped' },
    { value: '', label: 'All orders' },
    { value: 'Cancelled', label: 'Cancelled' },
    { value: 'Refunded', label: 'Refunded' },
    { value: 'Abandoned', label: 'Abandoned checkouts' },
];

const ShopAdminOrders: React.FC = () => {
    const [params, setParams] = useSearchParams();
    const status = params.get('status') ?? 'Paid';
    const [orders, setOrders] = useState<ShopOrderSummary[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setOrders(null);
        adminGetOrders(status)
            .then(setOrders)
            .catch(err => setError(getErrorMessages(err, 'Failed to load orders.')[0]));
    }, [status]);

    const totalCards = orders?.reduce((sum, x) => sum + x.cardCount, 0) ?? 0;

    return (
        <div className="container-fluid">
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }} flexWrap="wrap" useFlexGap spacing={1}>
                <Typography variant="h4">Shop Orders</Typography>
                <Button component={Link} to="/shop/admin/settings">Shop settings</Button>
            </Stack>

            <Tabs value={status} onChange={(_, value) => setParams({ status: value })} variant="scrollable" allowScrollButtonsMobile sx={{ mb: 2 }}>
                {FILTERS.map(x => <Tab key={x.value || 'all'} value={x.value} label={x.label} />)}
            </Tabs>

            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

            {!orders ? <Loading /> : orders.length === 0 ? (
                <Typography color="text.secondary">No orders here.</Typography>
            ) : (
                <>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {`${orders.length} order${orders.length === 1 ? '' : 's'}, ${totalCards} cards`}
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Cards</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map(order => (
                                    <TableRow key={order.id} hover>
                                        <TableCell><Link to={`/shop/admin/orders/${order.id}`}>{order.orderNumber}</Link></TableCell>
                                        <TableCell>{formatDate(order.paidAt ?? order.createdAt)}</TableCell>
                                        <TableCell>
                                            {order.customerName ?? '-'}
                                            {order.email && <Typography variant="caption" color="text.secondary" component="div">{order.email}</Typography>}
                                        </TableCell>
                                        <TableCell><StatusChip status={order.status} /></TableCell>
                                        <TableCell align="right">{order.cardCount}</TableCell>
                                        <TableCell align="right">{formatMoney(order.totalCents)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </div>
    );
};

export default ShopAdminOrders;
