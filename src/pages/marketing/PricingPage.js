import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Shield, Clock, Target } from 'lucide-react';
import Header from '../../components/marketing/Header';
import Footer from '../../components/marketing/Footer';
import { mockPricingPlans } from '../../data/mock';

const PricingPage = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);
  const [monthlySavings, setMonthlySavings] = useState(500);

  const handlePlanSelect = (plan) => {
    if (plan.name === 'FREE') {
      navigate('/signup');
    } else if (plan.name === 'PRO') {
      navigate('/signup', { state: { plan: 'pro' } });
    } else {
      // Contact sales for Expert plan
      navigate('/contact');
    }
  };

  const calculateROI = (savings) => {
    const proPlanCost = 299;
    const monthsToPayback = Math.ceil(proPlanCost / savings);
    return monthsToPayback;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-6 text-center">
          <h1 className="heading-1 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="body-large mb-8" style={{ color: 'var(--text-secondary)' }}>
            Choose the plan that fits your gardening goals. Start free, upgrade when you need more.
          </p>
          
          {/* Billing Toggle */}
          <div className="bg-white rounded-full p-1 inline-flex shadow-lg mb-12">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${!isAnnual ? 'bg-green-600 text-white' : 'text-gray-600'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${isAnnual ? 'bg-green-600 text-white' : 'text-gray-600'}`}
            >
              Annual <span className="text-green-500 text-sm ml-1">(Save 20%)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {mockPricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`
                  relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-2
                  ${plan.popular ? 'ring-2 ring-green-500 scale-105' : ''}
                `}
              >
                {plan.popular && (
                  <div className="bg-green-500 text-white text-center py-2 font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    {plan.badge && (
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
                        {plan.badge}
                      </span>
                    )}
                    
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-gray-900">
                        {plan.currency}{isAnnual && plan.originalPrice ? Math.round(plan.price * 0.8) : plan.price}
                      </span>
                      <span className="text-gray-600">/{plan.period}</span>
                      
                      {plan.originalPrice && (
                        <div className="text-sm text-gray-500 mt-1">
                          <span className="line-through">{plan.currency}{plan.originalPrice}</span>
                          <span className="text-green-600 ml-2">Save {plan.currency}{plan.originalPrice - plan.price}</span>
                        </div>
                      )}
                    </div>

                    {isAnnual && plan.price > 0 && (
                      <div className="text-green-600 font-medium text-sm">
                        Save {plan.currency}{Math.round(plan.price * 12 * 0.2)} per year
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handlePlanSelect(plan)}
                    className={`
                      w-full py-3 px-6 rounded-lg font-semibold transition-all
                      ${plan.popular 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'border-2 border-green-600 text-green-600 hover:bg-green-50'
                      }
                    `}
                  >
                    {plan.cta}
                  </button>

                  {plan.note && (
                    <p className="text-center text-sm text-gray-500 mt-3">{plan.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="text-center mt-16">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-gray-600">30-Day Money-Back Guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span className="text-gray-600">Cancel Anytime, No Penalties</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <span className="text-gray-600">Your Data is Yours to Export</span>
              </div>
            </div>
            
            <div className="mt-8">
              <p className="text-gray-600 mb-4">We accept:</p>
              <div className="flex justify-center items-center space-x-6">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded text-gray-900 font-semibold">bKash</div>
                <div className="bg-white border border-gray-200 px-4 py-2 rounded text-gray-900 font-semibold">Nagad</div>
                <div className="bg-white border border-gray-200 px-4 py-2 rounded text-gray-900 font-semibold">Visa</div>
                <div className="bg-white border border-gray-200 px-4 py-2 rounded text-gray-900 font-semibold">Mastercard</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">See Your Savings</h2>
              <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
                Calculate how much you can save by growing your own vegetables
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How much do you spend on vegetables per month?
                </label>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">৳100</span>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={monthlySavings}
                    onChange={(e) => setMonthlySavings(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-gray-600">৳2000</span>
                </div>
                <div className="text-center mt-2">
                  <span className="text-2xl font-bold text-green-600">৳{monthlySavings}</span>
                  <span className="text-gray-600"> per month</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-center">
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-semibold text-green-900 mb-2">Monthly Savings</h4>
                  <div className="text-3xl font-bold text-green-600">৳{Math.round(monthlySavings * 0.7)}</div>
                  <p className="text-sm text-green-700 mt-2">By growing your own vegetables</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-900 mb-2">Payback Period</h4>
                  <div className="text-3xl font-bold text-blue-600">{calculateROI(Math.round(monthlySavings * 0.7))} months</div>
                  <p className="text-sm text-blue-700 mt-2">Pro plan pays for itself</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">
                  Save <strong>৳{Math.round(monthlySavings * 0.7 * 12)}</strong> per year by growing your own food
                </p>
                <button
                  onClick={() => navigate('/signup')}
                  className="btn-primary"
                >
                  Start Saving Today
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="heading-2 mb-4">Full Feature Comparison</h2>
            <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
              See what's included in each plan
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-6 font-semibold text-gray-900 min-w-64">Features</th>
                    <th className="text-center p-6 font-semibold text-gray-600">Free</th>
                    <th className="text-center p-6 font-semibold text-green-600">Pro</th>
                    <th className="text-center p-6 font-semibold text-gray-600">Expert</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[
                    ['Plants you can track', '5 plants', 'Unlimited', 'Unlimited'],
                    ['AI Plant diagnosis', '❌', '✅ Unlimited', '✅ Priority'],
                    ['Care reminders', '✅ Basic', '✅ Advanced', '✅ AI-powered'],
                    ['Community access', '✅', '✅', '✅ VIP status'],
                    ['Weather alerts', '✅', '✅', '✅ Hyperlocal'],
                    ['Analytics & reports', '❌', '✅', '✅ Advanced'],
                    ['Expert consultations', '❌', '❌', '✅ 2 per month'],
                    ['Custom garden plans', '❌', '❌', '✅'],
                    ['API access', '❌', '❌', '✅'],
                    ['Priority support', '❌', '✅', '✅ 24/7']
                  ].map((row, index) => (
                    <tr key={index}>
                      <td className="p-6 font-medium text-gray-900">{row[0]}</td>
                      <td className="p-6 text-center">{row[1]}</td>
                      <td className="p-6 text-center font-medium">{row[2]}</td>
                      <td className="p-6 text-center">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">Pricing FAQ</h2>
              <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
                Common questions about our pricing and plans
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  q: "Is the free plan really free forever?",
                  a: "Yes! Our free plan includes core features for up to 5 plants and will always be free. Perfect for beginners or small gardens."
                },
                {
                  q: "Can I cancel my subscription anytime?",
                  a: "Absolutely. Cancel anytime from your account settings. No questions asked, no cancellation fees. You'll keep access until the end of your billing cycle."
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept bKash, Nagad, credit/debit cards (Visa, Mastercard), and bank transfers. All payments are secured and processed locally in Bangladesh."
                },
                {
                  q: "Do you offer refunds?",
                  a: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied within the first 30 days, we'll refund your payment completely."
                },
                {
                  q: "Can I upgrade or downgrade my plan?",
                  a: "Yes, you can change your plan anytime. Upgrades take effect immediately, and downgrades take effect at the next billing cycle."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-3">{faq.q}</h4>
                  <p className="text-gray-700">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PricingPage;