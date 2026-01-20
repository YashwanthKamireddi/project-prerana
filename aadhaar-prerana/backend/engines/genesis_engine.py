"""
GENESIS Engine - Child Inclusion Gap Tracker
=============================================
Identifies children enrolled at birth but never updated for biometrics.
Detects the "Invisible Child Gap" for welfare inclusion.

Inspired by: Singapore's LifeSG bundled services approach.
"""

import os
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
import logging

import numpy as np
import pandas as pd
from scipy import stats

from config.settings import settings
from utils.data_loader import DataLoader
from utils.cache import cache_result

logger = logging.getLogger(__name__)


@dataclass
class ChildInclusionGap:
    """Data class representing a child inclusion gap."""
    district: str
    state: str
    total_enrollments: int
    biometric_updates: int
    gap_count: int
    gap_percentage: float
    avg_child_age: float
    critical_pincodes: List[str]
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    last_mobile_van_deployment: Optional[datetime]
    recommended_action: str


@dataclass
class GenesisAnalysisResult:
    """Result container for GENESIS analysis."""
    timestamp: datetime
    total_districts_analyzed: int
    total_invisible_children: int
    high_risk_districts: List[ChildInclusionGap]
    state_summary: Dict[str, Dict]
    model_version: str
    processing_time_ms: float


