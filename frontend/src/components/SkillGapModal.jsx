import React from 'react';
import { X, CheckCircle2, AlertCircle, Sparkles, BookOpen, Target, ArrowRight } from 'lucide-react';

export default function SkillGapModal({ isOpen, onClose, atsData, driveTitle, companyName, onApply, isEligible, hasApplied }) {
  if (!isOpen || !atsData) return null;

  const score = atsData.matchPercentage || 0;
  const isHighMatch = score >= 75;
  const isModerate = score >= 50 && score < 75;

  const getScoreColor = () => {
    if (isHighMatch) return 'text-emerald-600 border-emerald-500 bg-emerald-50';
    if (isModerate) return 'text-amber-600 border-amber-500 bg-amber-50';
    return 'text-rose-600 border-rose-500 bg-rose-50';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg leading-snug">Smart ATS & Skill Gap Analyzer</h3>
              <p className="text-xs text-slate-500">{companyName} &bull; {driveTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* ATS Match Score Card */}
          <div className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl text-white shadow-inner">
            <div>
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Automated ATS Match Score</span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-4xl font-extrabold tracking-tight">{score}%</span>
                <span className="text-sm text-indigo-200">Compatibility</span>
              </div>
              <p className="text-xs text-indigo-200 mt-2 font-medium flex items-center space-x-1">
                <Target className="w-3.5 h-3.5" />
                <span>{atsData.readinessLevel}</span>
              </p>
            </div>
            <div className="relative flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="32" stroke="#334155" strokeWidth="6" fill="transparent" />
                <circle
                  cx="40" cy="40" r="32"
                  stroke={isHighMatch ? '#10b981' : isModerate ? '#f59e0b' : '#f43f5e'}
                  strokeWidth="6"
                  strokeDasharray="201"
                  strokeDashoffset={201 - (201 * score) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <span className="absolute text-sm font-bold">{Math.round(score)}%</span>
            </div>
          </div>

          {/* Matched Skills */}
          <div>
            <div className="flex items-center space-x-2 mb-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Matching Competencies ({atsData.matchingSkills?.length || 0})
              </h4>
            </div>
            {atsData.matchingSkills && atsData.matchingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {atsData.matchingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                  >
                    <span>✓</span>
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No matching keywords found in student profile.</p>
            )}
          </div>

          {/* Missing Skills / Skills to Brush Up */}
          <div>
            <div className="flex items-center space-x-2 mb-2.5">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Recommended Skills to Prepare ({atsData.missingSkills?.length || 0})
              </h4>
            </div>
            {atsData.missingSkills && atsData.missingSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {atsData.missingSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80"
                  >
                    <span>+</span>
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-emerald-600 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                🎉 Excellent! You cover all required core skills for this position.
              </p>
            )}
          </div>

          {/* AI / Smart Guidance */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4">
            <div className="flex items-center space-x-2 mb-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h5 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Interview Preparation Strategy</h5>
            </div>
            <p className="text-xs text-indigo-900 leading-relaxed font-medium">
              {atsData.recommendation}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
          {onApply && (
            <button
              onClick={() => {
                onClose();
                onApply();
              }}
              disabled={hasApplied || !isEligible}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 ${
                hasApplied
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none'
                  : !isEligible
                  ? 'bg-rose-100 text-rose-700 cursor-not-allowed shadow-none'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-indigo-300'
              }`}
            >
              <span>{hasApplied ? 'Already Applied' : isEligible ? 'Apply to this Drive Now' : 'Not Eligible'}</span>
              {!hasApplied && isEligible && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
