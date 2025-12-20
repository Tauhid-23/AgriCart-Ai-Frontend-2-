import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { Camera, User, Mail, MapPin, Calendar, Edit3, Save, Loader2 } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    division: '',
    district: '',
    area: '',
    gardenType: '',
    spaceSize: '',
    experience: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Use the user data from context if available, otherwise fetch from API
        if (user) {
          setProfile(user);
          setFormData({
            fullName: user.fullName || '',
            email: user.email || '',
            phone: user.location?.phone || '',
            division: user.location?.division || '',
            district: user.location?.district || '',
            area: user.location?.area || '',
            gardenType: user.gardenType || '',
            spaceSize: user.spaceSize || '',
            experience: user.experience || ''
          });
        } else {
          const response = await authAPI.getMe();
          setProfile(response.data.user);
          setFormData({
            fullName: response.data.user.fullName || '',
            email: response.data.user.email || '',
            phone: response.data.user.location?.phone || '',
            division: response.data.user.location?.division || '',
            district: response.data.user.location?.district || '',
            area: response.data.user.location?.area || '',
            gardenType: response.data.user.gardenType || '',
            spaceSize: response.data.user.spaceSize || '',
            experience: response.data.user.experience || ''
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      
      const updateData = {
        fullName: formData.fullName,
        phone: formData.phone,
        division: formData.division,
        district: formData.district,
        area: formData.area,
        gardenType: formData.gardenType,
        spaceSize: formData.spaceSize,
        experience: formData.experience
      };
      
      const response = await authAPI.updateProfile(updateData);
      
      // Update both local state and auth context
      setProfile(response.data.user);
      updateUser(response.data.user);
      
      setEditing(false);
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      fullName: profile.fullName || '',
      email: profile.email || '',
      phone: profile.location?.phone || '',
      division: profile.location?.division || '',
      district: profile.location?.district || '',
      area: profile.location?.area || '',
      gardenType: profile.gardenType || '',
      spaceSize: profile.spaceSize || '',
      experience: profile.experience || ''
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold mb-2">Error Loading Profile</p>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>
        
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-green-600">
                {profile?.fullName?.charAt(0) || 'U'}
              </div>
              {editing && (
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md">
                  <Camera className="h-4 w-4 text-green-600" />
                </button>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profile?.fullName || 'User'}</h2>
              <p className="text-green-100">{profile?.level || 'Budding Gardener'}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-green-200">
                <span className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>{profile?.email}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {profile?.location?.city ? `${profile.location.city}, ${profile.location.division}` : 'Bangladesh'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50">
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{profile?.plantsGrown || 0}</div>
            <div className="text-sm text-gray-600">Plants Grown</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{profile?.harvestsCompleted || 0}</div>
            <div className="text-sm text-gray-600">Harvests</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">{profile?.points || 0}</div>
            <div className="text-sm text-gray-600">Garden Points</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">
              {profile?.createdAt ? Math.floor((new Date() - new Date(profile.createdAt)) / (1000 * 60 * 60 * 24)) : 0}
            </div>
            <div className="text-sm text-gray-600">Days Active</div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                ) : (
                  <p className="text-gray-900">{profile?.fullName || 'Not provided'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="text-gray-900">{profile?.email || 'Not provided'}</p>
                <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 01712345678"
                  />
                ) : (
                  <p className="text-gray-900">{profile?.location?.phone || 'Not provided'}</p>
                )}
              </div>
            </div>
            
            {/* Location Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Location</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Division</label>
                {editing ? (
                  <select
                    value={formData.division}
                    onChange={(e) => handleInputChange('division', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Division</option>
                    {Object.keys(divisions).map(division => (
                      <option key={division} value={division}>{division}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{profile?.location?.division || 'Not provided'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                {editing ? (
                  <select
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={!formData.division}
                  >
                    <option value="">Select District</option>
                    {formData.division && divisions[formData.division]?.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{profile?.location?.district || 'Not provided'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Area/Thana</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{profile?.location?.area || 'Not provided'}</p>
                )}
              </div>
            </div>
            
            {/* Garden Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Garden Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Garden Type</label>
                {editing ? (
                  <select
                    value={formData.gardenType}
                    onChange={(e) => handleInputChange('gardenType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Garden Type</option>
                    <option value="balcony">Balcony</option>
                    <option value="roof">Roof</option>
                    <option value="both">Both</option>
                  </select>
                ) : (
                  <p className="text-gray-900 capitalize">{profile?.gardenType || 'Not provided'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Space Size</label>
                {editing ? (
                  <select
                    value={formData.spaceSize}
                    onChange={(e) => handleInputChange('spaceSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Space Size</option>
                    <option value="small">Small (1-5 sq.m)</option>
                    <option value="medium">Medium (5-10 sq.m)</option>
                    <option value="large">Large (10+ sq.m)</option>
                  </select>
                ) : (
                  <p className="text-gray-900 capitalize">{profile?.spaceSize || 'Not provided'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                {editing ? (
                  <select
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Experience Level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                ) : (
                  <p className="text-gray-900 capitalize">{profile?.experience || 'Not provided'}</p>
                )}
              </div>
            </div>
            
            {/* Account Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Account Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <p className="text-gray-900">
                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Not available'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Login</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <p className="text-gray-900">
                    {profile?.lastLogin ? new Date(profile.lastLogin).toLocaleString() : 'Not available'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          {editing && (
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center justify-center space-x-2 flex-1"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;