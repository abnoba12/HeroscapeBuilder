import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputBase, Stack, TextField, Typography } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import {
    AllCommunityModule,
    ColDef,
    GetRowIdParams,
    GridApi,
    GridReadyEvent,
    ICellRendererParams,
    ModuleRegistry,
    ValueGetterParams,
} from 'ag-grid-community';
import React, { useEffect, useMemo, useState } from 'react';
import { Unit } from '../../models/unit';
import { getMyUnits, setMyUnits } from '../../services/my_army-service';
import '../data/unit-data/unit-data.scss';
import { getUnits } from '../../services/unit-service';
import { useUnsavedChangesGuard } from './use-unsaved-changes-guard';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([AllCommunityModule]);

type UnitWithQuantity = Unit & { quantity?: number };

const normalizeQuantity = (value: unknown) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) return 0;
    return Math.floor(parsed);
};

interface QuantityContext {
    onQuantityChange: (unitId: number, quantity: number) => void;
    onRemove?: (unitId: number) => void;
}

const stepperButtonSx = { width: 28, height: 28, fontSize: 18, lineHeight: 1, border: '1px solid', borderColor: 'divider' };

/** Quantity as "- 4 +" so it is obviously editable (and works on touch). The number can also be typed. */
const QuantityCell: React.FC<ICellRendererParams<UnitWithQuantity, number, QuantityContext>> = ({ data, context }) => {
    const quantity = data?.quantity ?? 1;
    const [text, setText] = useState(String(quantity));
    useEffect(() => setText(String(quantity)), [quantity]);

    if (!data) return null;

    // Never goes below 1 - removing a unit is a separate, explicit action.
    const change = (next: number) => {
        const clamped = Math.max(1, normalizeQuantity(next));
        setText(String(clamped));
        if (clamped !== quantity) context.onQuantityChange(data.id, clamped);
    };

    return (
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ height: '100%' }}>
            <IconButton size="small" sx={stepperButtonSx} aria-label={`Remove one ${data.name}`} disabled={quantity <= 1} onClick={() => change(quantity - 1)}>
                −
            </IconButton>
            <InputBase
                value={text}
                onChange={event => setText(event.target.value)}
                onBlur={() => change(Number(text))}
                onKeyDown={event => { if (event.key === 'Enter') change(Number(text)); }}
                inputProps={{ type: 'number', min: 1, 'aria-label': `Quantity of ${data.name}` }}
                sx={{
                    width: 48,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    '& input': { textAlign: 'center', padding: '3px 0', MozAppearance: 'textfield' },
                    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
                }}
            />
            <IconButton size="small" sx={stepperButtonSx} aria-label={`Add one ${data.name}`} onClick={() => change(quantity + 1)}>
                +
            </IconButton>
        </Stack>
    );
};

const RemoveCell: React.FC<ICellRendererParams<UnitWithQuantity, unknown, QuantityContext>> = ({ data, context }) => {
    if (!data) return null;
    return (
        <Button size="small" color="error" onClick={() => context.onRemove?.(data.id)}>
            Remove
        </Button>
    );
};

