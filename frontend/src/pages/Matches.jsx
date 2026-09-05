import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyMatches } from '../api/matchService';

const Matches = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const data = await getMyMatches();
                setMatches(data);
            } catch (err) {
                console.error("Error fetching matches", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMatches();
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>My Matches</h1>
                <Link to="/dashboard"><button>Back to Dashboard</button></Link>
            </div>
            
            {loading ? (
                <p>Loading matches...</p>
            ) : matches.length === 0 ? (
                <p>No matches found.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    {matches.map(match => (
                        <div key={match.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                            <h3>Match Score: {match.score}</h3>
                            <p><strong>Lost Item:</strong> {match.lostReport.item.name} ({match.lostReport.location})</p>
                            <p><strong>Found Item:</strong> {match.foundReport.item.name} ({match.foundReport.location})</p>
                            <p><strong>Status:</strong> {match.status}</p>
                            <p><em>Matched on: {new Date(match.createdAt).toLocaleDateString()}</em></p>
                            <Link to={`/matches/${match.id}`}>
                                <button style={{ marginTop: '10px' }}>View Match Details</button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Matches;
