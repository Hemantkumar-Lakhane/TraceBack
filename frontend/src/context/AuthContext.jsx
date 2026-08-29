import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            // Optionally, decode JWT or fetch user details here if needed.
            // For now, we expect login/register to set user state.
        } else {
            localStorage.removeItem('token');
            setUser(null);
        }
    }, [token]);

    const login = async (email, password) => {
        const response = await api.post('/api/auth/login', { email, password });
        setToken(response.data.token);
        setUser(response.data.user);
        return response.data;
    };

    const register = async (name, email, password) => {
        const response = await api.post('/api/auth/register', { name, email, password });
        return response.data;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
