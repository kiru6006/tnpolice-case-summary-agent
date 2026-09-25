"""Typed Domain Models for Police Case Documents."""
from typing import List, Optional
from datetime import datetime, date
from pydantic import BaseModel


class FIRModel(BaseModel):
    fir_number: str
    police_station: str
    district: str
    date_time_occurrence: datetime
    date_time_registered: datetime
    date_time_dispatched_magistrate: Optional[datetime] = None
    complainant_name: str
    place_of_occurrence: str
    sections_invoked: List[str]
    brief_facts: str


class AccusedModel(BaseModel):
    name: str
    father_name: str
    age: int
    address: str
    arrest_date: Optional[date] = None
    custody_status: str


class WitnessStatementModel(BaseModel):
    witness_name: str
    father_name: Optional[str] = None
    statement_date: date
    bnss_section: str = "180"
    statement_summary: str


class ChargeSheetModel(BaseModel):
    case_id: str
    charge_sheet_number: str
    court_name: str
    submission_date: date
    fir: FIRModel
    accused: List[AccusedModel]
    witness_statements: List[WitnessStatementModel]
