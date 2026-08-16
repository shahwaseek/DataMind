import io
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.sqlite import init_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    init_db()


def test_create_and_list_projects():
    # Create project
    create_res = client.post("/api/v1/projects", json={
        "name": "Test Analytics Project",
        "description": "Project for unit testing dataset ingestion"
    })
    assert create_res.status_code == 201
    project_data = create_res.json()
    assert "id" in project_data
    assert project_data["name"] == "Test Analytics Project"

    project_id = project_data["id"]

    # List projects
    list_res = client.get("/api/v1/projects")
    assert list_res.status_code == 200
    projects = list_res.json()
    assert any(p["id"] == project_id for p in projects)


def test_upload_valid_csv():
    # 1. Create project
    p_res = client.post("/api/v1/projects", json={"name": "CSV Test Project"})
    project_id = p_res.json()["id"]

    # 2. Prepare sample CSV file
    csv_content = b"region,sales,year\nNorth,1500,2025\nSouth,2200,2025\nEast,1800,2025\n"
    files = {"file": ("sales_data.csv", io.BytesIO(csv_content), "text/csv")}

    # 3. Upload dataset
    upload_res = client.post(f"/api/v1/projects/{project_id}/datasets/upload", files=files)
    assert upload_res.status_code == 201
    ds_data = upload_res.json()
    assert ds_data["name"] == "sales_data.csv"
    assert ds_data["file_type"] == "csv"
    assert ds_data["latest_version"]["row_count"] == 3
    assert ds_data["latest_version"]["column_count"] == 3

    dataset_id = ds_data["id"]

    # 4. Fetch dataset preview
    preview_res = client.get(f"/api/v1/datasets/{dataset_id}/preview")
    assert preview_res.status_code == 200
    preview_data = preview_res.json()
    assert preview_data["row_count"] == 3
    assert len(preview_data["preview_rows"]) == 3
    assert preview_data["preview_rows"][0]["region"] == "North"


def test_upload_empty_csv_rejection():
    p_res = client.post("/api/v1/projects", json={"name": "Empty CSV Project"})
    project_id = p_res.json()["id"]

    empty_files = {"file": ("empty.csv", io.BytesIO(b""), "text/csv")}
    upload_res = client.post(f"/api/v1/projects/{project_id}/datasets/upload", files=empty_files)
    assert upload_res.status_code == 400
    assert "empty" in upload_res.json()["detail"].lower()


def test_upload_unsupported_extension_rejection():
    p_res = client.post("/api/v1/projects", json={"name": "Unsupported Extension Project"})
    project_id = p_res.json()["id"]

    bad_files = {"file": ("script.exe", io.BytesIO(b"echo 'malicious'"), "application/x-msdownload")}
    upload_res = client.post(f"/api/v1/projects/{project_id}/datasets/upload", files=bad_files)
    assert upload_res.status_code == 400
    assert "unsupported" in upload_res.json()["detail"].lower()


def test_upload_path_traversal_sanitization():
    p_res = client.post("/api/v1/projects", json={"name": "Path Traversal Security Project"})
    project_id = p_res.json()["id"]

    csv_content = b"id,val\n1,100\n"
    # Malicious path traversal filename attempt
    traversal_files = {"file": ("../../../../etc/passwd.csv", io.BytesIO(csv_content), "text/csv")}

    upload_res = client.post(f"/api/v1/projects/{project_id}/datasets/upload", files=traversal_files)
    assert upload_res.status_code == 201
    # Check that filename was sanitized and didn't escape
    assert upload_res.json()["name"] == "passwd.csv"
