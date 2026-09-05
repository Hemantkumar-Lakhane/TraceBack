import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMatchDetails } from '../api/matchService';

const MatchDetails = () => {
    const { id } = useParams();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                const data = await getMatchDetails(id);
                setMatch(data);
            } catch (err) {
                console.error("Error fetching match details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMatch();
    }, [id]);

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
    if (!match) return <div style={{ padding: '2rem' }}>Match not found or unauthorized.</div>;

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Match Details</h1>
                <Link to="/matches"><button>Back to Matches</button></Link>
            </div>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px', borderRadius: '5px', minWidth: '300px' }}>
                    <h2>Lost Report</h2>
                    <p><strong>Item:</strong> {match.lostReport.item.name}</p>
                    <p><strong>Category:</strong> {match.lostReport.item.category}</p>
                    <p><strong>Brand:</strong> {match.lostReport.item.brand || 'N/A'}</p>
                    <p><strong>Color:</strong> {match.lostReport.item.color || 'N/A'}</p>
                    <p><strong>Location:</strong> {match.lostReport.location}</p>
                    <p><strong>Date:</strong> {new Date(match.lostReport.dateLost).toLocaleDateString()}</p>
                    <p><strong>Reported By:</strong> {match.lostReport.user.name}</p>
                </div>

                <div style={{ flex: 1, border: '1px solid #ccc', padding: '15px', borderRadius: '5px', minWidth: '300px' }}>
                    <h2>Found Report</h2>
                    <p><strong>Item:</strong> {match.foundReport.item.name}</p>
                    <p><strong>Category:</strong> {match.foundReport.item.category}</p>
                    <p><strong>Brand:</strong> {match.foundReport.item.brand || 'N/A'}</p>
                    <p><strong>Color:</strong> {match.foundReport.item.color || 'N/A'}</p>
                    <p><strong>Location:</strong> {match.foundReport.location}</p>
                    <p><strong>Date:</strong> {new Date(match.foundReport.dateFound).toLocaleDateString()}</p>
                    <p><strong>Reported By:</strong> {match.foundReport.user.name}</p>
                </div>
            </div>

            <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
                <h2>Conversation (Coming Soon)</h2>
                <p>This match created a secure communication channel between the reporter and finder.</p>
                <div style={{ 
                    height: '200px', 
                    backgroundColor: '#f5f5f5', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '1px dashed #999',
                    borderRadius: '5px'
                }}>
                    <p style={{ color: '#666' }}>Chat functionality will be available in the next milestone.</p>
                </div>
            </div>
        </div>
    );
};

export default MatchDetails;
