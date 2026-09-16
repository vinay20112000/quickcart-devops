#!/bin/bash

set -e

echo "======================================"
echo " QuickCart Server Setup"
echo " Amazon Linux 2023"
echo "======================================"

echo
echo "Checking operating system..."
cat /etc/os-release

echo
echo "Checking Docker..."
docker --version

echo
echo "Checking Docker Compose..."
docker compose version

echo
echo "Checking Docker group..."
getent group docker

echo
echo "Checking memory..."
free -h

echo
echo "Checking swap..."
swapon --show

echo
echo "Server prerequisites check complete."
