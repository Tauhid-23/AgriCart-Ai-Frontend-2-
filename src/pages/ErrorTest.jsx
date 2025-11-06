// Component to test the exact error scenario
import { useState, useEffect } from 'react';

const ErrorTest = () => {
  const [products, setProducts] = useState(undefined); // Intentionally undefined
  const [pagination, setPagination] = useState(undefined); // Intentionally undefined
  
  // Test different access patterns
  const testAccessPatterns = () => {
    console.log('=== Testing Access Patterns ===');
    
    // Pattern 1: Direct access (this is what's causing the error)
    try {
      console.log('Pattern 1 - Direct access:');
      console.log('products.length:', products.length);
    } catch (error) {
      console.log('❌ Error with pattern 1:', error.message);
    }
    
    // Pattern 2: Safe access with optional chaining
    try {
      console.log('Pattern 2 - Optional chaining:');
      console.log('products?.length:', products?.length);
    } catch (error) {
      console.log('❌ Error with pattern 2:', error.message);
    }
    
    // Pattern 3: Safe access with fallback
    try {
      console.log('Pattern 3 - Fallback value:');
      console.log('products?.length || 0:', products?.length || 0);
    } catch (error) {
      console.log('❌ Error with pattern 3:', error.message);
    }
    
    // Pattern 4: Our safe variable approach
    try {
      console.log('Pattern 4 - Safe variable:');
      const safeProducts = Array.isArray(products) ? products : [];
      console.log('safeProducts.length:', safeProducts.length);
    } catch (error) {
      console.log('❌ Error with pattern 4:', error.message);
    }
    
    // Pattern 5: Testing pagination access
    try {
      console.log('Pattern 5 - Pagination access:');
      console.log('pagination.total:', pagination?.total || 0);
    } catch (error) {
      console.log('❌ Error with pattern 5:', error.message);
    }
  };

  useEffect(() => {
    testAccessPatterns();
  }, []);

  const forceError = () => {
    // This should cause the exact error
    try {
      const result = products.length;
      console.log('This should not be reached:', result);
    } catch (error) {
      console.log('Forced error caught:', error.message);
      alert('Error: ' + error.message);
    }
  };

  const fixState = () => {
    setProducts([]);
    setPagination({ page: 1, pages: 1, total: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Error Test Component</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-red-800 mb-3">Current State</h2>
              <ul className="space-y-2">
                <li className="flex">
                  <span className="font-medium text-gray-700 w-24">Products:</span>
                  <span className="text-gray-600">{String(products)} ({typeof products})</span>
                </li>
                <li className="flex">
                  <span className="font-medium text-gray-700 w-24">Pagination:</span>
                  <span className="text-gray-600">{String(pagination)} ({typeof pagination})</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-green-800 mb-3">Safe Values</h2>
              <ul className="space-y-2">
                <li className="flex">
                  <span className="font-medium text-gray-700 w-24">Safe Products:</span>
                  <span className="text-gray-600">{Array.isArray(products) ? products : []}.length = {Array.isArray(products) ? products.length : 0}</span>
                </li>
                <li className="flex">
                  <span className="font-medium text-gray-700 w-24">Safe Pagination:</span>
                  <span className="text-gray-600">{pagination?.total || 0}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={forceError}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Force Error (products.length)
            </button>
            
            <button 
              onClick={fixState}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Fix State
            </button>
            
            <button 
              onClick={testAccessPatterns}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test Access Patterns
            </button>
          </div>
          
          <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-yellow-800 mb-3">Debug Information</h2>
            <p className="text-gray-700 mb-2">
              This component tests different ways of accessing array properties to identify which pattern 
              causes the "Cannot read properties of undefined" error.
            </p>
            <p className="text-gray-700">
              Check the browser console for detailed logs of each access pattern test.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorTest;