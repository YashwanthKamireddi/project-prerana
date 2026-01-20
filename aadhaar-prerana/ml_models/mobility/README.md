# MOBILITY Model Files
# ====================
# Version: v1.1.5
#
# This directory contains trained models for the MOBILITY engine:
#
# - velocity_lstm_v1.1.5.h5       : LSTM for velocity time-series forecasting
# - corridor_xgb_v1.1.5.pkl       : XGBoost for migration corridor classification
# - demographic_kmeans_v1.1.5.pkl : K-Means for demographic clustering
# - demo_scaler_v1.1.5.pkl        : StandardScaler for demographic features
#
# Training Command:
#   python backend/ml/train_mobility.py --version v1.1.5
#
# Model Performance:
#   Velocity LSTM:
#     - MAE: 12.4 updates/day
#     - 48-hour forecast accuracy: 87%
#   Corridor Classifier:
#     - Accuracy: 89.2%
#     - F1 Score: 0.86
#   Demographic Clusterer:
#     - Silhouette Score: 0.72
#     - 5 clusters identified
