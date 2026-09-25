# Vetri Backend Service

FastAPI and LangGraph Multi-Agent Backend for Tamil Nadu Police Report Scrutiny and Judicial Defect Memo Generation.

## Requirements
- Python 3.11+
- PostgreSQL 16 with `pgvector`
- Redis (Optional for local mode)

## Running
```bash
uvicorn app.main:app --reload --port 8000
```
