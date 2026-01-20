"""Utility modules for AADHAAR-PRERANA."""
from .data_loader import DataLoader
from .cache import cache_result, invalidate_cache, get_cache_stats
from .logger import get_logger, setup_logging
from .statistics import (
    calculate_zscore,
    detect_anomalies_zscore,
    calculate_velocity,
    moving_average,
    detect_trend,
    cohort_analysis
)

__all__ = [
    "DataLoader",
    "cache_result",
    "invalidate_cache",
    "get_cache_stats",
    "get_logger",
    "setup_logging",
    "calculate_zscore",
    "detect_anomalies_zscore",
    "calculate_velocity",
    "moving_average",
    "detect_trend",
    "cohort_analysis"
]
