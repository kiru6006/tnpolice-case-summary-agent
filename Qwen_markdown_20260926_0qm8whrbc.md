# NyayaSetu — AI Agent for Tamil Nadu Police Report Analysis

> *Bridging investigation and justice through intelligent document analysis.*

**NyayaSetu** is an enterprise-grade, government-compliant AI agent system that reads, evaluates, and flags procedural gaps in police investigation reports submitted by Tamil Nadu Police to the judiciary. Built on a Micro-Frontend platform and powered by Agentic AI (LangGraph + RAG + MCP), it delivers a "Case Health Score" and auto-generated Defect Memos to judges, magistrates, and court clerks.

## 🎯 Key Features

- **Multilingual VLM OCR** — Handwritten Tamil + English + Tanglish document extraction with bounding-box preservation
- **Agentic Gap Analysis** — 5 specialized agents (Classifier → Extractor → Validator → Reasoner → Defect Memo) orchestrated via LangGraph
- **RAG-Powered Legal Validation** — Grounded in BNSS/BSA/BNS, Tamil Nadu Police Manual, and Madras HC precedents
- **MCP Integration** — Secure tool access to CCTNS, IndianKanoon, and forensic lab APIs
- **Micro-Frontend Dashboard** — Module Federation-based UI for Judges, Clerks, IOs, and LLMOps admins
- **Case Health Score** — Visual completeness gauge with drill-down to exact document pages
- **DPDP Act 2023 Compliant** — India-only data residency, PII masking, audit trails, RBAC
- **AI SDLC / LLMOps** — Golden Dataset evaluation, prompt versioning, canary deployments, HITL feedback

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Module Federation (Webpack 5), RxJS, Tailwind |
| **AI Orchestration** | Python 3.11+, LangGraph, LlamaIndex, Pydantic v2 |
| **LLMs** | Qwen-VL (Tamil OCR), Claude/GPT-4 (reasoning), IndicBERT (embeddings) |
| **Vector DB** | pgvector (primary) / Milvus (scale) |
| **MCP** | Model Context Protocol server (Python) |
| **Cloud** | AWS India Region (EKS, S3, Lambda, RDS) / MeghRaj fallback |
| **Observability** | LangSmith, Arize Phoenix, Prometheus, Grafana |
| **CI/CD** | GitHub Actions, Docker, ArgoCD, Kubernetes |
| **Methodology** | SAFe 6 SASM, PI Planning, Agile Release Trains |

## 📁 Folder Structure
