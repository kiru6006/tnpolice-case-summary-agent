# 03 — Stakeholder Ecosystem, RACI Matrix & Governance
## Vetri (வெற்றி) — Police Cases Report Agent

---

## 1. Stakeholder Landscape & Ecosystem Map

```mermaid
graph TB
    subgraph Judiciary["Judicial Wing"]
        HC["Madras High Court (e-Committee)"]
        PDJ["Principal District Judges (PDJ)"]
        JM["Judicial Magistrates (JM)"]
        Clerks["Bench Readers & Court Clerks"]
    end

    subgraph Police["Law Enforcement Wing"]
        DGP["Director General of Police (TN Police)"]
        CoP["Commissioners / SPs (District Level)"]
        DSP["Sub-Divisional Police Officers (SDPO)"]
        IO["Inspectors & Sub-Inspectors (IOs)"]
    end

    subgraph Tech_Legal["Project Steering & Technology Group"]
        Arch["Lead AI Architect & Eng Manager"]
        Sec["Cybersecurity & DPDP Compliance Team"]
        Legal["Legal Advisory Board (Retd Judges & SPs)"]
        Ops["Cloud & SRE Operations"]
    end

    subgraph Citizens["Beneficiaries & Citizens"]
        Litigants["Litigants & Under-trial Prisoners"]
        Victims["Victims & Complainants"]
    end

    HC <--> DGP
    Tech_Legal --> Judiciary
    Tech_Legal --> Police
    Judiciary --> Citizens
    Police --> Citizens
```

---

## 2. Comprehensive RACI Governance Matrix

| Lifecycle Activity | Lead AI Architect | Legal Advisory Board | Madras HC e-Committee | TN Police DGP Liaison | Judicial Officers (JMs) | Court Clerks | Sec & DPDP Lead |
|---|---|---|---|---|---|---|---|
| **Statutory Rule Definition (BNSS/BSA/BNS)** | **C** | **A / R** | **C** | **C** | **I** | **I** | **I** |
| **Golden Dataset Anonymization & Annotation** | **A / R** | **C** | **I** | **C** | **I** | **R** | **A** |
| **VLM OCR & Agent Architecture** | **A / R** | **C** | **I** | **I** | **I** | **I** | **C** |
| **RAG Knowledge Base & Prompt Engineering** | **R** | **A** | **C** | **C** | **I** | **I** | **C** |
| **Micro-Frontend UI/UX Design** | **A / R** | **I** | **C** | **C** | **C** | **R** | **I** |
| **DPDP Compliance & Pen-Testing Sign-off** | **R** | **C** | **A** | **C** | **I** | **I** | **A / R** |
| **Chennai District Pilot Execution** | **A / R** | **C** | **A** | **A** | **R** | **R** | **C** |
| **State-wide Rollout & Policy Adoption** | **C** | **I** | **A** | **A** | **R** | **R** | **I** |

*Legend: **R** = Responsible, **A** = Accountable, **C** = Consulted, **I** = Informed.*

---

## 3. Stakeholder Communication & Engagement Cadence

```mermaid
gantt
    title Stakeholder Engagement Cadence
    dateFormat  YYYY-MM-DD
    axisFormat  %b %Y

    section Bi-Weekly
    Sprint Demo & Architecture Review (Lead Arch & Tech Team) :active, s1, 2026-10-01, 180d
    
    section Monthly
    Legal Advisory Board & Statutory Alignment Review :s2, 2026-10-15, 180d
    DPDP & Security Audit Working Group :s3, 2026-10-20, 180d

    section Quarterly
    Joint Steering Committee (Madras HC e-Committee + TN Police DGP) :s4, 2026-11-01, 180d
```

### Communication Channels:
1. **Executive Steering Committee (Quarterly)**: Review KPI realization, pilot feedback, and statewide policy integration.
2. **Technical & Legal Working Group (Bi-Weekly)**: Review edge-case procedural rules, multilingual OCR accuracy, and prompt safety metrics.
3. **Court User Feedback Loops (Weekly during Pilot)**: Structured feedback sessions with court clerks and magistrates on UI ergonomics, false flag rates, and triage latency.

---

## 4. Change Management & Judicial Training Plan

To prevent adoption friction and ensure constitutional trust:
- **Phase A (Orientation)**: Hands-on workshops at the Tamil Nadu State Judicial Academy (TNSJA) demonstrating the "AI as Assistant" model and the strict bounding-box citation mechanism.
- **Phase B (Police Station Training)**: Training Investigating Officers across pilot police sub-divisions on digital scanning standards, Sec 105 BNSS electronic evidence procedures, and pre-submission QA tools.
- **Phase C (Clerk Certification)**: Standard Operating Procedure (SOP) training for Bench Readers on rapid OCR verification and automated CIS docketing.
