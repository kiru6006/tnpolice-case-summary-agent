# Vetri (வெற்றி) — Police Cases Report Agent
## Comprehensive Project Requirements, Architecture Blueprint & 3-Phase Implementation Plan

---

### Executive Summary & Specialist Context

**Vetri (வெற்றி)** (`vetri-police-cases-report-agent`) is an enterprise-grade, government-compliant, bilingual (Tamil + English) Agentic AI system designed to automate the procedural scrutiny, gap detection, contradiction analysis, and defect memo drafting for police investigation dossiers submitted to judicial magistrates and district courts across Tamil Nadu.

Operating under the newly enacted criminal laws (**Bharatiya Nagarik Suraksha Sanhita 2023 [BNSS]**, **Bharatiya Sakshya Adhiniyam 2023 [BSA]**, **Bharatiya Nyaya Sanhita 2023 [BNS]**), the **Tamil Nadu Police Manual**, and the **Digital Personal Data Protection Act 2023 (DPDP)**, Vetri transforms an error-prone, weeks-long manual triage workflow into a 5-minute auditable verification loop with strict Human-in-the-Loop (HITL) judicial safeguards.

---

## 1. System Vision, Scope & Core Objectives

### 1.1 Problem Statement & Baseline Gaps
- **High Defect Rate**: Over 32% of charge sheets submitted to magistrates contain procedural infirmities (missing 183 BNSS confessions in serious offenses, unsigned seizure mahazars, delayed FIR dispatch under Sec 176 BNSS).
- **Delayed Feedback Loop**: Defect memos are traditionally drafted and served 14 to 30 days post-submission, stalling trials and prolonging custody/bail ambiguity.
- **Bilingual & Handwritten Complexity**: Up to 70% of lower-court case records in Tamil Nadu contain handwritten Tamil statements, regional Tamil legal jargon, and code-mixed Tanglish records.
- **Clerk Triage Bottleneck**: Court staff spend 35–50 minutes per case bundle manually cross-verifying dates, witness lists, and material object schedules.

### 1.2 Target KPIs (12-Month Horizon)
| Metric | Baseline (Manual) | Phase 1 Target | Phase 2 Target | Final Phase 3 (Prod) |
|---|---|---|---|---|
| **Charge Sheet Completeness Rate** | ~68% | 75% | 88% | ≥ 94% |
| **Defect Memo Turnaround Time** | 14–21 Days | 5 Days | 24 Hours | ≤ 2 Hours (Draft Ready) |
| **Clerk Triage Time per Case** | 40 Minutes | 25 Minutes | 12 Minutes | ≤ 5 Minutes |
| **AI Gap Detection Precision** | N/A | 80% | 88% | ≥ 92% |
| **AI Gap Detection Recall** | N/A | 75% | 85% | ≥ 90% |
| **Legal Citation Hallucination** | N/A | < 5% | < 1% | 0.0% (Deterministic RAG Grounding) |
| **PII Redaction Accuracy** | N/A | 95% | 99% | 99.9% (Zero DPDP Breaches) |

---

## 2. Legal & Statutory Alignment Matrix

```mermaid
graph TD
    subgraph BNSS_2023["BNSS 2023 (Procedural Core)"]
        Sec173["Sec 173 (FIR & Online Reg)"]
        Sec105["Sec 105 (Mandatory Videography)"]
        Sec180["Sec 180 (Witness Examination)"]
        Sec183["Sec 183 (Magistrate Confession/Statement)"]
        Sec193["Sec 193 (Police Report / Charge Sheet)"]
    end

    subgraph BSA_2023["BSA 2023 (Evidence & Admissibility)"]
        Sec61_63["Sec 61-63 (Electronic Evidence & Certificate)"]
        Sec23["Sec 23 (Confessions to Police Inadmissible)"]
    end

    subgraph DPDP_2023["DPDP Act 2023 & Security"]
        PII_Mask["Automated NER Redaction (Aadhaar, Phone, POCSO names)"]
        Audit_Log["Immutable Hash-Chained Audit Trails"]
    end

    Sec173 --> Sec193
    Sec180 --> Sec193
    Sec183 --> Sec193
    Sec105 --> Sec61_63
    Sec193 --> PII_Mask
```

