#!/bin/bash

set -e

echo "======================================"
echo " QuickCart Jenkins Setup"
echo "======================================"


SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"

JENKINS_DIR="$APP_DIR/jenkins"


echo
echo "Project directory:"
echo "$APP_DIR"


echo
echo "Checking Docker..."

if ! command -v docker &> /dev/null
then
    echo "Docker is not installed."
    echo "Run server-setup.sh first."
    exit 1
fi


echo
echo "Docker detected:"
docker --version


echo
echo "Detecting Docker group..."

DOCKER_GID=$(getent group docker | cut -d: -f3)


if [ -z "$DOCKER_GID" ]
then
    echo "Docker group not found"
    exit 1
fi


echo "Docker GID:"
echo "$DOCKER_GID"

export DOCKER_GID

echo "Creating Jenkins environment file..."

echo "DOCKER_GID=$DOCKER_GID" > "$JENKINS_DIR/.env"

echo
echo "Starting Jenkins..."

cd "$JENKINS_DIR"

docker compose up -d


echo
echo "Jenkins container status..."

docker compose ps

echo
echo "Waiting for Jenkins startup..."

for i in {1..12}
do
    if docker exec quickcart-jenkins docker ps &> /dev/null
    then
        echo "Jenkins Docker access is ready"
        break
    fi

    echo "Waiting..."
    sleep 10
done


echo
echo "Testing Jenkins Docker access..."

docker exec quickcart-jenkins docker ps

echo
echo "Checking Jenkins user..."

docker exec quickcart-jenkins id


echo
echo "Checking Docker socket permissions..."

docker exec quickcart-jenkins ls -ln /var/run/docker.sock

echo
echo "======================================"
echo " Jenkins Setup Completed"
echo "======================================"
