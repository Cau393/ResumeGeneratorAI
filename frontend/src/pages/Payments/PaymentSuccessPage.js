import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const { fetchUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const updateUserProfile = async () => {
      try {
        // Refresh user profile to get updated subscription status
        await fetchUserProfile();
      } catch (err) {
        console.error('Failed to update user profile:', err);
        setError('Failed to update your profile. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure Stripe webhook has processed
    const timer = setTimeout(updateUserProfile, 2000);
    return () => clearTimeout(timer);
  }, [fetchUserProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your premium subscription is now active and you have access to all premium features.
          </p>
          
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <p className="text-yellow-800 text-sm">{error}</p>
            </div>
          )}
          
          {sessionId && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Session ID:</span> {sessionId}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Save this for your records
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <Link 
              to="/resume-builder" 
              className="w-full btn-primary block text-center"
            >
              Start Building Your Resume
            </Link>
            
            <Link 
              to="/resume-enhancer" 
              className="w-full btn-outline block text-center"
            >
              Enhance Existing Resume
            </Link>
            
            <Link 
              to="/" 
              className="block text-blue-600 hover:text-blue-500 text-sm"
            >
              Return to Home
            </Link>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              What's Next?
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Access premium resume templates</li>
              <li>• Build unlimited resumes</li>
              <li>• Download in multiple formats</li>
              <li>• Get priority customer support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;