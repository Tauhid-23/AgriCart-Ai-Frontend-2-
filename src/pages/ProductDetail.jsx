import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProductDetail = () => {
  console.log('========================================');
  console.log('🔍 PRODUCT DETAIL PAGE LOADED');
  console.log('========================================');
  
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  console.log('📍 Location:', location);
  console.log('📍 Pathname:', location.pathname);
  console.log('📍 useParams result:', useParams());
  console.log('📍 Product ID from useParams:', productId);
  console.log('📍 Type of ID:', typeof productId);
  console.log('📍 ID is valid?', productId && productId !== 'undefined' && productId !== 'null');
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    console.log('🎯 useEffect triggered');
    console.log('   Product ID value:', productId);
    
    const info = {
      pathname: location.pathname,
      id: productId,
      idType: typeof productId,
      idValid: Boolean(productId),
      timestamp: new Date().toISOString()
    };
    
    setDebugInfo(info);
    console.log('🔧 Debug info set:', info);
    
    if (!productId || productId === 'undefined' || productId === 'null') {
      console.error('❌ Invalid product ID');
      setError('Invalid product ID');
      setLoading(false);
      return;
    }
    
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    console.log('📡 Starting fetchProduct...');
    console.log('   Using Product ID:', productId);
    
    setLoading(true);
    setError(null);
    
    try {
      const url = `/api/marketplace/products/${productId}`;
      console.log('📤 Making request to:', url);
      console.log('   Full URL:', window.location.origin + url);
      
      const response = await axios.get(url);
      
      console.log('📥 Response received:');
      console.log('   Status:', response.status);
      console.log('   Data:', response.data);
      console.log('   Data type:', typeof response.data);
      
      let productData = null;
      
      if (response.data) {
        console.log('🔍 Parsing response data...');
        
        if (response.data.product) {
          console.log('   Found product in response.data.product');
          productData = response.data.product;
        } else if (response.data._id) {
          console.log('   Found product directly in response.data');
          productData = response.data;
        } else if (response.data.data) {
          console.log('   Found product in response.data.data');
          productData = response.data.data;
        }
      }
      
      if (!productData) {
        console.error('❌ No product data found in response');
        console.error('   Response structure:', Object.keys(response.data || {}));
        throw new Error('Product data not found in response');
      }
      
      console.log('✅ Product parsed successfully:');
      console.log('   Name:', productData.name);
      console.log('   ID:', productData._id || productData.id);
      console.log('   Price:', productData.price);
      
      setProduct(productData);
      
    } catch (err) {
      console.error('❌ ERROR in fetchProduct:');
      console.error('   Error type:', err.name);
      console.error('   Error message:', err.message);
      console.error('   Response status:', err.response?.status);
      console.error('   Response data:', err.response?.data);
      console.error('   Full error:', err);
      
      if (err.response?.status === 404) {
        setError('Product not found (404)');
      } else if (err.response?.status === 500) {
        setError('Server error (500)');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Network error - cannot reach backend');
      } else {
        setError(err.response?.data?.message || err.message || 'Unknown error');
      }
    } finally {
      setLoading(false);
      console.log('🏁 fetchProduct completed');
    }
  };

  // Always show diagnostic panel
  const DiagnosticPanel = () => (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#1e293b',
      color: 'white',
      padding: '15px',
      fontSize: '14px',
      zIndex: 9999,
      maxHeight: '200px',
      overflowY: 'auto'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#10b981' }}>🔧 DIAGNOSTIC PANEL</h3>
      <div>URL: {location.pathname}</div>
      <div>Product ID: {productId || 'NONE'}</div>
      <div>ID Valid: {productId ? '✅' : '❌'}</div>
      <div>Loading: {loading ? '⏳' : '✅'}</div>
      <div>Error: {error || 'None'}</div>
      <div>Product Loaded: {product ? '✅ ' + product.name : '❌'}</div>
      <div>API Base: {process.env.REACT_APP_API_URL || 'Not set'}</div>
      <button
        onClick={() => {
          console.log('Full state dump:');
          console.log({ productId, loading, error, product, debugInfo });
        }}
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Dump Full State to Console
      </button>
    </div>
  );

  if (loading) {
    return (
      <>
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
        </div>
        <DiagnosticPanel />
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
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
            <div style={{
              backgroundColor: '#f3f4f6',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: 'bold', 
                color: '#1f2937',
                marginBottom: '10px'
              }}>Debug Info:</h3>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>
                <div>URL: {location.pathname}</div>
                <div>Product ID: {productId || 'MISSING'}</div>
                <div>Error: {error}</div>
              </div>
            </div>
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
        <DiagnosticPanel />
      </>
    );
  }

  // Product loaded successfully
  return (
    <>
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        paddingBottom: '220px' // Space for diagnostic panel
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
              <div style={{
                padding: '12px 16px',
                backgroundColor: '#dcfce7',
                color: '#166534',
                borderRadius: '6px',
                fontWeight: '500'
              }}>
                ✅ Product loaded successfully!
              </div>
            </div>
          </div>
        </div>
      </div>
      <DiagnosticPanel />
    </>
  );
};

export default ProductDetail;