import React, { useState } from 'react';
import { FileEdit, Download, CheckCircle } from 'lucide-react';

interface DefectMemoStudioProps {
  initialMemoContent?: string;
  isTamil: boolean;
}

export const DefectMemoStudio: React.FC<DefectMemoStudioProps> = ({
  initialMemoContent,
  isTamil,
}) => {
  const [memoContent, setMemoContent] = useState<string>(initialMemoContent || '');
  const [isSigned, setIsSigned] = useState<boolean>(false);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <FileEdit className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            {isTamil ? 'குறைபாடுகள் குறிப்பாணை வரைவு (Rule 34)' : 'Defect Return Memorandum Studio (Rule 34)'}
          </h3>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setIsSigned(true)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              isSigned
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{isSigned ? (isTamil ? 'கையொப்பமிடப்பட்டது' : 'Digitally Signed') : (isTamil ? 'நீதித்துறை கையொப்பம்' : 'Sign & Issue (DSC)')}</span>
          </button>

          <button
            onClick={() => alert('Exporting Defect Memo PDF...')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>{isTamil ? 'PDF பதிவிறக்கம்' : 'Export PDF'}</span>
          </button>
        </div>
      </div>

      <textarea
        value={memoContent}
        onChange={(e) => setMemoContent(e.target.value)}
        rows={8}
        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500/80 transition leading-relaxed resize-none"
        placeholder="Defect return memo content..."
      />
    </div>
  );
};
