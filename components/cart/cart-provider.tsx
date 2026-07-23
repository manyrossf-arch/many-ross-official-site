"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  buildCartItem,
  CART_MAX_QUANTITY,
  CART_STORAGE_KEY,
  clampQuantity,
  getCartTotals,
  sanitizeCartItems,
} from "@/lib/cart";
import type { AddCartItemInput, CartItem } from "@/types/cart";

type CartContextValue = {
  cartItems: CartItem[];
  addItem: (input: AddCartItemInput) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  currency: string;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  isHydrated: boolean;
  announcement: string;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const announcementTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);
      const parsed = rawValue ? JSON.parse(rawValue) : [];
      setCartItems(sanitizeCartItems(parsed));
    } catch {
      setCartItems([]);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems, isHydrated]);

  const announce = useCallback((message: string) => {
    setAnnouncement(message);

    if (announcementTimeoutRef.current) {
      window.clearTimeout(announcementTimeoutRef.current);
    }

    announcementTimeoutRef.current = window.setTimeout(() => {
      setAnnouncement("");
    }, 2200);
  }, []);

  useEffect(() => {
    return () => {
      if (announcementTimeoutRef.current) {
        window.clearTimeout(announcementTimeoutRef.current);
      }
    };
  }, []);

  const addItem = useCallback((input: AddCartItemInput) => {
    const nextItem = buildCartItem(input);

    setCartItems((current) => {
      const existing = current.find((item) => item.cartItemId === nextItem.cartItemId);

      if (existing) {
        return current.map((item) =>
          item.cartItemId === nextItem.cartItemId
            ? { ...item, quantity: clampQuantity(item.quantity + (input.quantity ?? 1)) }
            : item,
        );
      }

      return [...current, nextItem];
    });

    setIsCartOpen(true);
    announce(`${input.productName} agregado al carrito.`);
  }, [announce]);

  const removeItem = useCallback((cartItemId: string) => {
    setCartItems((current) => current.filter((item) => item.cartItemId !== cartItemId));
    announce("Producto eliminado del carrito.");
  }, [announce]);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    setCartItems((current) =>
      current.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: clampQuantity(quantity) }
          : item,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    announce("Carrito vaciado.");
  }, [announce]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((current) => !current), []);

  const totals = useMemo(() => getCartTotals(cartItems), [cartItems]);

  const value = useMemo<CartContextValue>(
    () => ({
      cartItems,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems: totals.totalItems,
      subtotal: totals.subtotal,
      currency: totals.currency,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      isHydrated,
      announcement,
    }),
    [cartItems, addItem, removeItem, updateQuantity, clearCart, totals, isCartOpen, openCart, closeCart, toggleCart, isHydrated, announcement],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider.");
  }

  return context;
}

export { CART_MAX_QUANTITY };
