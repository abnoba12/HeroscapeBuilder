import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PowerDuelWidget from '../../components/PowerDuel/PowerDuelWidget';
import { CatalogLoading, CatalogMessage, CatalogShell } from '../../components/Catalog/CatalogParts';
import PageMeta from '../../components/Seo/PageMeta';
import { Unit } from '../../models/unit';
import { UnitHover } from '../my-heroscape/battlegroups/battlegroup-parts';
import { getPrimaryImage, unitPath, useCatalog } from '../../services/catalog';
import { usePowerRanking } from '../../services/power-ranking-service';

const PAGE_SIZE = 50;

const PowerRanking: React.FC = () => {
    const { catalog, error } = useCatalog();
    const ranking = usePowerRanking();
    const [shown, setShown] = useState(PAGE_SIZE);

    const rows = useMemo(() => {
        if (!catalog || !ranking) return [];
        const byId = new Map<number, Unit>(catalog.units.map(unit => [unit.id, unit]));
        return ranking.units
            .filter(entry => byId.has(entry.armyCardId))
            .sort((a, b) => a.rank - b.rank)
            .map(entry => ({ rank: entry.rank, unit: byId.get(entry.armyCardId)! }));
    }, [catalog, ranking]);

    return (
        <PageMeta
            title="Heroscape Power Ranking - Strongest Units"
            description="Which Heroscape units are the most powerful? See the community's power ranking of every unit, from the strongest to the weakest."
            canonicalPath="/power-ranking"
        >
            <CatalogShell
                accent="orange"
                title="Heroscape Power Ranking"
                intro="The most powerful units in Heroscape, ranked by the community one matchup at a time. Think a unit is ranked wrong? Settle it below."
                crumbs={[{ label: 'Home', to: '/' }, { label: 'Power Ranking' }]}
            >
                <PowerDuelWidget />

                {error ? (
                    <CatalogMessage title="Could not load the ranking.">Please try again in a moment.</CatalogMessage>
                ) : !catalog || !ranking ? (
                    <CatalogLoading />
                ) : rows.length === 0 ? (
                    <CatalogMessage title="No units to rank yet." />
                ) : (
                    <>
                        <ol className="power-tower">
                            {rows.slice(0, shown).map(({ rank, unit }) => {
                                const image = getPrimaryImage(unit);
                                return (
                                    <li key={unit.id} className="power-tower-row">
                                        {/* Hover for the full stats and abilities, so units can be compared without opening each one. */}
                                        <UnitHover unit={unit} pointSystem="Renegade" showPoints={false} block>
                                            <div className="power-tower-row-inner">
                                                <span className="power-tower-rank">#{rank}</span>
                                                <span className="power-tower-art">
                                                    {image && <img src={image} alt={`${unit.name} army card`} loading="lazy" decoding="async" />}
                                                </span>
                                                <span className="power-tower-info">
                                                    <Link to={unitPath(unit)} className="power-tower-name">{unit.name}</Link>
                                                    <span className="power-tower-sub">{[unit.race, unit.role].filter(Boolean).join(' - ')}</span>
                                                </span>
                                            </div>
                                        </UnitHover>
                                    </li>
                                );
                            })}
                        </ol>
                        {shown < rows.length && (
                            <div className="power-tower-more">
                                <button type="button" className="catalog-btn" onClick={() => setShown(count => count + PAGE_SIZE)}>
                                    Show more
                                </button>
                            </div>
                        )}
                    </>
                )}
            </CatalogShell>
        </PageMeta>
    );
};

export default PowerRanking;
