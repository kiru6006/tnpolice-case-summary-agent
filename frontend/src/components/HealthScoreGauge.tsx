import React from 'react';
import { CategoryScores } from '../types';
import { Clock, ShieldCheck, FileCheck } from 'lucide-react';

interface HealthScoreGaugeProps {
  score: number;
  categoryScores?: CategoryScores;
  isTamil: boolean;
}

export const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({
  score,
  categoryScores,
  isTamil,
}) => {
  const getScoreColor = (val: number) => {
    if (val >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (val >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getStrokeColor = (val: number) => {
    if (val >= 85) return '#10b981';
    if (val >= 60) return '#f59e0b';
    return '#f43f5e';
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>{isTamil ? 'வழக்கு ஆய்வு தரமதிப்பீடு' : 'Case Scrutiny Health Score'}</span>
        </h3>
        <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${getScoreColor(score)}`}>
          {score >= 85 ? (isTamil ? 'தாக்கல் செய்ய தகுதியானது' : 'Ready for Filing') : (isTamil ? 'குறைபாடுகள் உள்ளன' : 'Defects Found')}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        {/* Radial Gauge */}
        <div className="relative flex flex-col items-center justify-center col-span-2">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="40"
              stroke="#1e293b"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r="40"
              stroke={getStrokeColor(score)}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-white">{score}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">/ 100</span>
          </div>
        </div>

        {/* Category Breakdown */}
        {categoryScores && (
          <div className="col-span-3 space-y-2.5">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isTamil ? 'ஆவண முழுமை' : 'Doc Completeness'}</span>
                </span>
                <span className="font-semibold text-slate-200">{categoryScores.document_completeness}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${categoryScores.document_completeness}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isTamil ? 'நடைமுறை இணக்கம்' : 'Procedural Rules'}</span>
                </span>
                <span className="font-semibold text-slate-200">{categoryScores.procedural_compliance}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${categoryScores.procedural_compliance}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isTamil ? 'காலவரிசை சீர்மை' : 'Timeline Coherence'}</span>
                </span>
                <span className="font-semibold text-slate-200">{categoryScores.timeline_coherence}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${categoryScores.timeline_coherence}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
