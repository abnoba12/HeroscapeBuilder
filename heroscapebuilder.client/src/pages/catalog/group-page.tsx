import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CatalogLoading, CatalogMessage, CatalogShell, SectionTitle, UnitGrid, UnitTile } from '../../components/Catalog/CatalogParts';
import { HubAccent } from '../../components/HubCards/HubCards';
import PointSystemPicker from '../../components/PointSystem/PointSystemPicker';
import { usePagePointSystem } from '../../components/PointSystem/PointSystemContext';
import PageMeta from '../../components/Seo/PageMeta';
import { getCreatorInfo } from '../../models/creator';
import { speciesKey } from '../../models/species';
import { Unit } from '../../models/unit';
import {
    GroupKind,
    UnitGroup,
    average,
    describeGroup,
    metaDescribeGroup,
    getPrimaryImage,
    groupPath,
    pickSpelling,
    slugify,
    useCatalog,
} from '../../services/catalog';
import { useUrlEnum } from '../../services/url-state';

interface KindInfo {
    accent: HubAccent;
    singular: string;
    plural: string;
    title: (name: string) => string;
}

const KINDS: Record<GroupKind, KindInfo> = {
    species: {
        accent: 'green',
        singular: 'Species',
        plural: 'Species',
        title: name => `${name} Heroscape Units - Stats & Cards`,
    },
    generals: {
        accent: 'purple',
        singular: 'General',
        plural: 'Generals',
        title: name => `${name} Heroscape Units - Army Stats & Cards`,
    },
    sets: {
        accent: 'orange',
        singular: 'Set',
        plural: 'Sets',
        title: name => `${name} - Heroscape Set Contents & Cards`,
    },
};

type SortKey = 'name' | 'points' | 'life' | 'attack';
const SORT_KEYS: readonly SortKey[] = ['name', 'points', 'life', 'attack'];

