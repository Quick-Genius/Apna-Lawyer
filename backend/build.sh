#!/usr/bin/env bash
# exit on error
set -o errexit

# create static directory
mkdir -p backend/static

# Install project dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate

# Create necessary directories for logging
mkdir -p /opt/render/project/src/logs/