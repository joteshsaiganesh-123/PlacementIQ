import React, { useState } from 'react';
import { 
  FileCheck2, 
  Calendar, 
  Clock, 
  Award, 
  ExternalLink, 
  Sparkles, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Building2,
  Search
} from 'lucide-react';

export default function ApplicationsTrackerPage({ applications, currentRole, student, onRefresh }) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // If Student, filter to this student's apps; otherwise all
  const relevantApps = currentRole === 'STUDENT'
    ? applications.filter(a => a.student?.id === student?.id || a.student?.user?.id === student?.user?.id)
    : applications;

  const filteredApps = relevantApps.filter(a => {
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchesSearch = 
      a.drive?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.drive?.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.student?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.student?.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OFFERED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">🎉 Offer Extended</span>;
      case 'SHORTLISTED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">✓ Shortlisted for OA</span>;
      case 'TECHNICAL_ROUND':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">💻 Technical / HR Interview</span>;
      case 'OA_SCHEDULED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">⏱️ Online Assessment Scheduled</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">✕ Application Closed</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">⏳ Under Initial Review</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Recruitment Lifecycle Management</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-3 text-white">
              {currentRole === 'STUDENT' ? 'My Placement Applications' : 'Campus Placement Applications'}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              Track candidate submissions, automated ATS screening ratings, scheduled interview stages, and extended compensation offers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 min-w-[240px]">
            <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-indigo-300">Total Applied</span>
              <p className="text-xl font-black text-white">{relevantApps.length}</p>
            </div>
            <div className="bg-emerald-500/20 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-500/30 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-300">Offers Extended</span>
              <p className="text-xl font-black text-emerald-300">
                {relevantApps.filter(a => a.status === 'OFFERED').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by company, role, or candidate name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {['ALL', 'OFFERED', 'SHORTLISTED', 'TECHNICAL_ROUND', 'APPLIED', 'REJECTED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Applications' : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
          <FileCheck2 className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-500" />
          <h3 className="text-base font-bold text-slate-700">No applications match your filter criteria</h3>
          <p className="text-xs mt-1">Check back once campus drives are applied to or adjust your search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map(app => (
            <div 
              key={app.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start sm:items-center space-x-4">
                <img
                  src={app.drive?.company?.logoUrl || 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100'}
                  alt={app.drive?.company?.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm flex-shrink-0"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {app.drive?.company?.name} &bull; {app.drive?.jobTitle}
                    </h3>
                    {getStatusBadge(app.status)}
                  </div>

                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    {currentRole !== 'STUDENT' && (
                      <span className="font-bold text-slate-800 mr-2">
                        Candidate: {app.student?.user?.name} ({app.student?.rollNumber} &bull; {app.student?.department}) &bull;
                      </span>
                    )}
                    Applied: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recent'} &bull; Package: <strong className="text-emerald-700">{app.drive?.packageLpa} LPA</strong>
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-100 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Smart ATS Match: {app.atsScore || 85}%</span>
                    </span>

                    {app.interviewDate && (
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-100 flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Round Scheduled: {new Date(app.interviewDate).toLocaleString()}</span>
                      </span>
                    )}
                  </div>

                  {app.remarks && (
                    <p className="text-xs text-slate-600 mt-2 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100 inline-block">
                      Note from Recruiter: {app.remarks}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 self-end sm:self-center">
                {app.interviewVenueOrLink && (
                  <a
                    href={app.interviewVenueOrLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition-all flex items-center space-x-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Join Video Interview</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                )}

                {app.status === 'OFFERED' && (
                  <div className="text-right">
                    <span className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 flex items-center space-x-1">
                      <Award className="w-4 h-4" />
                      <span>Offer Letter Issued ({app.offerPackageLpa || app.drive?.packageLpa} LPA)</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
