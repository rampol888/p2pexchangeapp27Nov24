import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import { Card } from './components/Card';
import { AuthProvider } from './contexts/AuthContext';
import { ContactUs } from './components/ContactUs';
import { TransactionProvider } from './contexts/TransactionContext';

function App() {
  return (
    <TransactionProvider>
      <Router>
        <AuthProvider>
          <div className="min-h-screen">
            <Navigation />
            <main className="pt-14">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes */}
                <Route path="/kyc" element={
                  <ProtectedRoute>
                    <KYCForm />
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
                  <Route path="payment-success" element={<PaymentSuccess />} />
                </Route>
                
                {/* Remove duplicate routes or protect them if needed */}
                <Route path="/card" element={
                  <ProtectedRoute>
                    <Card />
                  </ProtectedRoute>
                } />
                <Route path="/exchange" element={
                  <ProtectedRoute>
                    <Exchange />
                  </ProtectedRoute>
                } />
                <Route path="/wallet" element={
                  <ProtectedRoute>
                    <WalletComponent />
                  </ProtectedRoute>
                } />
                <Route path="/payments" element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                } />
                <Route path="/contact" element={<ContactUs />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </Router>
    </TransactionProvider>
  );
}

export default App;