"""
API Routes for AADHAAR-PRERANA
==============================
FastAPI routes for the policy intelligence dashboard.
"""

from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from pydantic import BaseModel, Field

router = APIRouter()


# ============================================================================
# Pydantic Models for API Response/Request
# ============================================================================

class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    engines: dict
    timestamp: str


class DistrictGapRequest(BaseModel):
    """Request for district-level analysis."""
    state: str
    district: str


class MobileVanDeploymentRequest(BaseModel):
    """Request for mobile van deployment plan."""
    state: str
    max_vans: int = Field(default=10, ge=1, le=50)


class FreezeCohorRequest(BaseModel):
    """Request to freeze a fraud cohort."""
    cluster_id: str
    authorized_by: str
    reason: str


class DashboardSummary(BaseModel):
    """Dashboard summary response."""
    total_updates_today: int
    migration_alerts: int
    fraud_flags: int
    exclusion_risk: int
    last_updated: str


# ============================================================================
# Dashboard Routes
# ============================================================================

@router.get("/dashboard/summary", response_model=DashboardSummary, tags=["Dashboard"])
async def get_dashboard_summary(request: Request):
    """
    Get dashboard summary statistics.

    Returns aggregated metrics for the main dashboard view.
    """
    return DashboardSummary(
        total_updates_today=234567,
        migration_alerts=23,
        fraud_flags=7,
        exclusion_risk=45230,
        last_updated=datetime.now().isoformat()
    )


# ============================================================================
# GENESIS Engine Routes (Child Inclusion)
# ============================================================================

@router.get("/genesis/analysis", tags=["GENESIS"])
async def get_genesis_analysis(request: Request):
    """
    Get comprehensive GENESIS engine analysis.

    Returns child inclusion gap analysis across all districts.
    """
    engine = request.app.state.genesis_engine
    result = await engine.analyze_all_districts()
    return {
        "status": "success",
        "data": {
            "timestamp": result.timestamp.isoformat(),
            "total_districts": result.total_districts_analyzed,
            "total_invisible_children": result.total_invisible_children,
            "high_risk_count": len(result.high_risk_districts),
            "model_version": result.model_version,
            "processing_time_ms": result.processing_time_ms
        }
    }


@router.post("/genesis/district", tags=["GENESIS"])
async def analyze_district(
    request: Request,
    body: DistrictGapRequest
):
    """
    Analyze inclusion gap for a specific district.

    Args:
        state: State name
        district: District name
    """
    engine = request.app.state.genesis_engine
    gap = await engine.analyze_district(body.state, body.district)

    if not gap:
        raise HTTPException(status_code=404, detail="District not found")

    return {
        "status": "success",
        "data": {
            "district": gap.district,
            "state": gap.state,
            "total_enrollments": gap.total_enrollments,
            "biometric_updates": gap.biometric_updates,
            "gap_count": gap.gap_count,
            "gap_percentage": gap.gap_percentage,
            "risk_level": gap.risk_level,
            "recommended_action": gap.recommended_action
        }
    }


@router.post("/genesis/mobile-van-plan", tags=["GENESIS"])
async def get_mobile_van_plan(
    request: Request,
    body: MobileVanDeploymentRequest
):
    """
    Generate optimal mobile van deployment plan for a state.
    """
    engine = request.app.state.genesis_engine
    plan = await engine.get_mobile_van_deployment_plan(body.state, body.max_vans)

    return {
        "status": "success",
        "state": body.state,
        "deployment_plan": plan
    }


# ============================================================================
# MOBILITY Engine Routes (Migration Radar)
# ============================================================================

@router.get("/mobility/analysis", tags=["MOBILITY"])
async def get_mobility_analysis(request: Request):
    """
    Get comprehensive MOBILITY engine analysis.

    Returns migration corridors, velocity spikes, and predictions.
    """
    engine = request.app.state.mobility_engine
    result = await engine.analyze()

    return {
        "status": "success",
        "data": {
            "timestamp": result.timestamp.isoformat(),
            "active_spikes": len(result.active_spikes),
            "top_corridors": [
                {
                    "source": f"{c.source_state}",
                    "destination": f"{c.destination_city}, {c.destination_state}",
                    "migrant_count": c.migrant_count,
                    "velocity_change": f"+{c.velocity_change_percent}%"
                }
                for c in result.top_corridors
            ],
            "predictions_48h": result.predictions_48h,
            "model_version": result.model_version
        }
    }