### 2.1 Statutory Mapping Table
| Document Type | Governing Section | Validation Rules & Deterministic Triggers |
|---|---|---|
| **First Information Report (FIR)** | Sec 173 BNSS | Timestamps checked against occurrence time; jurisdictional police station verified; preliminary compliance check under Sec 176 BNSS (delay reporting). |
| **Scene Mahazar / Rough Sketch** | Sec 105 BNSS / TN Police Manual | Must contain witness signatures, date/time matching FIR, audio-video recording metadata verification under Sec 105 BNSS. |
| **Witness Statement** | Sec 180 BNSS (erstwhile 161 CrPC) | Verification of witness identifiers, cross-document timeline check, absence of police coercion disclaimers. |
| **Judicial Confession** | Sec 183 BNSS (erstwhile 164 CrPC) | Mandatory for POCSO / Rape / Heinous offenses; must be recorded by a Judicial Magistrate with statutory warning disclaimers. |
| **Seizure Mahazar / Property Form (Form 91)** | Sec 105 BNSS / TN Police Manual | Exact serial numbers, chain of custody verification, matching forensic lab (RFSL) requisition form. |
| **Medical / Post-Mortem Certificate** | Sec 193 & BSA Sec 45 | Doctor registration number, time of examination vs. occurrence, consistency with injury weapon in Seizure Mahazar. |
| **Final Report / Charge Sheet** | Sec 193 BNSS (erstwhile 173(2) CrPC) | Completeness check against 13 mandatory statutory columns, accused custody/bail status, legal section validation against BNS 2023. |

---

## 3. High-Level 5-Tier Enterprise Architecture

```mermaid
flowchart TB
    subgraph Tier1["Tier 1: Presentation (Micro-Frontend Platform)"]
        Shell["Host Shell (React 18 + Module Federation)"]
        DV["DocumentViewer Remote (PDF + OCR BBox Overlay)"]
        GA["GapAnalysis Remote (Health Score & Flag Matrix)"]
        DM["DefectMemo Remote (Interactive Legal Drafting)"]
        AD["Admin Remote (LLMOps, Prompts, Metrics)"]
    end

    subgraph Tier2["Tier 2: API Gateway & Security Perimeter"]
        GW["API Gateway / Envoy (OAuth2 / OIDC + mTLS)"]
        PII["PII Redaction Service (IndicBERT NER + Regex)"]
        WAF["AWS WAF / Shield (DDoS & Gov Perimeter)"]
    end

    subgraph Tier3["Tier 3: Agentic AI Core (LangGraph Orchestrator)"]
        LG["LangGraph State Engine"]
        CLS["1. Classifier Agent (Qwen-VL)"]
        EXT["2. Extractor Agent (Qwen-VL + Parser)"]
        VAL["3. Validator Agent (Rule Engine + RAG)"]
        RSN["4. Reasoner Agent (Contradiction Matrix)"]
        DFM["5. Defect Memo Agent (Draft Generator)"]
        MCP_Client["MCP Client Interface"]
    end

    subgraph Tier4["Tier 4: Data & Integration Layer"]
        VDB[("pgvector / Milvus (BNSS, BSA, TN Police Manual)")]
        S3[("S3 India / MinIO (Raw & Redacted Bundles)")]
        PG[("PostgreSQL 16 (Case Schemas, Logs, Scores)")]
        MCP_Server["Python MCP Server"]
        CCTNS["CCTNS / ICJS REST Gateway"]
        LegalDB["IndianKanoon / Madras HC Precedents API"]
    end

    subgraph Tier5["Tier 5: LLMOps & Observability"]
        LS["LangSmith / Phoenix (Traces & Feedback)"]
        MLF["MLflow Registry (Prompts & Model Registry)"]
        Prom["Prometheus + Grafana Dashboards"]
    end

    Shell --> GW
    DV & GA & DM & AD --> GW
    GW --> WAF --> PII --> LG
    LG --> CLS --> EXT --> VAL --> RSN --> DFM
    VAL & RSN <--> VDB
    VAL & RSN <--> MCP_Client <--> MCP_Server
    MCP_Server --> CCTNS & LegalDB
    EXT --> S3
    DFM --> PG
    LG -.-> LS & MLF & Prom
```

---

## 4. Multi-Agent Workflow & State Machine