const countBy = (
    units: Unit[],
    key: (unit: Unit) => string | undefined,
    normalize: (value: string) => string = value => value,
): Array<{ name: string; count: number }> => {
    const groups = new Map<string, { count: number; spellings: Map<string, number> }>();
    for (const unit of units) {
        const value = key(unit)?.trim();
        if (!value) continue;
        const group = groups.get(normalize(value)) ?? { count: 0, spellings: new Map<string, number>() };
        group.count++;
        group.spellings.set(value, (group.spellings.get(value) ?? 0) + 1);
        groups.set(normalize(value), group);
    }
    return [...groups.values()]
        .map(group => ({ name: pickSpelling(group.spellings, normalize), count: group.count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
};

const GroupContent: React.FC<{ kind: GroupKind; group: UnitGroup }> = ({ kind, group }) => {
    const info = KINDS[kind];
    const { pointSystem, setPointSystem, pointsFor, defaultPointSystem } = usePagePointSystem();
    const [sort, setSort] = useUrlEnum<SortKey>('sort', SORT_KEYS, 'name');

    const sorted = useMemo(() => {
        const list = [...group.units];
        const desc = (value: (unit: Unit) => number | undefined | null) =>
            list.sort((a, b) => (value(b) ?? -1) - (value(a) ?? -1) || (a.name ?? '').localeCompare(b.name ?? ''));
        if (sort === 'points') return desc(unit => pointsFor(unit));
        if (sort === 'life') return desc(unit => unit.life);
        if (sort === 'attack') return desc(unit => unit.advAttack);
        return list;
    }, [group.units, sort, pointsFor]);

    const avgLife = average(group.units.map(unit => unit.life));
    const avgPoints = average(group.units.map(unit => pointsFor(unit)));
    const priciest = group.units.reduce<Unit | undefined>((best, unit) => ((pointsFor(unit) ?? -1) > (pointsFor(best) ?? -1) ? unit : best), undefined);

    const sets = group.units.map(unit => unit.set).filter((set): set is NonNullable<Unit['set']> => !!set);
    const firstSet = sets[0];
    const creators = [...new Set(group.units.map(unit => unit.creator))];

    const speciesCounts = kind !== 'species' ? countBy(group.units, unit => unit.race, speciesKey) : [];
    const generalCounts = kind !== 'generals' ? countBy(group.units, unit => unit.general) : [];
    const setCounts = kind !== 'sets' ? countBy(group.units, unit => unit.set?.name) : [];

    const intro = kind === 'sets' && firstSet
        ? [firstSet.type, firstSet.wave && `Wave ${firstSet.wave}`, firstSet.releaseDate && `Released ${firstSet.releaseDate.slice(0, 4)}`].filter(Boolean).join(' - ')
        : describeGroup(kind, group);

    return (
        <CatalogShell
            accent={info.accent}
            title={group.name}
            intro={intro}
            badges={creators.map(creator => getCreatorInfo(creator)?.label ?? creator).slice(0, 3)}
            crumbs={[{ label: 'Home', to: '/' }, { label: info.plural, to: `/${kind}` }, { label: group.name }]}
        >
            <div className="catalog-summary">
                <div className="catalog-summary-item"><strong>{group.units.length}</strong><span>{kind === 'sets' ? 'Figures' : 'Units'}</span></div>
                {avgLife != null && <div className="catalog-summary-item"><strong>{avgLife.toFixed(1)}</strong><span>Avg Life</span></div>}
                {avgPoints != null && <div className="catalog-summary-item"><strong>{avgPoints.toFixed(0)}</strong><span>Avg {pointSystem} pts</span></div>}
                {priciest && (
                    <div className="catalog-summary-item">
                        <strong>{pointsFor(priciest)}</strong>
                        <span>Priciest: <Link to={`/units/${priciest.slug}`}>{priciest.name}</Link></span>
                    </div>
                )}
            </div>

            <SectionTitle>{kind === 'sets' ? 'Units in This Set' : `${group.name} Units`}</SectionTitle>
            <div className="catalog-toolbar">
                <label>
                    Sort by&nbsp;
                    <select value={sort} onChange={event => setSort(event.target.value as SortKey)}>
                        <option value="name">Name</option>
                        <option value="points">Points (high to low)</option>
                        <option value="life">Life (high to low)</option>
                        <option value="attack">Attack (high to low)</option>
                    </select>
                </label>
                <PointSystemPicker value={pointSystem} onChange={setPointSystem} defaultValue={defaultPointSystem} />
            </div>
            <UnitGrid>
                {sorted.map(unit => (
                    <UnitTile
                        key={unit.id}
                        unit={unit}
                        points={pointsFor(unit)}
                        subtitle={kind === 'species' ? unit.general : unit.race}
                    />
                ))}
            </UnitGrid>

            {[
                { label: 'Species', kind: 'species' as GroupKind, items: speciesCounts },
                { label: 'Generals', kind: 'generals' as GroupKind, items: generalCounts },
                { label: 'Sets', kind: 'sets' as GroupKind, items: setCounts },
            ].filter(section => section.items.length > 0).map(section => (
                <React.Fragment key={section.kind}>
                    <SectionTitle>{section.label} in {group.name}</SectionTitle>
                    <div className="catalog-chips">
                        {section.items.map(item => (
                            <Link key={item.name} className="catalog-chip" to={groupPath(section.kind, item.name)}>
                                {item.name}<small>{item.count}</small>
                            </Link>
                        ))}
                    </div>
                </React.Fragment>
            ))}

        </CatalogShell>
    );
};

const GroupPage: React.FC<{ kind: GroupKind }> = ({ kind }) => {
    const { slug } = useParams<{ slug: string }>();
    const { catalog, error } = useCatalog();
    const info = KINDS[kind];
    // Old species links used the printed spelling ("goblins"); fold those onto the singular page.
    const group = catalog && slug
        ? catalog[kind].get(slugify(slug)) ?? (kind === 'species' ? catalog.species.get(slugify(speciesKey(slug.replace(/-/g, ' ')))) : undefined)
        : undefined;

    if (error) {
        return <PageMeta title={info.singular} description={`Heroscape ${info.singular.toLowerCase()}`} noindex><CatalogMessage title="Could not load this page.">Please try again in a moment.</CatalogMessage></PageMeta>;
    }
    if (!catalog) {
        return <PageMeta title={`Heroscape ${info.singular}`} description={`Heroscape ${info.singular.toLowerCase()} units, stats and printable army cards.`}><CatalogLoading /></PageMeta>;
    }
    if (!group) {
        return (
            <PageMeta title={`${info.singular} Not Found`} description="That page could not be found." noindex>
                <CatalogMessage title={`We couldn't find that ${info.singular.toLowerCase()}.`}>
                    <Link to={`/${kind}`}>Browse all {info.plural.toLowerCase()}</Link>
                </CatalogMessage>
            </PageMeta>
        );
    }

    return (
        <PageMeta
            title={info.title(group.name)}
            description={metaDescribeGroup(kind, group)}
            canonicalPath={`/${kind}/${group.slug}`}
            image={group.units.map(getPrimaryImage).find(Boolean)}
        >
            <GroupContent kind={kind} group={group} />
        </PageMeta>
    );
};

export default GroupPage;
