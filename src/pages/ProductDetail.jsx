import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    console.log('📦 ProductDetail mounted');
    console.log('Product ID from URL:', productId);
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) {
      console.error('❌ No product ID provided');
      setError('No product ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('📡 Fetching product:', productId);
      
      // Use the correct API URL based on environment
      const apiUrl = process.env.REACT_APP_API_URL || '/api';
      console.log('API URL:', apiUrl);
      
      const response = await axios.get(`${apiUrl}/marketplace/products/${productId}`);
      console.log('✅ Product data:', response.data);
      
      // Handle different response formats
      let productData = null;
      
      if (response.data) {
        if (response.data.product) {
          productData = response.data.product;
        } else if (response.data._id) {
          productData = response.data;
        } else if (response.data.data) {
          productData = response.data.data;
        }
      }
      
      if (!productData) {
        throw new Error('Product data not found in response');
      }
      
      console.log('📦 Product loaded:', productData.name);
      setProduct(productData);
      
    } catch (err) {
      console.error('❌ Error fetching product:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      if (err.response?.status === 404) {
        setError('Product not found');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load product');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      console.log('🛒 Adding to cart:', product._id, 'Quantity:', quantity);
      // Your add to cart logic
      alert(`Added ${quantity} ${product.name} to cart!`);
    } catch (err) {
      console.error('❌ Add to cart error:', err);
      alert('Failed to add to cart');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
          <p className="text-sm text-gray-500 mt-2">Product ID: {productId}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">
            {error || "The product you're looking for doesn't exist or has been removed."}
          </p>
          <p className="text-sm text-gray-500 mb-6">Product ID: {productId}</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  // Success - show product
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/marketplace')}
            className="flex items-center text-green-600 hover:text-green-700"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Marketplace
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Image */}
            <div>
              <img
                src={product.images?.[0] || product.thumbnail || product.image || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-auto rounded-lg"
                onError={(e) => { e.target.src = '/placeholder.jpg'; }}
              />
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <p className="text-gray-600 mb-6">
                {product.description || product.shortDescription}
              </p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-lg text-gray-500 line-through ml-4">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="ml-2 bg-red-100 text-red-800 text-sm font-bold px-2 py-1 rounded">
                        {product.discount}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Stock */}
              <div className="mb-6">
                {product.inStock ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✓ In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center mb-6">
                <span className="mr-4 text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 border-r border-gray-300 hover:bg-gray-50"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 px-4 py-2 text-center border-0 focus:ring-0"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 border-l border-gray-300 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                {product.stock && (
                  <span className="ml-4 text-sm text-gray-500">
                    ({product.stock} available)
                  </span>
                )}
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors mb-8 ${
                  product.inStock
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {/* Product Details */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.brand && (
                    <div className="flex">
                      <span className="text-gray-500 w-24">Brand:</span>
                      <span className="font-medium">{product.brand}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="flex">
                      <span className="text-gray-500 w-24">Weight:</span>
                      <span className="font-medium">{product.weight}</span>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex">
                      <span className="text-gray-500 w-24">Dimensions:</span>
                      <span className="font-medium">{product.dimensions}</span>
                    </div>
                  )}
                  {product.material && (
                    <div className="flex">
                      <span className="text-gray-500 w-24">Material:</span>
                      <span className="font-medium">{product.material}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;