// Debug version of Marketplace with extensive logging
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
        alert(`Failed to add product to cart: ${error.message}`);
      }
    }
  };

  const handleProductClick = (e) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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

const MarketplaceDebug = () => {
  console.log('=== MARKETPLACE DEBUG COMPONENT RENDER ===');
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(() => {
    console.log('Initializing products state');
    return [];
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(() => {
    console.log('Initializing pagination state');
    return { page: 1, pages: 1, total: 0 };
  });
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '-featured');
  const [showFilters, setShowFilters] = useState(false);

  // Log state values
  console.log('Current state values:');
  console.log('- products:', products);
  console.log('- products type:', typeof products);
  console.log('- products is array:', Array.isArray(products));
  console.log('- pagination:', pagination);
  console.log('- pagination type:', typeof pagination);

  // Safe variables with extensive logging
  const safeProducts = (() => {
    console.log('Computing safeProducts...');
    const result = Array.isArray(products) ? products : [];
    console.log('safeProducts result:', result);
    return result;
  })();
  
  const safePagination = (() => {
    console.log('Computing safePagination...');
    const result = pagination && typeof pagination === 'object' ? pagination : { page: 1, pages: 1, total: 0 };
    console.log('safePagination result:', result);
    return result;
  })();

  console.log('Safe variables computed:');
  console.log('- safeProducts:', safeProducts);
  console.log('- safePagination:', safePagination);

  useEffect(() => {
    console.log('Categories effect running');
    fetchCategories();
  }, []);

  useEffect(() => {
    console.log('Products effect running');
    fetchProducts();
  }, [selectedCategory, sortBy, searchParams]);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
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
    console.log('Fetching products, page:', page);
    setLoading(true);
    try {
      const params = { page, limit: 20, sortBy };
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      console.log('API request params:', params);
      const res = await axios.get('/api/marketplace/products', { params });
      console.log('API response:', res);
      
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
      
      console.log('Setting products data:', productsData);
      console.log('Setting pagination data:', paginationData);
      
      setProducts(productsData);
      setPagination(paginationData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setPagination({ page: 1, pages: 1, total: 0 });
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

  // Test the exact line that's causing the error
  console.log('=== TESTING CRITICAL LINES ===');
  try {
    console.log('Testing safeProducts.length:', safeProducts.length);
  } catch (error) {
    console.log('❌ Error accessing safeProducts.length:', error);
  }
  
  try {
    console.log('Testing safePagination.total:', safePagination.total);
  } catch (error) {
    console.log('❌ Error accessing safePagination.total:', error);
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
          <h1 className="text-4xl font-bold mb-2">🛒 Debug Marketplace</h1>
          <p className="text-green-100">Debug version with extensive logging</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700">
                Showing <span className="font-semibold">{safeProducts.length}</span> of{' '}
                <span className="font-semibold">{safePagination.total || 0}</span> products
                {selectedCategory && (
                  <span className="text-green-600 ml-2">
                    in {selectedCategory.replace(/-/g, ' ')}
                  </span>
                )}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Page {safePagination.page || 1} of {safePagination.pages || 1}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : safeProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
            <button onClick={clearFilters} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {safeProducts.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
                formatPrice={formatPrice}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceDebug;