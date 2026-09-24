import {
    Alert,
    Badge,
    Button,
    Card,
    CardActions,
    CardContent,
    FormControl,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCreatorInfo } from '../../models/creator';
import { ShopCatalog, ShopCatalogUnit, ShopFormat } from '../../models/shop';
import {
    CART_CHANGED_EVENT,
    MAX_QUANTITY_PER_LINE,
    addToCart,
    formatMoney,
    getCart,
    getCartCount,
    getCatalog,
    getErrorMessages,
} from '../../services/shop-service';
import { Loading, MadeToOrderNotice } from './shop-parts';
import './shop.scss';

const PAGE_SIZE = 48;

/** File id -> quantity currently in the cart. */
const cartQuantities = (): Map<number, number> => new Map(getCart().map(x => [x.armyCardFileId, x.quantity]));

const ShopCatalogPage: React.FC = () => {
    const [catalog, setCatalog] = useState<ShopCatalog | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [creator, setCreator] = useState('');
    const [formatFilter, setFormatFilter] = useState('');
    const [page, setPage] = useState(1);
    const [inCart, setInCart] = useState<Map<number, number>>(cartQuantities);
    const [cartCount, setCartCount] = useState<number>(getCartCount);

    useEffect(() => {
        getCatalog()
            .then(setCatalog)
            .catch(err => setError(getErrorMessages(err, 'Failed to load the shop.')[0]));
    }, []);

    useEffect(() => {
        const onCartChanged = () => {
            setInCart(cartQuantities());
            setCartCount(getCartCount());
        };
        window.addEventListener(CART_CHANGED_EVENT, onCartChanged);
        return () => window.removeEventListener(CART_CHANGED_EVENT, onCartChanged);
    }, []);

    const creators = useMemo(() =>
        Array.from(new Set((catalog?.units ?? []).map(x => x.creator).filter((x): x is string => !!x)))
            .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })),
    [catalog]);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        return (catalog?.units ?? []).filter(unit =>
            (!term || unit.name.toLowerCase().includes(term))
            && (!creator || unit.creator === creator)
            && (!formatFilter || unit.options.some(option => option.formatCode === formatFilter)));
    }, [catalog, search, creator, formatFilter]);

    useEffect(() => setPage(1), [search, creator, formatFilter]);

    if (error) return <Alert severity="error">{error}</Alert>;
    if (!catalog) return <Loading />;

    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="container-fluid shop">
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }} flexWrap="wrap" useFlexGap spacing={1}>
                <Typography variant="h4">Card Shop</Typography>
                <Badge badgeContent={cartCount} color="primary" max={999}>
                    <Button variant="contained" component={Link} to="/shop/cart">View Cart</Button>
                </Badge>
            </Stack>

            {!catalog.checkoutEnabled && (
                <Alert severity="warning" sx={{ mb: 2 }}>Online checkout is temporarily unavailable. You can still build your cart.</Alert>
            )}

            <MadeToOrderNotice formats={catalog.formats} tiers={catalog.discountTiers} />

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
                <TextField label="Search units" value={search} onChange={e => setSearch(e.target.value)} size="small" sx={{ minWidth: 240 }} />
                <FormControl size="small" sx={{ minWidth: 240 }}>
                    <InputLabel id="shop-creator">Creator</InputLabel>
                    <Select labelId="shop-creator" label="Creator" value={creator} onChange={e => setCreator(e.target.value)}>
                        <MenuItem value="">All creators</MenuItem>
                        {creators.map(x => <MenuItem key={x} value={x}>{getCreatorInfo(x)?.label ?? x}</MenuItem>)}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="shop-format">Format</InputLabel>
                    <Select labelId="shop-format" label="Format" value={formatFilter} onChange={e => setFormatFilter(e.target.value)}>
                        <MenuItem value="">All formats</MenuItem>
                        {catalog.formats.map(x => <MenuItem key={x.code} value={x.code}>{x.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                    {`${filtered.length} unit${filtered.length === 1 ? '' : 's'}`}
                </Typography>
            </Stack>

            <div className="row gy-3">
                {visible.map(unit => (
                    <div key={unit.armyCardId} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                        <UnitTile unit={unit} formats={catalog.formats} preferredFormat={formatFilter} inCart={inCart} />
                    </div>
                ))}
            </div>

            {filtered.length === 0 && <Typography color="text.secondary">No units match your filters.</Typography>}

            {pageCount > 1 && (
                <Stack alignItems="center" sx={{ my: 3 }}>
                    <Pagination count={pageCount} page={page} onChange={(_, value) => { setPage(value); window.scrollTo({ top: 0 }); }} />
                </Stack>
            )}
        </div>
    );
};

interface UnitTileProps {
    unit: ShopCatalogUnit;
    formats: ShopFormat[];
    preferredFormat: string;
    inCart: Map<number, number>;
}

const UnitTile: React.FC<UnitTileProps> = ({ unit, formats, preferredFormat, inCart }) => {
    const unitFormats = formats.filter(format => unit.options.some(option => option.formatCode === format.code));
    const [formatCode, setFormatCode] = useState(
        unitFormats.some(x => x.code === preferredFormat) ? preferredFormat : unitFormats[0]?.code ?? '');
    const options = unit.options.filter(x => x.formatCode === formatCode);
    const [fileId, setFileId] = useState<number>(options[0]?.armyCardFileId ?? 0);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (preferredFormat && unitFormats.some(x => x.code === preferredFormat)) {
            setFormatCode(preferredFormat);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [preferredFormat]);

    useEffect(() => {
        if (!options.some(x => x.armyCardFileId === fileId)) {
            setFileId(options[0]?.armyCardFileId ?? 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formatCode]);

    const option = options.find(x => x.armyCardFileId === fileId) ?? options[0];
    const format = formats.find(x => x.code === formatCode);
    const creatorInfo = getCreatorInfo(unit.creator);
    const unitInCart = unit.options.reduce((sum, x) => sum + (inCart.get(x.armyCardFileId) ?? 0), 0);
    const validQuantity = Number.isInteger(quantity) && quantity >= 1 && quantity <= MAX_QUANTITY_PER_LINE;

    const handleAdd = () => {
        if (!option || !validQuantity) return;
        addToCart(option.armyCardFileId, quantity);
        setQuantity(1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1500);
    };

    return (
        <Card variant="outlined" className="shop-tile">
            <a className="shop-tile-image" href={option?.filePath ?? undefined} target="_blank" rel="noopener noreferrer" title="Open the card PDF">
                {option?.thumb
                    ? <img src={option.thumb} alt={`${unit.name} - ${format?.name ?? ''}`} loading="lazy" />
                    : <img src="/assets/img/imageNotFound.png" alt="No preview available" />}
            </a>
            <CardContent sx={{ pb: 1 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, flex: 1, lineHeight: 1.2 }}>{unit.name}</Typography>
                    {creatorInfo && <img className="shop-creator-badge" src={creatorInfo.logo} alt={creatorInfo.label} title={creatorInfo.label} />}
                </Stack>
                <ToggleButtonGroup
                    size="small"
                    exclusive
                    fullWidth
                    value={formatCode}
                    onChange={(_, value) => value && setFormatCode(value)}
                    sx={{ mb: 1 }}
                >
                    {unitFormats.map(x => (
                        <ToggleButton key={x.code} value={x.code} sx={{ textTransform: 'none', lineHeight: 1.2 }}>
                            {x.code}<br />{formatMoney(x.unitPriceCents)}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
                {options.length > 1 && (
                    <FormControl size="small" fullWidth sx={{ mb: 1 }}>
                        <InputLabel id={`version-${unit.armyCardId}`}>Version</InputLabel>
                        <Select labelId={`version-${unit.armyCardId}`} label="Version" value={option?.armyCardFileId ?? ''} onChange={e => setFileId(Number(e.target.value))}>
                            {options.map(x => <MenuItem key={x.armyCardFileId} value={x.armyCardFileId}>{x.version ?? `File ${x.armyCardFileId}`}</MenuItem>)}
                        </Select>
                    </FormControl>
                )}
                {unitInCart > 0 && (
                    <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>{`${unitInCart} in cart`}</Typography>
                )}
            </CardContent>
            <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
                <TextField
                    type="number"
                    size="small"
                    label="Qty"
                    value={Number.isNaN(quantity) ? '' : quantity}
                    onChange={e => setQuantity(parseInt(e.target.value, 10))}
                    error={!validQuantity}
                    inputProps={{ min: 1, max: MAX_QUANTITY_PER_LINE, 'aria-label': `Quantity of ${unit.name}` }}
                    sx={{ width: 80 }}
                />
                <Button variant="contained" onClick={handleAdd} disabled={!option || !validQuantity} sx={{ flex: 1 }} color={added ? 'success' : 'primary'}>
                    {added ? 'Added!' : 'Add to cart'}
                </Button>
            </CardActions>
        </Card>
    );
};

export default ShopCatalogPage;
