import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Catalog, loadCatalog } from '../../services/catalog';
import './unit-search.scss';

const MAX_RESULTS = 8;

/** Find a unit by name from anywhere on the site. The unit list is only fetched once the box is first used. */
const UnitSearch: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
    const navigate = useNavigate();
    const [catalog, setCatalog] = useState<Catalog | null>(null);
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);

    const results = useMemo(() => {
        const needle = query.trim().toLowerCase();
        if (!catalog || !needle) return [];
        const matches = catalog.units.filter(unit => unit.name?.toLowerCase().includes(needle));
        // Names that start with the search come first.
        matches.sort((a, b) =>
            Number(b.name.toLowerCase().startsWith(needle)) - Number(a.name.toLowerCase().startsWith(needle)) ||
            a.name.localeCompare(b.name));
        return matches.slice(0, MAX_RESULTS);
    }, [catalog, query]);

    const go = (slug: string) => {
        setQuery('');
        onNavigate?.();
        navigate(`/units/${slug}`);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActive(index => Math.min(index + 1, results.length - 1));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActive(index => Math.max(index - 1, 0));
        } else if (event.key === 'Enter' && results[active]) {
            go(results[active].slug);
        } else if (event.key === 'Escape') {
            setQuery('');
        }
    };

    return (
        <div className="unit-search">
            <input
                type="search"
                placeholder="Find a unit..."
                aria-label="Find a unit by name"
                value={query}
                onFocus={() => { if (!catalog) loadCatalog().then(setCatalog).catch(() => undefined); }}
                onChange={event => { setQuery(event.target.value); setActive(0); }}
                onKeyDown={handleKeyDown}
            />
            {query.trim() && (
                <ul className="unit-search-results">
                    {results.length === 0 ? (
                        <li className="unit-search-empty">{catalog ? 'No units found' : 'Loading...'}</li>
                    ) : results.map((unit, index) => (
                        <li key={unit.id} className={index === active ? 'active' : ''}>
                            <button type="button" onMouseDown={event => event.preventDefault()} onClick={() => go(unit.slug)}>
                                {unit.name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UnitSearch;
