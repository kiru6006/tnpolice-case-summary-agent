# 05 — End-to-End System Architecture Blueprint
## Vetri (வெற்றி) — Police Cases Report Agent

---

## 1. 5-Tier Enterprise Architecture Overview

```mermaid
flowchart TB
    subgraph T1["Tier 1: Presentation (Micro-Frontend Platform)"]
        direction TB
        Shell["Host Shell (React 18 + Module Federation)"]
        DV["DocumentViewer Remote<br/>(PDF Canvas + OCR BBox Overlay)"]
        GA["GapAnalysis Remote<br/>(Health Score & Defect Flags)"]
        DM["DefectMemo Remote<br/>(Judicial Drafting & Return Orders)"]
        AD["Admin Remote<br/>(LLMOps, Tracing & Prompts)"]
        Shell --> DV & GA & DM & AD
    end

    subgraph T2["Tier 2: API Gateway & Security Perimeter"]
        direction TB
        WAF["AWS WAF / Shield<br/>(Gov Cloud Perimeter)"]
        GW["API Gateway / Envoy<br/>(JWT OAuth2 / OIDC + mTLS)"]
        PII["PII Redaction Service<br/>(IndicBERT NER + Regex Scrubbing)"]
        AUD["Audit Logger<br/>(SHA-256 Hash Chained Logs)"]
        WAF --> GW --> PII --> AUD
    end

    subgraph T3["Tier 3: Agentic AI Core (LangGraph Orchestrator)"]
        direction TB
        ORCH["LangGraph State Engine<br/>(CaseState Pydantic v2)"]
        CLS["1. Classifier Agent<br/>(Qwen2.5-VL Layout Classifier)"]
        EXT["2. Extractor Agent<br/>(Multimodal Coordinate Parser)"]
        VAL["3. Validator Agent<br/>(Rule Engine + RAG Grounding)"]
        RSN["4. Reasoner Agent<br/>(Contradiction & Timeline Matrix)"]
        DFM["5. Defect Memo Agent<br/>(HC Practice Template Generator)"]
        ORCH --> CLS --> EXT --> VAL --> RSN --> DFM
    end

    subgraph T4["Tier 4: Data & Integration Layer"]
        direction TB
        VDB[("pgvector / Milvus<br/>(BNSS/BSA/Manual Embeddings)")]
        S3[("S3 India ap-south-1<br/>(Encrypted Case Bundles)")]
        PG[("PostgreSQL 16 RDS<br/>(Schemas, Audit Logs, Case Scores)")]
        MCP_Server["Python MCP Server<br/>(JSON-RPC 2.0 Tools)"]
        CCTNS[("CCTNS / ICJS REST Gateway")]
        Kanoon[("IndianKanoon / Madras HC API")]
        MCP_Server --> CCTNS & Kanoon
    end

    subgraph T5["Tier 5: LLMOps & Observability"]
        direction TB
        LS["LangSmith / Phoenix<br/>(Agent Traces & Evaluations)"]
        MLF["MLflow Registry<br/>(Model Registry & Prompt Versions)"]
        Prom["Prometheus + Grafana<br/>(Latency, Token Costs, RPS)"]
    end

    T1 -->|HTTPS / WSS| T2
    AUD --> T3
    VAL <--> VDB
    RSN <--> MCP_Server
    EXT --> S3
    DFM --> PG
    T3 -.-> T5
```

---

## 2. End-to-End Data Flow Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Clerk / IO / Judge)
    participant Shell as React Host Shell
    participant GW as API Gateway
    participant PII as PII Redaction Service
    participant LG as LangGraph Orchestrator
    participant VLM as Qwen2.5-VL Engine
    participant RAG as pgvector Knowledge Base
    participant MCP as MCP Tool Server
    participant DB as PostgreSQL 16
    participant UI as Remote UI Views

    User->>Shell: Submits Case Dossier (PDF Bundle)
    Shell->>GW: POST /api/v1/cases/upload (Multipart PDF)
    GW->>PII: Stream document for sensitive entity masking
    PII-->>GW: Sanitized PDF Stream + Encrypted PII Key Map
    GW->>LG: Initialize Case Analysis Workflow (case_id)
    
    rect rgb(240, 245, 255)
        note over LG,VLM: Step 1: Layout Classification & Extraction
        LG->>VLM: Classify document pages & extract visual coordinates
        VLM-->>LG: Page Classes + Bounding Boxes + Extracted Entities
    end

    rect rgb(255, 245, 240)
        note over LG,RAG: Step 2: Procedural Validation & Statutory Grounding
        LG->>RAG: Hybrid query legal rules for offenses invoked
        RAG-->>LG: Exact BNSS/BSA Sections + Mandatory Checklist
        LG->>MCP: Query CCTNS for accused criminal antecedents
        MCP-->>LG: CCTNS Status & Prior FIRs
    end

    rect rgb(240, 255, 240)
        note over LG,DB: Step 3: Cross-Document Reasoning & Health Scoring
        LG->>LG: Construct timeline graph & evaluate contradictions
        LG->>LG: Compute Category Scores & Overall Health Score
        LG->>DB: Persist CaseState, Flags, and Draft Defect Memo
    end

    LG-->>GW: Complete Case Scrutiny Payload
    GW-->>Shell: Event "case.scrutiny.completed" via WebSocket
    Shell->>UI: Hydrate DocumentViewer, GapAnalysis, and DefectMemo remotes
    UI-->>User: Present Interactive Judicial Scrutiny Dashboard
