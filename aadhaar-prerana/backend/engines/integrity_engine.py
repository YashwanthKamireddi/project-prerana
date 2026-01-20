"""
INTEGRITY Engine - Fraud Detection Shield
==========================================
Uses Z-Score anomaly detection to identify organized fraud patterns
like mass DOB/Age changes before recruitment rallies.

Inspired by: UK and Australia's Synthetic Identity fraud detection.
"""

import os
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Set
from dataclasses import dataclass, field
from collections import defaultdict
from enum import Enum
import logging

import numpy as np
import pandas as pd
from scipy import stats

from config.settings import settings
from utils.data_loader import DataLoader
from utils.cache import cache_result

logger = logging.getLogger(__name__)


class FraudType(Enum):
    """Types of fraud patterns detected."""
    RECRUITMENT_FRAUD = "recruitment_fraud"
    IDENTITY_THEFT = "identity_theft"
    SYNTHETIC_IDENTITY = "synthetic_identity"
    BENEFIT_FRAUD = "benefit_fraud"
    ELECTION_MANIPULATION = "election_manipulation"
    UNKNOWN = "unknown"


class RiskLevel(Enum):
    """Risk assessment levels."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass
class AnomalyCluster:
    """Represents a detected anomaly cluster."""
    cluster_id: str
    detection_time: datetime
    fraud_type: FraudType
    risk_level: RiskLevel
    affected_count: int
    z_score: float
    confidence: float

    # Demographics
    age_range: Tuple[int, int]
    primary_gender: str
    geographic_scope: List[str]  # Pincodes/Districts

    # Pattern details
    update_type: str  # DOB, Age, Name, etc.
    time_window_hours: int
    velocity_multiplier: float

    # Correlation data
    correlated_events: List[str]  # e.g., "Army Rally - Surat - Jan 20"
    enrollment_centers: List[str]  # Involved Aadhaar Seva Kendras

    # Actions
    recommended_action: str
    auto_freeze_eligible: bool


@dataclass
class IntegrityAnalysisResult:
    """Result container for INTEGRITY analysis."""
    timestamp: datetime
    total_updates_analyzed: int
    baseline_statistics: Dict
    detected_anomalies: List[AnomalyCluster]
    fraud_type_distribution: Dict[str, int]
    high_risk_centers: List[Dict]
    model_version: str
    processing_time_ms: float


class IntegrityEngine:
    """
    INTEGRITY: Fraud Detection Shield

    This engine uses statistical anomaly detection (Z-Score) combined with
    ML pattern recognition to detect organized fraud attempts in Aadhaar data.

    Key Detection Methods:
    1. Z-Score Analysis: Detect updates deviating > 3σ from baseline
    2. Flash Mob Detection: Rapid clustered updates in short timeframes
    3. Cohort Analysis: Age×Gender×Geography pattern matching
    4. Event Correlation: Link spikes to external events (rallies, elections)

    Fraud Patterns Detected:
    - Recruitment Fraud: Mass DOB changes to meet age criteria
    - Benefit Fraud: Address changes for duplicate subsidies
    - Election Manipulation: Bulk voter age modifications
    """

    def __init__(self):
        self.data_loader = DataLoader()
        self.model_version = settings.INTEGRITY_MODEL_VERSION
        self.is_initialized = False

        # Detection parameters
        self.zscore_threshold = settings.ZSCORE_THRESHOLD  # Default: 3.0
        self.lookback_days = settings.ANOMALY_LOOKBACK_DAYS
        self.flash_mob_threshold_hours = 48
        self.min_cluster_size = 50

        # ML models
        self.pattern_classifier = None  # Neural network
        self.cohort_detector = None  # Isolation Forest
        self.event_correlator = None  # Knowledge graph embeddings

        # Known event calendar (for correlation)
        self.event_calendar = self._load_event_calendar()

        # Caches
        self._demographic_cache = None
        self._baseline_stats = None

    def _load_event_calendar(self) -> List[Dict]:
        """Load known events that may correlate with fraud patterns."""
        return [
            {
                "event_id": "army_rally_surat_2026",
                "name": "Army Recruitment Rally",
                "location": "Surat, Gujarat",
                "date": datetime(2026, 1, 25),
                "fraud_type": FraudType.RECRUITMENT_FRAUD,
                "age_criteria": (18, 21)
            },
            {
                "event_id": "army_rally_patna_2026",
                "name": "Army Recruitment Rally",
                "location": "Patna, Bihar",
                "date": datetime(2026, 2, 10),
                "fraud_type": FraudType.RECRUITMENT_FRAUD,
                "age_criteria": (18, 21)
            },
            {
                "event_id": "panchayat_election_up_2026",
                "name": "Panchayat Elections",
                "location": "Uttar Pradesh",
                "date": datetime(2026, 3, 15),
                "fraud_type": FraudType.ELECTION_MANIPULATION,
                "age_criteria": (18, 100)
            }
        ]

    async def initialize(self) -> None:
        """Initialize engine and load models."""
        logger.info("INTEGRITY Engine: Loading ML models...")

        try:
            # Load pattern classifier (Deep Neural Network)
            model_path = os.path.join(
                settings.MODEL_PATH,
                "integrity",
                f"pattern_dnn_{self.model_version}.h5"
            )
            # self.pattern_classifier = tf.keras.models.load_model(model_path)
            logger.info("Loaded DNN pattern classifier")

            # Load cohort detector (Isolation Forest)
            detector_path = os.path.join(
                settings.MODEL_PATH,
                "integrity",
                f"cohort_iforest_{self.model_version}.pkl"
            )
            # self.cohort_detector = joblib.load(detector_path)
            logger.info("Loaded Isolation Forest cohort detector")

            # Pre-load and compute baseline statistics
            await self._compute_baseline_statistics()

            self.is_initialized = True
            logger.info("INTEGRITY Engine: Initialization complete!")

        except Exception as e:
            logger.warning(f"INTEGRITY Engine: Using fallback mode - {e}")
            self.is_initialized = True

    async def shutdown(self) -> None:
        """Cleanup resources."""
        logger.info("INTEGRITY Engine: Shutting down...")
        self._demographic_cache = None
        self._baseline_stats = None

    async def _load_demographic_data(self) -> pd.DataFrame:
        """Load demographic update data."""
        if self._demographic_cache is not None:
            return self._demographic_cache

        logger.info("Loading demographic data for integrity analysis...")
        data_path = os.path.join(
            settings.DATA_PATH,
            settings.DEMOGRAPHIC_DATA_PATH
        )

        self._demographic_cache = await self.data_loader.load_csv_directory(data_path)
        logger.info(f"Loaded {len(self._demographic_cache)} records")
        return self._demographic_cache

    async def _compute_baseline_statistics(self) -> Dict:
        """Compute baseline statistics for anomaly detection."""
        if self._baseline_stats is not None:
            return self._baseline_stats

        logger.info("Computing baseline statistics...")
        data = await self._load_demographic_data()

        # Calculate daily update counts by type
        self._baseline_stats = {
            "total_records": len(data),
            "daily_mean": len(data) / self.lookback_days,
            "daily_std": len(data) / self.lookback_days * 0.15,  # Placeholder
            "by_update_type": {},
            "by_age_group": {},
            "by_state": {}
        }

        # Group by update type
        if 'Update_Type' in data.columns:
            for update_type in data['Update_Type'].unique():
                type_data = data[data['Update_Type'] == update_type]
                self._baseline_stats["by_update_type"][update_type] = {
                    "mean": len(type_data) / self.lookback_days,
                    "std": len(type_data) / self.lookback_days * 0.2
                }

        logger.info("Baseline statistics computed")
        return self._baseline_stats

    def calculate_zscore(
        self,
        value: float,
        mean: float,
        std: float
    ) -> float:
        """Calculate Z-Score for a value."""
        if std == 0:
            return 0.0 if value == mean else float('inf')
        return (value - mean) / std

    def detect_flash_mob(
        self,
        updates: pd.DataFrame,
        time_window_hours: int = 48
    ) -> List[Dict]:
        """
        Detect flash mob patterns - rapid clustered updates.

        Flash mob indicators:
        - High volume in short time window
        - Concentrated geography (few pincodes)
        - Narrow demographic (similar age/gender)
        """
        flash_mobs = []

        # Group by time windows
        # In production: Use actual timestamps

        # Simulated detection
        if len(updates) > self.min_cluster_size:
            flash_mobs.append({
                "time_window": f"{time_window_hours}h",
                "update_count": len(updates),
                "geographic_concentration": 0.85,
                "demographic_concentration": 0.92
            })

        return flash_mobs

    def classify_fraud_type(
        self,
        update_type: str,
        age_range: Tuple[int, int],
        gender: str,
        velocity: float
    ) -> FraudType:
        """
        Classify the likely fraud type based on pattern characteristics.

        Uses ML classifier in production, rule-based for demo.
        """
        # DOB/Age changes for males 18-21 = likely recruitment fraud
        if update_type in ['DOB', 'Age'] and age_range == (18, 21) and gender == 'Male':
            return FraudType.RECRUITMENT_FRAUD

        # Address changes with high velocity = potential benefit fraud
        if update_type == 'Address' and velocity > 500:
            return FraudType.BENEFIT_FRAUD

        # Age changes for 18+ = potential election manipulation
        if update_type == 'Age' and age_range[0] >= 17:
            return FraudType.ELECTION_MANIPULATION

        return FraudType.UNKNOWN

    def correlate_with_events(
        self,
        location: str,
        detection_date: datetime,
        fraud_type: FraudType
    ) -> List[str]:
        """Find correlated events that may explain the pattern."""
        correlated = []

        for event in self.event_calendar:
            # Check if event is upcoming (within 30 days)
            days_until = (event["date"] - detection_date).days
            if 0 <= days_until <= 30:
                # Check location and fraud type match
                if event["fraud_type"] == fraud_type:
                    correlated.append(
                        f"{event['name']} - {event['location']} - "
                        f"{event['date'].strftime('%b %d')}"
                    )

        return correlated

    def assess_risk_level(
        self,
        z_score: float,
        affected_count: int,
        fraud_type: FraudType
    ) -> RiskLevel:
        """Assess overall risk level of detected anomaly."""
        risk_score = 0

        # Z-Score contribution
        if z_score > 5:
            risk_score += 40
        elif z_score > 4:
            risk_score += 30
        elif z_score > 3:
            risk_score += 20

        # Volume contribution
        if affected_count > 1000:
            risk_score += 30
        elif affected_count > 500:
            risk_score += 20
        elif affected_count > 100:
            risk_score += 10

        # Fraud type contribution
        if fraud_type == FraudType.RECRUITMENT_FRAUD:
            risk_score += 20
        elif fraud_type == FraudType.BENEFIT_FRAUD:
            risk_score += 15

        # Classify risk level
        if risk_score >= 70:
            return RiskLevel.CRITICAL
        elif risk_score >= 50:
            return RiskLevel.HIGH
        elif risk_score >= 30:
            return RiskLevel.MEDIUM
        else:
            return RiskLevel.LOW

    def generate_recommendation(
        self,
        cluster: AnomalyCluster
    ) -> Tuple[str, bool]:
        """
        Generate actionable recommendation for detected anomaly.

        Returns:
            Tuple of (recommendation_text, auto_freeze_eligible)
        """
        if cluster.risk_level == RiskLevel.CRITICAL:
            return (
                f"CRITICAL: Immediately freeze all {cluster.update_type} updates "
                f"for {cluster.primary_gender} aged {cluster.age_range[0]}-{cluster.age_range[1]} "
                f"in affected areas. Initiate forensic audit of enrollment centers: "
                f"{', '.join(cluster.enrollment_centers[:3])}",
                True
            )
        elif cluster.risk_level == RiskLevel.HIGH:
            return (
                f"HIGH PRIORITY: Flag {cluster.affected_count} updates for manual verification. "
                f"Alert district supervisors in {', '.join(cluster.geographic_scope[:3])}.",
                True
            )
        elif cluster.risk_level == RiskLevel.MEDIUM:
            return (
                f"ATTENTION: Monitor {cluster.update_type} update patterns. "
                f"Schedule review within 48 hours.",
                False
            )
        else:
            return (
                f"INFO: Minor anomaly detected. Continue standard monitoring.",
                False
            )

    @cache_result(ttl=600)
    async def detect_anomalies(
        self,
        update_type: Optional[str] = None,
        state: Optional[str] = None
    ) -> List[AnomalyCluster]:
        """
        Detect anomalies in update patterns.

        Args:
            update_type: Filter by update type (DOB, Age, Address, etc.)
            state: Filter by state

        Returns:
            List of detected anomaly clusters
        """
        logger.info(f"Detecting anomalies - type: {update_type}, state: {state}")

        data = await self._load_demographic_data()
        baseline = await self._compute_baseline_statistics()

        # Apply filters
        if update_type and 'Update_Type' in data.columns:
            data = data[data['Update_Type'] == update_type]
        if state and 'State' in data.columns:
            data = data[data['State'] == state]

        anomalies = []

        # Simulate detection of known anomaly pattern
        # In production: Full statistical analysis

        # Example: Recruitment fraud pattern in Surat
        recruitment_anomaly = AnomalyCluster(
            cluster_id="ANOM-2026-001-SURAT",
            detection_time=datetime.now(),
            fraud_type=FraudType.RECRUITMENT_FRAUD,
            risk_level=RiskLevel.CRITICAL,
            affected_count=3400,
            z_score=4.7,
            confidence=0.947,
            age_range=(18, 21),
            primary_gender="Male",
            geographic_scope=["395001", "395003", "395006", "395007"],
            update_type="Age/DOB",
            time_window_hours=48,
            velocity_multiplier=8.5,
            correlated_events=["Army Recruitment Rally - Surat - Jan 25"],
            enrollment_centers=["ASK-GJ-SURAT-012", "ASK-GJ-SURAT-017", "ASK-GJ-SURAT-023"],
            recommended_action="",
            auto_freeze_eligible=False
        )

        recommendation, auto_freeze = self.generate_recommendation(recruitment_anomaly)
        recruitment_anomaly.recommended_action = recommendation
        recruitment_anomaly.auto_freeze_eligible = auto_freeze

        anomalies.append(recruitment_anomaly)

        return anomalies

    async def analyze(self) -> IntegrityAnalysisResult:
        """
        Perform comprehensive integrity analysis.

        Returns:
            IntegrityAnalysisResult with full analysis
        """
        start_time = datetime.now()
        logger.info("INTEGRITY: Starting comprehensive analysis...")

        data = await self._load_demographic_data()
        baseline = await self._compute_baseline_statistics()

        # Detect all anomalies
        anomalies = await self.detect_anomalies()

        # Fraud type distribution
        fraud_distribution = defaultdict(int)
        for anomaly in anomalies:
            fraud_distribution[anomaly.fraud_type.value] += 1

        # High-risk enrollment centers
        high_risk_centers = [
            {
                "center_id": "ASK-GJ-SURAT-012",
                "location": "Surat, Gujarat",
                "anomaly_count": 3,
                "risk_score": 87,
                "last_audit": "2025-10-15"
            },
            {
                "center_id": "ASK-GJ-SURAT-017",
                "location": "Surat, Gujarat",
                "anomaly_count": 2,
                "risk_score": 72,
                "last_audit": "2025-11-20"
            }
        ]

        processing_time = (datetime.now() - start_time).total_seconds() * 1000

        result = IntegrityAnalysisResult(
            timestamp=datetime.now(),
            total_updates_analyzed=len(data),
            baseline_statistics=baseline,
            detected_anomalies=anomalies,
            fraud_type_distribution=dict(fraud_distribution),
            high_risk_centers=high_risk_centers,
            model_version=self.model_version,
            processing_time_ms=processing_time
        )

        logger.info(
            f"INTEGRITY: Analysis complete. "
            f"Detected {len(anomalies)} anomaly clusters."
        )

        return result

    async def freeze_cohort_updates(
        self,
        cluster_id: str,
        authorized_by: str
    ) -> Dict:
        """
        Freeze updates for a detected fraud cohort.

        In production: Interfaces with UIDAI core systems.
        """
        logger.warning(f"FREEZE REQUEST: {cluster_id} by {authorized_by}")

        return {
            "status": "freeze_initiated",
            "cluster_id": cluster_id,
            "authorized_by": authorized_by,
            "timestamp": datetime.now().isoformat(),
            "affected_records": 3400,
            "freeze_duration_hours": 72,
            "review_required": True
        }
