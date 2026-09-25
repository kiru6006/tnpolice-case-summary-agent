# 02 — User Personas & Use Case Specifications
## Vetri (வெற்றி) — Police Cases Report Agent

---

## 1. Persona Matrix

```mermaid
graph TD
    User["Case Bundle Ingestion"] --> IO["1. Investigating Officer (IO)<br/>Police Station Level"]
    User --> Clerk["2. Court Clerk / Bench Reader<br/>Registry & Filing Counter"]
    User --> Judge["3. Judicial Magistrate / Judge<br/>Judicial Scrutiny Bench"]
    User --> Prosecutor["4. Assistant Public Prosecutor (APP)<br/>Prosecution Directorate"]
```

---

## 2. Deep-Dive Use Case Specifications

### Use Case 1: Investigating Officer (IO) — Pre-Submission QA

| Attribute | Specification |
|---|---|
| **Primary Actor** | Sub-Inspector / Inspector of Police (Investigating Officer, TN Police) |
| **Current Pain Point** | Physical submission of charge sheets often results in embarrassing defect returns weeks later due to missing mandatory annexures (e.g., FSL report requisition, Sec 105 BNSS videography certificate, or delay explanation). |
| **Vetri AI Solution** | Self-service web interface where the IO uploads the digitized case bundle prior to court submission. Vetri runs instantaneous procedural validation, highlighting missing attachments and statutory timeline issues. |
| **Frequency** | 10–25 times per month per police station. |

```mermaid
sequenceDiagram
    autonumber
    actor IO as Investigating Officer
    participant Vetri as Vetri Pre-Submission QA
    participant Engine as LangGraph Scrutiny Engine
    participant DB as Police Station Staging DB

    IO->>Vetri: Uploads digitized case PDF bundle (FIR to Charge Sheet)
    Vetri->>Engine: Run Tier-1 Procedural Validation
    Engine-->>Vetri: Case Health Score (e.g. 74/100) + Missing Sec 105 Videography Cert
    Vetri-->>IO: Display Pre-Submission Defect Checklist
    IO->>Vetri: Uploads missing Form 91 & Sec 105 Certificate
    Vetri->>Engine: Re-evaluate bundle
    Engine-->>Vetri: Updated Health Score (96/100 - Ready for Filing)
    Vetri->>IO: Issue Green Clearance Certificate for Court Registry
```

#### Acceptance Criteria:
- System returns initial pre-submission health audit within 60 seconds for bundles up to 100 pages.
- Flags all missing mandatory documents specified under Chapter XII of the TN Police Manual.
- Generates a timestamped "Pre-Submission Verification Summary" printable by the IO.

---

### Use Case 2: Court Clerk — Automated Docketing & Filing Triage

| Attribute | Specification |
|---|---|
| **Primary Actor** | Bench Reader / Chief Ministerial Officer (CMO) / Filing Clerk |
| **Current Pain Point** | Hundreds of physical pages must be verified for correct pagination, FIR section alignment with Charge Sheet, witness count matching 180 statements, and property schedule consistency. Takes 40+ minutes per case. |
| **Vetri AI Solution** | Automated document categorization, OCR verification, and structured entity extraction. Automatically populates CIS (Case Information System) metadata fields and creates a visual filing audit checklist. |
| **Frequency** | 20–60 case bundles daily at the filing counter. |

```mermaid
sequenceDiagram
    autonumber
    actor Clerk as Court Filing Clerk
    participant UI as Clerk Triage Remote (MFE)
    participant Core as Vetri Ingestion & OCR Pipeline
    participant CIS as e-Courts / CIS Gateway

    Clerk->>UI: Selects case bundle for scrutiny
    UI->>Core: Trigger Layout OCR & Entity Extraction
    Core-->>UI: Display Document Index + OCR Bounding Box Overlay
    Note over UI,Clerk: Clerk verifies highlighted low-confidence dates/names (<85% conf)
    Clerk->>UI: Confirms/edits flagged OCR tokens
    UI->>CIS: Pre-populate Accused list, Offenses, and Witness counts
    UI-->>Clerk: Docketing complete in < 4 minutes
```

#### Acceptance Criteria:
- Automatic classification of multi-page bundles into individual documents (FIR, Mahazar, 180 Statements, Medical Reports) with $\ge 96\%$ accuracy.
- Bounding-box highlight on hover for every extracted field in the side-by-side PDF viewer.
- Direct JSON export compatible with e-Courts CIS 3.2 schema.

---

### Use Case 3: Judicial Magistrate / Judge — Judicial Scrutiny & Gap Analysis

| Attribute | Specification |
|---|---|
| **Primary Actor** | Judicial Magistrate / Sessions Judge |
| **Current Pain Point** | Identifying subtle evidentiary contradictions (e.g., weapon in post-mortem vs. weapon seized, or 2-hour unexplained delay in FIR dispatch) requires reading hundreds of handwritten pages under tight time constraints. |
| **Vetri AI Solution** | High-level Judicial Dashboard showing the Case Health Score, grouped defect flags (Critical, Major, Minor), and a pre-drafted Defect Return Memo ready for judicial edit and digital signature. |
| **Frequency** | Daily during cognizance and preliminary scrutiny sessions. |

```mermaid
sequenceDiagram
    autonumber
    actor Judge as Judicial Magistrate
    participant Dash as Judge Dashboard (MFE)
    participant Core as Reasoner & Defect Memo Agent
    participant Orders as Judicial Order Management

    Judge->>Dash: Opens Case Docket (TN/CH/2026/001234)
    Dash-->>Judge: Displays Case Health Score (68/100) + 2 Critical Deficiencies
    Judge->>Dash: Clicks "Critical Flag: Timeline Mismatch"
    Dash-->>Judge: Side-by-side view (FIR Time 22:00 vs Mahazar Time 20:00 highlighted)
    Judge->>Dash: Clicks "Generate Defect Return Memo"
    Dash->>Core: Request Draft Memo in High Court Standard Format
    Core-->>Dash: Formatted Draft Defect Memo with BNSS Citations
    Judge->>Dash: Makes minor judicial remark & signs digitally
    Dash->>Orders: Dispatches formal Defect Return Order to Police Station
```

#### Acceptance Criteria:
- 100% of defect flags link directly to exact document pages, bounding boxes, and statutory sections.
- Draft Defect Memo generated in compliant Madras High Court format with zero hallucinated section numbers.
- One-click approval or modification workflow for judicial officers.

---

### Use Case 4: Assistant Public Prosecutor (APP) — Case Strength & Evidentiary Risk Analyzer

| Attribute | Specification |
|---|---|
| **Primary Actor** | Assistant Public Prosecutor / Public Prosecutor |
| **Current Pain Point** | Evaluating charge sheets before trial to identify evidentiary vulnerabilities that defense counsel could exploit (e.g., absence of independent witnesses in search mahazar under Sec 105 BNSS). |
| **Vetri AI Solution** | Evidentiary matrix analyzing witness corroboration, chain-of-custody gaps, and forensic consistency before framing of charges. |
| **Frequency** | Prior to cognizance arguments and charge framing hearings. |

```mermaid
graph LR
    A[Charge Sheet Bundle] --> B[Vetri Evidentiary Matrix]
    B --> C1[Witness Corroboration Map]
    B --> C2[Chain of Custody Timeline]
    B --> C3[Forensic & Medical Consistency]
    C1 & C2 & C3 --> D[Prosecution Risk Summary Report]
```

#### Acceptance Criteria:
- Maps all witness statements under Sec 180 BNSS against specific accused overt acts.
- Flags uncorroborated material facts and chain of custody gaps in property seized.
