import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sprout, Eye, EyeOff, Mail, Lock, User, MapPin, Home, Building } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gardenType: '',
    location: { city: '', division: '', district: '', area: '' },
    spaceSize: '',
    plants: [],
    experience: '',
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handlePlantToggle = (plant) => {
    setFormData(prev => ({
      ...prev,
      plants: prev.plants.includes(plant)
        ? prev.plants.filter(p => p !== plant)
        : [...prev.plants, plant]
    }));
  };

  const handleNextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.gardenType || !formData.location.division || !formData.spaceSize) {
        setError('Please fill in all required fields');
        return;
      }
    }
    
    setError('');
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setError('');
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate final step
    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      setLoading(false);
      return;
    }
    
    try {
      // Prepare data for registration
      const registrationData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        location: formData.location,
        gardenType: formData.gardenType,
        spaceSize: formData.spaceSize,
        experience: formData.experience,
        plants: formData.plants
      };
      
      const result = await register(registrationData);
      
      if (result.success) {
        // Registration successful, user is automatically logged in
        // Redirect to the intended page or dashboard
        const from = location.state?.from || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Account Details' },
    { number: 2, title: 'Garden Setup' },
    { number: 3, title: 'Preferences' }
  ];

  // Common plant categories for selection
  const commonPlants = [
    'Herbs', 'Vegetables', 'Fruits', 'Flowers', 'Decorative Plants'
  ];

  // Bangladesh divisions and districts
  const divisions = {
    'Dhaka': ['Dhaka', 'Gazipur', 'Narayanganj', 'Manikganj', 'Munshiganj', 'Narsingdi', 'Tangail'],
    'Chittagong': ['Chittagong', 'Cox\'s Bazar', 'Rangamati', 'Bandarban', 'Khagrachari', 'Feni'],
    'Rajshahi': ['Rajshahi', 'Bogra', 'Pabna', 'Sirajganj', 'Natore', 'Naogaon'],
    'Khulna': ['Khulna', 'Jessore', 'Satkhira', 'Bagerhat', 'Chuadanga', 'Kushtia'],
    'Barisal': ['Barisal', 'Patuakhali', 'Bhola', 'Pirojpur', 'Jhalokati', 'Barguna'],
    'Sylhet': ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
    'Rangpur': ['Rangpur', 'Dinajpur', 'Lalmonirhat', 'Nilphamari', 'Gaibandha', 'Kurigram'],
    'Mymensingh': ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur']
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-emerald-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20" />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white text-center">
          <div className="text-8xl mb-6">🌱</div>
          <h2 className="text-3xl font-bold mb-4">Join 10,000+ Urban Gardeners</h2>
          <p className="text-xl mb-8 opacity-90">
            Start growing fresh vegetables and herbs in your own space
          </p>
          
          <div className="space-y-4 max-w-md">
            {[
              'AI-powered plant diagnosis',
              'Personalized care reminders',
              'Expert community support',
              'Weather-based alerts'
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-green-800 font-bold text-sm">✓</span>
                </div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <p className="text-sm opacity-75 mb-2">Join thousands of successful gardeners</p>
            <div className="flex -space-x-2 justify-center">
              {['🧑‍🌾', '👩‍🌾', '🧑‍🌾', '👨‍🌾', '👩‍🌾'].map((avatar, i) => (
                <div key={i} className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-lg border-2 border-white border-opacity-30">
                  {avatar}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8 lg:justify-start">
            <Link to="/" className="flex items-center space-x-2">
              <Sprout className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">AgriCart Ai</span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Start Growing Today!</h1>
            <p className="text-gray-600">Create your free account in 2 minutes</p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${currentStep >= step.number 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-400'
                    }
                  `}>
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      w-12 h-1 mx-2
                      ${currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Account Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="6"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Must be at least 6 characters</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn-primary w-full py-3 text-lg"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Garden Setup */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Garden Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Where is your garden? *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'balcony', label: 'Balcony', icon: '🪟' },
                      { id: 'rooftop', label: 'Rooftop', icon: '🏠' },
                      { id: 'indoor', label: 'Indoor', icon: '🏢' },
                      { id: 'backyard', label: 'Backyard', icon: '🏡' }
                    ].map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, gardenType: option.id }))}
                        className={`
                          p-4 border rounded-lg text-center transition-colors
                          ${formData.gardenType === option.id
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-300 hover:border-gray-400'
                          }
                        `}
                      >
                        <div className="text-2xl mb-1">{option.icon}</div>
                        <div className="font-medium">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Division</label>
                      <select
                        name="location.division"
                        value={formData.location.division}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select Division</option>
                        {Object.keys(divisions).map(division => (
                          <option key={division} value={division}>{division}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">District</label>
                      <select
                        name="location.district"
                        value={formData.location.district}
                        onChange={handleChange}
                        disabled={!formData.location.division}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select District</option>
                        {formData.location.division && divisions[formData.location.division].map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="block text-xs text-gray-500 mb-1">Area/Thana</label>
                    <input
                      type="text"
                      name="location.area"
                      value={formData.location.area}
                      onChange={handleChange}
                      placeholder="e.g., Gulshan"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">City</label>
                    <input
                      type="text"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleChange}
                      placeholder="e.g., Dhaka"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Space Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How much space do you have? *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'small', label: 'Small', desc: '< 50 sq ft' },
                      { id: 'medium', label: 'Medium', desc: '50-100 sq ft' },
                      { id: 'large', label: 'Large', desc: '> 100 sq ft' }
                    ].map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, spaceSize: option.id }))}
                        className={`
                          p-3 border rounded-lg text-center transition-colors
                          ${formData.spaceSize === option.id
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-300 hover:border-gray-400'
                          }
                        `}
                      >
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn-secondary flex-1 py-3"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="btn-primary flex-1 py-3"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What's your gardening experience?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'beginner', label: 'Beginner', desc: 'Just starting' },
                      { id: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
                      { id: 'expert', label: 'Expert', desc: 'Experienced gardener' }
                    ].map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, experience: option.id }))}
                        className={`
                          p-3 border rounded-lg text-center transition-colors
                          ${formData.experience === option.id
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-300 hover:border-gray-400'
                          }
                        `}
                      >
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plants to Grow */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What type of plants are you interested in growing? (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {commonPlants.map((plant) => (
                      <button
                        key={plant}
                        type="button"
                        onClick={() => handlePlantToggle(plant)}
                        className={`
                          p-2 border rounded-lg text-center transition-colors
                          ${formData.plants.includes(plant)
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-300 hover:border-gray-400'
                          }
                        `}
                      >
                        {plant}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeTerms"
                      name="agreeTerms"
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="agreeTerms" className="text-gray-700">
                      I agree to the <Link to="#" className="text-green-600 hover:text-green-500">Terms of Service</Link> and <Link to="#" className="text-green-600 hover:text-green-500">Privacy Policy</Link>
                    </label>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="btn-secondary flex-1 py-3"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex-1 py-3"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;