import React, { useState } from 'react';
import { X, Building2, Briefcase, GraduationCap, Calendar, MapPin, Award } from 'lucide-react';

export default function DriveModal({ isOpen, onClose, companies, onSave }) {
  const [formData, setFormData] = useState({
    companyId: companies && companies.length > 0 ? companies[0].id : '',
    jobTitle: '',
    jobRole: 'Software Engineer',
    packageLpa: 12.0,
    minCgpa: 7.0,
    maxBacklogsAllowed: 0,
    eligibleDepartments: 'CSE,AIML,ECE,EEE,IT,MECH,CIVIL',
    eligibleBatchYear: 2026,
    requiredSkills: 'Java, Spring Boot, SQL, Git',
    driveDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    applicationDeadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    totalOpenings: 10,
    workLocation: 'Bangalore / Hybrid',
    jobDescription: '',
    status: 'ACTIVE'
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const selectedCompany = companies.find(c => c.id === Number(formData.companyId)) || companies[0];
      const payload = {
        company: selectedCompany,
        jobTitle: formData.jobTitle,
        jobRole: formData.jobRole,
        packageLpa: parseFloat(formData.packageLpa),
        minCgpa: parseFloat(formData.minCgpa),
        maxBacklogsAllowed: parseInt(formData.maxBacklogsAllowed, 10),
        eligibleDepartments: formData.eligibleDepartments,
        eligibleBatchYear: parseInt(formData.eligibleBatchYear, 10),
        requiredSkills: formData.requiredSkills,
        driveDate: formData.driveDate,
        applicationDeadline: formData.applicationDeadline,
        totalOpenings: parseInt(formData.totalOpenings, 10),
        workLocation: formData.workLocation,
        jobDescription: formData.jobDescription,
        status: formData.status
      };
      await onSave(payload);
      onClose();
    } catch (err) {
      alert('Error creating drive: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-100">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Launch New Placement Drive</h3>
              <p className="text-xs text-slate-500">Configure drive criteria, packages, and eligibility filters</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Recruiting Company
              </label>
              <select
                value={formData.companyId}
                onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                required
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.industry || 'Tech'})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Job Title / Position
              </label>
              <input
                type="text"
                placeholder="e.g. Cloud Engineer (L3)"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                CTC Package (LPA)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.packageLpa}
                onChange={(e) => setFormData({ ...formData, packageLpa: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Minimum CGPA Requirement
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="10"
                value={formData.minCgpa}
                onChange={(e) => setFormData({ ...formData, minCgpa: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Max Allowed Backlogs
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.maxBacklogsAllowed}
                onChange={(e) => setFormData({ ...formData, maxBacklogsAllowed: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Eligible Departments
              </label>
              <input
                type="text"
                placeholder="e.g. CSE, AIML, ECE, EEE, IT, MECH, CIVIL or ALL"
                value={formData.eligibleDepartments}
                onChange={(e) => setFormData({ ...formData, eligibleDepartments: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Drive Date
              </label>
              <input
                type="date"
                value={formData.driveDate}
                onChange={(e) => setFormData({ ...formData, driveDate: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                value={formData.applicationDeadline}
                onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Required Technical Skills (Comma-separated for ATS Matching)
            </label>
            <input
              type="text"
              placeholder="e.g. Java, Spring Boot, React, SQL, AWS, Docker"
              value={formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Work Location
              </label>
              <input
                type="text"
                placeholder="e.g. Bangalore / Hybrid"
                value={formData.workLocation}
                onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Total Openings
              </label>
              <input
                type="number"
                value={formData.totalOpenings}
                onChange={(e) => setFormData({ ...formData, totalOpenings: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Job Description & Selection Rounds
            </label>
            <textarea
              rows={3}
              placeholder="Describe role responsibilities, online assessment details, interview rounds..."
              value={formData.jobDescription}
              onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center space-x-2"
            >
              <span>{loading ? 'Creating...' : 'Publish Drive Now'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
