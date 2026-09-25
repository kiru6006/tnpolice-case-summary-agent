# Agent Specification: Extractor Agent
## Vetri (வெற்றி) — Police Cases Report Agent

---

## 1. Purpose & Functional Role

The **Extractor Agent** processes individual document segments identified by the Classifier Agent. Using vision-language models (`Qwen2.5-VL`), it extracts structured legal entities (accused profiles, offense sections, witness depositions, property schedules, timestamps) while preserving exact normalized bounding box coordinates (`[ymin, xmin, ymax, xmax]`) for every field.

---

## 2. Input / Output Specifications

### Input Schema
```python
from pydantic import BaseModel
from typing import List, Dict, Any

class ExtractorInput(BaseModel):
    case_id: str
    document_type: str
    page_slices: List[Dict[str, Any]]
```

### Output Schema
```python
from pydantic import BaseModel, Field
from typing import List, Optional

class BoundingBox(BaseModel):
    page: int
    ymin: float = Field(ge=0.0, le=1.0)
    xmin: float = Field(ge=0.0, le=1.0)
    ymax: float = Field(ge=0.0, le=1.0)
    xmax: float = Field(ge=0.0, le=1.0)

class ExtractedField(BaseModel):
    value: Any
    confidence: float
    bbox: Optional[BoundingBox] = None
    verbatim_text: str

class ExtractedFIR(BaseModel):
    fir_number: ExtractedField
    date_of_occurrence: ExtractedField
    time_of_occurrence: ExtractedField
    fir_registration_time: ExtractedField
    police_station: ExtractedField
    complainant_name: ExtractedField
    sections_invoked: List[ExtractedField]
    place_of_occurrence: ExtractedField
```

---

## 3. System Prompt Template

```jinja2
You are an expert bilingual (Tamil/English) Legal Entity Extraction Agent specializing in Tamil Nadu Police investigation reports.

Target Document Type: {{ document_type }}
Pages to Extract: {{ page_numbers }}

Instructions:
1. Extract all structured fields according to the schema for {{ document_type }}.
2. For every field, identify the exact visual bounding box coordinates on the page in normalized format [ymin, xmin, ymax, xmax] (values between 0.0 and 1.0).
3. Transcribe Tamil handwriting faithfully. For ambiguous handwriting, assign a lower confidence (<0.85).
4. Extract timestamps in strict ISO-8601 format (YYYY-MM-DDTHH:MM:SS) while recording the verbatim original string.

Expected Output Format (Strict JSON):
{
  "document_type": "{{ document_type }}",
  "fields": {
    "fir_number": {
      "value": "456/2026",
      "confidence": 0.98,
      "verbatim_text": "குற்ற எண்: 456/2026",
      "bbox": {"page": 1, "ymin": 0.12, "xmin": 0.65, "ymax": 0.15, "xmax": 0.88}
    },
    "date_time_of_occurrence": {
      "value": "2026-08-15T22:30:00+05:30",
      "confidence": 0.95,
      "verbatim_text": "சம்பவ நாள் & நேரம்: 15/08/2026 இரவு 10:30 மணி",
      "bbox": {"page": 1, "ymin": 0.22, "xmin": 0.18, "ymax": 0.25, "xmax": 0.70}
    }
  }
}
```

---

## 4. Failure Modes & Fallback

| Failure Scenario | Detection Method | Mitigation Strategy |
|---|---|---|
| **Unreadable Tamil Handwriting** | Token Confidence $< 0.70$ | Apply image sharpening + CLAHE filters; re-prompt VLM with OCR context window. |
| **Missing Expected Field (e.g. Offense Section)** | Schema validation fails | Flag as "Field Not Found in Document" and trigger Validator Agent missing field alert. |
| **Bounding Box Out of Bounds** | Coordinate validator ($ymin > ymax$) | Recalculate coordinates using connected component contours on the binary page mask. |

---

## 5. Example Execution Trace

```json
{
  "document_type": "SceneMahazar_Sec105_BNSS",
  "fields": {
    "inspection_date_time": {
      "value": "2026-08-15T20:00:00+05:30",
      "confidence": 0.92,
      "verbatim_text": "15/08/2026 மாலை 20:00 மணி",
      "bbox": {"page": 3, "ymin": 0.18, "xmin": 0.12, "ymax": 0.22, "xmax": 0.72}
    },
    "independent_witnesses": [
      {
        "value": "Murugan, S/o Ramasamy, T. Nagar",
        "confidence": 0.94,
        "verbatim_text": "சாட்சி 1: முருகன் த/பெ ராமசாமி, தி. நகர்",
        "bbox": {"page": 3, "ymin": 0.75, "xmin": 0.15, "ymax": 0.80, "xmax": 0.85}
      }
    ]
  }
}
```
