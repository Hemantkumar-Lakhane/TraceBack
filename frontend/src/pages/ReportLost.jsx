import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reportService from '../api/reportService';

const ReportLost = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        category: '',
        name: '',
        description: '',
        color: '',
        brand: '',
        location: '',
        dateLost: '',
        image: null
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData({ ...formData, image: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key]) {
                    data.append(key, formData[key]);
                }
            });

            await reportService.createLostReport(data);
            navigate('/dashboard'); // Go back to dashboard on success
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to submit report');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
            <h2>Report Lost Item</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label>Category *</label><br />
                    <input type="text" name="category" required value={formData.category} onChange={handleChange} style={{ width: '100%' }} />
                </div>
                <div>
                    <label>Item Name *</label><br />
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} style={{ width: '100%' }} />
                </div>
                <div>
                    <label>Description</label><br />
                    <textarea name="description" value={formData.description} onChange={handleChange} style={{ width: '100%', minHeight: '80px' }}></textarea>
                </div>
                <div>
                    <label>Color</label><br />
                    <input type="text" name="color" value={formData.color} onChange={handleChange} style={{ width: '100%' }} />
                </div>
                <div>
                    <label>Brand</label><br />
                    <input type="text" name="brand" value={formData.brand} onChange={handleChange} style={{ width: '100%' }} />
                </div>
                <div>
                    <label>Location Lost</label><br />
                    <input type="text" name="location" value={formData.location} onChange={handleChange} style={{ width: '100%' }} />
                </div>
                <div>
                    <label>Date Lost</label><br />
                    <input type="date" name="dateLost" value={formData.dateLost} onChange={handleChange} style={{ width: '100%' }} />
                </div>
                <div>
                    <label>Image (JPG/PNG)</label><br />
                    <input type="file" name="image" accept="image/jpeg, image/png" onChange={handleChange} style={{ width: '100%' }} />
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="button" onClick={() => navigate('/dashboard')} disabled={isSubmitting}>Cancel</button>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReportLost;