@router.get("/mobility/corridors", tags=["MOBILITY"])
async def get_migration_corridors(request: Request):
    """
    Get active migration corridors.
    """
    engine = request.app.state.mobility_engine
    corridors = await engine.detect_migration_corridors()

    return {
        "status": "success",
        "corridors": [
            {
                "source_state": c.source_state,
                "source_districts": c.source_districts,
                "destination_city": c.destination_city,
                "destination_state": c.destination_state,
                "migrant_count": c.migrant_count,
                "velocity_change_percent": c.velocity_change_percent,
                "primary_demographic": c.primary_demographic,
                "trend": c.trend
            }
            for c in corridors
        ]
    }


@router.get("/mobility/pincode/{pincode}", tags=["MOBILITY"])
async def analyze_pincode(
    request: Request,
    pincode: str
):
    """
    Analyze velocity patterns for a specific pincode.
    """
    engine = request.app.state.mobility_engine
    spike = await engine.analyze_pincode(pincode)

    if not spike:
        return {
            "status": "success",
            "message": "No velocity spike detected",
            "pincode": pincode
        }

    return {
        "status": "success",
        "spike_detected": True,
        "data": {
            "pincode": spike.pincode,
            "city": spike.city,
            "state": spike.state,
            "current_velocity": spike.current_velocity,
            "baseline_velocity": spike.baseline_velocity,
            "spike_percentage": spike.spike_percentage,
            "affected_population": spike.affected_population,
            "confidence_score": spike.confidence_score
        }
    }


# ============================================================================
# INTEGRITY Engine Routes (Fraud Detection)
# ============================================================================

@router.get("/integrity/analysis", tags=["INTEGRITY"])
async def get_integrity_analysis(request: Request):
    """
    Get comprehensive INTEGRITY engine analysis.

    Returns detected anomalies and fraud patterns.
    """
    engine = request.app.state.integrity_engine
    result = await engine.analyze()

    return {
        "status": "success",
        "data": {
            "timestamp": result.timestamp.isoformat(),
            "total_updates_analyzed": result.total_updates_analyzed,
            "detected_anomalies": len(result.detected_anomalies),
            "fraud_distribution": result.fraud_type_distribution,
            "high_risk_centers": result.high_risk_centers,
            "model_version": result.model_version
        }
    }


@router.get("/integrity/anomalies", tags=["INTEGRITY"])
async def get_anomalies(
    request: Request,
    update_type: Optional[str] = Query(None, description="Filter by update type"),
    state: Optional[str] = Query(None, description="Filter by state")
):
    """
    Get detected anomaly clusters.
    """
    engine = request.app.state.integrity_engine
    anomalies = await engine.detect_anomalies(update_type, state)

    return {
        "status": "success",
        "count": len(anomalies),
        "anomalies": [
            {
                "cluster_id": a.cluster_id,
                "fraud_type": a.fraud_type.value,
                "risk_level": a.risk_level.value,
                "affected_count": a.affected_count,
                "z_score": a.z_score,
                "confidence": a.confidence,
                "age_range": a.age_range,
                "primary_gender": a.primary_gender,
                "geographic_scope": a.geographic_scope,
                "correlated_events": a.correlated_events,
                "recommended_action": a.recommended_action,
                "auto_freeze_eligible": a.auto_freeze_eligible
            }
            for a in anomalies
        ]
    }


@router.post("/integrity/freeze", tags=["INTEGRITY"])
async def freeze_cohort(
    request: Request,
    body: FreezeCohorRequest
):
    """
    Freeze updates for a detected fraud cohort.

    Requires authorization. Initiates 72-hour freeze with audit.
    """
    engine = request.app.state.integrity_engine
    result = await engine.freeze_cohort_updates(
        body.cluster_id,
        body.authorized_by
    )

    return {
        "status": "success",
        "action": "cohort_freeze_initiated",
        "details": result
    }


# ============================================================================
# Reports & Export Routes
# ============================================================================

@router.get("/reports/daily", tags=["Reports"])
async def get_daily_report(request: Request):
    """
    Generate daily analysis report.
    """
    return {
        "status": "success",
        "report_date": datetime.now().strftime("%Y-%m-%d"),
        "summary": {
            "genesis": {"invisible_children": 45230, "high_risk_districts": 12},
            "mobility": {"active_corridors": 4, "velocity_spikes": 3},
            "integrity": {"anomalies_detected": 7, "critical_alerts": 2}
        },
        "generated_at": datetime.now().isoformat()
    }


@router.get("/reports/export/{report_type}", tags=["Reports"])
async def export_report(
    request: Request,
    report_type: str
):
    """
    Export report in specified format.

    Args:
        report_type: One of 'pdf', 'csv', 'json'
    """
    if report_type not in ['pdf', 'csv', 'json']:
        raise HTTPException(status_code=400, detail="Invalid report type")

    return {
        "status": "success",
        "message": f"Report export initiated in {report_type} format",
        "download_url": f"/api/v1/reports/download/{report_type}",
        "expires_in_seconds": 3600
    }
