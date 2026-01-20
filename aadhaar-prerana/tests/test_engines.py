"""
Test Suite for GENESIS Engine
=============================
"""

import pytest
import asyncio
from datetime import datetime

import pandas as pd
import numpy as np

# Import engine
import sys
sys.path.insert(0, '../backend')
from engines.genesis_engine import GenesisEngine, ChildInclusionGap


class TestGenesisEngine:
    """Test cases for GENESIS Child Inclusion Gap Tracker."""

    @pytest.fixture
    def engine(self):
        """Create engine instance."""
        return GenesisEngine()

    @pytest.fixture
    def sample_enrollment_data(self):
        """Generate sample enrollment data."""
        np.random.seed(42)
        n = 1000

        return pd.DataFrame({
            'State': np.random.choice(['Bihar', 'UP', 'Gujarat'], n),
            'District': np.random.choice(['Sitamarhi', 'Patna', 'Surat'], n),
            'Age': np.random.randint(0, 2, n),  # Birth enrollments
            'Gender': np.random.choice(['Male', 'Female'], n),
            'Pincode': np.random.randint(800001, 800099, n).astype(str)
        })

    @pytest.fixture
    def sample_biometric_data(self):
        """Generate sample biometric data."""
        np.random.seed(42)
        n = 400  # Simulated gap

        return pd.DataFrame({
            'State': np.random.choice(['Bihar', 'UP', 'Gujarat'], n),
            'District': np.random.choice(['Sitamarhi', 'Patna', 'Surat'], n),
            'Age': np.random.randint(5, 8, n),  # School age updates
            'Gender': np.random.choice(['Male', 'Female'], n)
        })

    def test_classify_risk_level_low(self, engine):
        """Test risk classification for low gap."""
        assert engine.classify_risk_level(25.0) == "LOW"

    def test_classify_risk_level_medium(self, engine):
        """Test risk classification for medium gap."""
        assert engine.classify_risk_level(40.0) == "MEDIUM"

    def test_classify_risk_level_high(self, engine):
        """Test risk classification for high gap."""
        assert engine.classify_risk_level(60.0) == "HIGH"

    def test_classify_risk_level_critical(self, engine):
        """Test risk classification for critical gap."""
        assert engine.classify_risk_level(75.0) == "CRITICAL"

    def test_calculate_enrollment_update_ratio(self, engine):
        """Test EUR calculation."""
        ratio = engine.calculate_enrollment_update_ratio(1000, 600)
        assert ratio == 60.0

    def test_calculate_enrollment_update_ratio_zero(self, engine):
        """Test EUR with zero enrollments."""
        ratio = engine.calculate_enrollment_update_ratio(0, 100)
        assert ratio == 0.0

    def test_generate_recommendation_critical(self, engine):
        """Test recommendation generation for critical district."""
        gap = ChildInclusionGap(
            district="Sitamarhi",
            state="Bihar",
            total_enrollments=15000,
            biometric_updates=4000,
            gap_count=11000,
            gap_percentage=73.3,
            avg_child_age=2.4,
            critical_pincodes=["843302", "843314"],
            risk_level="CRITICAL",
            last_mobile_van_deployment=None,
            recommended_action=""
        )

        recommendation = engine.generate_recommendation(gap)

        assert "URGENT" in recommendation
        assert "3+" in recommendation
        assert "Sitamarhi" in recommendation


class TestIntegrityEngine:
    """Test cases for INTEGRITY Fraud Detection."""

    def test_zscore_calculation(self):
        """Test Z-Score calculation."""
        from utils.statistics import calculate_zscore

        values = np.array([10, 10, 10, 10, 100, 10, 10])
        z_scores = calculate_zscore(values)

        # The anomaly (100) should have high Z-Score
        assert z_scores[4] > 2.0

    def test_anomaly_detection_threshold(self):
        """Test anomaly detection with threshold."""
        from utils.statistics import detect_anomalies_zscore

        values = np.array([10, 10, 10, 10, 100, 10, 10])
        anomalies, z_scores = detect_anomalies_zscore(values, threshold=2.0)

        assert anomalies[4] == True
        assert anomalies.sum() == 1


class TestMobilityEngine:
    """Test cases for MOBILITY Migration Radar."""

    def test_velocity_calculation(self):
        """Test velocity calculation."""
        from utils.statistics import calculate_velocity

        counts = np.array([1000, 2000, 500])
        population = np.array([100000, 100000, 100000])

        velocity = calculate_velocity(counts, population)

        assert velocity[0] == 10.0  # 1000/100000 * 1000
        assert velocity[1] == 20.0


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
