import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Briefcase, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  ExternalLink,
  Award,
  Clock,
  Send
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { api } from '../services/api';

export default function RecruiterDashboard({ user, drives, applications, onRefresh }) {
  const [selectedDriveId, setSelectedDriveId] = useState(drives && drives.length > 0 ? drives[0].id : null);
  const [scheduleModalApp, setScheduleModalApp] = useState(null);
  const [interviewDate, setInterviewDate] = useState(new Date(Date.now() + 86400000).toISOString().slice(0, 16));
  const [interviewLink, setInterviewLink] = useState('https://meet.google.com/interview-room');
  const [loadingAction, setLoadingAction] = useState(false);

  // Filter drives matching company if possible, or all
  const companyDrives = drives.filter(d => 
    user.name?.toLowerCase().includes(d.company?.name?.toLowerCase()) ||
    user.email?.toLowerCase().includes(d.company?.name?.toLowerCase())
  );

  const activeDrives = companyDrives.length > 0 ? companyDrives : drives;
  const currentDrive = drives.find(d => d.id === selectedDriveId) || activeDrives[0];

  const currentApplicants = applications.filter(a => a.drive?.id === currentDrive?.id);
  // Sort applicants by ATS Match Score descending
  currentApplicants.sort((a, b) => (b.atsScore || 0) - (a.atsScore || 0));

  const handleUpdateStatus = async (appId, nextStatus, remarks = null, offerLpa = null) => {
    setLoadingAction(true);
    try {
      await api.updateApplicationStatus(appId, {
        status: nextStatus,
        remarks: remarks || `Candidate advanced to ${nextStatus} stage.`,
        offerPackageLpa: offerLpa
      });
      alert(`Applicant successfully updated to ${nextStatus}!`);
      onRefresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!scheduleModalApp) return;
    setLoadingAction(true);
    try {
      await api.updateApplicationStatus(scheduleModalApp.id, {
        status: 'TECHNICAL_ROUND',
        interviewDate: interviewDate,
        interviewVenueOrLink: interviewLink,
        remarks: 'Technical Assessment & Problem Solving Interview scheduled.'
      });
      alert('Interview scheduled successfully and invitation sent to student!');
      setScheduleModalApp(null);
      onRefresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Recruiter Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center">
              <img
                src={currentDrive?.company?.logoUrl || 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100'}
                alt={currentDrive?.company?.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Talent Acquisition Lead Portal</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight mt-2 text-white">
                {currentDrive?.company?.name} Campus Hiring
              </h1>
              <p className="text-xs text-slate-300 mt-1 font-medium">
                Recruiter: <strong>{user.name}</strong> &bull; {user.email}
              </p>
            </div>
          </div>

          {/* Drive selector dropdown */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <label className="block text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-1">
              Active Job Opening
            </label>
            <select
              value={selectedDriveId || ''}
              onChange={(e) => setSelectedDriveId(Number(e.target.value))}
              className="bg-white text-slate-900 text-xs font-bold rounded-xl px-3 py-2 border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {drives.map(d => (
                <option key={d.id} value={d.id}>
                  {d.company?.name} - {d.jobTitle} ({d.packageLpa} LPA)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Recruiter Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Candidates Applied"
          value={currentApplicants.length}
          subtext="Processed by Smart ATS"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Interview Scheduled"
          value={currentApplicants.filter(a => a.status === 'TECHNICAL_ROUND').length}
          subtext="Technical video rounds"
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Offers Released"
          value={currentApplicants.filter(a => a.status === 'OFFERED').length}
          subtext={`Compensation: ${currentDrive?.packageLpa} LPA`}
          icon={Award}
          color="emerald"
        />
        <StatCard
          title="Avg ATS Compatibility"
          value={currentApplicants.length > 0 ? `${Math.round(currentApplicants.reduce((sum, a) => sum + (a.atsScore || 0), 0) / currentApplicants.length)}%` : '0%'}
          subtext="High-caliber skill matches"
          icon={Sparkles}
          color="purple"
        />
      </div>

      {/* Applicants Screening Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <span>Candidate Screening & ATS Ranked Pipeline</span>
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Candidates sorted automatically by skills compatibility with {currentDrive?.jobTitle}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
            {currentApplicants.length} Candidates Evaluated
          </span>
        </div>

        {currentApplicants.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-sm">No applications submitted for this drive yet.</p>
            <p className="text-xs mt-1">Candidate applications will appear here as students apply.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-100">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Dept / Batch</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4">ATS Match</th>
                  <th className="py-3 px-4">Skills & Profile</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4 text-right">Recruiter Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {currentApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {app.student?.user?.name}
                      <span className="block text-[10px] font-normal text-slate-400">{app.student?.rollNumber}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                        {app.student?.department} ({app.student?.batchYear})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{app.student?.cgpa}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-indigo-600 text-sm">{app.atsScore}%</span>
                        <div className="w-14 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${app.atsScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${app.atsScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-500">
                      {app.student?.skills}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        app.status === 'OFFERED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        app.status === 'TECHNICAL_ROUND' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        app.status === 'SHORTLISTED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {app.status === 'APPLIED' && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'SHORTLISTED')}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold border border-blue-200"
                          >
                            Shortlist
                          </button>
                        )}

                        {app.status === 'SHORTLISTED' && (
                          <button
                            onClick={() => setScheduleModalApp(app)}
                            className="px-2.5 py-1 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-bold border border-purple-200 flex items-center space-x-1"
                          >
                            <Calendar className="w-3 h-3" />
                            <span>Schedule Interview</span>
                          </button>
                        )}

                        {app.status === 'TECHNICAL_ROUND' && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'OFFERED', 'Offer rolled out after technical and cultural interviews.', currentDrive?.packageLpa)}
                            className="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-bold shadow-sm flex items-center space-x-1"
                          >
                            <Award className="w-3 h-3" />
                            <span>Extend Offer ({currentDrive?.packageLpa} LPA)</span>
                          </button>
                        )}

                        {app.status === 'OFFERED' && (
                          <span className="text-emerald-600 font-bold text-xs flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Offer Rolled Out</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Schedule Interview Modal */}
      {scheduleModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900">Schedule Interview Round</h3>
            <p className="text-xs text-slate-500 mt-1">
              Candidate: <strong>{scheduleModalApp.student?.user?.name}</strong> ({scheduleModalApp.student?.rollNumber})
            </p>

            <form onSubmit={handleScheduleInterview} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Interview Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Google Meet / Zoom / Venue Link
                </label>
                <input
                  type="text"
                  value={interviewLink}
                  onChange={(e) => setInterviewLink(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setScheduleModalApp(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingAction}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200"
                >
                  Confirm & Notify Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
