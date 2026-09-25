"""Case Upload, Scrutiny Execution & Scrutiny Query Endpoints."""
import uuid
from typing import Dict, Any
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core.storage import get_storage_service
from app.schemas.state import CaseState
from app.agents.orchestrator import case_scrutiny_graph

router = APIRouter()
storage = get_storage_service()

# In-memory case repository for local standalone execution
_CASES_DB: Dict[str, CaseState] = {}


@router.post("/upload")
async def upload_and_scrutinize_case(file: UploadFile = File(...)):
    """Uploads police dossier and executes multi-agent LangGraph scrutiny."""
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    case_id = f"TN/CH/2026/{uuid.uuid4().hex[:6].upper()}"
    file_bytes = await file.read()

    # Save to local storage or S3
    saved_uri = await storage.save_file(file_bytes, f"cases/{case_id}/dossier.pdf")

    # Initialize State
    initial_state = CaseState(
        case_id=case_id,
        raw_pdf_uri=saved_uri
    )

    # Execute LangGraph Pipeline
    final_state_dict = await case_scrutiny_graph.ainvoke(initial_state)
    final_state = CaseState(**final_state_dict) if isinstance(final_state_dict, dict) else final_state_dict

    _CASES_DB[case_id] = final_state

    return {
        "case_id": case_id,
        "overall_health_score": final_state.health_score.overall_score if final_state.health_score else 0.0,
        "category_scores": final_state.health_score.category_scores if final_state.health_score else None,
        "flags": final_state.validation_flags,
        "draft_defect_memo": final_state.draft_defect_memo,
        "classified_pages": final_state.classified_pages,
        "extracted_entities": final_state.extracted_entities
    }


@router.get("/{case_id}")
async def get_case_scrutiny(case_id: str):
    """Retrieves scrutiny results by case ID."""
    if case_id not in _CASES_DB:
        raise HTTPException(status_code=404, detail="Case not found.")
    state = _CASES_DB[case_id]
    return {
        "case_id": case_id,
        "fir_number": state.fir_number,
        "police_station": state.police_station,
        "overall_health_score": state.health_score.overall_score if state.health_score else 0.0,
        "category_scores": state.health_score.category_scores if state.health_score else None,
        "flags": state.validation_flags,
        "draft_defect_memo": state.draft_defect_memo,
        "classified_pages": state.classified_pages,
        "extracted_entities": state.extracted_entities
    }
