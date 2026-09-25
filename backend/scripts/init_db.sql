-- Initialize pgvector and core database schemas for Vetri
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for legal statutory knowledge chunks (BNSS, BSA, BNS, Police Manual)
CREATE TABLE IF NOT EXISTS legal_knowledge_chunks (
    chunk_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    act_name VARCHAR(64) NOT NULL,
    chapter_num VARCHAR(32),
    section_num VARCHAR(32) NOT NULL,
    sub_section VARCHAR(32),
    marginal_heading TEXT NOT NULL,
    chunk_text TEXT NOT NULL,
    chunk_text_tamil TEXT,
    chunk_vector vector(1536),
    is_mandatory BOOLEAN DEFAULT FALSE,
    crime_category VARCHAR(64)[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for case scrutinies
CREATE TABLE IF NOT EXISTS case_scrutinies (
    case_id VARCHAR(64) PRIMARY KEY,
    fir_number VARCHAR(64) NOT NULL,
    police_station VARCHAR(128) NOT NULL,
    overall_health_score NUMERIC(5, 2) NOT NULL,
    category_scores JSONB NOT NULL,
    extracted_entities JSONB NOT NULL,
    validation_flags JSONB NOT NULL,
    contradictions JSONB NOT NULL,
    draft_defect_memo TEXT,
    status VARCHAR(32) DEFAULT 'COMPLETED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for cryptographic audit logs
CREATE TABLE IF NOT EXISTS scrutiny_audit_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id VARCHAR(64) NOT NULL,
    actor_id VARCHAR(64) NOT NULL,
    actor_role VARCHAR(32) NOT NULL,
    action_type VARCHAR(64) NOT NULL,
    action_payload JSONB NOT NULL,
    record_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
