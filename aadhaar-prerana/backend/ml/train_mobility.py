"""
MOBILITY Model Training Pipeline
================================
Train migration prediction and velocity forecasting models.

Models:
1. Velocity Predictor: LSTM for time-series velocity forecasting
2. Corridor Classifier: XGBoost for migration corridor classification
3. Demographic Clusterer: K-Means for migrant demographic segmentation
"""

import os
import sys
import argparse
import logging

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import joblib

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.settings import settings

logger = logging.getLogger(__name__)


def train_velocity_lstm(model_version: str):
    """Train LSTM for velocity forecasting."""
    logger.info("Training Velocity LSTM...")

    try:
        import tensorflow as tf
        from tensorflow import keras
        from keras.models import Sequential
        from keras.layers import LSTM, Dense, Dropout
    except ImportError:
        logger.warning("TensorFlow not installed. Skipping LSTM.")
        return None

    # Synthetic training data
    np.random.seed(42)
    sequence_length = 30
    n_samples = 1000

    X = np.random.randn(n_samples, sequence_length, 1)
    y = np.random.randn(n_samples, 1)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    model = Sequential([
        LSTM(64, input_shape=(sequence_length, 1), return_sequences=True),
        Dropout(0.2),
        LSTM(32),
        Dense(16, activation='relu'),
        Dense(1)
    ])

    model.compile(optimizer='adam', loss='mse', metrics=['mae'])
    model.fit(X_train, y_train, epochs=20, batch_size=32, verbose=1)

    # Save
    model_dir = os.path.join(settings.MODEL_PATH, 'mobility')
    os.makedirs(model_dir, exist_ok=True)
    model.save(os.path.join(model_dir, f'velocity_lstm_{model_version}.h5'))

    logger.info("LSTM saved")
    return model


def train_corridor_classifier(model_version: str):
    """Train XGBoost for corridor classification."""
    logger.info("Training Corridor Classifier...")

    try:
        import xgboost as xgb
    except ImportError:
        logger.warning("XGBoost not installed. Using sklearn.")
        from sklearn.ensemble import GradientBoostingClassifier as xgb

    # Synthetic data
    np.random.seed(42)
    X = np.random.randn(500, 5)
    y = np.random.randint(0, 4, 500)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    model = xgb.XGBClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    accuracy = model.score(X_test, y_test)
    logger.info(f"Accuracy: {accuracy:.3f}")

    # Save
    model_dir = os.path.join(settings.MODEL_PATH, 'mobility')
    os.makedirs(model_dir, exist_ok=True)
    joblib.dump(model, os.path.join(model_dir, f'corridor_xgb_{model_version}.pkl'))

    return model


def train_demographic_clusterer(model_version: str):
    """Train K-Means for demographic clustering."""
    logger.info("Training Demographic Clusterer...")

    np.random.seed(42)
    X = np.random.randn(1000, 4)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = KMeans(n_clusters=5, random_state=42, n_init=10)
    model.fit(X_scaled)

    # Save
    model_dir = os.path.join(settings.MODEL_PATH, 'mobility')
    os.makedirs(model_dir, exist_ok=True)
    joblib.dump(model, os.path.join(model_dir, f'demographic_kmeans_{model_version}.pkl'))
    joblib.dump(scaler, os.path.join(model_dir, f'demo_scaler_{model_version}.pkl'))

    logger.info("K-Means saved")
    return model


def main():
    parser = argparse.ArgumentParser(description='Train MOBILITY models')
    parser.add_argument('--version', type=str, default='v1.1.0', help='Model version')
    args = parser.parse_args()

    logger.info("MOBILITY Model Training Pipeline")

    train_velocity_lstm(args.version)
    train_corridor_classifier(args.version)
    train_demographic_clusterer(args.version)

    logger.info("Training complete!")


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    main()
