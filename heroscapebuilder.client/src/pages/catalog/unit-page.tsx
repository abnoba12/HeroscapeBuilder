import React, { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CatalogLoading, CatalogMessage, CatalogShell, SectionTitle, UnitGrid, UnitTile } from '../../components/Catalog/CatalogParts';
import { usePagePointSystem } from '../../components/PointSystem/PointSystemContext';
import PageMeta from '../../components/Seo/PageMeta';
import { getCreatorInfo } from '../../models/creator';
import { getUnitPoints } from '../../models/point-system';
import { Unit } from '../../models/unit';
import {
    CARD_KINDS,
    Catalog,
    average,
    describeUnit,
    getCardFile,
    getHitboxImage,
    getPrimaryImage,
    groupPath,
    unitPath,
    useCatalog,
} from '../../services/catalog';

const RELATED_LIMIT = 12;

const Stat: React.FC<{ label: string; value?: number | string | null }> = ({ label, value }) => (
    value == null ? null : (
        <div className="unit-stat">
            <div className="unit-stat-value">{value}</div>
            <div className="unit-stat-label">{label}</div>
        </div>
    )
);

const DetailRow: React.FC<{ label: string; children?: React.ReactNode }> = ({ label, children }) => (
    children == null || children === '' ? null : <tr><th scope="row">{label}</th><td>{children}</td></tr>
);

