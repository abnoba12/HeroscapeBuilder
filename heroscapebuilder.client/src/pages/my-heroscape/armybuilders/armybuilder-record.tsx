import {
    Alert,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { ArmyGame, ArmyTally } from '../../../models/battlegroup';
import { deleteArmyGame, getArmyGames, getErrorMessages, logArmyGames } from '../../../services/battlegroup-service';

const MAX_PAST_RESULTS = 200;

const winRate = ({ wins, losses }: ArmyTally): string =>
    wins + losses === 0 ? '' : ` (${Math.round((wins / (wins + losses)) * 100)}% wins)`;

interface BattlegroupRecordProps {
    battlegroupId: number;
    initial: ArmyTally;
    /** Called whenever the tally changes so the page can keep its copy in step. */
    onChange?: (tally: ArmyTally) => void;
}

/** The owner's win/loss log for one army: quick win/loss buttons, past results, and the recent games. */
const BattlegroupRecord: React.FC<BattlegroupRecordProps> = ({ battlegroupId, initial, onChange }) => {
    const [tally, setTally] = useState<ArmyTally>(initial);
    const [games, setGames] = useState<ArmyGame[]>([]);
    const [note, setNote] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [pastOpen, setPastOpen] = useState(false);
    const [pastWins, setPastWins] = useState('');
    const [pastLosses, setPastLosses] = useState('');

    const applyTally = useCallback((next: ArmyTally) => {
        setTally(next);
        onChange?.(next);
    }, [onChange]);

    const loadGames = useCallback(async () => {
        try {
            setGames(await getArmyGames(battlegroupId));
        } catch (err) {
            setError(getErrorMessages(err, 'Failed to load your recorded games.')[0]);
        }
    }, [battlegroupId]);

    useEffect(() => { void loadGames(); }, [loadGames]);

    const log = async (won: boolean) => {
        try {
            setBusy(true);
            setError(null);
            applyTally(await logArmyGames(battlegroupId, { won, note: note.trim() || null }));
            setNote('');
            setMessage(won ? 'Win recorded' : 'Loss recorded');
            await loadGames();
        } catch (err) {
            setError(getErrorMessages(err)[0]);
        } finally {
            setBusy(false);
        }
    };

    const remove = async (game: ArmyGame) => {
        try {
            setBusy(true);
            setError(null);
            applyTally(await deleteArmyGame(game.id));
            setGames(prev => prev.filter(x => x.id !== game.id));
            setMessage('Result removed');
        } catch (err) {
            setError(getErrorMessages(err)[0]);
        } finally {
            setBusy(false);
        }
    };

    const asCount = (value: string) => Math.max(0, Math.min(MAX_PAST_RESULTS, Math.floor(Number(value) || 0)));

    const addPast = async () => {
        const wins = asCount(pastWins);
        const losses = asCount(pastLosses);
        if (wins + losses === 0) {
            setPastOpen(false);
            return;
        }
        try {
            setBusy(true);
            setError(null);
            let next = tally;
            if (wins > 0) next = await logArmyGames(battlegroupId, { won: true, count: wins });
            if (losses > 0) next = await logArmyGames(battlegroupId, { won: false, count: losses });
            applyTally(next);
            setPastOpen(false);
            setPastWins('');
            setPastLosses('');
            setMessage('Past results added');
            await loadGames();
        } catch (err) {
            setError(getErrorMessages(err)[0]);
        } finally {
            setBusy(false);
        }
    };

    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.5}>
                <Stack direction="row" spacing={1.5} alignItems="baseline" flexWrap="wrap" useFlexGap>
                    <Typography variant="subtitle2" color="text.secondary">Record</Typography>
                    <Typography variant="h6">
                        {`${tally.wins} ${tally.wins === 1 ? 'win' : 'wins'}, ${tally.losses} ${tally.losses === 1 ? 'loss' : 'losses'}`}
                        <Typography component="span" variant="body2" color="text.secondary">{winRate(tally)}</Typography>
                    </Typography>
                </Stack>

                {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
                    <TextField
                        size="small"
                        label="Note (optional)"
                        value={note}
                        onChange={event => setNote(event.target.value)}
                        slotProps={{ htmlInput: { maxLength: 500 } }}
                        sx={{ flex: 1 }}
                    />
                    <Button variant="contained" color="success" onClick={() => log(true)} disabled={busy}>Log a win</Button>
                    <Button variant="contained" color="error" onClick={() => log(false)} disabled={busy}>Log a loss</Button>
                    <Button onClick={() => setPastOpen(true)} disabled={busy}>Add past results</Button>
                </Stack>

                {games.length > 0 && (
                    <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">Recent games</Typography>
                        {games.map(game => (
                            <Stack key={game.id} direction="row" spacing={1} alignItems="center">
                                <Chip
                                    label={game.won ? 'Win' : 'Loss'}
                                    size="small"
                                    color={game.won ? 'success' : 'error'}
                                    sx={{ width: 60 }}
                                />
                                <Typography variant="body2" sx={{ minWidth: 90 }}>
                                    {new Date(game.playedAt).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ flex: 1, overflowWrap: 'anywhere' }}>
                                    {game.note}
                                </Typography>
                                <Button size="small" color="inherit" onClick={() => remove(game)} disabled={busy}>Remove</Button>
                            </Stack>
                        ))}
                    </Stack>
                )}
            </Stack>

            <Dialog open={pastOpen} onClose={() => !busy && setPastOpen(false)}>
                <DialogTitle>Add past results</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        {`Played this army before? Enter how many games you won and lost with it as it is now (up to ${MAX_PAST_RESULTS} each).`}
                    </DialogContentText>
                    <Stack direction="row" spacing={2}>
                        <TextField
                            label="Wins"
                            type="number"
                            value={pastWins}
                            onChange={event => setPastWins(event.target.value)}
                            slotProps={{ htmlInput: { min: 0, max: MAX_PAST_RESULTS } }}
                        />
                        <TextField
                            label="Losses"
                            type="number"
                            value={pastLosses}
                            onChange={event => setPastLosses(event.target.value)}
                            slotProps={{ htmlInput: { min: 0, max: MAX_PAST_RESULTS } }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPastOpen(false)} disabled={busy}>Cancel</Button>
                    <Button onClick={addPast} variant="contained" disabled={busy}>Add</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={message !== null} autoHideDuration={2500} onClose={() => setMessage(null)} message={message} />
        </Paper>
    );
};

export default BattlegroupRecord;
