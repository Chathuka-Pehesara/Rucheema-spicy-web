import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Business from './pages/Business';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AIChatbot from './components/chatbot/AIChatbot';
import CustomCursor from './components/common/CustomCursor';
import ScrollToTop from './components/common/ScrollToTop';
import ProtectedRoute from './components/common/ProtectedRoute';

import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname === '/admin' || location.pathname === '/dashboard';
  const isPayment = location.pathname === '/payment';

  return (
    <div className="app">
      <CustomCursor />
      {!isDashboard && !isPayment && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/collections" element={<ProductListing />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/business" element={<Business />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['user', 'admin', 'owner', 'customer']}>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['owner']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'owner']}>
                <Admin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'owner']}>
                <Settings />
              </ProtectedRoute>
            } 
          />

          {/* Catch all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isDashboard && !isPayment && <AIChatbot />}
      {!isDashboard && !isPayment && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <Router>
          <ScrollToTop />
          <AppContent />
        </Router>
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;
