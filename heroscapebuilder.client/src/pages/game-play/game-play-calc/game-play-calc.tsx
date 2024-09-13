import React, { useState } from 'react';
import "./game-play-calc.scss";

const GamePlayCalc: React.FC = () => {
    // Define state variables to hold input values
    const [players, setPlayers] = useState<number | ''>(''); // Number of players
    const [points, setPoints] = useState<number | ''>('');   // Points
    const [hours, setHours] = useState<number | ''>('');     // Play time in hours
    const [speed, setSpeed] = useState<number>(1);           // Play speed modifier

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number | ''>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value ? parseFloat(e.target.value) : '';
        setter(value);
    };

    const clickCalc = () => {
        try {
            // Call the calculate function and handle the results
            const result = calculate(players, points, hours, speed);
            if (result) {
                setPlayers(result.players);
                setPoints(result.points);
                setHours(result.hours);
            }
        } catch (e: any) {
            alert(e);
        }
    };

    const calculate = (players: number | '', points: number | '', hours: number | '', mod: number) => {
        if (!mod) {
            throw "Play speed is required";
        }

        if (players === 1) {
            throw "Why so lonely? You should find others to play with";
        }

        if (points && points < 10) {
            throw "This will not be a fun game with so few points. Let's make a larger army.";
        }

        const adj = 750 * mod;

        // Case 1: Calculate Points
        if (!points) {
            if (!players || !hours) {
                throw "You must fill out at least two inputs";
            }
            const calcPoints = Math.round((hours / players) * adj);
            return { players, points: calcPoints, hours };
        }

        // Case 2: Calculate Hours
        if (!hours) {
            if (!players || !points) {
                throw "You must fill out at least two inputs";
            }
            const calcHours = ((players * points) / adj).toFixed(2);
            return { players, points, hours: parseFloat(calcHours) };
        }

        // Case 3: Calculate Players
        if (!players) {
            if (!hours || !points) {
                throw "You must fill out at least two inputs";
            }
            const calcPlayers = Math.round((adj * hours) / points);
            return { players: calcPlayers, points, hours };
        }

        throw "Please don't fill in all fields. Leave one blank for calculation.";
    };

    return (
        <div className="container-fluid">
            <form>
                <div className="row">
                    <div className="col-md-12">
                        <p>
                            Use this tool to calculate key metrics for your game. Leave one field blank, and the calculator will determine its value.
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3 text-xs-center">
                        <label htmlFor="players">Number of Players</label>
                        <input
                            id="players"
                            type="number"
                            value={players || ''}
                            onChange={handleInputChange(setPlayers)}
                        />
                    </div>
                    <div className="col-md-3 text-xs-center">
                        <label htmlFor="points">Points</label>
                        <input
                            id="points"
                            type="number"
                            value={points || ''}
                            onChange={handleInputChange(setPoints)}
                        />
                    </div>
                    <div className="col-md-3 text-xs-center">
                        <label htmlFor="hours">Play Time (Hours)</label>
                        <input
                            id="hours"
                            type="number"
                            value={hours || ''}
                            onChange={handleInputChange(setHours)}
                        />
                    </div>
                    <div className="col-md-3 text-xs-center">
                        <label htmlFor="speed">Play Speed Multiplier</label>
                        <input
                            id="speed"
                            type="number"
                            value={speed}
                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 text-center">
                        <button className="btn btn-primary" type="button" onClick={clickCalc}>Calculate</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default GamePlayCalc;
