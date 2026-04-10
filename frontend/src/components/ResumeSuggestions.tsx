import React, { useState } from 'react';
import apiClient from '../api/axios';

interface ResumeSuggestionsProps {
  jobDescription: string;
}

const ResumeSuggestions: React.FC<ResumeSuggestionsProps> = ({ jobDescription }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fetchSuggestions = async () => {
    if (!jobDescription.trim()) {
      setError('No job description provided. Please save the application first with a job description.');
      return;
    }

    setIsLoading(true);
    setError('');
    setCopiedIndex(null);

    try {
      const response = await apiClient.post('/ai/resume', { jobDescription });
      setSuggestions(response.data.suggestions || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate resume suggestions.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  return (
    <div className="p-4 mt-6 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          💡 AI Resume Suggestions
        </h3>
        <button
          onClick={fetchSuggestions}
          disabled={isLoading || !jobDescription}
          className={`px-4 py-2 text-sm font-medium text-white transition-colors rounded ${
            isLoading || !jobDescription ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isLoading ? 'Generating...' : suggestions.length > 0 ? 'Regenerate' : 'Generate Ideas'}
        </button>
      </div>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}

      {suggestions.length === 0 && !isLoading && !error && (
        <p className="text-sm text-gray-500 italic">
          Click generate to get 3-5 tailored resume bullet points based on this job description.
        </p>
      )}

      {suggestions.length > 0 && (
        <ul className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <li 
              key={index}
              className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-md shadow-sm"
            >
              <div className="flex-1 text-sm text-gray-700 leading-relaxed">
                <span className="font-bold text-indigo-500 mr-2">•</span>
                {suggestion}
              </div>
              <button
                onClick={() => copyToClipboard(suggestion, index)}
                className={`flex-shrink-0 px-3 py-1 text-xs font-semibold rounded border transition-colors ${
                  copiedIndex === index 
                    ? 'bg-green-100 border-green-300 text-green-700'
                    : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                }`}
                title="Copy to clipboard"
              >
                {copiedIndex === index ? 'Copied!' : 'Copy'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResumeSuggestions;
