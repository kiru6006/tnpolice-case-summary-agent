# 05 — System Architecture

## 5-Tier Architecture

```mermaid
flowchart TB
    subgraph T1["Tier 1: Presentation (Micro-Frontend)"]
        Shell[MF Shell<br/>Auth + Routing]
        DV[Document Viewer Remote<br/>PDF + OCR Overlay]
        GA[Gap Analysis Remote<br/>Health Score + Flags]
        DM[Defect Memo Remote<br/>Draft Generator]
        AD[Admin Remote<br/>LLMOps Console]
    end

    subgraph T2["Tier 2: API Gateway + Security"]
        GW[API Gateway<br/>Rate Limit + RBAC]
        PII[PII Masking Service<br/>NER-based redaction]
        AUD[Audit Trail Service<br/>Immutable logs]
    end

    subgraph T3["Tier 3: Agentic AI Core"]
        ORCH[LangGraph Orchestrator]
        CLS[Classifier Agent]
        EXT[Extractor Agent<br/>Qwen-VL]
        VAL[Validator Agent<br/>Rules + RAG]
        RSN[Reasoner Agent<br/>Contradictions]
        DEF[Defect Memo Agent]
        MCP[MCP Server<br/>CCTNS + Legal DB]
    end

    subgraph T4["Tier 4: Data + Integration"]
        VDB[(pgvector<br/>Legal Embeddings)]
        S3[(S3 India<br/>Raw PDFs)]
        CCTNS[(CCTNS API)]
        PG[(PostgreSQL<br/>Case Metadata)]
    end

    subgraph T5["Tier 5: LLMOps + Observability"]
        LSmith[LangSmith<br/>Tracing]
        MLflow[MLflow<br/>Model Registry]
        Eval[Eval Engine<br/>Golden Dataset]
        Prom[Prometheus + Grafana]
    end

    Shell --> GW
    DV --> GW
    GA --> GW
    DM --> GW
    AD --> GW
    GW --> PII --> ORCH
    ORCH --> CLS --> EXT --> VAL --> RSN --> DEF
    VAL -.-> VDB
    VAL -.-> MCP
    MCP --> CCTNS
    DEF --> PG
    EXT --> S3
    ORCH -.-> LSmith
    ORCH -.-> MLflow
    Eval -.-> ORCH
    Prom -.-> ORCH
    AUD -.-> PG