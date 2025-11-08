import React, { useState, useEffect } from 'react';
import { marketplaceAPI } from '../services/api';

const MarketplaceErrorDebug = () => {
  const [debugInfo, setDebugInfo] = useState({
    loading: false,
    error: null,
    response: null,
    products: null,
    productsType: null,
    isArray: null,
    length: null
  });

  const testApiCall = async () => {
    setDebugInfo(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      console.log('🔍 Testing API call to /api/marketplace/products');
      const response = await marketplaceAPI.getProducts();
      console.log('📥 Raw response:', response);
      
      // Check what we received
      const data = response.data;
      console.log('📥 Response data:', data);
      
      let products = null;
      let productsType = typeof data;
      let isArray = Array.isArray(data);
      let length = null;
      
      // Try to extract products
      if (data && data.success === true && Array.isArray(data.products)) {
        products = data.products;
        length = data.products.length;
        console.log('✅ Found products in data.products:', products);
      } else if (Array.isArray(data)) {
        products = data;
        length = data.length;
        console.log('✅ Data is directly an array:', products);
      } else if (data && data.products && Array.isArray(data.products)) {
        products = data.products;
        length = data.products.length;
        console.log('✅ Found products in data.products (no success flag):', products);
      } else {
        console.log('⚠️ Could not find products array in response');
      }
      
      setDebugInfo({
        loading: false,
        error: null,
        response: data,
        products: products,
        productsType: productsType,
        isArray: isArray,
        length: length
      });
    } catch (error) {
      console.error('❌ API Error:', error);
      setDebugInfo({
        loading: false,
        error: error.message,
        response: null,
        products: null,
        productsType: null,
        isArray: null,
        length: null
      });
    }
  };

  useEffect(() => {
    testApiCall();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🛒 Marketplace Error Debug</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <button 
            onClick={testApiCall}
            disabled={debugInfo.loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-4"
          >
            {debugInfo.loading ? 'Testing...' : 'Test API Call'}
          </button>
          
          {debugInfo.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h2 className="text-xl font-semibold text-red-800 mb-2">❌ Error</h2>
              <p className="text-red-600">{debugInfo.error}</p>
            </div>
          )}
          
          {debugInfo.response && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h2 className="text-xl font-semibold text-green-800 mb-2">✅ API Response</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold">Response Type:</p>
                  <p>{debugInfo.productsType}</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold">Is Array:</p>
                  <p>{debugInfo.isArray ? 'Yes' : 'No'}</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold">Products Array:</p>
                  <p>{debugInfo.products ? 'Found' : 'Not Found'}</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="font-semibold">Products Length:</p>
                  <p>{debugInfo.length !== null ? debugInfo.length : 'N/A'}</p>
                </div>
              </div>
              
              <h3 className="font-semibold mb-2">Full Response:</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-64 text-sm">
                {JSON.stringify(debugInfo.response, null, 2)}
              </pre>
              
              {debugInfo.products && (
                <>
                  <h3 className="font-semibold mt-4 mb-2">Products Array:</h3>
                  <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-64 text-sm">
                    {JSON.stringify(debugInfo.products, null, 2)}
                  </pre>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">📝 Debug Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Click the "Test API Call" button to make a direct API request</li>
            <li>Check the browser console for detailed logs</li>
            <li>Look at the response structure to understand what the API is returning</li>
            <li>If products are not found, the issue might be with the backend or database</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceErrorDebug;