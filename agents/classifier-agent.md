# Agent Specification: Classifier Agent
## Vetri (வெற்றி) — Police Cases Report Agent

---

## 1. Purpose & Functional Role

The **Classifier Agent** performs first-pass visual and layout analysis on every sliced page of the ingested police case bundle. It categorizes each page into the official Tamil Nadu Police document taxonomy and groups contiguous pages into logical document units (e.g. Pages 1–3 as `FIR_Sec173_BNSS`, Pages 4–6 as `SceneMahazar_Sec105_BNSS`).

---

## 2. Input / Output Specifications

### Input Schema
```python
from pydantic import BaseModel
from typing import List

class PageImageInput(BaseModel):
    page_number: int
    image_s3_uri: str
    image_base64: Optional[str] = None
    width_px: int
    height_px: int

class ClassifierInput(BaseModel):
    case_id: str
    pages: List[PageImageInput]
```

### Output Schema
```python
from pydantic import BaseModel
from typing import List, Literal

DocCategory = Literal[
    "FIR_Sec173_BNSS",
    "SceneMahazar_Sec105_BNSS",
    "WitnessStatement_Sec180_BNSS",
    "Confession_Sec183_BNSS",
    "SeizureMahazar_Form91",
    "Medical_PostMortem_Report",
    "ChargeSheet_Sec193_BNSS",
    "ElectronicEvidenceCert_Sec63_BSA",
    "GeneralDiary_Extract",
    "RoughSketch_CrimeScene",
    "Other_Annexure"
]

class ClassifiedPageResult(BaseModel):
    page_number: int
    document_type: DocCategory
    confidence: float
    detected_language: Literal["tamil", "english", "mixed"]
    is_handwritten: bool

class ClassifiedDocumentUnit(BaseModel):
    document_type: DocCategory
    start_page: int
    end_page: int
    page_count: int
    mean_confidence: float

class ClassifierOutput(BaseModel):
    case_id: str
    classified_pages: List[ClassifiedPageResult]
    document_units: List[ClassifiedDocumentUnit]
```

---

## 3. System Prompt Template

```jinja2
You are an expert Tamil Nadu Judicial Registry Document Classifier.
Your task is to analyze the provided image of a scanned police case file page and categorize it according to the official Tamil Nadu Police & BNSS Document Taxonomy.

Taxonomy Classes:
1. FIR_Sec173_BNSS (முதல் தகவல் அறிக்கை - Form I)
2. SceneMahazar_Sec105_BNSS (சம்பவ இட மகஜர்)
3. WitnessStatement_Sec180_BNSS (சாட்சி வாக்குமூலம் - 180 BNSS / 161 CrPC)
4. Confession_Sec183_BNSS (நீதித்துறை வாக்குமூலம் - 183 BNSS / 164 CrPC)
5. SeizureMahazar_Form91 (பறிமுதல் மகஜர் / படிவம் 91)
6. Medical_PostMortem_Report (காயச் சான்றிதழ் / பிரேத பரிசோதனை அறிக்கை)
7. ChargeSheet_Sec193_BNSS (குற்றப்பத்திரிகை / இறுதி அறிக்கை - Form 173/193)
8. ElectronicEvidenceCert_Sec63_BSA (மின்னணு சான்றாவணம் 63 BSA / 65B IEA)
9. Other_Annexure (இதர ஆவணங்கள்)

Visual Layout Indicators:
- FIR: Contains Tamil Nadu Police crest, header "FIRST INFORMATION REPORT", columns for FIR No., PS, Date.
- Mahazar: Handwritten in Tamil with "சம்பவ இட பார்வை குறிப்பு / மகஜர்", witness signature blocks at the footer.
- 180 Statement: Heading "180 BNSS சாட்சிய விசாரணை", question-and-answer or narrative format.
- Charge Sheet: Standard 13-column printed format with "இறுதி அறிக்கை" and accused tables.

Output strictly in JSON:
{
  "page_number": {{ page_num }},
  "document_type": "...",
  "confidence": 0.0 - 1.0,
  "detected_language": "tamil" | "english" | "mixed",
  "is_handwritten": true | false,
  "visual_cues_identified": ["header_crest", "tamil_heading", "witness_signatures"]
}
```

---

## 4. Failure Modes & Fallback

| Failure Scenario | Trigger Condition | Automated Mitigation | Fallback Action |
|---|---|---|---|
| **Low Confidence Score** | Confidence $< 0.75$ | Re-scan page using high-contrast CLAHE filter + secondary prompt with visual layout bounding boxes. | Route to Clerk Triage Queue with highlight. |
| **Ambiguous Single Page** | Isolated page between identical document types | Apply heuristic neighborhood interpolation (e.g., Page 4 between Page 3 & 5 of 180 Statements is classified as 180 Statement). | Mark as "Heuristically Inferred". |
| **Blank / Corrupted Scan** | White level $> 98\%$ or corrupted JPEG stream | Flag page as unreadable / blank scan. | Prompt IO to re-upload missing page. |

---

## 5. Example Execution Trace

```json
{
  "case_id": "TN/CH/2026/001234",
  "classified_pages": [
    {
      "page_number": 1,
      "document_type": "FIR_Sec173_BNSS",
      "confidence": 0.98,
      "detected_language": "mixed",
      "is_handwritten": false
    },
    {
      "page_number": 2,
      "document_type": "SceneMahazar_Sec105_BNSS",
      "confidence": 0.94,
      "detected_language": "tamil",
      "is_handwritten": true
    },
    {
      "page_number": 3,
      "document_type": "WitnessStatement_Sec180_BNSS",
      "confidence": 0.91,
      "detected_language": "tamil",
      "is_handwritten": true
    }
  ],
  "document_units": [
    {"document_type": "FIR_Sec173_BNSS", "start_page": 1, "end_page": 1, "page_count": 1, "mean_confidence": 0.98},
    {"document_type": "SceneMahazar_Sec105_BNSS", "start_page": 2, "end_page": 2, "page_count": 1, "mean_confidence": 0.94},
    {"document_type": "WitnessStatement_Sec180_BNSS", "start_page": 3, "end_page": 3, "page_count": 1, "mean_confidence": 0.91}
  ]
}
```
