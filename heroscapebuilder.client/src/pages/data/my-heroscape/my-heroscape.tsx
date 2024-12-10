import React, { useEffect, useState } from 'react';
import { getMyUnits } from '../../../services/my_army-service'; // Update path as needed
import { Unit } from '../../../models/unit'; // Update path as needed

const MyArmy: React.FC = () => {
    const [units, setUnits] = useState<Unit[]>([]); // Store the list of units
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const response = await getMyUnits();
                setUnits(response.data); // Assuming the API response contains a `data` property
            } catch (err: any) {
                setError(err.message || 'Failed to fetch units.');
            } finally {
                setLoading(false);
            }
        };

        fetchUnits();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>My Army Units</h1>
            {units.length === 0 ? (
                <p>You have no units in your army.</p>
            ) : (
                <ul>
                    {units.map((unit) => (
                        <li key={unit.id}>
                            <h2>{unit.name}</h2>
                            <p>
                                <strong>General:</strong> {unit.general || 'Unknown'} <br />
                                <strong>Race:</strong> {unit.race || 'Unknown'} <br />
                                <strong>Role:</strong> {unit.role || 'Unknown'} <br />
                                <strong>Points:</strong> {unit.points || 0} <br />
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyArmy;
