"use client";

import { useCart } from "@/lib/context/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

export function MyPlanDrawer() {
    const { items, isCartOpen, setIsCartOpen, removeItem, cartTotal } = useCart();

    return (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetContent side="right" className="w-full sm:max-w-md bg-[oklch(0.9484_0.0251_149.08)] text-[oklch(0.2475_0.0661_146.79)] border-l border-[oklch(0.2475_0.0661_146.79)]/10 p-0 flex flex-col h-full max-h-screen overflow-hidden shadow-2xl">
                <SheetHeader className="p-6 border-b border-[oklch(0.2475_0.0661_146.79)]/10 bg-[oklch(0.9484_0.0251_149.08)] backdrop-blur-md">
                    <SheetTitle className="font-erode text-2xl text-[oklch(0.2475_0.0661_146.79)] tracking-tight">
                        My Plan
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6 pb-32 overscroll-contain" data-lenis-prevent="true">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-70">
                            <p className="font-satoshi text-lg">Your plan is empty.</p>
                            <p className="font-satoshi text-sm">Select a program to begin your journey.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between items-start border-b border-[oklch(0.2475_0.0661_146.79)]/10 pb-4">
                                    <div className="space-y-1 pr-4">
                                        <div className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60">
                                            {item.tag}
                                        </div>
                                        <h4 className="font-erode text-lg font-medium">{item.title}</h4>
                                        <div className="font-satoshi font-bold mt-2">
                                            {item.price ? `₹${item.price.toLocaleString()}` : "TBD"}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 opacity-50 hover:opacity-100 transition-opacity rounded-full hover:bg-[oklch(0.2475_0.0661_146.79)]/5"
                                    >
                                        <XIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="absolute flex flex-col items-center justify-center bottom-0 w-full p-6 bg-gradient-to-t from-[oklch(0.9484_0.0251_149.08)] via-[oklch(0.9484_0.0251_149.08)] to-transparent pt-12 border-t border-[oklch(0.2475_0.0661_146.79)]/5">
                        <div className="flex justify-between items-center w-full mb-4 px-2">
                            <span className="font-satoshi font-semibold">Total Investment</span>
                            <span className="font-satoshi font-bold text-xl">₹{cartTotal.toLocaleString()}</span>
                        </div>
                        <Button 
                            className="w-full bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90 h-14 rounded-full font-bold text-lg shadow-xl hover:scale-[0.98] transition-transform"
                            onClick={() => {
                                // Will connect to checkout flow later
                                console.log("Proceed to checkout", items);
                            }}
                        >
                            Finalize Plan
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
