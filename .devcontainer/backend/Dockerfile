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
    python -m spacy download en_core_web_sm && \
    pip install --no-cache-dir debugpy && \
    pip install --no-cache-dir python-multipart aiofiles

# Create a virtual environment for debugging
RUN python -m venv /workspace/.venv-debug && \
    /workspace/.venv-debug/bin/pip install --no-cache-dir --upgrade pip && \
    /workspace/.venv-debug/bin/pip install --no-cache-dir -r requirements.txt && \
    /workspace/.venv-debug/bin/pip install --no-cache-dir fastapi uvicorn gunicorn debugpy && \
    /workspace/.venv-debug/bin/pip install --no-cache-dir spacy && \
    /workspace/.venv-debug/bin/pip install --no-cache-dir python-multipart aiofiles && \
    /workspace/.venv-debug/bin/python -m spacy download en_core_web_sm

# Pre-download models to avoid runtime downloads
RUN python -c "import whisper; whisper.load_model('tiny')"
RUN python -c "from transformers import pipeline; pipe = pipeline('summarization', model='sshleifer/distilbart-cnn-6-6')"

# Copy application code
COPY . .

# Install the package
RUN pip install -e . && \
    /workspace/.venv-debug/bin/pip install -e .

# Create necessary directories
RUN mkdir -p /workspace/data /workspace/keys

# Volume for persistent storage
VOLUME ["/workspace/data"]
VOLUME ["/workspace/keys"]

# Expose ports for application and debugging
EXPOSE 8000 5678

# Set entrypoint
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]