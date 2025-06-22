import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const PricingPage = () => {
  const { isLoggedIn, isPremium } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$9.99',
      period: '/month',
      description: 'Perfect for job seekers getting started',
      features: [
        'AI Resume Enhancement',
        '3 Resume Downloads per month',
        'Basic Templates',
        'Email Support',
        'ATS-Friendly Formats'
      ],
      popular: false,
      priceId: 'price_starter_monthly' // Replace with actual Stripe price ID
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19.99',
      period: '/month',
      description: 'Most popular choice for professionals',
      features: [
        'Everything in Starter',
        'Professional Resume Builder',
        'Unlimited Downloads',
        'Premium Templates',
        'Cover Letter Builder',
        'Priority Support',
        'LinkedIn Profile Optimization'
      ],
      popular: true,
      priceId: 'price_pro_monthly' // Replace with actual Stripe price ID
    },
    {
      id: 'business',
      name: 'Business',
      price: '$39.99',
      period: '/month',
      description: 'Advanced features for career professionals',
      features: [
        'Everything in Pro',
        'Advanced AI Insights',
        'Multiple Resume Versions',
        'Interview Preparation Tools',
        'Career Coaching Resources',
        'White-label Options',
        'API Access',
        'Dedicated Account Manager'
      ],
      popular: false,
      priceId: 'price_business_monthly' // Replace with actual Stripe price ID
    }
  ];

  const handleSubscribe = async (plan) => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    setLoadingPlan(plan.id);
    
    try {
      const response = await api.post('/payments/create-checkout-session/', {
        price_id: plan.priceId,
        success_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/payment/cancel`
      });
      
      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock the full potential of AI-powered resume building and career advancement tools.
            Start with our free features or upgrade for premium capabilities.
          </p>
          
          {isPremium() && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg inline-block">
              <p className="text-green-800 font-medium">
                🎉 You're currently on a Premium plan! Thank you for being a valued member.
              </p>
            </div>
          )}
        </div>

        {/* Free Plan */}
        <div className="mb-12">
          <div className="max-w-lg mx-auto">
            <div className="card border-2 border-gray-200">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-600">/forever</span>
                </div>
                <p className="text-gray-600 mb-6">Get started with basic resume enhancement</p>
                
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    AI Resume Enhancement
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    1 Resume Download per month
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Basic Support
                  </li>
                </ul>
                
                {!isLoggedIn ? (
                  <button
                    onClick={() => navigate('/register')}
                    className="w-full btn-outline"
                  >
                    Get Started Free
                  </button>
                ) : (
                  <div className="text-center text-gray-600">
                    ✓ You're using the free plan
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Premium Plans */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`card relative ${
                plan.popular
                  ? 'border-2 border-blue-500 shadow-xl'
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">{plan.period}</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <ul className="text-left space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loadingPlan === plan.id || isPremium()}
                  className={`w-full ${
                    plan.popular
                      ? 'btn-primary'
                      : 'btn-outline'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loadingPlan === plan.id ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-spinner mr-2 h-4 w-4"></div>
                      Processing...
                    </div>
                  ) : isPremium() ? (
                    'Current Plan'
                  ) : (
                    `Choose ${plan.name}`
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="text-gray-600">
                  Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600">
                  We accept all major credit cards, debit cards, and digital wallets through our secure Stripe payment processing.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Is there a free trial?
                </h3>
                <p className="text-gray-600">
                  Our free plan gives you access to basic features forever. You can upgrade to premium plans anytime to unlock advanced features.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Can I change my plan later?
                </h3>
                <p className="text-gray-600">
                  Absolutely! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;