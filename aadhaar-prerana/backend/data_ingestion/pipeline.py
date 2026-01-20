"""
Data Ingestion Pipeline
======================
ETL pipeline for loading and preprocessing Aadhaar data.
"""

import os
import glob
import asyncio
from datetime import datetime
from typing import Dict, List, Optional
import logging

import pandas as pd
import numpy as np

logger = logging.getLogger(__name__)


class AadhaarDataPipeline:
    """
    ETL Pipeline for Aadhaar data ingestion.

    Handles:
    - Loading CSV files from multiple directories
    - Data validation and cleaning
    - Schema normalization
    - Incremental updates
    """

    EXPECTED_COLUMNS = {
        'enrolment': ['State', 'District', 'Age', 'Gender', 'Date'],
        'demographic': ['State', 'District', 'Age', 'Gender', 'Update_Type', 'Date'],
        'biometric': ['State', 'District', 'Age', 'Gender', 'Date']
    }

    def __init__(self, base_path: str):
        self.base_path = base_path
        self.data_cache: Dict[str, pd.DataFrame] = {}
        self.last_update: Dict[str, datetime] = {}

    def validate_schema(self, df: pd.DataFrame, data_type: str) -> bool:
        """Validate DataFrame schema against expected columns."""
        expected = set(self.EXPECTED_COLUMNS.get(data_type, []))
        actual = set(df.columns)

        missing = expected - actual
        if missing:
            logger.warning(f"Missing columns in {data_type}: {missing}")
            return False
        return True

    def clean_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean and normalize data."""
        # Remove duplicates
        original_len = len(df)
        df = df.drop_duplicates()

        if len(df) < original_len:
            logger.info(f"Removed {original_len - len(df)} duplicate rows")

        # Normalize text columns
        text_cols = ['State', 'District', 'Gender']
        for col in text_cols:
            if col in df.columns:
                df[col] = df[col].str.strip().str.title()

        # Handle missing values
        df = df.fillna({
            'Age': 0,
            'Gender': 'Unknown'
        })

        return df

    def load_directory(self, directory: str, data_type: str) -> pd.DataFrame:
        """Load all CSV files from a directory."""
        full_path = os.path.join(self.base_path, directory)

        if not os.path.exists(full_path):
            logger.error(f"Directory not found: {full_path}")
            return pd.DataFrame()

        csv_files = glob.glob(os.path.join(full_path, "*.csv"))

        if not csv_files:
            logger.warning(f"No CSV files in {full_path}")
            return pd.DataFrame()

        logger.info(f"Loading {len(csv_files)} files from {directory}")

        dfs = []
        for filepath in csv_files:
            try:
                df = pd.read_csv(filepath, low_memory=False)
                dfs.append(df)
            except Exception as e:
                logger.error(f"Error loading {filepath}: {e}")

        if not dfs:
            return pd.DataFrame()

        combined = pd.concat(dfs, ignore_index=True)
        combined = self.clean_data(combined)

        # Cache
        self.data_cache[data_type] = combined
        self.last_update[data_type] = datetime.now()

        logger.info(f"Loaded {len(combined)} records for {data_type}")
        return combined

    def load_all(self) -> Dict[str, pd.DataFrame]:
        """Load all data types."""
        return {
            'enrolment': self.load_directory('api_data_aadhar_enrolment', 'enrolment'),
            'demographic': self.load_directory('api_data_aadhar_demographic', 'demographic'),
            'biometric': self.load_directory('api_data_aadhar_biometric', 'biometric')
        }

    def get_summary_stats(self) -> Dict:
        """Get summary statistics for loaded data."""
        stats = {}

        for data_type, df in self.data_cache.items():
            if df is not None and not df.empty:
                stats[data_type] = {
                    'record_count': len(df),
                    'columns': list(df.columns),
                    'states': df['State'].nunique() if 'State' in df.columns else 0,
                    'districts': df['District'].nunique() if 'District' in df.columns else 0,
                    'last_update': self.last_update.get(data_type, None)
                }

        return stats


def run_pipeline():
    """Run the data ingestion pipeline."""
    logger.info("Starting Data Ingestion Pipeline...")

    pipeline = AadhaarDataPipeline(base_path='../../')
    data = pipeline.load_all()

    stats = pipeline.get_summary_stats()

    logger.info("Pipeline Summary:")
    for data_type, info in stats.items():
        logger.info(f"  {data_type}: {info['record_count']} records")

    return data


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    run_pipeline()
