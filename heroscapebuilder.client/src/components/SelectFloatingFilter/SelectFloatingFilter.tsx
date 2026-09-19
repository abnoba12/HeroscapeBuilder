import { IFilter } from 'ag-grid-community';
import { CustomFloatingFilterProps } from 'ag-grid-react';
import React from 'react';
import { Unit } from '../../models/unit';

interface TextFilterModel {
    filterType: 'text';
    type: 'equals';
    filter: string;
}

export interface SelectFloatingFilterParams {
    options: string[];
}

const SelectFloatingFilter: React.FC<CustomFloatingFilterProps<IFilter, Unit, unknown, TextFilterModel> & SelectFloatingFilterParams> = ({
    model,
    onModelChange,
    options,
}) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        onModelChange(value ? { filterType: 'text', type: 'equals', filter: value } : null);
    };

    return (
        <select
            className="select-floating-filter"
            value={model?.filter ?? ''}
            onChange={handleChange}
            aria-label="Filter"
        >
            <option value="">All</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};

export default SelectFloatingFilter;
