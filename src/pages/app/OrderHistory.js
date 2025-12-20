import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle,
  Clock,
  XCircle,
  Eye
} from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  // Fetch order history
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/marketplace/orders');
        const data = await response.json();
        
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-100' };
      case 'confirmed':
        return { icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-100' };
      case 'processing':
        return { icon: Package, color: 'text-indigo-500', bg: 'bg-indigo-100' };
      case 'shipped':
        return { icon: Truck, color: 'text-purple-500', bg: 'bg-purple-100' };
      case 'delivered':
        return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100' };
      case 'cancelled':
        return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100' };
      default:
        return { icon: Clock, color: 'text-gray-500', bg: 'bg-gray-100' };
    }
  };

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  // Close order details
  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  // Cancel order
  const cancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const response = await fetch(`/api/marketplace/orders/${orderId}/cancel`, {
          method: 'PUT'
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Update orders list
          setOrders(orders.map(order => 
            order._id === orderId 
              ? { ...order, orderStatus: 'cancelled' } 
              : order
          ));
          
          // If viewing this order, update it too
          if (selectedOrder && selectedOrder._id === orderId) {
            setSelectedOrder({ ...selectedOrder, orderStatus: 'cancelled' });
          }
          
          alert('Order cancelled successfully');
        } else {
          alert('Failed to cancel order: ' + data.message);
        }
      } catch (error) {
        console.error('Error cancelling order:', error);
        alert('Failed to cancel order');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Package className="w-8 h-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        </div>

        {orders.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => {
              const StatusIcon = getStatusInfo(order.orderStatus).icon;
              const statusColor = getStatusInfo(order.orderStatus).color;
              const statusBg = getStatusInfo(order.orderStatus).bg;
              
              return (
                <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                          {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items
                        </p>
                      </div>
                      
                      <div className="mt-4 sm:mt-0 flex items-center">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${statusBg}`}>
                          <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                        </div>
                        <div className="ml-3">
                          <span className={`text-sm font-medium ${statusColor} capitalize`}>
                            {order.orderStatus}
                          </span>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 4).map((item, index) => (
                          <img
                            key={index}
                            src={item.thumbnail || '/placeholder-product.jpg'}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg border-2 border-white"
                          />
                        ))}
                        {order.items.length > 4 && (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-500">
                              +{order.items.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 sm:mt-0 flex space-x-3">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:text-gray-900"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </button>
                        
                        {(order.orderStatus === 'pending' || order.orderStatus === 'confirmed') && (
                          <button
                            onClick={() => cancelOrder(order._id)}
                            className="px-4 py-2 text-red-600 hover:text-red-800"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Package className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">
              You haven't placed any orders yet. Start shopping now!
            </p>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Marketplace
            </button>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Order #{selectedOrder.orderNumber}
                </h2>
                <button
                  onClick={closeOrderDetails}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Order Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Order Date:</span>
                        <span>{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Order Status:</span>
                        <span className={`capitalize ${getStatusInfo(selectedOrder.orderStatus).color}`}>
                          {selectedOrder.orderStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Payment Method:</span>
                        <span className="capitalize">
                          {selectedOrder.paymentMethod.replace('-', ' ')}
                        </span>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tracking Number:</span>
                          <span>{selectedOrder.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Shipping Address</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                      <p className="text-gray-600">{selectedOrder.shippingAddress.addressLine1}</p>
                      {selectedOrder.shippingAddress.addressLine2 && (
                        <p className="text-gray-600">{selectedOrder.shippingAddress.addressLine2}</p>
                      )}
                      <p className="text-gray-600">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.district}</p>
                      <p className="text-gray-600">{selectedOrder.shippingAddress.phone}</p>
                      {selectedOrder.shippingAddress.email && (
                        <p className="text-gray-600">{selectedOrder.shippingAddress.email}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="font-medium text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item._id} className="flex items-center border-b border-gray-100 pb-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={item.thumbnail || '/placeholder-product.jpg'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-gray-500 text-sm">SKU: {item.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(item.price)}</p>
                          <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal:</span>
                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping:</span>
                      <span>{formatCurrency(selectedOrder.shippingCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tax:</span>
                      <span>{formatCurrency(selectedOrder.tax)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Discount:</span>
                        <span className="text-green-600">-{formatCurrency(selectedOrder.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                      <span className="font-semibold">Total:</span>
                      <span className="font-semibold">{formatCurrency(selectedOrder.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;