import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Wallet, 
  Truck,
  CheckCircle
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], totalAmount: 0, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review, 4: Confirmation
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    postalCode: '',
    country: 'Bangladesh'
  });
  const [paymentMethod, setPaymentMethod] = useState('cash-on-delivery');
  const [customerNotes, setCustomerNotes] = useState('');
  const [order, setOrder] = useState(null);

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/marketplace/cart');
        const data = await response.json();
        
        if (data.success) {
          setCart(data.cart);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
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

  // Handle shipping info change
  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value
    });
  };

  // Proceed to next step
  const nextStep = () => {
    if (step === 1) {
      // Validate shipping info
      if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.addressLine1 || 
          !shippingInfo.city || !shippingInfo.district) {
        alert('Please fill in all required shipping information');
        return;
      }
    }
    
    if (step < 4) {
      setStep(step + 1);
    }
  };

  // Go to previous step
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Place order
  const placeOrder = async () => {
    try {
      const response = await fetch('/api/marketplace/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity
          })),
          shippingAddress: shippingInfo,
          paymentMethod,
          customerNotes
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.order);
        setStep(4); // Go to confirmation
      } else {
        alert('Failed to place order: ' + data.message);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  const shippingCost = cart.totalAmount >= 1000 ? 0 : 60;
  const tax = cart.totalAmount * 0.05;
  const discount = 0; // For now, no discount
  const grandTotal = cart.totalAmount + shippingCost + tax - discount;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <CreditCard className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">
            Add some products to your cart before checking out
          </p>
          <button
            onClick={() => navigate('/marketplace')}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Browse Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/marketplace/cart')}
            className="flex items-center text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cart
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-12">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                step >= stepNum ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > stepNum ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  stepNum
                )}
              </div>
              <div className="ml-3 hidden md:block">
                <span className={`text-sm font-medium ${
                  step >= stepNum ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {stepNum === 1 && 'Shipping'}
                  {stepNum === 2 && 'Payment'}
                  {stepNum === 3 && 'Review'}
                  {stepNum === 4 && 'Confirmation'}
                </span>
              </div>
              {stepNum < 4 && (
                <div className={`ml-4 w-16 h-1 ${
                  step > stepNum ? 'bg-green-600' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleShippingInfoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingInfoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleShippingInfoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={shippingInfo.district}
                    onChange={handleShippingInfoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your district"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={shippingInfo.addressLine1}
                    onChange={handleShippingInfoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Street address, P.O. box, company name, c/o"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    name="addressLine2"
                    value={shippingInfo.addressLine2}
                    onChange={handleShippingInfoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingInfoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your city"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleShippingInfoChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter postal code"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => navigate('/marketplace/cart')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Cart
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div
                  onClick={() => setPaymentMethod('cash-on-delivery')}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === 'cash-on-delivery' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      paymentMethod === 'cash-on-delivery' 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'cash-on-delivery' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Wallet className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="font-medium">Cash on Delivery</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 ml-8">
                    Pay with cash when your order is delivered
                  </p>
                </div>
                
                <div
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === 'bkash' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      paymentMethod === 'bkash' 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'bkash' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="font-medium">bKash</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 ml-8">
                    Pay with your bKash mobile wallet
                  </p>
                </div>
                
                <div
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === 'nagad' 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      paymentMethod === 'nagad' 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'nagad' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="font-medium">Nagad</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 ml-8">
                    Pay with your Nagad mobile wallet
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to Shipping
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Continue to Review
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Order Review</h2>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="font-medium">{shippingInfo.fullName}</p>
                    <p className="text-gray-600">{shippingInfo.addressLine1}</p>
                    {shippingInfo.addressLine2 && (
                      <p className="text-gray-600">{shippingInfo.addressLine2}</p>
                    )}
                    <p className="text-gray-600">{shippingInfo.city}, {shippingInfo.district}</p>
                    <p className="text-gray-600">{shippingInfo.phone}</p>
                    {shippingInfo.email && (
                      <p className="text-gray-600">{shippingInfo.email}</p>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="font-medium">
                      {paymentMethod === 'cash-on-delivery' && 'Cash on Delivery'}
                      {paymentMethod === 'bkash' && 'bKash'}
                      {paymentMethod === 'nagad' && 'Nagad'}
                    </p>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item._id} className="flex items-center border-b border-gray-100 pb-4">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={item.product.thumbnail || '/placeholder-product.jpg'}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                          <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <div className="font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Any special instructions for your order..."
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-8">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatCurrency(cart.totalAmount)}</span>
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
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">{formatCurrency(grandTotal)}</span>
                  </div>
                  
                  <button
                    onClick={placeOrder}
                    className="w-full mt-6 px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Place Order
                  </button>
                  
                  <button
                    onClick={prevStep}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && order && (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-2">Thank you for your order.</p>
            <p className="text-gray-600 mb-8">
              Your order number is <span className="font-semibold">{order.orderNumber}</span>
            </p>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-2xl mx-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Shipping Information</h4>
                    <p className="text-gray-600">{order.shippingAddress.fullName}</p>
                    <p className="text-gray-600">{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && (
                      <p className="text-gray-600">{order.shippingAddress.addressLine2}</p>
                    )}
                    <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.district}</p>
                    <p className="text-gray-600">{order.shippingAddress.phone}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Order Summary</h4>
                    <p className="text-gray-600">Order Number: {order.orderNumber}</p>
                    <p className="text-gray-600">Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="text-gray-600">Payment Method: {order.paymentMethod}</p>
                    <p className="text-gray-600">Total: {formatCurrency(order.totalAmount)}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Order Items</h4>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item._id} className="flex items-center">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={item.thumbnail || '/placeholder-product.jpg'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h5 className="font-medium text-gray-900">{item.name}</h5>
                          <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                        </div>
                        <div className="font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => navigate('/marketplace')}
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate('/marketplace/orders')}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Order History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;