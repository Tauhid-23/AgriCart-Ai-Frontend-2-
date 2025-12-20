import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import Header from '../../components/marketing/Header';
import Footer from '../../components/marketing/Footer';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We\'ll respond within 24 hours.');
    setFormData({ name: '', email: '', subject: 'General', message: '' });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      info: 'ashrafislam.ruet@gmail.com',
      description: 'Send us an email anytime',
      action: 'mailto:ashrafislam.ruet@gmail.com'
    },
    {
      icon: Phone,
      title: 'Call Us',
      info: '+880-1678-738503',
      description: '9 AM - 6 PM (Dhaka Time)',
      action: 'tel:+880-1678-738503'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      info: 'Rajshahi, Bangladesh',
      description: 'Innovation Hub, Rajshahi University Of Engineering & Technology',
      action: null
    }
  ];

  const faqs = [
    {
      q: 'How do I get started with AgriCart Ai?',
      a: 'Simply sign up for a free account, tell us about your space, and we\'ll recommend perfect plants for your balcony or rooftop garden.'
    },
    {
      q: 'Is the plant diagnosis really accurate?',
      a: 'Yes! Our AI has 95%+ accuracy, trained on over 1 million plant images and validated by expert horticulturists.'
    },
    {
      q: 'Do you provide plants or seeds?',
      a: 'Currently, we provide guidance and recommendations. We\'re planning a marketplace feature to source plants locally.'
    },
    {
      q: 'Can I use AgriCart Ai outside Dhaka?',
      a: 'Absolutely! Our platform works across Bangladesh, with weather data and plant recommendations for all regions.'
    },
    {
      q: 'How much does it cost?',
      a: 'We offer a free plan for up to 5 plants. Premium plans start at ৳299/month with unlimited features.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-6 text-center">
          <h1 className="heading-1 mb-6">
            Get in Touch
          </h1>
          <p className="body-large mb-8" style={{ color: 'var(--text-secondary)' }}>
            Have questions about urban gardening or need help with our platform? We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div key={index} className="product-card text-center p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                    <Icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-lg font-semibold text-green-600 mb-2">{method.info}</p>
                  <p className="text-gray-600 mb-4">{method.description}</p>
                  {method.action && (
                    <a
                      href={method.action}
                      className="btn-primary inline-flex items-center"
                    >
                      Contact Now
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Send Us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="General">General Inquiry</option>
                    <option value="Support">Technical Support</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Press">Press & Media</option>
                    <option value="Feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-3 text-lg"
                >
                  Send Message
                </button>

                <p className="text-sm text-gray-600 text-center">
                  We'll respond within 24 hours during business days
                </p>
              </form>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-start">
                      <MessageCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      {faq.q}
                    </h4>
                    <p className="text-gray-700 pl-7">{faq.a}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-semibold text-green-900 mb-2">Need More Help?</h4>
                <p className="text-green-800 text-sm mb-4">
                  Check out our comprehensive help center with tutorials, guides, and troubleshooting tips.
                </p>
                <button className="text-green-600 font-medium hover:text-green-700">
                  Visit Help Center →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Location */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Visit Our Office</h2>
            
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl p-8 mb-6">
                  <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">AgriCart Ai Office</h3>
                  <p className="text-green-700">Dhaka, Bangladesh</p>
                </div>
                
                <div className="text-left space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">House 123, Road 456, Dhanmondi, Dhaka 1205</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">Saturday: 10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700">Sunday: Closed</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg">Interactive Map</p>
                  <p className="text-sm">Google Maps integration would appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Follow Us for Daily Tips</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community on social media for daily gardening tips and inspiration
          </p>
          
          <div className="flex justify-center space-x-6">
            <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors">
              Facebook
            </button>
            <button className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-lg font-semibold transition-colors">
              Instagram
            </button>
            <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors">
              YouTube
            </button>
            <button className="bg-blue-400 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold transition-colors">
              Twitter
            </button>
          </div>
          
          <div className="mt-8 text-green-200">
            <p className="mb-2">Follow counts:</p>
            <div className="flex justify-center space-x-8 text-sm">
              <span>📘 25K+ on Facebook</span>
              <span>📷 15K+ on Instagram</span>
              <span>📺 30K+ on YouTube</span>
              <span>🐦 8K+ on Twitter</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;