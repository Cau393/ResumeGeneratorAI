import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import PricingPage from './pages/Pricing/PricingPage';
import PaymentSuccessPage from './pages/Payments/PaymentSuccessPage';
import PaymentCancelPage from './pages/Payments/PaymentCancelPage';
import ResumeEnhancerPage from './pages/ResumeEnhancer/ResumeEnhancerPage';
import ResumeBuilderPage from './pages/ResumeBuilder/ResumeBuilderPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/payment/success" element={<PaymentSuccessPage />} />
              <Route path="/payment/cancel" element={<PaymentCancelPage />} />
              <Route 
                path="/resume-enhancer" 
                element={
                  <ProtectedRoute>
                    <ResumeEnhancerPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/resume-builder" 
                element={
                  <ProtectedRoute requiresPremium={true}>
                    <ResumeBuilderPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;