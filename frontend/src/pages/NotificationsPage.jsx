import React, { useState } from 'react';
import { 
  Bell, 
  Calendar, 
  Briefcase, 
  CheckCircle2, 
  Award, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  Building2,
  ChevronRight
} from 'lucide-react';

export default function NotificationsPage({ currentRole, student, drives, applications }) {
  const [filterType, setFilterType] = useState('ALL');
  const [readIds, setReadIds] = useState(new Set());

  // Generate role-specific notification feed
  const generateNotifications = () => {
    if (currentRole === 'STUDENT') {
      return [
        {
          id: 'n1',
          type: 'OFFER',
          priority: 'HIGH',
          title: 'Campus Placement Offer Released!',
          message: 'Congratulations! Official placement confirmation and compensation letter extended for the Software Engineering role.',
          time: '1 hour ago',
          icon: Award,
          color: 'emerald'
        },
        {
          id: 'n2',
          type: 'INTERVIEW',
          priority: 'HIGH',
          title: 'Technical Round Interview Scheduled',
          message: 'Your Google Meet video assessment link has been provisioned. Please review DSA topics and system design prior to the round.',
          time: '3 hours ago',
          icon: Calendar,
          color: 'purple'
        },
        {
          id: 'n3',
          type: 'DRIVE',
          priority: 'NORMAL',
          title: 'New Campus Drive Announced: Amazon AWS',
          message: 'Amazon AWS Cloud has opened registration for 2026 Batch candidates with CTC up to 32.0 LPA. Check your smart eligibility and submit.',
          time: 'Yesterday',
          icon: Briefcase,
          color: 'indigo'
        },
        {
          id: 'n4',
          type: 'ATS',
          priority: 'NORMAL',
          title: 'ATS Resume Score Evaluated',
          message: 'Your updated skill profile achieved an ATS match above 85% for Oracle Full Stack Java Developer opening.',
          time: '2 days ago',
          icon: Sparkles,
          color: 'blue'
        },
        {
          id: 'n5',
          type: 'DEADLINE',
          priority: 'HIGH',
          title: 'Upcoming Application Deadline: Microsoft Cloud',
          message: 'Registrations for Microsoft Azure Cloud Solution Engineer drive will close in 48 hours. Ensure backlogs and CGPA verification are complete.',
          time: '3 days ago',
          icon: Clock,
          color: 'amber'
        }
      ];
    } else if (currentRole === 'TPO_ADMIN') {
      return [
        {
          id: 'f1',
          type: 'DRIVE',
          priority: 'NORMAL',
          title: 'Campus Drive Launched: Google SDE-1',
          message: 'Google campus drive successfully published for CSE, IT, and AIML branches with package 28.5 LPA. 8 positions open.',
          time: '2 hours ago',
          icon: Briefcase,
          color: 'indigo'
        },
        {
          id: 'f2',
          type: 'ACCREDITATION',
          priority: 'HIGH',
          title: 'NAAC / NBA Accreditation Summary Ready',
          message: 'Academic Year 2026 placement statistics updated with live average compensation package and departmental placement rates.',
          time: '5 hours ago',
          icon: Award,
          color: 'emerald'
        },
        {
          id: 'f3',
          type: 'COMPANY',
          priority: 'NORMAL',
          title: 'Recruiting Partner Registered: Oracle Corporation',
          message: 'Campus recruiting team from Oracle verified. Scheduled campus drive for Full Stack Java Developers with 15 openings.',
          time: '1 day ago',
          icon: Building2,
          color: 'blue'
        },
        {
          id: 'f4',
          type: 'STUDENT',
          priority: 'HIGH',
          title: 'Student Master Data Verification',
          message: 'Automated eligibility scanner re-synchronized student CGPA and backlog records across all 7 engineering departments.',
          time: '2 days ago',
          icon: CheckCircle2,
          color: 'purple'
        }
      ];
    } else {
      // RECRUITER
      return [
        {
          id: 'r1',
          type: 'APPLICATION',
          priority: 'HIGH',
          title: 'New Candidate Applications Received',
          message: '7 students submitted applications for your campus opening. Smart ATS ranking scores are generated and ready for review.',
          time: '30 mins ago',
          icon: Sparkles,
          color: 'indigo'
        },
        {
          id: 'r2',
          type: 'INTERVIEW',
          priority: 'HIGH',
          title: 'Technical Round Scheduled',
          message: 'Interview invitation and Google Meet room details sent to candidate. Scheduled for 2:00 PM tomorrow.',
          time: '4 hours ago',
          icon: Calendar,
          color: 'purple'
        },
        {
          id: 'r3',
          type: 'OFFER',
          priority: 'NORMAL',
          title: 'Candidate Offer Letter Acknowledged',
          message: 'Selected candidate has accepted the pre-placement offer for Software Development Engineer role.',
          time: 'Yesterday',
          icon: Award,
          color: 'emerald'
        }
      ];
    }
  };

  const allNotifications = generateNotifications();

  const filteredNotifications = allNotifications.filter(n => {
    if (filterType === 'ALL') return true;
    if (filterType === 'HIGH') return n.priority === 'HIGH';
    return n.type === filterType;
  });

  const markAllRead = () => {
    const allIds = new Set(allNotifications.map(n => n.id));
    setReadIds(allIds);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Bell className="w-3.5 h-3.5" />
              <span>Placement Communications Hub</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-3 text-white">
              Official Placement Notifications & Alerts
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              Real-time circulars, campus drive deadlines, interview call letters, and compensation offer updates.
            </p>
          </div>

          <button
            onClick={markAllRead}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold backdrop-blur-md border border-white/20 shadow-sm transition-all flex items-center space-x-2 self-start"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {['ALL', 'HIGH', 'DRIVE', 'INTERVIEW', 'OFFER'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterType === tab
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {tab === 'ALL' ? 'All Alerts' : tab === 'HIGH' ? '🚨 High Priority' : tab}
          </button>
        ))}
      </div>

      {/* Notifications Feed */}
      <div className="space-y-3">
        {filteredNotifications.map(item => {
          const Icon = item.icon;
          const isRead = readIds.has(item.id);

          return (
            <div
              key={item.id}
              onClick={() => setReadIds(prev => new Set([...prev, item.id]))}
              className={`p-5 rounded-3xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                isRead 
                  ? 'bg-white/80 border-slate-200/80 opacity-75' 
                  : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-white ${
                  item.color === 'emerald' ? 'bg-emerald-600' :
                  item.color === 'purple' ? 'bg-purple-600' :
                  item.color === 'amber' ? 'bg-amber-600' :
                  item.color === 'blue' ? 'bg-blue-600' : 'bg-indigo-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-slate-900 text-sm">{item.title}</h3>
                    {item.priority === 'HIGH' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Urgent
                      </span>
                    )}
                    {!isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                    {item.message}
                  </p>

                  <span className="inline-block text-[10px] font-semibold text-slate-400 mt-2">
                    {item.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
