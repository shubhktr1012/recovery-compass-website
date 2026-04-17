"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { nextCartItems, normalizeCartItems } from "@/lib/program-commerce-policy";

export type ProgramItem = {
    id: string;
    title: string;
    price: number | null; // null if TBD/undecided
    tag: string;
};

type CartContextType = {
    items: ProgramItem[];
    addItem: (item: ProgramItem) => void;
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
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Optional: Persist cart to local storage so it survives page reloads
    useEffect(() => {
        const savedCart = localStorage.getItem("rc_cart");
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                if (Array.isArray(parsed)) {
                    // Normalize any legacy multi-item cart down to the current
                    // policy limit so the rule stays consistent on reload.
                    setItems(normalizeCartItems(parsed));
                }
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("rc_cart", JSON.stringify(items));
    }, [items]);

    const addItem = (item: ProgramItem) => {
        setItems((prev) => nextCartItems(prev, item));
        setIsCartOpen(true); // Auto-open cart when adding an item
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const isItemInCart = (id: string) => {
        return items.some((item) => item.id === id);
    };

    const clearCart = () => setItems([]);

    const cartTotal = items.reduce((total, item) => total + (item.price || 0), 0);

    return (
        <CartContext.Provider
            value={{
                items,
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
