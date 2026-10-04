import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import {
    AllCommunityModule,
    ColDef,
    GetRowIdParams,
    FilterChangedEvent,
    GridApi,
    GridReadyEvent,
    ICellRendererParams,
    ModuleRegistry,
    SortChangedEvent,
    ValueGetterParams,
} from 'ag-grid-community';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ability } from '../../../models/ability';
import SelectFloatingFilter from '../../../components/SelectFloatingFilter/SelectFloatingFilter';
import { usePagePointSystem } from '../../../components/PointSystem/PointSystemContext';
import PointSystemPicker from '../../../components/PointSystem/PointSystemPicker';
import { speciesKey } from '../../../models/species';
import { Unit } from '../../../models/unit';
import { getUnits } from '../../../services/unit-service';
import { KeywordText, buildKeywordIndex } from '../../../services/keywords';
import { parseUrlJson, useUrlParam } from '../../../services/url-state';
import './unit-data.scss';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([AllCommunityModule]);

const dropdownFilter = (options: string[]): ColDef => ({
    filter: 'agTextColumnFilter',
    floatingFilterComponent: SelectFloatingFilter,
    floatingFilterComponentParams: { options },
    suppressFloatingFilterButton: true,
});

const UnitData: React.FC = () => {
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogContent, setDialogContent] = useState<React.ReactNode>(null); // State to control dialog content
    const [open, setOpen] = useState(false); // State to control dialog open/close
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [hasColumnFilters, setHasColumnFilters] = useState(false);
    // Search, column filters and sort live in the URL so a link reproduces this exact view.
    const [quickFilterText, setQuickFilterText] = useUrlParam('q');
    const [filtersParam, setFiltersParam] = useUrlParam('filters');
    const [sortParam, setSortParam] = useUrlParam('sort');
    const { pointSystem, setPointSystem, pointsFor, defaultPointSystem } = usePagePointSystem();

    const handleOpenDialog = (content: React.ReactNode) => {
        setDialogContent(content);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setDialogContent(null);
    };

    const keywordIndex = useMemo(() => buildKeywordIndex(units), [units]);

    const dropdownFilterOptions = useMemo(() => {
        const distinctValues = (getValue: (unit: Unit) => string | undefined) =>
            Array.from(new Set(units.map(getValue).filter((value): value is string => !!value)))
                .sort((a, b) => a.localeCompare(b));

        return {
            creator: distinctValues((unit) => unit.creator),
            general: distinctValues((unit) => unit.general),
            rarity: distinctValues((unit) => unit.rarity),
            type: distinctValues((unit) => unit.type),
        };
    }, [units]);

    const baseColumnDefs = useMemo((): ColDef[] => [
        { field: 'creator', headerName: 'Creator', minWidth: 150, ...dropdownFilter(dropdownFilterOptions.creator) },
        { field: 'general', headerName: 'General', minWidth: 160, ...dropdownFilter(dropdownFilterOptions.general) },
        {
            field: 'name',
            headerName: 'Unit Name',
            minWidth: 200,
            cellRenderer: (params: ICellRendererParams<Unit>) =>
                params.data ? <Link to={`/units/${params.data.slug}`}>{params.value}</Link> : params.value,
        },
        { field: 'rarity', headerName: 'Rarity', minWidth: 150, ...dropdownFilter(dropdownFilterOptions.rarity) },
        { field: 'type', headerName: 'Unit Type', minWidth: 140, ...dropdownFilter(dropdownFilterOptions.type) },
        // Filtering compares the singular key, so "Goblin" also finds units printed "Goblins".
        { field: 'race', headerName: 'Species', minWidth: 140, filterValueGetter: (params: ValueGetterParams<Unit>) => speciesKey(params.data?.race) },
        { field: 'role', headerName: 'Role', minWidth: 160 },
        { field: 'sizeCategory', headerName: 'Size Category', minWidth: 140 },
        { field: 'size', headerName: 'Height', filter: 'agNumberColumnFilter', maxWidth: 110 },
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
        {
            colId: 'points',
            headerName: `Points (${pointSystem})`,
            headerTooltip: `${pointSystem} points. Units without a ${pointSystem} value use Standard.`,
            valueGetter: (params: ValueGetterParams<Unit, number>) => pointsFor(params.data),
            filter: 'agNumberColumnFilter',
            minWidth: 150,
            maxWidth: 170,
        },
        {
            field: 'abilities',
            headerName: 'Abilities',
            minWidth: 220,
            valueGetter: (params: ValueGetterParams<Unit, string>) =>
                params.data?.abilities?.map((ability: Ability) => `${ability.abilityName}: ${ability.ability}`).join(' | ') ?? '',
            cellRenderer: (params: ICellRendererParams<Unit>) => {
                const abilities = params.data?.abilities ?? [];
                const renderedContent = abilities.map((ability: Ability, index) => (
                    <p key={ability.id ?? index} style={{ margin: index === 0 ? 0 : '1em 0 0' }}>
                        <strong>{ability.abilityName}</strong><br />
                        <KeywordText text={ability.ability ?? ''} index={keywordIndex} unitName={params.data?.name} onNavigate={handleCloseDialog} />
                    </p>
                ));
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
                    onClick={() => handleOpenDialog(<span dangerouslySetInnerHTML={{ __html: params.value }} />)}
                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                >
                    {params.value}
                </span>
            ),
        },
        {
            field: 'stlUrls',
            headerName: '3D Models',
            minWidth: 260,
            autoHeight: true,
            wrapText: false,
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
                                &#9830;STL{index + 1}
                            </a>
                        ))}
                    </div>
                );
            },
            cellStyle: { display: 'flex', alignItems: 'center' },
        },
    ], [dropdownFilterOptions, pointSystem, pointsFor, keywordIndex]);

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

        const filterModel = parseUrlJson<Record<string, unknown>>(filtersParam);
        if (filterModel) params.api.setFilterModel(filterModel);

        const sortState = sortParam.split(',').filter(Boolean).map((entry, sortIndex) => {
            const [colId, direction] = entry.split(':');
            return { colId, sort: direction === 'desc' ? 'desc' as const : 'asc' as const, sortIndex };
        });
        if (sortState.length) params.api.applyColumnState({ state: sortState, defaultState: { sort: null } });
    };

    // A link from the ability dialog changes the URL while this page stays mounted, so apply it to the grid.
    useEffect(() => {
        if (!gridApi) return;
        const filterModel = parseUrlJson<Record<string, unknown>>(filtersParam) ?? null;
        if (JSON.stringify(filterModel ?? {}) !== JSON.stringify(gridApi.getFilterModel() ?? {})) {
            gridApi.setFilterModel(filterModel);
        }
        gridApi.setGridOption('quickFilterText', quickFilterText);
    }, [filtersParam, quickFilterText, gridApi]);

    const handleSortChanged =(event: SortChangedEvent) => {
        const sorted = event.api.getColumnState()
            .filter(column => column.sort)
            .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0))
            .map(column => `${column.colId}:${column.sort}`);
        setSortParam(sorted.join(','));
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

    const handleFilterChanged = (event: FilterChangedEvent) => {
        const filterModel = event.api.getFilterModel();
        const hasFilters = Object.keys(filterModel).length > 0;
        setHasColumnFilters(hasFilters);
        setFiltersParam(hasFilters ? JSON.stringify(filterModel) : '');
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
                <PointSystemPicker value={pointSystem} onChange={setPointSystem} defaultValue={defaultPointSystem} />
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
                    onSortChanged={handleSortChanged}
                    getRowId={getRowId}
                    suppressDragLeaveHidesColumns
                    suppressCellFocus
                    suppressRowVirtualisation={false}
                />
            </div>

            {/* Dialog for displaying full content */}
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogContent>{dialogContent}</DialogContent>
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
