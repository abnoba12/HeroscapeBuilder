import React from 'react';
import { TerrainTypeOption } from '../models/map';

/** A terrain type's name; types with special rules show them on hover. */
const TerrainName: React.FC<{ type: Pick<TerrainTypeOption, 'name' | 'specialRules'> }> = ({ type }) => {
    if (!type.specialRules) return <>{type.name}</>;
    return (
        <span title={`${type.name}: ${type.specialRules}`} tabIndex={0}
            style={{ cursor: 'help', textDecoration: 'underline dotted' }}>
            {type.name}
        </span>
    );
};

export default TerrainName;
