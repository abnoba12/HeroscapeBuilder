import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
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
    const [searchQuery, setSearchQuery] = useState<string>(''); // State to store the search query
    const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);

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
        { field: 'advAttack', headerName: 'Adv Attack', type: 'number', width: 30 },
        { field: 'advDefense', headerName: 'Adv Defence', type: 'number', width: 30 },
        { field: 'advMove', headerName: 'Adv Move', type: 'number', width: 30 },
        { field: 'advRange', headerName: 'Adv Range', type: 'number', width: 30 },
        { field: 'basicAttack', headerName: 'Basic Attack', type: 'number', width: 30 },
        { field: 'basicDefense', headerName: 'Basic Defence', type: 'number', width: 30 },
        { field: 'basicMove', headerName: 'Basic Move', type: 'number', width: 30 },
        { field: 'basicRange', headerName: 'Basic Range', type: 'number', width: 30 },
        { field: 'points', headerName: 'Points', type: 'number', width: 30 },
        {
            field: 'abilities',
            headerName: 'Abilities',
            width: 300,
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
            field: 'note', headerName: 'Notes', width: 130,
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
                const data = await getUnits();
                setUnits(data);
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
        const filtered = units.filter(unit => {
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
    }, [searchQuery, units]);

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
            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Search units..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '0.5rem', width: '100%' }}
                />
            </div>

            {/*checkboxSelection*/}
            <DataGrid
                rows={filteredUnits}
                columns={generateColumns}
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
