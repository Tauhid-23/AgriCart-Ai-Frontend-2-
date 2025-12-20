import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  CheckSquare, 
  Calendar, 
  TrendingUp,
  Plus,
  Droplets,
  Sun,
  Wind,
  Eye,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { plantAPI, taskAPI, weatherAPI } from '../../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [plants, setPlants] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPlants: 0,
    healthyPlants: 0,
    pendingTasks: 0,
    todaysTasks: 0,
    avgHealth: 0,
    nextHarvest: 0
  });

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [plantsRes, tasksRes, weatherRes] = await Promise.all([
          plantAPI.getAll(),
          taskAPI.getAll({ status: 'pending' }),
          weatherAPI.get() // Don't pass coordinates, let backend use user's location
        ]);

        const plantsData = plantsRes.data.plants || [];
        const tasksData = tasksRes.data.tasks || [];

        setPlants(plantsData);
        setTasks(tasksData.slice(0, 5)); // Show only first 5 tasks

        // Set weather data
        if (weatherRes.data.success) {
          setWeather(weatherRes.data.weather);
        }

        // Calculate statistics
        const healthyPlants = plantsData.filter(p => p.status === 'healthy').length;
        const avgHealth = plantsData.length > 0
          ? Math.round(plantsData.reduce((sum, p) => sum + (p.health || 100), 0) / plantsData.length)
          : 0;

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        const todaysTasks = tasksData.filter(task => {
          const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
          return taskDate === today;
        });

        setStats({
          totalPlants: plantsData.length,
          healthyPlants,
          pendingTasks: tasksData.length,
          todaysTasks: todaysTasks.length,
          avgHealth,
          nextHarvest: 0 // Can be calculated based on plant harvest dates if needed
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleTaskComplete = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'completed' : 'pending';
      await taskAPI.update(taskId, { status: newStatus });
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId 
            ? { ...task, status: newStatus }
            : task
        )
      );
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const statsCards = [
    {
      title: 'Plants Growing',
      value: stats.totalPlants.toString(),
      subtitle: `${stats.healthyPlants} healthy`,
      color: 'from-green-500 to-emerald-600',
      icon: Sprout,
      onClick: () => navigate('/my-garden')
    },
    {
      title: 'Tasks Due Today',
      value: stats.todaysTasks.toString(),
      subtitle: `${stats.pendingTasks} total pending`,
      color: 'from-blue-500 to-indigo-600',
      icon: CheckSquare,
      onClick: () => navigate('/tasks')
    },
    {
      title: 'Days Until Harvest',
      value: stats.nextHarvest.toString(),
      subtitle: 'Next harvest ready',
      color: 'from-orange-500 to-red-500',
      icon: Calendar,
      onClick: () => navigate('/my-garden')
    },
    {
      title: 'Garden Health Score',
      value: `${stats.avgHealth}%`,
      subtitle: 'Overall garden health',
      color: 'from-purple-500 to-pink-500',
      icon: TrendingUp,
      onClick: () => navigate('/tracking')
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskIcon = (task) => {
    // Defensive check to prevent error when task is undefined
    if (!task || typeof task !== 'string') {
      return <CheckSquare className="h-4 w-4" />;
    }
    
    const taskTitle = task.toLowerCase();
    if (taskTitle.includes('water')) return <Droplets className="h-4 w-4" />;
    if (taskTitle.includes('prune')) return <span className="text-sm">✂️</span>;
    if (taskTitle.includes('fertilize')) return <span className="text-sm">🌾</span>;
    return <CheckSquare className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              onClick={stat.onClick}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <div className={`bg-gradient-to-r ${stat.color} rounded-lg p-3 w-fit mb-4`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-lg font-semibold text-gray-700 mb-2">{stat.title}</p>
                <p className="text-sm text-gray-500">{stat.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Today's Tasks</h2>
            <button
              onClick={() => navigate('/tasks')}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </button>
          </div>

          {tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className={`
                    flex items-center space-x-4 p-4 rounded-lg border-2 transition-all
                    ${task.status === 'completed' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <button
                    onClick={() => handleTaskComplete(task._id, task.status)}
                    className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                      ${task.status === 'completed' 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 hover:border-green-500'
                      }
                    `}
                  >
                    {task.status === 'completed' && <CheckSquare className="h-3 w-3" />}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-500">
                        {getTaskIcon(task.task)}
                      </div>
                      <div className={`
                        ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}
                      `}>
                        <p className="font-semibold">{task.title || task.task || 'Untitled Task'}</p>
                        <p className="text-sm text-gray-600">{task.plantName || 'Unknown Plant'} • {task.time || 'Any Time'}</p>
                      </div>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              ))}

              {tasks.length > 4 && (
                <button
                  onClick={() => navigate('/tasks')}
                  className="w-full py-3 text-green-600 hover:text-green-700 font-medium text-center border-2 border-dashed border-gray-300 rounded-lg hover:border-green-300 transition-colors"
                >
                  View {tasks.length - 4} more tasks
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No tasks scheduled for today</p>
              <button
                onClick={() => navigate('/tasks')}
                className="btn-primary"
              >
                Add Your First Task
              </button>
            </div>
          )}
        </div>

        {/* Weather Widget */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Weather Today</h3>
            <button
              onClick={() => navigate('/weather')}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <Eye className="h-5 w-5" />
            </button>
          </div>

          {weather ? (
            <>
              <div className="mb-6">
                <div className="text-5xl font-bold mb-2">{weather.current.temp}°C</div>
                <div className="text-blue-100 text-lg mb-4 capitalize">{weather.current.description}</div>
                <div className="text-sm text-blue-200">📍 {weather.location.city}, Bangladesh</div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <Wind className="h-4 w-4 mx-auto mb-1 text-blue-200" />
                  <div className="text-sm font-medium">{weather.current.windSpeed} km/h</div>
                  <div className="text-xs text-blue-200">Wind</div>
                </div>
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <Droplets className="h-4 w-4 mx-auto mb-1 text-blue-200" />
                  <div className="text-sm font-medium">{weather.current.humidity}%</div>
                  <div className="text-xs text-blue-200">Humidity</div>
                </div>
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <Sun className="h-4 w-4 mx-auto mb-1 text-blue-200" />
                  <div className="text-sm font-medium">{weather.current.pressure} hPa</div>
                  <div className="text-xs text-blue-200">Pressure</div>
                </div>
              </div>

              {weather.alerts && weather.alerts.length > 0 && (
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm">{weather.alerts[0].message}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate('/weather')}
                className="w-full bg-white bg-opacity-10 backdrop-blur-sm text-white py-2 px-4 rounded-lg hover:bg-opacity-20 transition-colors font-medium"
              >
                7-Day Forecast
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-200 mx-auto mb-4" />
              <p className="text-blue-200">Loading weather...</p>
            </div>
          )}
        </div>
      </div>

      {/* Plant Health Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Plant Health Overview</h2>
          <button
            onClick={() => navigate('/my-garden')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>View All Plants</span>
          </button>
        </div>

        {plants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plants.slice(0, 3).map((plant) => (
              <div
                key={plant._id}
                onClick={() => navigate('/my-garden')}
                className="product-card cursor-pointer p-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{plant.image || '🌱'}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{plant.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            plant.health >= 90 ? 'bg-green-500' :
                            plant.health >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${plant.health}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{plant.health}%</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {plant.daysGrowing || 0} days growing
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Sprout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No plants in your garden yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;