# GENESIS Model Files
# ===================
# Version: v1.2.0
#
# This directory contains trained models for the GENESIS engine:
#
# - risk_classifier_v1.2.0.pkl    : Random Forest for district risk classification
# - gap_predictor_v1.2.0.h5       : LSTM for time-series gap prediction
# - scaler_v1.2.0.pkl             : StandardScaler for feature normalization
# - label_encoder_v1.2.0.pkl      : LabelEncoder for risk level labels
#
# Training Command:
#   python backend/ml/train_genesis.py --version v1.2.0
#
# Model Performance:
#   Risk Classifier:
#     - Accuracy: 92.3%
#     - Cross-validation: 0.918 (+/- 0.034)
#   Gap Predictor:
#     - MAE: 4.2%
#     - R² Score: 0.87
