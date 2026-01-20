"""
Statistical Utilities
====================
Helper functions for statistical analysis and anomaly detection.
"""

import numpy as np
from scipy import stats
from typing import List, Tuple, Optional


def calculate_zscore(values: np.ndarray) -> np.ndarray:
    """
    Calculate Z-scores for an array of values.

    Args:
        values: Numpy array of values

    Returns:
        Array of Z-scores
    """
    return stats.zscore(values, nan_policy='omit')


def detect_anomalies_zscore(
    values: np.ndarray,
    threshold: float = 3.0
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Detect anomalies using Z-score method.

    Args:
        values: Array of values
        threshold: Z-score threshold (default: 3.0)

    Returns:
        Tuple of (anomaly_mask, z_scores)
    """
    z_scores = calculate_zscore(values)
    anomaly_mask = np.abs(z_scores) > threshold
    return anomaly_mask, z_scores


def calculate_velocity(
    counts: np.ndarray,
    population: np.ndarray,
    time_period: float = 1.0
) -> np.ndarray:
    """
    Calculate update velocity (per 1000 population per time period).

    Args:
        counts: Array of update counts
        population: Array of population values
        time_period: Time period in days (default: 1)

    Returns:
        Array of velocity values
    """
    with np.errstate(divide='ignore', invalid='ignore'):
        velocity = (counts / population) * 1000 / time_period
        velocity = np.where(np.isfinite(velocity), velocity, 0)
    return velocity


def moving_average(values: np.ndarray, window: int = 7) -> np.ndarray:
    """
    Calculate moving average.

    Args:
        values: Array of values
        window: Window size (default: 7 days)

    Returns:
        Array of moving averages
    """
    return np.convolve(values, np.ones(window) / window, mode='valid')


def detect_trend(values: np.ndarray) -> Tuple[float, str]:
    """
    Detect trend in time series data.

    Args:
        values: Array of values

    Returns:
        Tuple of (slope, trend_direction)
    """
    if len(values) < 2:
        return 0.0, "STABLE"

    x = np.arange(len(values))
    slope, _, r_value, _, _ = stats.linregress(x, values)

    # Determine trend direction
    if slope > 0.1 and r_value**2 > 0.5:
        trend = "INCREASING"
    elif slope < -0.1 and r_value**2 > 0.5:
        trend = "DECREASING"
    else:
        trend = "STABLE"

    return slope, trend


def cohort_analysis(
    age: np.ndarray,
    gender: np.ndarray,
    values: np.ndarray
) -> dict:
    """
    Perform cohort analysis on demographic data.

    Args:
        age: Array of ages
        gender: Array of genders
        values: Array of values to analyze

    Returns:
        Dictionary with cohort statistics
    """
    # Age buckets
    age_buckets = np.digitize(age, bins=[0, 18, 25, 35, 50, 100])
    bucket_labels = ['0-17', '18-24', '25-34', '35-49', '50+']

    cohorts = {}
    for gender_val in np.unique(gender):
        for bucket_idx, bucket_label in enumerate(bucket_labels, 1):
            mask = (gender == gender_val) & (age_buckets == bucket_idx)
            if np.sum(mask) > 0:
                cohort_key = f"{gender_val}_{bucket_label}"
                cohorts[cohort_key] = {
                    'count': int(np.sum(mask)),
                    'mean': float(np.mean(values[mask])),
                    'std': float(np.std(values[mask]))
                }

    return cohorts
