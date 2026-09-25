"""LangGraph state machine for case analysis."""
from typing import Any, Dict, List, Literal

from langgraph.graph import END, START, StateGraph
from pydantic import BaseModel, Field

from app.agents.classifier import classify_documents
from app.agents.extractor import extract_entities
from app.agents.validator import validate_compliance
from app.agents.reasoner import detect_contradictions
from app.agents.defect_memo import generate_defect_memo


class CaseState(BaseModel):
    """Shared state across all agents."""
    case_id: str
    raw_documents: List[Dict[str, Any]] = Field(default_factory=list)
    classified_documents: List[Dict[str, Any]] = Field(default_factory=list)
    extracted_entities: Dict[str, Any] = Field(default_factory=dict)
    validation_result: Dict[str, Any] = Field(default_factory=dict)
    contradictions: List[Dict[str, Any]] = Field(default_factory=list)
    defect_memo: Dict[str, Any] = Field(default_factory=dict)
    needs_human_review: bool = False
    error: str | None = None


def route_after_validation(state: CaseState) -> Literal["reason", "human_review", "end"]:
    """Conditional routing after validation."""
    if state.error:
        return "end"
    if state.needs_human_review:
        return "human_review"
    return "reason"


def build_case_analysis_graph() -> StateGraph:
    """Build the LangGraph workflow."""
    graph = StateGraph(CaseState)

    graph.add_node("classify", classify_documents)
    graph.add_node("extract", extract_entities)
    graph.add_node("validate", validate_compliance)
    graph.add_node("reason", detect_contradictions)
    graph.add_node("defect_memo", generate_defect_memo)
    graph.add_node("human_review", lambda s: s)  # placeholder

    graph.add_edge(START, "classify")
    graph.add_edge("classify", "extract")
    graph.add_edge("extract", "validate")
    graph.add_conditional_edges(
        "validate",
        route_after_validation,
        {"reason": "reason", "human_review": "human_review", "end": END},
    )
    graph.add_edge("reason", "defect_memo")
    graph.add_edge("defect_memo", END)

    return graph.compile()


# Singleton compiled graph
case_analysis_graph = build_case_analysis_graph()