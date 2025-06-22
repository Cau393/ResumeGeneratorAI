import React, { useState } from 'react';
import api from '../../api';

const ResumeEnhancerPage = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [enhancedResume, setEnhancedResume] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a PDF file.');
      setFile(null);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelect(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setEnhancedResume(null);

    try {
      const formData = new FormData();
      formData.append('resume_file', file);

      const response = await api.post('/resumeenhancer/enhance/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setEnhancedResume(response.data);
    } catch (err) {
      console.error('Enhancement failed:', err);
      setError(
        err.response?.data?.detail || 
        err.response?.data?.error || 
        'Failed to enhance resume. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!enhancedResume?.id) return;

    try {
      const response = await api.get(`/resumeenhancer/download/${enhancedResume.id}/`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `enhanced_resume_${enhancedResume.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      setError('Failed to download enhanced resume. Please try again.');
    }
  };

  const resetForm = () => {
    setFile(null);
    setEnhancedResume(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Resume Enhancer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your existing resume and let our AI enhance it with better formatting, 
            keywords, and content suggestions to help you stand out.
          </p>
        </div>

        {!enhancedResume ? (
          /* Upload Form */
          <div className="card max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-400 bg-blue-50'
                    : file
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                
                <div className="space-y-4">
                  {file ? (
                    <div className="flex items-center justify-center">
                      <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                  )}
                  
                  <div>
                    {file ? (
                      <div>
                        <p className="text-lg font-medium text-green-700">
                          {file.name}
                        </p>
                        <p className="text-sm text-green-600">
                          File size: {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-medium text-gray-700">
                          Drop your resume here, or click to browse
                        </p>
                        <p className="text-sm text-gray-500">
                          PDF files only, max 10MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={!file || isUploading}
                  className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                    !file || isUploading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isUploading ? (
                    <div className="flex items-center">
                      <div className="loading-spinner mr-2 h-5 w-5"></div>
                      Enhancing Resume...
                    </div>
                  ) : (
                    'Enhance My Resume'
                  )}
                </button>
              </div>
            </form>

            {/* Features */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                What our AI will do:
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">Optimize formatting and layout</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">Add relevant keywords</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">Improve content structure</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">Ensure ATS compatibility</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="space-y-8">
            {/* Success Message */}
            <div className="card max-w-2xl mx-auto text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Resume Enhanced Successfully!
              </h2>
              
              <p className="text-gray-600 mb-6">
                Your resume has been enhanced with AI-powered improvements. 
                Download your enhanced resume below.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleDownload}
                  className="btn-primary"
                >
                  Download Enhanced Resume
                </button>
                
                <button
                  onClick={resetForm}
                  className="btn-outline"
                >
                  Enhance Another Resume
                </button>
              </div>
            </div>

            {/* Enhancement Details */}
            {enhancedResume.improvements && (
              <div className="card max-w-4xl mx-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Improvements Made:
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {enhancedResume.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-blue-600 text-sm font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">{improvement.title}</h4>
                        <p className="text-sm text-gray-600">{improvement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeEnhancerPage;