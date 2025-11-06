import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth Context
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Error Boundary
import ErrorBoundary from "./components/ErrorBoundary";

// Marketing Pages
import LandingPage from "./pages/marketing/LandingPage";
import FeaturesPage from "./pages/marketing/FeaturesPage";
import PricingPage from "./pages/marketing/PricingPage";
import BlogHomePage from "./pages/marketing/BlogHomePage";
import BlogArticlePage from "./pages/marketing/BlogArticlePage";
import AboutPage from "./pages/marketing/AboutPage";
import ContactPage from "./pages/marketing/ContactPage";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

// App Pages (Protected)
import Dashboard from "./pages/app/Dashboard";
import MyGarden from "./pages/app/MyGarden";
import TaskManager from "./pages/app/TaskManager";
import PlantDiagnosis from "./pages/app/PlantDiagnosis";
import PlantDatabase from "./pages/app/PlantDatabase";
import CommunityForum from "./pages/app/CommunityForum";
import WeatherAlerts from "./pages/app/WeatherAlerts";
import QuoteHistory from "./pages/app/QuoteHistory";
import GrowthTracking from "./pages/app/GrowthTracking";
import Calendar from "./pages/app/Calendar";
import ComingSoonPage from "./pages/app/ComingSoonPage";

// Marketplace Pages
import Marketplace from "./pages/Marketplace";
import MarketplaceTest from "./pages/MarketplaceTest";
import MarketplaceMinimal from "./pages/MarketplaceMinimal";
import EnvTest from "./pages/EnvTest";
import ErrorTest from "./pages/ErrorTest";
import MarketplaceDebug from "./pages/MarketplaceDebug";
import MarketplaceFinal from "./pages/MarketplaceFinal";
import ProductDetail from "./pages/ProductDetail";
import ShoppingCart from "./pages/ShoppingCart";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrdersPage from "./pages/OrdersPage";

// Layout Components
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import MarketplaceWithLayout from "./components/MarketplaceWithLayout";
import ProductDetailWithLayout from "./components/ProductDetailWithLayout";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              {/* Marketing Pages */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/blog" element={<BlogHomePage />} />
              <Route path="/blog/:slug" element={<BlogArticlePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Public Marketplace Routes with conditional layout */}
              <Route path="/marketplace" element={<MarketplaceWithLayout />} />
              <Route path="/marketplace/test" element={<MarketplaceTest />} />
              <Route path="/marketplace/minimal" element={<MarketplaceMinimal />} />
              <Route path="/marketplace/env-test" element={<EnvTest />} />
              <Route path="/marketplace/error-test" element={<ErrorTest />} />
              <Route path="/marketplace/debug" element={<MarketplaceDebug />} />
              <Route path="/marketplace/final" element={<MarketplaceFinal />} />
              <Route path="/marketplace/product/:productId" element={<ProductDetailWithLayout />} />

              {/* Auth Pages */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Protected App Pages - Wrapped in AppLayout */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Dashboard /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-garden" 
                element={
                  <ProtectedRoute>
                    <AppLayout><MyGarden /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tasks" 
                element={
                  <ProtectedRoute>
                    <AppLayout><TaskManager /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/diagnosis" 
                element={
                  <ProtectedRoute>
                    <AppLayout><PlantDiagnosis /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/database" 
                element={
                  <ProtectedRoute>
                    <AppLayout><PlantDatabase /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/community" 
                element={
                  <ProtectedRoute>
                    <AppLayout><CommunityForum /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/weather" 
                element={
                  <ProtectedRoute>
                    <AppLayout><WeatherAlerts /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/quotes" 
                element={
                  <ProtectedRoute>
                    <AppLayout><QuoteHistory /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Marketplace Routes (for cart, checkout, orders) */}
              <Route 
                path="/marketplace/cart" 
                element={
                  <ProtectedRoute>
                    <AppLayout><ShoppingCart /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/marketplace/checkout" 
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/marketplace/orders/confirmation" 
                element={
                  <ProtectedRoute>
                    <OrderConfirmation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/marketplace/orders" 
                element={
                  <ProtectedRoute>
                    <AppLayout><OrdersPage /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Newly implemented pages */}
              <Route 
                path="/calendar" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Calendar /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/tracking" 
                element={
                  <ProtectedRoute>
                    <AppLayout><GrowthTracking /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Coming Soon Pages */}
              <Route 
                path="/harvest" 
                element={
                  <ProtectedRoute>
                    <AppLayout><ComingSoonPage title="Harvest Tracker" /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/learning" 
                element={
                  <ProtectedRoute>
                    <AppLayout><ComingSoonPage title="Learning Hub" /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/achievements" 
                element={
                  <ProtectedRoute>
                    <AppLayout><ComingSoonPage title="Achievements" /></AppLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <AppLayout><ComingSoonPage title="Settings" /></AppLayout>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </BrowserRouter>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;