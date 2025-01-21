import React, { useState } from 'react';
import axios from 'axios';

const TrackProduct = () => {
    const [productId, setProductId] = useState('');
    const [productDetails, setProductDetails] = useState(null);
    const [message, setMessage] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
            
            if (response.data.success) {
                setProductDetails(response.data.product);
                setMessage('');
            } else {
                setMessage('Produk tidak ditemukan');
                setProductDetails(null);
            }
        } catch (error) {
            console.error('Error tracking product:', error);
            setMessage('Terjadi kesalahan saat melacak produk');
            setProductDetails(null);
        }
    };

    return (
        <div>
            <h2>Lacak Produk</h2>
            <form onSubmit={handleTrack}>
                <input
                    type="text"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="Masukkan ID Produk"
                    required
                />
                <button type="submit">Lacak Produk</button>
            </form>

            {message && <p style={{color: 'red'}}>{message}</p>}

            {productDetails && (
                <div>
                    <h3>Detail Produk</h3>
                    <table>
                        <tbody>
                            <tr>
                                <td><strong>ID Produk:</strong></td>
                                <td>{productDetails.id}</td>
                            </tr>
                            <tr>
                                <td><strong>Nama Produk:</strong></td>
                                <td>{productDetails.name}</td>
                            </tr>
                            <tr>
                                <td><strong>Status:</strong></td>
                                <td>{productDetails.status}</td>
                            </tr>
                            <tr>
                                <td><strong>Lokasi Saat Ini:</strong></td>
                                <td>{productDetails.currentLocation || 'Tidak diketahui'}</td>
                            </tr>
                            <tr>
                                <td><strong>Dibuat Pada:</strong></td>
                                <td>{new Date(productDetails.createdAt).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TrackProduct;
