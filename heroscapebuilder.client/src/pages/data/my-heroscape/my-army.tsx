import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import {
    AllCommunityModule,
    CellValueChangedEvent,
    ColDef,
    GetRowIdParams,
    GridApi,
    GridReadyEvent,
    ICellRendererParams,
    ModuleRegistry,
    ValueGetterParams,
} from 'ag-grid-community';
import React, { useEffect, useMemo, useState } from 'react';
import { Ability } from '../../../models/ability';
import { Unit } from '../../../models/unit';
import { getMyUnits, setMyUnits } from '../../../services/my_army-service';
import '../unit-data/unit-data.scss';
import { getUnits } from '../../../services/unit-service';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([AllCommunityModule]);

type UnitWithQuantity = Unit & { quantity?: number };

const normalizeQuantity = (value: unknown) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 1) return 1;
    return Math.floor(parsed);
};

const MyArmy: React.FC = () => {
    const [myUnits, setMyUnitsState] = useState<UnitWithQuantity[]>([]);
    const [allUnits, setAllUnits] = useState<UnitWithQuantity[]>([]);
    const [availableUnits, setAvailableUnits] = useState<UnitWithQuantity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogContent, setDialogContent] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [quickFilterText, setQuickFilterText] = useState('');
    const [addQuickFilterText, setAddQuickFilterText] = useState('');
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [addGridApi, setAddGridApi] = useState<GridApi | null>(null);
    const [selectedUnitIds, setSelectedUnitIds] = useState<number[]>([]);
    const [addSelection, setAddSelection] = useState<number[]>([]);
    const [isDirty, setIsDirty] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const handleOpenDialog = (content: string) => {
        setDialogContent(content);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setDialogContent('');
    };

    const baseColumnDefs = useMemo<ColDef<UnitWithQuantity>[]>(() => [
        { headerName: '', checkboxSelection: true, maxWidth: 50, pinned: 'left' },
        { field: 'name', headerName: 'Unit Name', minWidth: 200, pinned: 'left' },
        { field: 'quantity', headerName: 'Copies', filter: 'agNumberColumnFilter', maxWidth: 120, editable: true, cellEditor: 'agNumberCellEditor' },
        { field: 'general', headerName: 'General', minWidth: 110 },
        { field: 'creator', headerName: 'Creator', minWidth: 120 },
        { field: 'rarity', headerName: 'Rarity', minWidth: 130 },
        { field: 'type', headerName: 'Unit Type', minWidth: 120 },
        { field: 'race', headerName: 'Species', minWidth: 140 },
        { field: 'role', headerName: 'Role', minWidth: 160 },
        { field: 'points', headerName: 'Points', filter: 'agNumberColumnFilter', maxWidth: 120 },
        {
            field: 'abilities',
            headerName: 'Abilities',
            minWidth: 220,
            valueGetter: (params: ValueGetterParams<Unit, string>) =>
                params.data?.abilities?.map((ability: Ability) => `${ability.abilityName}: ${ability.ability}`).join(' | ') ?? '',
            cellRenderer: (params: ICellRendererParams<Unit>) => {
                const abilities = params.data?.abilities ?? [];
                const renderedContent = abilities
                    .map((ability: Ability) => `<strong>${ability.abilityName}</strong><br />${ability.ability}`)
                    .join('<br /><br />');
                const textContent = params.value as string;

                return (
                    <span
                        className="cell-content"
                        onClick={() => abilities.length && handleOpenDialog(renderedContent)}
                        style={{ cursor: abilities.length ? 'pointer' : 'default', color: abilities.length ? 'blue' : undefined, textDecoration: abilities.length ? 'underline' : undefined }}
                    >
                        {textContent}
                    </span>
                );
            },
            filter: 'agTextColumnFilter',
        },
        { field: 'unitNumbers', headerName: 'Unit Numbers', minWidth: 140 },
        {
            field: 'set',
            headerName: 'Set',
            minWidth: 170,
            valueGetter: (params: ValueGetterParams<Unit, string>) => (params.data?.set?.name ? params.data.set.name : ''),
        },
        { field: 'planet', headerName: 'Planet', minWidth: 140, hide: true },
        {
            field: 'note',
            headerName: 'Notes',
            minWidth: 220,
            cellRenderer: (params: ICellRendererParams<Unit>) => (
                <span
                    className="cell-content"
                    onClick={() => params.value && handleOpenDialog(params.value)}
                    style={{ cursor: params.value ? 'pointer' : 'default', color: params.value ? 'blue' : undefined, textDecoration: params.value ? 'underline' : undefined }}
                >
                    {params.value}
                </span>
            ),
        },
    ], []);

    const addColumnDefs = useMemo<ColDef<UnitWithQuantity>[]>(() => [
        { headerName: '', checkboxSelection: true, maxWidth: 50, pinned: 'left' },
        { field: 'name', headerName: 'Unit Name', minWidth: 200, pinned: 'left' },
        { field: 'quantity', headerName: 'Copies', filter: 'agNumberColumnFilter', maxWidth: 120, editable: true, cellEditor: 'agNumberCellEditor' },
        { field: 'general', headerName: 'General', minWidth: 110 },
        { field: 'creator', headerName: 'Creator', minWidth: 120 },
        { field: 'rarity', headerName: 'Rarity', minWidth: 130 },
        { field: 'type', headerName: 'Unit Type', minWidth: 120 },
        { field: 'points', headerName: 'Points', filter: 'agNumberColumnFilter', maxWidth: 120 },
    ], []);

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
        setAvailableUnits(allUnits.filter(unit => !ownedIds.has(unit.id)).map(unit => ({ ...unit, quantity: unit.quantity ?? 1 })));
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

    const handleSelectionChanged = () => {
        const selectedIds = gridApi?.getSelectedRows().map(row => row.id) ?? [];
        setSelectedUnitIds(selectedIds);
    };

    const handleAddSelectionChanged = () => {
        const selectedIds = addGridApi?.getSelectedRows().map(row => row.id) ?? [];
        setAddSelection(selectedIds);
    };

    const handleQuantityChange = (event: CellValueChangedEvent<UnitWithQuantity>) => {
        if (event.colDef.field !== 'quantity') return;
        const quantity = normalizeQuantity(event.newValue ?? event.data.quantity);
        setMyUnitsState(prev => prev.map(unit => unit.id === event.data.id ? { ...unit, quantity } : unit));
        setIsDirty(true);
    };

    const handleAddQuantityChange = (event: CellValueChangedEvent<UnitWithQuantity>) => {
        if (event.colDef.field !== 'quantity') return;
        const quantity = normalizeQuantity(event.newValue ?? event.data.quantity);
        setAvailableUnits(prev => prev.map(unit => unit.id === event.data.id ? { ...unit, quantity } : unit));
    };

    const handleRemoveSelected = () => {
        if (!selectedUnitIds.length) return;
        setMyUnitsState(prev => prev.filter(unit => !selectedUnitIds.includes(unit.id)));
        setSelectedUnitIds([]);
        setIsDirty(true);
        gridApi?.deselectAll();
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
            setSelectedUnitIds([]);
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
                setAllUnits(fullUnitList.map(unit => ({ ...unit, quantity: unit.quantity ?? 1 })));
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
            .map(unit => ({ ...unit, quantity: normalizeQuantity(unit.quantity ?? 1) }));

        setMyUnitsState(prev => [...prev, ...selectedUnits]);
        setIsDirty(true);
        setAddDialogOpen(false);
        setAddSelection([]);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ height: '91vh', width: '100%' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} className="unit-data-toolbar">
                <Button variant="contained" color="secondary" onClick={openAddUnitsDialog}>
                    Add units
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleRemoveSelected} disabled={!selectedUnitIds.length}>
                    Remove selected
                </Button>
                <Button variant="contained" color="primary" onClick={handleSave} disabled={!isDirty || !myUnits.length}>
                    Save collection
                </Button>
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
                    onCellValueChanged={handleQuantityChange}
                    rowSelection="multiple"
                    onSelectionChanged={handleSelectionChanged}
                    suppressDragLeaveHidesColumns
                    suppressCellFocus
                />
            </div>

            <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogContent>
                    <div dangerouslySetInnerHTML={{ __html: dialogContent }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="lg" fullWidth>
                <DialogTitle>Select units to add</DialogTitle>
                <DialogContent>
                    <Stack spacing={1} sx={{ paddingTop: 1 }}>
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
                                onCellValueChanged={handleAddQuantityChange}
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
