# Schema: First Information Report (Sec 173 BNSS)
## Vetri (வெற்றி) — Police Cases Report Agent

---

## 1. JSON Schema Specification (Draft 2020-12)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "FIRSchema",
  "description": "JSON Schema for First Information Report under Section 173 BNSS 2023",
  "type": "object",
  "required": [
    "fir_number",
    "police_station",
    "district",
    "date_time_occurrence",
    "date_time_registered",
    "complainant",
    "sections_invoked",
    "place_of_occurrence"
  ],
  "properties": {
    "fir_number": {
      "type": "string",
      "pattern": "^\\d+/\\d{4}$",
      "description": "FIR Number in format NUMBER/YEAR e.g. 456/2026"
    },
    "police_station": {
      "type": "string"
    },
    "district": {
      "type": "string"
    },
    "date_time_occurrence": {
      "type": "string",
      "format": "date-time"
    },
    "date_time_registered": {
      "type": "string",
      "format": "date-time"
    },
    "date_time_dispatched_magistrate": {
      "type": "string",
      "format": "date-time"
    },
    "complainant": {
      "type": "object",
      "required": ["name"],
      "properties": {
        "name": {"type": "string"},
        "father_or_husband_name": {"type": "string"},
        "contact_number": {"type": "string"},
        "address": {"type": "string"}
      }
    },
    "sections_invoked": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "string"
      }
    },
    "place_of_occurrence": {
      "type": "string"
    },
    "brief_complaint_summary": {
      "type": "string"
    }
  }
}
```

---

## 2. Valid Example JSON Payload

```json
{
  "fir_number": "456/2026",
  "police_station": "T. Nagar Police Station",
  "district": "Chennai City",
  "date_time_occurrence": "2026-08-15T22:30:00+05:30",
  "date_time_registered": "2026-08-15T23:45:00+05:30",
  "date_time_dispatched_magistrate": "2026-08-16T08:00:00+05:30",
  "complainant": {
    "name": "Ramesh Kumar",
    "father_or_husband_name": "Sundaram",
    "contact_number": "+919876543210",
    "address": "15 Usman Road, T. Nagar, Chennai"
  },
  "sections_invoked": ["303(2) BNS", "115(2) BNS"],
  "place_of_occurrence": "Near Ranganathan Street junction, T. Nagar",
  "brief_complaint_summary": "Complainant was assaulted and mobile phone along with cash was stolen by unknown individual."
}
```

---

## 3. Invalid Example & Validation Diagnostics

```json
{
  "fir_number": "INVALID_NO",
  "police_station": "T. Nagar PS",
  "date_time_occurrence": "not-a-timestamp",
  "complainant": {},
  "sections_invoked": []
}
```

### Schema Validation Errors:
- `fir_number`: String does not match regex pattern `^\d+/\d{4}$`.
- `district`: Missing required property.
- `date_time_occurrence`: Must be a valid ISO-8601 date-time string.
- `date_time_registered`: Missing required property.
- `complainant.name`: Missing required property.
- `sections_invoked`: Array must contain at least 1 item (`minItems: 1`).
- `place_of_occurrence`: Missing required property.
