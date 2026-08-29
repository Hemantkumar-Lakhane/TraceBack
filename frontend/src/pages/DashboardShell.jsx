import { useAuth } from '../context/AuthContext';

export const StudentDashboard = () => {
    const { logout } = useAuth();
    return (
        <div style={{ padding: '2rem' }}>
            <h1>Student Dashboard (Shell)</h1>
            <p>This is a temporary routing shell.</p>
            <button onClick={logout}>Logout</button>
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