const MyArmy: React.FC = () => {
    const [myUnits, setMyUnitsState] = useState<UnitWithQuantity[]>([]);
    const [allUnits, setAllUnits] = useState<UnitWithQuantity[]>([]);
    const [availableUnits, setAvailableUnits] = useState<UnitWithQuantity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quickFilterText, setQuickFilterText] = useState('');
    const [addQuickFilterText, setAddQuickFilterText] = useState('');
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [addGridApi, setAddGridApi] = useState<GridApi | null>(null);
    const [addSelection, setAddSelection] = useState<number[]>([]);
    const [isDirty, setIsDirty] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const baseColumnDefs = useMemo<ColDef<UnitWithQuantity>[]>(() => [
        { field: 'name', headerName: 'Unit Name', minWidth: 220, pinned: 'left' },
        { field: 'quantity', headerName: 'Quantity', filter: 'agNumberColumnFilter', width: 190, minWidth: 190, flex: 0, cellRenderer: QuantityCell },
        { field: 'general', headerName: 'General', minWidth: 110 },
        { field: 'creator', headerName: 'Creator', minWidth: 140 },
        { field: 'unitNumbers', headerName: 'Unit Numbers', minWidth: 160 },
        {
            field: 'set',
            headerName: 'Set',
            minWidth: 180,
            valueGetter: (params: ValueGetterParams<Unit, string>) => (params.data?.set?.name ? params.data.set.name : ''),
        },
        { headerName: '', cellRenderer: RemoveCell, pinned: 'right', width: 110, minWidth: 110, flex: 0, sortable: false, filter: false, floatingFilter: false },
    ], []);

    const addColumnDefs = useMemo<ColDef<UnitWithQuantity>[]>(() => [
        { field: 'name', headerName: 'Unit Name', minWidth: 220, pinned: 'left' },
        { field: 'quantity', headerName: 'Quantity', filter: 'agNumberColumnFilter', width: 190, minWidth: 190, flex: 0, cellRenderer: QuantityCell },
        { field: 'general', headerName: 'General', minWidth: 110 },
        { field: 'creator', headerName: 'Creator', minWidth: 140 },
        { field: 'unitNumbers', headerName: 'Unit Numbers', minWidth: 160 },
        {
            field: 'set',
            headerName: 'Set',
            minWidth: 180,
            valueGetter: (params: ValueGetterParams<Unit, string>) => (params.data?.set?.name ? params.data.set.name : ''),
        },
    ], []);

    const myGridContext = useMemo<QuantityContext>(() => ({
        onQuantityChange: (unitId, quantity) => {
            setMyUnitsState(prev => prev.map(unit => unit.id === unitId ? { ...unit, quantity } : unit));
            setIsDirty(true);
        },
        onRemove: unitId => {
            setMyUnitsState(prev => prev.filter(unit => unit.id !== unitId));
            setIsDirty(true);
        },
    }), []);

    const addGridContext = useMemo<QuantityContext>(() => ({
        onQuantityChange: (unitId, quantity) => {
            setAvailableUnits(prev => prev.map(unit => unit.id === unitId ? { ...unit, quantity } : unit));
        },
    }), []);

    useUnsavedChangesGuard(isDirty);

    const defaultColDef = useMemo<ColDef>(() => ({
        filter: true,
        sortable: true,
        resizable: true,
        floatingFilter: true,
        flex: 1,
        minWidth: 120,
    }), []);

    useEffect(() => {
        document.body.classList.add('unit-data-active');
        return () => {
            document.body.classList.remove('unit-data-active');
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = (await getMyUnits())?.data as UnitWithQuantity[];
                setMyUnitsState(data.map(unit => ({ ...unit, quantity: unit.quantity ?? 1 })));
                setLoading(false);
            } catch {
                setError('Failed to fetch unit data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!addDialogOpen || !allUnits.length) return;
        const ownedIds = new Set(myUnits.map(unit => unit.id));
        setAvailableUnits(allUnits.filter(unit => !ownedIds.has(unit.id)).map(unit => ({ ...unit, quantity: 1 })));
    }, [addDialogOpen, allUnits, myUnits]);

    const onGridReady = (params: GridReadyEvent) => {
        setGridApi(params.api);
        params.api.setGridOption('quickFilterText', quickFilterText);
    };

    const onAddGridReady = (params: GridReadyEvent) => {
        setAddGridApi(params.api);
        params.api.setGridOption('quickFilterText', addQuickFilterText);
    };

    const handleQuickFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuickFilterText(value);
        gridApi?.setGridOption('quickFilterText', value);
    };

    const handleAddQuickFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setAddQuickFilterText(value);
        addGridApi?.setGridOption('quickFilterText', value);
    };

    const clearFilters = () => {
        gridApi?.setFilterModel(null);
        gridApi?.setGridOption('quickFilterText', '');
        setQuickFilterText('');
    };

    const clearAddFilters = () => {
        addGridApi?.setFilterModel(null);
        addGridApi?.setGridOption('quickFilterText', '');
        setAddQuickFilterText('');
    };

    const getRowId = (params: GetRowIdParams<UnitWithQuantity>) => params.data.id?.toString();

    const handleAddSelectionChanged = () => {
        const selectedIds = addGridApi?.getSelectedRows().map(row => row.id) ?? [];
        setAddSelection(selectedIds);
    };

    const handleSave = async () => {
        const payload = myUnits
            .filter(unit => (unit.quantity ?? 0) > 0)
            .map(unit => ({ unitId: unit.id, quantity: normalizeQuantity(unit.quantity ?? 1) }));

        try {
            setLoading(true);
            await setMyUnits(payload);
            const data = (await getMyUnits())?.data as UnitWithQuantity[];
            setMyUnitsState(data.map(unit => ({ ...unit, quantity: unit.quantity ?? 1 })));
            setIsDirty(false);
        } catch (err) {
            console.error('Error saving units:', err);
            setError('Failed to save your army.');
        } finally {
            setLoading(false);
        }
    };

    const openAddUnitsDialog = async () => {
        try {
            setAddDialogOpen(true);
            setAddSelection([]);
            if (!allUnits.length) {
                const fullUnitList = await getUnits();
                setAllUnits(fullUnitList.map(unit => ({ ...unit, quantity: 1 })));
            }
        } catch (err) {
            console.error('Error loading unit list:', err);
            setError('Error loading all units.');
            setAddDialogOpen(false);
        }
    };

    const handleAddSelectedUnits = () => {
        if (!addSelection.length) {
            setAddDialogOpen(false);
            return;
        }

        const selectedUnits = availableUnits
            .filter(unit => addSelection.includes(unit.id))
            .map(unit => ({ ...unit, quantity: Math.max(1, normalizeQuantity(unit.quantity)) }));

        setMyUnitsState(prev => [...prev, ...selectedUnits]);
        setIsDirty(true);
        setAddDialogOpen(false);
        setAddSelection([]);
    };

    if (loading) return <div className="loading"><img src="/Hexes.gif" alt="Loading..." className="img-fluid" /></div>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ height: '91vh', width: '100%' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} className="unit-data-toolbar">
                <Button variant="contained" color="secondary" onClick={openAddUnitsDialog}>
                    Add units
                </Button>
                <Button variant="contained" color={isDirty ? 'warning' : 'primary'} onClick={handleSave} disabled={!isDirty}>
                    Save collection
                </Button>
                {isDirty && (
                    <Typography variant="body2" sx={{ color: 'warning.dark', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        ● Unsaved changes
                    </Typography>
                )}
                <TextField
                    size="small"
                    value={quickFilterText}
                    onChange={handleQuickFilterChange}
                    placeholder="Search your collection"
                    variant="outlined"
                    fullWidth
                />
                <Button onClick={clearFilters} variant="text" disabled={!quickFilterText}>
                    Clear filters
                </Button>
                <Typography variant="body2" sx={{ marginLeft: 'auto', minWidth: 140 }}>
                    {`Units: ${myUnits.length}`}
                </Typography>
            </Stack>

            <div className="ag-theme-alpine unit-data-grid">
                <AgGridReact<UnitWithQuantity>
                    rowData={myUnits}
                    columnDefs={baseColumnDefs}
                    defaultColDef={defaultColDef}
                    animateRows
                    enableCellTextSelection
                    pagination
                    paginationAutoPageSize
                    rowHeight={40}
                    headerHeight={40}
                    getRowId={getRowId}
                    onGridReady={onGridReady}
                    context={myGridContext}
                    suppressDragLeaveHidesColumns
                    suppressCellFocus
                />
            </div>
            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="lg" fullWidth>
                <DialogTitle>Select units to add</DialogTitle>
                <DialogContent>
                    <Stack spacing={1} sx={{ paddingTop: 1 }}>
                        <Alert severity="info">
                            Units already in My Army aren't listed here. To change how many you own, use the − / + buttons in the Quantity column of your collection.
                        </Alert>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
                            <TextField
                                size="small"
                                value={addQuickFilterText}
                                onChange={handleAddQuickFilterChange}
                                placeholder="Search all units"
                                variant="outlined"
                                fullWidth
                            />
                            <Button onClick={clearAddFilters} variant="text" disabled={!addQuickFilterText}>
                                Clear filters
                            </Button>
                            <Typography variant="body2" sx={{ minWidth: 160 }}>
                                {`Available: ${availableUnits.length}`}
                            </Typography>
                        </Stack>
                        <div className="ag-theme-alpine" style={{ height: '60vh', width: '100%' }}>
                            <AgGridReact<UnitWithQuantity>
                                rowData={availableUnits}
                                columnDefs={addColumnDefs}
                                defaultColDef={defaultColDef}
                                animateRows
                                enableCellTextSelection
                                rowHeight={38}
                                headerHeight={38}
                                getRowId={getRowId}
                                onGridReady={onAddGridReady}
                                context={addGridContext}
                                rowSelection="multiple"
                                onSelectionChanged={handleAddSelectionChanged}
                                suppressDragLeaveHidesColumns
                                suppressCellFocus
                            />
                        </div>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddSelectedUnits} variant="contained" disabled={!addSelection.length}>
                        Add selected
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default MyArmy;
