# Schema: Witness Statement (Sec 180 BNSS)
## Vetri (வெற்றி) — Police Cases Report Agent

---

## 1. JSON Schema Specification (Draft 2020-12)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WitnessStatementSchema",
  "description": "JSON Schema for Police Witness Examination under Section 180 BNSS 2023 (erstwhile 161 CrPC)",
  "type": "object",
  "required": [
    "statement_id",
    "witness_name",
    "statement_date",
    "investigating_officer",
    "bnss_section",
    "statement_content_tamil"
  ],
  "properties": {
    "statement_id": {
      "type": "string"
    },
    "witness_name": {
      "type": "string"
    },
    "father_or_husband_name": {
      "type": "string"
    },
    "age": {
      "type": "integer",
      "minimum": 1
    },
    "address": {
      "type": "string"
    },
    "witness_category": {
      "type": "string",
      "enum": ["eye_witness", "mahazar_witness", "expert_witness", "formal_police_witness"]
    },
    "statement_date": {
      "type": "string",
      "format": "date"
    },
    "place_of_examination": {
      "type": "string"
    },
    "bnss_section": {
      "type": "string",
      "const": "180"
    },
    "statement_content_tamil": {
      "type": "string",
      "description": "Original transcribed Tamil witness deposition"
    },
    "statement_summary_english": {
      "type": "string",
      "description": "English translated summary for judicial review"
    },
    "is_audio_video_recorded": {
      "type": "boolean"
    }
  }
}
```

---

## 2. Valid Example JSON Payload

```json
{
  "statement_id": "WS-01-456/2026",
  "witness_name": "Vijay",
  "father_or_husband_name": "Karthik",
  "age": 28,
  "address": "45 Pondy Bazaar, T. Nagar, Chennai",
  "witness_category": "eye_witness",
  "statement_date": "2026-08-16",
  "place_of_examination": "T. Nagar Police Station",
  "bnss_section": "180",
  "statement_content_tamil": "15-08-2026 அன்று இரவு 10:30 மணியளவில் நான் உஸ்மான் சாலையில் நின்றுகொண்டிருந்தபோது, எதிரி சுரேஷ் பாபு என்பவர் புகார்தாரரை தாக்கி கைபேசியை பறித்துச் சென்றதை நேரில் பார்த்தேன்.",
  "statement_summary_english": "Witness states he was present at Usman Road at 22:30 hrs on 15-08-2026 and witnessed accused Suresh Babu assault complainant and snatch mobile phone.",
  "is_audio_video_recorded": true
}
```

---

## 3. Invalid Example & Validation Diagnostics

```json
{
  "statement_id": "WS-01",
  "witness_name": "Vijay",
  "bnss_section": "161",
  "statement_date": "invalid-date"
}
```

### Schema Validation Errors:
- `bnss_section`: Value must be `"180"` under modern BNSS schema (legacy 161 CrPC must be flagged).
- `statement_date`: Must be a valid format `"YYYY-MM-DD"`.
- `investigating_officer`: Missing required property.
- `statement_content_tamil`: Missing required property.
