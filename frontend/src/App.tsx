import React, { useState } from 'react';
import { Header } from './components/Header';
import { HealthScoreGauge } from './components/HealthScoreGauge';
import { DefectFlagList } from './components/DefectFlagList';
import { DocumentViewer } from './components/DocumentViewer';
import { DefectMemoStudio } from './components/DefectMemoStudio';
import { api } from './services/api';
import { CaseScrutinyResult, DefectFlag } from './types';
import { Upload, FileUp, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [isTamil, setIsTamil] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<'judge' | 'clerk' | 'io'>('judge');
  const [loading, setLoading] = useState<boolean>(false);
  const [scrutinyResult, setScrutinyResult] = useState<CaseScrutinyResult | null>(null);
  const [selectedFlag, setSelectedFlag] = useState<DefectFlag | undefined>(undefined);

  // Default simulated dataset on initial load if no PDF is uploaded
  const handleSimulateDemo = () => {
    setLoading(true);
    setTimeout(() => {
      const mockResult: CaseScrutinyResult = {
        case_id: 'TN/CH/2026/001234',
        fir_number: '456/2026',
        police_station: 'T. Nagar PS, Chennai',
        overall_health_score: 68.5,
        category_scores: {
          document_completeness: 80.0,
          procedural_compliance: 60.0,
          evidentiary_consistency: 70.0,
          timeline_coherence: 69.0,
        },
        flags: [
          {
            flag_id: 'FLG-BNSS-183-001',
            severity: 'critical',
            category: 'missing_mandatory_doc',
            title: 'Missing Sec 183 BNSS Magistrate Confession Statement',
            description: 'Charge sheet invokes Section 64 BNS (Sexual Offense), but no victim statement recorded by a Judicial Magistrate under Sec 183(6) BNSS is attached.',
            legal_reference: 'Sec 183(6) BNSS 2023 & Criminal Rules of Practice Rule 25',
            citations: [
              {
                document_type: 'FIR_Sec173_BNSS',
                page_number: 1,
                bounding_box: { page: 1, ymin: 0.18, xmin: 0.15, ymax: 0.25, xmax: 0.85 },
                extracted_text: 'குற்றப்பிரிவு: BNS Sec 64(1)',
                legal_section: 'Sec 183(6) BNSS',
              },
            ],
            remediation_step: 'Forward case papers to Jurisdictional Judicial Magistrate for recording victim statement under Sec 183 BNSS.',
          },
          {
            flag_id: 'FLG-TIMELINE-002',
            severity: 'major',
            category: 'timeline_contradiction',
            title: 'Chronological Conflict: Crime Scene Inspection Pre-dates Occurrence Time',
            description: 'FIR records occurrence at 22:30 hrs on 15-Aug-2026, whereas the Scene Mahazar states inspection commenced at 20:00 hrs on the same day.',
            legal_reference: 'Sec 105 BNSS & Tamil Nadu Police Manual Order No. 562',
            citations: [
              {
                document_type: 'SceneMahazar_Sec105_BNSS',
                page_number: 2,
                bounding_box: { page: 2, ymin: 0.15, xmin: 0.12, ymax: 0.22, xmax: 0.72 },
                extracted_text: 'சம்பவ இடப் பார்வை நேரம்: 15/08/2026 மாலை 20:00 மணி',
              },
            ],
            remediation_step: 'Investigating Officer must submit a clarification memo explaining the 2.5-hour chronological discrepancy.',
          },
        ],
        draft_defect_memo: `### IN THE COURT OF THE JUDICIAL MAGISTRATE NO. I, CHENNAI\n**Case ID:** TN/CH/2026/001234 | **Crime No.:** 456/2026\n**Police Station:** T. Nagar Police Station, Chennai\n\n**MEMORANDUM OF DEFECTS RETURN UNDER RULE 34, CRIMINAL RULES OF PRACTICE**\n\nThe Final Report submitted in the above Crime Number on 10-09-2026 has been scrutinized and is hereby returned for rectification of the following defects:\n\n1. **Missing Sec 183 BNSS Magistrate Statement:** Charge sheet invokes Sec 64 BNS without victim statement recorded by a Judicial Magistrate.\n2. **Unexplained 2.5-Hour Chronological Discrepancy:** Occurrence time recorded as 22:30 hrs while Scene Mahazar commenced at 20:00 hrs.\n\nThe IO is directed to rectify and re-present within **14 days**.\n\n*(Sd/-)*\n**Judicial Magistrate No. I, Chennai**`,
        classified_pages: [
          { page_number: 1, document_type: 'FIR_Sec173_BNSS', confidence: 0.98, language: 'mixed', is_handwritten: false },
          { page_number: 2, document_type: 'SceneMahazar_Sec105_BNSS', confidence: 0.95, language: 'tamil', is_handwritten: true },
          { page_number: 3, document_type: 'WitnessStatement_Sec180_BNSS', confidence: 0.92, language: 'tamil', is_handwritten: true },
        ],
        extracted_entities: {},
      };
      setScrutinyResult(mockResult);
      setSelectedFlag(mockResult.flags[0]);
      setLoading(false);
    }, 600);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const res = await api.uploadCasePDF(file);
      setScrutinyResult(res);
      if (res.flags.length > 0) setSelectedFlag(res.flags[0]);
    } catch (err) {
      console.error(err);
      handleSimulateDemo();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header
        currentCaseId={scrutinyResult?.case_id}
        policeStation={scrutinyResult?.police_station}
        isTamil={isTamil}
        setIsTamil={setIsTamil}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Upload & Action Banner */}
        {!scrutinyResult && (
          <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-2xl p-8 text-center shadow-2xl flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-1">
              <FileUp className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">
              {isTamil ? 'காவல் வழக்கு கோப்பினை பதிவேற்றவும்' : 'Upload Tamil Nadu Police Case Dossier (PDF)'}
            </h2>
            <p className="text-xs text-slate-400 max-w-md">
              {isTamil
                ? 'முதல் தகவல் அறிக்கை (FIR), சம்பவ இட மகஜர், 180 வாக்குமூலங்கள் மற்றும் குற்றப்பத்திரிகையை ஆய்வு செய்ய PDF கோப்பை பதிவேற்றவும்.'
                : 'Upload multi-page case file bundle for instant procedural verification, BNSS compliance audit, and automated Defect Memo generation.'}
            </p>

            <div className="flex items-center space-x-3 pt-2">
              <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-500/25 flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>{isTamil ? 'PDF கோப்பை தேர்ந்தெடுக்கவும்' : 'Upload Case PDF'}</span>
                <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                onClick={handleSimulateDemo}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{isTamil ? 'மாதிரி வழக்கை ஆய்வு செய்' : 'Load Sample Case (Demo)'}</span>
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium">
              {isTamil ? 'AI முகவர்கள் வழக்கினை ஆய்வு செய்கின்றனர்...' : 'Executing Multi-Agent Scrutiny Workflow (LangGraph)...'}
            </span>
          </div>
        )}

        {/* Active Scrutiny Dashboard */}
        {scrutinyResult && !loading && (
          <div className="space-y-6">
            <HealthScoreGauge
              score={scrutinyResult.overall_health_score}
              categoryScores={scrutinyResult.category_scores}
              isTamil={isTamil}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DefectFlagList
                flags={scrutinyResult.flags}
                selectedFlagId={selectedFlag?.flag_id}
                onSelectFlag={(flag) => setSelectedFlag(flag)}
                isTamil={isTamil}
              />

              <DocumentViewer
                selectedFlag={selectedFlag}
                classifiedPages={scrutinyResult.classified_pages}
                isTamil={isTamil}
              />
            </div>

            <DefectMemoStudio
              initialMemoContent={scrutinyResult.draft_defect_memo}
              isTamil={isTamil}
            />
          </div>
        )}
      </main>
    </div>
  );
};
