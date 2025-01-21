const axios = require('axios');

async function updateProductStatus(productId, newStatus) {
    try {
        // Validasi input
        if (!productId) {
            throw new Error('Product ID is required');
        }
        if (!newStatus) {
            throw new Error('New status is required');
        }

        // Konfigurasi endpoint backend
        const apiUrl = `http://localhost:5000/api/products/status/${productId}`;

        // Update status produk
        const response = await axios.put(apiUrl, {
            status: newStatus,
            updatedAt: new Date().toISOString()
        });

        // Kembalikan respons
        return {
            success: true,
            message: 'Product status updated successfully',
            updatedProduct: response.data
        };

    } catch (error) {
        console.error('Error updating product status:', error.message);
        return {
            success: false,
            message: error.response?.data?.message || 'Product status update failed'
        };
    }
}

// Contoh penggunaan
async function main() {
    const productId = 'PROD123';
    const newStatus = 'In Transit';
    
    const result = await updateProductStatus(productId, newStatus);
    console.log(result);
}

// Uncomment untuk menjalankan contoh
// main();

module.exports = { updateProductStatus };
