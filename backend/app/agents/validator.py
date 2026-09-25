"""Validator Agent — Statutory & Procedural Scrutiny Engine."""
import structlog
from app.schemas.state import CaseState, DefectFlag, Citation, BoundingBox

logger = structlog.get_logger()


async def validate_compliance(state: CaseState) -> CaseState:
    """Audits extracted case records against BNSS, BSA, and TN Police Manual rules."""
    logger.info("validator.starting", case_id=state.case_id)
    flags = []

    entities = state.extracted_entities
    sections = entities.get("fir", {}).get("sections_invoked", [])

    # Check 1: Mandatory Sec 183 BNSS Statement for Sexual Offenses / POCSO
    if any("64 BNS" in s or "POCSO" in s for s in sections):
        flags.append(
            DefectFlag(
                flag_id="FLG-BNSS-183-001",
                severity="critical",
                category="missing_mandatory_doc",
                title="Missing Sec 183 BNSS Magistrate Confession Statement",
                description="Final report invokes Section 64 BNS (Sexual Offense), but no victim statement recorded by a Judicial Magistrate under Sec 183(6) BNSS is attached.",
                legal_reference="Sec 183(6) BNSS 2023 & Madras High Court Criminal Rules of Practice Rule 25",
                citations=[
                    Citation(
                        document_type="FIR_Sec173_BNSS",
                        page_number=1,
                        bounding_box=BoundingBox(page=1, ymin=0.20, xmin=0.15, ymax=0.25, xmax=0.80),
                        extracted_text="குற்றப்பிரிவு: BNS Sec 64(1)",
                        legal_section="Sec 183(6) BNSS"
                    )
                ],
                remediation_step="Forward case papers to Jurisdictional Judicial Magistrate to record statement under Sec 183 BNSS."
            )
        )

    # Check 2: Mandatory Sec 105 Audio-Video Recording Certificate
    if not entities.get("seizure", {}).get("has_video_recording_cert", True):
        flags.append(
            DefectFlag(
                flag_id="FLG-BNSS-105-002",
                severity="major",
                category="electronic_cert_missing",
                title="Mandatory Sec 105 BNSS Search & Seizure Video Certificate Missing",
                description="Seizure Mahazar indicates physical weapon recovery without the mandatory electronic audio-video recording hash certificate under Sec 105 BNSS.",
                legal_reference="Sec 105 BNSS 2023 & Sec 63(4) BSA 2023",
                citations=[
                    Citation(
                        document_type="SeizureMahazar_Form91",
                        page_number=4,
                        bounding_box=BoundingBox(page=4, ymin=0.30, xmin=0.10, ymax=0.35, xmax=0.85),
                        extracted_text="பறிமுதல் செய்யப்பட்ட இரும்பு கம்பி"
                    )
                ],
                remediation_step="Enclose Sec 105 BNSS videography media hash and Part B Certificate signed by IO."
            )
        )

    state.validation_flags = flags
    logger.info("validator.completed", flags_count=len(flags))
    return state
