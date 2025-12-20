import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Check, 
  Star, 
  ArrowRight, 
  Users, 
  TrendingUp, 
  Award,
  Sprout,
  Clock,
  Target,
  Shield,
  Play
} from 'lucide-react';
import Header from '../../components/marketing/Header';
import Footer from '../../components/marketing/Footer';
import { mockTestimonials, mockStats, mockFeatures } from '../../data/mock';
import { AnimatedCounter } from '../../hooks/useCountUp';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      navigate('/signup', { state: { email } });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh] lg:min-h-[90vh]">
            {/* Left Column - Content */}
            <motion.div 
              className="text-center lg:text-left order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="heading-1 mb-4 md:mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Transform Your Balcony Into a 
                <span className="text-green-600"> Thriving Garden</span>
              </motion.h1>
              
              <motion.p 
                className="body-large mb-6 md:mb-8 text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Join 10,000+ urban gardeners in Bangladesh growing their own food with 
                personalized care plans, AI plant diagnosis, and expert community support
              </motion.p>

              {/* Value Propositions */}
              <motion.div 
                className="space-y-3 mb-6 md:mb-8 text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {[
                  'AI plant diagnosis in seconds',
                  'Personalized care reminders',
                  'Expert community of 10,000+ gardeners',
                  'Perfect for balconies & rooftops'
                ].map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="body-medium">{item}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Section */}
              <motion.div 
                className="max-w-md mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email to get started"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                    <motion.button
                      type="submit"
                      className="btn-primary whitespace-nowrap px-6 md:px-8"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Growing Free
                    </motion.button>
                  </div>
                </form>
                
                <div className="text-center mt-4 space-y-2">
                  <p className="text-sm text-gray-500">No credit card required • 2-minute setup</p>
                  <div className="flex items-center justify-center space-x-2 flex-wrap">
                    <div className="flex -space-x-2">
                      {['👨‍🌾', '👩‍🌾', '🧑‍🌾', '👨‍🌾'].map((avatar, i) => (
                        <motion.div 
                          key={i} 
                          className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm border-2 border-white"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: 1.5 + i * 0.1 }}
                        >
                          {avatar}
                        </motion.div>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">Join 10,000+ gardeners</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual */}
            <motion.div 
              className="relative order-1 lg:order-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1486484290742-0ce4eb743a34"
                  alt="Beautiful balcony garden with various plants"
                  className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Floating Stats Cards */}
                <motion.div 
                  className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-lg backdrop-blur-sm bg-white/90"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-bold text-green-600">
                      <AnimatedCounter end={95} suffix="%" />
                    </div>
                    <div className="text-xs text-gray-600">Success Rate</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg backdrop-blur-sm bg-white/90"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-bold text-blue-600">
                      <AnimatedCounter end={50} suffix="K+" />
                    </div>
                    <div className="text-xs text-gray-600">Plants Growing</div>
                  </div>
                </motion.div>

                {/* Garden Type Badge */}
                <motion.div 
                  className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                >
                  🏡 Balcony Garden
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Trusted by Urban Gardeners Across Bangladesh</h2>
          </div>
          
          {/* Statistics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
            {[
              { icon: Users, end: 10000, suffix: '+', label: 'Active Gardeners' },
              { icon: Sprout, end: 50000, suffix: '+', label: 'Plants Growing' },
              { icon: Star, end: 4.8, decimals: 1, label: 'Average Rating' },
              { icon: TrendingUp, end: 95, suffix: '%', label: 'Success Rate' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={index} 
                  className="text-center p-4 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="h-6 w-6 text-green-600" />
                  </motion.div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    <AnimatedCounter 
                      end={item.end} 
                      suffix={item.suffix || ''} 
                      decimals={item.decimals || 0}
                      duration={2.5}
                    />
                  </div>
                  <div className="text-sm md:text-base text-gray-600">{item.label}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {mockTestimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id} 
                className="product-card text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <motion.div 
                  className="flex justify-center mb-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </motion.div>
                <blockquote className="text-gray-700 mb-4 italic text-sm md:text-base">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex flex-col items-center">
                  <motion.div 
                    className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mb-2"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </motion.div>
                  <div className="font-semibold text-gray-900 text-sm md:text-base">{testimonial.name}</div>
                  <div className="text-xs md:text-sm text-gray-600">{testimonial.location} • {testimonial.gardenType}</div>
                  <div className="text-xs text-gray-500 mt-1">Using AgriCart Ai for {testimonial.usingFor}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem-Solution Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-2 mb-4">Urban Gardening Made Simple</h2>
            <p className="body-large text-gray-600">
              We solve the challenges that stop people from growing their own food
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                problem: "Not sure what plants will grow in your space?",
                solution: "AI recommends perfect plants for your balcony/roof based on space, sunlight, and climate",
                image: "https://images.unsplash.com/photo-1604762524889-3e2fcc145683",
                alt: "Collection of healthy potted plants"
              },
              {
                problem: "Forget watering schedules and care routines?",
                solution: "Smart reminders adapt to weather conditions and plant needs automatically",
                image: "https://images.unsplash.com/photo-1673853233647-17ebc2d71b5f",
                alt: "Person watering plants on windowsill"
              },
              {
                problem: "Plants getting sick and you don't know why?",
                solution: "Instant AI diagnosis with photo upload - identify diseases and get treatment plans in seconds",
                image: "https://images.unsplash.com/photo-1673853233774-34a726cfc335",
                alt: "Person carefully caring for plants in greenhouse"
              }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                {/* Image */}
                <motion.div 
                  className="mb-6 rounded-xl overflow-hidden shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-48 md:h-56 object-cover"
                    loading="lazy"
                  />
                </motion.div>

                {/* Problem */}
                <motion.div 
                  className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <p className="text-red-800 font-medium text-sm md:text-base">{item.problem}</p>
                </motion.div>

                {/* Arrow */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <ArrowRight className="h-6 w-6 md:h-8 md:w-8 text-gray-400 mx-auto mb-4" />
                </motion.div>

                {/* Solution */}
                <motion.div 
                  className="bg-green-50 border border-green-200 rounded-lg p-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <p className="text-green-800 font-medium text-sm md:text-base">{item.solution}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Everything You Need to Succeed</h2>
            <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
              From planting to harvest, we've got you covered
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {mockFeatures.slice(0, 6).map((feature, index) => (
              <motion.div 
                key={feature.id} 
                className="product-card group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <motion.div 
                  className="text-3xl md:text-4xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900 group-hover:text-green-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm md:text-base leading-relaxed">
                  {feature.description}
                </p>
                <motion.button 
                  className="text-green-600 font-medium hover:text-green-700 transition-colors flex items-center space-x-1 group"
                  whileHover={{ x: 5 }}
                >
                  <span>Learn More</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">Get Started in 3 Easy Steps</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: 1,
                title: "Tell Us About Your Space",
                description: "Answer 5 quick questions about your balcony or roof garden - takes just 2 minutes",
                duration: "2 min",
                icon: "📋"
              },
              {
                step: 2,
                title: "Get AI Plant Recommendations",
                description: "Our AI suggests plants perfect for your space, experience level, and climate",
                duration: "5 min",
                icon: "🎯"
              },
              {
                step: 3,
                title: "Follow Personalized Care Plans",
                description: "Get daily tasks, weather alerts, and expert advice. Watch your garden thrive!",
                duration: "Ongoing",
                icon: "🌾"
              }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative mb-6">
                  <motion.div 
                    className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto"
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.3 + index * 0.2 
                    }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {item.step}
                  </motion.div>
                  <motion.div 
                    className="absolute -top-2 -right-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    {item.duration}
                  </motion.div>
                </div>
                <motion.div 
                  className="text-3xl md:text-4xl mb-4"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 400,
                    damping: 17,
                    delay: 0.4 + index * 0.2 
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {item.icon}
                </motion.div>
                <h3 className="text-lg md:text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 mb-6 text-sm md:text-base">{item.description}</p>
                {index < 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.2 }}
                    viewport={{ once: true }}
                    className="hidden lg:block"
                  >
                    <ArrowRight className="h-6 w-6 text-green-600 mx-auto" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={handleGetStarted}
              className="btn-primary text-lg px-8 py-4"
            >
              Start Your Garden Journey →
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Start Your Urban Garden?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 10,000+ gardeners growing fresh food at home
          </p>
          
          <div className="max-w-md mx-auto mb-8">
            <form onSubmit={handleEmailSubmit} className="flex gap-3">
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
                Get Started Free
              </button>
            </form>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm opacity-80">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>100% Free to start</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;