# API Documentation

## AADHAAR-PRERANA REST API v1.0

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication
All endpoints require API key authentication via the `X-API-Key` header.

---

## Dashboard Endpoints

### GET /dashboard/summary
Get dashboard summary statistics.

**Response:**
```json
{
  "total_updates_today": 234567,
  "migration_alerts": 23,
  "fraud_flags": 7,
  "exclusion_risk": 45230,
  "last_updated": "2026-01-20T22:00:00"
}
```

---

## GENESIS Engine Endpoints

### GET /genesis/analysis
Get comprehensive child inclusion gap analysis.

**Response:**
```json
{
  "status": "success",
  "data": {
    "timestamp": "2026-01-20T22:00:00",
    "total_districts": 640,
    "total_invisible_children": 1134567,
    "high_risk_count": 45,
    "model_version": "v1.2.0"
  }
}
```

### POST /genesis/district
Analyze specific district.

**Request Body:**
```json
{
  "state": "Bihar",
  "district": "Sitamarhi"
}
```

### POST /genesis/mobile-van-plan
Generate mobile van deployment plan.

**Request Body:**
```json
{
  "state": "Bihar",
  "max_vans": 10
}
```

---

## MOBILITY Engine Endpoints

### GET /mobility/analysis
Get migration corridor analysis.

### GET /mobility/corridors
Get active migration corridors.

### GET /mobility/pincode/{pincode}
Analyze velocity for specific pincode.

---

## INTEGRITY Engine Endpoints

### GET /integrity/analysis
Get fraud pattern analysis.

### GET /integrity/anomalies
Get detected anomaly clusters.

**Query Parameters:**
- `update_type` (optional): Filter by update type
- `state` (optional): Filter by state

### POST /integrity/freeze
Freeze updates for fraud cohort.

**Request Body:**
```json
{
  "cluster_id": "ANOM-2026-001-SURAT",
  "authorized_by": "Principal Secretary",
  "reason": "Recruitment fraud investigation"
}
```

---

## Reports

### GET /reports/daily
Generate daily analysis report.

### GET /reports/export/{report_type}
Export report in PDF, CSV, or JSON format.

---

## Error Codes

| Code | Description |
|------|-------------|
| 400  | Bad Request |
| 401  | Unauthorized |
| 404  | Not Found |
| 500  | Internal Server Error |
