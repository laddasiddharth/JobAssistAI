import React from 'react';

export interface ApplicationData {
  _id: string;
  company: string;
  role: string;
  dateApplied: string | Date;
  status: string;
  jobDescription?: string;
  jdLink?: string;
  notes?: string;
  salaryRange?: string;
}

interface ApplicationCardProps {
  application: ApplicationData;
  onClick: (id: string) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onClick }) => {
  // Format the date to be easily readable
  const formattedDate = new Date(application.dateApplied).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Assign a vibrant modern color based on the application status
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'Applied': return 'bg-sky-50 text-sky-600 ring-1 ring-sky-200/50';
      case 'Phone Screen': return 'bg-amber-50 text-amber-600 ring-1 ring-amber-200/50';
      case 'Interview': return 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200/50';
      case 'Offer': return 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/50';
      case 'Rejected': return 'bg-rose-50 text-rose-600 ring-1 ring-rose-200/50';
      default: return 'bg-slate-50 text-slate-600 ring-1 ring-slate-200/50';
    }
  };

  return (
    <div
      onClick={() => onClick(application._id)}
      className="p-5 mb-4 transition-all duration-300 bg-white border border-slate-200/80 rounded-xl shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-300 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-gradient-to-br from-indigo-50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase rounded-md ${getStatusBadgeStyles(application.status)}`}>
            {application.status}
          </span>
          <span className="text-xs font-medium text-slate-400/80 bg-slate-50 px-2 py-0.5 rounded-full">
            {formattedDate}
          </span>
        </div>

        <div className="mb-2">
          <h3 className="text-[17px] font-bold text-slate-800 leading-tight mb-1 truncate group-hover:text-indigo-600 transition-colors">
            {application.role}
          </h3>
          <p className="text-sm font-medium text-slate-500 truncate flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {application.company}
          </p>
        </div>

        {application.salaryRange && (
          <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {application.salaryRange}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;
