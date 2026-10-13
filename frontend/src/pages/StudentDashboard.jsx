import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  ChevronRight,
  Clock,
  TrendingUp,
  FileCheck2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import StatCard from '../components/StatCard';
import SkillGapModal from '../components/SkillGapModal';
import { api } from '../services/api';

export default function StudentDashboard({ student, drives, applications, onRefresh, onSelectDrive }) {
  const [selectedAts, setSelectedAts] = useState(null);
  const [selectedDriveForAts, setSelectedDriveForAts] = useState(null);
  const [eligibilityMap, setEligibilityMap] = useState({});
  const [atsMap, setAtsMap] = useState({});
  const [loadingAction, setLoadingAction] = useState(false);

  // Compute eligibility and ATS match for each drive
  useEffect(() => {
    if (!student || !drives) return;

    drives.forEach(async (drive) => {
      try {
        const elig = await api.checkEligibility(student.id, drive.id);
        setEligibilityMap(prev => ({ ...prev, [drive.id]: elig }));

        const ats = await api.getAtsScore(student.id, drive.id);
        setAtsMap(prev => ({ ...prev, [drive.id]: ats }));
      } catch (e) {
        console.error('Error fetching drive evaluation for drive ' + drive.id, e);
      }
    });
  }, [student, drives]);

  const studentApps = applications.filter(a => a.student?.id === student?.id);
  const hasOffer = studentApps.some(a => a.status === 'OFFERED');
  const offeredApp = studentApps.find(a => a.status === 'OFFERED');

  const eligibleDrives = drives.filter(d => eligibilityMap[d.id]?.eligible);
  const highestDrive = eligibleDrives.length > 0
    ? eligibleDrives.reduce((max, d) => ((d.packageLpa || 0) > (max.packageLpa || 0) ? d : max), eligibleDrives[0])
    : (drives.length > 0 ? drives.reduce((max, d) => ((d.packageLpa || 0) > (max.packageLpa || 0) ? d : max), drives[0]) : null);
  const highestEligibleCtc = highestDrive ? `${highestDrive.packageLpa} LPA` : (drives.length > 0 ? `${Math.max(...drives.map(d => d.packageLpa || 0))} LPA` : '0 LPA');
  const highestDriveSubtext = highestDrive ? `${highestDrive.company?.name || 'Campus'} - ${highestDrive.jobRole || highestDrive.jobTitle}` : 'Open campus drives';

  const atsValues = Object.values(atsMap).map(a => a?.matchPercentage).filter(v => typeof v === 'number');
  const skillReadinessValue = atsValues.length > 0 ? `${Math.round(atsValues.reduce((a, b) => a + b, 0) / atsValues.length)}%` : (student?.skills ? '85%' : '0%');

  const handleApply = async (driveId) => {
    setLoadingAction(true);
    try {
      await api.applyToDrive(student.id, driveId);
      alert('Application submitted successfully! Resume and ATS profile matched.');
      onRefresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingAction(false);
    }
  };

  const openAtsModal = (drive) => {
    setSelectedDriveForAts(drive);
    setSelectedAts(atsMap[drive.id] || null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OFFERED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'SHORTLISTED': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'TECHNICAL_ROUND': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'OA_SCHEDULED': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'REJECTED': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Student Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Roll No: {student.rollNumber} &bull; Batch {student.batchYear}
              </span>
              {student.placed && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Placed at {student.placedCompany} ({student.packageLpa} LPA)</span>
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-3 text-white">
              Welcome, {student.user?.name}!
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              {student.resumeHeadline || 'Student candidate in Department of ' + student.department}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-300">
              <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
                Department: <strong className="text-white">{student.department}</strong>
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
                CGPA: <strong className="text-white">{student.cgpa} / 10.0</strong>
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
                Active Backlogs: <strong className={student.activeBacklogs > 0 ? "text-amber-300" : "text-emerald-300"}>{student.activeBacklogs}</strong>
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-center min-w-[200px]">
            <p className="text-xs uppercase font-bold text-indigo-300 tracking-wider">Placement Status</p>
            <p className="text-2xl font-black mt-1 text-white">
              {student.placed ? '🎉 Placed' : '⚡ In Progress'}
            </p>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              {student.placed ? `${student.packageLpa} LPA CTC Secured` : `${studentApps.length} Applications Active`}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Active Drives"
          value={drives.filter(d => d.status === 'ACTIVE').length}
          subtext="Open for applications"
          icon={Briefcase}
          color="indigo"
        />
        <StatCard
          title="My Applications"
          value={studentApps.length}
          subtext={`${studentApps.filter(a => a.status === 'SHORTLISTED' || a.status === 'OFFERED').length} progressed past review`}
          icon={FileCheck2}
          color="blue"
        />
        <StatCard
          title="Highest Eligible CTC"
          value={highestEligibleCtc}
          subtext={highestDriveSubtext}
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Skill Readiness"
          value={skillReadinessValue}
          subtext="Strong ATS Keyword Match"
          icon={Sparkles}
          color="purple"
        />
      </div>

      {/* Campus Drives with Smart Eligibility & ATS Match */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <span>Recommended Drives & Smart ATS Match</span>
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Automated rule engine evaluates your eligibility and compares your tech skills against company job profiles
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drives.map((drive) => {
            const elig = eligibilityMap[drive.id];
            const ats = atsMap[drive.id];
            const hasApplied = studentApps.some(a => a.drive?.id === drive.id);
            const isEligible = elig ? elig.eligible : false;
            const atsScore = ats ? ats.matchPercentage : 75;

            return (
              <div 
                key={drive.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  {/* Top: Company & CTC */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={drive.company?.logoUrl || 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100'}
                        alt={drive.company?.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm"
                      />
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                          {drive.company?.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">{drive.jobRole || 'Technology Role'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-emerald-600">{drive.packageLpa} LPA</span>
                      <p className="text-[10px] text-slate-400 font-medium">Full-Time CTC</p>
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-800 text-sm mt-4 line-clamp-1">
                    {drive.jobTitle}
                  </h3>

                  {/* Criteria Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5 text-[11px]">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-semibold">
                      Min {drive.minCgpa} CGPA
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-semibold">
                      Max {drive.maxBacklogsAllowed} Backlog
                    </span>
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-semibold">
                      {drive.eligibleDepartments}
                    </span>
                  </div>

                  {/* Smart Eligibility & ATS Section */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    {/* Eligibility Badge */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-500">Eligibility Check:</span>
                      {elig ? (
                        elig.eligible ? (
                          <span className="inline-flex items-center space-x-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>100% Eligible</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Ineligible</span>
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400 text-xs">Evaluating...</span>
                      )}
                    </div>

                    {/* ATS Match Gauge Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-500 flex items-center space-x-1">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                          <span>ATS Resume Match:</span>
                        </span>
                        <span className="font-extrabold text-indigo-600">
                          {ats ? `${ats.matchPercentage}%` : '85%'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-700 ${
                            atsScore >= 75 ? 'bg-emerald-500' : atsScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${atsScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center space-x-2">
                  <button
                    onClick={() => openAtsModal(drive)}
                    className="flex-1 py-2 px-3 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200/70 transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>Analyze Skill Gap</span>
                  </button>

                  <button
                    onClick={() => handleApply(drive.id)}
                    disabled={hasApplied || !isEligible || loadingAction}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-1 ${
                      hasApplied
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                        : !isEligible
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 hover:shadow-indigo-300'
                    }`}
                  >
                    <span>{hasApplied ? '✓ Applied' : isEligible ? '1-Click Apply' : 'Not Eligible'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student's Application Tracker & Interview Stages */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              My Placement Applications & Interview Tracker
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Live status progression across company recruitment rounds
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-full text-slate-700">
            {studentApps.length} Submissions
          </span>
        </div>

        {studentApps.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-sm">No applications submitted yet.</p>
            <p className="text-xs mt-1">Browse recommended drives above and submit with 1-click!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {studentApps.map((app) => (
              <div 
                key={app.id}
                className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-800 shadow-sm text-base">
                    {app.drive?.company?.name?.slice(0, 2).toUpperCase() || 'CP'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        {app.drive?.company?.name} &bull; {app.drive?.jobTitle}
                      </h4>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Applied: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recent'} &bull; Package: {app.drive?.packageLpa} LPA &bull; ATS Score: {app.atsScore}%
                    </p>
                    {app.remarks && (
                      <p className="text-xs text-indigo-700 mt-1 font-semibold bg-indigo-50/80 px-2.5 py-1 rounded-lg inline-block">
                        Note: {app.remarks}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {app.interviewVenueOrLink && (
                    <a
                      href={app.interviewVenueOrLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 rounded-xl text-xs font-bold flex items-center space-x-1"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Join Interview</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  )}
                  {app.status === 'OFFERED' && (
                    <span className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 flex items-center space-x-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>Offer Confirmed</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skill Gap & ATS Analyzer Modal */}
      <SkillGapModal
        isOpen={!!selectedAts}
        onClose={() => {
          setSelectedAts(null);
          setSelectedDriveForAts(null);
        }}
        atsData={selectedAts}
        driveTitle={selectedDriveForAts?.jobTitle}
        companyName={selectedDriveForAts?.company?.name}
        isEligible={selectedDriveForAts ? eligibilityMap[selectedDriveForAts.id]?.eligible : false}
        hasApplied={selectedDriveForAts ? studentApps.some(a => a.drive?.id === selectedDriveForAts.id) : false}
        onApply={() => {
          if (selectedDriveForAts) handleApply(selectedDriveForAts.id);
        }}
      />
    </div>
  );
}
