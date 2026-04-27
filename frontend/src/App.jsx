import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Business from './pages/Business';
import AIChatbot from './components/chatbot/AIChatbot';

import { ShopProvider } from './context/ShopContext';

function App() {
  return (
    <ShopProvider>
      <Router>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collections" element={<ProductListing />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/business" element={<Business />} />
            </Routes>
          </main>
          <AIChatbot />
          <Footer />
        </div>
      </Router>
    </ShopProvider>
  );
}

export default App;
