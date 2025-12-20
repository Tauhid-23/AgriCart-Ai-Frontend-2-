// Debug script for cart issues
// Run this in the browser console to get more detailed information

console.log('=== Cart Debug Information ===');

// Check if user is authenticated
const token = sessionStorage.getItem('token');
console.log('Token exists:', !!token);
if (token) {
  console.log('Token (first 20 chars):', token.substring(0, 20) + '...');
}

// Check if user info exists
const user = sessionStorage.getItem('user');
console.log('User exists:', !!user);
if (user) {
  try {
    const userData = JSON.parse(user);
    console.log('User email:', userData.email);
  } catch (e) {
    console.log('User data parsing error:', e);
  }
}

// Test API call directly
const testAddToCart = async (productId) => {
  if (!token) {
    console.log('❌ No token found. User needs to login.');
    return;
  }
  
  if (!productId) {
    console.log('❌ No product ID provided.');
    return;
  }
  
  console.log('Testing add to cart with product ID:', productId);
  
  try {
    // Test the API call directly
    const response = await fetch('/api/marketplace/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        productId: productId,
        quantity: 1
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ Add to cart successful');
    } else {
      console.log('❌ Add to cart failed');
      console.log('Error message:', data.message || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Network error:', error);
    console.log('Error name:', error.name);
    console.log('Error message:', error.message);
  }
};

// Get a product ID to test with
const getTestProductId = async () => {
  try {
    const response = await fetch('/api/marketplace/products');
    const data = await response.json();
    
    if (data.products && data.products.length > 0) {
      const productId = data.products[0]._id;
      console.log('Test product ID:', productId);
      return productId;
    } else {
      console.log('❌ No products found');
      return null;
    }
  } catch (error) {
    console.log('❌ Error getting products:', error);
    return null;
  }
};

// Run the full test
const runFullTest = async () => {
  console.log('\n=== Running Full Cart Test ===');
  
  const productId = await getTestProductId();
  if (productId) {
    await testAddToCart(productId);
  }
};

// Export functions for manual testing
window.debugCart = {
  testAddToCart,
  getTestProductId,
  runFullTest
};

console.log('\nTo test cart functionality, run:');
console.log('debugCart.runFullTest()');
console.log('\nOr test with a specific product ID:');
console.log('debugCart.testAddToCart("PRODUCT_ID_HERE")');