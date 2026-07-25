# GradeSense AI — Enterprise Production Deployment Guide

This document outlines the architecture, security practices, and deployment steps for deploying **GradeSense AI** into an enterprise paper manufacturing plant network.

---

## 🏗 Enterprise Deployment Architecture

```
                       [Plant Operators / DCS Clients]
                                      │
                                      ▼
                        [Nginx Reverse Proxy / Load Balancer]
                                (SSL/TLS Termination)
                                      │
                  ┌───────────────────┴───────────────────┐
                  ▼                                       ▼
        [Next.js Frontend Container]            [FastAPI Backend Cluster]
           (Industrial Dashboard)               (Uvicorn Workers / ML Engine)
                                                          │
                                      ┌───────────────────┴───────────────────┐
                                      ▼                                       ▼
                           [PostgreSQL 15 Time-Series]              [Redis Cache & Queue]
```

---

## 🛡 Production Security Best Practices

1. **JWT Secret Rotation**: Generate a cryptographically secure 256-bit secret key for JWT token signing:
   ```bash
   openssl rand -hex 32
   ```
2. **CORS Isolation**: Restrict `ALLOWED_ORIGINS` in `.env` to internal plant DCS subnets.
3. **Database Security**: Never expose PostgreSQL port 5432 publicly. Use internal Docker network bridges or SSL encrypted connections.
4. **SSL/TLS Certificate**: Terminate TLS at Nginx using Let's Encrypt or your mill's internal CA certificates:
   ```nginx
   listen 443 ssl http2;
   ssl_certificate /etc/ssl/certs/gradesense.crt;
   ssl_certificate_key /etc/ssl/private/gradesense.key;
   ```

---

## 🚀 Deployment Steps (Docker Swarm or Single Host)

1. **Configure Environment Variables**:
   Update `.env` with production secrets:
   ```ini
   ENVIRONMENT=production
   SECRET_KEY=<your_generated_secret>
   DATABASE_URL=postgresql+asyncpg://prod_user:prod_pass@postgres:5432/gradesense_db
   ALLOWED_ORIGINS=https://gradesense.plant.internal
   ```

2. **Build and Deploy Stack**:
   ```bash
   docker-compose -f docker-compose.yml up -d --build
   ```

3. **Train Active ML Model**:
   Execute the automated model selection training pipeline inside the backend container:
   ```bash
   docker-compose exec backend python -m app.ai.training_pipeline --n-samples 20000
   ```

4. **Verify Health Probes**:
   ```bash
   curl -f http://localhost:8000/api/v1/health
   ```

---

## 📈 Kubernetes Deployment (Optional)

Kubernetes Helm manifests can be generated using standard deployment definitions pointing to built images `gradesense-backend:latest` and `gradesense-frontend:latest`.
