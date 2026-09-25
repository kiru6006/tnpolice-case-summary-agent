"""Pydantic State & Contract Schemas for Vetri."""
from typing import List, Dict, Any, Optional, Literal
from pydantic import BaseModel, Field
from datetime import datetime


class BoundingBox(BaseModel):
    page: int
    ymin: float = Field(ge=0.0, le=1.0)
    xmin: float = Field(ge=0.0, le=1.0)
    ymax: float = Field(ge=0.0, le=1.0)
    xmax: float = Field(ge=0.0, le=1.0)


class Citation(BaseModel):
    document_type: str
    page_number: int
    bounding_box: Optional[BoundingBox] = None
    extracted_text: str
    legal_section: Optional[str] = None


class DefectFlag(BaseModel):
    flag_id: str
    severity: Literal["critical", "major", "minor", "info"]
    category: Literal[
        "missing_mandatory_doc",
        "statutory_delay",
        "timeline_contradiction",
        "evidentiary_mismatch",
        "signature_missing",
        "electronic_cert_missing"
    ]
    title: str
    description: str
    legal_reference: str
    citations: List[Citation]
    remediation_step: str


class CategoryScores(BaseModel):
    document_completeness: float = Field(ge=0.0, le=100.0)
    procedural_compliance: float = Field(ge=0.0, le=100.0)
    evidentiary_consistency: float = Field(ge=0.0, le=100.0)
    timeline_coherence: float = Field(ge=0.0, le=100.0)


class CaseHealthScore(BaseModel):
    overall_score: float = Field(ge=0.0, le=100.0)
    category_scores: CategoryScores
    flags: List[DefectFlag]
    generated_at: datetime
    agent_version: str


class CaseState(BaseModel):
    case_id: str
    fir_number: str = ""
    police_station: str = ""
    raw_pdf_uri: str = ""
    classified_pages: List[Dict[str, Any]] = Field(default_factory=list)
    extracted_entities: Dict[str, Any] = Field(default_factory=dict)
    validation_flags: List[DefectFlag] = Field(default_factory=list)
    contradictions: List[Dict[str, Any]] = Field(default_factory=list)
    health_score: Optional[CaseHealthScore] = None
    draft_defect_memo: Optional[str] = None
    needs_human_review: bool = False
    review_stage: Optional[str] = None
    error: Optional[str] = None
