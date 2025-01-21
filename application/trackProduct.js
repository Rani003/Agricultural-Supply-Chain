const axios = require('axios');

async function trackProduct(productId) {
    try {
        // Validasi input
        if (!productId) {
            throw new Error('Product ID is required');
        }

        // Konfigurasi endpoint backend
        const apiUrl = `http://localhost:5000/api/products/track/${productId}`;

        // Ambil data produk
        const response = await axios.get(apiUrl);

        // Kembalikan detail produk
        return {
            success: true,
            product: response.data,
            message: 'Product tracked successfully'
        };

    } catch (error) {
        console.error('Error tracking product:', error.message);
        return {
            success: false,
            message: error.response?.data?.message || 'Product tracking failed'
        };
    }
}

// Contoh penggunaan
async function main() {
    const productId = 'PROD123';
    const result = await trackProduct(productId);
    console.log(result);
}

// Uncomment untuk menjalankan contoh
// main();

module.exports = { trackProduct };
