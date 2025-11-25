import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserPage from './pages/UserPage';
import CollectorPage from './pages/CollectorPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';
import FeaturesPage from './pages/FeaturesPage';
import SignupPage from './pages/SignupPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import PartnerPage from './pages/PartnerPage';
import RecyclerPartnerPage from './pages/RecyclerPartnerPage';
import BarangayDashboardPage from './pages/BarangayDashboardPage';
import Header from './components/Header';
import { SocketProvider } from './context/socket';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const ProtectedRouteOld = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  return isLoggedIn ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <SocketProvider>
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/partner" element={<PartnerPage />} />
            <Route path="/recycler-partner" element={<RecyclerPartnerPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/barangay-dashboard" element={<BarangayDashboardPage />} />
            <Route path="/user" element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            } />
            <Route path="/collector" element={
              <ProtectedRoute>
                <CollectorPage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </Router>
    </SocketProvider>
  );
}

export default App;
