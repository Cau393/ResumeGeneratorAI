import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const ResumeBuilderPage = () => {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await api.get('/resumebuilder/resumes/');
      setResumes(response.data.results || response.data);
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
      setError('Failed to load your resumes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateResume = async (e) => {
    e.preventDefault();
    
    if (!newResumeTitle.trim()) {
      setError('Please enter a title for your resume.');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const response = await api.post('/resumebuilder/resumes/', {
        title: newResumeTitle.trim()
      });
      
      setResumes(prev => [response.data, ...prev]);
      setNewResumeTitle('');
      setShowCreateForm(false);
    } catch (err) {
      console.error('Failed to create resume:', err);
      setError(
        err.response?.data?.detail || 
        err.response?.data?.error || 
        'Failed to create resume. Please try again.'
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      await api.delete(`/resumebuilder/resumes/${resumeId}/`);
      setResumes(prev => prev.filter(resume => resume.id !== resumeId));
    } catch (err) {
      console.error('Failed to delete resume:', err);
      setError('Failed to delete resume. Please try again.');
    }
  };

  const handleDownloadResume = async (resumeId, title) => {
    try {
      const response = await api.get(`/resumebuilder/resumes/${resumeId}/download/`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      setError('Failed to download resume. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Resume Builder
            </h1>
            <p className="text-xl text-gray-600">
              Create professional resumes with our premium builder
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary mt-4 sm:mt-0"
          >
            Create New Resume
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Create Resume Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Create New Resume
              </h3>
              
              <form onSubmit={handleCreateResume}>
                <div className="mb-4">
                  <label htmlFor="resume-title" className="label">
                    Resume Title
                  </label>
                  <input
                    id="resume-title"
                    type="text"
                    value={newResumeTitle}
                    onChange={(e) => setNewResumeTitle(e.target.value)}
                    className="input-field"
                    placeholder="e.g., Software Engineer Resume"
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewResumeTitle('');
                      setError(null);
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="btn-primary disabled:opacity-50"
                  >
                    {isCreating ? 'Creating...' : 'Create Resume'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Resumes Grid */}
        {resumes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No resumes yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first professional resume to get started.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div key={resume.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {resume.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created {new Date(resume.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Last updated {new Date(resume.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      resume.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {resume.status === 'completed' ? 'Complete' : 'Draft'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <Link
                      to={`/resume-builder/${resume.id}/edit`}
                      className="flex-1 btn-primary text-center text-sm"
                    >
                      Edit
                    </Link>
                    
                    {resume.status === 'completed' && (
                      <button
                        onClick={() => handleDownloadResume(resume.id, resume.title)}
                        className="flex-1 btn-outline text-sm"
                      >
                        Download
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleDeleteResume(resume.id)}
                    className="w-full text-red-600 hover:text-red-800 text-sm py-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Premium Features Info */}
        <div className="mt-16 card max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Premium Resume Builder Features
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Professional Templates</h4>
                <p className="text-sm text-gray-600">Choose from dozens of ATS-friendly templates</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Smart Suggestions</h4>
                <p className="text-sm text-gray-600">AI-powered content and formatting suggestions</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Multiple Formats</h4>
                <p className="text-sm text-gray-600">Download in PDF, Word, and other formats</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderPage;