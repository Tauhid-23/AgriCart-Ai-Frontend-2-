// Frontend test script to verify cart functionality
// Run this in the browser console after logging in

console.log('=== Cart Functionality Test ===');

// Check if user is logged in
const token = sessionStorage.getItem('token');
if (!token) {
  console.log('❌ User not logged in. Please login first.');
} else {
  console.log('✅ User is logged in');
  console.log('Token:', token.substring(0, 20) + '...');
}

// Test adding to cart
const testAddToCart = async () => {
  try {
    // Get a product ID from the current page or use a known one
    console.log('\n--- Testing Add to Cart ---');
    
    // First, get products to find a valid product ID
    const productsResponse = await fetch('/api/marketplace/products');
    const productsData = await productsResponse.json();
    
    if (productsData.products && productsData.products.length > 0) {
      const productId = productsData.products[0]._id;
      console.log('Using product ID:', productId);
      
      // Test adding to cart
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
      
      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);
      
      if (response.ok) {
        console.log('✅ Add to cart successful');
      } else {
        console.log('❌ Add to cart failed');
      }
      
      // Test getting cart
      console.log('\n--- Testing Get Cart ---');
      const cartResponse = await fetch('/api/marketplace/cart', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const cartData = await cartResponse.json();
      console.log('Cart response status:', cartResponse.status);
      console.log('Cart data:', cartData);
      
      if (cartResponse.ok) {
        console.log('✅ Get cart successful');
        console.log('Cart items:', cartData.cart?.items?.length || 0);
      } else {
        console.log('❌ Get cart failed');
      }
    } else {
      console.log('❌ No products found');
    }
  } catch (error) {
    console.log('❌ Error:', error);
    console.log('Error message:', error.message);
  }
};

// Run the test
testAddToCart();