"""
Data Loader Utility
==================
Handles loading and preprocessing of Aadhaar data from CSV files.
"""

import os
import glob
import asyncio
from typing import List, Optional
from concurrent.futures import ThreadPoolExecutor
import logging

import pandas as pd
import numpy as np

logger = logging.getLogger(__name__)


class DataLoader:
    """
    Async data loader for Aadhaar CSV datasets.

    Supports:
    - Concurrent file loading
    - Chunked processing for large files
    - Data normalization
    - Caching
    """

    def __init__(self, chunk_size: int = 100000):
        self.chunk_size = chunk_size
        self._executor = ThreadPoolExecutor(max_workers=4)
        self._cache = {}

    def _load_csv_sync(self, filepath: str) -> pd.DataFrame:
        """Synchronously load a CSV file."""
        try:
            df = pd.read_csv(filepath, low_memory=False)
            logger.debug(f"Loaded {len(df)} rows from {os.path.basename(filepath)}")
            return df
        except Exception as e:
            logger.error(f"Error loading {filepath}: {e}")
            return pd.DataFrame()

    async def load_csv(self, filepath: str) -> pd.DataFrame:
        """
        Asynchronously load a single CSV file.

        Args:
            filepath: Path to CSV file

        Returns:
            DataFrame with loaded data
        """
        if filepath in self._cache:
            logger.debug(f"Cache hit for {filepath}")
            return self._cache[filepath]

        loop = asyncio.get_event_loop()
        df = await loop.run_in_executor(self._executor, self._load_csv_sync, filepath)

        self._cache[filepath] = df
        return df

    async def load_csv_directory(self, directory: str) -> pd.DataFrame:
        """
        Load all CSV files from a directory.

        Args:
            directory: Path to directory containing CSV files

        Returns:
            Concatenated DataFrame
        """
        if directory in self._cache:
            logger.debug(f"Cache hit for directory {directory}")
            return self._cache[directory]

        csv_files = glob.glob(os.path.join(directory, "*.csv"))

        if not csv_files:
            logger.warning(f"No CSV files found in {directory}")
            return pd.DataFrame()

        logger.info(f"Loading {len(csv_files)} CSV files from {directory}")

        # Load all files concurrently
        tasks = [self.load_csv(f) for f in csv_files]
        dfs = await asyncio.gather(*tasks)

        # Concatenate all DataFrames
        combined = pd.concat(dfs, ignore_index=True)

        self._cache[directory] = combined
        logger.info(f"Loaded {len(combined)} total records from {directory}")

        return combined

    def normalize_columns(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Normalize column names and data types.
        """
        # Standardize column names
        df.columns = df.columns.str.strip().str.replace(' ', '_')

        # Convert date columns
        date_cols = [c for c in df.columns if 'date' in c.lower()]
        for col in date_cols:
            try:
                df[col] = pd.to_datetime(df[col], errors='coerce')
            except:
                pass

        return df

    def clear_cache(self):
        """Clear the data cache."""
        self._cache.clear()
        logger.info("Data cache cleared")
