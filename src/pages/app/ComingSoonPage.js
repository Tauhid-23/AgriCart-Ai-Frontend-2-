import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, ArrowLeft } from 'lucide-react';

const ComingSoonPage = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-96 flex flex-col items-center justify-center text-center space-y-8">
      <div className="text-8xl mb-4">
        <Sprout className="h-24 w-24 text-green-500 mx-auto" />
      </div>
      
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          This feature is growing! 🌱 We're working hard to bring you the best {title.toLowerCase()} experience.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-sm mx-auto">
          <p className="text-green-800 font-medium mb-2">Coming Soon Features:</p>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Advanced plant tracking</li>
            <li>• AI-powered insights</li>
            <li>• Community integration</li>
            <li>• Mobile notifications</li>
          </ul>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary flex items-center space-x-2 mx-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="text-sm text-gray-500">
        Want to be notified when {title} is ready?{' '}
        <a href="mailto:updates@agricart.ai" className="text-green-600 hover:text-green-700 underline">
          Get updates
        </a>
      </div>
    </div>
  );
};

export default ComingSoonPage;