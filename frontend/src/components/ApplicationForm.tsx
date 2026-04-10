import React, { useState } from 'react';
import apiClient from '../api/axios';

interface ApplicationFormData {
  company: string;
  role: string;
  status: string;
  jobDescription: string;
  jdLink?: string;
  notes?: string;
  salaryRange?: string;
}

interface ApplicationFormProps {
  initialData?: Partial<ApplicationFormData>;
  onSubmit: (data: ApplicationFormData) => void;
  onCancel: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    company: initialData?.company || '',
    role: initialData?.role || '',
    status: initialData?.status || 'Applied',
    jobDescription: initialData?.jobDescription || '',
    jdLink: initialData?.jdLink || '',
    notes: initialData?.notes || '',
    salaryRange: initialData?.salaryRange || '',
  });

  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleParseAI = async () => {
    if (!formData.jobDescription.trim()) {
      setError('Please paste a job description first to parse.');
      return;
    }

    setIsParsing(true);
    setError('');

    try {
      const response = await apiClient.post('/ai/parse', { text: formData.jobDescription });
      const { data } = response.data; // data contains company, role, skills, etc.

      setFormData((prev) => {
        let newNotes = prev.notes || '';
        
        // Append AI extracted details to notes for reference
        if (data.requiredSkills?.length || data.location) {
          const aiDetails = `\n\n--- AI Extracted Details ---\nLocation: ${data.location || 'N/A'}\nSeniority: ${data.seniority || 'N/A'}\nRequired Skills: ${data.requiredSkills?.join(', ')}\nBonus Skills: ${data.niceToHaveSkills?.join(', ')}`;
          newNotes += aiDetails;
        }

        return {
          ...prev,
          company: data.company !== 'Unknown' ? data.company : prev.company,
          role: data.role !== 'Unknown' ? data.role : prev.role,
          notes: newNotes.trim(),
        };
      });
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Failed to parse job description using AI.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.role) {
      setError('Company and Role are required.');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-gray-800">
        {initialData ? 'Edit Application' : 'Add New Application'}
      </h2>

      {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

      {/* AI Parsing Section */}
      <div className="p-4 mb-6 rounded-md bg-blue-50">
        <label className="block mb-2 text-sm font-bold text-blue-900">
          ✨ Job Description (Paste here to auto-fill)
        </label>
        <textarea
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm border border-blue-200 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
          rows={4}
          placeholder="Paste full job description here..."
        />
        <button
          type="button"
          onClick={handleParseAI}
          disabled={isParsing}
          className="px-4 py-2 mt-2 text-sm font-semibold text-white transition-colors bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isParsing ? 'Parsing with AI...' : 'Parse & Auto-fill'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Company *</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Role *</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="Applied">Applied</option>
            <option value="Phone Screen">Phone Screen</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Salary Range</label>
          <input
            type="text"
            name="salaryRange"
            value={formData.salaryRange}
            onChange={handleChange}
            placeholder="e.g. $80k - $100k"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-700">Job Link (URL)</label>
        <input
          type="url"
          name="jdLink"
          value={formData.jdLink}
          onChange={handleChange}
          placeholder="https://..."
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium text-gray-700">Notes & AI Extracted Skills</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 font-medium text-white bg-green-600 rounded hover:bg-green-700"
        >
          {initialData ? 'Save Changes' : 'Add Application'}
        </button>
      </div>
    </form>
  );
};

export default ApplicationForm;
