import { Alert, Stack, TextField, Typography } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ColDef, GetRowIdParams, ModuleRegistry, ValueGetterParams } from 'ag-grid-community';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Unit } from '../../models/unit';
import { getSharedCollection } from '../../services/my_army-service';
import { isNotFound } from '../../services/armybuilder-service';
import { useUrlParam } from '../../services/url-state';
import '../data/unit-data/unit-data.scss';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([AllCommunityModule]);

/** Public, read-only list of the units someone shared from My Collection. */
const SharedCollection: React.FC = () => {
    const { shareId } = useParams();
    const [units, setUnits] = useState<Unit[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [quickFilterText, setQuickFilterText] = useUrlParam('q');

    useEffect(() => {
        document.body.classList.add('unit-data-active');
        return () => {
            document.body.classList.remove('unit-data-active');
        };
    }, []);

    useEffect(() => {
        const load = async () => {
            try {
                setUnits(await getSharedCollection(shareId ?? ''));
            } catch (err) {
                setError(isNotFound(err)
                    ? 'This collection is not available. The link may be wrong, or the owner may have stopped sharing it.'
                    : 'Failed to load the collection.');
            }
        };
        load();
    }, [shareId]);

    const columnDefs = useMemo<ColDef<Unit>[]>(() => [
        { field: 'name', headerName: 'Unit Name', minWidth: 220, pinned: 'left' },
        { field: 'quantity', headerName: 'Quantity', filter: 'agNumberColumnFilter', width: 120, minWidth: 120, flex: 0 },
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

    const defaultColDef = useMemo<ColDef>(() => ({
        filter: true,
        sortable: true,
        resizable: true,
        floatingFilter: true,
        flex: 1,
        minWidth: 120,
    }), []);

    if (error) {
        return (
            <div className="container-fluid">
                <Alert severity="warning">{error}</Alert>
            </div>
        );
    }
    if (!units) return <div className="loading"><img src="/Hexes.gif" alt="Loading..." className="img-fluid" /></div>;

    return (
        <div style={{ height: '91vh', width: '100%' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }} className="unit-data-toolbar">
                <div>
                    <Typography variant="overline" color="text.secondary">Shared Collection</Typography>
                    <Typography variant="body2">Units available to pick from (read-only).</Typography>
                </div>
                <TextField
                    size="small"
                    value={quickFilterText}
                    onChange={event => setQuickFilterText(event.target.value)}
                    placeholder="Search this collection"
                    variant="outlined"
                    fullWidth
                />
                <Typography variant="body2" sx={{ marginLeft: 'auto', minWidth: 140 }}>
                    {`Units: ${units.length}`}
                </Typography>
            </Stack>
            <div className="ag-theme-alpine unit-data-grid">
                <AgGridReact<Unit>
                    rowData={units}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    quickFilterText={quickFilterText}
                    animateRows
                    enableCellTextSelection
                    pagination
                    paginationAutoPageSize
                    rowHeight={40}
                    headerHeight={40}
                    getRowId={(params: GetRowIdParams<Unit>) => params.data.id?.toString()}
                    suppressCellFocus
                />
            </div>
        </div>
    );
};

export default SharedCollection;
