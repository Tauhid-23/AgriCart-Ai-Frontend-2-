// frontend/src/pages/Marketplace.jsx
import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Plus, ArrowLeft } from 'lucide-react';

const ProductCard = ({ product, formatPrice }) => {
  const discountPercentage = product.discount || 0;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      if (confirm('You need to login to add items to your cart. Would you like to login now?')) {
        navigate('/login', { state: { from: '/marketplace' } });
      }
      return;
    }

    try {
      await addToCart(product._id, 1);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response && error.response.status === 401) {
        if (confirm('You need to login to add items to your cart. Would you like to login now?')) {
          navigate('/login', { state: { from: '/marketplace' } });
        }
      } else {
        // Show more detailed error message
        alert(`Failed to add product to cart: ${error.message}`);
      }
    }
  };

  const handleProductClick = (e) => {
    // Scroll to top when clicking on product name
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Make the entire card clickable except for the Add to Cart button */}
      <Link to={`/marketplace/product/${product._id}`} className="block" onClick={handleProductClick}>
        <div className="relative">
          <img 
            src={product.images?.[0] || product.thumbnail || '/placeholder-product.jpg'} 
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discountPercentage}% OFF
            </div>
          )}
          {product.featured && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
              Featured
            </div>
          )}
          {product.bestSeller && (
            <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              Best Seller
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1" onClick={handleProductClick}>{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.shortDescription || product.description}</p>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-medium text-gray-900 ml-1">{product.rating || 'N/A'}</span>
              {product.reviewCount && (
                <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
          
          <div className="mt-2">
            {product.inStock ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </Link>
      
      {/* Add to Cart section with both icon and button */}
      <div className="px-4 pb-4">
        <button 
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full flex items-center justify-center px-3 py-2 rounded-lg transition-colors text-sm ${
            product.inStock 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '-featured');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, searchParams]);

  const fetchCategories = async () => {
    try {
      // Since we don't have a categories endpoint, we'll use a static list
      const staticCategories = [
        { _id: 'seeds', count: 20 },
        { _id: 'seedlings', count: 15 },
        { _id: 'pots-containers', count: 15 },
        { _id: 'soil-amendments', count: 15 },
        { _id: 'fertilizers', count: 10 },
        { _id: 'tools-equipment', count: 10 },
        { _id: 'pest-control', count: 8 },
        { _id: 'watering-irrigation', count: 0 },
        { _id: 'grow-lights', count: 0 },
        { _id: 'accessories', count: 0 },
        { _id: 'books-guides', count: 0 },
        { _id: 'composting', count: 0 },
        { _id: 'protective-gear', count: 0 }
      ];
      setCategories(staticCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20, sortBy };
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await axios.get('/api/marketplace/products', { params });
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateURLParams();
    fetchProducts(1);
  };

  const updateURLParams = () => {
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (searchQuery) params.search = searchQuery;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (sortBy !== '-featured') params.sort = sortBy;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('-featured');
    setSearchParams({});
    fetchProducts(1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'seeds': '🌱', 'seedlings': '🌿', 'pots-containers': '🏺',
      'soil-amendments': '🪴', 'fertilizers': '🧪', 'tools-equipment': '🛠️',
      'pest-control': '🐛', 'watering-irrigation': '💧', 'grow-lights': '💡',
      'accessories': '🎒', 'books-guides': '📚', 'composting': '♻️',
      'protective-gear': '🧤'
    };
    return icons[category] || '📦';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Back Button and Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-green-100 hover:text-white mb-2"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-4xl font-bold mb-2">🛒 Gardening Marketplace</h1>
          <p className="text-green-100">Discover 100+ quality products for your urban garden</p>
        </div>
      </div>

      {/* Search Bar - Removed sticky positioning */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products... (e.g., tomato seeds, pots, fertilizer)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
            </div>
            <button type="submit" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors lg:hidden"
            >
              Filters
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Filters</h3>
                {(selectedCategory || searchQuery || minPrice || maxPrice) && (
                  <button onClick={clearFilters} className="text-sm text-green-600 hover:text-green-700">
                    Clear All
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Categories</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => { setSelectedCategory(''); updateURLParams(); }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      !selectedCategory ? 'bg-green-100 text-green-700 font-medium' : 'hover:bg-gray-100'
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat._id}
                      onClick={() => { setSelectedCategory(cat._id); updateURLParams(); }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                        selectedCategory === cat._id ? 'bg-green-100 text-green-700 font-medium' : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {getCategoryIcon(cat._id)}
                        <span className="capitalize">{cat._id.replace(/-/g, ' ')}</span>
                      </span>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">({cat.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Price Range (BDT)</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  onClick={() => { updateURLParams(); fetchProducts(1); }}
                  className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Apply
                </button>
              </div>

              {/* Sort */}
              <div>
                <h4 className="font-semibold mb-3">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); updateURLParams(); }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="-featured">Featured</option>
                  <option value="-rating">Highest Rated</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-purchases">Best Selling</option>
                  <option value="-createdAt">Newest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700">
                    Showing <span className="font-semibold">{products.length}</span> of{' '}
                    <span className="font-semibold">{pagination.total || 0}</span> products
                    {selectedCategory && (
                      <span className="text-green-600 ml-2">
                        in {selectedCategory.replace(/-/g, ' ')}
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Page {pagination.page || 1} of {pagination.pages || 1}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
                <button onClick={clearFilters} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map(product => (
                    <ProductCard 
                      key={product._id} 
                      product={product} 
                      formatPrice={formatPrice}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {(pagination.pages || 0) > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center gap-2">
                      <button
                        onClick={() => fetchProducts((pagination.page || 1) - 1)}
                        disabled={(pagination.page || 1) <= 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      
                      {[...Array(Math.max(0, pagination.pages || 0))].map((_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => fetchProducts(page)}
                            className={`px-4 py-2 rounded-lg ${
                              page === (pagination.page || 1)
                                ? 'bg-green-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => fetchProducts((pagination.page || 1) + 1)}
                        disabled={(pagination.page || 1) >= (pagination.pages || 1)}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}

              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;