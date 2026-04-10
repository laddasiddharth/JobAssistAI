import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/axios';
import KanbanBoard from '../components/KanbanBoard';
import { type ApplicationData } from '../components/ApplicationCard';
import ApplicationDetailModal from '../components/ApplicationDetailModal';

const Dashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  // 1. Define React Query for fetching applications
  const { data: applications = [], isLoading, isError, error } = useQuery({
    queryKey: ['applications'],
    queryFn: async (): Promise<ApplicationData[]> => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        throw new Error('Not authenticated');
      }
      
      const response = await apiClient.get('/applications');
      return response.data.applications || [];
    },
    retry: (failureCount, err: unknown) => {
      const axiosError = err as { response?: { status?: number } };
      // Don't retry if unauthorized
      if (axiosError.response?.status === 401 || axiosError.response?.status === 403) return false;
      return failureCount < 2;
    }
  });

  // Handle unauthorized errors globally for the query
  const queryErr = error as { response?: { status?: number } } | null;
  if (isError && queryErr?.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  // 2. React Query Mutation for dragging and updating statuses optimistically
  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: string }) => {
      const response = await apiClient.put(`/applications/${id}`, { status: newStatus });
      return response.data;
    },
    onMutate: async ({ id, newStatus }) => {
      // Cancel outstanding refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ['applications'] });
      
      const previousApps = queryClient.getQueryData<ApplicationData[]>(['applications']);
      
      // Optimistically update
      if (previousApps) {
        queryClient.setQueryData<ApplicationData[]>(['applications'], old => 
          old?.map(app => app._id === id ? { ...app, status: newStatus } : app)
        );
      }
      
      // Return context for rollback
      return { previousApps };
    },
    onError: (_err, _variables, context) => {
      // Rollback on failure
      if (context?.previousApps) {
        queryClient.setQueryData(['applications'], context.previousApps);
      }
    },
    onSettled: () => {
      // Safely invalidate query cache so we refetch exactly from DB on failure or success to stay synced
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatus({ id, newStatus });
  };

  const handleApplicationClick = (id: string) => {
    setSelectedApplicationId(id);
  };

  const closeModal = () => {
    setSelectedApplicationId(null);
  };

  // Find selected application safely for the modal component
  const selectedApplication = applications.find((app: ApplicationData) => app._id === selectedApplicationId);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="flex items-center justify-between mx-auto mb-8 max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800">My Job Applications</h1>
        <button 
          onClick={() => alert("Add Application form coming next!")}
          className="px-4 py-2 font-semibold text-white transition-colors bg-blue-600 rounded hover:bg-blue-700 shadow-sm"
        >
          + Add Application
        </button>
      </div>

      <div className="mx-auto max-w-7xl">
        {isError && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">
            {'Failed to load applications. Please try again.'}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100 min-h-[60vh]">
            <p className="text-lg font-medium text-gray-500 animate-pulse">Loading Kanban board...</p>
          </div>
        ) : applications.length === 0 ? (
          // 3. User Empty State Layout gracefully instructing 1st step!
          <div className="flex flex-col items-center flex-1 justify-center p-16 text-center bg-white border-2 border-dashed border-gray-300 rounded-xl shadow-sm min-h-[60vh] max-h-[60vh]">
            <div className="mb-4 text-6xl">📥</div>
            <h2 className="mb-2 text-2xl font-bold text-gray-800">No applications tracked yet</h2>
            <p className="max-w-md text-gray-500 leading-relaxed mb-6">
              You haven't tracked any job applications. Click the <strong className="text-blue-600">"+ Add Application"</strong> button in the top right to start tracking an application!
            </p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto min-h-[60vh]">
            <KanbanBoard
              applications={applications}
              onStatusChange={handleStatusChange}
              onApplicationClick={handleApplicationClick}
            />
          </div>
        )}
      </div>

      {/* Detail View Render Component */}
      {selectedApplicationId && selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Dashboard;
