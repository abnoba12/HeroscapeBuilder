import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Unit } from '../../models/unit';
import { UnitHover } from '../../pages/my-heroscape/battlegroups/battlegroup-parts';
import { getPrimaryImage, useCatalog } from '../../services/catalog';
import { DuelPair, getNextDuel, submitDuelVote } from '../../services/power-ranking-service';
import './power-duel.scss';

const DuelCard: React.FC<{ unit: Unit; disabled: boolean; onPick: () => void }> = ({ unit, disabled, onPick }) => {
    const image = getPrimaryImage(unit);
    return (
        // The thumbnail is too small to read, so hovering shows the full stats and abilities (without points), below the pointer so it never covers the other card.
        <UnitHover unit={unit} pointSystem="Renegade" showPoints={false} block blockPlacement="bottom-start">
            <button type="button" className="power-duel-card" onClick={onPick} disabled={disabled}>
                <span className="power-duel-art">
                    {image
                        ? <img src={image} alt={`${unit.name} army card`} decoding="async" />
                        : <span className="power-duel-noimage" aria-hidden="true">&#x2B21;</span>}
                </span>
                <span className="power-duel-name">{unit.name}</span>
                <span className="power-duel-sub">{[unit.race, unit.role].filter(Boolean).join(' - ')}</span>
            </button>
        </UnitHover>
    );
};

/**
 * A small "this or that" widget: two units side by side, pick the one you'd rather have on your side.
 * Deliberately shows no points or other hints about how the answers are used.
 */
const PowerDuelWidget: React.FC = () => {
    const { catalog } = useCatalog();
    const [pair, setPair] = useState<DuelPair | null>(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [answered, setAnswered] = useState(0);

    const loadNext = useCallback(async () => {
        setLoading(true);
        try {
            setPair(await getNextDuel());
            setMessage(null);
        } catch {
            setPair(null);
            setMessage('Could not load a matchup right now. Please try again in a moment.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadNext();
    }, [loadNext]);

    const answer = async (preferredId: number | null) => {
        if (!pair || busy) return;
        setBusy(true);
        try {
            await submitDuelVote(pair, preferredId);
            setAnswered(count => count + 1);
            await loadNext();
        } catch {
            setMessage('That vote did not go through. Please try again.');
        } finally {
            setBusy(false);
        }
    };

    const unitA = pair && catalog?.units.find(unit => unit.id === pair.armyCardAId);
    const unitB = pair && catalog?.units.find(unit => unit.id === pair.armyCardBId);

    return (
        <section className="power-duel" aria-label="Unit matchup">
            <h2 className="power-duel-title">What unit would you rather have on your side?</h2>

            {loading && !pair ? (
                <p className="power-duel-note">Finding a matchup...</p>
            ) : unitA && unitB ? (
                <>
                    <div className="power-duel-arena">
                        <DuelCard unit={unitA} disabled={busy} onPick={() => answer(unitA.id)} />
                        <span className="power-duel-vs" aria-hidden="true">vs</span>
                        <DuelCard unit={unitB} disabled={busy} onPick={() => answer(unitB.id)} />
                    </div>
                    <div className="power-duel-actions">
                        <button type="button" className="power-duel-link" disabled={busy} onClick={() => answer(null)}>It depends</button>
                        <button type="button" className="power-duel-link" disabled={busy} onClick={() => void loadNext()}>Skip</button>
                    </div>
                </>
            ) : (
                <p className="power-duel-note">
                    {message ?? (answered > 0
                        ? "You've answered every matchup we have for now. Check back soon!"
                        : 'No matchups available right now. Check back soon!')}
                </p>
            )}

            {pair && message && <p className="power-duel-note power-duel-error">{message}</p>}
            {answered > 0 && <p className="power-duel-count">{answered} answered this visit. Your picks move the ranking within a minute.</p>}
            <p className="power-duel-footer"><Link to="/power-ranking">See the power ranking</Link></p>
        </section>
    );
};

export default PowerDuelWidget;
