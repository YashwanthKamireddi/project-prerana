# AADHAAR-PRERANA Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            PRESENTATION LAYER                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    │
│  │  React Dashboard │    │  Mobile App     │    │  Report Portal  │    │
│  │  (PMO Interface) │    │  (Field Teams)  │    │  (Analytics)    │    │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘    │
│           │                      │                      │              │
│           └──────────────────────┼──────────────────────┘              │
│                                  │                                      │
└──────────────────────────────────┼──────────────────────────────────────┘
                                   │
                                   │ REST API / WebSocket
                                   │
┌──────────────────────────────────┼──────────────────────────────────────┐
│                              API GATEWAY                                │
├──────────────────────────────────┼──────────────────────────────────────┤
│                                  │                                      │
│  ┌─────────────────┐    ┌───────▼───────┐    ┌─────────────────┐       │
│  │  Rate Limiting  │    │   FastAPI     │    │  Auth Service   │       │
│  │                 │◄───►  Main Router  │◄───►  (JWT/API Key)  │       │
│  └─────────────────┘    └───────┬───────┘    └─────────────────┘       │
│                                 │                                       │
└─────────────────────────────────┼───────────────────────────────────────┘
                                  │
┌─────────────────────────────────┼───────────────────────────────────────┐
│                         ENGINE LAYER                                    │
├─────────────────────────────────┼───────────────────────────────────────┤
│                                 │                                       │
│  ┌──────────────┐   ┌──────────▼──────────┐   ┌──────────────┐         │
│  │   GENESIS    │   │     MOBILITY        │   │  INTEGRITY   │         │
│  │   ENGINE     │   │     ENGINE          │   │   ENGINE     │         │
│  │              │   │                     │   │              │         │
│  │ Child Gap    │   │ Migration Radar     │   │ Fraud Shield │         │
│  │ Tracker      │   │ Urban Stress        │   │ Anomaly      │         │
│  │              │   │ Predictor           │   │ Detection    │         │
│  └──────┬───────┘   └──────────┬──────────┘   └──────┬───────┘         │
│         │                      │                      │                 │
│         └──────────────────────┼──────────────────────┘                 │
│                                │                                        │
│                    ┌───────────▼───────────┐                           │
│                    │     ML Pipeline       │                           │
│                    │  - Feature Engineering│                           │
│                    │  - Model Inference    │                           │
│                    │  - Caching Layer      │                           │
│                    └───────────┬───────────┘                           │
│                                │                                        │
└────────────────────────────────┼────────────────────────────────────────┘
                                 │
┌────────────────────────────────┼────────────────────────────────────────┐
│                          ML MODELS                                      │
├────────────────────────────────┼────────────────────────────────────────┤
│                                │                                        │
│   ┌─────────────┐    ┌────────▼────────┐    ┌─────────────┐            │
│   │ Risk        │    │ Velocity LSTM   │    │ Pattern     │            │
│   │ Classifier  │    │ (Forecasting)   │    │ DNN         │            │
│   │ (RF)        │    │                 │    │ (Fraud)     │            │
│   └─────────────┘    └─────────────────┘    └─────────────┘            │
│                                                                         │
│   ┌─────────────┐    ┌─────────────────┐    ┌─────────────┐            │
│   │ Gap         │    │ Corridor        │    │ Isolation   │            │
│   │ Predictor   │    │ XGBoost         │    │ Forest      │            │
│   │ (LSTM)      │    │                 │    │             │            │
│   └─────────────┘    └─────────────────┘    └─────────────┘            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                 │
┌────────────────────────────────┼────────────────────────────────────────┐
│                          DATA LAYER                                     │
├────────────────────────────────┼────────────────────────────────────────┤
│                                │                                        │
│   ┌─────────────┐    ┌────────▼────────┐    ┌─────────────┐            │
│   │ Enrolment   │    │ ETL Pipeline    │    │ Redis       │            │
│   │ Data (CSV)  │───►│ (Data Loader)   │───►│ Cache       │            │
│   └─────────────┘    └─────────────────┘    └─────────────┘            │
│                                │                                        │
│   ┌─────────────┐              │              ┌─────────────┐            │
│   │ Demographic │              │              │ PostgreSQL  │            │
│   │ Data (CSV)  │◄─────────────┼─────────────►│ (Processed) │            │
│   └─────────────┘              │              └─────────────┘            │
│                                │                                        │
│   ┌─────────────┐              │                                        │
│   │ Biometric   │              │                                        │
│   │ Data (CSV)  │◄─────────────┘                                        │
│   └─────────────┘                                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

1. **Ingestion**: CSV files are loaded via the ETL pipeline
2. **Processing**: Data is normalized, cleaned, and cached in Redis
3. **Analysis**: Engines process data using ML models
4. **Inference**: Real-time predictions and anomaly detection
5. **Presentation**: Results served via REST API to dashboard

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Tailwind CSS, Recharts |
| API | FastAPI, Pydantic, Uvicorn |
| ML | TensorFlow, scikit-learn, XGBoost |
| Cache | Redis |
| Database | PostgreSQL (optional) |
| Queue | Celery, RabbitMQ |

## Security

- API Key authentication for all endpoints
- Role-based access control (RBAC)
- Audit logging for sensitive operations
- Data encryption in transit (TLS 1.3)
