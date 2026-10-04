import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CatalogLoading, CatalogMessage, CatalogShell } from '../../components/Catalog/CatalogParts';
import { PowerBalanceRow, getPowerBalanceReport } from '../../services/power-ranking-service';

type SortKey = 'rankDelta' | 'ratingDelta' | 'points' | 'votes' | 'games';

/** Admin only: where the crowd ranks each unit versus where its Renegade points rank it. */
const PowerBalance: React.FC = () => {
    const [rows, setRows] = useState<PowerBalanceRow[] | null>(null);
    const [error, setError] = useState(false);
    const [sortKey, setSortKey] = useState<SortKey>('ratingDelta');
    const [minVotes, setMinVotes] = useState(0);

    useEffect(() => {
        getPowerBalanceReport().then(setRows).catch(() => setError(true));
    }, []);

    const sorted = useMemo(
        () => (rows ?? [])
            .filter(row => row.votes >= minVotes)
            .sort((a, b) => Math.abs(b[sortKey]) - Math.abs(a[sortKey])),
        [rows, sortKey, minVotes],
    );

    return (
        <CatalogShell
            accent="neutral"
            title="Power vs. Points"
            intro="Units the crowd ranks well above (positive) or below (negative) where their Renegade points put them."
            crumbs={[{ label: 'Home', to: '/' }, { label: 'Power vs. Points' }]}
        >
            {error ? (
                <CatalogMessage title="Could not load the report." />
            ) : !rows ? (
                <CatalogLoading />
            ) : (
                <>
                    <div className="catalog-chips" style={{ marginBottom: 12 }}>
                        <label>
                            Sort by largest{' '}
                            <select value={sortKey} onChange={event => setSortKey(event.target.value as SortKey)}>
                                <option value="ratingDelta">Rating change</option>
                                <option value="rankDelta">Rank difference</option>
                                <option value="points">Points</option>
                                <option value="votes">Votes</option>
                                <option value="games">Games</option>
                            </select>
                        </label>
                        <label>
                            Minimum votes{' '}
                            <input type="number" min={0} value={minVotes} style={{ width: 70 }}
                                onChange={event => setMinVotes(Math.max(0, Number(event.target.value) || 0))} />
                        </label>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="unit-details">
                            <thead>
                                <tr>
                                    <th>Unit</th><th>Points</th><th>Points rank</th><th>Duel rank</th><th>Results rank</th><th>Combined rank</th>
                                    <th>Rank diff</th><th>Rating +/-</th><th>Votes</th><th>Depends</th><th>Games</th><th>Players</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sorted.map(row => (
                                    <tr key={row.armyCardId}>
                                        <td>{row.name} <small>({row.creator})</small></td>
                                        <td>{row.points}</td>
                                        <td>{row.pointsRank}</td>
                                        <td>{row.duelRank}</td>
                                        <td>{row.resultsRank ?? '-'}</td>
                                        <td>{row.powerRank}</td>
                                        <td>{row.rankDelta > 0 ? `+${row.rankDelta}` : row.rankDelta}</td>
                                        <td>{row.ratingDelta > 0 ? '+' : ''}{row.ratingDelta.toFixed(2)}</td>
                                        <td>{row.votes}</td>
                                        <td>{row.dependsVotes}</td>
                                        <td>{row.games}</td>
                                        <td>{row.gamePlayers}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p><Link to="/power-ranking">Back to the power ranking</Link></p>
                </>
            )}
        </CatalogShell>
    );
};

export default PowerBalance;
