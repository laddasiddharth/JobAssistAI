import React from 'react';
import { ApplicationData } from './ApplicationCard';
import ResumeSuggestions from './ResumeSuggestions';

interface ApplicationDetailModalProps {
  application: ApplicationData;
  onClose: () => void;
}

const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({ application, onClose }) => {
  const formattedDate = new Date(application.dateApplied).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{application.role}</h2>
            <p className="text-lg font-medium text-blue-600">{application.company}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 transition-colors rounded-full hover:bg-gray-200 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Top Meta Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-white border border-gray-100 rounded-lg shadow-sm sm:grid-cols-4">
            <div>
              <p className="mb-1 text-xs text-gray-500 uppercase">Status</p>
              <p className="font-semibold text-gray-800">{application.status}</p>
            </div>
            <div>
              <p className="mb-1 text-xs text-gray-500 uppercase">Applied On</p>
              <p className="font-semibold text-gray-800">{formattedDate}</p>
            </div>
            <div>
              <p className="mb-1 text-xs text-gray-500 uppercase">Salary</p>
              <p className="font-semibold text-gray-800">{application.salaryRange || 'N/A'}</p>
            </div>
            <div>
              <p className="mb-1 text-xs text-gray-500 uppercase">Job Link</p>
              {application.jdLink ? (
                <a href={application.jdLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline truncate block">
                  View Posting
                </a>
              ) : (
                <p className="font-semibold text-gray-800">N/A</p>
              )}
            </div>
          </div>

          {/* Notes Section */}
          {application.notes && (
            <div>
              <h3 className="mb-2 text-sm font-bold text-gray-700 uppercase tracking-wide">Notes & AI Details</h3>
              <div className="p-4 text-sm text-gray-700 bg-yellow-50 border border-yellow-100 rounded-lg whitespace-pre-wrap">
                {application.notes}
              </div>
            </div>
          )}

          {/* Job Description */}
          {application.jobDescription && (
            <div>
              <h3 className="mb-2 text-sm font-bold text-gray-700 uppercase tracking-wide">Job Description</h3>
              <div className="p-4 text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-lg whitespace-pre-wrap max-h-60 overflow-y-auto">
                {application.jobDescription}
              </div>
            </div>
          )}

          {/* AI Resume Suggestions (Interactive Component) */}
          {application.jobDescription && (
            <ResumeSuggestions jobDescription={application.jobDescription} />
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailModal;