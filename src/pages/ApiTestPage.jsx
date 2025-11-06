import React, { useState } from 'react';

const ApiTestPage = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('');
    try {
      const response = await fetch('/api/marketplace/products');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
        <button 
          onClick={testAPI}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test API'}
        </button>
        
        {result && (
          <div className="mt-6 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-3">API Response:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-sm">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTestPage;