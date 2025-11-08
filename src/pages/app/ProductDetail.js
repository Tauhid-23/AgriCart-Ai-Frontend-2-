import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  ExternalLink,
  Tag,
  Plus,
  Minus,
  Package,
  Leaf,
  Sun,
  Droplets,
  Thermometer,
  MapPin
} from 'lucide-react';

const ProductDetail = () => {
  console.log('app/ProductDetail.js component loaded - This is the app version');
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`/api/marketplace/products/${productId}`);
        const data = await response.json();
        
        if (data.success) {
          setProduct(data.product);
        } else {
          // Handle error
          console.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    try {
      const response = await fetch('/api/marketplace/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: quantity
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`${product.name} added to cart!`);
      } else {
        alert('Failed to add product to cart: ' + data.message);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  // Handle quantity change
  const handleQuantityChange = (value) => {
    if (value >= 1 && value <= (product?.stock || 10)) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <ShoppingCart className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Product not found</h3>
          <p className="text-gray-500 mb-4">
            The product you're looking for doesn't exist or is no longer available.
          </p>
          <button
            onClick={() => navigate('/marketplace')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Browse Marketplace
          </button>
        </div>
      </div>
    );
  }

  const discountPercentage = product.discount || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/marketplace')}
            className="flex items-center text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Marketplace
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.images?.[selectedImage] || product.thumbnail || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-green-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Product view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-medium text-gray-900 ml-1">{product.rating || 'N/A'}</span>
                    {product.reviewCount && (
                      <span className="text-gray-500 ml-1">({product.reviewCount} reviews)</span>
                    )}
                  </div>
                  <div className="ml-4 flex items-center text-sm text-gray-500">
                    <Eye className="w-4 h-4 mr-1" />
                    {product.views} views
                  </div>
                </div>
                
                <div className="flex items-center mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex items-center ml-4">
                      <span className="text-lg text-gray-500 line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                      <span className="ml-2 bg-red-100 text-red-800 text-sm font-bold px-2 py-1 rounded">
                        {discountPercentage}% OFF
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  {product.inStock ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      In Stock ({product.stock} available)
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Key Product Info */}
              <div className="grid grid-cols-2 gap-4">
                {product.specifications?.brand && (
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Brand</p>
                      <p className="text-sm font-medium">{product.specifications.brand}</p>
                    </div>
                  </div>
                )}
                
                {product.specifications?.weight && (
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Weight</p>
                      <p className="text-sm font-medium">{product.specifications.weight}</p>
                    </div>
                  </div>
                )}
                
                {product.plantInfo?.sunlight && (
                  <div className="flex items-center">
                    <Sun className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Sunlight</p>
                      <p className="text-sm font-medium capitalize">{product.plantInfo.sunlight.replace('-', ' ')}</p>
                    </div>
                  </div>
                )}
                
                {product.plantInfo?.watering && (
                  <div className="flex items-center">
                    <Droplets className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Watering</p>
                      <p className="text-sm font-medium capitalize">{product.plantInfo.watering}</p>
                    </div>
                  </div>
                )}
                
                {product.plantInfo?.difficulty && (
                  <div className="flex items-center">
                    <Leaf className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Difficulty</p>
                      <p className="text-sm font-medium capitalize">{product.plantInfo.difficulty}</p>
                    </div>
                  </div>
                )}
                
                {product.plantInfo?.temperature && (
                  <div className="flex items-center">
                    <Thermometer className="w-5 h-5 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Temperature</p>
                      <p className="text-sm font-medium">{product.plantInfo.temperature}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              {product.inStock && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Quantity:</span>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-lg disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 h-10 flex items-center justify-center border-t border-b border-gray-300">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= (product.stock || 10)}
                        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-lg disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => alert('Added to wishlist!')}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      Wishlist
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center">
                  <Truck className="w-6 h-6 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Free Delivery</p>
                    <p className="text-xs text-gray-500">On orders over 1000 BDT</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Shield className="w-6 h-6 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                    <p className="text-xs text-gray-500">100% protected</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <RotateCcw className="w-6 h-6 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">7 Days Return</p>
                    <p className="text-xs text-gray-500">If damaged</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="border-t border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'description'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('specifications')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'specifications'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'reviews'
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Reviews ({product.reviewCount || 0})
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'description' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
                  <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
                  
                  {product.usageInstructions && (
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-2">Usage Instructions</h4>
                      <p className="text-gray-600">{product.usageInstructions}</p>
                    </div>
                  )}
                  
                  {product.careInstructions && (
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-2">Care Instructions</h4>
                      <p className="text-gray-600">{product.careInstructions}</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications || {}).map(([key, value]) => (
                      <div key={key} className="flex border-b border-gray-100 pb-2">
                        <span className="text-gray-500 capitalize w-40">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                  
                  {product.plantInfo && Object.keys(product.plantInfo).length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-2">Plant Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(product.plantInfo).map(([key, value]) => (
                          <div key={key} className="flex border-b border-gray-100 pb-2">
                            <span className="text-gray-500 capitalize w-40">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="text-gray-900">
                              {Array.isArray(value) ? value.join(', ') : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {product.reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-100 pb-6">
                          <div className="flex items-center mb-2">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium text-gray-900 ml-1">{review.rating}</span>
                            </div>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;