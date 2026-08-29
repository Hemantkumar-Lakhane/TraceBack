import axios from './axiosConfig';

const createLostReport = async (formData) => {
    const response = await axios.post('/api/reports/lost', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

const createFoundReport = async (formData) => {
    const response = await axios.post('/api/reports/found', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

const getMyReports = async (type) => {
    const response = await axios.get(`/api/reports/my?type=${type}`);
    return response.data;
};

const getReports = async (type) => {
    const response = await axios.get(`/api/reports?type=${type}`);
    return response.data;
};

const getLostReport = async (id) => {
    const response = await axios.get(`/api/reports/lost/${id}`);
    return response.data;
};

const getFoundReport = async (id) => {
    const response = await axios.get(`/api/reports/found/${id}`);
    return response.data;
};

export default {
    createLostReport,
    createFoundReport,
    getMyReports,
    getReports,
    getLostReport,
    getFoundReport
};
