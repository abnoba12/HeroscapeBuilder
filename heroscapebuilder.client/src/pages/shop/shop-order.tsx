import { Alert, Button, Paper, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShopOrder } from '../../models/shop';
import { formatDate, formatDays, getErrorMessages, getOrder, isNotFound } from '../../services/shop-service';
import { AddressBlock, Loading, OrderItemsTable, OrderTotals, StatusChip } from './shop-parts';

const STEPS = ['Paid', 'In production', 'Shipped'];

/** Index of the step the order has reached. */
const stepIndex = (status: ShopOrder['status']): number => {
    switch (status) {
        case 'InProduction': return 1;
        case 'Shipped': return 2;
        default: return 0;
    }
};

/** Status, items, totals and shipping of an order. Shared by the order page and checkout success page. */
export const OrderDetails: React.FC<{ order: ShopOrder }> = ({ order }) => {
    const closed = order.status === 'Cancelled' || order.status === 'Refunded';
    return (
        <Stack spacing={2}>
            <Paper variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
                    <Typography variant="h6">{`Order ${order.orderNumber}`}</Typography>
                    <StatusChip status={order.status} />
                    <Typography variant="body2" color="text.secondary">{`Placed ${formatDate(order.paidAt ?? order.createdAt)}`}</Typography>
                </Stack>
                {closed ? (
                    <Alert severity={order.status === 'Refunded' ? 'info' : 'warning'}>
                        {order.status === 'Refunded' ? 'This order was refunded.' : 'This order was cancelled.'}
                    </Alert>
                ) : (
                    <Stepper activeStep={stepIndex(order.status)} alternativeLabel>
                        {STEPS.map((label, index) => (
                            <Step key={label} completed={index <= stepIndex(order.status)}><StepLabel>{label}</StepLabel></Step>
                        ))}
                    </Stepper>
                )}
                {!closed && order.status !== 'Shipped' && order.turnaroundMaxDays > 0 && (
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        {`Your cards are made to order. Estimated production time: ${formatDays(order.turnaroundMinDays, order.turnaroundMaxDays)} from payment, then shipping.`}
                    </Typography>
                )}
                {order.status === 'Shipped' && (
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        {`Shipped ${formatDate(order.shippedAt)}`}
                        {order.carrier ? ` via ${order.carrier}` : ''}
                        {order.trackingNumber ? ` - tracking number ${order.trackingNumber}` : ''}
                    </Typography>
                )}
            </Paper>

            <div className="row gy-3">
                <div className="col-lg-8">
                    <OrderItemsTable order={order} />
                </div>
                <div className="col-lg-4">
                    <Stack spacing={2}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <OrderTotals order={order} />
                        </Paper>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Ship to</Typography>
                            <AddressBlock address={order.shipTo} />
                        </Paper>
                    </Stack>
                </div>
            </div>
        </Stack>
    );
};

const ShopOrderPage: React.FC = () => {
    const { accessKey } = useParams();
    const [order, setOrder] = useState<ShopOrder | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!accessKey) return;
        getOrder(accessKey)
            .then(setOrder)
            .catch(err => setError(isNotFound(err)
                ? 'We could not find that order. Check that the link is complete.'
                : getErrorMessages(err, 'Failed to load the order.')[0]));
    }, [accessKey]);

    if (error) {
        return (
            <div className="container-fluid">
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                <Button component={Link} to="/shop">Go to the shop</Button>
            </div>
        );
    }
    if (!order) return <Loading />;

    return (
        <div className="container-fluid">
            <OrderDetails order={order} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Questions about your order? See <Link to="/shop/about">how ordering works</Link> for how to contact us, and include your order number.
            </Typography>
        </div>
    );
};

export default ShopOrderPage;
