import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { getCartCount } = useCart();

  const navigation = [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const cartCount = getCartCount();

  // Scroll to top whenever location changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  const handleLogoClick = (e) => {
    e.preventDefault();
    // If we're on the home page, scroll to top
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Otherwise, navigate to home page
      navigate('/');
    }
  };

  return (
    <>
      <nav className="nav-header">
        <div className="flex items-center justify-between w-full px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={handleLogoClick}>
            <img 
              src="/images/logo.jpg" 
              alt="AgriCart Ai Logo" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              AgriCart Ai
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="nav-link"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && (
              <Link to="/marketplace/cart" className="relative p-2 text-gray-600 hover:text-gray-900">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Login
            </Link>
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 z-50 relative"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="md:hidden fixed top-[4.5rem] left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 max-h-[calc(100vh-4.5rem)] overflow-y-auto">
            <div className="py-4 px-6 space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block text-gray-600 hover:text-gray-900 font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {isAuthenticated && (
                  <Link
                    to="/marketplace/cart"
                    className="block text-center py-2 text-gray-600 hover:text-gray-900 font-medium relative"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5 inline mr-2" />
                    Cart
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}
                <Link
                  to="/login"
                  className="block text-center py-2 text-gray-600 hover:text-gray-900 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <button
                  onClick={() => {
                    navigate('/signup');
                    setMobileMenuOpen(false);
                  }}
                  className="btn-primary w-full"
                >
                  Get Started Free
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;