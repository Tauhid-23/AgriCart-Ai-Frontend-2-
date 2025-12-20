import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Facebook, Instagram, Twitter, Linkedin, Youtube, Heart } from 'lucide-react';

const Footer = () => {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Plant Database', href: '/database' },
        { name: 'Mobile App', href: '#' },
        { name: 'Roadmap', href: '#' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Blog', href: '/blog' },
        { name: 'Guides & Tutorials', href: '/blog' },
        { name: 'Success Stories', href: '/blog' },
        { name: 'Community Forum', href: '/community' },
        { name: 'Support Center', href: '/contact' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Story', href: '/about' },
        { name: 'Careers', href: '#' },
        { name: 'Press Kit', href: '#' },
        { name: 'Contact Us', href: '/contact' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Cookie Policy', href: '#' },
        { name: 'Refund Policy', href: '#' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Sprout className="h-8 w-8 text-green-400" />
              <span className="text-xl font-bold">AgriCart Ai</span>
            </div>
            <p className="text-gray-400 mb-6">
              Grow smarter, harvest more
            </p>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-gray-400 hover:text-green-400 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>

            {/* Language Selector */}
            <div>
              <select className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-1 text-sm">
                <option>English</option>
                <option>বাংলা</option>
              </select>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © 2025 AgriCart Ai. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-gray-400">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-400 fill-current" />
            <span>in Bangladesh</span>
          </div>
        </div>

        {/* Payment Icons */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400 mb-4">We accept:</p>
          <div className="flex justify-center items-center space-x-6">
            <div className="bg-white px-3 py-2 rounded text-gray-900 font-semibold text-sm">bKash</div>
            <div className="bg-white px-3 py-2 rounded text-gray-900 font-semibold text-sm">Nagad</div>
            <div className="bg-white px-3 py-2 rounded text-gray-900 font-semibold text-sm">Visa</div>
            <div className="bg-white px-3 py-2 rounded text-gray-900 font-semibold text-sm">Mastercard</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;