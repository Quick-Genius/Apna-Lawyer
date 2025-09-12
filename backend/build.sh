#!/usr/bin/env bash
# exit on error
set -o errexit

# Install system dependencies for Pillow
apt-get update && apt-get install -y \
    python3-dev \
    python3-pip \
    python3-setuptools \
    python3-wheel \
    python3-cffi \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    shared-mime-info

# Install project dependencies using Poetry
poetry install --no-interaction --no-ansi

# Run Django commands
poetry run python manage.py collectstatic --noinput
poetry run python manage.py migrate