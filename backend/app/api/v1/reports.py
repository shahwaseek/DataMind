import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
from app.db.sqlite import get_connection
from app.services.profiling import profile_dataset_file

router = APIRouter(tags=["Reports"])


@router.get("/projects/{project_id}/reports/generate")
def generate_project_report(project_id: str):
    conn = get_connection()
    try:
        p_row = conn.execute("SELECT * FROM projects WHERE id = ?", (project_id,)).fetchone()
        if not p_row:
            raise HTTPException(status_code=404, detail="Project not found")

        datasets_rows = conn.execute("SELECT * FROM datasets WHERE project_id = ?", (project_id,)).fetchall()
        analyses_rows = conn.execute("SELECT * FROM analyses WHERE project_id = ? ORDER BY created_at DESC", (project_id,)).fetchall()

        # Build executive report
        report_sections = []
        report_sections.append(f"# Executive Analytical Report: {p_row['name']}\n")
        report_sections.append(f"**Project ID:** `{project_id}`  ")
        report_sections.append(f"**Created At:** {p_row['created_at']}  \n")
        report_sections.append("## Executive Summary")
        report_sections.append(f"This project contains **{len(datasets_rows)} dataset(s)** and **{len(analyses_rows)} recorded AI analysis run(s)**.\n")

        # Datasets Quality Summary
        report_sections.append("## Ingested Datasets & Quality Scores")
        for ds in datasets_rows:
            ds_path = Path(ds["storage_path"])
            if ds_path.exists():
                try:
                    prof = profile_dataset_file(ds_path)
                    report_sections.append(f"### Dataset: `{ds['name']}` ({ds['file_type'].upper()})")
                    report_sections.append(f"- **Data Quality Score:** {prof['data_quality_score']} / 100")
                    report_sections.append(f"- **Dimensions:** {prof['total_rows'].toLocaleString() if hasattr(prof['total_rows'], 'toLocaleString') else prof['total_rows']} rows × {prof['total_columns']} columns")
                    if prof['quality_warnings']:
                        report_sections.append(f"- **Quality Warnings:** {', '.join(prof['quality_warnings'])}")
                except Exception:
                    pass

        # Analyses & Evidence Summary
        report_sections.append("\n## Evidence-Backed Analysis Runs")
        for a in analyses_rows:
            report_sections.append(f"### Q: \"{a['question']}\"")
            report_sections.append(f"- **Intent:** `{a['intent'].upper()}` | **Validation:** {a['validation_status']}")
            report_sections.append(f"- **AI Explanation:** {a['explanation']}")
            report_sections.append(f"- **SQL Query:** `{a['generated_sql']}`")
            report_sections.append(f"- **Model:** `{a['model_identifier']}` | **Execution Time:** {a['execution_time_ms']} ms\n")

        markdown_content = "\n".join(report_sections)

        return {
            "project_id": project_id,
            "project_name": p_row["name"],
            "dataset_count": len(datasets_rows),
            "analysis_count": len(analyses_rows),
            "report_markdown": markdown_content
        }
    finally:
        conn.close()
