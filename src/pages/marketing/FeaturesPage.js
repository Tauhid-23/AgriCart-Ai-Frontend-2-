import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Header from '../../components/marketing/Header';
import Footer from '../../components/marketing/Footer';
import { mockFeatures } from '../../data/mock';

const FeaturesPage = () => {
  const navigate = useNavigate();

  const detailedFeatures = [
    {
      ...mockFeatures[0],
      benefits: ['95% diagnostic accuracy', 'Instant results in 3 seconds', 'Treatment recommendations', 'Prevention tips'],
      image: '🔍',
      stats: '50,000+ diagnoses completed'
    },
    {
      ...mockFeatures[1],
      benefits: ['Weather-adaptive reminders', 'Never miss watering again', 'Seasonal adjustments', 'Plant-specific timing'],
      image: '📱',
      stats: '99% user satisfaction rate'
    },
    {
      ...mockFeatures[2],
      benefits: ['10,000+ verified plants', 'Bangladesh climate specific', 'Difficulty ratings', 'Success rate tracking'],
      image: '📚',
      stats: 'Updated weekly with new varieties'
    },
    {
      ...mockFeatures[3],
      benefits: ['10,000+ active members', 'Expert advice available 24/7', 'Photo sharing & feedback', 'Local gardening tips'],
      image: '👥',
      stats: '2,500+ questions answered daily'
    },
    {
      ...mockFeatures[4],
      benefits: ['Visual growth charts', 'Harvest predictions', 'Health trend analysis', 'Performance insights'],
      image: '📊',
      stats: 'Track unlimited plants'
    },
    {
      ...mockFeatures[5],
      benefits: ['Hyperlocal forecasts', 'Monsoon preparation alerts', 'UV index monitoring', 'Wind speed warnings'],
      image: '🌤️',
      stats: 'Updated every 15 minutes'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-6 text-center">
          <h1 className="heading-1 mb-6">
            Powerful Features for Every Gardener
          </h1>
          <p className="body-large mb-8" style={{ color: 'var(--text-secondary)' }}>
            Discover all the tools that make AgriCart Ai the #1 urban gardening platform in Bangladesh
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="btn-primary text-lg px-8 py-4"
          >
            Start Free Trial
          </button>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="space-y-24">
            {detailedFeatures.map((feature, index) => (
              <div key={feature.id} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="text-6xl mb-6">{feature.image}</div>
                  <h2 className="heading-2 mb-6">{feature.title}</h2>
                  <p className="body-large mb-8" style={{ color: 'var(--text-secondary)' }}>
                    {feature.description}
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    {feature.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="body-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                    <p className="text-green-800 font-medium">{feature.stats}</p>
                  </div>

                  <button
                    onClick={() => navigate('/signup')}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>Try This Feature</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Visual */}
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl p-8 h-96 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-8xl mb-4">{feature.image}</div>
                      <h3 className="text-xl font-bold text-green-800">{feature.category}</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="heading-2 mb-6">Works With Your Favorite Tools</h2>
          <p className="body-large mb-12" style={{ color: 'var(--text-secondary)' }}>
            Seamlessly integrates with popular apps and services
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Weather APIs', icon: '🌤️' },
              { name: 'Calendar Sync', icon: '📅' },
              { name: 'WhatsApp Alerts', icon: '💬' },
              { name: 'Export Data', icon: '📊' }
            ].map((integration, index) => (
              <div key={index} className="product-card text-center p-6">
                <div className="text-4xl mb-4">{integration.icon}</div>
                <h3 className="font-semibold text-gray-900">{integration.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-6">How AgriCart Ai Compares</h2>
            <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
              See why thousands choose AgriCart Ai over traditional methods
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-50">
                  <tr>
                    <th className="text-left p-6 font-semibold text-gray-900">Features</th>
                    <th className="text-center p-6 font-semibold text-green-600">AgriCart Ai</th>
                    <th className="text-center p-6 font-semibold text-gray-600">Gardening Books</th>
                    <th className="text-center p-6 font-semibold text-gray-600">YouTube Tutorials</th>
                    <th className="text-center p-6 font-semibold text-gray-600">Other Apps</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    ['AI Plant Diagnosis', '✅', '❌', '❌', '⚠️'],
                    ['Real-time Weather Alerts', '✅', '❌', '❌', '⚠️'],
                    ['Bangladesh-specific Plants', '✅', '⚠️', '⚠️', '❌'],
                    ['Community Support', '✅', '❌', '⚠️', '⚠️'],
                    ['Personalized Care Plans', '✅', '❌', '❌', '⚠️'],
                    ['Mobile App', '✅', '❌', '⚠️', '✅']
                  ].map((row, index) => (
                    <tr key={index}>
                      <td className="p-6 font-medium text-gray-900">{row[0]}</td>
                      <td className="p-6 text-center text-2xl">{row[1]}</td>
                      <td className="p-6 text-center text-2xl">{row[2]}</td>
                      <td className="p-6 text-center text-2xl">{row[3]}</td>
                      <td className="p-6 text-center text-2xl">{row[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Experience All Features?</h2>
          <p className="text-xl mb-8 opacity-90">Join 10,000+ successful gardeners today</p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white text-green-600 font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors text-lg"
          >
            Start Your Free Trial
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;