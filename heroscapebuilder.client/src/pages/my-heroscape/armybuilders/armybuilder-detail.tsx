import { Alert, Button, Chip, Paper, Snackbar, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArmyBuilder } from '../../../models/armybuilder';
import {
    buildShareUrl,
    deleteArmyBuilder,
    getArmyBuilder,
    getErrorMessages,
    hideArmyBuilder,
    isNotFound,
    restoreArmyBuilder,
    retireArmyBuilder,
    shareArmyBuilder,
} from '../../../services/armybuilder-service';
import { ArmyBuilderView, ConfirmDeleteDialog, NeedsReviewChip } from './armybuilder-parts';
import ArmyBuilderJournal from './armybuilder-journal';
import ArmyBuilderRecord from './armybuilder-record';

/** The owner's view of one Army builder, with edit / share / delete controls. */
const ArmyBuilderDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [armyBuilder, setArmyBuilder] = useState<ArmyBuilder | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                setArmyBuilder(await getArmyBuilder(Number(id)));
            } catch (err) {
                setError(isNotFound(err) ? 'Army not found.' : getErrorMessages(err, 'Failed to load the army.')[0]);
            }
        };
        load();
    }, [id]);

    const runShareChange = async (action: (id: number) => Promise<ArmyBuilder>) => {
        if (!armyBuilder) return;
        try {
            setBusy(true);
            setArmyBuilder(await action(armyBuilder.id));
        } catch (err) {
            setError(getErrorMessages(err)[0]);
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async () => {
        if (!armyBuilder) return;
        try {
            setBusy(true);
            await deleteArmyBuilder(armyBuilder.id);
            navigate('/my-heroscape/armybuilder', { replace: true });
        } catch (err) {
            setError(getErrorMessages(err, 'Failed to delete the army.')[0]);
            setConfirmDelete(false);
            setBusy(false);
        }
    };

    const shareUrl = armyBuilder?.isShared && armyBuilder.shareId ? buildShareUrl(armyBuilder.shareId) : null;

    const copyLink = async () => {
        if (!shareUrl) return;
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
        } catch {
            setError('Could not copy automatically - select the link and copy it manually.');
        }
    };

    if (error && !armyBuilder) {
        return (
            <div className="container-fluid">
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                <Button component={Link} to="/my-heroscape/armybuilder">Back to My Armies</Button>
            </div>
        );
    }
    if (!armyBuilder) return <div className="loading"><img src="/Hexes.gif" alt="Loading..." className="img-fluid" /></div>;

    return (
        <div className="container-fluid">
            <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }} justifyContent="space-between">
                    <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
                        <Typography variant="h4">{armyBuilder.name}</Typography>
                        {armyBuilder.needsReview && !armyBuilder.isRetired && <NeedsReviewChip />}
                        {armyBuilder.isRetired && <Chip label="Retired" size="small" />}
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Button component={Link} to="/my-heroscape/armybuilder">All armies</Button>
                        <Button variant="contained" component={Link} to={`/my-heroscape/armybuilder/${armyBuilder.id}/edit`}>Edit</Button>
                        {!armyBuilder.isShared && (
                            <Button variant="outlined" onClick={() => runShareChange(shareArmyBuilder)} disabled={busy}>Share</Button>
                        )}
                        {armyBuilder.isRetired ? (
                            <Button onClick={() => runShareChange(restoreArmyBuilder)} disabled={busy}>Restore</Button>
                        ) : (
                            <Button color="inherit" onClick={() => runShareChange(retireArmyBuilder)} disabled={busy}>Retire</Button>
                        )}
                        <Button color="error" onClick={() => setConfirmDelete(true)} disabled={busy}>Delete</Button>
                    </Stack>
                </Stack>

                {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}

                {shareUrl && (
                    <Paper variant="outlined" sx={{ p: 2 }}>
                        <Stack spacing={1}>
                            <Typography variant="subtitle2">
                                This army is shared. Anyone with this link can view it (read-only):
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
                                <Button variant="outlined" color="warning" onClick={() => runShareChange(hideArmyBuilder)} disabled={busy}>
                                    Hide
                                </Button>
                            </Stack>
                        </Stack>
                    </Paper>
                )}

                <ArmyBuilderRecord
                    armyBuilderId={armyBuilder.id}
                    initial={{ wins: armyBuilder.wins, losses: armyBuilder.losses }}
                />

                <ArmyBuilderView armyBuilder={armyBuilder} />

                <ArmyBuilderJournal armyBuilderId={armyBuilder.id} />
            </Stack>

            <ConfirmDeleteDialog
                open={confirmDelete}
                name={armyBuilder.name}
                busy={busy}
                onCancel={() => setConfirmDelete(false)}
                onConfirm={handleDelete}
            />
            <Snackbar open={copied} autoHideDuration={2500} onClose={() => setCopied(false)} message="Link copied" />
        </div>
    );
};

export default ArmyBuilderDetail;
