import axios from 'axios';

const getBaseUrl = () => {
    try {
        if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) {
            return import.meta.env.VITE_API_BASE_URL;
        }
    } catch (e) {}
    return 'http://localhost:8080';
};

const api = axios.create({
    baseURL: getBaseUrl(),
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
