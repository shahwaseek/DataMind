import io
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.sqlite import init_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    init_db()


def test_nl_to_sql_benchmark_suite():
    # 1. Setup benchmark dataset
    p_res = client.post("/api/v1/projects", json={"name": "NL-to-SQL Benchmark Suite"})
    project_id = p_res.json()["id"]

    csv_content = (
        b"region,sales,category,year\n"
        b"North,15000,Electronics,2025\n"
        b"South,22000,Furniture,2025\n"
        b"North,18000,Electronics,2025\n"
        b"East,9000,Office,2025\n"
        b"South,31000,Electronics,2025\n"
        b"West,27000,Furniture,2025\n"
    )
    upload_res = client.post(
        f"/api/v1/projects/{project_id}/datasets/upload",
        files={"file": ("benchmark_data.csv", io.BytesIO(csv_content), "text/csv")}
    )
    dataset_id = upload_res.json()["id"]

    # Golden Evaluation Test Cases
    benchmark_cases = [
        {"q": "Which region had the highest total sales?", "expected_intent": "top_n"},
        {"q": "How many total records exist?", "expected_intent": "summary"},
        {"q": "What is the average sales figure?", "expected_intent": "aggregation"},
        {"q": "Show top 5 sales grouped by category", "expected_intent": "top_n"},
    ]

    passed_benchmarks = 0
    for case in benchmark_cases:
        res = client.post(
            f"/api/v1/projects/{project_id}/datasets/{dataset_id}/analysis",
            json={"question": case["q"]}
        )
        assert res.status_code == 201
        data = res.json()
        assert data["validation_status"] == "PASSED"
        assert data["execution_result"]["total_rows"] > 0
        passed_benchmarks += 1

    assert passed_benchmarks == len(benchmark_cases)
