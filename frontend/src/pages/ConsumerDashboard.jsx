import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const STATUS_BADGE = {
  PENDING:   { cls: 'badge-amber', label: '⏳ Pending' },
  CONFIRMED: { cls: 'badge-blue',  label: '✅ Confirmed' },
  COMPLETED: { cls: 'badge-green', label: '🎉 Completed' },
  CANCELLED: { cls: 'badge-gray',   label: '❌ Cancelled' },
};

const DEMO_ORDERS = [
  { _id: 'ord001', store: { name: 'The Artisan Oven' }, items: [{ name: 'Sourdough Loaf', quantity: 2 }], totalPrice: 90, status: 'COMPLETED', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { _id: 'ord002', store: { name: 'Green Leaf Kitchen' }, items: [{ name: 'Organic Spinach', quantity: 3 }], totalPrice: 60, status: 'CONFIRMED', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { _id: 'ord003', store: { name: 'Le Petit Sucre' }, items: [{ name: 'Croissant Box' }], totalPrice: 80, status: 'PENDING', createdAt: new Date().toISOString() },
  { _id: 'ord004', store: { name: 'Desi Dairy' }, items: [{ name: 'Aged Cheddar' }], totalPrice: 120, status: 'CANCELLED', createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
];

const STATS_DEMO = [
  { icon: '📦', value: 24, label: 'Orders Placed', change: '+3 this week' },
  { icon: '⚖️', value: '42 kg', label: 'Food Rescued', change: '+5kg this month' },
  { icon: '💰', value: '₹1,850', label: 'Money Saved', change: '+₹320 this month' },
  { icon: '🌍', value: '105 kg', label: 'CO₂ Prevented', change: '+12kg this month' },
];

export default function ConsumerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    api.get('/orders/me')
      .then(r => setOrders(r.data.orders || r.data || []))
      .catch(() => setOrders(DEMO_ORDERS))
      .finally(() => setLoading(false));
  }, []);

  const displayOrders = orders.length > 0 ? orders : DEMO_ORDERS;

  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'orders',    icon: '📦', label: 'My Orders' },
    { id: 'browse',    icon: '🛒', label: 'Browse', link: '/browse' },
    { id: 'profile',   icon: '👤', label: 'Profile' },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar - Editorial */}
      <aside className="sidebar">
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--outline-variant)', marginBottom: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginBottom: 12, border: '1px solid var(--primary)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--on-surface)' }}>{user?.name || 'Consumer'}</div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: 'var(--on-surface-variant)', letterSpacing: '0.5px' }}>{user?.email || 'user@example.com'}</div>
          <div style={{ marginTop: 12 }}><span className="badge badge-green">🌱 Food Rescuer</span></div>
        </div>
        
        <div className="sidebar-section-title">Menu</div>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => { if (item.link) navigate(item.link); else setActiveTab(item.id); }}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </aside>

      <main className="dashboard-main">
        {activeTab === 'dashboard' && (
          <>
            <div style={{ borderBottom: '1px solid var(--primary)', paddingBottom: 24, marginBottom: 32, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div>
                <h2 className="display-sm" style={{ color: 'var(--primary)' }}>Welcome back, {user?.name?.split(' ')[0] || 'Rescuer'}!</h2>
                <p className="body-md mt-2" style={{ fontStyle: 'italic', color: 'var(--on-surface-variant)' }}>Here is your food rescue impact diary.</p>
              </div>
              <Link to="/browse" className="btn btn-outline btn-sm">Find Deals →</Link>
            </div>

            {/* Stats - Grid matching editorial */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid var(--primary)', marginBottom: 40 }}>
              {STATS_DEMO.map((s, i) => (
                <div key={i} style={{ padding: '24px', borderRight: i < 3 ? '1px solid var(--primary)' : 'none', background: 'var(--surface)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>{s.value}</div>
                  <div className="label-sm" style={{ marginTop: 8, color: 'var(--on-surface-variant)' }}>{s.label}</div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', marginTop: 4, fontStyle: 'italic', color: 'var(--on-surface-variant)' }}>{s.change}</div>
                </div>
              ))}
            </div>

            {/* Impact bar */}
            <div className="editorial-box" style={{ padding: '32px', marginBottom: 40, display: 'flex', gap: 32, background: 'var(--surface-low)' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'transparent', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🌿</div>
              <div style={{ flex: 1 }}>
                 <div className="title-md" style={{ color: 'var(--primary)', marginBottom: 4 }}>Impact Level: Food Guardian</div>
                 <div className="body-md mb-3" style={{ fontStyle: 'italic', color: 'var(--on-surface-variant)' }}>42kg rescued — 8kg to reach Eco Hero!</div>
                 
                 <div className="progress-bar" style={{ background: 'var(--surface-high)' }}>
                   <div className="progress-bar-fill" style={{ width: '84%' }} />
                 </div>
                 <div className="label-sm mt-2" style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--on-surface)' }}>
                   <span>42 kg rescued</span><span>50 kg goal</span>
                 </div>
              </div>
            </div>

            {/* Recent orders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="title-lg">Recent Orders</h3>
              </div>
              {loading ? <div className="loading-spinner" /> : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Store</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayOrders.slice(0, 5).map(order => {
                        const badge = STATUS_BADGE[order.status] || STATUS_BADGE.PENDING;
                        return (
                          <tr key={order._id}>
                            <td><span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px' }}>#{order._id.slice(-6).toUpperCase()}</span></td>
                            <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{order.store?.name || '—'}</td>
                            <td style={{ fontStyle: 'italic', color: 'var(--on-surface-variant)' }}>
                              {order.items?.map(i => i.name || i.product?.name).filter(Boolean).join(', ') || '—'}
                            </td>
                            <td><span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--primary)' }}>₹{order.totalPrice?.toFixed(2)}</span></td>
                            <td><span className={`badge ${badge.cls}`}>{badge.label}</span></td>
                            <td style={{ fontSize: '0.8125rem' }}>
                              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <>
            <div style={{ borderBottom: '1px solid var(--primary)', paddingBottom: 24, marginBottom: 32 }}>
              <h2 className="display-sm" style={{ color: 'var(--primary)' }}>Order History</h2>
            </div>
            {loading ? <div className="loading-spinner" /> : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th><th>Store</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayOrders.map(order => {
                      const badge = STATUS_BADGE[order.status] || STATUS_BADGE.PENDING;
                      return (
                        <tr key={order._id}>
                          <td><span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px' }}>#{order._id.slice(-6).toUpperCase()}</span></td>
                          <td style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{order.store?.name || '—'}</td>
                          <td style={{ fontStyle: 'italic', color: 'var(--on-surface-variant)' }}>
                            {order.items?.map(i => `${i.name || i.product?.name}${i.quantity > 1 ? ` ×${i.quantity}` : ''}`).filter(Boolean).join(', ') || '—'}
                          </td>
                          <td><span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--primary)' }}>₹{order.totalPrice?.toFixed(2)}</span></td>
                          <td><span className={`badge ${badge.cls}`}>{badge.label}</span></td>
                          <td style={{ fontSize: '0.8125rem' }}>
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === 'profile' && (
          <div style={{ maxWidth: 600 }}>
             <div style={{ borderBottom: '1px solid var(--primary)', paddingBottom: 24, marginBottom: 32 }}>
              <h2 className="display-sm" style={{ color: 'var(--primary)' }}>Profile Details</h2>
            </div>
            
            <div className="editorial-box" style={{ padding: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--outline-variant)' }}>
                 <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'transparent', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontFamily: 'var(--font-display)', color: 'var(--primary)', fontWeight: 800 }}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="display-sm" style={{ lineHeight: 1 }}>{user?.name || 'Consumer'}</div>
                  <div className="body-md mt-1" style={{ fontStyle: 'italic', color: 'var(--on-surface-variant)' }}>{user?.email}</div>
                  <span className="badge badge-green mt-3">🌱 Rescuer Badge</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[['Full Name', user?.name], ['Email Address', user?.email], ['Phone Number', user?.phone || 'Not set'], ['Account Type', user?.role]].map(([k, v], idx) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: idx !== 3 ? '1px solid var(--outline-variant)' : 'none' }}>
                    <span className="label-sm" style={{ color: 'var(--on-surface-variant)' }}>{k}</span>
                    <span className="body-md" style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{v || '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
