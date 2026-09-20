import { Alert, Box, Button, Card, CardActions, CardContent, Chip, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Battlegroup } from '../../../models/battlegroup';
import { deleteBattlegroup, getErrorMessages, getMyBattlegroups } from '../../../services/battlegroup-service';
import { getMyUnitCount } from '../../../services/my_army-service';
import { ConfirmDeleteDialog, NeedsReviewChip, PointsMeter, creatorLabel } from './battlegroup-parts';

const Battlegroups: React.FC = () => {
    const navigate = useNavigate();
    const [battlegroups, setBattlegroups] = useState<Battlegroup[]>([]);
    const [hasArmy, setHasArmy] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pendingDelete, setPendingDelete] = useState<Battlegroup | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const count = await getMyUnitCount();
                setHasArmy(count > 0);
                if (count > 0) {
                    setBattlegroups(await getMyBattlegroups());
                }
            } catch (err) {
                setError(getErrorMessages(err, 'Failed to load your Battlegroups.')[0]);
            }
        };
        load();
    }, []);

    const handleDelete = async () => {
        if (!pendingDelete) return;
        try {
            setDeleting(true);
            await deleteBattlegroup(pendingDelete.id);
            setBattlegroups(prev => prev.filter(x => x.id !== pendingDelete.id));
            setPendingDelete(null);
        } catch (err) {
            setError(getErrorMessages(err, 'Failed to delete the Battlegroup.')[0]);
            setPendingDelete(null);
        } finally {
            setDeleting(false);
        }
    };

    if (hasArmy === false) return <Navigate to="/my-heroscape/my-army" replace />;
    if (hasArmy === null && !error) return <div className="loading"><img src="/Hexes.gif" alt="Loading..." className="img-fluid" /></div>;

    const needsReviewCount = battlegroups.filter(x => x.needsReview).length;

    return (
        <div className="container-fluid">
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h4">Battlegroups</Typography>
                <Button variant="contained" onClick={() => navigate('/my-heroscape/battlegroups/new')}>
                    New Battlegroup
                </Button>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
            {needsReviewCount > 0 && (
                <Alert severity="error" variant="filled" sx={{ mb: 2, fontWeight: 700 }}>
                    {`${needsReviewCount} Battlegroup${needsReviewCount === 1 ? ' needs' : 's need'} review - My Army no longer covers ${needsReviewCount === 1 ? 'it' : 'them'}.`}
                </Alert>
            )}

            {battlegroups.length === 0 && !error && (
                <Typography color="text.secondary">
                    You have no Battlegroups yet. Create one to pick units from My Army within a point limit.
                </Typography>
            )}

            <div className="row gy-3">
                {battlegroups.map(bg => (
                    <div key={bg.id} className="col-md-6 col-xl-4">
                        <Card
                            variant="outlined"
                            sx={bg.needsReview ? { borderColor: '#ff1744', borderWidth: 2 } : undefined}
                        >
                            <CardContent>
                                <Stack spacing={1.5}>
                                    <Typography variant="h6" component={Link} to={`/my-heroscape/battlegroups/${bg.id}`} sx={{ textDecoration: 'none' }}>
                                        {bg.name}
                                    </Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                        {bg.needsReview && <NeedsReviewChip />}
                                        {bg.isShared && <Chip label="Shared" size="small" color="success" />}
                                        <Chip label={creatorLabel(bg.creator)} size="small" variant="outlined" />
                                        <Chip
                                            label={`${bg.units.reduce((sum, item) => sum + item.quantity, 0)} units`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Stack>
                                    <Box>
                                        <PointsMeter total={bg.totalPoints} limit={bg.pointLimit} />
                                    </Box>
                                </Stack>
                            </CardContent>
                            <CardActions>
                                <Button size="small" component={Link} to={`/my-heroscape/battlegroups/${bg.id}`}>Open</Button>
                                <Button size="small" component={Link} to={`/my-heroscape/battlegroups/${bg.id}/edit`}>Edit</Button>
                                <Button size="small" color="error" onClick={() => setPendingDelete(bg)}>Delete</Button>
                            </CardActions>
                        </Card>
                    </div>
                ))}
            </div>

            <ConfirmDeleteDialog
                open={pendingDelete !== null}
                name={pendingDelete?.name ?? ''}
                busy={deleting}
                onCancel={() => setPendingDelete(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default Battlegroups;
