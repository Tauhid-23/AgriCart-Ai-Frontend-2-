// frontend/src/pages/ProductDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marketplaceAPI } from '../services/api'; // Import the API service
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingCart, Plus, Minus, X } from 'lucide-react';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Use the marketplaceAPI service instead of direct axios call
        const response = await marketplaceAPI.getProduct(productId);
        setProduct(response.data.product);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Scroll to top when product detail page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      if (confirm('You need to login to add items to your cart. Would you like to login now?')) {
        navigate('/login', { state: { from: `/marketplace/product/${productId}` } });
      }
      return;
    }

    try {
      await addToCart(product._id, quantity);
      alert('Product added to cart!');
      // Redirect to cart page
      navigate('/marketplace/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      // If user is not authenticated, redirect to login
      if (error.response && error.response.status === 401) {
        if (confirm('You need to login to add items to your cart. Would you like to login now?')) {
          navigate('/login', { state: { from: `/marketplace/product/${productId}` } });
        }
      } else {
        // Show more detailed error message
        alert(`Failed to add product to cart: ${error.message}`);
      }
    }
  };

  const handleBack = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/marketplace');
    }
  };

  const handleClose = () => {
    navigate('/marketplace');
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
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const discountPercentage = product.discount || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button and Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-green-600 hover:text-green-700 mb-2"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <nav className="text-sm">
            <button 
              onClick={() => navigate('/marketplace')}
              className="text-green-600 hover:text-green-700"
            >
              Marketplace
            </button>
            <span className="text-gray-400 mx-2">/</span>
            <span className="text-gray-500 capitalize">{product?.category?.replace(/-/g, ' ')}</span>
            <span className="text-gray-400 mx-2">/</span>
            <span className="text-gray-900">{product?.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={product.images?.[selectedImage] || product.thumbnail || `https://picsum.photos/seed/${product._id}/600/600`}
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
                        src={image || `https://picsum.photos/seed/${product._id}-${index}/200/200`}
                        alt={`Product view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600">{product.shortDescription || product.description}</p>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-xl ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  {product.rating || 'N/A'} ({product.reviewCount || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex items-center ml-4">
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="ml-2 bg-red-100 text-red-800 text-sm font-bold px-2 py-1 rounded">
                        {discountPercentage}% OFF
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock Status */}
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

              {/* Quantity Selector */}
              <div className="flex items-center mb-6">
                <span className="mr-4 text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={!product.inStock || quantity >= product.stock}
                    className={`px-3 py-2 rounded-r-lg ${
                      !product.inStock || quantity >= product.stock
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {product.stock && (
                  <span className="ml-4 text-sm text-gray-500">
                    ({product.stock} available)
                  </span>
                )}
              </div>

              {/* Add to Cart Button */}
              <div className="mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                    product.inStock
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>

              {/* Key Features */}
              {product.specifications && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {product.specifications.brand && (
                    <div className="flex items-center">
                      <span className="text-gray-500 w-24">Brand:</span>
                      <span className="font-medium">{product.specifications.brand}</span>
                    </div>
                  )}
                  {product.specifications.weight && (
                    <div className="flex items-center">
                      <span className="text-gray-500 w-24">Weight:</span>
                      <span className="font-medium">{product.specifications.weight}</span>
                    </div>
                  )}
                  {product.specifications.dimensions && (
                    <div className="flex items-center">
                      <span className="text-gray-500 w-24">Dimensions:</span>
                      <span className="font-medium">{product.specifications.dimensions}</span>
                    </div>
                  )}
                  {product.specifications.material && (
                    <div className="flex items-center">
                      <span className="text-gray-500 w-24">Material:</span>
                      <span className="font-medium">{product.specifications.material}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'description'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('specifications')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'specifications'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Specifications
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'reviews'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Reviews
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'description' && (
                <div className="py-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
                  <div className="prose max-w-none text-gray-600">
                    <p>{product.description}</p>
                    
                    {product.usageInstructions && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900">Usage Instructions</h4>
                        <p>{product.usageInstructions}</p>
                      </div>
                    )}
                    
                    {product.careInstructions && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900">Care Instructions</h4>
                        <p>{product.careInstructions}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="py-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex">
                        <span className="text-gray-500 w-32 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                    
                    {product.plantInfo && (
                      <>
                        <div className="col-span-2 border-t border-gray-200 pt-4 mt-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Plant Information</h4>
                        </div>
                        {Object.entries(product.plantInfo).map(([key, value]) => (
                          <div key={key} className="flex">
                            <span className="text-gray-500 w-32 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span className="font-medium">
                              {Array.isArray(value) ? value.join(', ') : value}
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
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
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                  ★
                                </span>
                              ))}
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