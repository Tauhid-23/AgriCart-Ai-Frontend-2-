// Environment variable test component
import { useEffect, useState } from 'react';

const EnvTest = () => {
  const [envVars, setEnvVars] = useState({});

  useEffect(() => {
    // Log all environment variables that start with REACT_APP_
    const reactAppVars = {};
    for (const key in process.env) {
      if (key.startsWith('REACT_APP_')) {
        reactAppVars[key] = process.env[key];
      }
    }
    
    console.log('Environment variables:', reactAppVars);
    setEnvVars(reactAppVars);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Environment Variables Test</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-800 mb-3">Available Environment Variables</h2>
              {Object.keys(envVars).length > 0 ? (
                <ul className="space-y-2">
                  {Object.entries(envVars).map(([key, value]) => (
                    <li key={key} className="flex flex-col">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-600 break-all">{value || '(empty)'}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No REACT_APP_ environment variables found</p>
              )}
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-green-800 mb-3">Runtime Information</h2>
              <ul className="space-y-2">
                <li className="flex flex-col">
                  <span className="font-medium text-gray-700">NODE_ENV:</span>
                  <span className="text-gray-600">{process.env.NODE_ENV || '(not set)'}</span>
                </li>
                <li className="flex flex-col">
                  <span className="font-medium text-gray-700">API Base URL:</span>
                  <span className="text-gray-600">{process.env.REACT_APP_API_URL || '/api'}</span>
                </li>
                <li className="flex flex-col">
                  <span className="font-medium text-gray-700">App Name:</span>
                  <span className="text-gray-600">{process.env.REACT_APP_NAME || '(not set)'}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-yellow-800 mb-3">Debug Information</h2>
            <p className="text-gray-700">
              This page shows all environment variables that start with <code className="bg-gray-200 px-1 rounded">REACT_APP_</code>.
              These are the only environment variables that are available to the frontend application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvTest;