import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { isLoggedIn, user, isPremium } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Create Perfect Resumes with AI
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Transform your career with AI-powered resume enhancement and professional resume building tools.
            </p>
            
            {isLoggedIn ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/resume-enhancer" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
                    Enhance Your Resume
                  </Link>
                  <Link to="/resume-builder" className="btn-outline border-white text-white hover:bg-white hover:text-blue-600">
                    Build New Resume
                  </Link>
                </div>
                
                {/* User Status */}
                <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <p className="text-lg">
                    Welcome back, <span className="font-semibold">{user?.first_name || user?.username}</span>!
                  </p>
                  <p className="text-blue-100">
                    Your plan: <span className={`font-semibold ${
                      isPremium() ? 'text-yellow-300' : 'text-white'
                    }`}>
                      {isPremium() ? 'Premium' : 'Free'}
                    </span>
                  </p>
                  {!isPremium() && (
                    <Link to="/pricing" className="inline-block mt-2 text-yellow-300 hover:text-yellow-100 underline">
                      Upgrade to Premium →
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="btn-outline border-white text-white hover:bg-white hover:text-blue-600">
                    Sign In
                  </Link>
                </div>
                <p className="text-blue-100">
                  Join thousands of professionals who've landed their dream jobs
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Tools for Your Career Success
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to create, enhance, and optimize your resume
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Resume Builder */}
            <div className="card text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Resume Builder</h3>
              <p className="text-gray-600 mb-4">
                Create stunning resumes with our intuitive builder. Choose from professional templates and customize every detail.
              </p>
              <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                Premium Feature
              </span>
            </div>

            {/* AI Enhancement */}
            <div className="card text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Enhancement</h3>
              <p className="text-gray-600 mb-4">
                Upload your existing resume and let our AI enhance it with better formatting, keywords, and content suggestions.
              </p>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Free Feature
              </span>
            </div>

            {/* Premium Features */}
            <div className="card text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Benefits</h3>
              <p className="text-gray-600 mb-4">
                Unlock advanced templates, unlimited downloads, cover letter builder, and priority support.
              </p>
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                Premium Plans
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of professionals who've successfully landed their dream jobs with our AI-powered tools.
          </p>
          
          {!isLoggedIn && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary">
                Start Free Today
              </Link>
              <Link to="/pricing" className="btn-outline">
                View Pricing Plans
              </Link>
            </div>
          )}
          
          {isLoggedIn && !isPremium() && (
            <Link to="/pricing" className="btn-primary">
              Upgrade to Premium
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;