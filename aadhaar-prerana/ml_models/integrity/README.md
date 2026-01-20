# INTEGRITY Model Files
# =====================
# Version: v2.0.1
#
# This directory contains trained models for the INTEGRITY engine:
#
# - pattern_dnn_v2.0.1.h5         : Deep Neural Network for fraud pattern classification
# - cohort_iforest_v2.0.1.pkl     : Isolation Forest for cohort anomaly detection
# - scaler_v2.0.1.pkl             : StandardScaler for feature normalization
#
# Training Command:
#   python backend/ml/train_integrity.py --version v2.0.1
#
# Model Performance:
#   Pattern Classifier (DNN):
#     - Accuracy: 94.7%
#     - AUC-ROC: 0.968
#     - Precision (Fraud): 91.2%
#     - Recall (Fraud): 88.5%
#   Cohort Detector:
#     - False Positive Rate: 3.2%
#     - Detection Rate: 95.8%
#
# Fraud Types Detected:
#   1. RECRUITMENT_FRAUD     : Mass DOB changes for age criteria
#   2. BENEFIT_FRAUD         : Address changes for duplicate benefits
#   3. ELECTION_MANIPULATION : Age changes before elections
#   4. SYNTHETIC_IDENTITY    : Coordinated new identity creation
