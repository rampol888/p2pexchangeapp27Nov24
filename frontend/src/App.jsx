import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import P2PExchange from './components/P2PExchange';
import { SignupPage } from './components/SignupPage';
import LoginPage from './components/LoginPage';
import WalletComponent from './components/WalletComponent';
import CurrencyConverter from './components/CurrencyConverter';
import KYCForm from './components/kYCForm';
import { Dashboard } from './components/Dashboard';
import { Card } from './components/Card';
import './styles/globals.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<P2PExchange />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/wallet" element={<WalletComponent />} />
        <Route path="/currency-exchange" element={<CurrencyConverter />} />
        <Route path="/kyc" element={<KYCForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/card" element={<Card />} />
      </Routes>
    </Router>
  );
}