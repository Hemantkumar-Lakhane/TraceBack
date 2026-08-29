import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { token, user } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Basic placeholder unauthorized logic
        return <div>403 Forbidden - Insufficient Role</div>;
    }

    return <Outlet />;
};

export default ProtectedRoute;
