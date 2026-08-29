import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import reportService from '../api/reportService';

export const StudentDashboard = () => {
    const { logout } = useAuth();
    const [lostReports, setLostReports] = useState([]);
    const [foundReports, setFoundReports] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const lost = await reportService.getMyReports('LOST');
                const found = await reportService.getMyReports('FOUND');
                setLostReports(lost);
                setFoundReports(found);
            } catch (err) {
                console.error("Error fetching reports", err);
            }
        };
        fetchReports();
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Student Dashboard</h1>
                <button onClick={logout}>Logout</button>
            </div>
            
            <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
                <Link to="/report/lost"><button>Report Lost Item</button></Link>
                <Link to="/report/found"><button>Report Found Item</button></Link>
            </div>

            <div>
                <h2>My Lost Reports</h2>
                {lostReports.length === 0 ? <p>No lost reports yet.</p> : (
                    <ul>
                        {lostReports.map(report => (
                            <li key={report.id}>
                                {report.item.name} - {new Date(report.dateLost).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div style={{ marginTop: '20px' }}>
                <h2>My Found Reports</h2>
                {foundReports.length === 0 ? <p>No found reports yet.</p> : (
                    <ul>
                        {foundReports.map(report => (
                            <li key={report.id}>
                                {report.item.name} - {new Date(report.dateFound).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export const SecurityDashboard = () => {
    const { logout } = useAuth();
    return (
        <div style={{ padding: '2rem' }}>
            <h1>Security Dashboard (Shell)</h1>
            <p>This is a temporary routing shell.</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export const AdminDashboard = () => {
    const { logout } = useAuth();
    return (
        <div style={{ padding: '2rem' }}>
            <h1>Admin Dashboard (Shell)</h1>
            <p>This is a temporary routing shell.</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
};
