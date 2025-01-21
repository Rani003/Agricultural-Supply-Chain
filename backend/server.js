// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data stores
const farmers = [];
const products = [];

// Routes
app.post('/api/farmers', (req, res) => {
    try {
        const { name, email, location } = req.body;
        
        if (!name) {
            return res.status(400).json({ 
                success: false, 
                message: 'Nama petani diperlukan' 
            });
        }

        const newFarmer = {
            id: uuidv4(),
            name,
            email: email || '',
            location: location || '',
            registeredAt: new Date().toISOString()
        };

        farmers.push(newFarmer);

        res.status(201).json({ 
            success: true,
            message: 'Petani berhasil didaftarkan',
            farmer: newFarmer 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Gagal mendaftarkan petani',
            error: error.message 
        });
    }
});

// Endpoint untuk membuat produk
app.post('/api/products', (req, res) => {
    try {
        const { name, farmerId, initialStatus } = req.body;
        
        if (!name || !farmerId) {
            return res.status(400).json({ 
                success: false,
                message: 'Nama dan ID petani diperlukan' 
            });
        }

        const newProduct = {
            id: uuidv4(),
            name,
            farmerId,
            status: initialStatus || 'Diproduksi',
            createdAt: new Date().toISOString(),
            currentLocation: ''
        };

        products.push(newProduct);

        res.status(201).json({ 
            success: true,
            message: 'Produk berhasil dibuat', 
            product: newProduct 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Gagal membuat produk',
            error: error.message 
        });
    }
});

// Endpoint untuk melacak produk
app.get('/api/products/:id', (req, res) => {
    try {
        const product = products.find(p => p.id === req.params.id);
        
        if (!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Produk tidak ditemukan' 
            });
        }

        res.json({
            success: true,
            product: product
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Gagal melacak produk',
            error: error.message 
        });
    }
});

// Endpoint untuk memperbarui status produk
app.put('/api/products/:id/status', (req, res) => {
    try {
        const { status, location } = req.body;
        const productIndex = products.findIndex(p => p.id === req.params.id);
        
        if (productIndex === -1) {
            return res.status(404).json({ 
                success: false,
                message: 'Produk tidak ditemukan' 
            });
        }

        products[productIndex] = {
            ...products[productIndex],
            status,
            currentLocation: location || products[productIndex].currentLocation,
            updatedAt: new Date().toISOString()
        };

        res.json({ 
            success: true,
            message: 'Status produk berhasil diperbarui', 
            product: products[productIndex] 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: 'Gagal memperbarui status produk',
            error: error.message 
        });
    }
});

// Endpoint debugging untuk farmers
app.get('/debug/farmers', (req, res) => {
    res.json({
        total: farmers.length,
        farmers: farmers
    });
});

// Endpoint debugging untuk products
app.get('/debug/products', (req, res) => {
    res.json({
        total: products.length,
        products: products
    });
});

// Tambahkan data awal (opsional)
farmers.push({
    id: uuidv4(),
    name: 'Budi Petani',
    email: 'budi@example.com',
    location: 'Jawa Tengah',
    registeredAt: new Date().toISOString()
});

products.push({
    id: uuidv4(),
    name: 'Beras Organik',
    farmerId: farmers[0].id,
    status: 'Diproduksi',
    currentLocation: farmers[0].location,
    createdAt: new Date().toISOString()
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Initial Farmers:', farmers);
    console.log('Initial Products:', products);
});
