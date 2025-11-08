import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { plantAPI } from '../../services/api';
import { 
  TrendingUp, 
  Plus, 
  Camera, 
  Calendar, 
  Ruler, 
  Leaf, 
  Loader2, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const GrowthTracking = () => {
  const { user } = useAuth();
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    height: '',
    width: '',
    notes: '',
    photo: ''
  });

  // Fetch all plants with growth tracking data
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await plantAPI.getAll();
        setPlants(response.data.plants);
      } catch (err) {
        console.error('Failed to load plants:', err);
        setError('Failed to load plants. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  const handlePlantSelect = (plant) => {
    setSelectedPlant(plant);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const growthData = {
        date: formData.date,
        height: parseFloat(formData.height) || 0,
        width: parseFloat(formData.width) || 0,
        notes: formData.notes,
        photo: formData.photo
      };
      
      const response = await api.post(`/plants/${selectedPlant._id}/growth-tracking`, growthData);
      
      // Update the selected plant with the new growth tracking entry
      const updatedPlant = response.data.plant;
      setSelectedPlant(updatedPlant);
      
      // Update the plants list
      setPlants(prev => prev.map(plant => 
        plant._id === updatedPlant._id ? updatedPlant : plant
      ));
      
      // Reset form and hide it
      setFormData({
        date: new Date().toISOString().split('T')[0],
        height: '',
        width: '',
        notes: '',
        photo: ''
      });
      setShowAddForm(false);
      
      alert('Growth tracking entry added successfully!');
    } catch (err) {
      console.error('Failed to add growth tracking entry:', err);
      setError('Failed to add growth tracking entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatHeight = (height) => {
    return height ? `${height} cm` : 'N/A';
  };

  if (loading && plants.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading growth tracking data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <span>Growth Tracking</span>
          </h1>
          <p className="text-gray-600 mt-1">Monitor and track your plants' growth over time</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {plants.length === 0 ? (
        <div className="text-center py-12">
          <Leaf className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No plants in your garden</h3>
          <p className="text-gray-500 mb-6">Add plants to your garden to start tracking their growth.</p>
          <a 
            href="/database" 
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Your First Plant</span>
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plant Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Plants</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {plants.map(plant => (
                  <button
                    key={plant._id}
                    onClick={() => handlePlantSelect(plant)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedPlant?._id === plant._id
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {plant.photos && plant.photos.length > 0 ? (
                        <img 
                          src={plant.photos[0]} 
                          alt={plant.name} 
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Leaf className="h-5 w-5 text-green-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">{plant.name}</h3>
                        <p className="text-sm text-gray-500">{plant.type}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Growth Tracking Details */}
          <div className="lg:col-span-2">
            {selectedPlant ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
                  <div className="flex items-center space-x-4">
                    {selectedPlant.photos && selectedPlant.photos.length > 0 ? (
                      <img 
                        src={selectedPlant.photos[0]} 
                        alt={selectedPlant.name} 
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                        <Leaf className="h-8 w-8 text-green-600" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedPlant.name}</h2>
                      <p className="text-gray-600">{selectedPlant.type} • Planted {formatDate(selectedPlant.plantedDate)}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Entry</span>
                  </button>
                </div>

                {/* Add Growth Entry Form */}
                {showAddForm && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Growth Entry</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="date"
                              value={formData.date}
                              onChange={(e) => handleInputChange('date', e.target.value)}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Height (cm)
                          </label>
                          <div className="relative">
                            <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="number"
                              step="0.1"
                              value={formData.height}
                              onChange={(e) => handleInputChange('height', e.target.value)}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="e.g., 15.5"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Width (cm)
                          </label>
                          <div className="relative">
                            <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                              type="number"
                              step="0.1"
                              value={formData.width}
                              onChange={(e) => handleInputChange('width', e.target.value)}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="e.g., 12.3"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notes
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => handleInputChange('notes', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Observations about your plant's growth..."
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          disabled={loading}
                          className="btn-primary flex items-center space-x-2"
                        >
                          {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          <span>{loading ? 'Saving...' : 'Save Entry'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Growth Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Timeline</h3>
                  
                  {selectedPlant.growthTracking && selectedPlant.growthTracking.length > 0 ? (
                    <div className="space-y-4">
                      {[...selectedPlant.growthTracking]
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((entry, index) => (
                          <div key={index} className="border-l-2 border-green-200 pl-4 pb-4 relative">
                            <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500"></div>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                                <h4 className="font-medium text-gray-900">{formatDate(entry.date)}</h4>
                                <div className="flex space-x-4 text-sm">
                                  <span className="flex items-center space-x-1">
                                    <Ruler className="h-4 w-4 text-gray-500" />
                                    <span>{formatHeight(entry.height)}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Ruler className="h-4 w-4 text-gray-500" />
                                    <span>{formatHeight(entry.width)}</span>
                                  </span>
                                </div>
                              </div>
                              
                              {entry.notes && (
                                <p className="text-gray-700 mt-2">{entry.notes}</p>
                              )}
                              
                              {entry.photo && (
                                <img 
                                  src={entry.photo} 
                                  alt="Growth" 
                                  className="mt-3 rounded-lg max-w-xs"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No growth entries yet</h4>
                      <p className="text-gray-500 mb-4">Start tracking your plant's growth by adding your first entry.</p>
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="btn-primary inline-flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add First Entry</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Select a Plant</h3>
                <p className="text-gray-500">Choose a plant from the list to view its growth tracking data.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GrowthTracking;