import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backgroundColor: '#fef2f2'
        }}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            padding: '40px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ color: '#dc2626', fontSize: '24px', marginBottom: '16px' }}>
              ⚠️ Application Error
            </h1>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Something went wrong. Please try refreshing the page.
            </p>
            <details style={{ marginBottom: '20px' }}>
              <summary style={{ 
                cursor: 'pointer', 
                color: '#059669',
                padding: '10px',
                backgroundColor: '#f0fdf4',
                borderRadius: '6px'
              }}>
                Show Error Details
              </summary>
              <pre style={{
                marginTop: '10px',
                padding: '15px',
                backgroundColor: '#f9fafb',
                borderRadius: '6px',
                fontSize: '12px',
                overflow: 'auto',
                maxHeight: '300px',
                color: '#dc2626',
                border: '1px solid #fee'
              }}>
{this.state.error?.toString()}
{'\n\n'}
{this.state.error?.stack}
{'\n\nComponent Stack:'}
{this.state.errorInfo?.componentStack}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              style={{
                width: '100%',
                padding: '12px 24px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '12px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
            >
              Reload Page
            </button>
            <a
              href="/"
              style={{
                display: 'block',
                textAlign: 'center',
                color: '#059669',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Go to Homepage
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Render App with Error Boundary
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);