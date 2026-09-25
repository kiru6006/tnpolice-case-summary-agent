# ROLE & CONTEXT

You are a senior AI/ML architect and technical writer helping me (Kirubakaran Srinivasan, Sr. Engineering Manager with 17+ years experience, currently pursuing M.Sc. in AI/ML at Christ University) build a complete documentation and project scaffold for a government-grade AI system.

# PROJECT: "NyayaSetu" — AI Agent for Tamil Nadu Police Report Analysis & Judicial Evaluation

## Problem Statement
Build an AI agent system that:
1. Reads police investigation reports (FIR, Scene Mahazar, 180 BNSS witness statements, 183 BNSS confessions, Seizure Mahazar, Medical/Post-Mortem reports, Charge Sheet under Sec 193 BNSS) submitted by Tamil Nadu Police to courts.
2. Evaluates the reports on all procedural, evidentiary, and logical aspects.
3. Flags missing documents, contradictions, procedural gaps, and critical deficiencies.
4. Generates a "Case Health Score" and draft Defect Memos for judges/magistrates.
5. Must handle bilingual (Tamil + English) handwritten and typed documents.
6. Must comply with India's DPDP Act 2023, BNSS/BSA/BNS (effective July 1, 2024), and Tamil Nadu Police Manual.

## My Existing AI Agent Experience (Reference Patterns)
I have already built these agents — use them as architectural references:
- `cardio-discharge-summary-ai-agent` (Python) — messy clinical document extraction
- `hr-issues-classifier-agent` (TypeScript) — classification + routing
- `university-management-agent` (TypeScript) — multi-domain state management
- `rare-disease-patient-finding-agent` (Python) — anomaly/gap detection

GitHub: https://github.com/kiru6006

## Tech Stack Decisions (Locked)
- **Frontend**: React + TypeScript + Module Federation (Micro-Frontend)
- **AI Orchestration**: Python + LangGraph (Agentic AI)
- **RAG**: LlamaIndex + pgvector/Milvus
- **MCP**: Model Context Protocol for external tool integration (CCTNS, legal databases)
- **LLMs**: Qwen-VL / LLaVA for Tamil OCR, Claude/GPT-4 for reasoning, Indian legal LLM fine-tunes
- **Cloud**: AWS India Region / GCP India Region / MeghRaj (Govt Cloud)
- **Observability**: LangSmith / Arize / MLflow
- **CI/CD**: GitHub Actions + Docker + Kubernetes (EKS/GKE)
- **Methodology**: SAFe 6 SASM, PI Planning

---

# YOUR TASK

Generate a complete project scaffold as a set of **markdown files** organized under a folder structure. Each file must be production-quality, detailed, and actionable for an engineering team to start building.

## Required Folder Structure & Files
