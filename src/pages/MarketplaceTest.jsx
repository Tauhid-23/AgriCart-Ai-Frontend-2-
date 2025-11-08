// Minimal test version of Marketplace to isolate the error
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { marketplaceAPI } from '../services/api';

const MarketplaceTest = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Safe variables
  const safeProducts = Array.isArray(products) ? products : [];
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const safePagination = pagination && typeof pagination === 'object' ? pagination : { page: 1, pages: 1, total: 0 };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching products...');
      console.log('API Base URL:', process.env.REACT_APP_API_URL || '/api');
      
      const res = await marketplaceAPI.getProducts();
      console.log('API Response:', res);
      
      // Log the exact structure we're getting
      console.log('Response data type:', typeof res.data);
      console.log('Response data keys:', Object.keys(res.data));
      console.log('Has products property:', 'products' in res.data);
      console.log('Products type:', typeof res.data.products);
      console.log('Products is array:', Array.isArray(res.data.products));
      console.log('Has pagination property:', 'pagination' in res.data);
      
      let productsData = [];
      let paginationData = { page: 1, pages: 1, total: 0 };
      
      if (res && res.data) {
        if (Array.isArray(res.data)) {
          console.log('Data is direct array');
          productsData = res.data;
          paginationData = { page: 1, pages: 1, total: productsData.length };
        } else if (res.data.products && Array.isArray(res.data.products)) {
          console.log('Data has products array');
          productsData = res.data.products;
          paginationData = {
            page: res.data.pagination?.page || 1,
            pages: res.data.pagination?.pages || 1,
            total: res.data.pagination?.total || productsData.length,
            limit: res.data.pagination?.limit || 20
          };
        } else {
          console.log('Unexpected data structure:', res.data);
        }
      }
      
      console.log('Products data:', productsData);
      console.log('Pagination data:', paginationData);
      
      setProducts(productsData);
      setPagination(paginationData);
    } catch (err) {
      console.error('Error fetching products:', err);
      console.error('Error response:', err.response);
      setError(err.message);
      setProducts([]);
      setPagination({ page: 1, pages: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🛒 Test Marketplace</h1>
          <p className="text-gray-600">Debug version to isolate the error</p>
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold">Debug Info:</h3>
            <p>Products array length: {safeProducts.length}</p>
            <p>Pagination total: {safePagination.total}</p>
            <p>Pagination pages: {safePagination.pages}</p>
          </div>
        </div>

        {/* Results Header - ULTRA SAFE VERSION */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700">
                Showing <span className="font-semibold">{safeProducts.length}</span> of{' '}
                <span className="font-semibold">{safePagination.total || 0}</span> products
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Page {safePagination.page || 1} of {safePagination.pages || 1}
            </div>
          </div>
        </div>

        {safeProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">There are no products in the database yet.</p>
            <button
              onClick={fetchProducts}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {safeProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-4xl">
                    {product.category === 'seeds' ? '🌱' : 
                     product.category === 'tools-equipment' ? '🛠️' : 
                     product.category === 'fertilizers' ? '🧪' : '📦'}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.shortDescription || product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      ৳{product.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceTest;