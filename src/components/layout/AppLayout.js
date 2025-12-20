import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { 
  Home, 
  Sprout, 
  Calendar, 
  CheckSquare, 
  Search, 
  BookOpen, 
  Cloud, 
  TrendingUp, 
  Wheat, 
  Users, 
  GraduationCap, 
  Award, 
  Settings,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  User,
  Package,
  ShoppingCart,
  Loader2
} from 'lucide-react';

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { cartItems } = useCart();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Scroll to top whenever location changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  // Fetch real notifications (this would be implemented with a real API in a full implementation)
  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      // In a real implementation, this would call an API to get notifications
      // For now, we'll simulate with a small delay to show the loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Simulate real notifications based on user data
      const simulatedNotifications = [
        {
          id: 1,
          message: user?.plantsGrown > 0 
            ? `Remember to water your ${user.plantsGrown > 1 ? 'plants' : 'plant'} today` 
            : 'Welcome to AgriCart Ai! Start by adding your first plant.',
          time: '2 hours ago',
          read: false,
          type: 'reminder'
        },
        {
          id: 2,
          message: 'New community post: Monsoon gardening tips',
          time: '5 hours ago',
          read: false,
          type: 'community'
        },
        {
          id: 3,
          message: user?.level 
            ? `You've reached ${user.level} level! Keep growing!` 
            : 'Check out our new plant care guides in the Learning Hub',
          time: '1 day ago',
          read: true,
          type: 'achievement'
        }
      ];
      
      setNotifications(simulatedNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Fallback to basic notifications
      setNotifications([
        {
          id: 1,
          message: 'Welcome to AgriCart Ai!',
          time: 'Just now',
          read: false,
          type: 'welcome'
        }
      ]);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Fetch notifications when notifications panel is opened
  useEffect(() => {
    if (notificationsOpen) {
      fetchNotifications();
    }
  }, [notificationsOpen]);

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/my-garden', icon: Sprout, label: 'My Garden' },
    { path: '/calendar', icon: Calendar, label: 'Planting Calendar' },
    { path: '/tasks', icon: CheckSquare, label: 'Task Manager' },
    { path: '/diagnosis', icon: Search, label: 'Plant Diagnosis' },
    { path: '/database', icon: BookOpen, label: 'Plant Database' },
    { path: '/marketplace', icon: ShoppingCart, label: 'Marketplace' },
    { path: '/weather', icon: Cloud, label: 'Weather & Alerts' },
    { path: '/tracking', icon: TrendingUp, label: 'Growth Tracking' },
    { path: '/harvest', icon: Wheat, label: 'Harvest Tracker' },
    { path: '/community', icon: Users, label: 'Community' },
    { path: '/quotes', icon: Package, label: 'Quote History' },
    { path: '/learning', icon: GraduationCap, label: 'Learning Hub' },
    { path: '/achievements', icon: Award, label: 'Achievements' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Get user avatar - first letter of name or default
  const getUserAvatar = () => {
    if (user?.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Get user level or default
  const getUserLevel = () => {
    return user?.level || 'Budding Gardener';
  };

  // Calculate cart item count
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-emerald-900 to-green-800 
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        flex flex-col
      `}>
        <div className="flex items-center justify-between h-16 px-6 bg-emerald-800">
          <div className="flex items-center space-x-3">
            <img 
              src="/images/logo.jpg" 
              alt="AgriCart Ai Logo" 
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-white">AgriCart Ai</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-green-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`
                  w-full flex items-center px-3 py-2 mb-1 text-left rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-green-600 text-white transform scale-105 shadow-lg' 
                    : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile - Fixed at bottom */}
        <div className="mt-auto p-4 border-t border-green-700 bg-emerald-900 shrink-0">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
              {getUserAvatar()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{user?.fullName || 'User'}</p>
              <p className="text-green-200 text-sm truncate">{getUserLevel()}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Good Morning, {user?.fullName || 'Gardener'}! 🌱
                </h1>
                <p className="text-sm text-gray-600">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} • {user?.location?.city ? `${user.location.city}, ${user.location.division}` : 'Bangladesh'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Cart Icon with Item Count */}
              {isAuthenticated && (
                <button
                  onClick={() => handleNavigate('/marketplace/cart')}
                  className="relative p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </button>
              )}

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      <button
                        onClick={fetchNotifications}
                        className="text-sm text-green-600 hover:text-green-800"
                      >
                        Refresh
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {loadingNotifications ? (
                        <div className="p-4 flex items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                        </div>
                      ) : notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 ${
                              !notification.read ? 'bg-green-50' : ''
                            }`}
                          >
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Icon */}
              <div className="relative">
                <button
                  onClick={() => handleNavigate('/settings')}
                  className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-800 hover:bg-green-200 transition-colors"
                >
                  <User className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Overlay for notifications */}
      {notificationsOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setNotificationsOpen(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;