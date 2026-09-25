import React from 'react';
import { Scale, Globe } from 'lucide-react';

interface HeaderProps {
  currentCaseId?: string;
  policeStation?: string;
  isTamil: boolean;
  setIsTamil: (val: boolean) => void;
  activeRole: 'judge' | 'clerk' | 'io';
  setActiveRole: (role: 'judge' | 'clerk' | 'io') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCaseId,
  policeStation,
  isTamil,
  setIsTamil,
  activeRole,
  setActiveRole,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Scale className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              {isTamil ? 'வெற்றி (Vetri)' : 'Vetri (வெற்றி)'}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              BNSS 2023 Compliant
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {isTamil ? 'தமிழ்நாடு காவல் வழக்கு ஆவண ஆய்வு மற்றும் குறைபாடுகள் குறிப்பாணை முகவர்' : 'TN Police Case Scrutiny & Judicial Evaluation Agent'}
          </p>
        </div>
      </div>

      {currentCaseId && (
        <div className="hidden md:flex items-center space-x-4 px-4 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs">
          <div>
            <span className="text-slate-400">Case ID: </span>
            <span className="font-semibold text-indigo-400">{currentCaseId}</span>
          </div>
          <div className="h-3 w-px bg-slate-700" />
          <div>
            <span className="text-slate-400">Station: </span>
            <span className="font-semibold text-slate-200">{policeStation || 'T. Nagar PS'}</span>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3">
        {/* Role Switcher */}
        <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
          <button
            onClick={() => setActiveRole('judge')}
            className={`px-3 py-1 rounded-md transition ${activeRole === 'judge' ? 'bg-indigo-600 text-white font-medium shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {isTamil ? 'நீதிபதி' : 'Judge'}
          </button>
          <button
            onClick={() => setActiveRole('clerk')}
            className={`px-3 py-1 rounded-md transition ${activeRole === 'clerk' ? 'bg-indigo-600 text-white font-medium shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {isTamil ? 'எழுத்தர்' : 'Clerk'}
          </button>
          <button
            onClick={() => setActiveRole('io')}
            className={`px-3 py-1 rounded-md transition ${activeRole === 'io' ? 'bg-indigo-600 text-white font-medium shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {isTamil ? 'விசாரணை அதிகாரி' : 'IO'}
          </button>
        </div>

        {/* Language Switcher */}
        <button
          onClick={() => setIsTamil(!isTamil)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition"
        >
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <span>{isTamil ? 'English' : 'தமிழ்'}</span>
        </button>
      </div>
    </header>
  );
};
