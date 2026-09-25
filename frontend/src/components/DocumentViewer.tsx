import React, { useState } from 'react';
import { DefectFlag } from '../types';
import { FileText } from 'lucide-react';

interface DocumentViewerProps {
  selectedFlag?: DefectFlag;
  classifiedPages?: Array<{
    page_number: number;
    document_type: string;
    confidence: number;
    language: string;
    is_handwritten: boolean;
  }>;
  isTamil: boolean;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  selectedFlag,
  classifiedPages,
  isTamil,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const activePage = selectedFlag?.citations[0]?.page_number || currentPage;
  const bbox = selectedFlag?.citations[0]?.bounding_box;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col h-[520px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            {isTamil ? 'ஆவண பார்வை & OCR அடையாளம்' : 'Document Viewer & Bounding Box Overlay'}
          </h3>
        </div>

        {/* Page Selector */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Page {activePage} of {classifiedPages?.length || 6}</span>
          <div className="flex space-x-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, activePage - 1))}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 border border-slate-700"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(classifiedPages?.length || 6, activePage + 1))}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 border border-slate-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Canvas / Simulated Document Page with SVG Bounding Box Layer */}
      <div className="relative flex-1 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
        {/* Simulated Document Sheet */}
        <div className="relative w-full max-w-[400px] h-[380px] bg-slate-900 rounded-lg border border-slate-700/80 p-5 shadow-2xl font-mono text-[11px] text-slate-300 flex flex-col justify-between select-none">
          <div>
            <div className="text-center font-bold text-slate-100 border-b border-slate-800 pb-2 mb-3 tracking-wider text-xs">
              TAMIL NADU POLICE DEPARTMENT
              <div className="text-[10px] text-indigo-400 font-normal">
                {classifiedPages?.[activePage - 1]?.document_type || 'FIR_Sec173_BNSS'}
              </div>
            </div>

            <div className="space-y-2 text-slate-300 text-xs">
              <p><strong>District:</strong> Chennai City | <strong>PS:</strong> T. Nagar</p>
              <p><strong>Occurrence:</strong> 15/08/2026 @ 22:30 hrs</p>
              <p><strong>Offenses:</strong> Sec 303(2), 115(2), 64 BNS 2023</p>
              <p><strong>Complainant:</strong> Ramesh Kumar</p>
              <p className="text-[11px] text-slate-400 italic">
                "புகார்தாரர் கொடுத்த தகவலின் பேரில் வழக்கு பதிவு செய்யப்பட்டது..."
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-2 flex justify-between text-[10px] text-slate-500">
            <span>Conf: {(classifiedPages?.[activePage - 1]?.confidence || 0.98) * 100}%</span>
            <span>Page {activePage}</span>
          </div>

          {/* SVG Bounding Box Highlight Overlay */}
          {bbox && (
            <div
              className="absolute border-2 border-rose-500 bg-rose-500/15 rounded animate-pulse pointer-events-none transition-all duration-300"
              style={{
                top: `${bbox.ymin * 100}%`,
                left: `${bbox.xmin * 100}%`,
                width: `${(bbox.xmax - bbox.xmin) * 100}%`,
                height: `${(bbox.ymax - bbox.ymin) * 100}%`,
              }}
            >
              <span className="absolute -top-4 left-0 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded shadow">
                Defect Highlight
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
