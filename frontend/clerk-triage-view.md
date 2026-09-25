# Frontend View: Court Clerk Automated Filing & Triage
## Vetri (வெற்றி) — Police Cases Report Agent

---

## 1. Registry Scrutiny & Docketing Workflow

The **Clerk Triage View** is designed for Court Registry Staff, Bench Readers, and Chief Ministerial Officers (CMOs) receiving newly submitted police dossiers at the court filing counter.

```mermaid
sequenceDiagram
    autonumber
    actor Clerk as Court Clerk
    participant UI as Clerk Triage Remote
    participant Engine as Vetri OCR & Classification Core
    participant CIS as e-Courts CIS Gateway

    Clerk->>UI: Selects case dossier from daily filing queue
    UI->>Engine: Run Document Classifier & Tokenizer
    Engine-->>UI: Return Document Tree (FIR, Mahazar, 180s, Form 91)
    UI-->>Clerk: Highlight low-confidence OCR fields (<85% confidence)
    
    rect rgb(255, 245, 240)
        note over Clerk,UI: Clerk reviews and verifies low-confidence fields
        Clerk->>UI: Corrects transcribed Tamil name/date in inline modal
        UI->>UI: Re-calculate validation completeness
    end

    Clerk->>UI: Clicks "Export & Docket to CIS"
    UI->>CIS: Push pre-populated CIS 3.2 Case Filing JSON
    CIS-->>UI: Filing Number Acknowledged (FIL/2026/0912)
    UI-->>Clerk: Case docketing completed in < 4 minutes
```

---

## 2. Key Screen Components

1. **Document Tree & Page Indexer**: Visual thumbnail strip showing page numbers, detected document types, and thumbnail flags for missing signature blocks.
2. **Low-Confidence OCR Correction Modal**: Floating zoom-in lens displaying the raw scanned pixel crop alongside the editable transcription input.
3. **CIS 3.2 Schema Mapper**: Automated mapping of extracted police data into court registry filing fields (Complainant, Accused, Offense Sections, Remand Dates, Seized Property Serial Numbers).
