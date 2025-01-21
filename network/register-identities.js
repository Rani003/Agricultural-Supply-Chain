// register-identities.js
const { Wallets, Gateway } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const fs = require('fs');

async function main() {
    try {
        // Path ke direktori wallet
        const walletPath = path.join(__dirname, 'wallet');
        
        // Buat wallet baru jika belum ada
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Path ke file koneksi
        const ccpPath = path.join(__dirname, 'connection.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Konfigurasi CA
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { 
            trustedRoots: caTLSCACerts, 
            verify: false 
        }, caInfo.caName);

        // Registrasi identitas
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('Admin identity not found. Registering admin...');
            
            // Enroll admin
            const enrollment = await ca.enroll({ 
                enrollmentID: 'admin', 
                enrollmentSecret: 'adminpw' 
            });

            // Buat identitas admin
            const identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'Org1MSP',
                type: 'X.509',
            };

            // Simpan identitas admin ke wallet
            await wallet.put('admin', identity);
            console.log('Admin enrolled successfully');
        }

        // Registrasi user baru
        const adminProvider = await wallet.get('admin');
        if (adminProvider) {
            const adminUser = await gateway.getIdentity();
            
            // Contoh registrasi user
            const userId = 'user1';
            const userSecret = await ca.register({
                enrollmentID: userId,
                role: 'client',
                attrs: [
                    { name: 'role', value: 'user', ecert: true }
                ]
            }, adminUser);

            // Enroll user
            const userEnrollment = await ca.enroll({
                enrollmentID: userId,
                enrollmentSecret: userSecret
            });

            // Simpan identitas user
            const userIdentity = {
                credentials: {
                    certificate: userEnrollment.certificate,
                    privateKey: userEnrollment.key.toBytes(),
                },
                mspId: 'Org1MSP',
                type: 'X.509',
            };

            await wallet.put(userId, userIdentity);
            console.log(`User ${userId} registered and enrolled successfully`);
        }
    } catch (error) {
        console.error('Error in registration process:', error);
    }
}

// Jalankan script
main().catch(console.error);
