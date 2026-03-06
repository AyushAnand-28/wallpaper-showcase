import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import BrowsePage from './pages/BrowsePage';
import AuthPage from './pages/AuthPage';
import CartPage from './pages/CartPage';
import ConsumerDashboard from './pages/ConsumerDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
      <div className="loading-spinner" />
    </div>
  );
  if (!user) return <Navigate to="/auth" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'STORE_OWNER' ? '/dashboard/store' : '/dashboard'} replace />;
  }
  return children;
}

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="CONSUMER">
              <ConsumerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/store"
          element={
            <ProtectedRoute role="STORE_OWNER">
              <StoreOwnerDashboard />
            </ProtectedRoute>
          }
        />
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
