"""LangGraph StateGraph Engine for Vetri."""
from typing import Literal
from langgraph.graph import StateGraph, START, END
from app.schemas.state import CaseState
from app.agents.classifier import classify_documents
from app.agents.extractor import extract_entities
from app.agents.validator import validate_compliance
from app.agents.reasoner import detect_contradictions
from app.agents.defect_memo import generate_defect_memo


def route_after_validation(state: CaseState) -> Literal["reason", "human_review", "end"]:
    if state.error:
        return "end"
    if state.needs_human_review:
        return "human_review"
    return "reason"


def build_case_scrutiny_graph():
    """Builds and compiles the 5-agent LangGraph workflow."""
    workflow = StateGraph(CaseState)

    workflow.add_node("classify", classify_documents)
    workflow.add_node("extract", extract_entities)
    workflow.add_node("validate", validate_compliance)
    workflow.add_node("reason", detect_contradictions)
    workflow.add_node("defect_memo", generate_defect_memo)
    workflow.add_node("human_review", lambda s: s)

    workflow.add_edge(START, "classify")
    workflow.add_edge("classify", "extract")
    workflow.add_edge("extract", "validate")
    workflow.add_conditional_edges(
        "validate",
        route_after_validation,
        {"reason": "reason", "human_review": "human_review", "end": END}
    )
    workflow.add_edge("reason", "defect_memo")
    workflow.add_edge("defect_memo", END)

    return workflow.compile()


case_scrutiny_graph = build_case_scrutiny_graph()
