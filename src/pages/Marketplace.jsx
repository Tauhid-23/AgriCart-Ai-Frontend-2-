// frontend/src/pages/Marketplace.jsx
// FORCE REBUILD - Timestamp: 2025-11-06-22-15-00
// Fix: Ultra-safe array handling with defensive checks v4

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Marketplace = () => {
  console.log('🏪 Marketplace component mounting...');
  
  // State with GUARANTEED safe defaults
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🎯 useEffect triggered - fetching products');
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    console.log('📡 Starting fetchProducts...');
    setLoading(true);
    setError(null);
    
    try {
      console.log('📤 Making API call to /api/marketplace/products');
      const res = await axios.get('/api/marketplace/products');
      console.log('📥 API response:', res);
      console.log('📥 Response data:', res.data);
      console.log('📥 Response data type:', typeof res.data);
      console.log('📥 Is array?', Array.isArray(res.data));
      
      // Super defensive data extraction
      let productsData = [];
      
      if (res && res.data) {
        if (Array.isArray(res.data)) {
          console.log('✅ Response is array directly');
          productsData = res.data;
        } else if (res.data.products) {
          console.log('✅ Response has products property');
          console.log('   Products type:', typeof res.data.products);
          console.log('   Is array?', Array.isArray(res.data.products));
          if (Array.isArray(res.data.products)) {
            productsData = res.data.products;
          }
        } else if (res.data.data) {
          console.log('✅ Response has data property');
          if (Array.isArray(res.data.data)) {
            productsData = res.data.data;
          }
        }
      }
      
      console.log('📦 Final productsData:', productsData);
      console.log('📦 Products count:', productsData.length);
      console.log('📦 Type:', typeof productsData);
      console.log('📦 Is array?', Array.isArray(productsData));
      
      setProducts(productsData);
      console.log('✅ Products state updated');
      
    } catch (err) {
      console.error('❌ Error in fetchProducts:', err);
      console.error('❌ Error message:', err.message);
      console.error('❌ Error response:', err.response);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
      console.log('🏁 fetchProducts complete');
    }
  };

  console.log('🎨 Rendering Marketplace...');
  console.log('   products:', products);
  console.log('   products type:', typeof products);
  console.log('   products is array?', Array.isArray(products));
  console.log('   loading:', loading);
  console.log('   error:', error);

  // ULTRA SAFE: Calculate count
  let productCount = 0;
  try {
    if (products && Array.isArray(products)) {
      productCount = products.length;
    }
  } catch (e) {
    console.error('❌ Error calculating productCount:', e);
    productCount = 0;
  }

  console.log('📊 Product count:', productCount);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="mb-4 text-green-600 hover:text-green-700"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900">
            🛒 Marketplace
          </h1>
        </div>

        {/* Debug Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="font-semibold text-yellow-800 mb-2">🐛 Debug Info:</p>
          <pre className="text-xs text-yellow-700 overflow-auto">
{`Loading: ${loading}
Error: ${error || 'none'}
Products type: ${typeof products}
Products is array: ${Array.isArray(products)}
Products count: ${productCount}
Products value: ${JSON.stringify(products, null, 2).substring(0, 200)}...`}
          </pre>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-red-800 mb-2">Error Loading Products</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Display */}
        {!loading && !error && (
          <>
            <div className="mb-6">
              <p className="text-gray-700">
                Showing <span className="font-semibold">{productCount}</span> products
              </p>
            </div>

            {productCount === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No Products Found</h3>
                <p className="text-gray-500">Check back soon for new products!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.isArray(products) && products.map((product, index) => {
                  try {
                    return (
                      <div key={product._id || product.id || index} className="bg-white rounded-lg shadow-md p-4">
                        <img 
                          src={product.images?.[0] || product.image || '/placeholder.jpg'} 
                          alt={product.name || 'Product'}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                          onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                        />
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                          {product.name || 'Unnamed Product'}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description || 'No description'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green-600">
                            ৳{product.price || 0}
                          </span>
                          <Link
                            to={`/marketplace/product/${product._id || product.id}`}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    );
                  } catch (err) {
                    console.error('❌ Error rendering product:', err, product);
                    return null;
                  }
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
