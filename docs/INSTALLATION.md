# GradeSense AI — Local Installation & Setup Guide

This guide walks you through setting up **GradeSense AI** locally for development or demonstration.

---

## Prerequisites

- **Docker Desktop** (version 24.0+ and Docker Compose v2)
- **Node.js** 20+ and `npm` (if running frontend outside Docker)
- **Python** 3.11+ (if running backend outside Docker)
- **Git**

---

## Option 1: Quickstart with Docker Compose (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/enterprise/gradesense-ai.git
   cd gradesense-ai
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Launch the production service stack:**
   ```bash
   docker-compose up -d --build
   ```

4. **Verify container status:**
   ```bash
   docker-compose ps
   ```

5. **Train the ML Models (Initial Run):**
   ```bash
   docker-compose exec backend python -m app.ai.training_pipeline
   ```

6. **Access the application:**
   - **Industrial Control Dashboard:** [http://localhost](http://localhost) (via Nginx proxy on Port 80) or [http://localhost:3000](http://localhost:3000)
   - **FastAPI Interactive Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
   - **System Health Endpoint:** [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

---

## Option 2: Local Development Setup (Manual)

### 1. Database Setup (PostgreSQL)
Ensure PostgreSQL is running locally or run the database container only:
```bash
docker-compose up -d postgres redis
```

Seed the schema and mill data:
```bash
psql -U gradesense_user -d gradesense_db -f backend/app/db/schema.sql
psql -U gradesense_user -d gradesense_db -f backend/app/db/seed.sql
```

### 2. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Train initial ML models (RF, XGBoost, LightGBM)
python -m app.ai.training_pipeline --n-samples 5000

# Start development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Running Test Suites

Run the Pytest backend unit, integration, and API test suite:
```bash
cd backend
pytest tests/ -v --cov=app
```
