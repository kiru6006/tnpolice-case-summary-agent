# Schema: Charge Sheet / Final Report (Sec 193 BNSS)
## Vetri (வெற்றி) — Police Cases Report Agent

---

## 1. JSON Schema Specification (Draft 2020-12)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "ChargeSheetSchema",
  "description": "JSON Schema for Police Final Report / Charge Sheet under Section 193 BNSS 2023",
  "type": "object",
  "required": [
    "charge_sheet_number",
    "case_id",
    "court_name",
    "fir",
    "accused",
    "offenses",
    "investigating_officer",
    "submission_date"
  ],
  "properties": {
    "charge_sheet_number": {
      "type": "string",
      "description": "Official police charge sheet number e.g. CS-12/2026"
    },
    "case_id": {
      "type": "string",
      "pattern": "^TN/[A-Z]{2}/\\d{4}/\\d+$",
      "description": "Unique state judicial case identifier e.g. TN/CH/2026/001234"
    },
    "court_name": {
      "type": "string",
      "description": "Designated Magistrate Court having jurisdiction"
    },
    "submission_date": {
      "type": "string",
      "format": "date"
    },
    "fir": {
      "type": "object",
      "required": ["fir_number", "police_station", "date"],
      "properties": {
        "fir_number": {"type": "string"},
        "police_station": {"type": "string"},
        "date": {"type": "string", "format": "date-time"}
      }
    },
    "accused": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["name", "father_name", "custody_status"],
        "properties": {
          "name": {"type": "string"},
          "father_name": {"type": "string"},
          "age": {"type": "integer", "minimum": 1},
          "address": {"type": "string"},
          "custody_status": {
            "type": "string",
            "enum": ["in_custody", "bail_granted", "absconding", "not_arrested"]
          }
        }
      }
    },
    "offenses": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["section", "act"],
        "properties": {
          "section": {"type": "string"},
          "act": {"type": "string", "enum": ["BNS", "IPC", "POCSO", "NDPS", "SC_ST_POA"]},
          "description": {"type": "string"}
        }
      }
    },
    "investigating_officer": {
      "type": "object",
      "required": ["name", "rank", "badge_number"],
      "properties": {
        "name": {"type": "string"},
        "rank": {"type": "string"},
        "badge_number": {"type": "string"}
      }
    }
  }
}
```

---

## 2. Valid Example JSON Payload

```json
{
  "charge_sheet_number": "CS-42/2026",
  "case_id": "TN/CH/2026/001234",
  "court_name": "Chief Judicial Magistrate, Chennai",
  "submission_date": "2026-09-10",
  "fir": {
    "fir_number": "456/2026",
    "police_station": "T. Nagar PS, Chennai",
    "date": "2026-08-15T22:30:00+05:30"
  },
  "accused": [
    {
      "name": "Suresh Babu",
      "father_name": "Krishnan",
      "age": 34,
      "address": "22 Pondy Bazaar, Chennai",
      "custody_status": "in_custody"
    }
  ],
  "offenses": [
    {
      "section": "303(2)",
      "act": "BNS",
      "description": "Punishment for theft"
    },
    {
      "section": "115(2)",
      "act": "BNS",
      "description": "Voluntarily causing hurt"
    }
  ],
  "investigating_officer": {
    "name": "Anand Kumar",
    "rank": "Inspector of Police",
    "badge_number": "IP-4521"
  }
}
```

---

## 3. Invalid Example & Validation Diagnostics

```json
{
  "charge_sheet_number": "CS-42/2026",
  "case_id": "INVALID-ID",
  "court_name": "Chief Judicial Magistrate",
  "fir": {
    "fir_number": "456/2026"
  },
  "accused": [],
  "offenses": []
}
```

### Schema Validation Errors:
- `case_id`: String does not match regex pattern `^TN/[A-Z]{2}/\d{4}/\d+$`.
- `submission_date`: Missing required property.
- `fir.police_station`: Missing required property.
- `accused`: Array must contain at least 1 item (`minItems: 1`).
- `offenses`: Array must contain at least 1 item (`minItems: 1`).
- `investigating_officer`: Missing required property.