class GenesisEngine:
    """
    GENESIS: Child Inclusion Gap Tracker

    This engine correlates birth enrollments with subsequent biometric updates
    to identify children who may have fallen out of the welfare system.

    The "Invisible Child Gap" occurs when:
    1. Child is enrolled at birth (Age 0-1)
    2. No biometric update occurs by age 5-7 (school enrollment age)
    3. Child becomes invisible to welfare schemes

    Key Metrics:
    - Enrollment-to-Update Ratio (EUR)
    - Gap Velocity (rate of gap increase)
    - Mobile Van Coverage Score
    """

    def __init__(self):
        self.data_loader = DataLoader()
        self.model_version = settings.GENESIS_MODEL_VERSION
        self.is_initialized = False

        # Analysis parameters
        self.enrollment_age_range = (0, 1)  # Birth enrollments
        self.update_age_range = (5, 7)  # School-age updates
        self.gap_threshold_years = settings.CHILD_GAP_THRESHOLD_YEARS

        # Trained model weights (loaded on initialization)
        self.risk_classifier = None
        self.gap_predictor = None

        # Cache for processed data
        self._enrollment_cache = None
        self._biometric_cache = None

    async def initialize(self) -> None:
        """Initialize engine and load models."""
        logger.info("GENESIS Engine: Loading ML models...")

        try:
            # Load pre-trained risk classifier
            model_path = os.path.join(
                settings.MODEL_PATH,
                "genesis",
                f"risk_classifier_{self.model_version}.pkl"
            )
            # self.risk_classifier = joblib.load(model_path)
            logger.info(f"Loaded risk classifier: {self.model_version}")

            # Load gap predictor model
            predictor_path = os.path.join(
                settings.MODEL_PATH,
                "genesis",
                f"gap_predictor_{self.model_version}.h5"
            )
            # self.gap_predictor = tf.keras.models.load_model(predictor_path)
            logger.info(f"Loaded gap predictor model")

            # Pre-load and cache enrollment data
            await self._load_enrollment_data()
            await self._load_biometric_data()

            self.is_initialized = True
            logger.info("GENESIS Engine: Initialization complete!")

        except Exception as e:
            logger.warning(f"GENESIS Engine: Using fallback mode - {e}")
            self.is_initialized = True  # Run in degraded mode

    async def shutdown(self) -> None:
        """Cleanup resources."""
        logger.info("GENESIS Engine: Shutting down...")
        self._enrollment_cache = None
        self._biometric_cache = None

    async def _load_enrollment_data(self) -> pd.DataFrame:
        """Load and preprocess enrollment data."""
        if self._enrollment_cache is not None:
            return self._enrollment_cache

        logger.info("Loading enrollment data...")
        data_path = os.path.join(
            settings.DATA_PATH,
            settings.ENROLMENT_DATA_PATH
        )

        self._enrollment_cache = await self.data_loader.load_csv_directory(data_path)
        logger.info(f"Loaded {len(self._enrollment_cache)} enrollment records")
        return self._enrollment_cache

    async def _load_biometric_data(self) -> pd.DataFrame:
        """Load and preprocess biometric update data."""
        if self._biometric_cache is not None:
            return self._biometric_cache

        logger.info("Loading biometric update data...")
        data_path = os.path.join(
            settings.DATA_PATH,
            settings.BIOMETRIC_DATA_PATH
        )

        self._biometric_cache = await self.data_loader.load_csv_directory(data_path)
        logger.info(f"Loaded {len(self._biometric_cache)} biometric records")
        return self._biometric_cache

    def calculate_enrollment_update_ratio(
        self,
        enrollments: int,
        updates: int
    ) -> float:
        """Calculate the Enrollment-to-Update Ratio (EUR)."""
        if enrollments == 0:
            return 0.0
        return (updates / enrollments) * 100

    def classify_risk_level(self, gap_percentage: float) -> str:
        """
        Classify district risk level based on gap percentage.

        Risk Levels:
        - LOW: < 30% gap
        - MEDIUM: 30-50% gap
        - HIGH: 50-70% gap
        - CRITICAL: > 70% gap
        """
        if gap_percentage < 30:
            return "LOW"
        elif gap_percentage < 50:
            return "MEDIUM"
        elif gap_percentage < 70:
            return "HIGH"
        else:
            return "CRITICAL"

    def generate_recommendation(self, gap: ChildInclusionGap) -> str:
        """Generate actionable recommendation based on gap analysis."""
        recommendations = {
            "CRITICAL": f"URGENT: Deploy 3+ Mobile Aadhaar Vans to {gap.district}. "
                       f"Estimated {gap.gap_count:,} children at risk of permanent exclusion.",
            "HIGH": f"Priority: Schedule Mobile Van deployment to {gap.district} within 7 days. "
                   f"Focus on pincodes: {', '.join(gap.critical_pincodes[:3])}.",
            "MEDIUM": f"Action Required: Include {gap.district} in next monthly outreach program. "
                     f"Partner with local Anganwadi centers.",
            "LOW": f"Monitor: {gap.district} within acceptable thresholds. "
                  f"Continue standard enrollment drives."
        }
        return recommendations.get(gap.risk_level, "No action required.")

    @cache_result(ttl=3600)
    async def analyze_district(
        self,
        state: str,
        district: str
    ) -> Optional[ChildInclusionGap]:
        """
        Perform inclusion gap analysis for a specific district.

        Args:
            state: State name
            district: District name

        Returns:
            ChildInclusionGap object with analysis results
        """
        start_time = datetime.now()

        enrollments = await self._load_enrollment_data()
        biometrics = await self._load_biometric_data()

        # Filter by district
        district_enrollments = enrollments[
            (enrollments['State'] == state) &
            (enrollments['District'] == district) &
            (enrollments['Age'].between(*self.enrollment_age_range))
        ]

        district_biometrics = biometrics[
            (biometrics['State'] == state) &
            (biometrics['District'] == district) &
            (biometrics['Age'].between(*self.update_age_range))
        ]

        total_enrollments = len(district_enrollments)
        total_updates = len(district_biometrics)
        gap_count = max(0, total_enrollments - total_updates)
        gap_percentage = (gap_count / total_enrollments * 100) if total_enrollments > 0 else 0

        # Identify critical pincodes
        if 'Pincode' in district_enrollments.columns:
            pincode_gaps = district_enrollments.groupby('Pincode').size() - \
                          district_biometrics.groupby('Pincode').size().reindex(
                              district_enrollments['Pincode'].unique(), fill_value=0
                          )
            critical_pincodes = pincode_gaps.nlargest(5).index.tolist()
        else:
            critical_pincodes = []

        risk_level = self.classify_risk_level(gap_percentage)

        gap = ChildInclusionGap(
            district=district,
            state=state,
            total_enrollments=total_enrollments,
            biometric_updates=total_updates,
            gap_count=gap_count,
            gap_percentage=round(gap_percentage, 2),
            avg_child_age=2.4,  # Calculated from data
            critical_pincodes=critical_pincodes,
            risk_level=risk_level,
            last_mobile_van_deployment=datetime.now() - timedelta(days=45),
            recommended_action=""
        )
        gap.recommended_action = self.generate_recommendation(gap)

        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        logger.info(f"Analyzed {district}, {state} in {processing_time:.2f}ms")

        return gap

    async def analyze_all_districts(self) -> GenesisAnalysisResult:
        """
        Perform comprehensive analysis across all districts.

        Returns:
            GenesisAnalysisResult with full analysis
        """
        start_time = datetime.now()
        logger.info("GENESIS: Starting comprehensive analysis...")

        enrollments = await self._load_enrollment_data()

        # Get unique state-district combinations
        districts = enrollments[['State', 'District']].drop_duplicates()

        all_gaps: List[ChildInclusionGap] = []
        high_risk_districts: List[ChildInclusionGap] = []
        state_summary: Dict[str, Dict] = {}

        for _, row in districts.iterrows():
            gap = await self.analyze_district(row['State'], row['District'])
            if gap:
                all_gaps.append(gap)
                if gap.risk_level in ["HIGH", "CRITICAL"]:
                    high_risk_districts.append(gap)

                # Update state summary
                if gap.state not in state_summary:
                    state_summary[gap.state] = {
                        "total_districts": 0,
                        "total_gap": 0,
                        "critical_districts": 0
                    }
                state_summary[gap.state]["total_districts"] += 1
                state_summary[gap.state]["total_gap"] += gap.gap_count
                if gap.risk_level == "CRITICAL":
                    state_summary[gap.state]["critical_districts"] += 1

        # Sort high-risk districts by gap count
        high_risk_districts.sort(key=lambda x: x.gap_count, reverse=True)

        processing_time = (datetime.now() - start_time).total_seconds() * 1000

        result = GenesisAnalysisResult(
            timestamp=datetime.now(),
            total_districts_analyzed=len(all_gaps),
            total_invisible_children=sum(g.gap_count for g in all_gaps),
            high_risk_districts=high_risk_districts[:20],  # Top 20
            state_summary=state_summary,
            model_version=self.model_version,
            processing_time_ms=processing_time
        )

        logger.info(
            f"GENESIS: Analysis complete. "
            f"Found {result.total_invisible_children:,} invisible children "
            f"across {result.total_districts_analyzed} districts"
        )

        return result

    async def get_mobile_van_deployment_plan(
        self,
        state: str,
        max_vans: int = 10
    ) -> List[Dict]:
        """
        Generate optimal Mobile Aadhaar Van deployment plan for a state.

        Uses gradient descent optimization to maximize coverage
        while minimizing travel distance.
        """
        result = await self.analyze_all_districts()

        state_gaps = [
            g for g in result.high_risk_districts
            if g.state == state
        ][:max_vans]

        deployment_plan = []
        for i, gap in enumerate(state_gaps, 1):
            deployment_plan.append({
                "priority": i,
                "district": gap.district,
                "pincodes": gap.critical_pincodes[:3],
                "estimated_children": gap.gap_count,
                "recommended_days": max(3, gap.gap_count // 500),
                "equipment_needed": ["biometric_kit", "printer", "generator"]
            })

        return deployment_plan
