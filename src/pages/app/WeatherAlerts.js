import React, { useState, useEffect } from 'react';
import { Sun, Cloud, Droplets, Wind, Eye, AlertTriangle, TrendingUp, RefreshCw, Loader2, CheckCircle } from 'lucide-react';
import { weatherAPI } from '../../services/api';

const WeatherAlerts = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch weather data
  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Don't pass coordinates, let backend use user's location
      const response = await weatherAPI.get();
      
      if (response.data.success) {
        setWeather(response.data.weather);
        setLastUpdated(new Date());
      } else {
        setError(response.data.message || 'Failed to fetch weather data');
      }
    } catch (error) {
      console.error('Weather API error:', error);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get weather icon based on condition
  const getWeatherIcon = (iconCode) => {
    // Map OpenWeather icon codes to our icons
    if (iconCode?.includes('01')) return <Sun className="h-8 w-8 text-yellow-500" />;
    if (iconCode?.includes('02')) return <Cloud className="h-8 w-8 text-blue-400" />;
    if (iconCode?.includes('03') || iconCode?.includes('04')) return <Cloud className="h-8 w-8 text-gray-500" />;
    if (iconCode?.includes('09') || iconCode?.includes('10')) return <Droplets className="h-8 w-8 text-blue-600" />;
    if (iconCode?.includes('11')) return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
    if (iconCode?.includes('13')) return <Cloud className="h-8 w-8 text-gray-300" />; // Snow
    if (iconCode?.includes('50')) return <Eye className="h-8 w-8 text-gray-400" />; // Mist
    return <Sun className="h-8 w-8 text-yellow-500" />;
  };

  // Get UV level (using a default value since OpenWeather free tier doesn't provide UV)
  const getUVLevel = (uvIndex) => {
    if (uvIndex <= 2) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (uvIndex <= 7) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-600', bg: 'bg-red-100' };
    return { level: 'Extreme', color: 'text-purple-600', bg: 'bg-purple-100' };
  };

  // Fetch weather on component mount
  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold mb-2">Error Loading Weather Data</p>
          <p>{error}</p>
          <button
            onClick={() => fetchWeather()}
            className="mt-4 btn-primary flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          <p>No weather data available. Please try again later.</p>
        </div>
      </div>
    );
  }

  const uvLevel = getUVLevel(weather.current.uvIndex || 5); // Default to moderate UV

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Weather & Alerts ☀️</h1>
        <p className="text-xl text-gray-600">
          Real-time weather data and AI-powered gardening recommendations
        </p>
        {lastUpdated && (
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={() => fetchWeather()}
          disabled={loading}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Weather</span>
        </button>
      </div>

      {/* Current Weather Hero Card */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-2xl p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center space-x-4 mb-6">
              {getWeatherIcon(weather.current.icon)}
              <div>
                <div className="text-6xl font-bold mb-2">{weather.current.temp}°C</div>
                <div className="text-2xl text-blue-100 capitalize">{weather.current.description}</div>
              </div>
            </div>
            <div className="text-blue-200 text-lg">
              📍 {weather.location.city}, Bangladesh
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Wind className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <div className="text-2xl font-bold">{weather.current.windSpeed}</div>
              <div className="text-sm text-blue-200">km/h Wind</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Droplets className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <div className="text-2xl font-bold">{weather.current.humidity}%</div>
              <div className="text-sm text-blue-200">Humidity</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Eye className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <div className="text-2xl font-bold">{weather.current.pressure}</div>
              <div className="text-sm text-blue-200">hPa Pressure</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-200" />
              <div className="text-2xl font-bold">{weather.current.feelsLike}°C</div>
              <div className="text-sm text-blue-200">Feels Like</div>
            </div>
          </div>
        </div>
      </div>

      {/* UV Index Alert */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900">UV Index</h3>
          <div className={`px-4 py-2 rounded-full ${uvLevel.bg} ${uvLevel.color} font-semibold`}>
            {uvLevel.level}
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">{weather.current.uvIndex || 5}</div>
            <div className="text-sm text-gray-600">Current UV Index</div>
          </div>
          
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
              <div
                className={`h-3 rounded-full ${
                  (weather.current.uvIndex || 5) <= 2 ? 'bg-green-500' :
                  (weather.current.uvIndex || 5) <= 5 ? 'bg-yellow-500' :
                  (weather.current.uvIndex || 5) <= 7 ? 'bg-orange-500' :
                  (weather.current.uvIndex || 5) <= 10 ? 'bg-red-500' : 'bg-purple-500'
                }`}
                style={{ width: `${Math.min(((weather.current.uvIndex || 5) / 12) * 100, 100)}%` }}
              />
            </div>
            <div className="text-sm text-gray-600">
              {(weather.current.uvIndex || 5) <= 2 && 'Safe for outdoor activities'}
              {(weather.current.uvIndex || 5) > 2 && (weather.current.uvIndex || 5) <= 5 && 'Moderate risk - use sun protection'}
              {(weather.current.uvIndex || 5) > 5 && (weather.current.uvIndex || 5) <= 7 && 'High risk - protect plants and skin'}
              {(weather.current.uvIndex || 5) > 7 && (weather.current.uvIndex || 5) <= 10 && 'Very high risk - provide shade for sensitive plants'}
              {(weather.current.uvIndex || 5) > 10 && 'Extreme risk - avoid direct sun exposure'}
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">5-Day Forecast</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {weather.forecast.map((day, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="font-semibold text-gray-900 mb-2">{day.date}</div>
              {getWeatherIcon(day.icon)}
              <div className="text-xl font-bold text-gray-900 my-2">{day.temp}°C</div>
              <div className="text-sm text-gray-600 capitalize">{day.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Gardening Alerts */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">AI Gardening Alerts</h3>
        
        <div className="space-y-4">
          {weather.alerts && weather.alerts.length > 0 ? (
            weather.alerts.map((alert, index) => (
              <div 
                key={index} 
                className={`border-2 rounded-lg p-4 ${
                  alert.type === 'warning' ? 'border-orange-200 bg-orange-50' :
                  alert.type === 'info' ? 'border-blue-200 bg-blue-50' :
                  alert.type === 'success' ? 'border-green-200 bg-green-50' :
                  'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.type === 'warning' ? 'text-orange-500' :
                    alert.type === 'info' ? 'text-blue-500' :
                    alert.type === 'success' ? 'text-green-500' :
                    'text-gray-500'
                  }`} />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {alert.type === 'warning' ? 'Warning' : 
                       alert.type === 'info' ? 'Info' : 
                       alert.type === 'success' ? 'Good News' : 
                       'Tip'}
                    </h4>
                    <p className="text-gray-700">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>No alerts at this time. Weather conditions are favorable for gardening!</p>
            </div>
          )}
        </div>
      </div>

      {/* Garden Care Recommendations */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Today's Garden Care Tips</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Watering Schedule</h4>
                <p className="text-gray-700 text-sm">
                  {weather.current.temp > 30 
                    ? 'Water early morning or evening to avoid evaporation' 
                    : 'Water in the morning for best results'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Sun Protection</h4>
                <p className="text-gray-700 text-sm">
                  {weather.current.temp > 35 
                    ? 'Provide shade for sensitive plants between 11 AM - 3 PM' 
                    : 'Current temperatures are favorable for sun-loving plants'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Plant Monitoring</h4>
                <p className="text-gray-700 text-sm">
                  {weather.current.humidity < 40 
                    ? 'Low humidity detected. Mist plants or increase watering' 
                    : 'Humidity levels are optimal for most plants'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Optimal Care Time</h4>
                <p className="text-gray-700 text-sm">
                  Best time for garden maintenance: 6-8 AM or after 5 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherAlerts;