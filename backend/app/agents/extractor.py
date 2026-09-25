"""Extractor Agent — Multimodal Entity & Coordinate Parser."""
import structlog
from app.schemas.state import CaseState

logger = structlog.get_logger()


async def extract_entities(state: CaseState) -> CaseState:
    """Extracts structured legal entities preserving visual bounding box coordinates."""
    logger.info("extractor.starting", case_id=state.case_id)

    # In local/starter mode: extract structured case bundle with normalized bounding boxes
    extracted_entities = {
        "fir": {
            "fir_number": "456/2026",
            "date_time_occurrence": "2026-08-15T22:30:00+05:30",
            "date_time_registered": "2026-08-15T23:45:00+05:30",
            "police_station": "T. Nagar Police Station, Chennai",
            "complainant": "Ramesh Kumar",
            "sections_invoked": ["303(2) BNS", "115(2) BNS", "64 BNS"],
            "bbox": {"page": 1, "ymin": 0.12, "xmin": 0.15, "ymax": 0.28, "xmax": 0.85}
        },
        "scene_mahazar": {
            "inspection_time": "2026-08-15T20:00:00+05:30",
            "witnesses": ["Murugan S/o Ramasamy"],
            "bbox": {"page": 2, "ymin": 0.18, "xmin": 0.12, "ymax": 0.25, "xmax": 0.72}
        },
        "accused": [
            {
                "name": "Suresh Babu",
                "father_name": "Krishnan",
                "age": 34,
                "custody_status": "in_custody",
                "arrest_date": "2026-08-16"
            }
        ],
        "seizure": {
            "items_seized": ["Iron Rod (1 unit)"],
            "has_video_recording_cert": False
        },
        "medical": {
            "hospital": "Government General Hospital, Chennai",
            "injuries": ["Blunt-force contusion left forearm", "No sharp-edge lacerations"]
        }
    }

    state.extracted_entities = extracted_entities
    state.fir_number = extracted_entities["fir"]["fir_number"]
    state.police_station = extracted_entities["fir"]["police_station"]

    logger.info("extractor.completed", entities_count=len(extracted_entities))
    return state
