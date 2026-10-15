import React, { useState } from 'react';
import { useUrlNumber } from '../../../services/url-state';
import "./game-play-calc.scss";

// Play time grows faster than linearly with player count (more turns between your own, more interaction),
// so hours = points * players^PLAYER_EXPONENT / (POINT_RATE * speed). Fitted to experienced-group estimates:
// 2 players/500 pts = 1 hour, 4 players/400-450 pts = 2-3 hours.
const PLAYER_EXPONENT = 1.55;
const POINT_RATE = 1450;

const pointsFor = (players: number, hours: number, speed: number) => (hours * POINT_RATE * speed) / Math.pow(players, PLAYER_EXPONENT);

const GamePlayCalc: React.FC = () => {
    const [players, setPlayers] = useUrlNumber('players'); // Number of players
    const [points, setPoints] = useUrlNumber('pts');   // Points
    const [hours, setHours] = useUrlNumber('hours');     // Play time in hours
    const [speedParam, setSpeed] = useUrlNumber('speed');
    const speed = speedParam === '' ? 1 : speedParam;           // Play speed modifier

    const [message, setMessage] = useState<string | null>(null);

    const handleInputChange = (setter: (value: number | '') => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ? parseFloat(e.target.value) : '';
        setter(value);
    };

    const clickCalc = () => {
        setMessage(null);
        try {
            const result = calculate(players, points, hours, speed);
            if (result) {
                setPlayers(result.players);
                setPoints(result.points);
                setHours(result.hours);
            }
        } catch (e: any) {
            setMessage(String(e));
        }
    };

    const calculate = (players: number | '', points: number | '', hours: number | '', mod: number) => {
        if (!mod) throw "Play speed is required";
        if (players === 1) throw "Why so lonely? You should find others to play with";
        if (points && points < 10) throw "This will not be a fun game with so few points. Let's make a larger army.";

        if (!points) {
            if (!players || !hours) throw "You must fill out at least two inputs";
            const calcPoints = Math.round(pointsFor(players, hours, mod));
            return { players, points: calcPoints, hours };
        }

        if (!hours) {
            if (!players || !points) throw "You must fill out at least two inputs";
            const calcHours = ((points * Math.pow(players, PLAYER_EXPONENT)) / (POINT_RATE * mod)).toFixed(2);
            return { players, points, hours: parseFloat(calcHours) };
        }

        if (!players) {
            if (!hours || !points) throw "You must fill out at least two inputs";
            const calcPlayers = Math.round(Math.pow((POINT_RATE * mod * hours) / points, 1 / PLAYER_EXPONENT));
            return { players: calcPlayers, points, hours };
        }

        throw "Please don't fill in all fields. Leave one blank for calculation.";
    };

    return (
        <div className="game-play-calc-layout">
        <div className="game-play-calc-container">
            <h2>Game Play Calculator</h2>
            <form className="game-play-calc-form">
                <p className="description">
                    Use this tool to calculate key metrics for your game. Leave one field blank, and the calculator will determine its value.
                </p>
                <div className="input-group">
                    <label htmlFor="players">Number of Players</label>
                    <input
                        id="players"
                        type="number"
                        value={players || ''}
                        onChange={handleInputChange(setPlayers)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="points">Points</label>
                    <input
                        id="points"
                        type="number"
                        value={points || ''}
                        onChange={handleInputChange(setPoints)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="hours">Play Time (Hours)</label>
                    <input
                        id="hours"
                        type="number"
                        value={hours || ''}
                        onChange={handleInputChange(setHours)}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="speed">Play Speed Multiplier</label>
                    <small>1 = average pace. Use less than 1 for slower groups, more than 1 for faster ones.</small>
                    <input
                        id="speed"
                        type="number"
                        value={speed}
                        onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    />
                </div>
                <button type="button" className="calculate-button" onClick={clickCalc}>
                    Calculate
                </button>
                {message && <div className="alert alert-warning" role="alert">{message}</div>}
            </form>
        </div>
        <div className="game-play-calc-container">
            <h2>Points Per Player</h2>
            <p className="description">
                Recommended army points per player at an average pace (speed 1), based on experienced players. Each row is a play time, each column a player count.
            </p>
            <table className="table table-sm">
                <thead>
                    <tr><th>Hours</th>{[2, 3, 4, 5, 6].map(p => <th key={p}>{p}P</th>)}</tr>
                </thead>
                <tbody>
                    {[1, 1.5, 2, 3, 4].map(h => (
                        <tr key={h}>
                            <th>{h}</th>
                            {[2, 3, 4, 5, 6].map(p => <td key={p}>{Math.round(pointsFor(p, h, 1) / 10) * 10}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default GamePlayCalc;
