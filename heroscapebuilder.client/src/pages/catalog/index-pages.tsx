import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CatalogLoading, CatalogMessage, CatalogShell } from '../../components/Catalog/CatalogParts';
import { HubAccent } from '../../components/HubCards/HubCards';
import PageMeta from '../../components/Seo/PageMeta';
import { getCreatorInfo } from '../../models/creator';
import { GroupKind, UnitGroup, getPrimaryImage, useCatalog } from '../../services/catalog';
import { useUrlParam } from '../../services/url-state';

interface GroupIndexConfig {
    kind: GroupKind;
    accent: HubAccent;
    title: string;
    description: string;
    unitNoun: string;
}

const GROUP_INDEXES: Record<GroupKind, GroupIndexConfig> = {
    species: {
        kind: 'species',
        accent: 'green',
        title: 'Heroscape Species',
        description: 'Every Heroscape species and the units that belong to them.',
        unitNoun: 'unit',
    },
    generals: {
        kind: 'generals',
        accent: 'purple',
        title: 'Heroscape Generals',
        description: 'Every Heroscape general and the units that serve them.',
        unitNoun: 'unit',
    },
    sets: {
        kind: 'sets',
        accent: 'orange',
        title: 'Heroscape Sets',
        description: 'Every Heroscape set and the units that come in each box.',
        unitNoun: 'figure',
    },
};

const releaseYear = (group: UnitGroup): number =>
    Number(group.units.find(unit => unit.set?.releaseDate)?.set?.releaseDate?.slice(0, 4) ?? 9999);

/** Browse species, generals or sets. */
export const GroupIndexPage: React.FC<{ kind: GroupKind }> = ({ kind }) => {
    const config = GROUP_INDEXES[kind];
    const { catalog, error } = useCatalog();
    const [query, setQuery] = useUrlParam('q');

    const groups = useMemo(() => {
        const list = [...(catalog?.[kind].values() ?? [])];
        // Sets read best in release order, species by size (largest first), generals alphabetically.
        if (kind === 'sets') return list.sort((a, b) => releaseYear(a) - releaseYear(b) || a.name.localeCompare(b.name));
        if (kind === 'species') return list.sort((a, b) => b.units.length - a.units.length || a.name.localeCompare(b.name));
        return list.sort((a, b) => a.name.localeCompare(b.name));
    }, [catalog, kind]);

    const filtered = groups.filter(group => group.name.toLowerCase().includes(query.trim().toLowerCase()));

    return (
        <PageMeta title={config.title} description={config.description} canonicalPath={`/${kind}`}>
            {error ? <CatalogMessage title="Could not load this page.">Please try again in a moment.</CatalogMessage>
                : !catalog ? <CatalogLoading />
                : (
                    <CatalogShell
                        accent={config.accent}
                        title={config.title}
                        intro={config.description}
                        crumbs={[{ label: 'Home', to: '/' }, { label: config.title.replace('Heroscape ', '') }]}
                    >
                        <div className="catalog-toolbar">
                            <input
                                type="search"
                                placeholder={`Search ${kind}`}
                                value={query}
                                onChange={event => setQuery(event.target.value)}
                                aria-label={`Search ${kind}`}
                            />
                        </div>
                        <div className="catalog-grid">
                            {filtered.map(group => {
                                const sample = group.units.find(unit => getPrimaryImage(unit));
                                const image = sample && getPrimaryImage(sample);
                                const creator = kind === 'sets' ? group.units.find(unit => unit.set)?.set?.creator : undefined;
                                const creatorInfo = getCreatorInfo(creator);
                                return (
                                    <Link key={group.slug} to={`/${kind}/${group.slug}`} className="catalog-tile">
                                        <div className="catalog-tile-name catalog-tile-name--top">{group.name}</div>
                                        <div className="catalog-tile-art">
                                            {image
                                                ? <img src={image} alt={`${group.name} unit card`} loading="lazy" decoding="async" />
                                                : <span className="catalog-tile-noimage" aria-hidden="true">&#x2B21;</span>}
                                        </div>
                                        {creator && (
                                            <div className="catalog-tile-creator" title={creatorInfo?.label ?? creator}>
                                                {creatorInfo
                                                    ? <img src={creatorInfo.logo} alt={creatorInfo.label} />
                                                    : <span>{creator}</span>}
                                            </div>
                                        )}
                                        <div className="catalog-tile-stats">
                                            <span>{group.units.length} {config.unitNoun}{group.units.length === 1 ? '' : 's'}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </CatalogShell>
                )}
        </PageMeta>
    );
};
