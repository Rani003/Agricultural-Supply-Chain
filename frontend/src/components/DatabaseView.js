import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DatabaseView() {
    const [farmers, setFarmers] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const farmersResponse = await axios.get('http://localhost:5000/debug/farmers');
                const productsResponse = await axios.get('http://localhost:5000/debug/products');
                
                setFarmers(farmersResponse.data.farmers);
                setProducts(productsResponse.data.products);
            } catch (error) {
                console.error('Error fetching data', error);
                setError('Gagal mengambil data');
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div style={{color: 'red'}}>{error}</div>;
    }

    return (
        <div>
            <h2>Daftar Petani</h2>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                    <tr style={{backgroundColor: '#f2f2f2'}}>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>ID</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Nama</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Email</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Lokasi</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Terdaftar Pada</th>
                    </tr>
                </thead>
                <tbody>
                    {farmers.map((farmer) => (
                        <tr key={farmer.id}>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{farmer.id}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{farmer.name}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{farmer.email}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{farmer.location}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>
                                {new Date(farmer.registeredAt).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Daftar Produk</h2>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                    <tr style={{backgroundColor: '#f2f2f2'}}>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>ID</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Nama</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>ID Petani</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Status</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Lokasi Saat Ini</th>
                        <th style={{border: '1px solid #ddd', padding: '8px'}}>Dibuat Pada</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{product.id}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{product.name}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{product.farmerId}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{product.status}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{product.currentLocation}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>
                                {new Date(product.createdAt).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DatabaseView;
