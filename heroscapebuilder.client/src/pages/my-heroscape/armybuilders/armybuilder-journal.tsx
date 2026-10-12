import {
    Alert,
    Box,
    Button,
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
import { JournalEntry, JournalEntryRequest } from '../../../models/armybuilder';
import {
    addJournalEntry,
    deleteJournalEntry,
    getErrorMessages,
    getJournal,
    updateJournalEntry,
} from '../../../services/armybuilder-service';

const MAX_FIELD_LENGTH = 4000;

/** Today in the user's own timezone as yyyy-MM-dd (what a date input and the API expect). */
const todayLocal = (): string => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
};

/** yyyy-MM-dd -> a readable local date without the timezone shift `new Date('yyyy-MM-dd')` would cause. */
const formatDate = (value: string): string => {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

interface Draft {
    entryDate: string;
    wentWell: string;
    wentPoorly: string;
    notes: string;
}

const emptyDraft = (): Draft => ({ entryDate: todayLocal(), wentWell: '', wentPoorly: '', notes: '' });

const toDraft = (entry: JournalEntry): Draft => ({
    entryDate: entry.entryDate,
    wentWell: entry.wentWell ?? '',
    wentPoorly: entry.wentPoorly ?? '',
    notes: entry.notes ?? '',
});

const toRequest = (draft: Draft): JournalEntryRequest => ({
    entryDate: draft.entryDate || null,
    wentWell: draft.wentWell.trim() || null,
    wentPoorly: draft.wentPoorly.trim() || null,
    notes: draft.notes.trim() || null,
});

const EntrySection: React.FC<{ label: string; text?: string | null; color?: string }> = ({ label, text, color }) => {
    if (!text) return null;
    return (
        <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color }}>{label}</Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{text}</Typography>
        </Box>
    );
};

interface ArmyBuilderJournalProps {
    armyBuilderId: number;
}

