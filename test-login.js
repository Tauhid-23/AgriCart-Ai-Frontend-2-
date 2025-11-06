// Simple test to verify login functionality
const testLogin = async () => {
  try {
    // Try to login with test credentials
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Login successful:', data);
      
      // Store token in sessionStorage
      sessionStorage.setItem('token', data.token);
      console.log('Token stored in sessionStorage');
    } else {
      console.log('Login failed:', response.status, await response.text());
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};

// Run the test
testLogin();