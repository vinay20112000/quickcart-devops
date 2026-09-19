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
echo "Starting application..."

docker compose -p quickcart up -d

echo
echo "Current containers..."

docker compose -p quickcart ps

echo
echo "Waiting for application health..."


for i in {1..12}
do

    HEALTH=$(curl -s http://nginx/api/health)
    echo "$HEALTH"


    if echo "$HEALTH" | grep -q '"database":"UP"'
    then
        echo "Application is healthy"
        break
    fi


    echo "Database not ready. Waiting..."

    sleep 10

done


if ! echo "$HEALTH" | grep -q '"database":"UP"'
then
    echo "Deployment failed. Application health check failed."
    exit 1
fi


echo
echo
echo "Deployment completed successfully!"
