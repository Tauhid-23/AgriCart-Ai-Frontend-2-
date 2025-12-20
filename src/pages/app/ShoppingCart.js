import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext'; // Use CartContext instead
import { 
  ArrowLeft, 
  ShoppingCart as CartIcon, 
  Plus, 
  Minus, 
  X, 
  Truck,
  Tag
} from 'lucide-react';

const ShoppingCart = () => {
  const { cartItems, loading, error, updateQuantity, removeFromCart, getCartTotal, getCartCount, clearCart } = useCart();
  const navigate = useNavigate();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    navigate('/marketplace/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <CartIcon className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Cart</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalAmount = getCartTotal();
  const totalItems = getCartCount();
  const shippingCost = totalAmount >= 1000 ? 0 : 60;
  const tax = totalAmount * 0.05;
  const discount = 0; // For now, no discount
  const grandTotal = totalAmount + shippingCost + tax - discount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/marketplace')}
            className="flex items-center text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Marketplace
          </button>
        </div>
      </div>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <CartIcon className="w-8 h-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>

        {cartItems && cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {totalItems} {totalItems === 1 ? 'Item' : 'Items'} in Cart
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item._id} className="p-6 flex flex-col sm:flex-row">
                      <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.product.thumbnail || '/placeholder-product.jpg'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{item.product.name}</h3>
                            <p className="text-gray-500 text-sm mt-1">SKU: {item.product.sku}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center">
                            <span className="text-lg font-semibold text-gray-900">
                              {formatCurrency(item.product.price)}
                            </span>
                            {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                {formatCurrency(item.product.originalPrice)}
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-4 sm:mt-0 flex items-center">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l disabled:opacity-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 h-8 flex items-center justify-center border-t border-b border-gray-300">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r disabled:opacity-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            
                            <span className="ml-4 text-lg font-semibold text-gray-900">
                              {formatCurrency(item.product.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 bg-gray-50 flex justify-end">
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear your cart?')) {
                        clearCart();
                      }
                    }}
                    className="px-4 py-2 text-red-600 hover:text-red-800 font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(totalAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Truck className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">Shipping</span>
                    </div>
                    <span className="font-medium">
                      {shippingCost > 0 ? formatCurrency(shippingCost) : 'Free'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="font-medium">{formatCurrency(tax)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Discount</span>
                      </div>
                      <span className="font-medium text-green-600">-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">{formatCurrency(grandTotal)}</span>
                  </div>
                  
                  <button
                    onClick={proceedToCheckout}
                    className="w-full mt-6 px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                  
                  <button
                    onClick={() => navigate('/marketplace')}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <CartIcon className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">
              Add some products to your cart and they will appear here
            </p>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Marketplace
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;