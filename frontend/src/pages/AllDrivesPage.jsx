import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Clock, 
  Award, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import SkillGapModal from '../components/SkillGapModal';
import { api } from '../services/api';

export default function AllDrivesPage({ drives, student, applications, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [minCtcFilter, setMinCtcFilter] = useState(0);

  const [selectedAts, setSelectedAts] = useState(null);
  const [selectedDriveForAts, setSelectedDriveForAts] = useState(null);

  const studentApps = applications.filter(a => a.student?.id === student?.id);

  const filteredDrives = drives.filter(d => {
    const matchesSearch = d.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.requiredSkills?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || d.eligibleDepartments?.includes(deptFilter) || d.eligibleDepartments === 'ALL';
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    const matchesCtc = (d.packageLpa || 0) >= minCtcFilter;
    return matchesSearch && matchesDept && matchesStatus && matchesCtc;
  });

  const handleApply = async (driveId) => {
    try {
      await api.applyToDrive(student.id, driveId);
      alert('Application submitted successfully!');
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenAts = async (drive) => {
    if (!student) return;
    try {
      const ats = await api.getAtsScore(student.id, drive.id);
      setSelectedDriveForAts(drive);
      setSelectedAts(ats);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Campus Placement Drives Directory
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Explore active and upcoming corporate placement opportunities with real-time criteria verification
            </p>
          </div>

          <div className="text-xs font-bold px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 flex items-center space-x-1.5 self-start">
            <Briefcase className="w-4 h-4" />
            <span>{filteredDrives.length} Drives Available</span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search role, company, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="ALL">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="AIML">AIML</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="IT">IT</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="ALL">All Drive Statuses</option>
              <option value="ACTIVE">Active (Accepting Applications)</option>
              <option value="UPCOMING">Upcoming</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div>
            <select
              value={minCtcFilter}
              onChange={(e) => setMinCtcFilter(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value={0}>Any CTC Package</option>
              <option value={8}>8+ LPA CTC</option>
              <option value={15}>15+ LPA CTC (Tier 1)</option>
              <option value={25}>25+ LPA CTC (Dream Offer)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrives.map((drive) => {
          const hasApplied = studentApps.some(a => a.drive?.id === drive.id);

          return (
            <div
              key={drive.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={drive.company?.logoUrl || 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100'}
                      alt={drive.company?.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-sm"
                    />
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">{drive.company?.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{drive.jobRole}</p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-emerald-600">{drive.packageLpa} LPA</span>
                </div>

                <h4 className="font-bold text-slate-800 text-sm mt-4">{drive.jobTitle}</h4>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {drive.jobDescription || 'Full-time campus placement hiring drive with comprehensive benefits and training program.'}
                </p>

                {/* Criteria */}
                <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="font-medium">Min CGPA:</span>
                    <strong className="text-slate-800">{drive.minCgpa}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Backlogs Allowed:</span>
                    <strong className="text-slate-800">Max {drive.maxBacklogsAllowed}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Branches:</span>
                    <strong className="text-slate-800">{drive.eligibleDepartments}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Location:</span>
                    <strong className="text-slate-800">{drive.workLocation || 'Hybrid'}</strong>
                  </div>
                </div>

                {/* Required Skills */}
                <div className="mt-3">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Required Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {drive.requiredSkills?.split(',').map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center space-x-2">
                {student && (
                  <button
                    onClick={() => handleOpenAts(drive)}
                    className="flex-1 py-2 px-3 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center justify-center space-x-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Skill Match</span>
                  </button>
                )}

                {student ? (
                  <button
                    onClick={() => handleApply(drive.id)}
                    disabled={hasApplied}
                    className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all ${
                      hasApplied
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200'
                    }`}
                  >
                    {hasApplied ? '✓ Applied' : 'Apply Now'}
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 font-semibold px-2 py-1">
                    Sign in as student to apply
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Skill Gap Modal */}
      <SkillGapModal
        isOpen={!!selectedAts}
        onClose={() => {
          setSelectedAts(null);
          setSelectedDriveForAts(null);
        }}
        atsData={selectedAts}
        driveTitle={selectedDriveForAts?.jobTitle}
        companyName={selectedDriveForAts?.company?.name}
        isEligible={true}
        hasApplied={selectedDriveForAts ? studentApps.some(a => a.drive?.id === selectedDriveForAts.id) : false}
        onApply={() => {
          if (selectedDriveForAts) handleApply(selectedDriveForAts.id);
        }}
      />
    </div>
  );
}
