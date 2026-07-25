<div align="center">

# 🏭 GradeSense AI
### Enterprise Paper Quality Prediction & Prescriptive DCS Control Advisory

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-000000.svg?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.0+-4169E1.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker-Production_Ready-2496ED.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)
[![Theme Engine](https://img.shields.io/badge/UI_Theme-Dual_Light_%26_Dark-0284c7.svg?style=for-the-badge&logo=react&logoColor=white)](#-dual-theme-engine)

---

**GradeSense AI** is a production-grade enterprise predictive quality and prescriptive control platform designed for paper manufacturing facilities. It predicts quality deviations during paper grade transitions, explains root-cause physics using **SHAP (SHapley Additive exPlanations)**, and delivers real-time closed-loop setpoint advisories to minimize off-spec paper waste and transition downtime.

</div>

---

## 📑 Table of Contents
- [🌟 Key Product Capabilities](#-key-product-capabilities)
- [🎨 Dual Theme Engine](#-dual-theme-engine)
- [🏗 System Architecture](#-system-architecture)
- [🛠 Technology Stack](#-technology-stack)
- [📂 Project Directory Structure](#-project-directory-structure)
- [⚡ Quickstart & Installation](#-quickstart--installation)
- [🔌 API Endpoints Summary](#-api-endpoints-summary)
- [📚 Documentation & Resources](#-documentation--resources)

---

## 🌟 Key Product Capabilities

| Feature | Description |
| :--- | :--- |
| 🎛️ **DCS Executive Control Room** | High-density operational dashboard designed for paper machine operators with real-time SCADA telemetry, moisture/basis weight gauges, SPC spec bands, and animated transition curves. |
| 🌓 **Dynamic Dual Theme Engine** | Seamless instant toggling between **Modern Light Theme** (clean slate canvas for daylight operation) and **Dark DCS Control Room Theme** (high-contrast dark environment). |
| 🤖 **Auto-Tuning ML Pipeline** | Trains, cross-validates, and evaluates **Random Forest**, **XGBoost**, and **LightGBM** models across 25+ engineered process features. Automatically persists top model by F1-macro. |
| 🧠 **SHAP Explainable AI (XAI)** | Translates complex ML model decision boundaries into plain operator-friendly language, feature contribution percentages, and historical normal range comparisons. |
| 💡 **Prescriptive AI Advisory Engine** | Combines AI predictions, DCS physics rule evaluation, and historical transition matching to advise optimal setpoint adjustments (e.g. *Increase Steam Pressure*, *Reduce Machine Speed*). |
| 🔬 **Digital Twin What-If Simulator** | Interactive sandbox allowing operators to tune process sliders (speed, steam pressure, stock flow) and simulate real-time quality settling timelines and broke waste reduction. |
| 📥 **Multi-Protocol Telemetry ETL** | Ingests multi-format CSV/Excel files, REST streams, MQTT topics, and OPC-UA tags. Automatically prunes duplicates and clips $3\sigma$ Z-score outliers. |

---

## 🎨 Dual Theme Engine

GradeSense AI features a built-in React Theme Context provider supporting dual color systems tailored for industrial environments:

- **☀️ Light Mode**: Optimized for bright operator offices (`#f8fafc` canvas, `#ffffff` card surfaces, `#0284c7` primary sky blue accents).
- **🌙 Dark DCS Mode**: Optimized for control room displays (`#070a11` dark canvas, `#0e1424` card surfaces, `#1e2945` high-contrast grid borders).

Operators can switch modes instantly via the top header **Sun/Moon Toggle Button**, with preferences persisted across browser sessions via `localStorage`.

---

## 🏗 System Architecture

```mermaid
graph TD
    subgraph Data Layer
        A[OPC-UA Telemetry] -->|OPC Tag Stream| E[FastAPI ETL Ingestion]
        B[REST Sensor Stream] -->|JSON Stream| E
        C[MQTT Broker] -->|dcs/telemetry/#| E
        D[CSV / Excel Files] -->|File Upload| E
    end

    subgraph Core Backend & AI Engine
        E --> F[(PostgreSQL 15 DB)]
        F --> G[Feature Engineering Engine]
        G --> H[Model Pipeline: XGBoost / LightGBM]
        H --> I[SHAP Explainer Engine]
        H --> J[Prescriptive Advisory Engine]
    end

    subgraph Industrial Control Room UI
        J --> K[Next.js 15 Dashboard]
        I --> K
        K --> L[DCS Executive View]
        K --> M[Digital Twin Simulator]
        K --> N[Explainable AI View]
        K --> O[Alarm & Deviation Center]
    end
```

---

## 🛠 Technology Stack

### **Frontend**
- **Core Framework**: [Next.js 15](https://nextjs.org) (React 19, TypeScript)
- **Styling**: Tailwind CSS, Vanilla CSS design tokens, custom dark/light color palette
- **Data Visualization**: Recharts animated trend graphs, SVG section gauges, SPC spec bands
- **Icons**: Lucide React

### **Backend**
- **Core Framework**: [FastAPI 0.115](https://fastapi.tiangolo.com) (Python 3.11) with Repository-Service architecture
- **Database**: PostgreSQL 15 with range-partitioned telemetry tables & BRIN indexes
- **ORM & Migrations**: SQLAlchemy 2.0 Async, Alembic
- **Machine Learning**: `scikit-learn`, `xgboost`, `lightgbm`, `shap` (TreeExplainer), `joblib`
- **Security**: OAuth2 Bearer JWT authentication, bcrypt password hashing

### **Infrastructure**
- **Reverse Proxy**: Nginx with SSL termination, Gzip compression, and rate limiting
- **Containerization**: Multi-stage Dockerfiles & Docker Compose orchestration

---

## 📂 Project Directory Structure

```
GradeSense-AI/
├── backend/
│   ├── app/
│   │   ├── ai/                 # ML Engine: Feature engineering, Training, SHAP Explainer
│   │   ├── api/v1/endpoints/   # REST Controllers: Predictions, Simulator, Ingestion, Auth
│   │   ├── core/               # Configuration, Database sessions, Security
│   │   ├── crud/               # Database Repositories
│   │   ├── db/                 # Alembic migrations & DDL schemas
│   │   ├── models/             # SQLAlchemy ORM Data Models
│   │   ├── schemas/            # Pydantic DTO validation schemas
│   │   └── services/           # Business Logic: Recommendation Engine & ETL Pipeline
│   ├── artifacts/              # Trained ML models (.joblib) & manifests
│   ├── data/                   # SCADA telemetry training datasets
│   └── tests/                  # Pytest Unit & Integration tests
├── frontend/
│   ├── src/
│   │   ├── app/(dashboard)/    # 12 Industrial Operational Dashboard Views
│   │   ├── components/         # Cards, Gauges, Charts, Modal, Header, Sidebar
│   │   ├── context/            # React Theme Context (Light / Dark mode engine)
│   │   ├── lib/                # API helpers & utilities
│   │   └── styles/             # Global CSS design tokens
│   └── package.json
├── docker-compose.yml          # Production container orchestration
└── README.md
```

---

## ⚡ Quickstart & Installation

### **Prerequisites**
- Node.js `>= 18.0`
- Python `>= 3.11`
- PostgreSQL `>= 15` (or Docker)

### **Option A: Run Locally (Development Mode)**

#### **1. Backend Setup**
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI dev server
python -m uvicorn app.main:app --port 8000 --reload
```

#### **2. Frontend Setup**
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Next.js dev server
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

### **Option B: Production Stack via Docker Compose**

```bash
# 1. Clone repository & configure environment
cp .env.example .env

# 2. Launch production services
docker-compose up -d --build

# 3. Access Industrial Dashboard
open http://localhost
```

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/predictions/predict` | Predict off-spec probability for target grade transition |
| `POST` | `/api/v1/predictions/explain` | Generate SHAP waterfall & plain-language feature explanations |
| `GET` | `/api/v1/recommendations/` | Fetch active prescriptive process advisories |
| `POST` | `/api/v1/recommendations/{id}/accept` | Accept advisory & dispatch setpoint to OPC-UA controller |
| `POST` | `/api/v1/simulator/run` | Execute Digital Twin What-If process simulation |
| `POST` | `/api/v1/ingestion/upload` | Upload CSV/Excel telemetry for automated ETL processing |

Full interactive API documentation is available at **`http://localhost:8000/docs`** (Swagger UI).

---

## 📚 Documentation & Resources

- 📄 [Installation Guide](file:///c:/Users/Lenovo/Desktop/Honeywell/docs/INSTALLATION.md)
- 🚀 [Deployment & Production Setup](file:///c:/Users/Lenovo/Desktop/Honeywell/docs/DEPLOYMENT.md)
- 💾 [Database Backup & Restore Guide](file:///c:/Users/Lenovo/Desktop/Honeywell/docs/DATABASE_BACKUP.md)

---

<div align="center">

**GradeSense AI** • Enterprise Predictive Quality Platform  
Developed for Modern Paper Manufacturing & Industrial Automation

</div>
