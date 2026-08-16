import io
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.sqlite import init_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    init_db()


def test_nl_analysis_creation_and_reproducibility():
    # 1. Create project & dataset
    p_res = client.post("/api/v1/projects", json={"name": "AI Analyst Test Project"})
    project_id = p_res.json()["id"]

    csv_content = (
        b"region,revenue,year\n"
        b"North,45000,2025\n"
        b"South,62000,2025\n"
        b"East,28000,2025\n"
    )
    upload_res = client.post(
        f"/api/v1/projects/{project_id}/datasets/upload",
        files={"file": ("revenue_2025.csv", io.BytesIO(csv_content), "text/csv")}
    )
    dataset_id = upload_res.json()["id"]

    # 2. Submit natural language question
    analysis_res = client.post(
        f"/api/v1/projects/{project_id}/datasets/{dataset_id}/analysis",
        json={"question": "Which region generated the highest revenue in 2025?"}
    )
    assert analysis_res.status_code == 201
    a_data = analysis_res.json()

    assert a_data["question"] == "Which region generated the highest revenue in 2025?"
    assert a_data["validation_status"] == "PASSED"
    assert "generated_sql" in a_data
    assert a_data["execution_result"]["total_rows"] > 0

    analysis_id = a_data["id"]

    # 3. Retrieve analysis evidence record
    get_res = client.get(f"/api/v1/analysis/{analysis_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == analysis_id

    # 4. Test re-run analysis for reproducibility
    rerun_res = client.post(f"/api/v1/analysis/{analysis_id}/rerun")
    assert rerun_res.status_code == 200
    r_data = rerun_res.json()
    assert r_data["validation_status"] == "PASSED"
    assert "[Reproduced Run]" in r_data["explanation"]
