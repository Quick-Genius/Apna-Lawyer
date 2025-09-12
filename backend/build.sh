#!/usr/bin/env bash
# exit on error
set -o errexit

# Upgrade pip and install build dependencies first
python -m pip install --upgrade pip
pip install wheel setuptools

# Install requirements
pip install -r requirements.txt

# Run Django migrations
python manage.py migrate