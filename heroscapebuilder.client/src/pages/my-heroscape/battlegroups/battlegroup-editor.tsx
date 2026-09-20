import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    MenuItem,
    Paper,
    Snackbar,
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
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ColDef, GetQuickFilterTextParams, GetRowIdParams, ICellRendererParams, ModuleRegistry, ValueGetterParams } from 'ag-grid-community';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Ability } from '../../../models/ability';
import { Battlegroup } from '../../../models/battlegroup';
import { Unit } from '../../../models/unit';
import {
    createBattlegroup,
    getBattlegroup,
    getErrorMessages,
    isNotFound,
    updateBattlegroup,
} from '../../../services/battlegroup-service';
import { getMyUnits } from '../../../services/my_army-service';
import { PointsMeter, creatorLabel, isUniqueUnit } from './battlegroup-parts';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const MAX_NOTES_LENGTH = 10000;

type AvailableRow = Unit & { owned: number; used: number };

interface GridContext {
    onAdd: (unitId: number) => void;
    onShowAbilities: (unitId: number) => void;
}

const abilityNames = (unit?: Unit): string =>
    (unit?.abilities ?? []).map(ability => ability.abilityName).filter(Boolean).join(', ');

/** Ability names, clickable to read the full text (same idea as the Unit Data page). */
const AbilitiesCell: React.FC<ICellRendererParams<AvailableRow, string, GridContext>> = ({ data, value, context }) => {
    if (!data || !value) return null;
    return (
        <span
            role="button"
            tabIndex={0}
            title="Click to read the full abilities"
            style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
            onClick={() => context.onShowAbilities(data.id)}
            onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') context.onShowAbilities(data.id); }}
        >
            {value}
        </span>
    );
};

const AddCell: React.FC<ICellRendererParams<AvailableRow, unknown, GridContext>> = ({ data, context }) => {
    if (!data) return null;
    const capped = data.used >= data.owned || (isUniqueUnit(data.rarity) && data.used >= 1);
    // Stays clickable when capped so the user gets told why the unit can't be added.
    return (
        <Button
            size="small"
            variant={capped ? 'outlined' : 'contained'}
            color={capped ? 'inherit' : 'primary'}
            sx={{ minWidth: 60, opacity: capped ? 0.6 : 1 }}
            onClick={() => context.onAdd(data.id)}
        >
            Add
        </Button>
    );
};

