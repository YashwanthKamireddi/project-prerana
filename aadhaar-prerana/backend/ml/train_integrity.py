"""
INTEGRITY Model Training Pipeline
=================================
Train fraud detection and anomaly classification models.

Models:
1. Pattern Classifier: Deep Neural Network for fraud pattern classification
2. Cohort Detector: Isolation Forest for anomaly detection
3. Event Correlator: Embeddings for linking updates to external events
"""

import os
import sys
import argparse
import logging
from datetime import datetime

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, precision_recall_fscore_support
import joblib

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.settings import settings

logger = logging.getLogger(__name__)


# ============================================================================
# Feature Engineering for Fraud Detection
# ============================================================================

def engineer_fraud_features(demographic_df: pd.DataFrame) -> pd.DataFrame:
    """
    Create features for fraud detection.

    Features:
    - Update velocity metrics
    - Demographic concentration
    - Geographic clustering
    - Temporal patterns
    """
    logger.info("Engineering fraud detection features...")

    # Create synthetic fraud labels for training
    np.random.seed(42)

    features = []

    # Group by time window (simulated)
    for i in range(1000):  # Simulate 1000 data points
        # Random features
        update_count = np.random.exponential(50)
        age_variance = np.random.uniform(0.5, 5.0)
        gender_concentration = np.random.uniform(0.5, 1.0)
        geographic_spread = np.random.uniform(1, 20)
        time_concentration = np.random.exponential(24)

        # Simulate fraud pattern (5% fraud rate)
        is_fraud = 1 if (
            update_count > 200 and
            age_variance < 2 and
            gender_concentration > 0.85
        ) else (1 if np.random.random() < 0.02 else 0)

        features.append({
            'update_count': update_count,
            'age_variance': age_variance,
            'gender_concentration': gender_concentration,
            'geographic_spread': geographic_spread,
            'time_concentration': time_concentration,
            'is_fraud': is_fraud
        })

    return pd.DataFrame(features)


# ============================================================================
# Model Training
# ============================================================================

def train_pattern_classifier(features_df: pd.DataFrame, model_version: str):
    """
    Train Deep Neural Network for fraud pattern classification.
    """
    logger.info("Training Pattern Classifier (DNN)...")

    try:
        import tensorflow as tf
        from tensorflow import keras
        from keras.models import Sequential
        from keras.layers import Dense, Dropout, BatchNormalization
    except ImportError:
        logger.warning("TensorFlow not installed. Using sklearn fallback.")
        return train_pattern_classifier_sklearn(features_df, model_version)

    # Prepare data
    feature_cols = ['update_count', 'age_variance', 'gender_concentration',
                    'geographic_spread', 'time_concentration']
    X = features_df[feature_cols].values
    y = features_df['is_fraud'].values

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42
    )

    # Build DNN
    model = Sequential([
        Dense(128, activation='relu', input_shape=(len(feature_cols),)),
        BatchNormalization(),
        Dropout(0.3),
        Dense(64, activation='relu'),
        BatchNormalization(),
        Dropout(0.3),
        Dense(32, activation='relu'),
        Dense(1, activation='sigmoid')
    ])

    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='binary_crossentropy',
        metrics=['accuracy', keras.metrics.AUC(name='auc')]
    )

    # Class weights for imbalanced data
    class_weights = {0: 1.0, 1: 10.0}

    # Train
    history = model.fit(
        X_train, y_train,
        validation_split=0.2,
        epochs=100,
        batch_size=32,
        class_weight=class_weights,
        verbose=1
    )

    # Evaluate
    test_results = model.evaluate(X_test, y_test)
    logger.info(f"Test Accuracy: {test_results[1]:.3f}, AUC: {test_results[2]:.3f}")

    # Save
    model_dir = os.path.join(settings.MODEL_PATH, 'integrity')
    os.makedirs(model_dir, exist_ok=True)

    model.save(os.path.join(model_dir, f'pattern_dnn_{model_version}.h5'))
    joblib.dump(scaler, os.path.join(model_dir, f'scaler_{model_version}.pkl'))

    logger.info(f"DNN model saved")
    return model


def train_pattern_classifier_sklearn(features_df: pd.DataFrame, model_version: str):
    """Fallback sklearn classifier if TensorFlow unavailable."""
    from sklearn.ensemble import GradientBoostingClassifier

    feature_cols = ['update_count', 'age_variance', 'gender_concentration',
                    'geographic_spread', 'time_concentration']
    X = features_df[feature_cols].values
    y = features_df['is_fraud'].values

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    model = GradientBoostingClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    accuracy = model.score(X_test, y_test)
    logger.info(f"GradientBoosting Accuracy: {accuracy:.3f}")

    model_dir = os.path.join(settings.MODEL_PATH, 'integrity')
    os.makedirs(model_dir, exist_ok=True)
    joblib.dump(model, os.path.join(model_dir, f'pattern_gb_{model_version}.pkl'))

    return model


def train_cohort_detector(features_df: pd.DataFrame, model_version: str):
    """
    Train Isolation Forest for cohort anomaly detection.
    """
    logger.info("Training Cohort Detector (Isolation Forest)...")

    feature_cols = ['update_count', 'age_variance', 'gender_concentration',
                    'geographic_spread', 'time_concentration']
    X = features_df[feature_cols].values

    # Train Isolation Forest
    model = IsolationForest(
        n_estimators=100,
        contamination=0.05,  # Expected fraud rate
        random_state=42,
        n_jobs=-1
    )
    model.fit(X)

    # Evaluate
    predictions = model.predict(X)
    n_anomalies = (predictions == -1).sum()
    logger.info(f"Detected {n_anomalies} anomalies ({n_anomalies/len(X)*100:.1f}%)")

    # Save
    model_dir = os.path.join(settings.MODEL_PATH, 'integrity')
    os.makedirs(model_dir, exist_ok=True)

    model_path = os.path.join(model_dir, f'cohort_iforest_{model_version}.pkl')
    joblib.dump(model, model_path)

    logger.info(f"Isolation Forest saved to {model_path}")
    return model


# ============================================================================
# Main
# ============================================================================

def main():
    parser = argparse.ArgumentParser(description='Train INTEGRITY models')
    parser.add_argument('--version', type=str, default='v2.0.0', help='Model version')
    args = parser.parse_args()

    logger.info("=" * 60)
    logger.info("INTEGRITY Model Training Pipeline")
    logger.info(f"Version: {args.version}")
    logger.info("=" * 60)

    # Generate features (in production: load from actual data)
    features_df = engineer_fraud_features(pd.DataFrame())

    # Train models
    train_pattern_classifier(features_df, args.version)
    train_cohort_detector(features_df, args.version)

    logger.info("Training complete!")


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    main()
