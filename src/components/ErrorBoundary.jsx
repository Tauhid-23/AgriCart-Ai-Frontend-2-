import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 ERROR BOUNDARY CAUGHT ERROR:');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Component stack:', errorInfo.componentStack);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              ⚠️ Something Went Wrong
            </h1>
            <div className="bg-red-50 p-4 rounded-lg mb-4">
              <p className="font-semibold text-red-800 mb-2">Error:</p>
              <pre className="text-sm text-red-700 overflow-auto">
                {this.state.error && this.state.error.toString()}
              </pre>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="font-semibold text-gray-800 mb-2">Stack Trace:</p>
              <pre className="text-xs text-gray-700 overflow-auto max-h-64">
                {this.state.error && this.state.error.stack}
              </pre>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="font-semibold text-blue-800 mb-2">Component Stack:</p>
              <pre className="text-xs text-blue-700 overflow-auto max-h-64">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;