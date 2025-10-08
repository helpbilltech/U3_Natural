import React, { createContext, useContext, useState, useEffect } from 'react';
import FlyingNumber from '../components/FlyingNumber';

const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [flyingNumbers, setFlyingNumbers] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('u3-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Validate cart items
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        // Clear invalid cart data
        localStorage.removeItem('u3-cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('u3-cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  const addToCart = (product, quantity = 1, buttonElement = null) => {
    // Validate product
    if (!product || !product._id) {
      console.error('Invalid product provided to addToCart');
      return;
    }

    // Trigger flying animation
    if (buttonElement) {
      const buttonRect = buttonElement.getBoundingClientRect();
      const startPosition = {
        x: buttonRect.left + buttonRect.width / 2,
        y: buttonRect.top + buttonRect.height / 2
      };
      
      // Get cart icon position
      const cartIcon = document.querySelector('[aria-label="Cart"]');
      const endPosition = cartIcon ? {
        x: cartIcon.getBoundingClientRect().left + cartIcon.getBoundingClientRect().width / 2,
        y: cartIcon.getBoundingClientRect().top + cartIcon.getBoundingClientRect().height / 2
      } : { x: window.innerWidth - 50, y: 50 };

      const flyingId = Date.now();
      setFlyingNumbers(prev => [...prev, {
        id: flyingId,
        number: quantity,
        startPosition,
        endPosition
      }]);
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevCart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    if (!productId) {
      console.error('Invalid product ID provided to removeFromCart');
      return;
    }
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (!productId) {
      console.error('Invalid product ID provided to updateQuantity');
      return;
    }
    
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item._id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + (parseInt(item.quantity) || 0), 0);
  };

  const removeFlyingNumber = (id) => {
    setFlyingNumbers(prev => prev.filter(flying => flying.id !== id));
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    flyingNumbers,
    removeFlyingNumber
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      {flyingNumbers.map(flying => (
        <FlyingNumber
          key={flying.id}
          number={flying.number}
          startPosition={flying.startPosition}
          endPosition={flying.endPosition}
          onComplete={() => removeFlyingNumber(flying.id)}
        />
      ))}
    </CartContext.Provider>
  );
}