```mermaid
stateDiagram-v2
    [*] --> Ingestion
    Ingestion --> Classify : PDF Document Pages
    Classify --> Extract : Typed Document Segments
    
    state Extraction_Quality {
        Extract --> Confidence_Check
        Confidence_Check --> Extract_Passed : Confidence >= 0.85
        Confidence_Check --> Human_OCR_Fix : Confidence < 0.85
        Human_OCR_Fix --> Extract_Passed : Clerk Verified
    }

    Extract_Passed --> Validate : Unified Case Bundle JSON
    
    state Validation_Layer {
        Validate --> Rule_Engine_Check : Deterministic Check
        Rule_Engine_Check --> RAG_Legal_Lookup : Statutory Precedents
        RAG_Legal_Lookup --> MCP_CCTNS_Query : Cross-verification
    }

    Validate --> Reason : Validation Findings & Entities
    
    state Reasoning_Layer {
        Reason --> Contradiction_Detection
        Contradiction_Detection --> Timeline_Graph_Analysis
        Timeline_Graph_Analysis --> Health_Score_Computation
    }

    Reason --> DefectMemo_Gen : Score < 85 or Critical Gaps Found
    Reason --> PreSubmission_Clearance : Score >= 85 & No Critical Gaps
    
    DefectMemo_Gen --> Judicial_Review : Draft Memo Generated
    Judicial_Review --> Final_Order_Issued : Magistrate Approves/Edits
    PreSubmission_Clearance --> [*]
    Final_Order_Issued --> [*]
```

### Agent Roster & Responsibility Matrix
1. **Classifier Agent**: Page-level visual classifier using `Qwen2-VL-72B-Instruct` / `Qwen2.5-VL-7B` recognizing Tamil headings, seal stamps, form structures (FIR Form 1, Mahazar, 180 Statement sheets).
2. **Extractor Agent**: Multimodal coordinate-aware extraction preserving exact bounding boxes (`[ymin, xmin, ymax, xmax]`), mapping handwritten/typed fields into typed Pydantic structures.
3. **Validator Agent**: Hybrid deterministic engine + LLM-RAG verifying mandatory document bundles against BNSS crime categories, police circulars, and time limitation rules (Sec 468 BNSS).
4. **Reasoner Agent**: Cross-document consistency matrix. Evaluates contradictions across:
   - *Timeline discrepancies*: FIR incident time vs. GD (General Diary) entry vs. Mahazar time.
   - *Physical weapon & injury mismatches*: Sharp-edged weapon seized vs. blunt-force trauma reported in post-mortem.
   - *Witness presence*: Witness claimed presence in Mahazar but absent in 180 BNSS list.
5. **Defect Memo Agent**: Formal judicial drafting agent generating formatted, numbered defect notifications referencing High Court circular formats and exact statutory violations.

---

## 5. Comprehensive 3-Phase Implementation Plan

```mermaid
gantt
    title Vetri 3-Phase Strategic Implementation
    dateFormat  YYYY-MM-DD
    axisFormat  %b %Y

    section Phase 1: Ingestion & VLM OCR
    Architecture Setup & Infra Scaffolding   :p1_1, 2026-10-01, 25d
    Golden Dataset & Annotation (500 cases) :p1_2, 2026-10-15, 35d
    Tamil Multilingual VLM Pipeline         :p1_3, 2026-11-01, 30d
    PII Masking & Core Pydantic Schemas     :p1_4, 2026-11-15, 25d

    section Phase 2: Multi-Agent Core & RAG
    LangGraph State Engine & 5 Agents       :p2_1, 2026-12-01, 40d
    Hybrid RAG (pgvector + BNSS/BSA/Manual) :p2_2, 2026-12-15, 35d
    Python MCP Server (CCTNS & Legal DB)    :p2_3, 2027-01-05, 30d
    Reasoning Matrix & Health Score Engine  :p2_4, 2027-01-20, 30d

    section Phase 3: MFE, Pilot & Production
    React 18 Micro-Frontend (Host + Remotes):p3_1, 2027-02-01, 40d
    Judicial HITL & Defect Memo Studio      :p3_2, 2027-02-20, 35d
    Security Hardening, DPDP & Pen Testing  :p3_3, 2027-03-15, 25d
    Chennai Pilot Deployment & Rollout Prep :p3_4, 2027-04-01, 45d
```

---

### 🚀 PHASE 1: Data Foundations, Bilingual VLM Pipeline & Ingestion Architecture
**Duration**: Weeks 1 – 9 (Oct 1 – Nov 30, 2026)  
**Objective**: Establish cloud infra, curate the 500-case Golden Dataset, implement Tamil/English Multimodal OCR with bounding box coordinates, and set up PII redaction and Pydantic schemas.

