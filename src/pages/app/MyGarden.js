import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Droplets, Search, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { plantAPI, taskAPI } from '../../services/api';
import { lazyLoadImage } from '../../services/imageOptimizer';

const MyGarden = () => {
  const navigate = useNavigate();
  
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch plants from API
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        const response = await plantAPI.getAll();
        setPlants(response.data.plants || []);
        setError(null);
      } catch (error) {
        console.error('Failed to load plants:', error);
        setError('Failed to load your plants. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  const handleDeletePlant = async (plantId) => {
    console.log('handleDeletePlant called with ID:', plantId);
    
    if (window.confirm('Are you sure you want to remove this plant from your garden?')) {
      try {
        console.log('Deleting plant with ID:', plantId);
        const response = await plantAPI.delete(plantId);
        console.log('Delete response:', response);
        
        // Refresh the plants list after deletion
        const plantsResponse = await plantAPI.getAll();
        console.log('Plants after deletion:', plantsResponse.data.plants);
        setPlants(plantsResponse.data.plants || []);
      } catch (error) {
        console.error('Failed to delete plant:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response,
          request: error.request
        });
        alert('Failed to delete plant. Please try again.');
      }
    }
  };

  const handleWaterPlant = async (plant) => {
    // Create a watering task using the real API
    try {
      const taskData = {
        task: `Water ${plant.name}`,
        plantName: plant.name,
        plant: plant._id,
        taskType: 'watering',
        time: 'Morning',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0]
      };
      
      await taskAPI.create(taskData);
      alert(`Watering task created for ${plant.name}!`);
    } catch (error) {
      console.error('Failed to create watering task:', error);
      alert('Failed to create watering task. Please try again.');
    }
  };

  const handleDiagnosePlant = (plant) => {
    navigate('/diagnosis', { state: { plantName: plant.name } });
  };

  const getHealthColor = (health) => {
    if (health >= 90) return 'text-green-600';
    if (health >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBg = (health) => {
    if (health >= 90) return 'bg-green-500';
    if (health >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'healthy':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Healthy</span>;
      case 'attention':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center space-x-1">
          <AlertTriangle className="h-3 w-3" />
          <span>Needs Attention</span>
        </span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your garden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Garden</h1>
          <p className="text-gray-600 mt-1">
            {plants.length} plants growing • {plants.filter(p => p.status === 'healthy').length} healthy
          </p>
        </div>
        <button
          onClick={() => navigate('/database')}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Plant</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {plants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((plant) => (
            <div key={plant._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Plant Header with Gradient */}
              <div className={`
                p-6 text-white relative overflow-hidden
                ${plant.health >= 90 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                  plant.health >= 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                  'bg-gradient-to-r from-red-500 to-pink-500'
                }
              `}>
                <div className="absolute top-2 right-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePlant(plant._id);
                    }}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* For emoji images, we don't need lazy loading, but for actual images we would */}
                  <div className="text-5xl">{plant.image}</div>
                  <div>
                    <h3 className="text-xl font-bold">{plant.name}</h3>
                    <p className="text-white text-opacity-90">{plant.type}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Health</span>
                    <span className="text-sm font-medium">{plant.health}%</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                    <div
                      className="bg-white rounded-full h-2 transition-all duration-300"
                      style={{ width: `${plant.health}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Plant Details */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  {getStatusBadge(plant.status)}
                  <span className="text-sm text-gray-500">Day {plant.daysGrowing}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Next Harvest</p>
                    <p className="font-semibold text-gray-900">
                      {plant.expectedHarvestDate 
                        ? `${Math.max(0, Math.ceil((new Date(plant.expectedHarvestDate) - new Date()) / (1000 * 60 * 60 * 24)))} days`
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-semibold text-gray-900">{plant.type}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleWaterPlant(plant)}
                    className="flex-1 bg-blue-50 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Droplets className="h-4 w-4" />
                    <span className="text-sm font-medium">Water</span>
                  </button>
                  <button
                    onClick={() => handleDiagnosePlant(plant)}
                    className="flex-1 bg-green-50 text-green-700 py-2 px-3 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Search className="h-4 w-4" />
                    <span className="text-sm font-medium">Diagnose</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-8xl mb-6">🌱</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Your Garden Journey!</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Your garden is empty. Add your first plant to begin growing fresh food at home.
          </p>
          <button
            onClick={() => navigate('/database')}
            className="btn-primary text-lg px-8 py-3"
          >
            Add Your First Plant
          </button>
        </div>
      )}
    </div>
  );
};

export default MyGarden;