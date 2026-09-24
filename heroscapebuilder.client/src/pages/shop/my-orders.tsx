import { Alert, Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopOrderSummary } from '../../models/shop';
import { formatDate, formatMoney, getErrorMessages, getMyOrders } from '../../services/shop-service';
import { Loading, StatusChip } from './shop-parts';

const MyOrders: React.FC = () => {
    const [orders, setOrders] = useState<ShopOrderSummary[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getMyOrders()
            .then(setOrders)
            .catch(err => setError(getErrorMessages(err, 'Failed to load your orders.')[0]));
    }, []);

    if (error) return <Alert severity="error">{error}</Alert>;
    if (!orders) return <Loading />;

    return (
        <div className="container-fluid">
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h4">My Orders</Typography>
                <Button variant="contained" component={Link} to="/shop">Shop cards</Button>
            </Stack>
            {orders.length === 0 ? (
                <Typography color="text.secondary">
                    You haven't placed any orders while signed in. Orders placed as a guest are found through the link on their confirmation page.
                </Typography>
            ) : (
                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Order</TableCell>
                                <TableCell>Placed</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Cards</TableCell>
                                <TableCell align="right">Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map(order => (
                                <TableRow key={order.accessKey} hover>
                                    <TableCell><Link to={`/shop/order/${order.accessKey}`}>{order.orderNumber}</Link></TableCell>
                                    <TableCell>{formatDate(order.paidAt ?? order.createdAt)}</TableCell>
                                    <TableCell><StatusChip status={order.status} /></TableCell>
                                    <TableCell align="right">{order.cardCount}</TableCell>
                                    <TableCell align="right">{formatMoney(order.totalCents)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default MyOrders;
