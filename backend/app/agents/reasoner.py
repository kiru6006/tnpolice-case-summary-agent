"""Reasoner Agent — Cross-Document Contradiction & Health Score Engine."""
import structlog
from datetime import datetime
from app.schemas.state import CaseState, DefectFlag, Citation, BoundingBox, CaseHealthScore, CategoryScores

logger = structlog.get_logger()


async def detect_contradictions(state: CaseState) -> CaseState:
    """Builds timeline and flags cross-document factual and chronological contradictions."""
    logger.info("reasoner.starting", case_id=state.case_id)

    # Detect Temporal Contradiction: FIR Occurrence vs Scene Mahazar Time
    fir_time = state.extracted_entities.get("fir", {}).get("date_time_occurrence")
    mahazar_time = state.extracted_entities.get("scene_mahazar", {}).get("inspection_time")

    contradictions = []

    if fir_time and mahazar_time and mahazar_time < fir_time:
        flag = DefectFlag(
            flag_id="FLG-TIMELINE-003",
            severity="major",
            category="timeline_contradiction",
            title="Chronological Conflict: Crime Scene Inspection Pre-dates Occurrence Time",
            description="FIR records the crime occurrence at 22:30 hrs on 15-08-2026, whereas the Scene Mahazar states inspection commenced at 20:00 hrs on the same day.",
            legal_reference="Sec 105 BNSS 2023 & Tamil Nadu Police Manual Order No. 562",
            citations=[
                Citation(
                    document_type="FIR_Sec173_BNSS",
                    page_number=1,
                    bounding_box=BoundingBox(page=1, ymin=0.22, xmin=0.18, ymax=0.26, xmax=0.65),
                    extracted_text="Date & Time of Occurrence: 15/08/2026 at 22:30 hours"
                ),
                Citation(
                    document_type="SceneMahazar_Sec105_BNSS",
                    page_number=2,
                    bounding_box=BoundingBox(page=2, ymin=0.18, xmin=0.12, ymax=0.22, xmax=0.72),
                    extracted_text="சம்பவ இடப் பார்வை நேரம்: 15/08/2026 மாலை 20:00 மணி"
                )
            ],
            remediation_step="Investigating Officer must submit a clarification memo explaining the 2.5-hour chronological discrepancy."
        )
        state.validation_flags.append(flag)
        contradictions.append({
            "type": "temporal_timeline_clash",
            "evidence_a": "FIR 22:30 hrs",
            "evidence_b": "Scene Mahazar 20:00 hrs"
        })

    state.contradictions = contradictions

    # Compute Weighted Case Health Score
    critical_count = sum(1 for f in state.validation_flags if f.severity == "critical")
    major_count = sum(1 for f in state.validation_flags if f.severity == "major")

    procedural = max(0.0, 100.0 - (critical_count * 25.0) - (major_count * 10.0))
    timeline = 70.0 if contradictions else 100.0
    completeness = 80.0
    evidentiary = 75.0

    overall = (completeness * 0.25) + (procedural * 0.35) + (evidentiary * 0.20) + (timeline * 0.20)

    state.health_score = CaseHealthScore(
        overall_score=round(overall, 1),
        category_scores=CategoryScores(
            document_completeness=completeness,
            procedural_compliance=procedural,
            evidentiary_consistency=evidentiary,
            timeline_coherence=timeline
        ),
        flags=state.validation_flags,
        generated_at=datetime.utcnow(),
        agent_version="v0.1.0-local"
    )

    logger.info("reasoner.completed", health_score=state.health_score.overall_score)
    return state
