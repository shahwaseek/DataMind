import io
import pytest
from pathlib import Path
from app.mcp_server import mcp_get_schema, mcp_profile_dataset, mcp_execute_sql, mcp_create_chart
from app.core.config import settings


def test_mcp_tools(tmp_path: Path):
    test_csv = tmp_path / "mcp_test.csv"
    test_csv.write_bytes(b"category,sales\nTech,5000\nHome,3000\n")

    # Test mcp_get_schema
    schema_res = mcp_get_schema(str(test_csv))
    assert schema_res["status"] == "success"
    assert len(schema_res["columns"]) == 2

    # Test mcp_profile_dataset
    profile_res = mcp_profile_dataset(str(test_csv))
    assert profile_res["total_rows"] == 2

    # Test mcp_execute_sql
    sql_res = mcp_execute_sql(str(test_csv), "SELECT category, SUM(sales) FROM dataset GROUP BY category")
    assert sql_res["validation_status"] == "PASSED"
    assert len(sql_res["rows"]) == 2

    # Test mcp_create_chart
    chart_res = mcp_create_chart(str(test_csv), "SELECT category, sales FROM dataset")
    assert chart_res["status"] == "success"
    assert "chart_spec" in chart_res
