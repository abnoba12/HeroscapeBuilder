import { MenuItem, TextField } from '@mui/material';
import React from 'react';
import { POINT_SYSTEMS, PointSystem } from '../../models/point-system';

interface PointSystemSelectProps {
    value: PointSystem;
    onChange: (system: PointSystem) => void;
    label?: string;
    size?: 'small' | 'medium';
    sx?: object;
}

/** Form dropdown for a saved point system setting (e.g. a Battlegroup's). */
const PointSystemSelect: React.FC<PointSystemSelectProps> = ({ value, onChange, label = 'Point system', size = 'small', sx }) => (
    <TextField
        select
        label={label}
        value={value}
        onChange={event => onChange(event.target.value as PointSystem)}
        size={size}
        sx={{ minWidth: 150, ...sx }}
    >
        {POINT_SYSTEMS.map(system => (
            <MenuItem key={system.value} value={system.value} title={system.description}>
                {system.label}
            </MenuItem>
        ))}
    </TextField>
);

export default PointSystemSelect;
