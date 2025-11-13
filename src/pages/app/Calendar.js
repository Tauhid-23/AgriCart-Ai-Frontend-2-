import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { taskAPI } from '../../services/api';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  CheckCircle, 
  Circle, 
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Calendar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasksByDate, setTasksByDate] = useState({});

  // Fetch tasks for the current month
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('📅 Calendar: Fetching tasks for current date:', currentDate);
        
        // Check if user is authenticated
        if (!user) {
          console.log('📅 Calendar: User not authenticated, skipping task fetch');
          setLoading(false);
          return;
        }
        
        // Get the first and last day of the current month
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        // Extend the range to include full weeks
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        
        const endDate = new Date(lastDay);
        endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
        
        // Format dates properly for the API
        const startDateStr = startDate.toISOString().split('T')[0];
        const endDateStr = endDate.toISOString().split('T')[0];
        
        console.log('📅 Calendar: Fetching tasks for date range:', { 
          startDateStr, 
          endDateStr,
          startDateRaw: startDate,
          endDateRaw: endDate
        });
        
        const response = await taskAPI.getByDateRange(startDateStr, endDateStr);
        
        console.log('📅 Calendar: Tasks response received:', response);
        
        // Group tasks by date
        const groupedTasks = {};
        if (response.data.tasks && Array.isArray(response.data.tasks)) {
          response.data.tasks.forEach(task => {
            const dateKey = new Date(task.dueDate).toISOString().split('T')[0];
            if (!groupedTasks[dateKey]) {
              groupedTasks[dateKey] = [];
            }
            groupedTasks[dateKey].push(task);
          });
          
          setTasksByDate(groupedTasks);
          setTasks(response.data.tasks);
        } else {
          console.warn('📅 Calendar: Unexpected response structure:', response.data);
          setTasksByDate({});
          setTasks([]);
        }
      } catch (err) {
        console.error('📅 Calendar: Failed to load tasks:', err);
        console.error('📅 Calendar: Error details:', {
          message: err.message,
          response: err.response,
          request: err.request
        });
        setError('Failed to load tasks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [currentDate, user]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const getTasksForDate = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    return tasksByDate[dateKey] || [];
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Previous month days
    const prevMonth = new Date(year, month - 1, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());
    
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, daysInPrevMonth - i);
      days.push({ date, isCurrentMonth: false });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Next month days
    const totalCells = 42; // 6 weeks * 7 days
    const remainingCells = totalCells - days.length;
    
    for (let i = 1; i <= remainingCells; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading calendar...</p>
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
            <CalendarIcon className="h-8 w-8 text-green-600" />
            <span>Planting Calendar</span>
          </h1>
          <p className="text-gray-600 mt-1">Manage your gardening tasks and schedule</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
          
          <button
            onClick={() => {
              setCurrentDate(new Date());
              setSelectedDate(new Date());
            }}
            className="btn-secondary text-sm"
          >
            Today
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 bg-gray-50 border-b">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((dayObj, index) => {
                const tasksForDay = getTasksForDate(dayObj.date);
                const hasTasks = tasksForDay.length > 0;
                
                return (
                  <div
                    key={index}
                    onClick={() => handleDateClick(dayObj.date)}
                    className={`
                      min-h-24 p-2 border-b border-r cursor-pointer transition-colors
                      ${dayObj.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                      ${isToday(dayObj.date) ? 'bg-blue-50' : ''}
                      ${isSelected(dayObj.date) ? 'bg-green-50 ring-2 ring-green-500' : 'hover:bg-gray-50'}
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`
                        text-sm font-medium
                        ${isToday(dayObj.date) ? 'bg-blue-600 text-white rounded-full h-6 w-6 flex items-center justify-center' : ''}
                      `}>
                        {dayObj.date.getDate()}
                      </span>
                      {hasTasks && (
                        <span className="text-xs bg-red-100 text-red-800 rounded-full h-5 w-5 flex items-center justify-center">
                          {tasksForDay.length}
                        </span>
                      )}
                    </div>
                    
                    {/* Task indicators */}
                    <div className="mt-1 space-y-1">
                      {tasksForDay.slice(0, 2).map((task, taskIndex) => (
                        <div
                          key={taskIndex}
                          className={`text-xs px-1 py-0.5 rounded truncate ${getPriorityColor(task.priority)}`}
                        >
                          {task.title}
                        </div>
                      ))}
                      {tasksForDay.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{tasksForDay.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Task List for Selected Date */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {formatDate(selectedDate)}
              </h2>
              <button 
                onClick={() => navigate('/tasks')}
                className="btn-primary text-sm flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Task</span>
              </button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getTasksForDate(selectedDate).length > 0 ? (
                getTasksForDate(selectedDate).map((task) => (
                  <div 
                    key={task._id} 
                    className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2">
                        {getStatusIcon(task.status)}
                        <div>
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                          {task.plant && (
                            <p className="text-sm text-gray-600">{task.plant.name}</p>
                          )}
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTime(task.dueDate)}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks scheduled</h3>
                  <p className="text-gray-500 mb-4">You don't have any tasks for this day.</p>
                  <button 
                    onClick={() => navigate('/tasks')}
                    className="btn-primary inline-flex items-center space-x-2 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Task</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;