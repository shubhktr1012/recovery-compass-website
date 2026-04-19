"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLenis } from "@/components/smooth-scroll-provider";
import { useCart } from "@/lib/context/cart-context";
import { supabase } from "@/lib/supabase";

import Link from "next/link";

import { usePathname } from "next/navigation";
import { useUser } from "@/lib/context/user-context";
import { LogOut, User as UserIcon, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarStickyProps {
    onCtaClick?: () => void; // Deprecated, but kept for compatibility during refactor
    simple?: boolean;
}

export function NavbarSticky({ simple = false }: NavbarStickyProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
    const [uploading, setUploading] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const lenis = useLenis();
    const pathname = usePathname();
    const { items, setIsCartOpen } = useCart();
    const { user, profile, openAuthModal, signOut } = useUser();

    React.useEffect(() => {
        if (profile?.avatar_url) {
            if (profile.avatar_url.startsWith('http')) {
                setAvatarUrl(profile.avatar_url);
            } else {
                supabase.storage.from('profile-images').createSignedUrl(profile.avatar_url, 60 * 60 * 24).then(({ data }) => {
                    if (data?.signedUrl) {
                        setAvatarUrl(data.signedUrl);
                    }
                });
            }
        } else {
            setAvatarUrl(null);
        }
    }, [profile?.avatar_url]);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!e.target.files || e.target.files.length === 0 || !user) return;
            setUploading(true);
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpeg';
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
                .from('profile-images')
                .upload(fileName, file, { upsert: true });
                
            if (uploadError) throw uploadError;
            
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: fileName, updated_at: new Date().toISOString() })
                .eq('id', user.id);
                
            if (updateError) throw updateError;
            
            const { data } = await supabase.storage.from('profile-images').createSignedUrl(fileName, 60 * 60 * 24);
            if (data?.signedUrl) {
                setAvatarUrl(data.signedUrl);
            }
            
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert("Error uploading avatar. Please try again.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith("#")) {
            if (pathname !== "/") {
                // If not on home page, let the default Link behavior handle navigation to the anchor
                return;
            }

            e.preventDefault();
            if (lenis) {
                lenis.scrollTo(href);
            } else {
                const target = document.querySelector(href);
                target?.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    const navLinks = simple ? [{ label: "Home", href: "/" }] : [
        { label: "Why Us?", href: "#why-us" },
        { label: "Features", href: "#features" },
        { label: "Programs", href: "#programs" },
    ];

    return (
        <motion.header
            className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-black/5"
            initial={pathname === "/" ? { y: -20, opacity: 0 } : false}
            animate={pathname === "/" ? { y: 0, opacity: 1 } : false}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <div className="flex items-center justify-between px-6 md:px-12 py-2.5 max-w-[1200px] mx-auto">

                {/* Brand */}
                <Link href="/" className="flex items-center gap-2 text-[oklch(0.2475_0.0661_146.79)] hover:opacity-80 transition-opacity">
                    <Image
                        src="/rc-logo-primary.svg"
                        alt=""
                        width={28}
                        height={28}
                        className="size-7"
                    />
                    <span className="font-erode text-lg font-semibold tracking-tighter text-primary">
                        Recovery Compass
                    </span>
                    <span className="ml-2 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] rounded-full border border-[oklch(0.2475_0.0661_146.79)]/20 text-[oklch(0.2475_0.0661_146.79)]/50 bg-[oklch(0.2475_0.0661_146.79)]/5">
                        Open Beta
                    </span>
                </Link>

                {/* Right Actions (Nav + CTA + Mobile Toggle) */}
                <div className="flex items-center gap-6">
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={(e) => handleNavClick(e, link.href)}
                                className="group relative text-sm font-medium text-[oklch(0.2475_0.0661_146.79)]/80 hover:text-[oklch(0.2475_0.0661_146.79)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.2475_0.0661_146.79)] focus-visible:ring-offset-2 rounded-sm py-1"
                            >
                                {link.label}
                                <span className="absolute inset-x-0 bottom-0 h-px bg-[oklch(0.2475_0.0661_146.79)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out" />
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTA & Auth */}
                    <div className="hidden md:flex items-center gap-4">
                        {!user ? (
                            <button 
                                onClick={() => openAuthModal("signin")}
                                className="text-sm font-bold text-[oklch(0.2475_0.0661_146.79)] hover:opacity-70 transition-all px-2"
                            >
                                Login
                            </button>
                        ) : (
                            <div className="flex items-center gap-3 pr-2 border-r border-black/5 mr-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleAvatarUpload}
                                    style={{ display: 'none' }}
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative group rounded-full disabled:opacity-50 transition-opacity"
                                    disabled={uploading}
                                    title="Upload Profile Picture"
                                >
                                    <Avatar className="size-8 rounded-full border border-[oklch(0.2475_0.0661_146.79)]/10 transition-transform group-hover:scale-105">
                                        <AvatarImage src={avatarUrl || undefined} alt="Profile Picture" className="object-cover" />
                                        <AvatarFallback className="bg-[oklch(0.2475_0.0661_146.79)]/5 text-[oklch(0.2475_0.0661_146.79)] text-[10px] font-bold">
                                            {user.email?.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    {uploading ? (
                                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
                                            <Loader2 className="size-4 animate-spin text-white" />
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                                <circle cx="12" cy="13" r="4"/>
                                            </svg>
                                        </div>
                                    )}
                                </button>
                                <button 
                                    onClick={() => signOut()}
                                    className="p-2 rounded-full hover:bg-black/5 transition-colors"
                                    title="Sign Out"
                                >
                                    <LogOut className="size-4 text-[oklch(0.2475_0.0661_146.79)]/60" />
                                </button>
                            </div>
                        )}

                        {(user || items.length > 0) && (
                            <Button
                                onClick={() => setIsCartOpen(true)}
                                className={cn(
                                    "rounded-full px-6 text-sm font-bold transition-all active:scale-[0.98] relative",
                                    "bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/95 hover:shadow-lg",
                                    "border-none h-10 shadow-sm transition-all duration-300"
                                )}
                            >
                                My Plan
                                {items.length > 0 && (
                                    <motion.span 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[oklch(0.55_0.15_25)] text-[10px] font-bold text-white shadow-md ring-2 ring-white"
                                    >
                                        {items.length}
                                    </motion.span>
                                )}
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Toggle (2-Line Animated Icon) */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 z-50 relative rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.2475_0.0661_146.79)] focus-visible:ring-offset-2"
                        aria-label="Toggle menu"
                    >
                        {/* Top Line */}
                        <motion.span
                            animate={isOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="w-5 h-0.5 bg-[oklch(0.2475_0.0661_146.79)] block origin-center rounded-full"
                        />
                        {/* Bottom Line */}
                        <motion.span
                            animate={isOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="w-5 h-0.5 bg-[oklch(0.2475_0.0661_146.79)] block origin-center rounded-full"
                        />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="md:hidden absolute top-full left-0 w-full bg-white border-b border-[oklch(0.2475_0.0661_146.79)]/5 shadow-lg overflow-hidden"
                    >
                        <nav className="flex flex-col gap-6 px-6 py-6 items-start">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.label}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="text-base font-medium text-[oklch(0.2475_0.0661_146.79)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.2475_0.0661_146.79)] focus-visible:ring-offset-2 rounded-sm"
                                        onClick={(e) => {
                                            handleNavClick(e, link.href);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                            <div className="flex flex-col gap-4 w-full">
                                {!user ? (
                                    <Button
                                        onClick={() => {
                                            openAuthModal("signin");
                                            setIsOpen(false);
                                        }}
                                        variant="outline"
                                        className="w-full rounded-full border-[oklch(0.2475_0.0661_146.79)]/20 text-[oklch(0.2475_0.0661_146.79)] h-12 font-bold"
                                    >
                                        Log In
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => {
                                            signOut();
                                            setIsOpen(false);
                                        }}
                                        variant="outline"
                                        className="w-full rounded-full border-red-100 text-red-600 bg-red-50/30 h-12 font-bold flex gap-2"
                                    >
                                        <LogOut className="size-4" /> Sign Out
                                    </Button>
                                )}

                                <Button
                                    onClick={() => {
                                        setIsCartOpen(true);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full rounded-full px-6 py-4 text-base font-bold relative",
                                        "bg-[oklch(0.2475_0.0661_146.79)] text-white hover:bg-[oklch(0.2475_0.0661_146.79)]/90",
                                        "h-12 shadow-md active:scale-95 transition-all"
                                    )}
                                >
                                    View My Plan
                                    {items.length > 0 && (
                                        <motion.span 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[oklch(0.55_0.15_25)] text-xs font-bold text-white shadow-md ring-2 ring-white"
                                        >
                                            {items.length}
                                        </motion.span>
                                    )}
                                </Button>
                            </div>
                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
