import {
    Alert,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Paper,
    Radio,
    RadioGroup,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { usePointSystem } from '../../components/PointSystem/PointSystemContext';
import { POINT_SYSTEMS, PointSystem } from '../../models/point-system';
import { logout } from '../../services/authService';
import { getErrorMessages } from '../../services/battlegroup-service';
import { changePassword, deleteAccount, getProfile, setProfileAllowTileSwap } from '../../services/profile-service';

const PointSystemSection: React.FC = () => {
    const { defaultPointSystem, saveDefaultPointSystem } = usePointSystem();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const handleChange = async (system: PointSystem) => {
        try {
            setSaving(true);
            setError(null);
            await saveDefaultPointSystem(system);
            setSaved(true);
        } catch (err) {
            setError(getErrorMessages(err, 'Failed to save your point system.')[0]);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1}>
                <Typography variant="h6">Default point system</Typography>
                <Typography variant="body2" color="text.secondary">
                    Pages that show unit points start with this system. You can still switch a single page to another
                    system from its "points" menu without changing this default.
                </Typography>
                {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
                <RadioGroup value={defaultPointSystem} onChange={event => handleChange(event.target.value as PointSystem)}>
                    {POINT_SYSTEMS.map(system => (
                        <FormControlLabel
                            key={system.value}
                            value={system.value}
                            disabled={saving}
                            control={<Radio />}
                            label={
                                <span>
                                    <Typography component="span" variant="body1" sx={{ fontWeight: 600 }}>{system.label}</Typography>
                                    <Typography component="span" variant="body2" color="text.secondary" display="block">{system.description}</Typography>
                                </span>
                            }
                            sx={{ alignItems: 'flex-start', mb: 1, '& .MuiRadio-root': { pt: 0.5 } }}
                        />
                    ))}
                </RadioGroup>
            </Stack>
            <Snackbar open={saved} autoHideDuration={2500} onClose={() => setSaved(false)} message="Default point system saved" />
        </Paper>
    );
};

const TileSwapSection: React.FC<{ initial: boolean }> = ({ initial }) => {
    const [allow, setAllow] = useState(initial);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const handleChange = async (value: boolean) => {
        try {
            setSaving(true);
            setError(null);
            setAllow((await setProfileAllowTileSwap(value)).allowTileSwap);
            setSaved(true);
        } catch (err) {
            setError(getErrorMessages(err, 'Failed to save your tile swap setting.')[0]);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1}>
                <Typography variant="h6">Terrain</Typography>
                {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
                <FormControlLabel
                    disabled={saving}
                    control={<Checkbox checked={allow} onChange={event => handleChange(event.target.checked)} />}
                    label={
                        <span>
                            <Typography component="span" variant="body1" sx={{ fontWeight: 600 }}>Allow tile swap</Typography>
                            <Typography component="span" variant="body2" color="text.secondary" display="block">
                                When you don't own enough of a terrain tile for a map, the "Maps I can build" filter counts spare tiles of
                                the same size as a substitute, as long as the tile has no special rules. Water, molten lava, shadow, snow,
                                roads and similar tiles are never swapped for other types. Single space water and swamp water can swap with
                                each other, single space trees, pillars and fortress columns can swap with each other, and outcrops can swap with other outcrops of the same size.
                            </Typography>
                        </span>
                    }
                    sx={{ alignItems: 'flex-start', '& .MuiCheckbox-root': { pt: 0.5 } }}
                />
            </Stack>
            <Snackbar open={saved} autoHideDuration={2500} onClose={() => setSaved(false)} message="Tile swap setting saved" />
        </Paper>
    );
};

const ChangePasswordSection: React.FC = () => {
    const [current, setCurrent] = useState('');
    const [next, setNext] = useState('');
    const [confirm, setConfirm] = useState('');
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [done, setDone] = useState(false);

    const mismatch = confirm.length > 0 && next !== confirm;
    const canSave = current.length > 0 && next.length > 0 && next === confirm && !saving;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!canSave) return;
        try {
            setSaving(true);
            setErrors([]);
            await changePassword(current, next);
            setCurrent('');
            setNext('');
            setConfirm('');
            setDone(true);
        } catch (err) {
            setErrors(getErrorMessages(err, 'Failed to change your password.'));
        } finally {
            setSaving(false);
        }
    };

    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2} sx={{ maxWidth: 420 }}>
                    <Typography variant="h6">Change password</Typography>
                    {errors.length > 0 && (
                        <Alert severity="error" onClose={() => setErrors([])}>
                            {errors.map(message => <div key={message}>{message}</div>)}
                        </Alert>
                    )}
                    {done && (
                        <Alert severity="success" onClose={() => setDone(false)}>
                            Password changed. Other devices will need to log in again.
                        </Alert>
                    )}
                    <TextField
                        label="Current password"
                        type="password"
                        autoComplete="current-password"
                        value={current}
                        onChange={event => setCurrent(event.target.value)}
                        size="small"
                        required
                    />
                    <TextField
                        label="New password"
                        type="password"
                        autoComplete="new-password"
                        value={next}
                        onChange={event => setNext(event.target.value)}
                        size="small"
                        required
                    />
                    <TextField
                        label="Confirm new password"
                        type="password"
                        autoComplete="new-password"
                        value={confirm}
                        onChange={event => setConfirm(event.target.value)}
                        error={mismatch}
                        helperText={mismatch ? 'Passwords do not match' : undefined}
                        size="small"
                        required
                    />
                    <div>
                        <Button type="submit" variant="contained" disabled={!canSave}>Change password</Button>
                    </div>
                </Stack>
            </form>
        </Paper>
    );
};

