import React, { useState } from 'react';
import { DefectFlag } from '../types';
import { AlertCircle, AlertTriangle, Info, ArrowRight, BookOpen } from 'lucide-react';

interface DefectFlagListProps {
  flags: DefectFlag[];
  selectedFlagId?: string;
  onSelectFlag: (flag: DefectFlag) => void;
  isTamil: boolean;
}

export const DefectFlagList: React.FC<DefectFlagListProps> = ({
  flags,
  selectedFlagId,
  onSelectFlag,
  isTamil,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredFlags = flags.filter((f) => {
    if (filterSeverity === 'all') return true;
    return f.severity === filterSeverity;
  });

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'major':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-400 shrink-0" />;
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'critical':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'major':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col h-[520px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">
            {isTamil ? 'கண்டறியப்பட்ட குறைபாடுகள்' : 'Scrutiny Defect Flags'}
          </h3>
          <p className="text-xs text-slate-400">
            {flags.length} {isTamil ? 'குறைபாடுகள் கண்டறியப்பட்டன' : 'issues flagged across case bundle'}
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex space-x-1 text-[11px] bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          {['all', 'critical', 'major', 'minor'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2 py-0.5 rounded-md capitalize transition ${filterSeverity === sev ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Flag Items List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
        {filteredFlags.map((flag) => {
          const isSelected = selectedFlagId === flag.flag_id;
          return (
            <div
              key={flag.flag_id}
              onClick={() => onSelectFlag(flag)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-indigo-500/80 shadow-md shadow-indigo-500/10'
                  : 'bg-slate-800/40 border-slate-750 hover:bg-slate-800/70 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center space-x-2">
                  {getSeverityIcon(flag.severity)}
                  <span className="text-xs font-semibold text-slate-100 line-clamp-1">{flag.title}</span>
                </div>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-bold ${getSeverityBadge(flag.severity)}`}>
                  {flag.severity}
                </span>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 mb-2 leading-relaxed">{flag.description}</p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/50">
                <span className="flex items-center space-x-1 text-indigo-300 font-medium">
                  <BookOpen className="w-3 h-3" />
                  <span>{flag.legal_reference}</span>
                </span>
                <span className="flex items-center space-x-1 text-slate-400 hover:text-indigo-400 transition">
                  <span>Page {flag.citations[0]?.page_number || 1}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}

        {filteredFlags.length === 0 && (
          <div className="h-full flex items-center justify-center text-xs text-slate-500">
            {isTamil ? 'இந்த பிரிவில் குறைபாடுகள் இல்லை' : 'No defects found matching this filter.'}
          </div>
        )}
      </div>
    </div>
  );
};
