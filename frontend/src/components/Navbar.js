import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

const Navbar = () => {
  const { user, isLoggedIn, logout, isPremium } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isManagingBilling, setIsManagingBilling] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleManageBilling = async () => {
    if (!isLoggedIn) return;
    
    setIsManagingBilling(true);
    try {
      const response = await api.post('/payments/create-portal-session/');
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Failed to create billing portal session:', error);
      alert('Failed to open billing portal. Please try again.');
    } finally {
      setIsManagingBilling(false);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">ResumeAI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            
            {isLoggedIn && (
              <>
                <Link to="/resume-enhancer" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Resume Enhancer
                </Link>
                <Link to="/resume-builder" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Resume Builder
                </Link>
              </>
            )}
            
            <Link to="/pricing" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Pricing
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {/* User Status Badge */}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isPremium() ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {isPremium() ? 'Premium' : 'Free'}
                </span>
                
                {/* Manage Billing Button */}
                {isPremium() && (
                  <button
                    onClick={handleManageBilling}
                    disabled={isManagingBilling}
                    className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  >
                    {isManagingBilling ? 'Loading...' : 'Manage Billing'}
                  </button>
                )}
                
                {/* User Menu */}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700 text-sm">Hi, {user?.first_name || user?.username}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
                Home
              </Link>
              
              {isLoggedIn && (
                <>
                  <Link to="/resume-enhancer" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
                    Resume Enhancer
                  </Link>
                  <Link to="/resume-builder" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
                    Resume Builder
                  </Link>
                </>
              )}
              
              <Link to="/pricing" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
                Pricing
              </Link>

              {isLoggedIn ? (
                <div className="border-t border-gray-200 pt-4 pb-3">
                  <div className="flex items-center px-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isPremium() ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {isPremium() ? 'Premium' : 'Free'}
                    </span>
                    <span className="ml-3 text-gray-700 text-sm">Hi, {user?.first_name || user?.username}</span>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    {isPremium() && (
                      <button
                        onClick={handleManageBilling}
                        disabled={isManagingBilling}
                        className="block w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium disabled:opacity-50"
                      >
                        {isManagingBilling ? 'Loading...' : 'Manage Billing'}
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 pb-3">
                  <Link to="/login" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
                    Login
                  </Link>
                  <Link to="/register" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;