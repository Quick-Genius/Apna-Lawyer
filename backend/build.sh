#!/usr/bin/env bash
# exit on error
set -o errexit

# Upgrade pip and install build dependencies first
python -m pip install --upgrade pip
python -m pip install --upgrade wheel setuptools

# Force use of binary packages when available (avoid building from source)
pip install --only-binary :all: Pillow==10.2.0

# Install remaining requirements
pip install -r requirements.txt

# Run Django migrations
python manage.py collectstatic --noinput
python manage.py migrate