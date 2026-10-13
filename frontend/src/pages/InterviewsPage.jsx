import React, { useState } from 'react';
import { 
  Calendar, 
  Video, 
  ExternalLink, 
  Clock, 
  User, 
  CheckCircle2, 
  Sparkles, 
  Building2,
  ChevronRight
} from 'lucide-react';

export default function InterviewsPage({ applications, drives, user, onRefresh }) {
  // Filter applications that have interview details or are in technical round
  const interviewApps = applications.filter(a => 
    a.interviewDate || a.interviewVenueOrLink || a.status === 'TECHNICAL_ROUND' || a.status === 'OA_SCHEDULED'
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Video className="w-3.5 h-3.5" />
              <span>Technical & Behavioral Assessments</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-3 text-white">
              Scheduled Candidate Interviews
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              Live roster of scheduled video interviews, technical problem-solving rounds, and Google Meet assessment rooms.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[180px]">
            <p className="text-xs uppercase font-bold text-indigo-300 tracking-wider">Scheduled Rounds</p>
            <p className="text-2xl font-black mt-1 text-white">{interviewApps.length} Rounds</p>
            <p className="text-xs text-slate-300 mt-1 font-medium">Active Assessment Queue</p>
          </div>
        </div>
      </div>

      {/* Interviews List */}
      {interviewApps.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-500" />
          <h3 className="text-base font-bold text-slate-700">No interviews currently scheduled</h3>
          <p className="text-xs mt-1">Shortlist candidate applicants from the Applicants tab to schedule technical interviews.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interviewApps.map(app => (
            <div 
              key={app.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {app.student?.user?.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Roll No: {app.student?.rollNumber} &bull; Dept: {app.student?.department} &bull; CGPA: {app.student?.cgpa}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                    {app.status}
                  </span>
                </div>

                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-slate-700 font-semibold">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    <span>{app.drive?.company?.name} &bull; {app.drive?.jobTitle}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-700">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span>
                      {app.interviewDate 
                        ? new Date(app.interviewDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
                        : 'Scheduled (Date in confirmation notice)'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-700">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>ATS Match Rating: <strong>{app.atsScore || 85}%</strong></span>
                  </div>
                </div>

                {app.remarks && (
                  <p className="text-xs text-slate-500 mt-3 font-medium">
                    Notes: {app.remarks}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center space-x-3">
                <a
                  href={app.interviewVenueOrLink || 'https://meet.google.com/interview-room'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition-all flex items-center justify-center space-x-1.5"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Video Room</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