const DeleteAccountSection: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const close = () => {
        if (busy) return;
        setOpen(false);
        setPassword('');
        setError(null);
    };

    const handleDelete = async () => {
        try {
            setBusy(true);
            setError(null);
            await deleteAccount(password);
            logout();
            window.location.href = '/';
        } catch (err) {
            setError(getErrorMessages(err, 'Failed to delete your account.')[0]);
            setBusy(false);
        }
    };

    return (
        <Paper variant="outlined" sx={{ p: 2, borderColor: 'error.main' }}>
            <Stack spacing={1} alignItems="flex-start">
                <Typography variant="h6" color="error">Delete account</Typography>
                <Typography variant="body2" color="text.secondary">
                    Permanently deletes your account, your collection and all of your armies. Shared army
                    links stop working. This cannot be undone.
                </Typography>
                <Button color="error" variant="outlined" onClick={() => setOpen(true)}>Delete my account</Button>
            </Stack>

            <Dialog open={open} onClose={close} maxWidth="xs" fullWidth>
                <DialogTitle>Delete your account?</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <DialogContentText>
                            Your account, collection and armies will be permanently deleted. Enter your password to confirm.
                        </DialogContentText>
                        {error && <Alert severity="error">{error}</Alert>}
                        <TextField
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                            size="small"
                            autoFocus
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={close} disabled={busy}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" variant="contained" disabled={busy || password.length === 0}>
                        Delete permanently
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

/** The signed-in user's account settings. */
const Profile: React.FC = () => {
    const [email, setEmail] = useState<string | null>(null);
    const [allowTileSwap, setAllowTileSwap] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        getProfile()
            .then(profile => {
                setAllowTileSwap(profile.allowTileSwap);
                setEmail(profile.email);
            })
            .catch(err => setLoadError(getErrorMessages(err, 'Failed to load your profile.')[0]));
    }, []);

    if (loadError) {
        return (
            <div className="container-fluid">
                <Alert severity="error">{loadError}</Alert>
            </div>
        );
    }
    if (email === null) return <div className="loading"><img src="/Hexes.gif" alt="Loading..." className="img-fluid" /></div>;

    return (
        <div className="container-fluid">
            <Stack spacing={2} sx={{ maxWidth: 760 }}>
                <div>
                    <Typography variant="h4">Profile</Typography>
                    <Typography variant="body2" color="text.secondary">{email}</Typography>
                </div>
                <PointSystemSection />
                <TileSwapSection initial={allowTileSwap} />
                <ChangePasswordSection />
                <DeleteAccountSection />
            </Stack>
        </div>
    );
};

export default Profile;
