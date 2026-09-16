#!/bin/bash

set -e

echo "======================================"
echo " QuickCart Deployment"
echo "======================================"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

echo
echo "Moving to application directory..."

cd "$APP_DIR"


echo
echo "Pulling latest code..."

git pull origin main


echo
echo "Starting application..."

docker compose up -d


echo
echo "Current containers..."

docker compose ps


echo
echo "Waiting for application startup..."

sleep 10


echo
echo "Checking application health..."

curl http://localhost/api/health


echo
echo
echo "Deployment completed successfully!"
