import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) {
      setError('Invalid product ID');
      setLoading(false);
      return;
    }
    
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '/api';
      const url = `${apiUrl}/marketplace/products/${productId}`;
      
      const response = await axios.get(url);
      
      let productData = null;
      
      if (response.data) {
        if (response.data.product) {
          productData = response.data.product;
        } else if (response.data._id) {
          productData = response.data;
        } else if (response.data.data) {
          productData = response.data.data;
        }
      }
      
      if (!productData) {
        throw new Error('Product data not found in response');
      }
      
      setProduct(productData);
      
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Product not found');
      } else if (err.response?.status === 500) {
        setError('Server error');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Network error - cannot reach backend');
      } else {
        setError(err.response?.data?.message || err.message || 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #e5e7eb',
          borderTop: '5px solid #10b981',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <h2 style={{ color: '#374151', marginBottom: '10px' }}>Loading product...</h2>
        <p style={{ color: '#6b7280' }}>Product ID: {productId}</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>📦</div>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#1f2937',
            marginBottom: '10px'
          }}>Product Not Found</h2>
          <p style={{ 
            color: '#6b7280',
            marginBottom: '20px'
          }}>
            {error || "The product you're looking for doesn't exist."}
          </p>
          <Link
            to="/marketplace"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#10b981',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            ← Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // Product detail page
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb'
    }}>
      <div style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        padding: '16px'
      }}>
        <Link
          to="/marketplace"
          style={{
            display: 'flex',
            alignItems: 'center',
            color: '#10b981',
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          ← Back to Marketplace
        </Link>
      </div>
      
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 16px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '24px' }}>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#1f2937',
              marginBottom: '8px'
            }}>
              {product.name}
            </h1>
            <p style={{ 
              color: '#6b7280',
              marginBottom: '20px'
            }}>
              {product.description}
            </p>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#1f2937',
              marginBottom: '20px'
            }}>
              BDT {product.price}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;