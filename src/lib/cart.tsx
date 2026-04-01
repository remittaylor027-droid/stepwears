"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "./products";

export type CartItem = {
  product: Product;
  color: string;
  colorHex: string;
  size: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, color: string, size: string) => void;
  updateQuantity: (productId: string, color: string, size: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | null>(null);

const KEY = "stepwear_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  // Persist on change
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const key = (id: string, color: string, size: string) => `${id}-${color}-${size}`;

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const exists = prev.find(
        (i) => key(i.product.id, i.color, i.size) === key(newItem.product.id, newItem.color, newItem.size)
      );
      if (exists) {
        return prev.map((i) =>
          key(i.product.id, i.color, i.size) === key(newItem.product.id, newItem.color, newItem.size)
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (productId: string, color: string, size: string) => {
    setItems((prev) => prev.filter((i) => key(i.product.id, i.color, i.size) !== key(productId, color, size)));
  };

  const updateQuantity = (productId: string, color: string, size: string, qty: number) => {
    if (qty < 1) { removeFromCart(productId, color, size); return; }
    setItems((prev) =>
      prev.map((i) =>
        key(i.product.id, i.color, i.size) === key(productId, color, size) ? { ...i, quantity: qty } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal   = items.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
