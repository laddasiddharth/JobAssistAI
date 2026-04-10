import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import KanbanBoard from '../components/KanbanBoard';
import { ApplicationData } from '../components/ApplicationCard';

const Dashboard: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/applications');
      setApplications(response.data.applications || []);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        // Unauthorized, clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError('Failed to load applications. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication on mount
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchApplications();
  }, [navigate]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Optimistic UI update
    const previousApplications = [...applications];
    setApplications((prev) =>
      prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app))
    );

    try {
      // Update backend
      await apiClient.put(`/applications/${id}`, { status: newStatus });
    } catch (err) {
      // Revert on failure
      setApplications(previousApplications);
      console.error('Failed to update application status:', err);
      // Can show an optional toast notification here
    }
  };

  const handleApplicationClick = (id: string) => {
    // For now, let's log it or navigate to a detail view
    // Example: navigate(`/applications/${id}`);
    console.log('Application clicked:', id);
    alert(`Application detail view for ID: ${id}\n(Modal functionality coming up next!)`);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="flex items-center justify-between mx-auto mb-8 max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800">My Job Applications</h1>
        <button 
          onClick={() => alert("Add Application form coming next!")}
          className="px-4 py-2 font-semibold text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
        >
          + Add Application
        </button>
      </div>

      <div className="mx-auto max-w-7xl">
        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <p className="text-lg font-medium text-gray-500 animate-pulse">Loading board...</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
            <KanbanBoard
              applications={applications}
              onStatusChange={handleStatusChange}
              onApplicationClick={handleApplicationClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
