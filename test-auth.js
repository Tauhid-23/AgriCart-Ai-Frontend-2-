// Test authentication status
const testAuth = async () => {
  console.log('Testing authentication status...');
  
  // Check if token exists in sessionStorage
  const token = sessionStorage.getItem('token');
  console.log('Token in sessionStorage:', token ? 'YES' : 'NO');
  
  if (token) {
    console.log('Token length:', token.length);
    
    // Try to decode the token (without verification)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Token payload:', payload);
      console.log('Token expiration:', new Date(payload.exp * 1000));
    } catch (error) {
      console.log('Error decoding token:', error.message);
    }
  } else {
    console.log('No token found in sessionStorage');
  }
  
  // Check if user data exists
  const userData = sessionStorage.getItem('user');
  console.log('User data in sessionStorage:', userData ? 'YES' : 'NO');
  
  if (userData) {
    try {
      const user = JSON.parse(userData);
      console.log('User data:', user);
    } catch (error) {
      console.log('Error parsing user data:', error.message);
    }
  }
};

testAuth();