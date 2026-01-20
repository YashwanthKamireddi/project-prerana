"""
GENESIS Model Training Pipeline
===============================
Train and evaluate the Child Inclusion Gap prediction models.

Models:
1. Risk Classifier: Random Forest for district risk level classification
2. Gap Predictor: LSTM for time-series gap prediction
"""

import os
import sys
import argparse
from datetime import datetime
import logging

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix
import joblib

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.settings import settings

logger = logging.getLogger(__name__)

# ============================================================================
# Feature Engineering
# ============================================================================

def engineer_features(enrolment_df: pd.DataFrame, biometric_df: pd.DataFrame) -> pd.DataFrame:
    """
    Create features for risk classification model.

    Features:
    - Enrollment-to-Update Ratio (EUR)
    - Gap Velocity (rate of change)
    - Geographic density metrics
    - Demographic composition
    - Seasonal patterns
    """
    logger.info("Engineering features...")

    features = []

    # Group by district
    districts = enrolment_df.groupby(['State', 'District'])

    for (state, district), enrol_group in districts:
        bio_group = biometric_df[
            (biometric_df['State'] == state) &
            (biometric_df['District'] == district)
        ]

        # Core metrics
        total_enrollments = len(enrol_group)
        total_updates = len(bio_group)
        gap = max(0, total_enrollments - total_updates)
        gap_pct = (gap / total_enrollments * 100) if total_enrollments > 0 else 0

        # Demographics
        avg_age = enrol_group['Age'].mean() if 'Age' in enrol_group.columns else 0
        male_ratio = (enrol_group['Gender'] == 'Male').mean() if 'Gender' in enrol_group.columns else 0.5

        # Risk label (for training)
        if gap_pct < 30:
            risk_label = 'LOW'
        elif gap_pct < 50:
            risk_label = 'MEDIUM'
        elif gap_pct < 70:
            risk_label = 'HIGH'
        else:
            risk_label = 'CRITICAL'

        features.append({
            'state': state,
            'district': district,
            'total_enrollments': total_enrollments,
            'total_updates': total_updates,
            'gap_count': gap,
            'gap_percentage': gap_pct,
            'avg_age': avg_age,
            'male_ratio': male_ratio,
            'risk_label': risk_label
        })

    return pd.DataFrame(features)


# ============================================================================
# Model Training
# ============================================================================

def train_risk_classifier(features_df: pd.DataFrame, model_version: str):
    """
    Train the district risk classifier.

    Uses Random Forest with class balancing for imbalanced data.
    """
    logger.info("Training Risk Classifier...")

    # Prepare features and labels
    feature_cols = ['total_enrollments', 'total_updates', 'gap_count',
                    'gap_percentage', 'avg_age', 'male_ratio']
    X = features_df[feature_cols].fillna(0)

    # Encode labels
    label_encoder = LabelEncoder()
    y = label_encoder.fit_transform(features_df['risk_label'])

    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42, stratify=y
    )

    # Train Random Forest
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        class_weight='balanced',
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    report = classification_report(y_test, y_pred, target_names=label_encoder.classes_)
    logger.info(f"Classification Report:\n{report}")

    # Cross-validation
    cv_scores = cross_val_score(model, X_scaled, y, cv=5)
    logger.info(f"Cross-validation scores: {cv_scores.mean():.3f} (+/- {cv_scores.std() * 2:.3f})")

    # Save model and artifacts
    model_dir = os.path.join(settings.MODEL_PATH, 'genesis')
    os.makedirs(model_dir, exist_ok=True)

    model_path = os.path.join(model_dir, f'risk_classifier_{model_version}.pkl')
    scaler_path = os.path.join(model_dir, f'scaler_{model_version}.pkl')
    encoder_path = os.path.join(model_dir, f'label_encoder_{model_version}.pkl')

    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    joblib.dump(label_encoder, encoder_path)

    logger.info(f"Model saved to {model_path}")

    return model, scaler, label_encoder


def train_gap_predictor(features_df: pd.DataFrame, model_version: str):
    """
    Train LSTM model for gap prediction.

    Uses historical gap data to predict future inclusion gaps.
    """
    logger.info("Training Gap Predictor (LSTM)...")

    try:
        import tensorflow as tf
        from tensorflow import keras
        from keras.models import Sequential
        from keras.layers import LSTM, Dense, Dropout
    except ImportError:
        logger.warning("TensorFlow not installed. Skipping LSTM training.")
        return None

    # Prepare time-series data
    # In production: Use actual time-series data
    sequence_length = 30
    n_features = 4

    # Generate synthetic sequences for demo
    np.random.seed(42)
    n_samples = len(features_df)

    X = np.random.randn(n_samples, sequence_length, n_features)
    y = features_df['gap_percentage'].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Build LSTM model
    model = Sequential([
        LSTM(64, input_shape=(sequence_length, n_features), return_sequences=True),
        Dropout(0.2),
        LSTM(32),
        Dropout(0.2),
        Dense(16, activation='relu'),
        Dense(1)
    ])

    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='mse',
        metrics=['mae']
    )

    # Train
    history = model.fit(
        X_train, y_train,
        validation_split=0.2,
        epochs=50,
        batch_size=32,
        verbose=1
    )

    # Evaluate
    test_loss, test_mae = model.evaluate(X_test, y_test)
    logger.info(f"Test MAE: {test_mae:.3f}")

    # Save model
    model_dir = os.path.join(settings.MODEL_PATH, 'genesis')
    model_path = os.path.join(model_dir, f'gap_predictor_{model_version}.h5')
    model.save(model_path)

    logger.info(f"LSTM model saved to {model_path}")

    return model


# ============================================================================
# Main Training Pipeline
# ============================================================================

def main():
    parser = argparse.ArgumentParser(description='Train GENESIS models')
    parser.add_argument('--version', type=str, default='v1.0.0', help='Model version')
    parser.add_argument('--data-path', type=str, default=settings.DATA_PATH, help='Data path')
    args = parser.parse_args()

    logger.info("=" * 60)
    logger.info("GENESIS Model Training Pipeline")
    logger.info(f"Version: {args.version}")
    logger.info("=" * 60)

    # Load data
    logger.info("Loading datasets...")
    enrolment_path = os.path.join(args.data_path, settings.ENROLMENT_DATA_PATH)
    biometric_path = os.path.join(args.data_path, settings.BIOMETRIC_DATA_PATH)

    # Load all CSVs
    enrolment_files = [f for f in os.listdir(enrolment_path) if f.endswith('.csv')]
    biometric_files = [f for f in os.listdir(biometric_path) if f.endswith('.csv')]

    enrolment_df = pd.concat([
        pd.read_csv(os.path.join(enrolment_path, f)) for f in enrolment_files
    ], ignore_index=True)

    biometric_df = pd.concat([
        pd.read_csv(os.path.join(biometric_path, f)) for f in biometric_files
    ], ignore_index=True)

    logger.info(f"Loaded {len(enrolment_df)} enrollments, {len(biometric_df)} biometric records")

    # Feature engineering
    features_df = engineer_features(enrolment_df, biometric_df)
    logger.info(f"Engineered {len(features_df)} district features")

    # Train models
    train_risk_classifier(features_df, args.version)
    train_gap_predictor(features_df, args.version)

    logger.info("=" * 60)
    logger.info("Training complete!")
    logger.info("=" * 60)


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    main()
