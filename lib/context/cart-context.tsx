"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { canonicalizeWebsiteProgramId, nextCartItems, normalizeCartItems } from "@/lib/program-commerce-policy";

export type ProgramItem = {
    id: string;
    title: string;
    price: number | null; // null if TBD/undecided
    tag: string;
};

type CartContextType = {
    items: ProgramItem[];
    cartLoaded: boolean;
    addItem: (item: ProgramItem, options?: { openCart?: boolean }) => void;
    removeItem: (id: string) => void;
    isItemInCart: (id: string) => boolean;
    clearCart: () => void;
    cartTotal: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<ProgramItem[]>([]);
    const [cartLoaded, setCartLoaded] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        const savedCart = localStorage.getItem("rc_cart");
        if (!savedCart) {
            setCartLoaded(true);
            return;
        }

        try {
            const parsed = JSON.parse(savedCart);
            if (Array.isArray(parsed)) {
                // Normalize legacy carts so reloads obey the current commerce rules.
                setItems(normalizeCartItems(parsed));
            }
        } catch (e) {
            console.error("Failed to parse cart", e);
        } finally {
            setCartLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!cartLoaded) {
            return;
        }

        localStorage.setItem("rc_cart", JSON.stringify(items));
    }, [cartLoaded, items]);

    const addItem = useCallback((item: ProgramItem, options?: { openCart?: boolean }) => {
        setItems((prev) => nextCartItems(prev, item));
        if (options?.openCart !== false) {
            setIsCartOpen(true); // Auto-open cart when adding an item
        }
    }, []);

    const removeItem = useCallback((id: string) => {
        const normalizedId = canonicalizeWebsiteProgramId(id);
        setItems((prev) => prev.filter((item) => item.id !== normalizedId));
    }, []);

    const isItemInCart = useCallback((id: string) => {
        const normalizedId = canonicalizeWebsiteProgramId(id);
        return items.some((item) => item.id === normalizedId);
    }, [items]);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const cartTotal = items.reduce((total, item) => total + (item.price || 0), 0);

    return (
        <CartContext.Provider
            value={{
                items,
                cartLoaded,
                addItem,
                removeItem,
                isItemInCart,
                clearCart,
                cartTotal,
                isCartOpen,
                setIsCartOpen
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
