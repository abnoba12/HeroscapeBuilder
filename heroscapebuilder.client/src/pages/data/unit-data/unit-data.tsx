import { Button, Dialog, DialogActions, DialogContent, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridColumnMenu,
    GridColumnMenuItemProps,
    GridColumnMenuProps,
    GridFilterModel,
    gridFilterModelSelector,
    useGridApiRef,
    useGridApiContext,
    useGridRootProps,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarExport,
    GridToolbarFilterButton,
    GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import React, { useEffect, useMemo, useState } from 'react';
import { Ability } from '../../../models/ability';
import { Unit } from '../../../models/unit';
import { getUnits } from '../../../services/unit-service';
import './unit-data.scss';

const UnitData: React.FC = () => {
    const [units, setUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogContent, setDialogContent] = useState<string>(''); // State to control dialog content
    const [open, setOpen] = useState(false); // State to control dialog open/close
    const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
    const apiRef = useGridApiRef();
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

    const hasActiveFilters = useMemo(
        () => (filterModel.items?.length ?? 0) > 0 || (filterModel.quickFilterValues?.length ?? 0) > 0,
        [filterModel.items, filterModel.quickFilterValues],
    );

    const clearFilters = () => {
        apiRef.current.setFilterModel({ items: [], quickFilterValues: [] });
    };

    const CustomToolbar: React.FC = () => (
        <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
            <GridToolbarQuickFilter debounceMs={300} placeholder="Search..." />
            <Button onClick={clearFilters} disabled={!hasActiveFilters} variant="text">
                Clear filters
            </Button>
        </GridToolbarContainer>
    );

    const CustomColumnMenuFilterItem: React.FC<GridColumnMenuItemProps> = (props) => {
        const { colDef, onClick } = props;
        const apiContext = useGridApiContext();
        const rootProps = useGridRootProps();

        const handleClick = (event: React.MouseEvent) => {
            onClick(event);
            const currentModel = gridFilterModelSelector(apiContext);
            const existingItems = currentModel.items ?? [];
            const hasFilterForField = existingItems.some((item) => item.field === colDef.field);

            if (!hasFilterForField) {
                const defaultOperator = colDef.filterOperators?.[0]?.value ?? 'contains';
                const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
                apiContext.current.setFilterModel({
                    ...currentModel,
                    items: [...existingItems, { id, field: colDef.field, operator: defaultOperator }],
                });
            }

            apiContext.current.showFilterPanel(colDef.field);
        };

        if (rootProps.disableColumnFilter || !colDef.filterable) {
            return null;
        }

        return (
            <MenuItem onClick={handleClick}>
                <ListItemIcon>
                    <rootProps.slots.columnMenuFilterIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{apiContext.current.getLocaleText('columnMenuFilter')}</ListItemText>
            </MenuItem>
        );
    };

    const CustomColumnMenu: React.FC<GridColumnMenuProps> = (props) => (
        <GridColumnMenu
            {...props}
            slots={{
                ...props.slots,
                columnMenuFilterItem: CustomColumnMenuFilterItem,
            }}
        />
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

            {/*checkboxSelection*/}
            <DataGrid
                apiRef={apiRef}
                rows={units}
                columns={generateColumns}
                onFilterModelChange={setFilterModel}
                slots={{ toolbar: CustomToolbar, columnMenu: CustomColumnMenu }}
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
