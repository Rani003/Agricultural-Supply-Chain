# deployment.sh
#!/bin/bash

# Gunakan path absolut atau relatif yang benar
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

# Jalankan docker compose
docker-compose up -d

# Tunggu inisialisasi
sleep 30

# Cek status container
docker ps

# Dapatkan nama container CLI yang benar
CLI_CONTAINER=$(docker ps | grep cli | awk '{print $NF}')

if [ -z "$CLI_CONTAINER" ]; then
    echo "Tidak dapat menemukan container CLI"
    exit 1
fi

echo "Container CLI yang ditemukan: $CLI_CONTAINER"

# Buat direktori artifacts jika belum ada
docker exec "$CLI_CONTAINER" mkdir -p /etc/hyperledger/channel-artifacts

# Buat channel
docker exec "$CLI_CONTAINER" peer channel create \
    -o orderer.example.com:7050 \
    -c supplychannel \
    -f /etc/hyperledger/channel-artifacts/channel.tx

# Gabungkan peer ke channel
docker exec "$CLI_CONTAINER" peer channel join \
    -b supplychannel.block

# Deploy chaincode
docker exec "$CLI_CONTAINER" peer chaincode install \
    -n supplyChainCC \
    -v 1.0 \
    -p /opt/gopath/src/supplychain

# Inisialisasi chaincode
docker exec "$CLI_CONTAINER" peer chaincode instantiate \
    -o orderer.example.com:7050 \
    -C supplychannel \
    -n supplyChainCC \
    -v 1.0 \
    -c '{"Args":[]}'
