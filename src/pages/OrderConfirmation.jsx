// frontend/src/pages/OrderConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Truck, X } from 'lucide-react';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);

  useEffect(() => {
    if (location.state) {
      setOrderId(location.state.orderId || '');
      setOrderTotal(location.state.orderTotal || 0);
    }
  }, [location.state]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleBackToMarketplace = () => {
    navigate('/marketplace');
  };

  const handleViewOrders = () => {
    navigate('/marketplace/orders');
  };

  const handleClose = () => {
    navigate('/marketplace');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Close Button */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-end">
          <button 
            onClick={handleClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-8">Thank you for your purchase. Your order has been received.</p>
          
          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h2 className="font-medium text-gray-900 mb-2">Order Details</h2>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Order ID</span>
                <span className="font-medium">#{orderId.substring(0, 8)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Total Amount</span>
                <span className="font-medium">{formatPrice(orderTotal)}</span>
              </div>
            </div>
          )}
          
          <div className="bg-blue-50 rounded-lg p-4 mb-8 text-left">
            <div className="flex items-start">
              <Truck className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-900">Order Processing</h3>
                <p className="text-sm text-blue-800 mt-1">
                  Your order is being processed and will be shipped within 1-2 business days. 
                  You'll receive a confirmation email with tracking information shortly.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleViewOrders}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              View My Orders
            </button>
            <button
              onClick={handleBackToMarketplace}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Need help with your order? Contact our support team at support@agricart.ai</p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;