import React from 'react';

export interface ApplicationData {
  _id: string;
  company: string;
  role: string;
  dateApplied: string | Date;
  status: string;
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

  // Assign a color based on the application status
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800';
      case 'Phone Screen':
        return 'bg-yellow-100 text-yellow-800';
      case 'Interview':
        return 'bg-purple-100 text-purple-800';
      case 'Offer':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      onClick={() => onClick(application._id)}
      className="p-4 mb-3 transition-all duration-200 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:shadow-md hover:border-blue-400 group"
    >
      <div className="mb-1">
        <h3 className="font-semibold text-gray-800 truncate group-hover:text-blue-600">
          {application.role}
        </h3>
        <p className="text-sm text-gray-600 truncate">{application.company}</p>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusBadgeStyles(application.status)}`}>
          {application.status}
        </span>
        <span className="text-xs font-medium text-gray-400">
          {formattedDate}
        </span>
      </div>
    </div>
  );
};

export default ApplicationCard;
