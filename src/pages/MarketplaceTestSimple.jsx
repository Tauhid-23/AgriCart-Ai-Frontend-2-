import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MarketplaceTestSimple = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔍 Fetching products...');
        const response = await axios.get('/api/marketplace/products');
        console.log('📥 Response:', response);
        
        // Log the exact structure
        console.log('📊 Data type:', typeof response.data);
        console.log('📊 Is array:', Array.isArray(response.data));
        console.log('📊 Data keys:', response.data ? Object.keys(response.data) : 'null');
        
        // Handle different response structures
        let productsArray = [];
        if (response.data && response.data.success === true && Array.isArray(response.data.products)) {
          productsArray = response.data.products;
        } else if (Array.isArray(response.data)) {
          productsArray = response.data;
        } else if (response.data && response.data.products && Array.isArray(response.data.products)) {
          productsArray = response.data.products;
        }
        
        console.log('📦 Products array:', productsArray);
        console.log('📦 Products length:', productsArray.length);
        
        setProducts(productsArray);
      } catch (err) {
        console.error('❌ Error:', err);
        setError(err.message);
        setProducts([]); // Always set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ULTRA SAFE: Calculate count with multiple fallbacks
  const getProductCount = () => {
    try {
      if (!products) return 0;
      if (!Array.isArray(products)) return 0;
      return products.length || 0;
    } catch (e) {
      console.error('❌ Error getting product count:', e);
      return 0;
    }
  };

  const productCount = getProductCount();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🛒 Simple Marketplace Test</h1>
        
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">❌ Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Products Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-sm text-blue-800">Products Variable</p>
                <p className="font-semibold">{Array.isArray(products) ? 'Is Array' : 'Not Array'}</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <p className="text-sm text-green-800">Products Count</p>
                <p className="font-semibold">{productCount}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <p className="text-sm text-purple-800">Products Type</p>
                <p className="font-semibold">{typeof products}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Raw Products Data:</h3>
              <pre className="text-xs overflow-auto max-h-64">
                {JSON.stringify(products, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceTestSimple;