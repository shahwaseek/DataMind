---
name: devops-docker-deployment
description: Multi-stage Dockerfiles, docker-compose orchestration, environment variable management, container health checks, production builds, and GitHub Actions CI/CD workflows.
---

# DevOps & Docker Deployment Skill

This skill provides patterns for containerizing applications, writing multi-stage Docker builds, configuring compose environments, and establishing automated CI/CD pipelines.

---

## 🐳 1. Multi-Stage Dockerfile (FastAPI Backend)

```dockerfile
# Stage 1: Builder
FROM python:3.10-slim AS builder
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Stage 2: Final Runtime
FROM python:3.10-slim
WORKDIR /app
COPY --from=builder /install /usr/local
COPY . .
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 🐙 2. Docker Compose Environment (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
    ports:
      - "8000:8000"
    environment:
      - APP_ENV=production
      - HOST=0.0.0.0
      - PORT=8000
    volumes:
      - ./data:/app/data

  frontend:
    build:
      context: ./frontend
    ports:
      - "5173:80"
    depends_on:
      - backend
```

---

## ⚙️ 3. GitHub Actions CI/CD Pipeline (`.github/workflows/ci.yml`)

- Run linting, type checks, unit tests (pytest), and frontend production builds on every push to `main` and pull requests.
