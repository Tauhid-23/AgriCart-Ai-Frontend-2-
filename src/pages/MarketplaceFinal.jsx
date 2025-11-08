// Final ultra-defensive version of Marketplace
import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { marketplaceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Plus, ArrowLeft } from 'lucide-react';

// Extremely defensive ProductCard component
const ProductCard = ({ product, formatPrice }) => {
  // Guard against undefined product
  if (!product) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Invalid product</span>
        </div>
      </div>
    );
  }

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
      // Guard against missing product ID
      if (!product._id) {
        throw new Error('Product ID is missing');
      }
      await addToCart(product._id, 1);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response && error.response.status === 401) {
        if (confirm('You need to login to add items to your cart. Would you like to login now?')) {
          navigate('/login', { state: { from: '/marketplace' } });
        }
      } else {
        alert(`Failed to add product to cart: ${error.message}`);
      }
    }
  };

  const handleProductClick = (e) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/marketplace/product/${product._id || 'invalid'}`} className="block" onClick={handleProductClick}>
        <div className="relative">
          <img 
            src={product.images?.[0] || product.thumbnail || '/placeholder-product.jpg'} 
            alt={product.name || 'Unnamed product'}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.src = '/placeholder-product.jpg';
            }}
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
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1" onClick={handleProductClick}>
            {product.name || 'Unnamed Product'}
          </h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {product.shortDescription || product.description || 'No description available'}
          </p>
          
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <span className="text-yellow-400">★</span>
              <span className="text-sm font-medium text-gray-900 ml-1">
                {product.rating || 'N/A'}
              </span>
              {product.reviewCount && (
                <span className="text-xs text-gray-500 ml-1">
                  ({product.reviewCount})
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price || 0)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
          
          <div className="mt-2">
            {(product.inStock !== undefined ? product.inStock : true) ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                In Stock ({product.stock || 0} available)
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </Link>
      
      <div className="px-4 pb-4">
        <button 
          onClick={handleAddToCart}
          disabled={product.inStock === false}
          className={`w-full flex items-center justify-center px-3 py-2 rounded-lg transition-colors text-sm ${
            (product.inStock !== false) 
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

const MarketplaceFinal = () => {
  // Extremely defensive state initialization
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(() => {
    try {
      return [];
    } catch (error) {
      console.error('Error initializing products state:', error);
      return [];
    }
  });
  
  const [categories, setCategories] = useState(() => {
    try {
      return [];
    } catch (error) {
      console.error('Error initializing categories state:', error);
      return [];
    }
  });
  
  const [loading, setLoading] = useState(() => {
    try {
      return true;
    } catch (error) {
      console.error('Error initializing loading state:', error);
      return true;
    }
  });
  
  const [pagination, setPagination] = useState(() => {
    try {
      return { page: 1, pages: 1, total: 0 };
    } catch (error) {
      console.error('Error initializing pagination state:', error);
      return { page: 1, pages: 1, total: 0 };
    }
  });
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [selectedCategory, setSelectedCategory] = useState(() => {
    try {
      return searchParams.get('category') || '';
    } catch (error) {
      console.error('Error initializing selectedCategory state:', error);
      return '';
    }
  });
  
  const [searchQuery, setSearchQuery] = useState(() => {
    try {
      return searchParams.get('search') || '';
    } catch (error) {
      console.error('Error initializing searchQuery state:', error);
      return '';
    }
  });
  
  const [minPrice, setMinPrice] = useState(() => {
    try {
      return searchParams.get('minPrice') || '';
    } catch (error) {
      console.error('Error initializing minPrice state:', error);
      return '';
    }
  });
  
  const [maxPrice, setMaxPrice] = useState(() => {
    try {
      return searchParams.get('maxPrice') || '';
    } catch (error) {
      console.error('Error initializing maxPrice state:', error);
      return '';
    }
  });
  
  const [sortBy, setSortBy] = useState(() => {
    try {
      return searchParams.get('sort') || '-featured';
    } catch (error) {
      console.error('Error initializing sortBy state:', error);
      return '-featured';
    }
  });
  
  const [showFilters, setShowFilters] = useState(false);

  // Ultra-safe computed variables with try-catch
  let safeProducts = [];
  let safePagination = { page: 1, pages: 1, total: 0 };
  
  try {
    safeProducts = Array.isArray(products) ? products : [];
  } catch (error) {
    console.error('Error computing safeProducts:', error);
    safeProducts = [];
  }
  
  try {
    safePagination = pagination && typeof pagination === 'object' ? pagination : { page: 1, pages: 1, total: 0 };
  } catch (error) {
    console.error('Error computing safePagination:', error);
    safePagination = { page: 1, pages: 1, total: 0 };
  }

  // Validate all safe variables
  if (!Array.isArray(safeProducts)) {
    console.warn('safeProducts is not an array, forcing to empty array');
    safeProducts = [];
  }
  
  if (!safePagination || typeof safePagination !== 'object') {
    console.warn('safePagination is invalid, forcing to default object');
    safePagination = { page: 1, pages: 1, total: 0 };
  }

  useEffect(() => {
    let isMounted = true;
    
    const fetchCategories = async () => {
      try {
        if (!isMounted) return;
        
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
        
        if (isMounted) {
          setCategories(staticCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        if (isMounted) {
          setCategories([]);
        }
      }
    };

    fetchCategories();
    
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const fetchProducts = async (page = 1) => {
      if (!isMounted) return;
      
      try {
        if (isMounted) {
          setLoading(true);
        }
        
        const params = { page, limit: 20, sortBy };
        if (selectedCategory) params.category = selectedCategory;
        if (searchQuery) params.search = searchQuery;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        const res = await marketplaceAPI.getProducts(params);
        
        let productsData = [];
        let paginationData = { page: 1, pages: 1, total: 0 };
        
        if (res && res.data) {
          if (Array.isArray(res.data)) {
            productsData = res.data;
            paginationData = { page: 1, pages: 1, total: productsData.length };
          } else if (res.data.products && Array.isArray(res.data.products)) {
            productsData = res.data.products;
            paginationData = {
              page: res.data.pagination?.page || 1,
              pages: res.data.pagination?.pages || 1,
              total: res.data.pagination?.total || productsData.length,
              limit: res.data.pagination?.limit || 20
            };
          }
        }
        
        if (isMounted) {
          setProducts(productsData);
          setPagination(paginationData);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        if (isMounted) {
          setProducts([]);
          setPagination({ page: 1, pages: 1, total: 0 });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    
    return () => {
      isMounted = false;
    };
  }, [selectedCategory, sortBy, searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    updateURLParams();
    // Trigger refetch through useEffect dependency
  };

  const updateURLParams = () => {
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sortBy !== '-featured') params.sort = sortBy;
      setSearchParams(params);
    } catch (error) {
      console.error('Error updating URL params:', error);
    }
  };

  const clearFilters = () => {
    try {
      setSelectedCategory('');
      setSearchQuery('');
      setMinPrice('');
      setMaxPrice('');
      setSortBy('-featured');
      setSearchParams({});
      // Trigger refetch through useEffect dependency
    } catch (error) {
      console.error('Error clearing filters:', error);
    }
  };

  const formatPrice = (price) => {
    try {
      return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 0
      }).format(price || 0);
    } catch (error) {
      console.error('Error formatting price:', error);
      return '৳0';
    }
  };

  const getCategoryIcon = (category) => {
    try {
      const icons = {
        'seeds': '🌱', 'seedlings': '🌿', 'pots-containers': '🏺',
        'soil-amendments': '🪴', 'fertilizers': '🧪', 'tools-equipment': '🛠️',
        'pest-control': '🐛', 'watering-irrigation': '💧', 'grow-lights': '💡',
        'accessories': '🎒', 'books-guides': '📚', 'composting': '♻️',
        'protective-gear': '🧤'
      };
      return icons[category] || '📦';
    } catch (error) {
      console.error('Error getting category icon:', error);
      return '📦';
    }
  };

  // Test all critical access patterns
  let productsLength = 0;
  let paginationTotal = 0;
  let paginationPage = 1;
  let paginationPages = 1;
  
  try {
    productsLength = safeProducts.length;
  } catch (error) {
    console.error('Error accessing products length:', error);
    productsLength = 0;
  }
  
  try {
    paginationTotal = safePagination.total || 0;
  } catch (error) {
    console.error('Error accessing pagination total:', error);
    paginationTotal = 0;
  }
  
  try {
    paginationPage = safePagination.page || 1;
  } catch (error) {
    console.error('Error accessing pagination page:', error);
    paginationPage = 1;
  }
  
  try {
    paginationPages = safePagination.pages || 1;
  } catch (error) {
    console.error('Error accessing pagination pages:', error);
    paginationPages = 1;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-green-100 hover:text-white mb-2"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-4xl font-bold mb-2">🛒 Final Marketplace</h1>
          <p className="text-green-100">Ultra-defensive implementation</p>
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
                  {Array.isArray(categories) && categories.map(cat => (
                    <button
                      key={cat._id || `cat-${Math.random()}`}
                      onClick={() => { setSelectedCategory(cat._id || ''); updateURLParams(); }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                        selectedCategory === (cat._id || '') ? 'bg-green-100 text-green-700 font-medium' : 'hover:bg-gray-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {getCategoryIcon(cat._id || '')}
                        <span className="capitalize">{(cat._id || '').replace(/-/g, ' ')}</span>
                      </span>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                        ({cat.count || 0})
                      </span>
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
                  onClick={() => { updateURLParams(); }}
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
            {/* Results Header - ULTRA SAFE VERSION */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700">
                    Showing <span className="font-semibold">{productsLength}</span> of{' '}
                    <span className="font-semibold">{paginationTotal}</span> products
                    {selectedCategory && (
                      <span className="text-green-600 ml-2">
                        in {selectedCategory.replace(/-/g, ' ')}
                      </span>
                    )}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Page {paginationPage} of {paginationPages}
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
            ) : Array.isArray(safeProducts) && safeProducts.length === 0 ? (
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
                  {Array.isArray(safeProducts) && safeProducts.map(product => (
                    <ProductCard 
                      key={product?._id || `product-${Math.random()}`}
                      product={product}
                      formatPrice={formatPrice}
                    />
                  ))}
                </div>

                {/* Pagination - ULTRA SAFE */}
                {paginationPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newPage = Math.max(1, paginationPage - 1);
                          // Update URL and trigger refetch
                          const params = {};
                          if (selectedCategory) params.category = selectedCategory;
                          if (searchQuery) params.search = searchQuery;
                          if (minPrice) params.minPrice = minPrice;
                          if (maxPrice) params.maxPrice = maxPrice;
                          if (sortBy !== '-featured') params.sort = sortBy;
                          params.page = newPage;
                          setSearchParams(params);
                        }}
                        disabled={paginationPage <= 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: paginationPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => {
                            // Update URL and trigger refetch
                            const params = {};
                            if (selectedCategory) params.category = selectedCategory;
                            if (searchQuery) params.search = searchQuery;
                            if (minPrice) params.minPrice = minPrice;
                            if (maxPrice) params.maxPrice = maxPrice;
                            if (sortBy !== '-featured') params.sort = sortBy;
                            params.page = page;
                            setSearchParams(params);
                          }}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            page === paginationPage
                              ? 'bg-green-600 text-white font-semibold'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => {
                          const newPage = Math.min(paginationPages, paginationPage + 1);
                          // Update URL and trigger refetch
                          const params = {};
                          if (selectedCategory) params.category = selectedCategory;
                          if (searchQuery) params.search = searchQuery;
                          if (minPrice) params.minPrice = minPrice;
                          if (maxPrice) params.maxPrice = maxPrice;
                          if (sortBy !== '-featured') params.sort = sortBy;
                          params.page = newPage;
                          setSearchParams(params);
                        }}
                        disabled={paginationPage >= paginationPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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

export default MarketplaceFinal;