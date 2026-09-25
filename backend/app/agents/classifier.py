"""Classifier Agent — Document Layout & Taxonomy Slicing."""
import structlog
from app.schemas.state import CaseState

logger = structlog.get_logger()


async def classify_documents(state: CaseState) -> CaseState:
    """Classifies document pages into Tamil Nadu Police / BNSS document taxonomy."""
    logger.info("classifier.starting", case_id=state.case_id)

    # In local/starter mode: simulate layout classification with realistic Tamil Nadu police bundle structure
    classified_pages = [
        {"page_number": 1, "document_type": "FIR_Sec173_BNSS", "confidence": 0.98, "language": "mixed", "is_handwritten": False},
        {"page_number": 2, "document_type": "SceneMahazar_Sec105_BNSS", "confidence": 0.95, "language": "tamil", "is_handwritten": True},
        {"page_number": 3, "document_type": "WitnessStatement_Sec180_BNSS", "confidence": 0.92, "language": "tamil", "is_handwritten": True},
        {"page_number": 4, "document_type": "SeizureMahazar_Form91", "confidence": 0.94, "language": "tamil", "is_handwritten": True},
        {"page_number": 5, "document_type": "Medical_PostMortem_Report", "confidence": 0.96, "language": "english", "is_handwritten": False},
        {"page_number": 6, "document_type": "ChargeSheet_Sec193_BNSS", "confidence": 0.99, "language": "mixed", "is_handwritten": False}
    ]

    state.classified_pages = classified_pages
    logger.info("classifier.completed", total_pages=len(classified_pages))
    return state
