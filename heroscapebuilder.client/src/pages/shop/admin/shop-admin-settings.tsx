import {
    Alert,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    Paper,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCreatorInfo } from '../../../models/creator';
import { ShopSettings, ShopStoreStatus } from '../../../models/shop';
import {
    adminGetSettings,
    adminSaveSettings,
    adminSendTestEmail,
    adminSetStoreStatus,
    formatCalendarDate,
    getErrorMessages,
} from '../../../services/shop-service';
import { Loading } from '../shop-parts';

const toDollars = (cents: number): string => (cents / 100).toFixed(2);
const toCents = (dollars: string): number => Math.round(Number(dollars) * 100);
const toInt = (value: string): number => parseInt(value, 10) || 0;

const Section: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="h6">{title}</Typography>
        {description && <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{description}</Typography>}
        {children}
    </Paper>
);

const ShopAdminSettings: React.FC = () => {
    const [settings, setSettings] = useState<ShopSettings | null>(null);
    // Prices are edited as dollar strings so partially typed values ("3.") don't get reformatted mid-edit.
    const [prices, setPrices] = useState<Record<string, string>>({});
    const [shippingPrices, setShippingPrices] = useState<string[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [saved, setSaved] = useState(false);
    const [busy, setBusy] = useState(false);

    const load = (value: ShopSettings) => {
        setSettings(value);
        setPrices(Object.fromEntries(value.formats.map(x => [x.code, toDollars(x.unitPriceCents)])));
        setShippingPrices(value.shippingOptions.map(x => toDollars(x.amountCents)));
    };

    useEffect(() => {
        adminGetSettings()
            .then(load)
            .catch(err => setErrors(getErrorMessages(err, 'Failed to load shop settings.')));
    }, []);

    if (!settings) return errors.length > 0 ? <Alert severity="error">{errors.join(' ')}</Alert> : <Loading />;

    const update = (changes: Partial<ShopSettings>) => setSettings({ ...settings, ...changes });

    const handleSave = async () => {
        try {
            setBusy(true);
            setErrors([]);
            load(await adminSaveSettings({
                ...settings,
                formats: settings.formats.map(x => ({ ...x, unitPriceCents: toCents(prices[x.code] ?? '0') })),
                shippingOptions: settings.shippingOptions.map((x, i) => ({ ...x, amountCents: toCents(shippingPrices[i] ?? '0') })),
            }));
            setSaved(true);
            window.setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            setErrors(getErrorMessages(err, 'Failed to save shop settings.'));
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="container-fluid">
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }} flexWrap="wrap" useFlexGap spacing={1}>
                <Typography variant="h4">Shop Settings</Typography>
                <Button component={Link} to="/shop/admin/orders">Orders</Button>
            </Stack>

            <Stack spacing={2}>
                {!settings.stripeConfigured && (
                    <Alert severity="error">No Stripe secret key is configured, so customers can't check out.</Alert>
                )}
                {settings.stripeConfigured && settings.stripeTestMode && (
                    <Alert severity="warning">Stripe is in test (sandbox) mode. No real payments will be taken.</Alert>
                )}
                {settings.stripeConfigured && !settings.webhookConfigured && (
                    <Alert severity="warning">
                        No Stripe webhook signing secret is configured. Orders are still confirmed when the customer returns from Stripe
                        or, at the latest, by the background check that asks Stripe every 5 minutes. Refunds made in the Stripe dashboard
                        won&apos;t show here until a webhook is set up.
                    </Alert>
                )}

                <StoreStatusSection
                    store={settings.store}
                    onSaved={store => update({ store })}
                />

                <EmailSection configured={settings.emailConfigured} notifyEmail={settings.notifyEmail} />

                <Section title="Card formats" description="Price per card and the production time customers see.">
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Active</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Price ($)</TableCell>
                                    <TableCell>Min days</TableCell>
                                    <TableCell>Max days</TableCell>
                                    <TableCell>Description</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {settings.formats.map((format, i) => {
                                    const setFormat = (changes: Partial<typeof format>) =>
                                        update({ formats: settings.formats.map((x, j) => j === i ? { ...x, ...changes } : x) });
                                    return (
                                        <TableRow key={format.code}>
                                            <TableCell>
                                                <Checkbox checked={format.isActive} onChange={e => setFormat({ isActive: e.target.checked })} inputProps={{ 'aria-label': `${format.code} active` }} />
                                            </TableCell>
                                            <TableCell sx={{ minWidth: 160 }}>
                                                <TextField size="small" value={format.name} onChange={e => setFormat({ name: e.target.value })} helperText={format.code} fullWidth />
                                            </TableCell>
                                            <TableCell>
                                                <TextField size="small" type="number" value={prices[format.code] ?? ''} onChange={e => setPrices({ ...prices, [format.code]: e.target.value })} inputProps={{ min: 0.01, step: 0.25 }} sx={{ width: 100 }} />
                                            </TableCell>
                                            <TableCell>
                                                <TextField size="small" type="number" value={format.turnaroundMinDays} onChange={e => setFormat({ turnaroundMinDays: toInt(e.target.value) })} sx={{ width: 80 }} />
                                            </TableCell>
                                            <TableCell>
                                                <TextField size="small" type="number" value={format.turnaroundMaxDays} onChange={e => setFormat({ turnaroundMaxDays: toInt(e.target.value) })} sx={{ width: 80 }} />
                                            </TableCell>
                                            <TableCell sx={{ minWidth: 240 }}>
                                                <TextField size="small" value={format.description ?? ''} onChange={e => setFormat({ description: e.target.value })} fullWidth multiline />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Section>

                <Section title="Quantity discounts" description="Based on the total number of cards in an order, across all formats. The highest tier reached applies.">
                    <Stack spacing={1}>
                        {settings.discountTiers.map((tier, i) => (
                            <Stack key={i} direction="row" spacing={1} alignItems="center">
                                <TextField size="small" type="number" label="Min cards" value={tier.minQuantity}
                                    onChange={e => update({ discountTiers: settings.discountTiers.map((x, j) => j === i ? { ...x, minQuantity: toInt(e.target.value) } : x) })}
                                    sx={{ width: 120 }} />
                                <TextField size="small" type="number" label="% off" value={tier.percentOff}
                                    onChange={e => update({ discountTiers: settings.discountTiers.map((x, j) => j === i ? { ...x, percentOff: Number(e.target.value) } : x) })}
                                    sx={{ width: 100 }} />
                                <IconButton aria-label="Remove tier" onClick={() => update({ discountTiers: settings.discountTiers.filter((_, j) => j !== i) })}>✕</IconButton>
                            </Stack>
                        ))}
                        <div>
                            <Button size="small" onClick={() => update({ discountTiers: [...settings.discountTiers, { minQuantity: 0, percentOff: 0 }] })}>Add tier</Button>
                        </div>
                    </Stack>
                </Section>

                <Section title="Shipping options" description="Shown on the Stripe checkout page (at most 5 active). Days are delivery time after the order ships.">
                    <Stack spacing={1}>
                        {settings.shippingOptions.map((option, i) => {
                            const setOption = (changes: Partial<typeof option>) =>
                                update({ shippingOptions: settings.shippingOptions.map((x, j) => j === i ? { ...x, ...changes } : x) });
                            return (
                                <Stack key={i} direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems={{ md: 'center' }}>
                                    <FormControlLabel control={<Switch checked={option.isActive} onChange={e => setOption({ isActive: e.target.checked })} />} label="Active" />
                                    <TextField size="small" label="Name" value={option.name} onChange={e => setOption({ name: e.target.value })} sx={{ minWidth: 240 }} />
                                    <TextField size="small" type="number" label="Price ($)" value={shippingPrices[i] ?? ''}
                                        onChange={e => setShippingPrices(shippingPrices.map((x, j) => j === i ? e.target.value : x))} sx={{ width: 110 }} />
                                    <TextField size="small" type="number" label="Min days" value={option.minBusinessDays} onChange={e => setOption({ minBusinessDays: toInt(e.target.value) })} sx={{ width: 100 }} />
                                    <TextField size="small" type="number" label="Max days" value={option.maxBusinessDays} onChange={e => setOption({ maxBusinessDays: toInt(e.target.value) })} sx={{ width: 100 }} />
                                    <IconButton aria-label="Remove shipping option" onClick={() => {
                                        update({ shippingOptions: settings.shippingOptions.filter((_, j) => j !== i) });
                                        setShippingPrices(shippingPrices.filter((_, j) => j !== i));
                                    }}>✕</IconButton>
                                </Stack>
                            );
                        })}
                        <div>
                            <Button size="small" onClick={() => {
                                update({ shippingOptions: [...settings.shippingOptions, { id: 0, name: '', amountCents: 0, minBusinessDays: 3, maxBusinessDays: 7, isActive: true }] });
                                setShippingPrices([...shippingPrices, '0.00']);
                            }}>Add shipping option</Button>
                        </div>
                    </Stack>
                </Section>

                <Section title="Creators" description="Only cards from creators switched on here can be ordered.">
                    <Stack>
                        {settings.creators.map((creator, i) => (
                            <FormControlLabel
                                key={creator.creator}
                                control={<Switch checked={creator.isSellable} onChange={e => update({ creators: settings.creators.map((x, j) => j === i ? { ...x, isSellable: e.target.checked } : x) })} />}
                                label={`${getCreatorInfo(creator.creator)?.label ?? creator.creator} (${creator.fileCount} card files)`}
                            />
                        ))}
                    </Stack>
                </Section>

                {errors.length > 0 && (
                    <Alert severity="error" onClose={() => setErrors([])}>
                        {errors.map(x => <div key={x}>{x}</div>)}
                    </Alert>
                )}

                <div>
                    <Button variant="contained" size="large" onClick={handleSave} disabled={busy} color={saved ? 'success' : 'primary'}>
                        {saved ? 'Saved' : 'Save settings'}
                    </Button>
                </div>
            </Stack>
        </div>
    );
};

/**
 * The shop's open/closed switch. Saved on its own (not with the rest of the settings) so it can be flipped quickly.
 */
const StoreStatusSection: React.FC<{ store: ShopStoreStatus; onSaved: (store: ShopStoreStatus) => void }> = ({ store, onSaved }) => {
    const [draft, setDraft] = useState<ShopStoreStatus>(store);
    const [busy, setBusy] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [saved, setSaved] = useState(false);

    useEffect(() => setDraft(store), [store]);

    const save = async (next: ShopStoreStatus) => {
        try {
            setBusy(true);
            setErrors([]);
            const result = await adminSetStoreStatus(next);
            onSaved(result);
            setSaved(true);
            window.setTimeout(() => setSaved(false), 2000);
        } catch (err) {
            setErrors(getErrorMessages(err, 'Failed to update the shop status.'));
        } finally {
            setBusy(false);
        }
    };

    const dirty = (draft.closedMessage ?? '') !== (store.closedMessage ?? '') || (draft.reopensOn ?? '') !== (store.reopensOn ?? '');

    return (
        <Paper variant="outlined" sx={{ p: 2, borderWidth: 2, borderColor: store.isOpen ? 'success.main' : 'error.main' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={1}>
                <div>
                    <Typography variant="h6">{store.isOpen ? '🟢 The shop is OPEN' : '🔴 The shop is CLOSED'}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {store.isOpen
                            ? 'Customers can place orders.'
                            : `Customers can browse and fill carts but can't check out.${store.reopensOn ? ` Showing a reopen date of ${formatCalendarDate(store.reopensOn)}.` : ''}`}
                    </Typography>
                </div>
                <Button
                    variant="contained"
                    size="large"
                    color={store.isOpen ? 'error' : 'success'}
                    disabled={busy}
                    onClick={() => save({ ...draft, isOpen: !store.isOpen })}
                >
                    {store.isOpen ? 'Close the shop' : 'Open the shop'}
                </Button>
            </Stack>
            {store.isOpen && (
                <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 1 }}>
                    Closing also cancels any checkout a customer has open on Stripe, so no payment can come in after you close.
                </Typography>
            )}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
                <TextField
                    size="small"
                    label="Message shown while closed"
                    placeholder="e.g. On vacation until the 15th - thanks for your patience!"
                    value={draft.closedMessage ?? ''}
                    onChange={e => setDraft({ ...draft, closedMessage: e.target.value })}
                    inputProps={{ maxLength: 500 }}
                    sx={{ flex: 1 }}
                />
                <TextField
                    size="small"
                    type="date"
                    label="Expected reopen date (optional)"
                    value={draft.reopensOn ?? ''}
                    onChange={e => setDraft({ ...draft, reopensOn: e.target.value || null })}
                    InputLabelProps={{ shrink: true }}
                    helperText="Shown to customers only; the shop won't reopen by itself."
                />
                <div>
                    <Button variant="outlined" disabled={busy || !dirty} onClick={() => save({ ...draft, isOpen: store.isOpen })} color={saved ? 'success' : 'primary'}>
                        {saved ? 'Saved' : 'Save message'}
                    </Button>
                </div>
            </Stack>
            {errors.length > 0 && <Alert severity="error" sx={{ mt: 2 }}>{errors.map(x => <div key={x}>{x}</div>)}</Alert>}
        </Paper>
    );
};

/** Shows where order emails go, with a test button so a broken setup is caught before a real order. */
const EmailSection: React.FC<{ configured: boolean; notifyEmail?: string | null }> = ({ configured, notifyEmail }) => {
    const [busy, setBusy] = useState(false);
    const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

    const sendTest = async () => {
        try {
            setBusy(true);
            setResult(null);
            await adminSendTestEmail();
            setResult({ ok: true, message: `Test email sent to ${notifyEmail}. Check your inbox (and spam folder).` });
        } catch (err) {
            setResult({ ok: false, message: getErrorMessages(err, 'The test email failed.').join(' ') });
        } finally {
            setBusy(false);
        }
    };

    return (
        <Section title="New order emails">
            {configured ? (
                <Typography variant="body2" sx={{ mb: 1 }}>
                    {`Every paid order is emailed to ${notifyEmail}. If sending fails it is retried every 5 minutes until it goes through.`}
                </Typography>
            ) : (
                <Alert severity="error" sx={{ mb: 1 }}>
                    Email is not configured, so you will NOT be told about new orders. Add EmailUsername, EmailPassword and
                    ShopNotifyEmail to the HeroscapeBuilder environment config, then restart the server.
                </Alert>
            )}
            <Button variant="outlined" onClick={sendTest} disabled={busy || !configured}>Send test email</Button>
            {result && <Alert severity={result.ok ? 'success' : 'error'} sx={{ mt: 1 }}>{result.message}</Alert>}
        </Section>
    );
};

export default ShopAdminSettings;
