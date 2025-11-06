import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Star, Tag, ExternalLink, TrendingUp, Heart, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// FORCE REBUILD INDICATOR: 2025-11-06-22-55-00-FIXED-APP
// Renamed component to avoid conflicts
const AppMarketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'seeds', name: 'Seeds' },
    { id: 'seedlings', name: 'Seedlings' },
    { id: 'pots-containers', name: 'Pots & Containers' },
    { id: 'soil-amendments', name: 'Soil & Amendments' },
    { id: 'fertilizers', name: 'Fertilizers' },
    { id: 'tools-equipment', name: 'Tools & Equipment' },
    { id: 'pest-control', name: 'Pest Control' },
    { id: 'watering-irrigation', name: 'Watering & Irrigation' },
    { id: 'grow-lights', name: 'Grow Lights' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'books-guides', name: 'Books & Guides' },
    { id: 'composting', name: 'Composting' },
    { id: 'protective-gear', name: 'Protective Gear' }
  ];

  // Fetch products from the marketplace API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = '/api/marketplace/products?limit=20';
      
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      if (selectedCategory && selectedCategory !== 'all') url += `&category=${selectedCategory}`;
      if (sortBy) url += `&sortBy=${sortBy}`;
      if (priceRange.min) url += `&minPrice=${priceRange.min}`;
      if (priceRange.max) url += `&maxPrice=${priceRange.max}`;

      const response = await fetch(url);
      const data = await response.json();
      
      // Defensive programming: ensure products is always an array
      if (data && data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        console.warn('Invalid products data received:', data);
        setProducts([]); // Set to empty array as fallback
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  // View product details
  const viewProductDetails = (product) => {
    navigate(`/marketplace/product/${product._id}`);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Render product card
  const renderProductCard = (product) => {
    const discountPercentage = product.discount || 0;

    return (
      <div 
        key={product._id} 
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
        onClick={() => viewProductDetails(product)}
      >
        <div className="relative">
          <img 
            src={product.thumbnail || '/placeholder-product.jpg'} 
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discountPercentage}% OFF
            </div>
          )}
          {product.featured && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              Featured
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.shortDescription || product.description}</p>
          
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900 ml-1">{product.rating || 'N/A'}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(product.price)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Apply filters
  const applyFilters = () => {
    fetchProducts();
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('-createdAt');
    setPriceRange({ min: '', max: '' });
  };

  // Fetch products on initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Gardening Marketplace</h1>
          
          {/* Search and Filters */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for seeds, tools, pots, fertilizers..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : Array.isArray(products) && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(renderProductCard)}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-500">
              Please check back later for new products.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Export with the new name
export default AppMarketplace;