```

---

## 3. Tier-by-Tier Component Specifications

### 3.1 Tier 1: Presentation Layer (Micro-Frontend Architecture)
- **Host Shell (`@vetri/shell`)**: Orchestrates authentication, session refresh, RBAC gatekeeping, and dynamic loading of remotes via Webpack 5 Module Federation.
- **DocumentViewer Remote (`@vetri/document-viewer`)**: Canvas-rendered dual-page PDF viewer with real-time bounding-box highlighting synchronized with active defect flags.
- **GapAnalysis Remote (`@vetri/gap-analysis`)**: Visual Case Health Score gauge (0–100) with category-wise breakdown (Completeness, Procedural, Evidential, Timeline) and interactive filter chips.
- **DefectMemo Remote (`@vetri/defect-memo`)**: Specialized drafting studio containing pre-populated High Court defect return templates, rich-text markdown editing, and digital signature integration.
- **Admin Remote (`@vetri/admin`)**: Real-time observability dashboard displaying LangSmith trace links, token budget consumption, and prompt experimentation toggles.

### 3.2 Tier 2: API Gateway & Security Perimeter
- **Envoy / AWS API Gateway**: Terminating mutual TLS (mTLS), applying rate limiting (100 req/min/IP), and enforcing OAuth2/OIDC JWT tokens issued by state judicial identity providers.
- **PII Scrubbing Service**: High-speed NER model (`IndicBERT-NER`) running inline to redact Aadhaar numbers (12 digits), phone numbers, bank details, and victim identities prior to vector embedding.
- **Immutable Audit Service**: Every document upload, inference step, prompt hash, and judicial override is cryptographically chained using SHA-256 hashes and stored in an append-only audit table.

### 3.3 Tier 3: Agentic AI Core (LangGraph)
- Built on Python 3.11+ using `langgraph>=0.2.50` and `pydantic>=2.9.0`.
- Implements a resilient StateGraph architecture with checkpoints, cyclic feedback edges for human verification, and automatic fallback routers.

### 3.4 Tier 4: Data & Integration Layer
- **PostgreSQL 16 with pgvector**: Stores high-dimensional embeddings (1536-dim / 3072-dim) of legal statutes alongside relational metadata.
- **AWS S3 (Mumbai `ap-south-1`)**: Stores raw PDFs, processed page image slices, and generated Defect Memo PDFs under server-side KMS encryption (`aws:kms`).
- **Python MCP Server**: Standardized Model Context Protocol server exposing verified tools over JSON-RPC 2.0 for external ecosystem integration.

### 3.5 Tier 5: LLMOps & Observability
- **Tracing & Evaluation**: Native LangSmith / Arize Phoenix integration tracing multi-agent token latency, retrieval relevance, and step-by-step reasoning paths.
- **Registry & Metrics**: MLflow tracking prompt versions and model weights; Prometheus + Grafana capturing latency percentiles (p50, p95, p99) and token spend.

---

## 4. Deployment Topology & India Data Residency

```mermaid
graph TB
    subgraph AWS_India["AWS ap-south-1 (Mumbai Region) - Sovereign Boundary"]
        subgraph Public_Subnet["Public DMZ"]
            ALB["Application Load Balancer (WAF Enabled)"]
            CF["CloudFront CDN (Static Frontend Assets)"]
        end

        subgraph Private_App_Subnet["Private Compute Subnet (EKS)"]
            EKS_CPU["EKS CPU Node Group (FastAPI / Gateway / MFE Shell)"]
            EKS_GPU_OCR["EKS GPU Node Group (Qwen2.5-VL / OCR Inference)"]
            EKS_GPU_LLM["EKS GPU Node Group (Self-hosted Indic LLM / Embeddings)"]
        end

        subgraph Private_Data_Subnet["Private Data Subnet"]
            RDS[("Amazon RDS PostgreSQL 16 + pgvector (Multi-AZ)")]
            Redis[("Amazon ElastiCache Redis (Session Checkpointer)")]
            S3_Bucket[("Amazon S3 (KMS Encrypted India Storage)")]
        end
    end

    CF --> ALB
    ALB --> EKS_CPU
    EKS_CPU <--> EKS_GPU_OCR & EKS_GPU_LLM
    EKS_CPU <--> RDS & Redis & S3_Bucket
```
