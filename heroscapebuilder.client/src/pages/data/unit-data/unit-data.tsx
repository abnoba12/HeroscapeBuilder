import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
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
import { Ability } from '../../../models/ability';
import { Unit } from '../../../models/unit';
import { getUnits } from '../../../services/unit-service';
import './unit-data.scss';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const UnitData: React.FC = () => {
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogContent, setDialogContent] = useState<string>(''); // State to control dialog content
    const [open, setOpen] = useState(false); // State to control dialog open/close
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [hasColumnFilters, setHasColumnFilters] = useState(false);
    const [quickFilterText, setQuickFilterText] = useState('');

    const handleOpenDialog = (content: string) => {
        setDialogContent(content);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setDialogContent('');
    };

    const baseColumnDefs = useMemo((): ColDef[] => [
        { field: 'creator', headerName: 'Creator', minWidth: 120 },
        { field: 'general', headerName: 'General', minWidth: 110 },
        { field: 'name', headerName: 'Unit Name', minWidth: 200 },
        { field: 'rarity', headerName: 'Rarity', minWidth: 130 },
        { field: 'type', headerName: 'Unit Type', minWidth: 120 },
        { field: 'race', headerName: 'Species', minWidth: 140 },
        { field: 'role', headerName: 'Role', minWidth: 160 },
        { field: 'sizeCategory', headerName: 'Size Category', minWidth: 140 },
        { field: 'size', headerName: 'Size', filter: 'agNumberColumnFilter', maxWidth: 110 },
        { field: 'personality', headerName: 'Personality', minWidth: 150 },
        { field: 'life', headerName: 'Life', filter: 'agNumberColumnFilter', maxWidth: 110 },
        { field: 'advAttack', headerName: 'Adv Attack', filter: 'agNumberColumnFilter', minWidth: 130 },
        { field: 'advDefense', headerName: 'Adv Defence', filter: 'agNumberColumnFilter', minWidth: 140 },
        { field: 'advMove', headerName: 'Adv Move', filter: 'agNumberColumnFilter', minWidth: 120 },
        { field: 'advRange', headerName: 'Adv Range', filter: 'agNumberColumnFilter', minWidth: 130 },
        { field: 'basicAttack', headerName: 'Basic Attack', filter: 'agNumberColumnFilter', minWidth: 130, hide: true },
        { field: 'basicDefense', headerName: 'Basic Defence', filter: 'agNumberColumnFilter', minWidth: 140, hide: true },
        { field: 'basicMove', headerName: 'Basic Move', filter: 'agNumberColumnFilter', minWidth: 130, hide: true },
        { field: 'basicRange', headerName: 'Basic Range', filter: 'agNumberColumnFilter', minWidth: 130, hide: true },
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
                        onClick={() => handleOpenDialog(renderedContent)}
                        style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
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
                    onClick={() => handleOpenDialog(params.value)}
                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                >
                    {params.value}
                </span>
            ),
        },
        {
            field: 'stlUrls',
            headerName: 'STL Files',
            minWidth: 220,
            autoHeight: true,
            wrapText: true,
            valueGetter: (params: ValueGetterParams<Unit, string>) =>
                params.data?.stlUrls?.join(' | ') ?? '',
            cellRenderer: (params: ICellRendererParams<Unit>) => {
                const stlUrls = params.data?.stlUrls ?? [];

                if (stlUrls.length === 0) {
                    return <span>-</span>;
                }

                return (
                    <div className="stl-links-cell">
                        {stlUrls.map((url, index) => (
                            <a key={`${url}-${index}`} href={url} target="_blank" rel="noopener noreferrer">
                                STL {index + 1}
                            </a>
                        ))}
                    </div>
                );
            },
            cellStyle: { display: 'flex', alignItems: 'center' },
        },
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
        // Add a class to the body or another global wrapper
        document.body.classList.add('unit-data-active');

        // Clean up the class when the component unmounts
        return () => {
            document.body.classList.remove('unit-data-active');
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUnits();
                setUnits(data);
                setLoading(false);
            } catch {
                setError('Failed to fetch unit data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    const onGridReady = (params: GridReadyEvent) => {
        setGridApi(params.api);
        params.api.setGridOption('quickFilterText', quickFilterText);
    };

    const handleQuickFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuickFilterText(value);
        gridApi?.setGridOption('quickFilterText', value);
    };

    const clearFilters = () => {
        gridApi?.setFilterModel(null);
        gridApi?.setGridOption('quickFilterText', '');
        setQuickFilterText('');
        setHasColumnFilters(false);
    };

    const getRowId = (params: GetRowIdParams<Unit>) => params.data.id?.toString();

    const handleFilterChanged = () => {
        const filterModel = gridApi?.getFilterModel();
        setHasColumnFilters(filterModel ? Object.keys(filterModel).length > 0 : false);
    };

    const hasActiveFilters = useMemo(
        () => hasColumnFilters || quickFilterText.length > 0,
        [hasColumnFilters, quickFilterText],
    );

    if (loading) return <div className="loading"><img src="/Hexes.gif" alt="Loading..." className="img-fluid" /></div>;
    if (error) return <p>{error}</p>;    

    return (
        <div style={{ height: '91vh', width: '100%' }}>
            <div className="unit-data-toolbar">
                <TextField
                    size="small"
                    value={quickFilterText}
                    onChange={handleQuickFilterChange}
                    placeholder="Search all columns"
                    variant="outlined"
                    fullWidth
                />
                <Button onClick={clearFilters} disabled={!hasActiveFilters} variant="text">
                    Clear filters
                </Button>
            </div>
            <div className="ag-theme-alpine unit-data-grid">
                <AgGridReact<Unit>
                    rowData={units}
                    columnDefs={baseColumnDefs}
                    defaultColDef={defaultColDef}
                    animateRows
                    enableCellTextSelection
                    pagination
                    paginationAutoPageSize
                    rowHeight={40}
                    headerHeight={40}
                    onGridReady={onGridReady}
                    onFilterChanged={handleFilterChanged}
                    getRowId={getRowId}
                    suppressDragLeaveHidesColumns
                    suppressCellFocus
                    suppressRowVirtualisation={false}
                />
            </div>

            {/* Dialog for displaying full content */}
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogContent>
                    <div dangerouslySetInnerHTML={{ __html: dialogContent }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default UnitData;
