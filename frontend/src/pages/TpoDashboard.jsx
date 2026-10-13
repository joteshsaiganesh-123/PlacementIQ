import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Award, 
  TrendingUp, 
  Briefcase, 
  Plus, 
  FileSpreadsheet, 
  Download, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  GraduationCap,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import StatCard from '../components/StatCard';
import DriveModal from '../components/DriveModal';
import { api } from '../services/api';

export default function TpoDashboard({ analytics, drives, students, companies, applications, onRefresh }) {
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [searchStudent, setSearchStudent] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [placementFilter, setPlacementFilter] = useState('ALL');

  const handleCreateDrive = async (driveData) => {
    await api.createDrive(driveData);
    alert('Placement drive launched successfully!');
    onRefresh();
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.user?.name?.toLowerCase().includes(searchStudent.toLowerCase()) ||
                          s.rollNumber?.toLowerCase().includes(searchStudent.toLowerCase());
    const matchesDept = selectedDeptFilter === 'ALL' || s.department === selectedDeptFilter;
    const matchesPlaced = placementFilter === 'ALL' || 
                          (placementFilter === 'PLACED' && s.placed) || 
                          (placementFilter === 'UNPLACED' && !s.placed);
    return matchesSearch && matchesDept && matchesPlaced;
  });

  const exportReportCsv = () => {
    let csv = "Roll Number,Student Name,Department,Batch,CGPA,Active Backlogs,Placed Status,Placed Company,Package (LPA)\n";
    students.forEach(s => {
      csv += `"${s.rollNumber}","${s.user?.name || ''}","${s.department}","${s.batchYear}","${s.cgpa}","${s.activeBacklogs}","${s.placed ? 'Placed' : 'In Progress'}","${s.placedCompany || 'N/A'}","${s.packageLpa || '0'}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Placement_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* TPO Admin Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Campus Placement Cell Administration</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-3 text-white">
              Placement Cell Executive Command
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              Real-time drive coordination, automated eligibility monitoring, and accreditation statistics for NAAC / NBA reviews.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportReportCsv}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold backdrop-blur-md border border-white/20 shadow-sm transition-all flex items-center space-x-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export NAAC Report (.CSV)</span>
            </button>
            <button
              onClick={() => setIsDriveModalOpen(true)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Launch Campus Drive</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Placement Rate"
          value={`${analytics?.placementRate || 0}%`}
          subtext={`${analytics?.placedStudents || 0} of ${analytics?.totalStudents || 0} eligible candidates placed`}
          icon={TrendingUp}
          color="emerald"
          badge="+12% YoY Growth"
        />
        <StatCard
          title="Highest Package"
          value={`${analytics?.highestPackage || 0} LPA`}
          subtext="Verified across active campus offers"
          icon={Award}
          color="indigo"
        />
        <StatCard
          title="Average CTC"
          value={`${analytics?.averagePackage || 0} LPA`}
          subtext={`Median CTC: ${analytics?.medianPackage || 0} LPA`}
          icon={Briefcase}
          color="purple"
        />
        <StatCard
          title="Active Drives"
          value={analytics?.activeDrives || 0}
          subtext={`${analytics?.totalCompanies || 0} recruiting partners registered`}
          icon={Building2}
          color="blue"
        />
      </div>

      {/* Branch-wise Placement & Funnel Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Branch breakdown */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-7 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Department-wise Placement Performance
              </h3>
              <p className="text-xs text-slate-500 font-medium">Batch 2026 Academic Year</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
              Live Aggregate
            </span>
          </div>

          <div className="space-y-4">
            {analytics?.departmentStats?.map((dept) => (
              <div key={dept.department} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-sm text-slate-900">{dept.department}</span>
                    <span className="text-xs text-slate-400 font-medium">
                      ({dept.placedStudents} / {dept.totalStudents} Placed)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-emerald-600">{dept.placementRate}%</span>
                    <span className="text-xs text-slate-400 ml-2 font-medium">Avg: {dept.averagePackage} LPA</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-700"
                    style={{ width: `${dept.placementRate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recruitment Pipeline Funnel */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Application Funnel
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-5">Current hiring stage breakdown</p>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                <span className="text-xs font-bold text-slate-700">Total Applications</span>
                <span className="text-sm font-extrabold text-slate-900">{applications.length}</span>
              </div>
              <div className="p-3.5 bg-blue-50/70 rounded-2xl flex items-center justify-between border border-blue-100">
                <span className="text-xs font-bold text-blue-900">Shortlisted for OA</span>
                <span className="text-sm font-extrabold text-blue-900">
                  {applications.filter(a => a.status === 'SHORTLISTED').length}
                </span>
              </div>
              <div className="p-3.5 bg-purple-50/70 rounded-2xl flex items-center justify-between border border-purple-100">
                <span className="text-xs font-bold text-purple-900">Technical / HR Rounds</span>
                <span className="text-sm font-extrabold text-purple-900">
                  {applications.filter(a => a.status === 'TECHNICAL_ROUND' || a.status === 'OA_SCHEDULED').length}
                </span>
              </div>
              <div className="p-3.5 bg-emerald-50 rounded-2xl flex items-center justify-between border border-emerald-200">
                <span className="text-xs font-bold text-emerald-800">Final Offers Extended</span>
                <span className="text-sm font-extrabold text-emerald-800">
                  {applications.filter(a => a.status === 'OFFERED').length}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium">
              Conversion rate from application to offer: <strong className="text-slate-700">
                {applications.length > 0 ? Math.round((applications.filter(a => a.status === 'OFFERED').length / applications.length) * 100) : 0}%
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* Student Master Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Student Master Database
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Verified academic records, backlog checks, and placement allocations
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name or roll..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 sm:w-56"
              />
            </div>

            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
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

            <select
              value={placementFilter}
              onChange={(e) => setPlacementFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="ALL">All Status</option>
              <option value="PLACED">Placed Only</option>
              <option value="UNPLACED">Seeking Placement</option>
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <th className="py-3 px-4">Roll No</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Backlogs</th>
                <th className="py-3 px-4">Key Skills</th>
                <th className="py-3 px-4">Placement Status</th>
                <th className="py-3 px-4">Offer / Package</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStudents.map((stud) => (
                <tr key={stud.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{stud.rollNumber}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{stud.user?.name}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                      {stud.department}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{stud.cgpa}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full font-bold ${stud.activeBacklogs === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {stud.activeBacklogs}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-slate-500">
                    {stud.skills}
                  </td>
                  <td className="py-3.5 px-4">
                    {stud.placed ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Placed</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-bold text-amber-700 bg-amber-50 border border-amber-200">
                        <Clock className="w-3 h-3" />
                        <span>Eligible</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {stud.placed ? (
                      <span className="text-emerald-700">
                        {stud.placedCompany} ({stud.packageLpa} LPA)
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Interviewing</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drive Modal */}
      <DriveModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        companies={companies}
        onSave={handleCreateDrive}
      />
    </div>
  );
}
