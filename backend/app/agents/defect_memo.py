"""Defect Memo Agent — Madras High Court Rule 34 Drafter."""
import structlog
from app.schemas.state import CaseState

logger = structlog.get_logger()


async def generate_defect_memo(state: CaseState) -> CaseState:
    """Drafts court-ready Defect Return Memorandum under High Court Criminal Rules of Practice."""
    logger.info("defect_memo.starting", case_id=state.case_id)

    if not state.validation_flags:
        state.draft_defect_memo = "No fatal or procedural defects identified. Case papers approved for filing."
        return state

    lines = [
        f"### IN THE COURT OF THE JUDICIAL MAGISTRATE NO. I, CHENNAI",
        f"**Case ID:** {state.case_id} | **Crime No.:** {state.fir_number}",
        f"**Police Station:** {state.police_station}",
        "",
        "**MEMORANDUM OF DEFECTS RETURN UNDER RULE 34, CRIMINAL RULES OF PRACTICE**",
        "",
        "The Final Report submitted in the above Crime Number has been scrutinized and is hereby returned for rectification of the following defects:",
        ""
    ]

    for idx, flag in enumerate(state.validation_flags, start=1):
        lines.append(f"{idx}. **{flag.title}** ({flag.legal_reference})")
        lines.append(f"   {flag.description}")
        lines.append(f"   *Direction:* {flag.remediation_step}")
        lines.append("")

    lines.append("The Investigating Officer is directed to rectify the above defects and re-present the charge sheet papers before this Court within **14 days** from the date of receipt of this memorandum.")
    lines.append("")
    lines.append("*(Sd/-)*")
    lines.append("**Judicial Magistrate No. I, Chennai**")

    state.draft_defect_memo = "\n".join(lines)
    logger.info("defect_memo.completed")
    return state
