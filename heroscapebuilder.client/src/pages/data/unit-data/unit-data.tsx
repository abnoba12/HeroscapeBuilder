import { Box, Button, Dialog, DialogActions, DialogContent, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import React, { useEffect, useMemo, useState } from 'react';
import { Ability } from '../../../models/ability';
import { Unit } from '../../../models/unit';
import { getUnits } from '../../../services/unit-service';
import './unit-data.scss';

type FilterOperator = 'contains' | 'equals' | 'startsWith' | 'greaterThan' | 'lessThan';

type CustomFilter = {
    id: number;
    field: string;
    operator: FilterOperator;
    value: string;
};

const UnitData: React.FC = () => {
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogContent, setDialogContent] = useState<string>(''); // State to control dialog content
    const [open, setOpen] = useState(false); // State to control dialog open/close
    const [filters, setFilters] = useState<CustomFilter[]>([]);
    const generateColumns = useMemo((): GridColDef[] => [
        { field: 'creator', headerName: 'Creator', width: 100 },
        { field: 'general', headerName: 'General', width: 70 },
        { field: 'name', headerName: 'Unit Name', width: 250 },
        { field: 'rarity', headerName: 'Rarity', width: 100 },
        { field: 'type', headerName: 'Unit Type', width: 70 },
        { field: 'race', headerName: 'Species', width: 100 },
        { field: 'role', headerName: 'Role', width: 140 },
        { field: 'sizeCategory', headerName: 'Size Category', width: 80 },
        { field: 'size', headerName: 'Size', type: 'number', width: 30 },
        { field: 'personality', headerName: 'Personality', width: 92 },
        { field: 'life', headerName: 'Life', type: 'number', width: 30 },
        { field: 'advAttack', headerName: 'Adv Attack', type: 'number', width: 100 },
        { field: 'advDefense', headerName: 'Adv Defence', type: 'number', width: 100 },
        { field: 'advMove', headerName: 'Adv Move', type: 'number', width: 100 },
        { field: 'advRange', headerName: 'Adv Range', type: 'number', width: 100 },
        { field: 'basicAttack', headerName: 'Basic Attack', type: 'number', width: 100 },
        { field: 'basicDefense', headerName: 'Basic Defence', type: 'number', width: 100 },
        { field: 'basicMove', headerName: 'Basic Move', type: 'number', width: 100 },
        { field: 'basicRange', headerName: 'Basic Range', type: 'number', width: 100 },
        { field: 'points', headerName: 'Points', type: 'number', width: 60 },
        {
            field: 'abilities',
            headerName: 'Abilities',
            width: 200,
            renderCell: (params) =>
            (
                <span
                    className="cell-content"
                    onClick={() =>
                        handleOpenDialog(params.value ? params.value.map((ability: Ability) => `<strong>${ability.abilityName}</strong><br />${ability.ability}`).join('<br /><br />') : '')
                    }
                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                >
                    {params.value ? params.value.map((ability: Ability) => `${ability.abilityName}: ${ability.ability}`).join('<br /><br />') : ''}
                </span>
            )
        },
        { field: 'unitNumbers', headerName: 'unit Numbers', width: 100 },
        {
            field: 'set',
            headerName: 'Set',
            width: 170,
            renderCell: (params) => params.value && params.value.name ? params.value.name : '',
        },
        { field: 'planet', headerName: 'Planet', width: 100 },
        {
            field: 'note', headerName: 'Notes', width: 200,
            renderCell: (params) =>
            (
                <span
                    className="cell-content"
                    onClick={() =>
                        handleOpenDialog(params.value)
                    }
                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                >
                    {params.value}
                </span>
            )
        },
    ], []); // Memoize the columns to prevent unnecessary rerenders and hook issues

    const filterableColumns = useMemo(() => generateColumns.filter((column) => !!column.field && column.field !== 'abilities'), [generateColumns]);

    const addFilter = () => {
        const firstField = filterableColumns[0]?.field ?? 'name';
        setFilters((previous) => ([
            ...previous,
            {
                id: Date.now() + Math.random(),
                field: firstField,
                operator: 'contains',
                value: '',
            },
        ]));
    };

    const updateFilter = (id: number, key: keyof CustomFilter, value: string) => {
        setFilters((previous) => previous.map((filter) => filter.id === id ? { ...filter, [key]: value } : filter));
    };

    const removeFilter = (id: number) => {
        setFilters((previous) => previous.filter((filter) => filter.id !== id));
    };

    const columnTypeLookup = useMemo(() => filterableColumns.reduce<Record<string, string>>((lookup, column) => {
        lookup[column.field] = column.type ?? 'string';
        return lookup;
    }, {}), [filterableColumns]);

    const getFieldOperators = (field: string): FilterOperator[] => (columnTypeLookup[field] === 'number'
        ? ['equals', 'greaterThan', 'lessThan']
        : ['contains', 'equals', 'startsWith']);

    const getComparableValue = (unit: Unit, field: string): string | number => {
        if (field === 'set') {
            return unit.set?.name ?? '';
        }

        const rawValue = (unit as Record<string, unknown>)[field];

        if (rawValue === undefined || rawValue === null) {
            return '';
        }

        if (typeof rawValue === 'number') {
            return rawValue;
        }

        return String(rawValue);
    };

    const filteredUnits = useMemo(() => {
        if (filters.length === 0) {
            return units;
        }

        return units.filter((unit) => filters.every((filter) => {
            if (!filter.value) {
                return true;
            }

            const columnType = columnTypeLookup[filter.field];
            const unitValue = getComparableValue(unit, filter.field);

            if (columnType === 'number' || typeof unitValue === 'number') {
                const numericFilter = Number(filter.value);

                if (Number.isNaN(numericFilter)) {
                    return false;
                }

                switch (filter.operator) {
                    case 'equals':
                        return unitValue === numericFilter;
                    case 'greaterThan':
                        return (unitValue as number) > numericFilter;
                    case 'lessThan':
                        return (unitValue as number) < numericFilter;
                    default:
                        return false;
                }
            }

            const haystack = String(unitValue).toLowerCase();
            const needle = filter.value.toLowerCase();

            switch (filter.operator) {
                case 'equals':
                    return haystack === needle;
                case 'startsWith':
                    return haystack.startsWith(needle);
                default:
                    return haystack.includes(needle);
            }
        }));
    }, [columnTypeLookup, filters, units]);

    const renderToolbar = () => (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
            <GridToolbarQuickFilter debounceMs={300} placeholder="Search..." />
        </GridToolbarContainer>
    );

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


    const handleOpenDialog = (content: string) => {
        setDialogContent(content);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setDialogContent('');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;    

    return (
        <div style={{ height: '91vh', width: '100%' }}>
            <Stack spacing={2} sx={{ height: '100%' }}>
                <Box padding={2} sx={{ backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" marginBottom={1}>
                        <Typography variant="h6" component="div">
                            Filters
                        </Typography>
                        <Button variant="contained" color="primary" onClick={addFilter}>
                            Add filter
                        </Button>
                    </Stack>
                    <Stack spacing={1}>
                        {filters.length === 0 && (
                            <Typography variant="body2" color="text.secondary">
                                Add filters to narrow down the results. Filters are combined using AND logic so every condition must match.
                            </Typography>
                        )}
                        {filters.map((filter) => (
                            <Stack key={filter.id} direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems="center">
                                <Select
                                    value={filter.field}
                                    onChange={(event) => updateFilter(filter.id, 'field', event.target.value)}
                                    size="small"
                                    sx={{ minWidth: 140 }}
                                >
                                    {filterableColumns.map((column) => (
                                        <MenuItem key={column.field} value={column.field}>{column.headerName}</MenuItem>
                                    ))}
                                </Select>
                                <Select
                                    value={filter.operator}
                                    onChange={(event) => updateFilter(filter.id, 'operator', event.target.value)}
                                    size="small"
                                    sx={{ minWidth: 140 }}
                                >
                                    {getFieldOperators(filter.field).map((operator) => (
                                        <MenuItem key={operator} value={operator}>{operator}</MenuItem>
                                    ))}
                                </Select>
                                <TextField
                                    value={filter.value}
                                    onChange={(event) => updateFilter(filter.id, 'value', event.target.value)}
                                    size="small"
                                    label="Value"
                                    sx={{ flexGrow: 1, minWidth: 180 }}
                                />
                                <Button variant="outlined" color="secondary" onClick={() => removeFilter(filter.id)}>
                                    Remove
                                </Button>
                            </Stack>
                        ))}
                    </Stack>
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                    {/*checkboxSelection*/}
                    <DataGrid
                        rows={filteredUnits}
                        columns={generateColumns}
                        slots={{ toolbar: renderToolbar }}
                        disableColumnFilter
                        initialState={{
                            columns: {
                                columnVisibilityModel: {
                                    basicAttack: false,
                                    basicDefense: false,
                                    basicMove: false,
                                    basicRange: false,
                                    unitNumbers: false,
                                    planet: false,
                                    set: false,
                                },
                            },
                        }}
                    />
                </Box>
            </Stack>

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
