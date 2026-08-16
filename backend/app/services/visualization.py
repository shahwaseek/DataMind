from typing import Dict, Any, List, Optional


def recommend_chart_spec(columns: List[str], rows: List[Dict[str, Any]], intent: Optional[str] = None) -> Dict[str, Any]:
    """
    Deterministically recommends and formats chart configuration specifications
    based on query result schema and row values.
    """
    if not columns or not rows:
        return {
            "chart_type": "table",
            "title": "Tabular Data View",
            "x_axis": None,
            "y_axis": [],
            "series": []
        }

    total_rows = len(rows)
    first_row = rows[0]

    # Identify numeric vs categorical columns in result
    numeric_cols = []
    categorical_cols = []
    datetime_cols = []

    for col in columns:
        val = first_row.get(col)
        if isinstance(val, (int, float)) and not isinstance(val, bool):
            numeric_cols.append(col)
        elif isinstance(val, str) and any(d in val for d in ["-", "/"]) and len(val) >= 8:
            datetime_cols.append(col)
        else:
            categorical_cols.append(col)

    # Decision Matrix
    chart_type = "bar"
    x_axis = categorical_cols[0] if categorical_cols else (datetime_cols[0] if datetime_cols else columns[0])
    y_axis = numeric_cols if numeric_cols else [c for c in columns if c != x_axis]

    # Line chart for time-series
    if datetime_cols or intent == "trend":
        chart_type = "line"
        x_axis = datetime_cols[0] if datetime_cols else x_axis

    # Donut/Pie chart for small categorical breakdowns
    elif total_rows <= 6 and len(numeric_cols) == 1 and categorical_cols:
        chart_type = "pie"

    # Default Bar chart for top_n or aggregations
    elif intent == "top_n" or (categorical_cols and numeric_cols):
        chart_type = "bar"

    # Format chart data series
    chart_data = []
    for r in rows:
        item = {"label": str(r.get(x_axis, ""))}
        for y_col in y_axis:
            val = r.get(y_col)
            item[y_col] = float(val) if isinstance(val, (int, float)) else 0.0
        chart_data.append(item)

    return {
        "chart_type": chart_type,
        "title": f"Visualization: {y_axis[0] if y_axis else 'Values'} by {x_axis}",
        "x_axis": x_axis,
        "y_axis": y_axis,
        "data": chart_data
    }