#### Workstreams & Deliverables:
1. **Infra & Security Baseline**:
   - AWS India (`ap-south-1`) EKS clusters with GPU node groups (`g5.2xlarge` / `g6e.2xlarge` for VLMs).
   - S3 bucket encryption with AWS KMS (India residency locked), PostgreSQL 16 RDS instance with `pgvector` extension enabled.
   - PII Redaction Service utilizing fine-tuned `IndicBERT-NER` + regex pipeline to redact Aadhaar, PAN, phone numbers, and victim identity (mandatory for POCSO/BNS 72).
2. **Golden Dataset Curation**:
   - Compile and anonymize 500 real/synthetic TN Police case bundles covering:
     - Theft (`Sec 303 BNS`)
     - Hurt & Assault (`Sec 115 / 117 BNS`)
     - POCSO Act & Sexual Offenses (`Sec 64 / 70 BNS`)
     - Narcotic Cases (`NDPS Act`)
   - Dual-annotated ground-truth: Page classes, OCR bounding-box transcriptions (Tamil/English), extracted entities, rule defects, and verified contradictions.
3. **Multimodal Extraction Pipeline**:
   - `Qwen2.5-VL-7B` / `Qwen2-VL-72B` vision-language integration.
   - Bounding-box normalizer and coordinate mapper (`[ymin, xmin, ymax, xmax]`) stored alongside text tokens.
   - Document Classifier handling: FIR, Scene Mahazar, 180 Statements, 183 Confessions, Seizure Memos, Medical Reports, Charge Sheets.

#### Exit Criteria & Phase Gate:
- Document classification accuracy: $\ge 96\%$.
- Tamil handwritten character recognition Word Error Rate (WER): $\le 12\%$ on clean/semi-messy scanned records.
- PII Masking Precision & Recall: $\ge 99.5\%$.
- Fully validated Pydantic models for all 7 primary police document types.

---

### ⚡ PHASE 2: Agentic Multi-Agent Core, Hybrid RAG & MCP Integration
**Duration**: Weeks 9 – 18 (Dec 1, 2026 – Jan 31, 2027)  
**Objective**: Build the 5-agent LangGraph state machine, index the statutory legal knowledge base with pgvector hybrid search, deploy the MCP server, and implement the Case Health Scoring engine.

#### Workstreams & Deliverables:
1. **LangGraph State Orchestration**:
   - State graph containing `CaseState` with deterministic conditional edges and cyclic review paths.
   - Distributed state persistence using Redis checkpointer and PostgreSQL state history.
   - Circuit breakers for LLM timeouts, retries with exponential backoff, and low-confidence human routing.
2. **Hybrid RAG Knowledge Engine**:
   - Ingestion of full bare acts (BNSS, BSA, BNS 2023), legacy cross-walk tables (CrPC $\leftrightarrow$ BNSS, IPC $\leftrightarrow$ BNS), Tamil Nadu Police Manual (Volumes 1 & 2), and Madras High Court Criminal Rules of Practice.
   - Dense retrieval using `bge-multilingual-gemma2` / `text-embedding-3-large` + Sparse retrieval (BM25) with cross-encoder re-ranking (`bge-reranker-large`).
   - Citation grounding: Every rule validation or contradiction flag strictly linked to document page, bounding box, and statutory law section.
3. **Model Context Protocol (MCP) Server**:
   - Python-based MCP server (`mcp-server-vetri`) exposing JSON-RPC tools:
     - `cctns_lookup_accused_history`: Verify prior convictions/bad character registry.
     - `tn_police_manual_rule_lookup`: Retrieve mandatory investigation procedure guidelines.
     - `kanoon_precedent_search`: Query Madras HC rulings on procedural defect curability.
     - `fsl_report_status_check`: Verify pending chemical/forensic analysis.
4. **Reasoning & Case Health Scoring Matrix**:
   - Contradiction graph builder (temporal timeline analysis, spatial location mismatches, named entity discrepancies).
   - Weighted Case Health Score Engine:
     $$\text{Score} = w_1(\text{Doc Completeness}) + w_2(\text{Procedural Compliance}) + w_3(\text{Evidentiary Consistency}) + w_4(\text{Timeline Coherence})$$

