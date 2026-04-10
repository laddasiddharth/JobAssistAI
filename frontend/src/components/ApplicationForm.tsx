import React, { useState } from 'react';
import apiClient from '../api/axios';

export interface ApplicationFormData {
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
    <form onSubmit={handleSubmit} className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-200/50 px-6 md:px-8 py-5 shadow-sm z-10">
        <h2 className="text-2xl font-bold text-slate-800">
          {initialData ? '✎ Edit Application' : '+ Track New Job'}
        </h2>
        <p className="text-sm text-slate-500 mt-1">Fill in the details or use AI to auto-extract from a job description</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-6">
        {error && (
          <div className="p-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {error}
          </div>
        )}

        {error && (
          <div className="p-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            {error}
          </div>
        )}

        {/* AI Parsing Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200/50 rounded-xl p-5">
          <label className="flex items-center gap-2 mb-3 text-sm font-bold text-indigo-900">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            AI Auto-Extract (Paste Job Description)
          </label>
          <textarea
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleChange}
            className="w-full px-4 py-3 text-sm border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white/50 hover:bg-white text-slate-800 placeholder-slate-400 resize-none"
            rows={5}
            placeholder="Paste the full job description here and we'll extract company, role, skills..."
          />
          <button
            type="button"
            onClick={handleParseAI}
            disabled={isParsing}
            className="mt-3 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 transition-all duration-200">
            {isParsing ? (
              <>
                <span className="inline-block animate-spin mr-2">⚡</span>
                Parsing with AI...
              </>
            ) : (
              'Extract from Description'
            )}
          </button>
        </div>

        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2.5 text-sm font-semibold text-slate-700">Company Name *</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 hover:bg-slate-100/50 text-slate-800 placeholder-slate-400"
              placeholder="e.g., Tech Corp Inc."
            />
          </div>
          <div>
            <label className="block mb-2.5 text-sm font-semibold text-slate-700">Job Role *</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 hover:bg-slate-100/50 text-slate-800 placeholder-slate-400"
              placeholder="e.g., Senior Software Engineer"
            />
          </div>
        </div>

        {/* Status & Salary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-2.5 text-sm font-semibold text-slate-700">Application Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 hover:bg-slate-100/50 text-slate-800"
            >
              <option value="Applied">Applied</option>
              <option value="Phone Screen">Phone Screen</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block mb-2.5 text-sm font-semibold text-slate-700">Salary Range (Optional)</label>
            <input
              type="text"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
              placeholder="e.g., $120k - $160k"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 hover:bg-slate-100/50 text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Job Link */}
        <div>
          <label className="block mb-2.5 text-sm font-semibold text-slate-700">Job Posting URL</label>
          <input
            type="url"
            name="jdLink"
            value={formData.jdLink}
            onChange={handleChange}
            placeholder="https://example.com/job/..."
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 hover:bg-slate-100/50 text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block mb-2.5 text-sm font-semibold text-slate-700">Notes & AI-Extracted Details</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-slate-50 hover:bg-slate-100/50 text-slate-800 placeholder-slate-400 resize-none"
            rows={4}
            placeholder="Add your notes, extracted skills, or anything relevant..."
          />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200/50 px-6 md:px-8 py-4 flex justify-end gap-3 shadow-lg shadow-slate-900/5">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg shadow-lg hover:shadow-indigo-500/50 hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 transform active:scale-95"
        >
          {initialData ? 'Save Changes' : 'Track This Job'}
        </button>
      </div>
    </form>
  );
};

export default ApplicationForm;
