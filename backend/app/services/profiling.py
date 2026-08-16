import math
from pathlib import Path
from typing import Dict, Any, List
import pandas as pd
import numpy as np

from app.services.ingestion import process_dataset_file, IngestionError


def clean_json_value(val: Any) -> Any:
    """Ensures value is JSON serializable (handling NaNs, infinities, numpy types)."""
    if val is None or pd.isna(val):
        return None
    if isinstance(val, (np.integer, int)):
        return int(val)
    if isinstance(val, (np.floating, float)):
        if math.isnan(val) or math.isinf(val):
            return None
        return float(val)
    if isinstance(val, (np.bool_, bool)):
        return bool(val)
    if isinstance(val, (pd.Timestamp, np.datetime64)):
        return str(val)
    return str(val)


def profile_dataset_file(file_path: Path) -> Dict[str, Any]:
    """
    Computes deterministic profiling statistics for a dataset file.
    Returns structured profile dictionary.
    """
    ext = file_path.suffix.lower()

    if ext == ".csv":
        df = pd.read_csv(file_path)
    elif ext in [".xlsx", ".xls"]:
        df = pd.read_excel(file_path)
    elif ext == ".parquet":
        df = pd.read_parquet(file_path)
    elif ext == ".json":
        df = pd.read_json(file_path)
    else:
        raise IngestionError(f"Unsupported file format for profiling: {ext}")

    if df.empty:
        raise IngestionError("Cannot profile an empty dataset")

    total_rows = len(df)
    total_cols = len(df.columns)
    duplicate_rows = int(df.duplicated().sum())

    columns_profile = []
    quality_warnings = []
    total_null_cells = 0
    total_cells = total_rows * total_cols

    for col in df.columns:
        col_name = str(col)
        series = df[col]
        
        null_count = int(series.isna().sum())
        total_null_cells += null_count
        null_pct = round((null_count / total_rows) * 100, 2)
        distinct_count = int(series.nunique(dropna=True))

        if null_pct > 10.0:
            quality_warnings.append(f"Column '{col_name}' has {null_pct}% missing values ({null_count} nulls)")

        # Determine column data category
        dtype_str = str(series.dtype)
        is_numeric = pd.api.types.is_numeric_dtype(series) and not pd.api.types.is_bool_dtype(series)
        is_datetime = pd.api.types.is_datetime64_any_dtype(series)
        is_bool = pd.api.types.is_bool_dtype(series)

        col_meta: Dict[str, Any] = {
            "name": col_name,
            "data_type": dtype_str,
            "null_count": null_count,
            "null_percentage": null_pct,
            "distinct_count": distinct_count,
            "is_numeric": is_numeric,
            "is_datetime": is_datetime,
            "is_bool": is_bool,
        }

        if is_numeric and series.dropna().count() > 0:
            clean_series = series.dropna()
            min_val = clean_series.min()
            max_val = clean_series.max()
            mean_val = clean_series.mean()
            median_val = clean_series.median()
            std_val = clean_series.std() if len(clean_series) > 1 else 0.0

            q25 = clean_series.quantile(0.25)
            q75 = clean_series.quantile(0.75)
            iqr = q75 - q25

            # Outliers using 1.5 * IQR rule
            lower_bound = q25 - 1.5 * iqr
            upper_bound = q75 + 1.5 * iqr
            outlier_series = clean_series[(clean_series < lower_bound) | (clean_series > upper_bound)]
            outlier_count = int(len(outlier_series))

            if outlier_count > 0:
                outlier_pct = round((outlier_count / total_rows) * 100, 1)
                if outlier_pct > 5.0:
                    quality_warnings.append(f"Column '{col_name}' has {outlier_count} statistical outliers ({outlier_pct}%)")

            col_meta["stats"] = {
                "min": clean_json_value(min_val),
                "max": clean_json_value(max_val),
                "mean": round(clean_json_value(mean_val), 4) if mean_val is not None else None,
                "median": round(clean_json_value(median_val), 4) if median_val is not None else None,
                "std_dev": round(clean_json_value(std_val), 4) if std_val is not None else None,
                "outlier_count": outlier_count
            }

        # Categorical frequency distribution (top 5)
        top_freq = []
        try:
            top_counts = series.value_counts(dropna=True).head(5)
            for val, cnt in top_counts.items():
                top_freq.append({
                    "value": clean_json_value(val),
                    "count": int(cnt),
                    "percentage": round((cnt / total_rows) * 100, 1)
                })
        except Exception:
            pass

        col_meta["top_frequencies"] = top_freq
        columns_profile.append(col_meta)

    # Check duplicate rows warning
    if duplicate_rows > 0:
        dup_pct = round((duplicate_rows / total_rows) * 100, 1)
        quality_warnings.append(f"Dataset contains {duplicate_rows} duplicate rows ({dup_pct}%)")

    # Data Quality Score calculation (0 - 100)
    overall_null_pct = (total_null_cells / total_cells) * 100 if total_cells > 0 else 0
    duplicate_pct = (duplicate_rows / total_rows) * 100 if total_rows > 0 else 0
    warning_penalty = len(quality_warnings) * 3

    quality_score = max(0, min(100, round(100 - (overall_null_pct * 0.5 + duplicate_pct * 0.8 + warning_penalty))))

    return {
        "total_rows": total_rows,
        "total_columns": total_cols,
        "duplicate_rows": duplicate_rows,
        "overall_null_percentage": round(overall_null_pct, 2),
        "data_quality_score": quality_score,
        "quality_warnings": quality_warnings,
        "columns": columns_profile
    }
