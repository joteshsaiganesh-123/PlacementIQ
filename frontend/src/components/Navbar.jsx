import React from 'react';
import { 
  GraduationCap, 
  Building2, 
  Briefcase, 
  LogOut, 
  User, 
  LayoutDashboard,
  FileCheck2,
  FileText,
  BookOpen,
  Bell,
  MessageSquare,
  Users,
  BarChart3,
  Calendar,
  Video
} from 'lucide-react';

export default function Navbar({ 
  currentRole, 
  currentUser, 
  activeTab, 
  setActiveTab, 
  onLogout 
}) {
  // Navigation menus configured strictly per role
  const getNavItems = () => {
    if (currentRole === 'STUDENT') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'courses', label: 'Courses', icon: GraduationCap },
        { id: 'companies', label: 'Companies', icon: Building2 },
        { id: 'jobs', label: 'Jobs', icon: Briefcase },
        { id: 'applications', label: 'Applications', icon: FileCheck2 },
        { id: 'resume', label: 'Resume', icon: FileText },
        { id: 'prep', label: 'Placement Preparation', icon: BookOpen },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'chatbot', label: 'Chatbot', icon: MessageSquare }
      ];
    } else if (currentRole === 'TPO_ADMIN') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'courses', label: 'Courses', icon: GraduationCap },
        { id: 'companies', label: 'Companies', icon: Building2 },
        { id: 'applications', label: 'Applications', icon: FileCheck2 },
        { id: 'stats', label: 'Placement Statistics', icon: BarChart3 },
        { id: 'notifications', label: 'Notifications', icon: Bell }
      ];
    } else {
      // RECRUITER
      return [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'company-profile', label: 'Company Profile', icon: Building2 },
        { id: 'jobs', label: 'Jobs', icon: Briefcase },
        { id: 'drives', label: 'Placement Drives', icon: Calendar },
        { id: 'applicants', label: 'Applicants', icon: Users },
        { id: 'interviews', label: 'Interviews', icon: Video },
        { id: 'notifications', label: 'Notifications', icon: Bell }
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  Placement<span className="text-indigo-600">IQ</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Fullstack Java
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Smart Campus Recruitment Portal</p>
            </div>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-slate-100 border border-slate-200">
              <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                {currentUser?.name?.slice(0, 1).toUpperCase() || 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-extrabold text-slate-900 line-clamp-1 leading-tight">{currentUser?.name}</p>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{currentUser?.role}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              title="Log out from session"
              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Role Navigation Strip */}
      <div className="bg-slate-50/90 border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
