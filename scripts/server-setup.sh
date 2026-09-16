#!/bin/bash

set -e

echo "======================================"
echo " QuickCart Server Bootstrap"
echo " Amazon Linux 2023"
echo "======================================"

echo
echo "Checking Operating System..."

if [ -f /etc/os-release ]; then
    cat /etc/os-release
else
    echo "Cannot detect operating system"
    exit 1
fi


echo
echo "======================================"
echo "Checking Docker"
echo "======================================"

if command -v docker &> /dev/null
then
    echo "Docker already installed"
else
    echo "Docker not found. Installing Docker..."

    sudo dnf update -y

    sudo dnf install docker -y

    sudo systemctl enable docker

    sudo systemctl start docker

    echo "Docker installation completed"
fi


echo
echo "Docker version:"
docker --version


echo
echo "======================================"
echo "Checking Docker Service"
echo "======================================"

sudo systemctl enable docker
sudo systemctl start docker

echo "Docker service is running"


echo
echo "======================================"
echo "Checking Docker Compose V2"
echo "======================================"

if docker compose version &> /dev/null
then

    echo "Docker Compose already installed"

else

    echo "Docker Compose missing. Installing Docker Compose V2..."

    sudo mkdir -p /usr/local/lib/docker/cli-plugins

    sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
    -o /usr/local/lib/docker/cli-plugins/docker-compose

    sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

    echo "Docker Compose installation completed"

fi


echo
echo "Docker Compose version:"
docker compose version



echo
echo "======================================"
echo "Checking Docker Buildx"
echo "======================================"

if docker buildx version &> /dev/null
then

    echo "Docker Buildx already installed"

else

    echo "Docker Buildx missing. Installing Docker Buildx..."

    sudo mkdir -p /usr/local/lib/docker/cli-plugins

    sudo curl -SL https://github.com/docker/buildx/releases/download/v0.17.1/buildx-v0.17.1.linux-amd64 \
    -o /usr/local/lib/docker/cli-plugins/docker-buildx

    sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-buildx

    echo "Docker Buildx installation completed"

fi


echo
echo "Docker Buildx version:"
docker buildx version


echo
echo "Docker Buildx builders:"
docker buildx ls



echo
echo "======================================"
echo "Checking Swap"
echo "======================================"

if swapon --show | grep -q "/swapfile"
then

    echo "Swap already configured"

else

    echo "Creating 2GB swap..."

    sudo fallocate -l 2G /swapfile

    sudo chmod 600 /swapfile

    sudo mkswap /swapfile

    sudo swapon /swapfile

    echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab

    echo "Swap creation completed"

fi


echo
echo "======================================"
echo "Docker Group"
echo "======================================"

getent group docker



echo
echo "======================================"
echo "Memory Status"
echo "======================================"

free -h


echo
echo "======================================"
echo "Swap Status"
echo "======================================"

swapon --show



echo
echo "======================================"
echo "FINAL VALIDATION"
echo "======================================"

docker --version

docker compose version

docker buildx version


echo
echo "======================================"
echo " QuickCart Server Setup Completed"
echo "======================================"
