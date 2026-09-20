import { Alert, Button, Paper, Snackbar, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Battlegroup } from '../../../models/battlegroup';
import {
    buildShareUrl,
    deleteBattlegroup,
    getBattlegroup,
    getErrorMessages,
    hideBattlegroup,
    isNotFound,
    shareBattlegroup,
} from '../../../services/battlegroup-service';
import { BattlegroupView, ConfirmDeleteDialog, NeedsReviewChip } from './battlegroup-parts';

/** The owner's view of one Battlegroup, with edit / share / delete controls. */
const BattlegroupDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [battlegroup, setBattlegroup] = useState<Battlegroup | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                setBattlegroup(await getBattlegroup(Number(id)));
            } catch (err) {
                setError(isNotFound(err) ? 'Battlegroup not found.' : getErrorMessages(err, 'Failed to load the Battlegroup.')[0]);
            }
        };
        load();
    }, [id]);

    const runShareChange = async (action: (id: number) => Promise<Battlegroup>) => {
        if (!battlegroup) return;
        try {
            setBusy(true);
            setBattlegroup(await action(battlegroup.id));
        } catch (err) {
            setError(getErrorMessages(err)[0]);
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async () => {
        if (!battlegroup) return;
        try {
            setBusy(true);
            await deleteBattlegroup(battlegroup.id);
            navigate('/my-heroscape/battlegroups', { replace: true });
        } catch (err) {
            setError(getErrorMessages(err, 'Failed to delete the Battlegroup.')[0]);
            setConfirmDelete(false);
            setBusy(false);
        }
    };

    const shareUrl = battlegroup?.isShared && battlegroup.shareId ? buildShareUrl(battlegroup.shareId) : null;

    const copyLink = async () => {
        if (!shareUrl) return;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
        } catch {
            setError('Could not copy automatically - select the link and copy it manually.');
        }
    };

    if (error && !battlegroup) {
        return (
            <div className="container-fluid">
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                <Button component={Link} to="/my-heroscape/battlegroups">Back to Battlegroups</Button>
            </div>
        );
    }
    if (!battlegroup) return <div className="loading"><img src="/Hexes.gif" alt="Loading..." className="img-fluid" /></div>;

    return (
        <div className="container-fluid">
            <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }} justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
                        <Typography variant="h4">{battlegroup.name}</Typography>
                        {battlegroup.needsReview && <NeedsReviewChip />}
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Button component={Link} to="/my-heroscape/battlegroups">All Battlegroups</Button>
                        <Button variant="contained" component={Link} to={`/my-heroscape/battlegroups/${battlegroup.id}/edit`}>Edit</Button>
                        {!battlegroup.isShared && (
                            <Button variant="outlined" onClick={() => runShareChange(shareBattlegroup)} disabled={busy}>Share</Button>
                        )}
                        <Button color="error" onClick={() => setConfirmDelete(true)} disabled={busy}>Delete</Button>
                    </Stack>
                </Stack>

                {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}

                {shareUrl && (
                    <Paper variant="outlined" sx={{ p: 2 }}>
                        <Stack spacing={1}>
                            <Typography variant="subtitle2">
                                This Battlegroup is shared. Anyone with this link can view it (read-only):
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    value={shareUrl}
                                    slotProps={{ input: { readOnly: true } }}
                                    onFocus={event => event.target.select()}
                                />
                                <Button variant="contained" onClick={copyLink}>Copy link</Button>
                                <Button variant="outlined" color="warning" onClick={() => runShareChange(hideBattlegroup)} disabled={busy}>
                                    Hide
                                </Button>
                            </Stack>
                        </Stack>
                    </Paper>
                )}

                <BattlegroupView battlegroup={battlegroup} />
            </Stack>

            <ConfirmDeleteDialog
                open={confirmDelete}
                name={battlegroup.name}
                busy={busy}
                onCancel={() => setConfirmDelete(false)}
                onConfirm={handleDelete}
            />
            <Snackbar open={copied} autoHideDuration={2500} onClose={() => setCopied(false)} message="Link copied" />
        </div>
    );
};

export default BattlegroupDetail;
