import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import React, { useEffect, useMemo, useState } from 'react';
import { Ability } from '../../../models/ability';
import { Unit } from '../../../models/unit';
import { addUnits, deleteUnits, getMyUnits } from '../../../services/my_army-service';
import '../unit-data/unit-data.scss';
import { getUnits } from '../../../services/unit-service';

const MyArmy: React.FC = () => {
    const [myUnits, setMyUnits] = useState<Unit[]>([]);
    const [allUnits, setAllUnits] = useState<Unit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dialogContent, setDialogContent] = useState<string>(''); // State to control dialog content
    const [open, setOpen] = useState(false); // State to control dialog open/close
    const [searchQuery, setSearchQuery] = useState<string>(''); // State to store the search query
    const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
    const [showStandardButtons, setShowStandardButtons] = useState(true);

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
                const data = (await getMyUnits())?.data;
                setMyUnits(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch unit data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Generic filter logic: search through all fields of the unit
        const filtered = myUnits.filter(unit => {
            // Loop through each key in the unit and check if the value matches the search query
            return Object.keys(unit).some(key => {
                const value = unit[key as keyof Unit]; // Access the value of each key

                // Ensure the value is a string or can be converted to a string
                if (value && typeof value === 'string') {
                    return value.toLowerCase().includes(searchQuery.toLowerCase());
                }

                // For non-string types (e.g., numbers), convert them to strings before searching
                if (value && typeof value === 'number') {
                    return value.toString().includes(searchQuery.toLowerCase());
                }

                return false;
            });
        });
        setFilteredUnits(filtered);
    }, [searchQuery, myUnits]);

    const handleOpenDialog = (content: string) => {
        setDialogContent(content);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setDialogContent('');
    };

    const handleDelete = async () => {
        if (selectionModel.length === 0) {
            alert('Please select at least one unit to remove.');
            return;
        }

        try {
            await deleteUnits(selectionModel as number[]);
            setMyUnits(prevUnits => prevUnits.filter(unit => !selectionModel.includes(unit.id)));
            setSelectionModel([]);
        } catch (err) {
            console.error('Error deleting units:', err);
            alert('Failed to delete selected units.');
        }
    };

    const handleSaveAdd = async () => {
        if (selectionModel.length === 0) {
            alert('Please select at least one unit to add.');
            return;
        }

        try {
            setLoading(true);
            await addUnits(selectionModel as number[]);
            const data = (await getMyUnits())?.data;
            setMyUnits(data);
            setShowStandardButtons(true);
            setLoading(false);
            setSelectionModel([]);
        } catch (err) {
            console.error('Error saving units:', err);
            alert('Failed to save selected units.');
            setLoading(false);
        }
    };

    const handleDisplayUnitList = async () => {
        try {
            setLoading(true);
            let fullUnitList: Array<Unit> = allUnits;
            if (!allUnits.length) {
                fullUnitList = await getUnits();
                setAllUnits(fullUnitList);
            }
            setMyUnits(fullUnitList.filter(x => !myUnits.map(y => y.id).includes(x.id)));
            setShowStandardButtons(false);
            setSelectionModel([]);
            setLoading(false);
        } catch (err) {
            console.error('Error displaying the unit list:', err);
            alert('Error displaying the unit list.');
            setLoading(false);
        }
    };

    const handleCancelDisplayUnitList = async () => {
        try {
            setLoading(true);
            const data = (await getMyUnits())?.data;
            setMyUnits(data);
            setShowStandardButtons(true);
            setSelectionModel([]);
            setLoading(false);
        } catch (err) {
            console.error('Error displaying your units:', err);
            alert('Error displaying your units.');
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;    

    return (
        <div style={{ height: '91vh', width: '100%' }}>
            {showStandardButtons && (
                <>
                    <Button variant="contained" color="secondary" onClick={handleDisplayUnitList}>
                        Add Units
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleDelete}>
                        Remove Units
                    </Button>
                </>
            )}
            {!showStandardButtons && (
                <>
                    <Button variant="contained" color="secondary" onClick={handleSaveAdd}>
                        Save
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleCancelDisplayUnitList}>
                        Cancel
                    </Button>
                </>
            )}

            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Search units..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '0.5rem', width: '100%' }}
                />
            </div>
            <DataGrid
                rows={filteredUnits}
                columns={generateColumns}
                checkboxSelection
                onRowSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
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

export default MyArmy;
