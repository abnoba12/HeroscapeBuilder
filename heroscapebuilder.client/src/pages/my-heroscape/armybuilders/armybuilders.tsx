import { Alert, Box, Button, Card, CardActions, CardContent, Chip, Collapse, IconButton, Snackbar, Stack, SvgIcon, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArmyBuilder } from '../../../models/armybuilder';
import {
    deleteArmyBuilder,
    getErrorMessages,
    getMyArmyBuilders,
    pinArmyBuilder,
    restoreArmyBuilder,
    retireArmyBuilder,
    unpinArmyBuilder,
} from '../../../services/armybuilder-service';
import { getMyUnitCount } from '../../../services/my_army-service';
import { ConfirmDeleteDialog, NeedsReviewChip, PointsMeter, VariationSwitcher, creatorLabel } from './armybuilder-parts';

// Material "star" / "star outline" paths, inlined because @mui/icons-material is not a dependency.
const StarIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <SvgIcon>
        {filled
            ? <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            : <path d="m22 9.24-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28z" />}
    </SvgIcon>
);

const ArmyBuilders: React.FC = () => {
    const navigate = useNavigate();
    const [armyBuilders, setArmyBuilders] = useState<ArmyBuilder[]>([]);
    const [hasArmy, setHasArmy] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pendingDelete, setPendingDelete] = useState<ArmyBuilder | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [retiredOpen, setRetiredOpen] = useState(false);
    const [busyId, setBusyId] = useState<number | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const count = await getMyUnitCount();
                setHasArmy(count > 0);
                if (count > 0) {
                    setArmyBuilders(await getMyArmyBuilders());
                }
            } catch (err) {
                setError(getErrorMessages(err, 'Failed to load your armies.')[0]);
            }
        };
        load();
    }, []);

    const handleDelete = async () => {
        if (!pendingDelete) return;
        try {
            setDeleting(true);
            await deleteArmyBuilder(pendingDelete.id);
            setArmyBuilders(prev => prev.filter(x => x.id !== pendingDelete.id));
            setPendingDelete(null);
        } catch (err) {
            setError(getErrorMessages(err, 'Failed to delete the army.')[0]);
            setPendingDelete(null);
        } finally {
            setDeleting(false);
        }
    };

    const changeRetired = async (bg: ArmyBuilder, retire: boolean) => {
        try {
            setBusyId(bg.id);
            const updated = await (retire ? retireArmyBuilder(bg.id) : restoreArmyBuilder(bg.id));
            setArmyBuilders(prev => prev.map(x => (x.id === bg.id ? updated : x)));
            setMessage(retire ? `${bg.name} retired` : `${bg.name} restored`);
        } catch (err) {
            setError(getErrorMessages(err, retire ? 'Failed to retire the army.' : 'Failed to restore the army.')[0]);
        } finally {
            setBusyId(null);
        }
    };

    const changePinned = async (bg: ArmyBuilder, pin: boolean) => {
        try {
            setBusyId(bg.id);
            const updated = await (pin ? pinArmyBuilder(bg.id) : unpinArmyBuilder(bg.id));
            setArmyBuilders(prev => prev.map(x => (x.id === bg.id ? updated : x)));
            setMessage(pin ? `${bg.name} pinned` : `${bg.name} unpinned`);
        } catch (err) {
            setError(getErrorMessages(err, pin ? 'Failed to pin the army.' : 'Failed to unpin the army.')[0]);
        } finally {
            setBusyId(null);
        }
    };

    if (hasArmy === false) return <Navigate to="/my-heroscape/my-army" replace />;
    if (hasArmy === null && !error) return <div className="loading"><img src="/Hexes.gif" alt="Loading..." className="img-fluid" /></div>;

    // Pinned armies come first; the sort is stable, so the server's name order holds within each group.
    const active = armyBuilders.filter(x => !x.isRetired).sort((a, b) => Number(b.isPinned) - Number(a.isPinned));
    const retired = armyBuilders.filter(x => x.isRetired);
    // Retired armies are out of play, so they don't count toward the review warning.
    // An army needs review when any of its variations does.
    const reviewNeeded = (bg: ArmyBuilder) => bg.variations.some(x => x.needsReview);
    const needsReviewCount = active.filter(reviewNeeded).length;

    const renderCard = (bg: ArmyBuilder) => {
        const hasVariations = bg.variations.length > 1;
        const wins = bg.variations.reduce((sum, x) => sum + x.wins, 0);
        const losses = bg.variations.reduce((sum, x) => sum + x.losses, 0);
        const needsReview = reviewNeeded(bg);
        return (
        <div key={bg.id} className="col-md-6 col-xl-4">
            <Card
                variant="outlined"
                sx={{ position: 'relative', ...(needsReview && !bg.isRetired ? { borderColor: '#ff1744', borderWidth: 2 } : {}) }}
            >
                {!bg.isRetired && (
                    <Tooltip title={bg.isPinned ? 'Unpin from top' : 'Pin to top'}>
                        <IconButton
                            onClick={() => changePinned(bg, !bg.isPinned)}
                            disabled={busyId === bg.id}
                            aria-label={bg.isPinned ? `Unpin ${bg.name}` : `Pin ${bg.name}`}
                            aria-pressed={bg.isPinned}
                            color={bg.isPinned ? 'warning' : 'default'}
                            sx={{ position: 'absolute', top: 4, right: 4 }}
                        >
                            <StarIcon filled={bg.isPinned} />
                        </IconButton>
                    </Tooltip>
                )}
                <CardContent>
                    <Stack spacing={1.5}>
                        <Typography variant="h6" component={Link} to={`/my-heroscape/armybuilder/${bg.id}`} sx={{ textDecoration: 'none', pr: bg.isRetired ? 0 : 5 }}>
                            {bg.name}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {needsReview && !bg.isRetired && <NeedsReviewChip />}
                            {bg.isShared && <Chip label="Shared" size="small" color="success" />}
                            {hasVariations && <Chip label={`${bg.variations.length} variations`} size="small" variant="outlined" />}
                            {!hasVariations && <Chip label={creatorLabel(bg.creator)} size="small" variant="outlined" />}
                            {!hasVariations && <Chip label={`${bg.pointSystem} points`} size="small" variant="outlined" />}
                            {wins + losses > 0 && (
                                <Chip label={`${wins}-${losses} record`} size="small" variant="outlined" />
                            )}
                            {!hasVariations && (
                                <Chip
                                    label={`${bg.units.reduce((sum, item) => sum + item.quantity, 0)} units`}
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                        </Stack>
                        {hasVariations ? (
                            <VariationSwitcher
                                variations={bg.variations}
                                currentId={-1}
                                linkFor={variationId => `/my-heroscape/armybuilder/${variationId}`}
                                showReview={!bg.isRetired}
                            />
                        ) : (
                            <Box>
                                <PointsMeter total={bg.totalPoints} limit={bg.pointLimit} />
                            </Box>
                        )}
                    </Stack>
                </CardContent>
                <CardActions
                    sx={{ borderTop: 1, borderColor: 'divider', bgcolor: 'action.hover', px: 2, py: 1.25, gap: 1, flexWrap: 'wrap', '& > :not(style) ~ :not(style)': { ml: 0 } }}
                >
                    <Button size="small" variant="outlined" component={Link} to={`/my-heroscape/armybuilder/${bg.id}/edit`}>Edit</Button>
                    {bg.isRetired ? (
                        <Button size="small" variant="outlined" onClick={() => changeRetired(bg, false)} disabled={busyId === bg.id}>Restore</Button>
                    ) : (
                        <Button size="small" variant="outlined" color="inherit" onClick={() => changeRetired(bg, true)} disabled={busyId === bg.id}>Retire</Button>
                    )}
                    <Button size="small" variant="outlined" color="error" sx={{ ml: 'auto' }} onClick={() => setPendingDelete(bg)}>Delete</Button>
                </CardActions>
            </Card>
        </div>
        );
    };

    return (
        <div className="container-fluid">
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h4">My Armies</Typography>
                <Button variant="contained" onClick={() => navigate('/my-heroscape/armybuilder/new')}>
                    New Army
                </Button>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
            {needsReviewCount > 0 && (
                <Alert severity="error" variant="filled" sx={{ mb: 2, fontWeight: 700 }}>
                    {`${needsReviewCount} ${needsReviewCount === 1 ? 'army needs' : 'armies need'} review - My Collection no longer covers ${needsReviewCount === 1 ? 'it' : 'them'}.`}
                </Alert>
            )}

            {active.length === 0 && !error && (
                <Typography color="text.secondary">
                    {retired.length === 0
                        ? 'You have no armies yet. Create one to pick units from My Collection within a point limit.'
                        : 'All of your armies are retired. Create a new army, or restore one from the Retired section below.'}
                </Typography>
            )}

            <div className="row gy-3">
                {active.map(renderCard)}
            </div>

            {retired.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Button
                        color="inherit"
                        onClick={() => setRetiredOpen(open => !open)}
                        aria-expanded={retiredOpen}
                        startIcon={<span aria-hidden="true">{retiredOpen ? '▾' : '▸'}</span>}
                        sx={{ textTransform: 'none', fontSize: '1.1rem' }}
                    >
                        {`Retired armies (${retired.length})`}
                    </Button>
                    <Collapse in={retiredOpen} unmountOnExit>
                        <div className="row gy-3" style={{ marginTop: 0 }}>
                            {retired.map(renderCard)}
                        </div>
                    </Collapse>
                </Box>
            )}

            <ConfirmDeleteDialog
                open={pendingDelete !== null}
                name={pendingDelete?.name ?? ''}
                variationCount={pendingDelete?.variations.length}
                busy={deleting}
                onCancel={() => setPendingDelete(null)}
                onConfirm={handleDelete}
            />
            <Snackbar open={message !== null} autoHideDuration={2500} onClose={() => setMessage(null)} message={message} />
        </div>
    );
};

export default ArmyBuilders;
