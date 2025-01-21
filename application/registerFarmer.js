const axios = require('axios');

async function registerFarmer(farmerData) {
    try {
        // Validasi input
        if (!farmerData.name) {
            throw new Error('Farmer name is required');
        }

        // Konfigurasi endpoint backend
        const apiUrl = 'http://localhost:5000/api/farmers/register';

        // Kirim data petani
        const response = await axios.post(apiUrl, {
            name: farmerData.name,
            email: farmerData.email || '',
            location: farmerData.location || '',
            phoneNumber: farmerData.phoneNumber || '',
            registrationDate: new Date().toISOString()
        });

        // Kembalikan respons dari server
        return {
            success: true,
            message: 'Farmer registered successfully',
            farmerId: response.data.farmerId
        };

    } catch (error) {
        console.error('Error registering farmer:', error.message);
        return {
            success: false,
            message: error.response?.data?.message || error.message
        };
    }
}

// Contoh penggunaan
async function main() {
    const farmerData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        location: 'California, USA',
        phoneNumber: '+1234567890'
    };

    const result = await registerFarmer(farmerData);
    console.log(result);
}

// Uncomment untuk menjalankan contoh
// main();

module.exports = { registerFarmer };
