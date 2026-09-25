export interface BoundingBox {
  page: number;
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface Citation {
  document_type: string;
  page_number: number;
  bounding_box?: BoundingBox;
  extracted_text: string;
  legal_section?: string;
}

export interface DefectFlag {
  flag_id: string;
  severity: 'critical' | 'major' | 'minor' | 'info';
  category: string;
  title: string;
  description: string;
  legal_reference: string;
  citations: Citation[];
  remediation_step: string;
}

export interface CategoryScores {
  document_completeness: number;
  procedural_compliance: number;
  evidentiary_consistency: number;
  timeline_coherence: number;
}

export interface CaseHealthScore {
  overall_score: number;
  category_scores: CategoryScores;
  flags: DefectFlag[];
  generated_at: string;
  agent_version: string;
}

export interface CaseScrutinyResult {
  case_id: string;
  fir_number?: string;
  police_station?: string;
  overall_health_score: number;
  category_scores: CategoryScores;
  flags: DefectFlag[];
  draft_defect_memo: string;
  classified_pages: Array<{
    page_number: number;
    document_type: string;
    confidence: number;
    language: string;
    is_handwritten: boolean;
  }>;
  extracted_entities: any;
}