const BattlegroupEditor: React.FC = () => {
    const { id } = useParams();
    const isEdit = id !== undefined;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [ownedUnits, setOwnedUnits] = useState<Unit[]>([]);
    const [savedUnits, setSavedUnits] = useState<Unit[]>([]);
    const [name, setName] = useState('');
    const [pointLimitText, setPointLimitText] = useState('');
    const [creator, setCreator] = useState('');
    const [notes, setNotes] = useState('');
    const [selection, setSelection] = useState<Record<number, number>>({});
    const [notice, setNotice] = useState<string | null>(null);
    const [serverErrors, setServerErrors] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);
    const [quickFilter, setQuickFilter] = useState('');
    const [onlyAffordable, setOnlyAffordable] = useState(true);
    const [abilityUnitId, setAbilityUnitId] = useState<number | null>(null);
    const [reviewSelected, setReviewSelected] = useState(false);
    const gridSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const owned = ((await getMyUnits())?.data ?? []) as Unit[];
                setOwnedUnits(owned);

                if (isEdit) {
                    const bg: Battlegroup = await getBattlegroup(Number(id));
                    setName(bg.name);
                    setPointLimitText(String(bg.pointLimit));
                    setCreator((bg.creator ?? '').toUpperCase());
                    setNotes(bg.notes ?? '');
                    setSavedUnits(bg.units.map(item => item.unit));
                    setSelection(Object.fromEntries(bg.units.map(item => [item.unit.id, item.quantity])));
                }
            } catch (err) {
                setLoadError(isNotFound(err) ? 'Battlegroup not found.' : getErrorMessages(err, 'Failed to load the editor.')[0]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, isEdit]);

    const ownedById = useMemo(() => new Map(ownedUnits.map(unit => [unit.id, unit.quantity ?? 0])), [ownedUnits]);

    const unitById = useMemo(() => {
        const map = new Map<number, Unit>();
        savedUnits.forEach(unit => map.set(unit.id, unit));
        ownedUnits.forEach(unit => map.set(unit.id, unit));
        return map;
    }, [ownedUnits, savedUnits]);

    const creatorOptions = useMemo(() => {
        const set = new Set(ownedUnits.map(unit => unit.creator.toUpperCase()));
        if (creator) set.add(creator);
        return Array.from(set).sort();
    }, [ownedUnits, creator]);

    const selectedList = useMemo(
        () => Object.entries(selection)
            .map(([unitId, quantity]) => ({ unit: unitById.get(Number(unitId)), quantity }))
            .filter((item): item is { unit: Unit; quantity: number } => item.unit !== undefined)
            .sort((a, b) => a.unit.name.localeCompare(b.unit.name)),
        [selection, unitById],
    );

    // "Review" mode: the table lists only the selected units so their stats can be compared.
    const reviewingSelected = reviewSelected && selectedList.length > 0;
    useEffect(() => {
        if (reviewSelected && selectedList.length === 0) setReviewSelected(false);
    }, [reviewSelected, selectedList.length]);

    const pointLimit = Number.parseInt(pointLimitText, 10) || 0;
    const totalPoints = selectedList.reduce((sum, item) => sum + (item.unit.points ?? 0) * item.quantity, 0);
    const overLimit = pointLimit > 0 && totalPoints > pointLimit;
    const overAllocated = selectedList.filter(item => item.quantity > (ownedById.get(item.unit.id) ?? 0));

    const remainingPoints = pointLimit - totalPoints;
    const abilityUnit = abilityUnitId !== null ? unitById.get(abilityUnitId) ?? null : null;
    // Without a limit there is nothing to compare against, so every unit stays visible.
    const filterByPoints = onlyAffordable && pointLimit > 0;

    const creatorRows = useMemo<AvailableRow[]>(
        () => ownedUnits
            .filter(unit => !creator || unit.creator.toUpperCase() === creator)
            .map(unit => ({ ...unit, owned: unit.quantity ?? 0, used: selection[unit.id] ?? 0 })),
        [ownedUnits, creator, selection],
    );

    const availableRows = useMemo<AvailableRow[]>(() => {
        if (reviewingSelected) {
            // Built from the selection (not My Army) so a saved unit you no longer own still shows up.
            return selectedList.map(({ unit, quantity }) => ({ ...unit, owned: ownedById.get(unit.id) ?? 0, used: quantity }));
        }
        return filterByPoints ? creatorRows.filter(unit => (unit.points ?? 0) <= remainingPoints) : creatorRows;
    }, [reviewingSelected, selectedList, ownedById, creatorRows, filterByPoints, remainingPoints]);

    /** Returns why the unit can't be added, or null when it can. */
    const addBlockedReason = (unit: Unit): string | null => {
        if (pointLimit <= 0) return 'Set a point limit before adding units.';

        if (creator && unit.creator.toUpperCase() !== creator) {
            return `${unit.name} is from ${unit.creator}, but this Battlegroup is restricted to ${creator}.`;
        }

        if (isUniqueUnit(unit.rarity)) {
            const alreadyIn = selectedList.some(item => item.unit.name.toLowerCase() === unit.name.toLowerCase());
            if (alreadyIn) return `${unit.name} is a Unique unit and can only be in a Battlegroup once.`;
        }

        const owned = ownedById.get(unit.id) ?? 0;
        const used = selection[unit.id] ?? 0;
        if (used >= owned) {
            return owned === 0
                ? `${unit.name} is not in My Army.`
                : `You only own ${owned} of ${unit.name} - all of them are already in this Battlegroup.`;
        }

        const points = unit.points ?? 0;
        if (totalPoints + points > pointLimit) {
            return `Adding ${unit.name} (${points} pts) would bring this Battlegroup to ${totalPoints + points} points, over its limit of ${pointLimit}.`;
        }

        return null;
    };

    const addUnit = (unitId: number) => {
        const unit = unitById.get(unitId);
        if (!unit) return;
        const reason = addBlockedReason(unit);
        if (reason) {
            setNotice(reason);
            return;
        }
        setSelection(prev => ({ ...prev, [unitId]: (prev[unitId] ?? 0) + 1 }));
    };

    // The grid renderer always calls the latest handler, since it closes over the current selection.
    const addUnitRef = useRef(addUnit);
    addUnitRef.current = addUnit;
    const gridContext = useMemo<GridContext>(() => ({
        onAdd: unitId => addUnitRef.current(unitId),
        onShowAbilities: unitId => setAbilityUnitId(unitId),
    }), []);

    const decrementUnit = (unitId: number) => {
        setSelection(prev => {
            const next = { ...prev };
            if ((next[unitId] ?? 0) <= 1) delete next[unitId];
            else next[unitId] -= 1;
            return next;
        });
    };

    const removeUnit = (unitId: number) => {
        setSelection(prev => {
            const next = { ...prev };
            delete next[unitId];
            return next;
        });
    };

    const handleCreatorChange = (value: string) => {
        const conflicting = value
            ? selectedList.filter(item => item.unit.creator.toUpperCase() !== value)
            : [];
        if (conflicting.length > 0) {
            setNotice(`Can't restrict this Battlegroup to ${value} while it contains ${conflicting.map(item => item.unit.name).join(', ')}. Remove them first.`);
            return;
        }
        setCreator(value);
    };

    const canSave = name.trim().length > 0 && pointLimit > 0 && !overLimit && overAllocated.length === 0 && !saving;

    const handleSave = async () => {
        const request = {
            name: name.trim(),
            pointLimit,
            creator: creator || null,
            notes: notes.trim() || null,
            units: selectedList.map(item => ({ unitId: item.unit.id, quantity: item.quantity })),
        };

        try {
            setSaving(true);
            setServerErrors([]);
            const saved = isEdit
                ? await updateBattlegroup(Number(id), request)
                : await createBattlegroup(request);
            navigate(`/my-heroscape/battlegroups/${saved.id}`);
        } catch (err) {
            setServerErrors(getErrorMessages(err, 'Failed to save the Battlegroup.'));
            setSaving(false);
        }
    };

    const toggleReview = () => {
        if (selectedList.length === 0) return;
        const next = !reviewingSelected;
        setReviewSelected(next);
        // When the table is stacked above the selection, bring it into view.
        if (next) gridSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    // Clicking anywhere on the selected-units box toggles review mode, except on its own buttons/inputs.
    const handleSelectedBoxClick = (event: React.MouseEvent) => {
        if ((event.target as HTMLElement).closest('button, input, a')) return;
        toggleReview();
    };

    const columnDefs = useMemo<ColDef<AvailableRow>[]>(() => [
        { headerName: '', cellRenderer: AddCell, width: 90, flex: 0, pinned: 'left', sortable: false, filter: false, floatingFilter: false, resizable: false },
        { field: 'name', headerName: 'Unit', width: 165, flex: 0, pinned: 'left' },
        { field: 'rarity', headerName: 'Rarity', width: 95, flex: 0 },
        { field: 'points', headerName: 'Points', filter: 'agNumberColumnFilter', width: 85, flex: 0 },
        { field: 'life', headerName: 'Life', filter: 'agNumberColumnFilter', width: 80, flex: 0 },
        { field: 'advMove', headerName: 'Adv Move', filter: 'agNumberColumnFilter', width: 100, flex: 0 },
        { field: 'advRange', headerName: 'Adv Range', filter: 'agNumberColumnFilter', width: 100, flex: 0 },
        { field: 'advAttack', headerName: 'Adv Attack', filter: 'agNumberColumnFilter', width: 105, flex: 0 },
        { field: 'advDefense', headerName: 'Adv Defense', filter: 'agNumberColumnFilter', width: 110, flex: 0 },
        { field: 'sizeCategory', headerName: 'Size Category', width: 140, flex: 0 },
        {
            headerName: 'Abilities',
            minWidth: 260,
            valueGetter: (params: ValueGetterParams<AvailableRow, string>) => abilityNames(params.data),
            cellRenderer: AbilitiesCell,
            // Quick search also looks through the full ability text, not just the names shown.
            getQuickFilterText: (params: GetQuickFilterTextParams<AvailableRow>) =>
                (params.data?.abilities ?? []).map((ability: Ability) => `${ability.abilityName ?? ''} ${ability.ability ?? ''}`).join(' '),
        },
        { field: 'owned', headerName: 'Owned', filter: 'agNumberColumnFilter', width: 90, flex: 0 },
        { field: 'general', headerName: 'General', width: 105, flex: 0 },
        { field: 'creator', headerName: 'Creator', width: 110, flex: 0 },
    ], []);

    const defaultColDef = useMemo<ColDef>(() => ({
        filter: true,
        sortable: true,
        resizable: true,
        floatingFilter: true,
        flex: 1,
    }), []);

    const getRowId = (params: GetRowIdParams<AvailableRow>) => params.data.id.toString();

    if (loading) return <div className="loading"><img src="/Hexes.gif" alt="Loading..." className="img-fluid" /></div>;
    if (loadError) {
        return (
            <div className="container-fluid">
                <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>
                <Button component={Link} to="/my-heroscape/battlegroups">Back to Battlegroups</Button>
            </div>
        );
    }
    if (ownedUnits.length === 0) return <Navigate to="/my-heroscape/my-army" replace />;

    const cancelTarget = isEdit ? `/my-heroscape/battlegroups/${id}` : '/my-heroscape/battlegroups';

    return (
        <div className="container-fluid">
            <Stack spacing={2}>
                <Typography variant="h4">{isEdit ? 'Edit Battlegroup' : 'New Battlegroup'}</Typography>

                {serverErrors.length > 0 && (
                    <Alert severity="error" onClose={() => setServerErrors([])}>
                        {serverErrors.map(message => <div key={message}>{message}</div>)}
                    </Alert>
                )}

                {overAllocated.length > 0 && (
                    <Alert severity="error" variant="filled" sx={{ fontWeight: 700 }}>
                        {`⚠ My Army doesn't have enough of: ${overAllocated.map(item => `${item.unit.name} (own ${ownedById.get(item.unit.id) ?? 0}, using ${item.quantity})`).join(', ')}. Lower or remove them to save.`}
                    </Alert>
                )}

                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack spacing={2}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TextField
                                label="Battlegroup name"
                                value={name}
                                onChange={event => setName(event.target.value)}
                                slotProps={{ htmlInput: { maxLength: 100 } }}
                                size="small"
                                fullWidth
                                required
                            />
                            <TextField
                                label="Point limit"
                                type="number"
                                value={pointLimitText}
                                onChange={event => setPointLimitText(event.target.value)}
                                slotProps={{ htmlInput: { min: 1 } }}
                                size="small"
                                error={overLimit || (pointLimitText !== '' && pointLimit <= 0)}
                                helperText={overLimit ? `Current units total ${totalPoints} points` : undefined}
                                sx={{ minWidth: 160 }}
                                required
                            />
                            <TextField
                                select
                                label="Restrict to creator"
                                value={creator}
                                onChange={event => handleCreatorChange(event.target.value)}
                                size="small"
                                sx={{ minWidth: 240 }}
                            >
                                <MenuItem value="">Any creator</MenuItem>
                                {creatorOptions.map(option => (
                                    <MenuItem key={option} value={option}>{creatorLabel(option)}</MenuItem>
                                ))}
                            </TextField>
                        </Stack>
                        {pointLimit > 0 && <PointsMeter total={totalPoints} limit={pointLimit} />}
                        <Typography variant="caption" color="text.secondary">
                            Unique units can be added once. Uncommon and common units can be added up to the number you own. The point limit cannot be exceeded.
                        </Typography>
                    </Stack>
                </Paper>

                <div className="row gy-3">
                    <div className="col-xxl-8" ref={gridSectionRef}>
                        <Stack spacing={1}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>{reviewingSelected ? 'Selected units' : 'My Army'}</Typography>
                                <TextField
                                    size="small"
                                    fullWidth
                                    placeholder="Search your units"
                                    value={quickFilter}
                                    onChange={event => setQuickFilter(event.target.value)}
                                />
                            </Stack>
                            {reviewingSelected ? (
                                <Alert
                                    severity="info"
                                    action={<Button color="inherit" size="small" onClick={() => setReviewSelected(false)}>Show all units</Button>}
                                >
                                    {`Reviewing your ${selectedList.length} selected unit${selectedList.length === 1 ? '' : 's'}.`}
                                </Alert>
                            ) : (
                            <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap">
                                <FormControlLabel
                                    control={<Switch size="small" checked={onlyAffordable} onChange={event => setOnlyAffordable(event.target.checked)} />}
                                    label={pointLimit > 0
                                        ? `Only show units of ${Math.max(remainingPoints, 0)} points or less`
                                        : 'Only show units within the remaining points'}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    {pointLimit > 0
                                        ? `Showing ${availableRows.length} of ${creatorRows.length} units`
                                        : 'Set a point limit to filter by remaining points'}
                                </Typography>
                            </Stack>
                            )}
                            <div className="ag-theme-alpine" style={{ height: '55vh', width: '100%' }}>
                                <AgGridReact<AvailableRow>
                                    rowData={availableRows}
                                    columnDefs={columnDefs}
                                    defaultColDef={defaultColDef}
                                    context={gridContext}
                                    quickFilterText={quickFilter}
                                    getRowId={getRowId}
                                    animateRows
                                    rowHeight={40}
                                    headerHeight={40}
                                    suppressCellFocus
                                />
                            </div>
                        </Stack>
                    </div>

                    <div className="col-xxl-4">
                        <Stack spacing={1}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                                <Typography variant="h6">{`Battlegroup (${selectedList.reduce((sum, item) => sum + item.quantity, 0)} units)`}</Typography>
                                <Button
                                    size="small"
                                    variant={reviewingSelected ? 'contained' : 'outlined'}
                                    disabled={selectedList.length === 0}
                                    onClick={toggleReview}
                                >
                                    {reviewingSelected ? 'Show all units' : 'Review in table'}
                                </Button>
                            </Stack>
                            <Typography variant="caption" color="text.secondary">
                                {selectedList.length === 0
                                    ? 'Add units, then click this box to review their stats in the table.'
                                    : reviewingSelected
                                        ? 'Reviewing these units in the table. Click this box again to show all units.'
                                        : 'Click this box to review these units in the table.'}
                            </Typography>
                            <TableContainer
                                component={Paper}
                                variant="outlined"
                                onClick={handleSelectedBoxClick}
                                sx={{
                                    maxHeight: '55vh',
                                    cursor: selectedList.length > 0 ? 'pointer' : 'default',
                                    borderColor: reviewingSelected ? 'primary.main' : undefined,
                                    borderWidth: reviewingSelected ? 2 : 1,
                                    boxShadow: reviewingSelected ? 3 : 0,
                                    '&:hover': selectedList.length > 0 ? { borderColor: 'primary.main' } : undefined,
                                }}
                            >
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Unit</TableCell>
                                            <TableCell align="center">Qty</TableCell>
                                            <TableCell align="right">Pts</TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedList.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} align="center">
                                                    <Typography variant="body2" color="text.secondary">
                                                        Click Add on a unit to put it in this Battlegroup.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {selectedList.map(item => {
                                            const owned = ownedById.get(item.unit.id) ?? 0;
                                            const flagged = item.quantity > owned;
                                            return (
                                                <TableRow key={item.unit.id} sx={flagged ? { bgcolor: 'rgba(255, 23, 68, 0.12)' } : undefined}>
                                                    <TableCell>
                                                        {item.unit.name}
                                                        {flagged && (
                                                            <Typography variant="caption" display="block" sx={{ color: '#d50000', fontWeight: 700 }}>
                                                                {`⚠ own ${owned}`}
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                                        <IconButton size="small" aria-label={`Remove one ${item.unit.name}`} onClick={() => decrementUnit(item.unit.id)}>−</IconButton>
                                                        {item.quantity}
                                                        <IconButton size="small" aria-label={`Add one ${item.unit.name}`} onClick={() => addUnit(item.unit.id)}>+</IconButton>
                                                    </TableCell>
                                                    <TableCell align="right">{(item.unit.points ?? 0) * item.quantity}</TableCell>
                                                    <TableCell align="right">
                                                        <Button size="small" color="error" onClick={() => removeUnit(item.unit.id)}>Remove</Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Stack>
                    </div>
                </div>

                <Paper variant="outlined" sx={{ p: 2 }}>
                    <TextField
                        label="How to play this Battlegroup"
                        placeholder="Strategy, opening moves, how the units work together, things to watch out for..."
                        value={notes}
                        onChange={event => setNotes(event.target.value)}
                        multiline
                        minRows={4}
                        maxRows={20}
                        fullWidth
                        slotProps={{ htmlInput: { maxLength: MAX_NOTES_LENGTH } }}
                        helperText={`Plain text, optional. Shown on your shared link too. ${notes.length}/${MAX_NOTES_LENGTH}`}
                    />
                </Paper>

                <Stack direction="row" spacing={1}>
                    <Button variant="contained" onClick={handleSave} disabled={!canSave}>
                        {isEdit ? 'Save changes' : 'Create Battlegroup'}
                    </Button>
                    <Button component={Link} to={cancelTarget}>Cancel</Button>
                </Stack>
            </Stack>

            <Dialog open={abilityUnit !== null} onClose={() => setAbilityUnitId(null)} maxWidth="sm" fullWidth>
                <DialogTitle>{abilityUnit ? `${abilityUnit.name} - Abilities` : ''}</DialogTitle>
                <DialogContent dividers>
                    {(abilityUnit?.abilities ?? []).length === 0 && (
                        <Typography variant="body2" color="text.secondary">This unit has no abilities.</Typography>
                    )}
                    {(abilityUnit?.abilities ?? []).map(ability => (
                        <div key={ability.id} style={{ marginBottom: 12 }}>
                            <Typography variant="subtitle2">{ability.abilityName}</Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{ability.ability}</Typography>
                        </div>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAbilityUnitId(null)}>Close</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={notice !== null}
                autoHideDuration={6000}
                onClose={() => setNotice(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="error" variant="filled" onClose={() => setNotice(null)} sx={{ width: '100%' }}>
                    {notice}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default BattlegroupEditor;
