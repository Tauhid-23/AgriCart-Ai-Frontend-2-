// Ultra-minimal version of Marketplace to test the exact error
import { useState, useEffect } from 'react';
import { marketplaceAPI } from '../services/api';

const MarketplaceMinimal = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ultra-safe variables
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
      console.log('=== MINIMAL MARKETPLACE TEST ===');
      const response = await marketplaceAPI.getProducts();
      console.log('API Response:', response);
      
      // Extract data with maximum safety
      let productsData = [];
      let paginationData = { page: 1, pages: 1, total: 0 };
      
      if (response?.data) {
        if (Array.isArray(response.data)) {
          productsData = response.data;
          paginationData = { page: 1, pages: 1, total: productsData.length };
        } else if (Array.isArray(response.data.products)) {
          productsData = response.data.products;
          paginationData = {
            page: response.data.pagination?.page || 1,
            pages: response.data.pagination?.pages || 1,
            total: response.data.pagination?.total || productsData.length,
            limit: response.data.pagination?.limit || 20
          };
        }
      }
      
      console.log('Products extracted:', productsData);
      console.log('Pagination extracted:', paginationData);
      
      setProducts(productsData);
      setPagination(paginationData);
    } catch (err) {
      console.error('❌ Error in minimal marketplace:', err);
      setError(err.message);
      setProducts([]);
      setPagination({ page: 1, pages: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Test the exact line that's causing the error
  console.log('Testing safe access patterns:');
  console.log('safeProducts.length:', safeProducts.length);
  console.log('safePagination.total:', safePagination.total);
  console.log('safePagination.page:', safePagination.page);
  console.log('safePagination.pages:', safePagination.pages);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Minimal Marketplace Test</h1>
      <p>Products count: {safeProducts.length}</p>
      <p>Total products: {safePagination.total || 0}</p>
      <p>Current page: {safePagination.page || 1}</p>
      <p>Total pages: {safePagination.pages || 1}</p>
      
      {safeProducts.length > 0 ? (
        <div>
          {safeProducts.map((product, index) => (
            <div key={index || product._id}>
              {product.name || 'Unnamed Product'}
            </div>
          ))}
        </div>
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
};

export default MarketplaceMinimal;