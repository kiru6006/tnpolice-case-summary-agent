# Schema: Case Health Score & Defect Flags
## Vetri (வெற்றி) — Police Cases Report Agent

---

## 1. JSON Schema Specification (Draft 2020-12)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "CaseHealthScoreSchema",
  "description": "JSON Schema for Vetri Case Scrutiny Health Score & Defect Flags",
  "type": "object",
  "required": [
    "case_id",
    "overall_score",
    "category_scores",
    "flags",
    "generated_at",
    "agent_version"
  ],
  "properties": {
    "case_id": {
      "type": "string"
    },
    "overall_score": {
      "type": "number",
      "minimum": 0,
      "maximum": 100
    },
    "category_scores": {
      "type": "object",
      "required": [
        "document_completeness",
        "procedural_compliance",
        "evidentiary_consistency",
        "timeline_coherence"
      ],
      "properties": {
        "document_completeness": {"type": "number", "minimum": 0, "maximum": 100},
        "procedural_compliance": {"type": "number", "minimum": 0, "maximum": 100},
        "evidentiary_consistency": {"type": "number", "minimum": 0, "maximum": 100},
        "timeline_coherence": {"type": "number", "minimum": 0, "maximum": 100}
      }
    },
    "flags": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["flag_id", "severity", "category", "title", "description", "legal_reference", "citations"],
        "properties": {
          "flag_id": {"type": "string"},
          "severity": {
            "type": "string",
            "enum": ["critical", "major", "minor", "info"]
          },
          "category": {"type": "string"},
          "title": {"type": "string"},
          "description": {"type": "string"},
          "legal_reference": {"type": "string"},
          "citations": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["document_type", "page_number"],
              "properties": {
                "document_type": {"type": "string"},
                "page_number": {"type": "integer", "minimum": 1},
                "bounding_box": {
                  "type": "object",
                  "properties": {
                    "page": {"type": "integer"},
                    "ymin": {"type": "number"},
                    "xmin": {"type": "number"},
                    "ymax": {"type": "number"},
                    "xmax": {"type": "number"}
                  }
                },
                "extracted_snippet": {"type": "string"}
              }
            }
          },
          "remediation_guidance": {"type": "string"}
        }
      }
    },
    "generated_at": {
      "type": "string",
      "format": "date-time"
    },
    "agent_version": {
      "type": "string"
    }
  }
}
```

---

## 2. Valid Example JSON Payload

```json
{
  "case_id": "TN/CH/2026/001234",
  "overall_score": 72.4,
  "category_scores": {
    "document_completeness": 80.0,
    "procedural_compliance": 65.0,
    "evidentiary_consistency": 72.0,
    "timeline_coherence": 72.5
  },
  "flags": [
    {
      "flag_id": "FLG-001",
      "severity": "critical",
      "category": "missing_document",
      "title": "Missing Sec 105 BNSS Search & Seizure Video Hash",
      "description": "Seizure Mahazar indicates seizure of weapon but electronic video hash certificate is not annexed.",
      "legal_reference": "Sec 105 BNSS 2023",
      "citations": [
        {
          "document_type": "SeizureMahazar_Form91",
          "page_number": 5,
          "extracted_snippet": "பறிமுதல் செய்யப்பட்ட இரும்பு கம்பி"
        }
      ],
      "remediation_guidance": "Enclose Sec 105 BNSS videography media hash and certificate."
    }
  ],
  "generated_at": "2026-09-26T00:52:00Z",
  "agent_version": "v1.0.0"
}
```
