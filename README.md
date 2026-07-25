# GradeSense AI — Enterprise Paper Quality Prediction & Prescriptive Control Advisory 🏭⚡

[![CI/CD Pipeline](https://github.com/enterprise/gradesense-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/enterprise/gradesense-ai/actions/workflows/ci.yml)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15+-000000.svg?logo=next.js)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1.svg?logo=postgresql)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Production_Ready-2496ED.svg?logo=docker)](https://www.docker.com)

**GradeSense AI** is a production-grade enterprise software suite designed for paper manufacturing plants to **predict quality deviations during grade transitions**, **explain root-cause physics using SHAP Explainable AI**, and **recommend prescriptive DCS parameter corrections** to minimize off-spec paper waste and transition downtime.

---

## 🌟 Key Product Capabilities

- 📊 **Industrial Control Room Dashboard (Honeywell Experion / Siemens DCS Theme)**: High-density operational interface rendering real-time machine telemetry, risk score gauges, transition progress meters, and animated trend charts.
- ⚡ **Automated Telemetry Ingestion & ETL Pipeline**: Accepts multi-format CSV/Excel file uploads or high-frequency REST streams. Automatically prunes duplicates, imputes missing values, and clips $3\sigma$ Z-score outliers.
- 🤖 **Auto-Selecting Machine Learning Engine**: Trains, cross-validates, and evaluates **Random Forest**, **XGBoost**, and **LightGBM** models on 25 engineered process features. Automatically persists the best model by F1-macro.
- 🔍 **SHAP Explainable AI (XAI)**: Translates complex model decision boundaries into plain operator-friendly language, contribution percentages, and historical range comparisons.
- 💡 **Prescriptive AI Recommendation Engine**: Combines AI predictions, DCS physics rule evaluation, and historical transition matching to advise optimal setpoint adjustments (e.g. *Increase Steam Pressure*, *Reduce Machine Speed*).
- 💻 **Digital Twin What-If Simulator**: Allows operators to interactively tune process sliders and simulate real-time quality trajectories, section thermal loads, and waste reduction.

---

## 🛠 Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.11) with Repository-Service architecture
- **Database**: PostgreSQL 15 with Range Partitioning by `timestamp` & BRIN indexes
- **ORM & Migrations**: SQLAlchemy 2.0 Async, Alembic, Prisma ORM
- **ML Engine**: `scikit-learn`, `xgboost`, `lightgbm`, `shap` (TreeExplainer), `joblib`
- **Security & Auth**: OAuth2 Bearer JWT Tokens, Passlib (bcrypt)

### Frontend
- **Framework**: Next.js 15 (React 19, TypeScript)
- **Styling**: Vanilla CSS tokens, Tailwind CSS, shadcn/ui components
- **Visualization**: Recharts animated trend graphs, SVG gauges & section heatmaps

### Infrastructure
- **Proxy & Web Server**: Nginx Reverse Proxy with Gzip & rate-limiting
- **Containerization**: Multi-stage Dockerfiles & Docker Compose orchestration
- **CI/CD**: GitHub Actions workflow for linting, testing, and Docker builds

---

## 📁 Repository Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── ai/                 # ML Engine: Feature engineering, Synthetic Data, Training, SHAP Explainer
│   │   ├── api/v1/endpoints/   # REST Controllers: Predictions, Recommendations, Simulator, Ingestion, Auth
│   │   ├── core/               # App Configuration, DB session, Security, Logging
│   │   ├── crud/               # Database Repositories
│   │   ├── db/                 # Schema DDL, Alembic migrations, Seed SQL
│   │   ├── models/             # SQLAlchemy ORM Data Models (15 Entities)
│   │   ├── schemas/            # Pydantic Request/Response DTOs
│   │   └── services/           # Business Logic: ETL pipeline, Recommendation Engine, Simulator
│   ├── artifacts/              # Trained ML model joblib files & model_manifest.json
│   ├── data/                   # Synthetic and real SCADA training datasets
│   ├── tests/                  # Pytest Unit, Integration, and API test suites
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/(dashboard)/    # 11 Operational Dashboard Views
│   │   ├── components/         # Reusable UI cards, gauges, charts, layout frames
│   │   └── lib/                # Utilities & API helpers
│   ├── Dockerfile
│   └── package.json
├── nginx/                      # Nginx reverse proxy configuration & security headers
├── docs/                       # Installation, Deployment, and Database Backup documentation
├── docker-compose.yml          # Production Docker orchestration
└── README.md
```

---

## 🚀 Quickstart Guide

For complete installation steps, refer to [docs/INSTALLATION.md](file:///c:/Users/Lenovo/Desktop/Honeywell/docs/INSTALLATION.md).

```bash
# 1. Clone repository & configure environment variables
cp .env.example .env

# 2. Launch production stack via Docker Compose
docker-compose up -d --build

# 3. Train active ML model inside backend container
docker-compose exec backend python -m app.ai.training_pipeline

# 4. Open Industrial Dashboard in browser
open http://localhost
```

---

## 📚 Documentation Links

- [Installation Guide](file:///c:/Users/Lenovo/Desktop/Honeywell/docs/INSTALLATION.md)
- [Enterprise Deployment Guide](file:///c:/Users/Lenovo/Desktop/Honeywell/docs/DEPLOYMENT.md)
- [Database Backup & Restore Procedures](file:///c:/Users/Lenovo/Desktop/Honeywell/docs/DATABASE_BACKUP.md)
- [Interactive Swagger API Docs](http://localhost:8000/docs)