#### Exit Criteria & Phase Gate:
- Zero hallucinated legal citations in automated evaluation suite (100% citation grounding against RAG chunks).
- Agent pipeline end-to-end execution time $\le 90$ seconds for a 50-page case bundle.
- Contradiction detection precision $\ge 88\%$, recall $\ge 85\%$.

---

### 🛡️ PHASE 3: Micro-Frontend UI, Judicial HITL Workflows, CCTNS & Pilot
**Duration**: Weeks 18 – 28 (Feb 1 – Apr 30, 2027)  
**Objective**: Deliver the React 18 Module Federation frontend with interactive bounding-box overlays, Judicial Defect Memo Studio, conduct rigorous security/DPDP compliance audits, and execute shadow pilot in Chennai District Courts.

#### Workstreams & Deliverables:
1. **Module Federation (MFE) Frontend Platform**:
   - Host Shell with centralized JWT authentication, RBAC routing (Investigating Officer, Court Clerk, Magistrate/Judge, System Admin).
   - **DocumentViewer Remote**: High-performance canvas-based PDF renderer with interactive color-coded bounding box overlays linking directly to AI flags.
   - **GapAnalysis Remote**: Interactive Case Health Score gauge, hierarchical drill-down into critical/major/minor defects.
   - **DefectMemo Remote**: Rich-text legal drafting studio pre-populated with AI findings, Madras HC defect templates, one-click PDF export and e-Court dispatch.
   - **Admin Remote**: Real-time LangSmith/Phoenix trace viewer, model latency metrics, prompt registry management.
2. **Human-in-the-Loop (HITL) Checkpoints**:
   - *Clerk Triage Queue*: One-click correction interface for low-confidence OCR fields.
   - *Investigating Officer Pre-Submission QA*: Self-service pre-check for IOs before submitting physical/e-dossiers to court.
   - *Magistrate Judicial Review*: Formal review, edit, and digital signature workflow for issuing Defect Return Orders.
3. **Security, Compliance & Penetration Testing**:
   - DPDP Act 2023 compliance verification: Data localization guarantee, audit log immutability, automated data erasure protocols for closed cases.
   - Cert-In certified third-party penetration testing and vulnerability assessment.
4. **Chennai District Court Shadow Pilot**:
   - Parallel shadow testing on 1,000 real-world submissions across 5 pilot police stations (T. Nagar, Mylapore, Flower Bazaar, Anna Nagar, Guindy) and 2 Magistrate Courts.
   - Weekly stakeholder review sessions with TN Police DGP Liaison and Judicial Officers.

#### Exit Criteria & Phase Gate:
- Clerk triage efficiency increased by $> 70\%$ (processing under 8 minutes per case).
- Judicial acceptance rate of auto-drafted Defect Memos $\ge 80\%$ with minimal edits.
- Formal sign-off on DPDP compliance and security audit.

---

## 6. Detailed Data Schemas & API Specifications

### 6.1 Pydantic Unified Case State Schema (`app/schemas/state.py`)
```python
from typing import List, Dict, Any, Optional, Literal
from pydantic import BaseModel, Field
from datetime import datetime

class BoundingBox(BaseModel):
    page: int
    ymin: float
    xmin: float
    ymax: float
    xmax: float

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
        "missing_document",
        "procedural_violation",
        "timeline_contradiction",
        "evidentiary_mismatch",
        "statutory_non_compliance"
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
    fir_number: str
    police_station: str
    submission_date: datetime
    raw_pdf_s3_uri: str
    classified_pages: List[Dict[str, Any]] = Field(default_factory=list)
    extracted_entities: Dict[str, Any] = Field(default_factory=dict)
    validation_results: List[Dict[str, Any]] = Field(default_factory=list)
    contradictions: List[Dict[str, Any]] = Field(default_factory=list)
    health_score: Optional[CaseHealthScore] = None
    draft_defect_memo: Optional[str] = None
    needs_human_review: bool = False
    review_reason: Optional[str] = None
    error_stack: Optional[List[str]] = None
```

---

## 7. Risk Register & Mitigation Strategy

