import React from 'react';
import { getCreatorInfo } from '../../models/creator';
import { CreatorFilter as CreatorFilterState } from '../../services/creator-filter';

/** One checkbox per creator; unchecking hides that creator's units. */
const CreatorFilter: React.FC<{ filter: CreatorFilterState }> = ({ filter }) => {
    if (filter.creators.length < 2) return null;

    return (
        <fieldset className="catalog-creator-filter">
            <legend>Show units from</legend>
            {filter.creators.map(creator => (
                <label key={creator} title={getCreatorInfo(creator)?.label ?? creator}>
                    <input
                        type="checkbox"
                        checked={!filter.hidden.has(creator)}
                        onChange={() => filter.toggle(creator)}
                    />
                    {creator}
                </label>
            ))}
            {filter.hidden.size > 0 && (
                <button type="button" className="catalog-btn" onClick={filter.clear}>Show all</button>
            )}
        </fieldset>
    );
};

export default CreatorFilter;
