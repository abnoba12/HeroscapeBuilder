import { Button, Divider, ListItemText, Menu, MenuItem, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { POINT_SYSTEMS, PointSystem } from '../../models/point-system';
import { isAuthenticated } from '../../services/authService';

interface PointSystemPickerProps {
    value: PointSystem;
    onChange: (system: PointSystem) => void;
    /** The account default, marked in the menu so the viewer can switch back to it. */
    defaultValue: PointSystem;
}

/**
 * A low-key "Renegade points ▾" control for pages that show points. It changes the point system for the
 * current page only; the account default is set on the Profile page.
 */
const PointSystemPicker: React.FC<PointSystemPickerProps> = ({ value, onChange, defaultValue }) => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const overridden = value !== defaultValue;

    const choose = (system: PointSystem) => {
        onChange(system);
        setAnchor(null);
    };

    return (
        <>
            <Button
                size="small"
                variant="text"
                color={overridden ? 'warning' : 'inherit'}
                onClick={event => setAnchor(event.currentTarget)}
                aria-haspopup="menu"
                aria-label={`Point system: ${value}. Change the point system for this page`}
                title="Change the point system for this page"
                sx={{ textTransform: 'none', whiteSpace: 'nowrap', minWidth: 0, opacity: overridden ? 1 : 0.75 }}
            >
                {`${value} points ▾`}
            </Button>
            <Menu anchorEl={anchor} open={anchor !== null} onClose={() => setAnchor(null)}>
                <Typography variant="caption" color="text.secondary" sx={{ px: 2, display: 'block' }}>
                    Point system for this page
                </Typography>
                {POINT_SYSTEMS.map(system => (
                    <MenuItem key={system.value} selected={system.value === value} onClick={() => choose(system.value)} sx={{ maxWidth: 340 }}>
                        <ListItemText
                            primary={system.value === defaultValue ? `${system.label} (your default)` : system.label}
                            secondary={system.description}
                            secondaryTypographyProps={{ sx: { whiteSpace: 'normal' } }}
                        />
                    </MenuItem>
                ))}
                <Divider />
                <Typography variant="caption" color="text.secondary" sx={{ px: 2, display: 'block', maxWidth: 340 }}>
                    {isAuthenticated()
                        ? <>Set your default in your <Link to="/user/profile" onClick={() => setAnchor(null)}>Profile</Link>.</>
                        : <><Link to="/user/login" onClick={() => setAnchor(null)}>Log in</Link> to save a default point system.</>}
                </Typography>
            </Menu>
        </>
    );
};

export default PointSystemPicker;
