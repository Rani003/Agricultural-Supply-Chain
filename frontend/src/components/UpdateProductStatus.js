import React, { useState } from 'react';
import axios from 'axios';

const UpdateProductStatus = () => {
    const [productData, setProductData] = useState({
        productId: '',
        status: '',
        location: ''
    });
    const [message, setMessage] = useState('');

    const statusOptions = [
        'Diproduksi',
        'Dalam Perjalanan',
        'Sedang Diproses',
        'Diterima',
        'Disimpan',
        'Dijual'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({
            ...prev,
            [name]: value
        }));
        setMessage('');
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:5000/api/products/${productData.productId}/status`, 
                {
                    status: productData.status,
                    location: productData.location
                }
            );

            if (response.data.success) {
                setMessage(`Status produk berhasil diperbarui: ${response.data.product.status}`);
                // Reset form
                setProductData({
                    productId: '',
                    status: '',
                    location: ''
                });
            } else {
                setMessage('Gagal memperbarui status produk');
            }
        } catch (error) {
            console.error('Error updating product status:', error);
            setMessage('Terjadi kesalahan saat memperbarui status produk');
        }
    };

    return (
        <div>
            <h2>Perbarui Status Produk</h2>
            <form onSubmit={handleUpdateStatus}>
                <input
                    type="text"
                    name="productId"
                    value={productData.productId}
                    onChange={handleChange}
                    placeholder="ID Produk"
                    required
                />
                
                <select
                    name="status"
                    value={productData.status}
                    onChange={handleChange}
                    required
                >
                    <option value="">Pilih Status Baru</option>
                    {statusOptions.map(status => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
                
                <input
                    type="text"
                    name="location"
                    value={productData.location}
                    onChange={handleChange}
                    placeholder="Lokasi (opsional)"
                />
                
                <button type="submit">Perbarui Status</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default UpdateProductStatus;