const UnitPageContent: React.FC<{ unit: Unit; catalog: Catalog }> = ({ unit, catalog }) => {
    const navigate = useNavigate();
    const { pointsFor, pointSystem } = usePagePointSystem();
    const points = pointsFor(unit);
    const image = getPrimaryImage(unit);
    const hitbox = getHitboxImage(unit);
    const creator = getCreatorInfo(unit.creator);

    const setUnits = useMemo(
        () => (unit.set ? catalog.units.filter(other => other.set?.id === unit.set?.id) : []),
        [catalog, unit],
    );
    const setIndex = setUnits.findIndex(other => other.id === unit.id);
    const previous = setIndex > 0 ? setUnits[setIndex - 1] : undefined;
    const next = setIndex >= 0 && setIndex < setUnits.length - 1 ? setUnits[setIndex + 1] : undefined;

    const related = useMemo(() => {
        const pool = catalog.units.filter(other => other.id !== unit.id);
        const sameSet = new Set(setUnits.map(other => other.id));
        const similar = pool.filter(other => !sameSet.has(other.id) && other.race && other.race === unit.race);
        // Prefer units that share both the species and the general, then fall back to the rest of the species.
        similar.sort((a, b) => Number(b.general === unit.general) - Number(a.general === unit.general));
        return similar.slice(0, RELATED_LIMIT);
    }, [catalog, unit, setUnits]);

    const speciesAverage = useMemo(() => {
        if (!unit.race) return undefined;
        const peers = catalog.units.filter(other => other.race === unit.race);
        return { count: peers.length, life: average(peers.map(p => p.life)), points: average(peers.map(p => pointsFor(p))) };
    }, [catalog, unit.race, pointsFor]);

    const goRandom = () => {
        const others = catalog.units.filter(other => other.id !== unit.id);
        navigate(unitPath(others[Math.floor(Math.random() * others.length)]));
    };

    const intro = [unit.race, unit.role, unit.type].filter(Boolean).join(' - ');
    const badges = [unit.rarity, unit.sizeCategory, unit.set?.name].filter((v): v is string => !!v);
    const cardFiles = CARD_KINDS
        .map(kind => ({ kind, file: getCardFile(unit, kind.purpose) }))
        .filter(entry => entry.file);

    return (
        <CatalogShell
            accent="blue"
            title={unit.name}
            intro={intro}
            badges={badges}
            crumbs={[{ label: 'Home', to: '/' }, { label: 'Unit Data', to: '/data/unit-data' }, { label: unit.name }]}
        >
            <div className="unit-layout">
                <aside>
                    {image ? (
                        <a className="unit-art" href={cardFiles[0]?.file?.filePath ?? image} target="_blank" rel="noopener noreferrer">
                            <img src={image} alt={`${unit.name} Heroscape army card`} />
                            <div className="unit-art-caption">Click to open the full card</div>
                        </a>
                    ) : (
                        <div className="unit-art"><div className="unit-art-caption">No card image yet for this unit.</div></div>
                    )}
                    {hitbox && (
                        <div className="unit-hitbox">
                            <img src={hitbox} alt={`${unit.name} hitbox`} loading="lazy" />
                            <span>Hitbox footprint</span>
                        </div>
                    )}
                </aside>

                <div>
                    <div className="unit-stats">
                        <Stat label="Life" value={unit.life} />
                        <Stat label="Move" value={unit.advMove} />
                        <Stat label="Range" value={unit.advRange} />
                        <Stat label="Attack" value={unit.advAttack} />
                        <Stat label="Defense" value={unit.advDefense} />
                        <Stat label={`Points (${pointSystem})`} value={points} />
                    </div>

                    <p className="unit-about">{describeUnit(unit, points)}</p>

                    <SectionTitle>Unit Details</SectionTitle>
                    <table className="unit-details">
                        <tbody>
                            <DetailRow label="Species">{unit.race && <Link to={groupPath('species', unit.race)}>{unit.race}</Link>}</DetailRow>
                            <DetailRow label="General">{unit.general && <Link to={groupPath('generals', unit.general)}>{unit.general}</Link>}</DetailRow>
                            <DetailRow label="Role">{unit.role}</DetailRow>
                            <DetailRow label="Unit type">{unit.type}</DetailRow>
                            <DetailRow label="Rarity">{unit.rarity}</DetailRow>
                            <DetailRow label="Personality">{unit.personality}</DetailRow>
                            <DetailRow label="Size">{[unit.sizeCategory, unit.size != null && `height ${unit.size}`].filter(Boolean).join(', ')}</DetailRow>
                            <DetailRow label="Home planet">{unit.planet}</DetailRow>
                            <DetailRow label="Set">{unit.set && <Link to={groupPath('sets', unit.set.name)}>{unit.set.name}</Link>}</DetailRow>
                            <DetailRow label="Released">{unit.set?.releaseDate?.slice(0, 4)}</DetailRow>
                            <DetailRow label="Unit numbers">{unit.unitNumbers}</DetailRow>
                            <DetailRow label="Creator">{creator?.label ?? unit.creator}</DetailRow>
                            <DetailRow label="Points">
                                {getUnitPoints(unit, 'Renegade') != null && (
                                    <>
                                        Renegade {getUnitPoints(unit, 'Renegade')}, Standard {getUnitPoints(unit, 'Standard')}, Delta {getUnitPoints(unit, 'Delta')}
                                    </>
                                )}
                            </DetailRow>
                            {speciesAverage && speciesAverage.count > 1 && (
                                <DetailRow label={`Versus other ${unit.race}`}>
                                    {speciesAverage.life != null && unit.life != null && (
                                        <>Life {unit.life} vs. {speciesAverage.life.toFixed(1)} average. </>
                                    )}
                                    {speciesAverage.points != null && points != null && (
                                        <>{points} points vs. {speciesAverage.points.toFixed(0)} average.</>
                                    )}
                                </DetailRow>
                            )}
                            <DetailRow label="Notes">{unit.note}</DetailRow>
                        </tbody>
                    </table>
                </div>
            </div>

            {unit.abilities.length > 0 && (
                <>
                    <SectionTitle>Abilities</SectionTitle>
                    {unit.abilities.map(ability => (
                        <div className="unit-ability" key={ability.id}>
                            <h3>{ability.abilityName}</h3>
                            <p>{ability.ability}</p>
                        </div>
                    ))}
                </>
            )}

            <SectionTitle>Army Cards for {unit.name}</SectionTitle>
            {cardFiles.length === 0 ? (
                <p>
                    There are no card files for this unit yet. You can <Link to="/army-cards/standard/create">make a custom card</Link> yourself.
                </p>
            ) : (
                <div className="unit-cards">
                    {cardFiles.map(({ kind, file }) => (
                        <div className="unit-card" key={kind.purpose}>
                            <h3>{kind.label}</h3>
                            <p>{kind.description}</p>
                            {file?.thumb && (
                                <a className="unit-card-art" href={file.filePath} target="_blank" rel="noopener noreferrer">
                                    <img src={file.thumb} alt={`${unit.name} ${kind.label}`} loading="lazy" />
                                </a>
                            )}
                            <div className="unit-card-actions">
                                <a className="catalog-btn catalog-btn-primary" href={file?.filePath} target="_blank" rel="noopener noreferrer" download>
                                    Download PDF
                                </a>
                                {kind.createPath && <Link className="catalog-btn" to={kind.createPath}>Make a custom one</Link>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {unit.stlUrls && unit.stlUrls.length > 0 && (
                <>
                    <SectionTitle>3D Models</SectionTitle>
                    <div className="catalog-chips">
                        {unit.stlUrls.map((url, index) => (
                            <a key={url} className="catalog-chip" href={url} target="_blank" rel="noopener noreferrer">STL {index + 1}</a>
                        ))}
                    </div>
                </>
            )}

            <SectionTitle>Explore</SectionTitle>
            <div className="catalog-chips">
                {unit.race && <Link className="catalog-chip" to={groupPath('species', unit.race)}>All {unit.race} units</Link>}
                {unit.general && <Link className="catalog-chip" to={groupPath('generals', unit.general)}>All {unit.general} units</Link>}
                {unit.set && <Link className="catalog-chip" to={groupPath('sets', unit.set.name)}>Everything in {unit.set.name}</Link>}
                <Link className="catalog-chip" to="/data/unit-data">Compare in the unit data table</Link>
                <button type="button" className="catalog-btn" onClick={goRandom}>Surprise me: random unit</button>
            </div>

            {setUnits.length > 1 && unit.set && (
                <>
                    <SectionTitle>Also in {unit.set.name}</SectionTitle>
                    <UnitGrid>
                        {setUnits.filter(other => other.id !== unit.id).map(other => (
                            <UnitTile key={other.id} unit={other} points={pointsFor(other)} />
                        ))}
                    </UnitGrid>
                </>
            )}

            {related.length > 0 && (
                <>
                    <SectionTitle>More {unit.race} Units</SectionTitle>
                    <UnitGrid>
                        {related.map(other => <UnitTile key={other.id} unit={other} points={pointsFor(other)} />)}
                    </UnitGrid>
                </>
            )}

            {(previous || next) && unit.set && (
                <nav className="catalog-pager" aria-label={`${unit.set.name} units`}>
                    {previous ? <Link className="catalog-btn" to={unitPath(previous)}>&larr; {previous.name}</Link> : <span />}
                    {next ? <Link className="catalog-btn" to={unitPath(next)}>{next.name} &rarr;</Link> : <span />}
                </nav>
            )}
        </CatalogShell>
    );
};

const UnitPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { catalog, error } = useCatalog();
    const unit = catalog && slug ? catalog.bySlug.get(slug) : undefined;
    const { pointsFor } = usePagePointSystem();

    if (error) {
        return <PageMeta title="Unit" description="Heroscape unit" noindex><CatalogMessage title="Could not load this unit.">Please try again in a moment.</CatalogMessage></PageMeta>;
    }
    if (!catalog) {
        return <PageMeta title="Heroscape Unit" description="Heroscape unit stats, abilities and printable army cards."><CatalogLoading /></PageMeta>;
    }
    if (!unit) {
        return (
            <PageMeta title="Unit Not Found" description="That Heroscape unit could not be found." noindex>
                <CatalogMessage title="We couldn't find that unit.">
                    <Link to="/data/unit-data">Browse the unit data</Link>
                </CatalogMessage>
            </PageMeta>
        );
    }

    const description = describeUnit(unit, pointsFor(unit));
    return (
        <PageMeta
            title={`${unit.name} - Heroscape Unit Stats & Army Cards`}
            description={description.length > 300 ? `${description.slice(0, 297)}...` : description}
            canonicalPath={unitPath(unit)}
            image={getPrimaryImage(unit)}
        >
            <UnitPageContent unit={unit} catalog={catalog} />
        </PageMeta>
    );
};

export default UnitPage;
