import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  TrendingUp, 
  Briefcase, 
  Award, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function CoursesPage({ analytics, drives, students, currentRole, onSelectCourseJobs }) {
  const [selectedCourse, setSelectedCourse] = useState('ALL');

  const courseList = [
    {
      code: 'CSE',
      name: 'Computer Science & Engineering',
      description: 'Core software engineering, algorithms, system design, cloud distributed computing, and full-stack development.',
      skills: ['Java', 'Spring Boot', 'Data Structures', 'Algorithms', 'SQL', 'React', 'Docker']
    },
    {
      code: 'AIML',
      name: 'Artificial Intelligence & Machine Learning',
      description: 'Machine learning algorithms, deep neural networks, computer vision, natural language processing, and data engineering.',
      skills: ['Python', 'PyTorch', 'TensorFlow', 'FastAPI', 'Data Science', 'Transformers', 'SQL']
    },
    {
      code: 'ECE',
      name: 'Electronics & Communication Engineering',
      description: 'Embedded systems, digital signal processing, IoT hardware architecture, microcontrollers, and firmware.',
      skills: ['C++', 'Embedded C', 'IoT', 'Microcontrollers', 'Linux', 'Signal Processing']
    },
    {
      code: 'EEE',
      name: 'Electrical & Electronics Engineering',
      description: 'Power systems, control automation, renewable grid energy, power electronics, and electrical circuit modeling.',
      skills: ['MATLAB', 'Power Systems', 'Circuit Design', 'Embedded Systems', 'PLC Automation']
    },
    {
      code: 'IT',
      name: 'Information Technology',
      description: 'Enterprise information infrastructure, DevOps pipelines, database administration, web technologies, and security.',
      skills: ['Java', 'Python', 'AWS', 'Kubernetes', 'REST APIs', 'Cybersecurity', 'MySQL']
    },
    {
      code: 'MECH',
      name: 'Mechanical Engineering',
      description: 'Robotics automation, CAD/CAM mechanical modeling, thermodynamics, manufacturing systems, and finite element analysis.',
      skills: ['AutoCAD', 'SolidWorks', 'ANSYS', 'Robotics', 'Manufacturing Automation']
    },
    {
      code: 'CIVIL',
      name: 'Civil Engineering',
      description: 'Structural engineering, urban infrastructure planning, surveying, GIS systems, and construction management.',
      skills: ['AutoCAD', 'Revit', 'Structural Analysis', 'GIS', 'Project Management']
    }
  ];

  const filteredCourses = selectedCourse === 'ALL'
    ? courseList
    : courseList.filter(c => c.code === selectedCourse);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Academic Engineering Programs</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-3 text-white">
              Academic Courses & Branch Placement Overview
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              Explore placement records, technical specializations, and company recruitment opportunities across engineering departments.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[180px]">
            <p className="text-xs uppercase font-bold text-indigo-300 tracking-wider">Total Programs</p>
            <p className="text-2xl font-black mt-1 text-white">7 Branches</p>
            <p className="text-xs text-slate-300 mt-1 font-medium">Accredited Curriculums</p>
          </div>
        </div>
      </div>

      {/* Course Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCourse('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            selectedCourse === 'ALL'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Departments (7)
        </button>
        {courseList.map(c => (
          <button
            key={c.code}
            onClick={() => setSelectedCourse(c.code)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCourse === c.code
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c.code}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => {
          const deptStat = analytics?.departmentStats?.find(d => d.department === course.code);
          const deptStudents = students?.filter(s => s.department === course.code) || [];
          const eligibleDrivesCount = drives?.filter(d => 
            d.eligibleDepartments?.includes(course.code) || d.eligibleDepartments === 'ALL'
          ).length || 0;

          const placementPct = deptStat ? deptStat.placementRate : (deptStudents.length > 0 ? Math.round((deptStudents.filter(s => s.placed).length / deptStudents.length) * 100) : 0);
          const avgCtc = deptStat ? deptStat.averagePackage : 12.5;

          return (
            <div 
              key={course.code}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-700 text-base">
                    {course.code}
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{placementPct}% Placed</span>
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base mt-4">
                  {course.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 font-medium">
                  {course.description}
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-slate-50 rounded-2xl text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Avg Package</span>
                    <p className="font-extrabold text-slate-800">{avgCtc} LPA</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Eligible Drives</span>
                    <p className="font-extrabold text-indigo-600">{eligibleDrivesCount} Active</p>
                  </div>
                </div>

                {/* Core Technical Skills */}
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Core Technical Competencies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {course.skills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {onSelectCourseJobs && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => onSelectCourseJobs(course.code)}
                    className="w-full py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <span>View {course.code} Campus Drives ({eligibleDrivesCount})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
