const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Tambahkan data awal
const farmers = [
    {
        id: uuidv4(),
        name: 'Budi Petani',
        email: 'budi@example.com',
        location: 'Jawa Tengah',
        registeredAt: new Date().toISOString()
    },
    {
        id: uuidv4(),
        name: 'Siti Pertanian',
        email: 'siti@example.com',
        location: 'Jawa Barat',
        registeredAt: new Date().toISOString()
    }
];

const products = [
    {
        id: uuidv4(),
        name: 'Beras Organik',
        farmerId: farmers[0].id,
        status: 'Diproduksi',
        currentLocation: farmers[0].location,
        createdAt: new Date().toISOString()
    },
    {
        id: uuidv4(),
        name: 'Sayur Segar',
        farmerId: farmers[1].id,
        status: 'Dalam Perjalanan',
        currentLocation: 'Dalam Pengiriman',
        createdAt: new Date().toISOString()
    }
];

// Register Farmer
router.post('/farmers', (req, res) => {
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

// Create Product
router.post('/products', (req, res) => {
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

// Track Product
router.get('/products/:id', (req, res) => {
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

// Update Product Status
router.put('/products/:id/status', (req, res) => {
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

module.exports = { 
    router, 
    farmers, 
    products 
};

// Endpoint untuk melihat semua petani
router.get('/farmers', (req, res) => {
    res.json({
        success: true,
        farmers: farmers
    });
});

// Endpoint untuk melihat semua produk
router.get('/products', (req, res) => {
    res.json({
        success: true,
        products: products
    });
});
