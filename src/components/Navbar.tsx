import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, ShoppingBag, PhoneCall, User as UserIcon, LogOut, ChevronDown, ShoppingCart, ShieldCheck } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cart, addedMessage } = useCart();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLLIElement>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="glass sticky top-0 z-50 p-4 w-full main-navbar">
      {/* Success Message Toast */}
      {addedMessage && (
        <div className="cart-success-toast animate-fade-in-down">
          <div className="flex-center" style={{ gap: '0.5rem' }}>
            <ShoppingBag size={18} />
            <span>{addedMessage}</span>
          </div>
        </div>
      )}

      <div className="container flex-between">
        <Link to="/" className="flex-center logo-link" style={{ gap: '0.5rem' }}>
          <img 
            src="/image.png" 
            alt="Logo" 
            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
            onError={(e) => { (e.target as HTMLImageElement).src = '/logo.png'; }}
          />
          <span className="heading-sm text-primary mobile-hidden" style={{ fontFamily: 'Outfit', fontWeight: 800 }}>
            Heman Enterprises
          </span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="desktop-menu-container">
          <ul className="flex" style={{ gap: '2rem', alignItems: 'center' }}>
            {user ? (
              <>
                <li><Link to="/products" className="nav-link">All Products</Link></li>
                {user.role === 'admin' ? (
                  <>
                    <li><Link to="/admin" className="nav-link">Admin Dashboard</Link></li>
                    <li><Link to="/admin/orders" className="nav-link">Orders</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/about" className="nav-link">About Us</Link></li>
                    <li><Link to="/contact" className="nav-link">Contact Us</Link></li>
                    <li><Link to="/my-orders" className="nav-link">My Orders</Link></li>
                    <li>
                      <Link to="/cart" className="cart-btn flex-center" aria-label="View Cart">
                        <ShoppingCart size={22} color="var(--color-primary)" />
                        {cart.length > 0 && (
                          <span className="cart-badge">{cart.length}</span>
                        )}
                      </Link>
                    </li>
                  </>
                )}
                <li style={{ position: 'relative' }} ref={dropdownRef}>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)} 
                    className="user-profile-btn flex-center"
                  >
                    <div className="user-avatar flex-center">
                      <UserIcon size={18} />
                    </div>
                    <span className="user-name">{user.name}</span>
                    <ChevronDown size={14} className={`chevron-icon ${dropdownOpen ? 'rotate' : ''}`} />
                  </button>
                  
                  {/* User Dropdown */}
                  {dropdownOpen && (
                    <div className="card user-dropdown animate-fade-in-down" style={{ zIndex: 2000 }}>
                      <ul>
                        <li>
                          <button onClick={handleLogout} className="dropdown-item logout-btn">
                            <LogOut size={18} /> Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              </>
            ) : (
              <li><Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>Login</Link></li>
            )}
          </ul>
        </div>
        
        {/* Mobile Toggles & Cart */}
        <div className="flex-center" style={{ gap: '1rem' }}>
          {user && user.role !== 'admin' && (
            <Link to="/cart" className="cart-btn" aria-label="View Cart">
              <ShoppingCart size={24} />
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </Link>
          )}

          <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle menu">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mobile-menu-overlay animate-fade-in" onClick={toggleMenu} style={{ zIndex: 999 }}>
          <div className="mobile-menu-card card" onClick={(e) => e.stopPropagation()}>
            <ul className="flex-col" style={{ gap: '0.5rem' }}>
              <li><Link to="/" onClick={toggleMenu} className="mobile-nav-link"><Home size={20} /> Home</Link></li>
              {user ? (
                <>
                  <li><Link to="/products" onClick={toggleMenu} className="mobile-nav-link"><ShoppingBag size={20} /> All Products</Link></li>
                  {user.role === 'admin' ? (
                    <>
                      <li><Link to="/admin" onClick={toggleMenu} className="mobile-nav-link admin-text"><ShieldCheck size={20} /> Admin Dashboard</Link></li>
                      <li><Link to="/admin/orders" onClick={toggleMenu} className="mobile-nav-link admin-text"><ShoppingBag size={20} /> Orders</Link></li>
                    </>
                  ) : (
                    <>
                      <li><Link to="/about" onClick={toggleMenu} className="mobile-nav-link"><UserIcon size={20} /> About Us</Link></li>
                      <li><Link to="/contact" onClick={toggleMenu} className="mobile-nav-link"><PhoneCall size={20} /> Contact Us</Link></li>
                      <li><Link to="/my-orders" onClick={toggleMenu} className="mobile-nav-link"><ShoppingBag size={20} /> My Orders</Link></li>
                      <li><Link to="/cart" onClick={toggleMenu} className="mobile-nav-link"><ShoppingCart size={20} /> Cart</Link></li>
                    </>
                  )}
                  <div className="divider"></div>
                  <li className="mobile-user-info">Logged in as {user.name}</li>
                  <li style={{ marginTop: '0.5rem' }}><button onClick={() => { handleLogout(); toggleMenu(); }} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Logout</button></li>
                </>
              ) : (
                <>
                  <div className="divider"></div>
                  <li><Link to="/login" onClick={toggleMenu} className="mobile-nav-link"><UserIcon size={20} /> Login</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
      
      <style>{`
        .main-navbar {
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .desktop-menu-container { 
          display: none; 
        }
        .mobile-toggle { 
          background: transparent; 
          border: none; 
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nav-link { 
          font-weight: 600; 
          font-family: 'Inter', sans-serif; 
          position: relative; 
          font-size: 0.95rem;
          color: var(--text-secondary);
        }
        .nav-link:hover { 
          color: var(--color-primary); 
        }
        .nav-link::after { 
          content: ''; 
          position: absolute; 
          width: 0; 
          height: 2px; 
          bottom: -4px; 
          left: 0; 
          background-color: var(--color-primary); 
          transition: width 0.3s; 
        }
        .nav-link:hover::after { 
          width: 100%; 
        }
        .user-profile-btn {
          background: rgba(30, 58, 138, 0.05);
          padding: 0.4rem 0.8rem;
          border-radius: 2rem;
          gap: 0.6rem;
          transition: all 0.2s;
          border: 1px solid rgba(30, 58, 138, 0.1);
        }
        .user-profile-btn:hover {
          background: rgba(30, 58, 138, 0.1);
        }
        .user-avatar {
          background: var(--color-primary);
          color: white;
          border-radius: 50%;
          width: 32px;
          height: 32px;
        }
        .user-name {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--color-primary);
        }
        .chevron-icon {
          color: var(--text-muted);
          transition: transform 0.3s;
        }
        .chevron-icon.rotate {
          transform: rotate(180deg);
        }
        .user-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          min-width: 220px;
          padding: 0.5rem;
          z-index: 100;
          box-shadow: var(--shadow-xl);
          border: 1px solid rgba(0,0,0,0.05);
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.8rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        .dropdown-item:hover {
          background: rgba(30, 58, 138, 0.05);
          color: var(--color-primary);
        }
        .admin-link {
          color: var(--color-primary);
        }
        .logout-btn {
          width: 100%;
          border: none;
          background: transparent;
          color: #EF4444;
          cursor: pointer;
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.05);
          color: #B91C1C;
        }
        .mobile-menu-overlay {
          position: fixed;
          top: 73px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          z-index: 40;
          padding: 1rem;
        }
        .mobile-menu-card {
          width: 100%;
          padding: 1rem;
          box-shadow: var(--shadow-xl);
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.8rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
          color: var(--text-main);
          transition: all 0.2s;
        }
        .mobile-nav-link:hover {
          background: rgba(30, 58, 138, 0.05);
          color: var(--color-primary);
        }
        .divider {
          height: 1px;
          background: rgba(0,0,0,0.05);
          margin: 0.5rem 0;
        }
        .mobile-user-info {
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .admin-text {
          color: var(--color-primary);
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.3s ease-out;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Cart Styles */
        .cart-btn {
          background: transparent;
          border: none;
          padding: 0.5rem;
          position: relative;
          cursor: pointer;
          color: var(--color-primary);
        }
        .cart-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: #EF4444;
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid white;
        }
        .cart-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 320px;
          max-height: 500px;
          display: flex;
          flex-direction: column;
          z-index: 1001;
          padding: 0;
          overflow: hidden;
          box-shadow: var(--shadow-2xl);
          border: 1px solid rgba(0,0,0,0.08);
        }
        .cart-header {
          padding: 1rem;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          background: #F8FAFC;
        }
        .cart-items {
          flex: 1;
          overflow-y: auto;
          padding: 0.5rem;
        }
        .cart-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          border-bottom: 1px solid rgba(0,0,0,0.03);
        }
        .cart-item:last-child {
          border-bottom: none;
        }
        .cart-item-img {
          width: 50px;
          height: 50px;
          object-fit: contain;
          border-radius: 4px;
          background: #f1f5f9;
        }
        .cart-item-info {
          flex: 1;
        }
        .cart-item-name {
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.1rem;
          color: var(--text-main);
        }
        .cart-item-price {
          font-size: 0.8rem;
          color: var(--color-primary);
          font-weight: 700;
        }
        .remove-item-btn {
          background: transparent;
          border: none;
          color: #94A3B8;
          cursor: pointer;
          transition: color 0.2s;
        }
        .remove-item-btn:hover {
          color: #EF4444;
        }
        .empty-cart-text {
          padding: 2rem;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .cart-footer {
          padding: 1rem;
          background: #F8FAFC;
          border-top: 1px solid rgba(0,0,0,0.05);
        }
        .cart-total {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--color-primary);
        }
        
        /* Success Toast */
        .cart-success-toast {
          position: fixed;
          top: 85px;
          left: 50%;
          transform: translateX(-50%);
          background: #10B981;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 2rem;
          box-shadow: var(--shadow-lg);
          z-index: 1000;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          pointer-events: none;
        }

        @media (min-width: 768px) {
          .desktop-menu-container { display: block; }
          .mobile-toggle { display: none; }
          .mobile-hidden { display: inline; }
        }
        @media (max-width: 767px) {
          .mobile-hidden { display: none; }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
