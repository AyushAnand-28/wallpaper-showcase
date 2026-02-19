import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path ? 'active' : '';
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      {/* Left — nav links */}
      <div className="navbar-links">
        <Link to="/browse" className={isActive('/browse')}>Browse</Link>
        <Link to="/#how-it-works">How It Works</Link>
        {user && user.role === 'STORE_OWNER' && (
          <Link to="/dashboard/store" className={isActive('/dashboard/store')}>My Store</Link>
        )}
        {user && user.role === 'CONSUMER' && (
          <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
        )}
      </div>

      {/* Center — brand box */}
      <div className="navbar-center">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="brand-name">SecondBite</span>
          <span className="brand-sub">Food Rescue Platform</span>
        </Link>
      </div>

      {/* Right — actions */}
      <div className="navbar-actions">
        {user ? (
          <>
            <Link to="/cart" className="cart-btn" title="Cart">
              🛒
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
            <div
              style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'var(--primary)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem',
                border: '1px solid var(--primary)', cursor: 'default',
              }}
              title={user.name}
            >
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/cart" className="cart-btn" title="Cart">
              🛒
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
            <Link to="/auth" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/auth?mode=register" className="btn btn-primary btn-sm">Join Free</Link>
          </>
        )}
      </div>
    </nav>
  );
}
