FROM python:3.11-slim

# Metadata
LABEL maintainer="Xeepy Contributors <support@xeepy.dev>"
LABEL description="Xeepy - X/Twitter Automation Toolkit"
LABEL version="0.1.0"

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    DEBIAN_FRONTEND=noninteractive

# Create app directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY pyproject.toml ./
COPY README.md ./
COPY LICENSE ./

# Install Python dependencies
RUN pip install --upgrade pip setuptools wheel && \
    pip install -e .[all]

# Copy application code
COPY xeepy/ ./xeepy/
COPY xeepy.example.yml ./

# Create non-root user
RUN useradd -m -u 1000 xeepy && \
    chown -R xeepy:xeepy /app

USER xeepy

# Expose API port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Default command
CMD ["xeepy-api", "--host", "0.0.0.0", "--port", "8000"]
