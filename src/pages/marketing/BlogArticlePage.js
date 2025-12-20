import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Share2, Heart, MessageCircle } from 'lucide-react';
import Header from '../../components/marketing/Header';
import Footer from '../../components/marketing/Footer';
import { mockBlogArticles } from '../../data/mock';

const BlogArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const foundArticle = mockBlogArticles.find(a => a.slug === slug);
    setArticle(foundArticle);
  }, [slug]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert('Thank you for subscribing!');
      setEmail('');
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="hero-section">
          <div className="container mx-auto px-6 py-16 text-center">
            <h1 className="heading-1 mb-4">Article Not Found</h1>
            <p className="body-large mb-8" style={{ color: 'var(--text-secondary)' }}>The article you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/blog')}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Blog</span>
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedArticles = mockBlogArticles.filter(a => a.id !== article.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Article Header */}
      <div className="hero-section">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <button onClick={() => navigate('/')} className="hover:text-gray-700">Home</button>
              <span>›</span>
              <button onClick={() => navigate('/blog')} className="hover:text-gray-700">Blog</button>
              <span>›</span>
              <span className="text-gray-900">{article.category}</span>
            </div>
          </nav>

          <div className="max-w-4xl mx-auto">
            {/* Article Meta */}
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full mb-4">
                {article.category}
              </span>
              <h1 className="heading-1 mb-6">{article.title}</h1>
              
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    {article.authorAvatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{article.author}</p>
                    <p className="text-sm text-gray-600">{article.authorBio}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span>{article.publishedDate}</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Social Share */}
              <div className="flex items-center space-x-4 pb-8 border-b border-gray-200">
                <span className="text-sm text-gray-600">Share:</span>
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors">
                  <span>Facebook</span>
                </button>
                <button className="flex items-center space-x-2 bg-blue-400 text-white px-3 py-1 rounded-lg hover:bg-blue-500 transition-colors">
                  <span>Twitter</span>
                </button>
                <button className="flex items-center space-x-2 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <article className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Hero Image */}
            <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl p-12 mb-12 text-center">
              <div className="text-8xl mb-4">{article.featuredImage}</div>
              <p className="text-green-700 font-medium">Featured illustration for this guide</p>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Quick Summary</h3>
                <p className="text-blue-800">{article.excerpt}</p>
              </div>

              {/* Sample Article Content */}
              <p>
                Urban gardening in Bangladesh has become increasingly popular as more people recognize the benefits of growing their own fresh produce. Whether you're working with a small balcony or a rooftop space, creating a productive garden is entirely achievable with the right knowledge and approach.
              </p>

              <h2>Getting Started: Choosing Your Space</h2>
              <p>
                The first step in creating your urban garden is assessing your available space. In Bangladesh's tropical climate, most vegetables and herbs can thrive in containers with proper care. Consider factors like:
              </p>

              <ul>
                <li>Available sunlight (minimum 4-6 hours daily)</li>
                <li>Water access and drainage</li>
                <li>Wind protection, especially during monsoon</li>
                <li>Weight limitations for rooftop gardens</li>
              </ul>

              <h2>Essential Plants for Bangladesh Climate</h2>
              <p>
                Bangladesh's warm, humid climate is perfect for many vegetables and herbs. Here are some of the best options for beginners:
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-8">
                <h4 className="font-semibold text-green-900 mb-3">🌿 Beginner-Friendly Plants</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-green-800">Herbs:</h5>
                    <ul className="text-green-700 text-sm">
                      <li>• Basil (তুলসী)</li>
                      <li>• Coriander (ধনিয়া)</li>
                      <li>• Mint (পুদিনা)</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-green-800">Vegetables:</h5>
                    <ul className="text-green-700 text-sm">
                      <li>• Chili peppers (কাঁচা মরিচ)</li>
                      <li>• Spinach (পালং শাক)</li>
                      <li>• Lettuce</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h2>Watering and Care Tips</h2>
              <p>
                Proper watering is crucial in Bangladesh's climate. During the hot season (March-May), plants may need watering twice daily, while in monsoon season (June-October), you'll need to focus on drainage and preventing waterlogging.
              </p>

              <blockquote className="border-l-4 border-green-500 pl-6 italic text-gray-700 my-8">
                "The key to successful urban gardening in Bangladesh is understanding that our climate is actually ideal for year-round growing - you just need to adapt your techniques to each season." - Dr. Sarah Ahmed, Urban Horticulturist
              </blockquote>

              {/* CTA within article */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl p-8 my-12 text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Put This Into Practice?</h3>
                <p className="text-green-100 mb-6">
                  Start your garden journey with AgriCart Ai's personalized guidance
                </p>
                <button
                  onClick={() => navigate('/signup')}
                  className="bg-white text-green-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Start Your Garden Today
                </button>
              </div>

              <h2>Dealing with Common Challenges</h2>
              <p>
                Every urban gardener in Bangladesh faces similar challenges. Here's how to address the most common ones:
              </p>

              <div className="grid md:grid-cols-2 gap-6 my-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Challenge: Monsoon Damage</h4>
                  <p className="text-yellow-800 text-sm">Heavy rains can damage plants and cause waterlogging.</p>
                  <p className="text-yellow-700 text-sm mt-2"><strong>Solution:</strong> Ensure proper drainage and consider movable containers.</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">🐛 Challenge: Pest Problems</h4>
                  <p className="text-red-800 text-sm">High humidity attracts insects and pests.</p>
                  <p className="text-red-700 text-sm mt-2"><strong>Solution:</strong> Use neem oil and companion planting.</p>
                </div>
              </div>

              <h2>Conclusion</h2>
              <p>
                Starting your urban garden in Bangladesh is one of the most rewarding decisions you can make. With proper planning, the right plants, and consistent care, you'll be harvesting fresh vegetables and herbs within weeks. Remember that gardening is a learning process - every season teaches you something new.
              </p>
            </div>

            {/* Author Bio */}
            <div className="bg-gray-50 rounded-xl p-8 mt-12 mb-12">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {article.authorAvatar}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">About {article.author}</h4>
                  <p className="text-gray-700 mb-4">{article.authorBio}</p>
                  <div className="flex space-x-3">
                    <button className="text-blue-600 hover:text-blue-700">Follow on LinkedIn</button>
                    <button className="text-blue-400 hover:text-blue-500">Follow on Twitter</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Buttons */}
            <div className="flex items-center justify-between py-8 border-t border-b border-gray-200 mb-12">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                  <Heart className="h-5 w-5" />
                  <span>24 likes</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                  <span>12 comments</span>
                </button>
              </div>
              
              <button className="btn-secondary">
                View All Articles by {article.author}
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">You Might Also Like</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <div
                  key={relatedArticle.id}
                  onClick={() => navigate(`/blog/${relatedArticle.slug}`)}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="text-4xl text-center mb-4">{relatedArticle.featuredImage}</div>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-3">
                      {relatedArticle.category}
                    </span>
                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{relatedArticle.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{relatedArticle.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">Get More Tips Like This</h3>
          <p className="body-large mb-8" style={{ color: 'var(--text-secondary)' }}>
            Join 5,000+ gardeners receiving our weekly newsletter with practical tips and guides
          </p>
          
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="bg-white text-green-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </button>
            </div>
            <p className="text-green-200 text-sm mt-3">No spam, unsubscribe anytime</p>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogArticlePage;