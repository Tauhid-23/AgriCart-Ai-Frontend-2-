import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Target, Heart, TrendingUp, Award, MapPin } from 'lucide-react';
import Header from '../../components/marketing/Header';
import Footer from '../../components/marketing/Footer';

const AboutPage = () => {
  const navigate = useNavigate();

  const team = [
    { 
      name: 'Ashraf Islam Ashfaq', 
      role: 'Founder & CEO', 
      avatar: 'SA', 
      bio: '2 Years Experience Bridging Innovation, Operations & Business Growth',
      image: '/images/team/CEO.jpg'
    },
    { 
      name: 'Md.Tauhidul Islam Chowdhury', 
      role: 'Co-Founder & CTO', 
      avatar: 'KR', 
      bio: '1 Year Experience of App Development & AI Integration',
      image: '/images/team/CTO.png'
    },
    { 
      name: 'Most.Mobassara Jannat', 
      role: 'Co-Founder & COO', 
      avatar: 'FK', 
      bio: '1 Year Experience in Supply Chain management',
      image: '/images/team/COO.jpg'
    },
    { 
      name: 'Mohammad Sarfaraz Hussain', 
      role: 'Co-Founder & CMO', 
      avatar: 'RU', 
      bio: 'Product designer, UX specialist for mobile apps',
      image: '/images/team/CMO.jpg'
    }
  ];

  const timeline = [
    { year: '2023', event: 'Founded AgriCart Ai with a vision to democratize urban gardening' },
    { year: '2024', event: 'Launched beta with 1,000 gardeners across Dhaka' },
    { year: '2024', event: 'Reached 10,000+ active users nationwide' },
    { year: '2025', event: 'You join our growing community!' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-6 text-center">
          <h1 className="heading-1 mb-6">
            Growing a Greener Bangladesh,<br />
            <span className="text-green-600">One Balcony at a Time</span>
          </h1>
          <p className="body-large mb-8" style={{ color: 'var(--text-secondary)' }}>
            Our mission is to make urban gardening accessible, successful, and rewarding for everyone in Bangladesh
          </p>
          <div className="text-8xl mb-8">🌱</div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-2 text-center mb-12">Our Story</h2>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">The Problem We Saw</h3>
                <p className="text-gray-700 mb-4">
                  In 2023, our founder Dr. Sarah Ahmed noticed a growing interest in urban gardening across Bangladesh, but also saw countless people struggling with failed plants, confusing advice, and lack of local expertise.
                </p>
                <p className="text-gray-700 mb-4">
                  Despite Bangladesh's ideal climate for growing food, urban dwellers were importing expensive vegetables while their balconies remained empty. We knew there had to be a better way.
                </p>
                <p className="text-gray-700">
                  That's when we decided to combine AI technology with local agricultural wisdom to create the ultimate urban gardening companion.
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">💡</div>
                <h4 className="text-xl font-bold text-green-800 mb-2">The Idea</h4>
                <p className="text-green-700">AI-powered gardening guidance tailored for Bangladesh</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl p-8 text-center lg:order-1">
                <div className="text-6xl mb-4">🚀</div>
                <h4 className="text-xl font-bold text-blue-800 mb-2">The Solution</h4>
                <p className="text-blue-700">Personalized care plans with AI plant diagnosis</p>
              </div>
              <div className="lg:order-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">The Solution We Built</h3>
                <p className="text-gray-700 mb-4">
                  AgriCart Ai combines cutting-edge artificial intelligence with deep knowledge of Bangladesh's unique climate, soil conditions, and growing seasons.
                </p>
                <p className="text-gray-700 mb-4">
                  Our platform provides instant plant diagnosis, personalized care schedules, and connects users with a thriving community of local gardeners.
                </p>
                <p className="text-gray-700">
                  Today, we're proud to help over 10,000 urban gardeners across Bangladesh grow fresh, healthy food in their own homes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-2 text-center mb-16">Our Mission & Vision</h2>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="product-card text-center p-8">
                <Target className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-700">
                  To democratize urban gardening in Bangladesh by providing AI-powered, personalized guidance that makes growing fresh food accessible to everyone, regardless of experience level or space constraints.
                </p>
              </div>
              
              <div className="product-card text-center p-8">
                <Heart className="h-16 w-16 text-red-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                <p className="text-gray-700">
                  A Bangladesh where every urban household can grow their own fresh, healthy food, contributing to food security, environmental sustainability, and community well-being.
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Values</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: '🌱', title: 'Sustainability', desc: 'Promoting eco-friendly practices' },
                  { icon: '🤝', title: 'Community', desc: 'Building connections between gardeners' },
                  { icon: '🎯', title: 'Accessibility', desc: 'Making gardening simple for everyone' },
                  { icon: '💚', title: 'Local Focus', desc: 'Tailored for Bangladesh\'s unique needs' }
                ].map((value, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl mb-3">{value.icon}</div>
                    <h4 className="font-bold text-gray-900 mb-2">{value.title}</h4>
                    <p className="text-gray-600 text-sm">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="heading-2 mb-8">Our Impact</h2>
            <p className="body-large mb-12" style={{ color: 'var(--text-secondary)' }}>
              Numbers that show the difference we're making in Bangladesh's urban gardening landscape
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Users, number: '10,000+', label: 'Active Gardeners', color: 'text-blue-600' },
                { icon: TrendingUp, number: '50,000+', label: 'Plants Growing', color: 'text-green-600' },
                { icon: Award, number: '500,000+', label: 'Successful Harvests', color: 'text-purple-600' },
                { icon: MapPin, number: '1,000+', label: 'Tons CO₂ Saved', color: 'text-orange-600' }
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="product-card text-center p-6">
                    <Icon className={`h-12 w-12 ${stat.color} mx-auto mb-4`} />
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="heading-2 text-center mb-4">Meet the Team</h2>
            <p className="body-large text-center mb-12" style={{ color: 'var(--text-secondary)' }}>
              The passionate people behind AgriCart Ai
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="product-card text-center p-6">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-green-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-2 text-center mb-12">Our Journey</h2>
            
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-green-500"></div>
              
              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="text-2xl font-bold text-green-600 mb-2">{item.year}</div>
                        <p className="text-gray-700">{item.event}</p>
                      </div>
                    </div>
                    <div className="w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-lg relative z-10"></div>
                    <div className="w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners & Supporters */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="heading-2 mb-12">Partners & Supporters</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            {['Ministry of Agriculture', 'Bangladesh Agricultural Research', 'Dhaka Chamber of Commerce', 'UNDP Bangladesh'].map((partner, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-2xl mb-2">🏢</div>
                <p className="text-sm font-medium text-gray-700">{partner}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl mb-8 opacity-90">
            Be part of the urban gardening revolution in Bangladesh
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="bg-white text-green-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              Start Your Garden
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white hover:text-green-600 transition-colors"
            >
              Partner With Us
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;