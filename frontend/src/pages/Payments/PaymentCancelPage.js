import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancelPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Cancel Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
            <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            No worries! Your payment was cancelled and no charges were made to your account.
          </p>
          
          <div className="space-y-4">
            <Link 
              to="/pricing" 
              className="w-full btn-primary block text-center"
            >
              Try Again
            </Link>
            
            <Link 
              to="/resume-enhancer" 
              className="w-full btn-outline block text-center"
            >
              Continue with Free Features
            </Link>
            
            <Link 
              to="/" 
              className="block text-blue-600 hover:text-blue-500 text-sm"
            >
              Return to Home
            </Link>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Still Available with Free Plan:
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• AI Resume Enhancement</li>
              <li>• 1 Resume Download per month</li>
              <li>• Basic Support</li>
            </ul>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              Need Help?
            </h3>
            <p className="text-sm text-blue-800">
              If you experienced any issues during checkout, please contact our support team. We're here to help!
            </p>
            <a 
              href="mailto:support@resumeai.com" 
              className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-500 underline"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;