import io
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.sqlite import init_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    init_db()


def test_chart_recommendation_and_generation():
    # 1. Create project & dataset
    p_res = client.post("/api/v1/projects", json={"name": "Chart Test Project"})
    project_id = p_res.json()["id"]

    csv_content = (
        b"product,revenue,units\n"
        b"Laptop,120000,80\n"
        b"Smartphone,95000,120\n"
        b"Monitor,45000,60\n"
    )
    upload_res = client.post(
        f"/api/v1/projects/{project_id}/datasets/upload",
        files={"file": ("products.csv", io.BytesIO(csv_content), "text/csv")}
    )
    dataset_id = upload_res.json()["id"]

    # 2. Request chart generation
    chart_res = client.post(
        f"/api/v1/datasets/{dataset_id}/chart",
        json={"sql_query": "SELECT product, SUM(revenue) AS revenue FROM dataset GROUP BY product", "intent": "top_n"}
    )
    assert chart_res.status_code == 200
    c_data = chart_res.json()

    assert "chart_spec" in c_data
    spec = c_data["chart_spec"]
    assert spec["chart_type"] in ["bar", "pie"]
    assert spec["x_axis"] == "product"
    assert len(spec["data"]) == 3
