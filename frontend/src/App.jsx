import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Exchange } from './components/Dashboard/Exchange';
import { Transactions } from './components/Dashboard/Transactions';
import { Payment } from './components/Dashboard/Payment';
import { SignupPage } from './components/SignupPage';
import { LoginPage } from './components/LoginPage';
import { KYCForm } from './components/KYCForm';
import { DashboardHome } from './components/Dashboard/DashboardHome';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PaymentSuccess } from './components/Dashboard/components/PaymentSuccess';
import { WalletComponent } from './components/WalletComponent';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route path="/kyc" element={
            <ProtectedRoute>
              <KYCForm />
            </ProtectedRoute>
          } />
          <Route path="/payment-success" element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="exchange" element={<Exchange />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="payment" element={<Payment />} />
            <Route path="wallet" element={<WalletComponent />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;