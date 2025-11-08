import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Plus, Minus, Trash2, X } from 'lucide-react';
import { marketplaceAPI } from '../services/api';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cartItems, loading, error, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login since this is a protected route
      if (confirm('You need to login to view your shopping cart. Would you like to login now?')) {
        navigate('/login', { state: { from: '/marketplace/cart' } });
      } else {
        navigate('/marketplace');
      }
      return;
    }
  }, [isAuthenticated, navigate]);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      setLocalError('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
      setLocalError('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    try {
      // Create order with cart items
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.price
        }))
      };
      
      const res = await marketplaceAPI.createOrder(orderData);
      
      // Clear cart after successful order
      await marketplaceAPI.clearCart();
      
      // Redirect to order confirmation
      navigate('/marketplace/orders/confirmation', { 
        state: { 
          orderId: res.data.order._id,
          orderTotal: res.data.order.totalAmount
        } 
      });
    } catch (error) {
      console.error('Error placing order:', error);
      setLocalError('Failed to place order. Please try again.');
    }
  };

  const handleBack = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/marketplace');
    }
  };

  const handleClose = () => {
    navigate('/marketplace');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header with Back and Close Buttons */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <button 
              onClick={handleBack}
              className="flex items-center text-green-600 hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="mr-2" />
              {isAuthenticated ? 'Back to Dashboard' : 'Back to Marketplace'}
            </button>
            
            <button 
              onClick={handleClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 1000 ? 0 : 100; // Free shipping over 1000 BDT
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back and Close Buttons */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button 
            onClick={handleBack}
            className="flex items-center text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="mr-2" />
            {isAuthenticated ? 'Back to Dashboard' : 'Back to Marketplace'}
          </button>
          
          <button 
            onClick={handleClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">Review and manage your items</p>
        </div>

        {(error || localError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error || localError}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to your cart before checking out</p>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center p-6 border-b border-gray-200 last:border-b-0">
                    <img
                      src={item.product.images?.[0] || item.product.thumbnail || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    
                    <div className="ml-6 flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">{item.product.category?.replace(/-/g, ' ')}</p>
                      <div className="mt-2 font-bold text-gray-900">
                        {formatPrice(item.product.price)}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                        className="p-2 border border-gray-300 rounded-l-lg hover:bg-gray-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-2 border-t border-b border-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        className="p-2 border border-gray-300 rounded-r-lg hover:bg-gray-50"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="ml-6 w-24 text-right font-bold text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="ml-6 p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={() => navigate('/marketplace')}
                  className="w-full mt-3 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;