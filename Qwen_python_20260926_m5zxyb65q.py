class AgentMessage(BaseModel):
    case_id: str
    agent_id: str
    timestamp: datetime
    payload: Dict[str, Any]
    citations: List[Citation]
    confidence: float