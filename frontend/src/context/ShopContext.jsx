import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [notification, setNotification] = useState(null);

  // Load user-specific cart from localStorage
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`spice_cart_${user._id}`);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        setCart([]);
      }
    } else {
      setCart([]); // Clear cart if no user
    }
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`spice_cart_${user._id}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      showNotification("Please log in to add items to cart.");
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showNotification(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, amount) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + amount);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    if (user) {
      localStorage.removeItem(`spice_cart_${user._id}`);
    }
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        showNotification(`${product.name} removed from wishlist.`);
        return prev.filter(item => item.id !== product.id);
      }
      showNotification(`${product.name} added to wishlist!`);
      return [...prev, product];
    });
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <ShopContext.Provider value={{
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      cartCount,
      cartTotal,
      notification
    }}>
      {children}
      {notification && (
        <div className="global-notification">
          {notification}
        </div>
      )}
    </ShopContext.Provider>
  );
};
