// Test script to check if Premium Plastic Pot image is accessible
const testImageAccess = async () => {
  try {
    const imageUrl = '/images/Premium Plastic Planting Pot.png';
    console.log('🔍 Testing image access:', imageUrl);
    
    // Test if image is accessible
    const response = await fetch(imageUrl, { method: 'HEAD' });
    console.log('✅ Image access test result:', response.status);
    
    if (response.ok) {
      console.log('✅ Image is accessible');
    } else {
      console.log('❌ Image is not accessible, status:', response.status);
    }
  } catch (error) {
    console.error('❌ Image access test failed:', error);
  }
};

// Run the test
testImageAccess();