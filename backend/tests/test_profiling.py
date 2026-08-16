import io
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.sqlite import init_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    init_db()


def test_dataset_profiling_and_quality_score():
    # 1. Create project
    p_res = client.post("/api/v1/projects", json={"name": "Profiling Test Project"})
    project_id = p_res.json()["id"]

    # 2. Upload sample dataset with numeric stats, nulls, and categories
    csv_content = (
        b"age,salary,department,join_date\n"
        b"25,50000,Engineering,2022-01-15\n"
        b"30,65000,Engineering,2021-06-20\n"
        b"45,,Marketing,2019-11-05\n"
        b"22,48000,Marketing,2023-02-10\n"
        b"35,72000,Sales,2020-08-12\n"
        b"28,52000,Engineering,2022-09-01\n"
    )
    files = {"file": ("employee_data.csv", io.BytesIO(csv_content), "text/csv")}
    upload_res = client.post(f"/api/v1/projects/{project_id}/datasets/upload", files=files)
    assert upload_res.status_code == 201
    dataset_id = upload_res.json()["id"]

    # 3. Request dataset profile
    profile_res = client.get(f"/api/v1/datasets/{dataset_id}/profile")
    assert profile_res.status_code == 200
    p = profile_res.json()

    assert p["total_rows"] == 6
    assert p["total_columns"] == 4
    assert p["duplicate_rows"] == 0
    assert "data_quality_score" in p
    assert p["data_quality_score"] >= 0 and p["data_quality_score"] <= 100

    # Verify column statistics
    cols = {c["name"]: c for c in p["columns"]}
    assert "age" in cols
    assert "salary" in cols
    assert cols["salary"]["null_count"] == 1
    assert cols["salary"]["stats"]["min"] == 48000
    assert cols["salary"]["stats"]["max"] == 72000
    assert cols["department"]["distinct_count"] == 3
