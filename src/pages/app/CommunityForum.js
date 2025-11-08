import React, { useState, useEffect } from 'react';
import { Plus, Heart, MessageCircle, HelpCircle, Trophy, Users, Loader2, Search, Filter } from 'lucide-react';
import api from '../../services/api';

const CommunityForum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'General'
  });
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch posts and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsRes, categoriesRes] = await Promise.all([
          api.get('/community/posts', { 
            params: { 
              category: selectedCategory === 'All' ? undefined : selectedCategory, 
              search: searchTerm || undefined 
            } 
          }),
          api.get('/community/categories/popular')
        ]);
        
        setPosts(postsRes.data.posts || []);
        setCategories(categoriesRes.data.categories || []);
      } catch (error) {
        console.error('Failed to load community data:', error);
        setError('Failed to load community data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, selectedCategory]);

  const handleLikePost = async (postId) => {
    try {
      await api.post(`/community/posts/${postId}/like`);
      // Refresh posts to get updated like count
      const response = await api.get('/community/posts', { 
        params: { 
          category: selectedCategory === 'All' ? undefined : selectedCategory, 
          search: searchTerm || undefined 
        } 
      });
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Failed to like post:', error);
      alert('Failed to like post. Please try again.');
    }
  };

  const handleNewPost = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/community/posts', newPost);
      if (response.data.success) {
        // Add new post to the beginning of the list
        setPosts(prevPosts => [response.data.post, ...prevPosts]);
        setNewPost({ title: '', content: '', category: 'General' });
        setShowModal(false);
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const categoryNames = ['All', 'General', 'Beginner Questions', 'Plant Care', 'Success Stories', 'Problems', 'DIY Projects', 'Seasonal Tips'];

  const getLevelBadgeColor = (level) => {
    if (level.includes('Master')) return 'bg-purple-100 text-purple-800';
    if (level.includes('Expert')) return 'bg-blue-100 text-blue-800';
    if (level.includes('Blooming')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'General': 'bg-gray-100 text-gray-800',
      'Beginner Questions': 'bg-green-100 text-green-800',
      'Plant Care': 'bg-blue-100 text-blue-800',
      'Success Stories': 'bg-yellow-100 text-yellow-800',
      'Problems': 'bg-red-100 text-red-800',
      'DIY Projects': 'bg-purple-100 text-purple-800',
      'Seasonal Tips': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading community forum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Content - Posts Feed */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
              <p className="text-gray-600 mt-1">Connect with 10,000+ gardeners across Bangladesh</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Post</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                >
                  {categoryNames.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Posts */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                {/* Post Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {post.author?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{post.author?.fullName || 'Unknown User'}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelBadgeColor(post.author?.level || 'Beginner')}`}>
                        {post.author?.level || 'Beginner'}
                      </span>
                      <span className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{post.content}</p>
                </div>

                {/* Post Actions */}
                <div className="flex items-center space-x-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleLikePost(post._id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                    <span className="font-medium">{post.likes?.length || 0}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                    <span className="font-medium">{post.replies?.length || 0} replies</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                    <HelpCircle className="h-5 w-5" />
                    {/* ... rest of the component remains the same */}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* ... rest of the component remains the same */}
      </div>
    </div>
  );
};

export default CommunityForum;