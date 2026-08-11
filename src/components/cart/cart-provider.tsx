"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export interface CartProduct {
  productId: string;
  name: string;
  price: number;
  image: string | null;
  stock: number;
}

export interface CartItem extends CartProduct {
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const STORAGE_KEY = "xoryth_cart";
const EMPTY: CartItem[] = [];

let cache: CartItem[] | null = null;
const listeners = new Set<() => void>();

function readSnapshot(): CartItem[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function readServerSnapshot(): CartItem[] {
  return EMPTY;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function persist(next: CartItem[]) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors
  }
  listeners.forEach((cb) => cb());
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, readSnapshot, readServerSnapshot);
  const [isOpen, setOpen] = useState(false);

  const addItem = useCallback((product: CartProduct, quantity = 1) => {
    const next = [...readSnapshot()];
    const existing = next.find((i) => i.productId === product.productId);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, existing.stock);
    } else {
      next.push({ ...product, quantity: Math.min(quantity, product.stock) });
    }
    persist(next);
  }, []);

  const removeItem = useCallback((productId: string) => {
    persist(readSnapshot().filter((i) => i.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    persist(
      readSnapshot().map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.min(quantity, i.stock) }
          : i,
      ),
    );
  }, []);

  const clear = useCallback(() => persist([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return {
      items,
      count,
      total,
      isOpen,
      setOpen,
      addItem,
      removeItem,
      setQuantity,
      clear,
    };
  }, [items, isOpen, addItem, removeItem, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
