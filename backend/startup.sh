#!/bin/bash

# Startup script for Django app with Tesseract OCR
echo "Starting Django application with OCR support..."

# Check if Tesseract is installed
if command -v tesseract &> /dev/null; then
    echo "✓ Tesseract is installed"
    tesseract --version
    echo "Available languages:"
    tesseract --list-langs
else
    echo "✗ Tesseract not found - attempting installation..."
    
    # Try to install Tesseract (for Ubuntu/Debian systems)
    if command -v apt-get &> /dev/null; then
        echo "Installing Tesseract via apt-get..."
        apt-get update
        apt-get install -y tesseract-ocr tesseract-ocr-eng tesseract-ocr-hin libtesseract-dev libleptonica-dev
    elif command -v yum &> /dev/null; then
        echo "Installing Tesseract via yum..."
        yum install -y tesseract tesseract-langpack-eng tesseract-langpack-hin
    else
        echo "Package manager not found. Please install Tesseract manually."
        exit 1
    fi
fi

# Run Django migrations
echo "Running Django migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start the Django application
echo "Starting Django server..."
exec "$@"
