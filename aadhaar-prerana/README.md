# AADHAAR-PRERANA 🇮🇳

**Proactive Response & Engagement Analysis Network**

> *From Passive Identity to Proactive Governance: A Data-Driven Policy Engine*

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.15+-orange.svg)](https://tensorflow.org)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-Govt%20Restricted-red.svg)]()

---

## 🏆 Team FREAKS

| Member | Role |
|--------|------|
| **Uma Sai Sri Masina** | Data Science Lead |
| **Movva Chenna Kesav** | ML Engineer |
| **Yashwant Kamireddi** | Full Stack Developer |
| **Nikil Chebolu** | Backend Architect |
| **Sanjay Reddy** | DevOps & Integration |

---

## 📋 Problem Statement

India's governance model is **reactive**: citizens must prove they need help. This leads to:

- 🚫 **Welfare Exclusion**: 11M+ children become "invisible" between birth and school enrollment
- 🏗️ **Infrastructure Collapse**: Urban planners use 10-year-old Census data while migration happens daily
- ⚠️ **Organized Fraud**: Syndicates manipulate demographics before recruitment rallies

### Our Solution: Proactive Governance

Inspired by **Estonia's X-Road** and **Singapore's LifeSG**, we transform UIDAI's passive identity database into an **active policy radar**.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AADHAAR-PRERANA                              │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │   GENESIS   │  │  MOBILITY   │  │  INTEGRITY  │                 │
│  │   Engine    │  │   Engine    │  │   Engine    │                 │
│  │  (Child     │  │  (Migration │  │  (Fraud     │                 │
│  │   Tracker)  │  │   Radar)    │  │   Shield)   │                 │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                 │
│         │                │                │                         │
│         └────────────────┼────────────────┘                         │
│                          │                                          │
│              ┌───────────▼───────────┐                             │
│              │    ML Pipeline        │                             │
│              │  - Z-Score Anomaly    │                             │
│              │  - LSTM Forecasting   │                             │
│              │  - Cohort Clustering  │                             │
│              └───────────┬───────────┘                             │
│                          │                                          │
│              ┌───────────▼───────────┐                             │
│              │   FastAPI Backend     │                             │
│              │   /api/v1/*           │                             │
│              └───────────┬───────────┘                             │
│                          │                                          │
│              ┌───────────▼───────────┐                             │
│              │   React Dashboard     │                             │
│              │   (PMO Interface)     │                             │
│              └───────────────────────┘                             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
aadhaar-prerana/
├── backend/
│   ├── api/                    # FastAPI routes
│   ├── engines/                # Core analysis engines
│   │   ├── genesis_engine.py   # Child inclusion tracker
│   │   ├── mobility_engine.py  # Migration radar
│   │   └── integrity_engine.py # Fraud detection
│   ├── ml/                     # ML models & training
│   ├── utils/                  # Helper functions
│   ├── config/                 # Configuration
│   └── data_ingestion/         # ETL pipelines
├── ml_models/                  # Trained model artifacts
├── src/                        # React dashboard
├── docs/                       # Documentation
├── visualizations/             # Generated charts
├── scripts/                    # Utility scripts
└── tests/                      # Test suites
```

---

## 🔬 Core Engines

### Engine A: GENESIS — Child Inclusion Tracker
Correlates birth enrollments with biometric updates to identify the **"Invisible Child Gap"** — children enrolled at birth but never updated.

### Engine B: MOBILITY — Urban Stress Predictor
Tracks address update velocity to predict migration patterns **48 hours** before infrastructure stress.

### Engine C: INTEGRITY — Fraud Detection Shield
Uses Z-Score anomaly detection (σ > 3) to identify "flash mob" update patterns indicating organized fraud.

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/YashwanthKamireddi/project-prerana.git
cd project-prerana/aadhaar-prerana

# Backend setup
cd backend
pip install -r requirements.txt
python main.py

# Frontend setup (new terminal)
cd aadhaar-prerana
npm install
npm run dev
```

---

## 📊 Datasets

| Dataset | Description | Records |
|---------|-------------|---------|
| Enrolment Data | New Aadhaar registrations | ~1,000,000 |
| Demographic Updates | Address, DOB, name changes | ~2,000,000 |
| Biometric Updates | Fingerprint & iris records | ~1,800,000 |

---

## 📈 Impact

- **Child Welfare**: Re-enroll 11M+ invisible children
- **Urban Planning**: 48-hour advance stress prediction
- **Fraud Prevention**: Save ₹100Cr+ in DBT leakage annually

---

## 📜 License

This project is developed for UIDAI and is subject to Government of India data protection regulations.

---

**Submitted for**: UIDAI Hackathon 2026
**Date**: January 20, 2026
