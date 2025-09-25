# Use Python 3.11 slim image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

# Set work directory
WORKDIR /app

# Install system dependencies including Tesseract OCR
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    tesseract-ocr-hin \
    libtesseract-dev \
    libleptonica-dev \
    libpng-dev \
    libjpeg-dev \
    libtiff-dev \
    libgif-dev \
    pkg-config \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Verify Tesseract installation
RUN tesseract --version && tesseract --list-langs

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Create media directory for file uploads
RUN mkdir -p /app/media

# Expose port
EXPOSE 8000

# Run the application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "apna_lawyer.wsgi:application"]
