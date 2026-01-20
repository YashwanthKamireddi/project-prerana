"""
Caching Utilities
=================
Decorators and utilities for caching analysis results.
"""

import hashlib
import json
import functools
from datetime import datetime, timedelta
from typing import Any, Callable, Optional
import logging

logger = logging.getLogger(__name__)


# In-memory cache storage
_cache_store = {}


def cache_result(ttl: int = 3600):
    """
    Decorator to cache function results.

    Args:
        ttl: Time-to-live in seconds (default: 1 hour)
    """
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key from function name and arguments
            key_parts = [func.__name__]
            key_parts.extend(str(arg) for arg in args[1:])  # Skip 'self'
            key_parts.extend(f"{k}={v}" for k, v in sorted(kwargs.items()))
            cache_key = hashlib.md5("|".join(key_parts).encode()).hexdigest()

            # Check cache
            if cache_key in _cache_store:
                entry = _cache_store[cache_key]
                if datetime.now() < entry['expires']:
                    logger.debug(f"Cache hit for {func.__name__}")
                    return entry['value']

            # Execute function
            result = await func(*args, **kwargs)

            # Store in cache
            _cache_store[cache_key] = {
                'value': result,
                'expires': datetime.now() + timedelta(seconds=ttl),
                'created': datetime.now()
            }

            logger.debug(f"Cached result for {func.__name__} (TTL: {ttl}s)")
            return result

        return wrapper
    return decorator


def invalidate_cache(pattern: Optional[str] = None):
    """
    Invalidate cache entries.

    Args:
        pattern: If provided, only invalidate keys containing this pattern.
                If None, invalidate all entries.
    """
    global _cache_store

    if pattern is None:
        count = len(_cache_store)
        _cache_store.clear()
        logger.info(f"Invalidated all {count} cache entries")
    else:
        keys_to_remove = [k for k in _cache_store if pattern in k]
        for key in keys_to_remove:
            del _cache_store[key]
        logger.info(f"Invalidated {len(keys_to_remove)} cache entries matching '{pattern}'")


def get_cache_stats() -> dict:
    """Get cache statistics."""
    now = datetime.now()

    valid_entries = sum(1 for e in _cache_store.values() if now < e['expires'])
    expired_entries = len(_cache_store) - valid_entries

    return {
        "total_entries": len(_cache_store),
        "valid_entries": valid_entries,
        "expired_entries": expired_entries
    }
