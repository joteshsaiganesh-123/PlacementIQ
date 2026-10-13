import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Briefcase, 
  ArrowRight, 
  ExternalLink, 
  Search, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function CompaniesPage({ companies, drives, onSelectCompanyJobs }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = companies.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>Corporate Recruitment Partners</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight mt-3 text-white">
              Participating Recruiting Companies
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              Explore leading multinational tech organizations, product companies, and consulting firms conducting campus recruitment drives.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[180px]">
            <p className="text-xs uppercase font-bold text-indigo-300 tracking-wider">Registered Partners</p>
            <p className="text-2xl font-black mt-1 text-white">{companies.length} Companies</p>
            <p className="text-xs text-slate-300 mt-1 font-medium">Active Campus Affiliates</p>
          </div>
        </div>
      </div>

      {/* Search & Info Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search company by name, industry, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Showing {filteredCompanies.length} of {companies.length} recruiting organizations
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map(company => {
          const companyDrives = drives?.filter(d => d.company?.id === company.id) || [];
          const maxPackage = companyDrives.length > 0 
            ? Math.max(...companyDrives.map(d => d.packageLpa || 0))
            : null;

          return (
            <div 
              key={company.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={company.logoUrl || 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100'}
                      alt={company.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm"
                    />
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg">
                        {company.name}
                      </h3>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {company.industry || 'Technology'}
                      </span>
                    </div>
                  </div>

                  {maxPackage && (
                    <div className="text-right">
                      <span className="text-base font-black text-emerald-600">{maxPackage} LPA</span>
                      <p className="text-[10px] text-slate-400 font-medium">Top CTC</p>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-500 mt-4 line-clamp-3 font-medium">
                  {company.description || 'Global corporate partner actively recruiting graduates through PlacementIQ.'}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{company.location || 'Multiple Locations'}</span>
                  </div>

                  {company.hrContactPerson && (
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{company.hrContactPerson} ({company.contactEmail})</span>
                    </div>
                  )}

                  {company.websiteUrl && (
                    <div className="flex items-center space-x-2 text-indigo-600 font-semibold">
                      <Globe className="w-3.5 h-3.5 flex-shrink-0" />
                      <a 
                        href={company.websiteUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="truncate hover:underline flex items-center space-x-1"
                      >
                        <span>Official Careers Site</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100">
                <button
                  onClick={() => onSelectCompanyJobs && onSelectCompanyJobs(company.name)}
                  className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>View Open Campus Drives ({companyDrives.length})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
