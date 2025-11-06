// Test script to check marketplace API response
const testMarketplaceAPI = async () => {
  try {
    console.log('Testing marketplace API...');
    
    // Test the products endpoint
    const response = await fetch('/api/marketplace/products');
    const data = await response.json();
    
    console.log('API Response Status:', response.status);
    console.log('API Response Data:', data);
    
    // Check if data has the expected structure
    if (Array.isArray(data)) {
      console.log('✅ Data is an array with', data.length, 'items');
    } else if (data.products && Array.isArray(data.products)) {
      console.log('✅ Data has products array with', data.products.length, 'items');
      console.log('✅ Pagination:', data.pagination);
    } else {
      console.log('⚠️ Unexpected data structure:', data);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error testing API:', error);
    return null;
  }
};

// Run the test
testMarketplaceAPI();

export default testMarketplaceAPI;