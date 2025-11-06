// Debug version of Marketplace with extensive logging
import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Plus, ArrowLeft } from 'lucide-react';

const ProductCard = ({ product, formatPrice }) => {
  const discountPercentage = product.discount || 0;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      if (confirm('You need to login to add items to your cart. Would you like to login now?')) {
        navigate('/login', { state: { from: '/marketplace' } });
      }
      return;
    }

    try {
      await addToCart(product._id, 1);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response && error.response.status === 401) {
        if (confirm('You need to login to add items to your cart. Would you like to login now?')) {
          navigate('/login', { state: { from: '/marketplace' } });
        }
      } else {
        alert(`Failed to add product to cart: ${error.message}`);
      }
    }
  };

  const handleProductClick = (e) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/marketplace/product/${product._id}`} className="block" onClick={handleProductClick}>
        <div className="relative">
          <img 
            src={product.images?.[0] || product.thumbnail || '/placeholder-product.jpg'} 
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discountPercentage}% OFF
            </div>
          )}
          {product.featured && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
              Featured
            </div>
          )}
          {product.bestSeller && (
            <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              Best Seller
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1" onClick={handleProductClick}>{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.shortDescription || product.description}</p>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-medium text-gray-900 ml-1">{product.rating || 'N/A'}</span>
              {product.reviewCount && (
                <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
          
          <div className="mt-2">
            {product.inStock ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </Link>
      
      <div className="px-4 pb-4">
        <button 
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full flex items-center justify-center px-3 py-2 rounded-lg transition-colors text-sm ${
            product.inStock 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const MarketplaceDebug = () => {
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    testMarketplaceAPI();
  }, []);

  const testMarketplaceAPI = async () => {
    setLoading(true);
    setError(null);
    setApiResponse(null);
    
    try {
      console.log('🔍 Testing marketplace API...');
      const response = await axios.get('/api/marketplace/products');
      
      console.log('📥 Raw API response:', response);
      
      setApiResponse({
        status: response.status,
        headers: response.headers,
        data: response.data,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
        hasProducts: response.data && response.data.products ? true : false,
        productsType: response.data && response.data.products ? typeof response.data.products : null,
        productsIsArray: response.data && response.data.products ? Array.isArray(response.data.products) : null,
        productsLength: response.data && response.data.products ? response.data.products.length : 0
      });
    } catch (err) {
      console.error('❌ API Error:', err);
      setError({
        message: err.message,
        response: err.response ? {
          status: err.response.status,
          data: err.response.data
        } : null
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🛒 Marketplace API Debug</h1>
          <p className="text-gray-600">Testing API response structure and data</p>
        </div>

        <div className="mb-6">
          <button 
            onClick={testMarketplaceAPI}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Marketplace API'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-red-800 mb-3">❌ Error</h2>
            <pre className="bg-red-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}

        {apiResponse && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">✅ API Response Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-semibold text-blue-800">Response Info</h3>
                <p>Status: {apiResponse.status}</p>
                <p>Data Type: {apiResponse.dataType}</p>
                <p>Is Array: {apiResponse.isArray ? 'Yes' : 'No'}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <h3 className="font-semibold text-purple-800">Products Info</h3>
                <p>Has Products: {apiResponse.hasProducts ? 'Yes' : 'No'}</p>
                <p>Products Type: {apiResponse.productsType || 'N/A'}</p>
                <p>Products Is Array: {apiResponse.productsIsArray ? 'Yes' : 'N/A'}</p>
                <p>Products Count: {apiResponse.productsLength}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Full Response Data:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
                {JSON.stringify(apiResponse.data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceDebug;
