# Description: Dockerfile for the backend service
FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libsndfile1 \
    portaudio19-dev \
    ffmpeg \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Copy requirements and install dependencies
COPY docker/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir fastapi uvicorn gunicorn && \
    pip install --no-cache-dir spacy && \
    python -m spacy download en_core_web_sm

# Pre-download models to avoid runtime downloads
RUN python -c "import whisper; whisper.load_model('tiny')"
RUN python -c "from transformers import pipeline; pipe = pipeline('summarization', model='sshleifer/distilbart-cnn-6-6')"

# Copy application code
COPY . .

# Install the package
RUN pip install -e .

# Create necessary directories
RUN mkdir -p /workspace/data /workspace/keys

# Volume for persistent storage
VOLUME ["/workspace/data"]
VOLUME ["/workspace/keys"]

# Expose port for X11 forwarding (if needed)
EXPOSE 8000

# Set entrypoint
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]