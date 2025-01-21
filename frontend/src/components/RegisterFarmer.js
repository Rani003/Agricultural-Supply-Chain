import React, { useState } from 'react';
import axios from 'axios';

const RegisterFarmer = () => {
    const [farmerData, setFarmerData] = useState({
        name: '',
        email: '',
        location: ''
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFarmerData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/farmers', farmerData);
            
            if (response.data.success) {
                setMessage(`Petani berhasil didaftarkan: ${response.data.farmer.name}`);
                // Reset form
                setFarmerData({
                    name: '',
                    email: '',
                    location: ''
                });
            } else {
                setMessage('Gagal mendaftarkan petani');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Terjadi kesalahan saat mendaftarkan petani');
        }
    };

    return (
        <div>
            <h2>Registrasi Petani</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={farmerData.name}
                    onChange={handleChange}
                    placeholder="Nama Petani"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={farmerData.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
                <input
                    type="text"
                    name="location"
                    value={farmerData.location}
                    onChange={handleChange}
                    placeholder="Lokasi"
                />
                <button type="submit">Daftarkan Petani</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RegisterFarmer;