| Risk ID | Description & Impact | Severity | Probability | Mitigation Strategy | Owner |
|---|---|---|---|---|---|
| **RSK-01** | **Tamil Cursive Handwriting OCR Failure**: Low scan quality / ancient ink leading to misreadings. | High | Medium | Multi-VLM ensemble (`Qwen2.5-VL` + fine-tuned `TrOCR-Tamil`); automated confidence scoring with seamless Clerk manual entry fallback. | Lead AI Engineer |
| **RSK-02** | **Code-Mixing / Tanglish Nuances**: Tamil legal idioms misinterpreted by generic LLMs. | High | High | Custom Tamil legal domain fine-tuning and few-shot RAG grounding with Madras HC terminology dictionaries. | NLP Specialist |
| **RSK-03** | **Judicial Skepticism & Adoption Resistance**: Judges distrusting AI recommendations. | Critical | Medium | "AI as Assistant" model. Strict citation transparency: every assertion shows the exact PDF bounding box. Zero automatic judgments. | Product Lead / SME |
| **RSK-04** | **Legacy CrPC $\leftrightarrow$ BNSS Transition Confusion**: Offenses committed before July 1, 2024 evaluated under wrong act. | High | Low | Automated date-of-offense classifier selecting the appropriate legal schema (CrPC/IPC for prior, BNSS/BNS for post July 1, 2024). | Legal Specialist |
| **RSK-05** | **DPDP Act Compliance & PII Exposure**: Accused / POCSO victim details leaked in logs or prompts. | Critical | Low | Air-gapped IndicBERT NER PII scrubbing before any vector embedding or LLM inference. Anonymized tenant-isolated DB. | Security Architect |
| **RSK-06** | **CCTNS API Outage / Network Latency**: External police database unavailable during validation. | Medium | Medium | Circuit breaker architecture with asynchronous background task queuing and graceful degradation. | Backend Lead |

---

## 8. Repository Layout & Target Workspace Structure

```
vetri-police-cases-report-agent/
├── README.md                          # Project root documentation & quickstart
├── project-requirement.md             # Complete requirements, architecture & 3-phase plan
├── docs/                              # Comprehensive architectural specs
│   ├── 01-PROJECT-VISION.md
│   ├── 02-USE-CASES.md
│   ├── 03-STAKEHOLDERS.md
│   ├── 04-LEGAL-FRAMEWORK.md
│   ├── 05-SYSTEM-ARCHITECTURE.md
│   ├── 06-AGENTIC-AI-WORKFLOW.md
│   ├── 07-RAG-PIPELINE.md
│   ├── 08-MCP-INTEGRATION.md
│   ├── 09-FRONTEND-ARCHITECTURE.md
│   ├── 10-AI-SDLC-LLMOPS.md
│   ├── 11-DATA-SCHEMAS.md
│   ├── 12-SECURITY-COMPLIANCE.md
│   ├── 13-EVALUATION-FRAMEWORK.md
│   ├── 14-PHASED-ROADMAP.md
│   ├── 15-RISKS-MITIGATIONS.md
│   └── 16-REFERENCES.md
├── backend/                           # Python 3.11+ FastAPI & LangGraph backend
│   ├── pyproject.toml
│   ├── app/
│   │   ├── main.py                    # FastAPI entrypoint & middleware
│   │   ├── core/                      # Config, security, logging
│   │   ├── schemas/                   # Pydantic state & entity schemas
│   │   ├── agents/                    # Classifier, Extractor, Validator, Reasoner, DefectMemo
│   │   ├── rag/                       # Hybrid retriever, embeddings, pgvector
│   │   ├── mcp/                       # Model Context Protocol server & tool bindings
│   │   └── api/                       # REST endpoints (cases, health, reviews)
│   └── tests/
├── frontend/                          # React 18 Module Federation UI
│   ├── shell/                         # Host application (Routing, Auth, Shared State)
│   ├── remotes/
│   │   ├── document-viewer/           # PDF viewer with OCR bounding-box overlay
│   │   ├── gap-analysis/              # Health score & defect flags dashboard
│   │   ├── defect-memo/               # Judicial memo editor & generator
│   │   └── admin/                     # LLMOps & prompt tuning console
│   └── package.json
└── infra/                             # Infrastructure-as-Code & deployment manifests
    ├── terraform/                     # AWS ap-south-1 EKS, S3, RDS, KMS
    ├── k8s/                           # Helm charts & Kubernetes manifests
    └── docker/                        # Production multi-stage Dockerfiles
```

---
*Authored by: Senior AI Solutions Architect & Engineering Manager | Vetri Project Steering Group*
