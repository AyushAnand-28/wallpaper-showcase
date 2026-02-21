import { useCart } from '../context/CartContext';

const CATEGORY_EMOJI = {
  BAKERY: '🥖', PRODUCE: '🥦', DAIRY: '🧀',
  MEAT: '🥩', SEAFOOD: '🐟', PANTRY: '🛒',
  PREPARED: '🍱', OTHER: '🍽️'
};

export default function ProductCard({ product }) {
  const { addItem, items } = useCart();

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const expiresIsToday = () => {
    if (!product.expiryDate) return false;
    const exp = new Date(product.expiryDate);
    const now = new Date();
    return exp.toDateString() === now.toDateString();
  };

  const expiresIsSoon = () => {
    if (!product.expiryDate) return false;
    const exp = new Date(product.expiryDate);
    const now = new Date();
    const diff = (exp - now) / (1000 * 60 * 60 * 24);
    return diff <= 3 && diff > 0;
  };

  const alreadyInCart = items.some(i => i.product._id === product._id);
  const isSoldOut = product.status === 'SOLD_OUT' || product.quantity <= 0;

  const stockPct = product.quantity && product.originalQuantity
    ? Math.min(100, Math.round((product.quantity / product.originalQuantity) * 100))
    : 60;

  return (
    <div className="product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="product-card-img-placeholder">
        {CATEGORY_EMOJI[product.category] || '🍽️'}
      </div>
      
      {discount > 0 && (
        <div className="product-discount-badge">{discount}% OFF</div>
      )}
      
      {expiresIsToday() && (
        <div className="product-expiry-badge">⚡ Expires Today</div>
      )}
      {!expiresIsToday() && expiresIsSoon() && (
        <div className="product-expiry-badge" style={{ background: 'var(--surface-high)', color: 'var(--on-surface)', border: '1px solid var(--outline-variant)' }}>⏰ Expires Soon</div>
      )}

      <div className="product-card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="product-name truncate">{product.name}</div>
        <div className="product-store">
          {product.store?.name || product.storeName || 'Local Store'}
        </div>

        <div className="product-price-row mt-2">
          <span className="product-price">₹{product.price.toFixed(2)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="product-original-price">₹{product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        <div style={{ flex: 1 }}></div>

        <div className="product-stock mt-4">
          <div className="product-stock-label">
            <span>Stock remaining</span>
            <span><span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem' }}>{product.quantity}</span> left</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${stockPct}%` }} />
          </div>
        </div>

        <button
          className={`btn w-full mt-4 ${isSoldOut ? 'btn-ghost' : alreadyInCart ? 'btn-outline' : 'btn-primary'}`}
          style={{ justifyContent: 'center' }}
          onClick={() => !isSoldOut && addItem(product)}
          disabled={isSoldOut}
        >
          {isSoldOut ? '❌ Sold Out' : alreadyInCart ? '✓ In Cart' : '+ Add to Cart'}
        </button>
      </div>
    </div>
  );
}
