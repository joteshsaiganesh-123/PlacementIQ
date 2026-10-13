import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import StudentDashboard from './pages/StudentDashboard';
import TpoDashboard from './pages/TpoDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AllDrivesPage from './pages/AllDrivesPage';
import StudentProfilePage from './pages/StudentProfilePage';
import CoursesPage from './pages/CoursesPage';
import CompaniesPage from './pages/CompaniesPage';
import PlacementPrepPage from './pages/PlacementPrepPage';
import PlacementChatbotPage from './pages/PlacementChatbotPage';
import NotificationsPage from './pages/NotificationsPage';
import ApplicationsTrackerPage from './pages/ApplicationsTrackerPage';
import InterviewsPage from './pages/InterviewsPage';
import DriveModal from './components/DriveModal';
import { api } from './services/api';
import { 
  Loader2, 
  AlertCircle, 
  RefreshCw, 
  Search, 
  FileSpreadsheet, 
  Plus, 
  Building2, 
  Users, 
  Briefcase, 
  Calendar, 
  Award, 
  ExternalLink 
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('placement_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [currentStudent, setCurrentStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [drives, setDrives] = useState([]);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);

  // Filters for Faculty Students Directory
  const [studentSearch, setStudentSearch] = useState('');
  const [studentDeptFilter, setStudentDeptFilter] = useState('ALL');
  const [studentStatusFilter, setStudentStatusFilter] = useState('ALL');

  const loadData = async (activeUser = currentUser) => {
    try {
      setLoading(true);
      setError(null);

      const [usersData, drivesData, studentsData, companiesData, appsData, analyticsData] = await Promise.all([
        api.getDemoUsers(),
        api.getAllDrives(),
        api.getAllStudents(),
        api.getAllCompanies(),
        api.getAllApplications(),
        api.getAnalyticsSummary()
      ]);

      setDrives(drivesData);
      setStudents(studentsData);
      setCompanies(companiesData);
      setApplications(appsData);
      setAnalytics(analyticsData);

      if (activeUser) {
        const matchedUser = usersData.find(u => u.email?.toLowerCase() === activeUser.email?.toLowerCase()) || activeUser;
        setCurrentUser(matchedUser);

        if (matchedUser.role === 'STUDENT') {
          const studentProfile = studentsData.find(s => s.user?.id === matchedUser.id || s.user?.email === matchedUser.email);
          setCurrentStudent(studentProfile || null);
        } else {
          setCurrentStudent(null);
        }
      }
    } catch (err) {
      console.error("Failed to load data from backend:", err);
      setError("Unable to connect to Spring Boot API. Ensure the backend server is running on port 8085.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentUser);
  }, []);

  const handleLoginSuccess = (authResponse) => {
    const user = {
      id: authResponse.userId,
      name: authResponse.name,
      email: authResponse.email,
      role: authResponse.role
    };
    localStorage.setItem('placement_user', JSON.stringify(user));
    setCurrentUser(user);
    loadData(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('placement_user');
    setCurrentUser(null);
    setCurrentStudent(null);
  };

  const handleRefresh = () => {
    loadData(currentUser);
  };

  const handleCreateDrive = async (driveData) => {
    await api.createDrive(driveData);
    alert('Placement drive launched successfully!');
    handleRefresh();
  };

  const exportStudentsCsv = () => {
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

  // If user is not logged in, render custom AuthPage
  if (!currentUser) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  const effectiveStudent = currentStudent || {
    id: currentUser?.id || 1,
    user: currentUser,
    rollNumber: 'N/A',
    department: 'CSE',
    batchYear: 2026,
    cgpa: 0.0,
    activeBacklogs: 0,
    skills: '',
    placed: false
  };

  // Filtered students for faculty students view
  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.user?.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.rollNumber?.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesDept = studentDeptFilter === 'ALL' || s.department === studentDeptFilter;
    const matchesStatus = studentStatusFilter === 'ALL' ||
      (studentStatusFilter === 'PLACED' && s.placed) ||
      (studentStatusFilter === 'UNPLACED' && !s.placed);
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Recruiter company resolution
  const recruiterCompany = companies.find(c => 
    currentUser.name?.toLowerCase().includes(c.name?.toLowerCase()) ||
    currentUser.email?.toLowerCase().includes(c.name?.toLowerCase())
  ) || companies[0];

  if (loading && !drives.length) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center animate-bounce shadow-xl shadow-indigo-500/50">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Accessing PlacementIQ Portal...</h2>
        <p className="text-xs text-slate-400">Loading placement records for {currentUser.name}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Role-Based Responsive Navigation Bar */}
      <Navbar
        currentRole={currentUser?.role}
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Connection Error Banner */}
      {error && (
        <div className="bg-rose-50 border-b border-rose-200 px-4 py-3 text-xs text-rose-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{error}</span>
          </div>
          <button
            onClick={handleRefresh}
            className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 flex items-center space-x-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Main Content Area: Maps Every Role Menu Item to its Page */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* =========================================
            COMMON & SHARED VIEWS
           ========================================= */}

        {/* 1. Courses Page (Student & Faculty) */}
        {activeTab === 'courses' && (
          <CoursesPage
            analytics={analytics}
            drives={drives}
            students={students}
            currentRole={currentUser?.role}
            onSelectCourseJobs={() => setActiveTab('jobs')}
          />
        )}

        {/* 2. Companies Page (Student, Faculty, Recruiter) */}
        {activeTab === 'companies' && (
          <CompaniesPage
            companies={companies}
            drives={drives}
            onSelectCompanyJobs={() => setActiveTab('jobs')}
          />
        )}

        {/* 3. Jobs / Drives Directory */}
        {activeTab === 'jobs' && (
          <AllDrivesPage
            drives={drives}
            student={effectiveStudent}
            applications={applications}
            onRefresh={handleRefresh}
          />
        )}

        {/* 4. Applications Tracker */}
        {activeTab === 'applications' && (
          <ApplicationsTrackerPage
            applications={applications}
            currentRole={currentUser?.role}
            student={effectiveStudent}
            onRefresh={handleRefresh}
          />
        )}

        {/* 5. Notifications Hub */}
        {activeTab === 'notifications' && (
          <NotificationsPage
            currentRole={currentUser?.role}
            student={effectiveStudent}
            drives={drives}
            applications={applications}
          />
        )}

        {/* =========================================
            STUDENT-SPECIFIC VIEWS
           ========================================= */}
        {currentUser?.role === 'STUDENT' && (
          <>
            {activeTab === 'dashboard' && (
              <StudentDashboard
                student={effectiveStudent}
                drives={drives}
                applications={applications}
                onRefresh={handleRefresh}
                onSelectDrive={() => setActiveTab('jobs')}
              />
            )}

            {(activeTab === 'profile' || activeTab === 'resume') && (
              <StudentProfilePage
                student={effectiveStudent}
                onRefresh={handleRefresh}
              />
            )}

            {activeTab === 'prep' && (
              <PlacementPrepPage />
            )}

            {activeTab === 'chatbot' && (
              <PlacementChatbotPage
                student={effectiveStudent}
                drives={drives}
                companies={companies}
              />
            )}
          </>
        )}

        {/* =========================================
            FACULTY (TPO_ADMIN)-SPECIFIC VIEWS
           ========================================= */}
        {currentUser?.role === 'TPO_ADMIN' && (
          <>
            {activeTab === 'dashboard' && (
              <TpoDashboard
                analytics={analytics}
                drives={drives}
                students={students}
                companies={companies}
                applications={applications}
                onRefresh={handleRefresh}
              />
            )}

            {/* Faculty Students Directory */}
            {activeTab === 'students' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        Student Master Database & Directory
                      </h2>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Verified academic credentials, backlogs, technical profiles, and campus placement allocations.
                      </p>
                    </div>

                    <button
                      onClick={exportStudentsCsv}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-2 self-start"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      <span>Export Directory (.CSV)</span>
                    </button>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-wrap items-center gap-3 mb-5">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search student or roll number..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="pl-9 pr-3.5 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 w-56"
                      />
                    </div>

                    <select
                      value={studentDeptFilter}
                      onChange={(e) => setStudentDeptFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="ALL">All Departments (7)</option>
                      <option value="CSE">CSE</option>
                      <option value="AIML">AIML</option>
                      <option value="ECE">ECE</option>
                      <option value="EEE">EEE</option>
                      <option value="IT">IT</option>
                      <option value="MECH">MECH</option>
                      <option value="CIVIL">CIVIL</option>
                    </select>

                    <select
                      value={studentStatusFilter}
                      onChange={(e) => setStudentStatusFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="ALL">All Placement Statuses</option>
                      <option value="PLACED">Placed Candidates Only</option>
                      <option value="UNPLACED">Seeking Placement</option>
                    </select>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                          <th className="py-3 px-4">Roll No</th>
                          <th className="py-3 px-4">Student Name</th>
                          <th className="py-3 px-4">Course / Dept</th>
                          <th className="py-3 px-4">CGPA</th>
                          <th className="py-3 px-4">Backlogs</th>
                          <th className="py-3 px-4">Technical Stack</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Package</th>
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
                              {stud.skills || 'N/A'}
                            </td>
                            <td className="py-3.5 px-4">
                              {stud.placed ? (
                                <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  ✓ Placed
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                  In Progress
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-extrabold text-slate-900">
                              {stud.placed ? `${stud.packageLpa} LPA (${stud.placedCompany})` : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Faculty Placement Statistics (Accreditation Report) */}
            {(activeTab === 'stats' || activeTab === 'reports') && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        NAAC / NBA Accreditation Placement Audit Report
                      </h1>
                      <p className="text-xs text-slate-500 mt-1">
                        Official verified summary formatted for academic accreditation committees and annual college reviews.
                      </p>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-slate-800"
                    >
                      Print / Save Official PDF
                    </button>
                  </div>

                  <div className="mt-8 border-t border-slate-100 pt-6 space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl">
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Institution Batch</span>
                        <p className="text-base font-extrabold text-slate-900">2026 Graduating Class</p>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Overall Placement</span>
                        <p className="text-base font-extrabold text-emerald-600">{analytics?.placementRate}%</p>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Highest Compensation</span>
                        <p className="text-base font-extrabold text-indigo-600">{analytics?.highestPackage} LPA</p>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Average CTC</span>
                        <p className="text-base font-extrabold text-slate-900">{analytics?.averagePackage} LPA</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider">
                          <tr>
                            <th className="p-3">Department</th>
                            <th className="p-3">Total Registered</th>
                            <th className="p-3">Total Placed</th>
                            <th className="p-3">Placement %</th>
                            <th className="p-3">Average Package</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {analytics?.departmentStats?.map((d) => (
                            <tr key={d.department}>
                              <td className="p-3 font-bold">{d.department}</td>
                              <td className="p-3">{d.totalStudents}</td>
                              <td className="p-3 text-emerald-700 font-bold">{d.placedStudents}</td>
                              <td className="p-3 font-extrabold">{d.placementRate}%</td>
                              <td className="p-3 font-bold">{d.averagePackage} LPA</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* =========================================
            RECRUITER-SPECIFIC VIEWS
           ========================================= */}
        {currentUser?.role === 'RECRUITER' && (
          <>
            {activeTab === 'dashboard' && (
              <RecruiterDashboard
                user={currentUser}
                drives={drives}
                applications={applications}
                onRefresh={handleRefresh}
              />
            )}

            {/* Recruiter Company Profile */}
            {activeTab === 'company-profile' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm">
                  <div className="flex items-center space-x-5">
                    <img
                      src={recruiterCompany?.logoUrl || 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=120'}
                      alt={recruiterCompany?.name}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shadow-md"
                    />
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">{recruiterCompany?.name}</h2>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 inline-block mt-1">
                        {recruiterCompany?.industry || 'Enterprise Technology Partner'}
                      </span>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{recruiterCompany?.location}</p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                      <h3 className="font-extrabold text-sm text-slate-900">Talent Acquisition Representative</h3>
                      <p className="text-xs text-slate-600">Lead Recruiter: <strong>{currentUser.name}</strong></p>
                      <p className="text-xs text-slate-600">Corporate Email: <strong>{currentUser.email}</strong></p>
                      <p className="text-xs text-slate-600">Company Portal ID: <strong className="font-mono">REC-{currentUser.id}</strong></p>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                      <h3 className="font-extrabold text-sm text-slate-900">Campus Partnership Stats</h3>
                      <p className="text-xs text-slate-600">Active Campus Drives: <strong>{drives.filter(d => d.company?.id === recruiterCompany?.id).length}</strong></p>
                      <p className="text-xs text-slate-600">Total Applicants Screened: <strong>{applications.length}</strong></p>
                      <p className="text-xs text-slate-600">Offers Extended: <strong className="text-emerald-700">{applications.filter(a => a.status === 'OFFERED').length}</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recruiter Placement Drives Management */}
            {activeTab === 'drives' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-sm flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      Campus Placement Drives Management
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      Manage active recruitment schedules, criteria rules, and intake requirements.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDriveModalOpen(true)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Launch New Drive</span>
                  </button>
                </div>

                <AllDrivesPage
                  drives={drives}
                  student={effectiveStudent}
                  applications={applications}
                  onRefresh={handleRefresh}
                />
              </div>
            )}

            {/* Recruiter Applicants */}
            {activeTab === 'applicants' && (
              <RecruiterDashboard
                user={currentUser}
                drives={drives}
                applications={applications}
                onRefresh={handleRefresh}
              />
            )}

            {/* Recruiter Interviews */}
            {activeTab === 'interviews' && (
              <InterviewsPage
                applications={applications}
                drives={drives}
                user={currentUser}
                onRefresh={handleRefresh}
              />
            )}
          </>
        )}
      </main>

      {/* Drive Modal */}
      <DriveModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        companies={companies}
        onSave={handleCreateDrive}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-400">
        <p className="font-semibold text-slate-600">
          PlacementIQ &bull; Smart Placement & Recruitment Management System
        </p>
        <p className="mt-1">
          Fullstack Java Architecture: Spring Boot 3.2.5 &bull; Spring Data JPA &bull; H2 Database &bull; React & Tailwind CSS
        </p>
      </footer>
    </div>
  );
}