/** The owner's private play journal for one army: what it did well, what it did poorly, and anything else. */
const ArmyBuilderJournal: React.FC<ArmyBuilderJournalProps> = ({ armyBuilderId }) => {
    const [entries, setEntries] = useState<JournalEntry[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [editing, setEditing] = useState<{ id: number | null; draft: Draft } | null>(null);
    const [pendingDelete, setPendingDelete] = useState<JournalEntry | null>(null);

    const load = useCallback(async () => {
        try {
            setEntries(await getJournal(armyBuilderId));
        } catch (err) {
            setEntries([]);
            setError(getErrorMessages(err, 'Failed to load the journal.')[0]);
        }
    }, [armyBuilderId]);

    useEffect(() => { void load(); }, [load]);

    const setField = (field: keyof Draft, value: string) =>
        setEditing(prev => (prev ? { ...prev, draft: { ...prev.draft, [field]: value } } : prev));

    const save = async () => {
        if (!editing) return;
        const request = toRequest(editing.draft);
        if (!request.wentWell && !request.wentPoorly && !request.notes) {
            setError('Write something in at least one of the fields.');
            return;
        }
        try {
            setBusy(true);
            setError(null);
            if (editing.id === null) {
                await addJournalEntry(armyBuilderId, request);
            } else {
                await updateJournalEntry(editing.id, request);
            }
            setMessage(editing.id === null ? 'Entry added' : 'Entry updated');
            setEditing(null);
            await load();
        } catch (err) {
            setError(getErrorMessages(err)[0]);
        } finally {
            setBusy(false);
        }
    };

    const remove = async () => {
        if (!pendingDelete) return;
        try {
            setBusy(true);
            setError(null);
            await deleteJournalEntry(pendingDelete.id);
            setEntries(prev => (prev ? prev.filter(x => x.id !== pendingDelete.id) : prev));
            setMessage('Entry deleted');
        } catch (err) {
            setError(getErrorMessages(err, 'Failed to delete the entry.')[0]);
        } finally {
            setPendingDelete(null);
            setBusy(false);
        }
    };

    const lengthHelper = (value: string) => `${value.length}/${MAX_FIELD_LENGTH}`;

    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.5}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">Play journal</Typography>
                        <Typography variant="caption" color="text.secondary">
                            Private to you - never shown on a shared link.
                        </Typography>
                    </Box>
                    {!editing && (
                        <Button variant="contained" size="small" onClick={() => { setError(null); setEditing({ id: null, draft: emptyDraft() }); }}>
                            New entry
                        </Button>
                    )}
                </Stack>

                {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}

                {editing && (
                    <Paper variant="outlined" sx={{ p: 2 }}>
                        <Stack spacing={2}>
                            <Typography variant="subtitle1">{editing.id === null ? 'New entry' : 'Edit entry'}</Typography>
                            <TextField
                                size="small"
                                type="date"
                                label="Date"
                                value={editing.draft.entryDate}
                                onChange={event => setField('entryDate', event.target.value)}
                                slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: todayLocal() } }}
                                sx={{ maxWidth: 220 }}
                            />
                            <TextField
                                label="What went well"
                                multiline
                                minRows={3}
                                value={editing.draft.wentWell}
                                onChange={event => setField('wentWell', event.target.value)}
                                slotProps={{ htmlInput: { maxLength: MAX_FIELD_LENGTH } }}
                                helperText={lengthHelper(editing.draft.wentWell)}
                            />
                            <TextField
                                label="What went poorly"
                                multiline
                                minRows={3}
                                value={editing.draft.wentPoorly}
                                onChange={event => setField('wentPoorly', event.target.value)}
                                slotProps={{ htmlInput: { maxLength: MAX_FIELD_LENGTH } }}
                                helperText={lengthHelper(editing.draft.wentPoorly)}
                            />
                            <TextField
                                label="Other notes (opponent, map, ideas for next time...)"
                                multiline
                                minRows={2}
                                value={editing.draft.notes}
                                onChange={event => setField('notes', event.target.value)}
                                slotProps={{ htmlInput: { maxLength: MAX_FIELD_LENGTH } }}
                                helperText={lengthHelper(editing.draft.notes)}
                            />
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Button onClick={() => setEditing(null)} disabled={busy}>Cancel</Button>
                                <Button variant="contained" onClick={save} disabled={busy}>Save</Button>
                            </Stack>
                        </Stack>
                    </Paper>
                )}

                {entries !== null && entries.length === 0 && !editing && (
                    <Typography variant="body2" color="text.secondary">
                        No entries yet. After you play this army, jot down what worked and what didn't so you can use it
                        when building your next one.
                    </Typography>
                )}

                {entries?.map(entry => (
                    <Paper key={entry.id} variant="outlined" sx={{ p: 1.5 }}>
                        <Stack spacing={1}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Typography variant="subtitle2">{formatDate(entry.entryDate)}</Typography>
                                <Stack direction="row" spacing={0.5}>
                                    <Button
                                        size="small"
                                        onClick={() => { setError(null); setEditing({ id: entry.id, draft: toDraft(entry) }); }}
                                        disabled={busy}
                                    >
                                        Edit
                                    </Button>
                                    <Button size="small" color="error" onClick={() => setPendingDelete(entry)} disabled={busy}>
                                        Delete
                                    </Button>
                                </Stack>
                            </Stack>
                            <EntrySection label="Went well" text={entry.wentWell} color="success.main" />
                            <EntrySection label="Went poorly" text={entry.wentPoorly} color="error.main" />
                            <EntrySection label="Notes" text={entry.notes} />
                        </Stack>
                    </Paper>
                ))}
            </Stack>

            <Dialog open={pendingDelete !== null} onClose={() => !busy && setPendingDelete(null)}>
                <DialogTitle>Delete this journal entry?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {pendingDelete ? `The entry from ${formatDate(pendingDelete.entryDate)} will be permanently removed.` : ''}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPendingDelete(null)} disabled={busy}>Cancel</Button>
                    <Button color="error" onClick={remove} disabled={busy}>Delete</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={message !== null} autoHideDuration={2500} onClose={() => setMessage(null)} message={message} />
        </Paper>
    );
};

export default ArmyBuilderJournal;
