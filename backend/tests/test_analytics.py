import io
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.sqlite import init_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    init_db()


def test_duckdb_analytics_query():
    # 1. Create project and upload dataset
    p_res = client.post("/api/v1/projects", json={"name": "Analytics Test Project"})
    project_id = p_res.json()["id"]

    csv_content = (
        b"region,sales,quantity\n"
        b"North,1500,10\n"
        b"South,2200,15\n"
        b"North,1800,12\n"
        b"East,900,5\n"
        b"South,1100,8\n"
    )
    files = {"file": ("regional_sales.csv", io.BytesIO(csv_content), "text/csv")}
    upload_res = client.post(f"/api/v1/projects/{project_id}/datasets/upload", files=files)
    dataset_id = upload_res.json()["id"]

    # 2. Execute safe SELECT aggregation query
    query_payload = {
        "sql_query": "SELECT region, SUM(sales) AS total_sales, AVG(quantity) AS avg_qty FROM dataset GROUP BY region ORDER BY total_sales DESC"
    }
    res = client.post(f"/api/v1/datasets/{dataset_id}/query", json=query_payload)
    assert res.status_code == 200
    data = res.json()

    assert data["validation_status"] == "PASSED"
    assert data["total_rows"] == 3
    assert "region" in data["columns"]
    assert "total_sales" in data["columns"]

    # Check top region (South: 2200 + 1100 = 3300)
    assert data["rows"][0]["region"] == "South"
    assert data["rows"][0]["total_sales"] == 3300


def test_ddl_rejection():
    p_res = client.post("/api/v1/projects", json={"name": "DDL Security Test"})
    project_id = p_res.json()["id"]

    csv_content = b"id,val\n1,100\n"
    upload_res = client.post(f"/api/v1/projects/{project_id}/datasets/upload", files={"file": ("test.csv", io.BytesIO(csv_content), "text/csv")})
    dataset_id = upload_res.json()["id"]

    # Malicious DDL attempt
    ddl_payload = {"sql_query": "DROP TABLE dataset;"}
    res = client.post(f"/api/v1/datasets/{dataset_id}/query", json=ddl_payload)
    assert res.status_code == 400
    assert "validation error" in res.json()["detail"].lower()


def test_dml_rejection():
    p_res = client.post("/api/v1/projects", json={"name": "DML Security Test"})
    project_id = p_res.json()["id"]

    csv_content = b"id,val\n1,100\n"
    upload_res = client.post(f"/api/v1/projects/{project_id}/datasets/upload", files={"file": ("test.csv", io.BytesIO(csv_content), "text/csv")})
    dataset_id = upload_res.json()["id"]

    # Malicious DML attempt
    dml_payload = {"sql_query": "DELETE FROM dataset WHERE id = 1"}
    res = client.post(f"/api/v1/datasets/{dataset_id}/query", json=dml_payload)
    assert res.status_code == 400
    assert "validation error" in res.json()["detail"].lower()


def test_external_file_function_rejection():
    p_res = client.post("/api/v1/projects", json={"name": "External Function Security Test"})
    project_id = p_res.json()["id"]

    csv_content = b"id,val\n1,100\n"
    upload_res = client.post(f"/api/v1/projects/{project_id}/datasets/upload", files={"file": ("test.csv", io.BytesIO(csv_content), "text/csv")})
    dataset_id = upload_res.json()["id"]

    # Malicious external file read attempt
    ext_payload = {"sql_query": "SELECT * FROM read_csv_auto('/etc/passwd')"}
    res = client.post(f"/api/v1/datasets/{dataset_id}/query", json=ext_payload)
    assert res.status_code == 400
    assert "forbidden" in res.json()["detail"].lower()
