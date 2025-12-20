import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Clock, ArrowRight } from 'lucide-react';
import Header from '../../components/marketing/Header';
import Footer from '../../components/marketing/Footer';
import { mockBlogArticles } from '../../data/mock';

const BlogHomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Posts');
  const [email, setEmail] = useState('');

  const categories = ['All Posts', 'Beginner Guides', 'Plant Care', 'Seasonal Tips', 'Success Stories', 'DIY Projects', 'Bangladesh Specific'];

  const filteredArticles = mockBlogArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Posts' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticle = mockBlogArticles[0];

  const popularPosts = [
    { title: "5 Common Plant Diseases in Bangladesh", views: "2.1k" },
    { title: "Best Time to Plant Vegetables in Dhaka", views: "1.8k" },
    { title: "DIY Vertical Garden Setup", views: "1.5k" },
    { title: "Monsoon Gardening Tips", views: "1.2k" },
    { title: "Container Gardening for Beginners", views: "1.0k" }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert('Thank you for subscribing to our weekly garden tips!');
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-6 text-center">
          <h1 className="heading-1 mb-6">
            AgriCart Ai Blog
          </h1>
          <p className="body-large mb-8" style={{ color: 'var(--text-secondary)' }}>
            Tips, guides, and inspiration for urban gardeners. Learn from experts and fellow gardeners across Bangladesh.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Newsletter Signup */}
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Get weekly tips via email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="btn-primary px-6 py-2"
              >
                Subscribe
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">Join 5,000+ subscribers</p>
          </form>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Article</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer"
                 onClick={() => navigate(`/blog/${featuredArticle.slug}`)}>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="p-8 flex flex-col justify-center">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4 w-fit">
                    {featuredArticle.category}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{featuredArticle.title}</h3>
                  <p className="text-gray-600 mb-6">{featuredArticle.excerpt}</p>
                  
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {featuredArticle.authorAvatar}
                      </div>
                      <span className="text-gray-700 font-medium">{featuredArticle.author}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{featuredArticle.publishedDate}</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{featuredArticle.readTime}</span>
                      </div>
                    </div>
                  </div>

                  <button className="btn-primary flex items-center space-x-2 w-fit">
                    <span>Read Article</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center p-8 min-h-80">
                  <div className="text-center">
                    <div className="text-8xl mb-4">{featuredArticle.featuredImage}</div>
                    <p className="text-green-700 font-medium">Featured Guide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-full font-medium transition-all
                  ${selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
                <span className="text-gray-600">Showing {filteredArticles.length} articles</span>
              </div>

              {filteredArticles.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => navigate(`/blog/${article.slug}`)}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
                    >
                      <div className="p-6">
                        <div className="text-4xl text-center mb-4">{article.featuredImage}</div>
                        
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-3">
                          {article.category}
                        </span>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{article.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                              {article.authorAvatar}
                            </div>
                            <span className="text-sm text-gray-700">{article.author}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or category filter</p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All Posts');
                    }}
                    className="btn-secondary"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Popular Posts */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Posts</h3>
                <div className="space-y-4">
                  {popularPosts.map((post, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm hover:text-green-600 cursor-pointer line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{post.views} views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.slice(1).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex justify-between"
                    >
                      <span>{category}</span>
                      <span className="text-sm text-gray-500">({Math.floor(Math.random() * 20) + 5})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2">Get Weekly Tips</h3>
                <p className="text-green-100 text-sm mb-4">
                  Join 5,000+ gardeners receiving our weekly newsletter
                </p>
                <form onSubmit={handleSubscribe}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full px-3 py-2 rounded-lg text-gray-900 mb-3"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-white text-green-600 py-2 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

              {/* Social Follow */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Facebook
                  </button>
                  <button className="bg-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-pink-600 transition-colors">
                    Instagram
                  </button>
                  <button className="bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors">
                    YouTube
                  </button>
                  <button className="bg-blue-400 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-500 transition-colors">
                    Twitter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogHomePage;