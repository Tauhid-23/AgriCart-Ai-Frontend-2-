// frontend/src/pages/Marketplace.jsx
// ULTRA-SAFE VERSION WITH MAXIMUM DEFENSIVE PROGRAMMING
// FORCE REBUILD INDICATOR: 2025-11-06-23-00-00-ULTRA-SAFE

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { marketplaceAPI } from '../services/api';

// ULTRA SAFE HELPER FUNCTIONS
const isSafeArray = (item) => {
  try {
    return item && Array.isArray(item);
  } catch (e) {
    console.error('❌ isSafeArray error:', e);
    return false;
  }
};

const getSafeLength = (arr) => {
  try {
    if (!isSafeArray(arr)) return 0;
    return arr.length || 0;
  } catch (e) {
    console.error('❌ getSafeLength error:', e);
    return 0;
  }
};

const extractProductsSafely = (data) => {
  try {
    console.log('🔧 extractProductsSafely input:', data);
    
    if (!data) {
      console.log('⚠️ No data provided');
      return [];
    }
    
    // Case 1: { success: true, products: [...] }
    if (data.success === true && isSafeArray(data.products)) {
      console.log('✅ Case 1: success=true with products array');
      return data.products;
    }
    
    // Case 2: Direct array [...]
    if (isSafeArray(data)) {
      console.log('✅ Case 2: direct array');
      return data;
    }
    
    // Case 3: { products: [...] }
    if (data.products && isSafeArray(data.products)) {
      console.log('✅ Case 3: products property with array');
      return data.products;
    }
    
    // Case 4: { data: [...] }
    if (data.data && isSafeArray(data.data)) {
      console.log('✅ Case 4: data property with array');
      return data.data;
    }
    
    console.log('⚠️ No valid products found, returning empty array');
    return [];
  } catch (e) {
    console.error('❌ extractProductsSafely error:', e);
    return [];
  }
};

const Marketplace = () => {
  console.log('🏪 ULTRA-SAFE Marketplace component mounting...');
  
  // Ensure products state is initialized as an empty array
  const [products, setProducts] = useState([]); // Default to an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle API Response Safely
  const fetchProducts = async () => {
    console.log('📡 Starting ultra-safe fetchProducts...');
    setLoading(true);
    setError(null);
    
    try {
      console.log('📤 Making API call to marketplaceAPI.getProducts()');
      const response = await marketplaceAPI.getProducts();
      console.log('📥 Raw API response:', response);
      
      if (!response || !response.products) {
        console.log('⚠️ Empty response received');
        setProducts([]);
        return;
      }
      
      // Ensure products key in the response is an array
      const safeProducts = extractProductsSafely(response.products);
      console.log('📦 Safe products extracted:', safeProducts);
      
      setProducts(safeProducts || []); // Ensure products is an array
      console.log('✅ Products state updated safely');
      
    } catch (err) {
      console.error('❌ Error in fetchProducts:', err);
      console.error('❌ Error message:', err.message);
      console.error('❌ Error response:', err.response);
      setError(err.message || 'Unknown error occurred');
      setProducts([]); // Always fallback to empty array
    } finally {
      setLoading(false);
      console.log('🏁 fetchProducts complete');
    }
  };

  useEffect(() => {
    console.log('🎯 useEffect triggered');
    fetchProducts();
  }, []);

  // ULTRA SAFE RENDERING
  console.log('🎨 Rendering Marketplace...');
  console.log('   products:', products);
  console.log('   isSafeArray(products):', isSafeArray(products));

  const productCount = getSafeLength(products);
  console.log('📊 Safe product count:', productCount);

  // ULTRA SAFE PRODUCT RENDERER with improved image handling
  const renderProduct = (product, index) => {
    try {
      if (!product) {
        console.log('⚠️ Null product at index:', index);
        return null;
      }
      
      const key = product._id || product.id || `product-${index}`;
      console.log('🔧 Rendering product with key:', key);
      
      // Fix Image Handling - Check if product.images is an array and has items
      const imageSrc = Array.isArray(product.images) && product.images.length > 0
        ? product.images[0]
        : product.thumbnail || '/placeholder.jpg';
      
      console.log('🖼️ Final image source for product', product.name, ':', imageSrc);
      
      return (
        <div key={key} className="bg-white rounded-lg shadow-md p-4">
          <img 
            src={imageSrc}
            alt={product.name || 'Product'}
            className="w-full h-48 object-cover rounded-lg mb-4"
            onError={(e) => { 
              console.log('⚠️ Image load error for product:', product.name, 'key:', key, 'src:', imageSrc);
              e.target.src = '/placeholder.jpg'; 
            }}
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
              to={`/marketplace/product/${product._id || product.id || 'unknown'}`}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              View
            </Link>
          </div>
        </div>
      );
    } catch (renderError) {
      console.error('❌ Error rendering product at index', index, ':', renderError);
      return (
        <div key={`error-${index}`} className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error rendering product #{index}</p>
        </div>
      );
    }
  };

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
            Marketplace
          </h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
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

        {/* Products Display - ULTRA SAFE */}
        {!loading && !error && (
          <div className="mb-6">
            <p className="text-gray-700 mb-6">
              Showing <span className="font-semibold">{productCount}</span> products
            </p>

            {/* Check Length Before Mapping Through products */}
            {productCount > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isSafeArray(products) && products.map((product, index) => {
                  try {
                    return renderProduct(product, index);
                  } catch (mapError) {
                    console.error('❌ Error in products.map at index', index, ':', mapError);
                    return (
                      <div key={`map-error-${index}`} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-600">Map error for product #{index}</p>
                      </div>
                    );
                  }
                })}
              </div>
            ) : (
              // Fallback when no products are available
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No Products Found</h3>
                <p className="text-gray-500">Check back soon for new products!</p>
                <button
                  onClick={fetchProducts}
                  className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                >
                  Refresh
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;