import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../services/db';

type CartItem = Product & { cartId: string };

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (cartId: string) => void;
  cartTotal: number;
  addedMessage: string | null;
  setAddedMessage: (msg: string | null) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('heman_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('heman_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (addedMessage) {
      const timer = setTimeout(() => {
        setAddedMessage(null);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [addedMessage]);

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, { ...product, cartId: Date.now().toString() + Math.random().toString(36).substr(2, 9) }]);
    setAddedMessage('The Item is succesfully added to the cart');
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  // Only calculate standard numerical prices
  const cartTotal = cart.reduce((total, item) => {
    if (item.pricingType === 'wholesale' || item.pricingType === 'contact') {
      return total;
    }
    return total + (item.price || 0);
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, cartTotal, addedMessage, setAddedMessage }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
