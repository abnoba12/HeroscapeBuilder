import { Alert, Button, Paper, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShopOrder } from '../../models/shop';
import { clearCart, completeCheckout, getErrorMessages } from '../../services/shop-service';
import { Loading } from './shop-parts';
import { OrderDetails } from './shop-order';

// Stripe can take a moment to confirm some payments, so an unpaid result is re-checked a few times.
const RETRY_DELAYS_MS = [2000, 3000, 5000, 8000];

const CheckoutSuccess: React.FC = () => {
    const [params] = useSearchParams();
    const sessionId = params.get('session_id');
    const [order, setOrder] = useState<ShopOrder | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [gaveUp, setGaveUp] = useState(false);

    useEffect(() => {
        if (!sessionId) {
            setError('This page is only reached after checkout.');
            return;
        }

        let cancelled = false;
        let timer: number | undefined;

        const check = async (attempt: number) => {
            try {
                const result = await completeCheckout(sessionId);
                if (cancelled) return;
                setOrder(result);
                if (result.status === 'Pending') {
                    if (attempt < RETRY_DELAYS_MS.length) {
                        timer = window.setTimeout(() => check(attempt + 1), RETRY_DELAYS_MS[attempt]);
                    } else {
                        setGaveUp(true);
                    }
                } else {
                    clearCart();
                }
            } catch (err) {
                if (!cancelled) setError(getErrorMessages(err, 'We could not load your order.')[0]);
            }
        };

        check(0);
        return () => {
            cancelled = true;
            window.clearTimeout(timer);
        };
    }, [sessionId]);

    if (error) {
        return (
            <div className="container-fluid">
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                <Button component={Link} to="/shop/cart">Back to cart</Button>
            </div>
        );
    }
    if (!order) return <Loading />;

    if (order.status === 'Pending') {
        return (
            <div className="container-fluid">
                <Paper variant="outlined" sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ mb: 1 }}>Confirming your payment...</Typography>
                    {gaveUp ? (
                        <Typography>
                            {`Stripe hasn't confirmed payment for order ${order.orderNumber} yet. Some payment methods take longer. `}
                            You will get a receipt from Stripe once it goes through. Save this link to check on your order:
                            {' '}<Link to={`/shop/order/${order.accessKey}`}>order status</Link>.
                        </Typography>
                    ) : <Loading />}
                </Paper>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <Stack spacing={2}>
                <Alert severity="success">
                    <Typography variant="h5">{`Thank you! Order ${order.orderNumber} is confirmed.`}</Typography>
                    <Typography variant="body2">
                        {order.email ? `A receipt is on its way to ${order.email}. ` : ''}
                        Bookmark your <Link to={`/shop/order/${order.accessKey}`}>order status page</Link> to follow its progress.
                    </Typography>
                </Alert>
                <OrderDetails order={order} />
            </Stack>
        </div>
    );
};

export default CheckoutSuccess;
