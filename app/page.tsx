"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { ArrowRight, Leaf, Wallet, Activity, Wind, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WaitlistDialog } from "@/components/waitlist-dialog";

// Animation variants for smooth entry
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Home() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const { scrollY } = useScroll();

  // Scroll Animations for Navbar
  // At top (0px): Wide, transparent, simple
  // Scrolled (>100px): Compact pill, glass, border, shadow
  const navWidth = useTransform(scrollY, [0, 100], ["100%", "90%"]); // shrink width
  const navY = useTransform(scrollY, [0, 100], [0, 24]); // move down slightly
  const navRadius = useTransform(scrollY, [0, 100], [0, 50]); // rectangle -> pill
  const navBg = useTransform(scrollY, [0, 100], ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.7)"]); // transparent -> glass
  const navBorder = useTransform(scrollY, [0, 100], ["rgba(0, 0, 0, 0)", "rgba(255, 255, 255, 0.2)"]); // no border -> border
  const navShadow = useTransform(scrollY, [0, 100], ["none", "0 4px 6px -1px rgb(0 0 0 / 0.05)"]); // no shadow -> shadow

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
      {/* Waitlist Dialog */}
      <WaitlistDialog open={waitlistOpen} onOpenChange={setWaitlistOpen} />

      {/* Navigation - Dynamic Scroll Transition */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <motion.nav
          style={{
            width: navWidth,
            y: navY,
            borderRadius: navRadius,
            backgroundColor: navBg,
            borderColor: navBorder,
            boxShadow: navShadow,
            backdropFilter: "blur(12px)"
          }}
          className="pointer-events-auto max-w-5xl 2xl:max-w-6xl h-14 flex items-center justify-between px-6 border border-transparent transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Leaf className="w-4 h-4 text-primary" />
            </div>
            <span className="font-serif font-bold text-lg tracking-tight text-foreground/90">Recovery Compass</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full hover:bg-primary/5 hover:text-primary text-muted-foreground font-medium px-5 text-sm h-9"
            onClick={() => setWaitlistOpen(true)}
          >
            Sign In
          </Button>
        </motion.nav>
      </div>

      <main className="pt-40 pb-32 px-6 relative z-0">
        {/* Breathing Orb Background */}
        <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none -z-10">
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-[90px]"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl 2xl:max-w-6xl mx-auto text-center space-y-10"
        >
          {/* Beta Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <span className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium border border-border/50 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Private Beta - Request Access
            </span>
          </motion.div>

          {/* Hero Headline */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl 2xl:text-9xl font-serif font-medium text-foreground leading-[1.1] tracking-tight">
              Reclaim your <span className="italic text-primary">clarity</span>.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              A disciplined, premium companion for your journey to a smoke-free life.
              Track progress, health recovery, and savings with elegance.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
            <Button
              size="lg"
              className="h-14 px-10 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95"
              onClick={() => setWaitlistOpen(true)}
            >
              Join the Waitlist
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full border-border bg-transparent hover:bg-secondary/50">
              View Demo
            </Button>
          </motion.div>

          {/* App Preview Container */}
          <motion.div
            variants={itemVariants}
            className="mt-32"
          >
            {/* Preview Label */}
            <div className="flex justify-center mb-10">
              <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-4 py-1.5 bg-secondary/50 rounded-full border border-border/50">
                <Lock className="w-3.5 h-3.5" /> Preview Experience
              </span>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 text-left max-w-6xl 2xl:max-w-7xl mx-auto">
              {/* Main Tracker Card (Large) */}
              <div className="md:col-span-2 bg-card border border-border/50 p-8 rounded-[2rem] shadow-sm relative overflow-hidden group hover:border-primary/20 transition-all hover:shadow-md">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-primary/10"></div>

                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-serif mb-1">Smoke-Free Streak</h3>
                      <p className="text-muted-foreground">Your discipline, quantified.</p>
                    </div>
                    <Activity className="w-6 h-6 text-primary" />
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-sans font-semibold tracking-tighter">12</span>
                    <span className="text-xl text-muted-foreground">days</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "40%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Next milestone: 14 days (Oxygen levels normalized)</p>
                </div>
              </div>

              {/* Savings Card (Tall) */}
              <div className="md:col-span-1 bg-primary text-primary-foreground p-8 rounded-[2rem] shadow-lg relative overflow-hidden flex flex-col justify-between group transition-transform hover:scale-[1.02] duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8"></div>

                <div>
                  <Wallet className="w-8 h-8 mb-4 opacity-80" />
                  <h3 className="text-xl font-serif opacity-90">Money Saved</h3>
                </div>

                <div>
                  <p className="text-4xl font-sans font-bold tracking-tight mb-1">$142.50</p>
                  <p className="text-sm opacity-70">That's 20 coffees.</p>
                </div>
              </div>

              {/* Health Feature 1 */}
              <div className="bg-card border border-border/50 p-6 rounded-[2rem] hover:border-primary/20 transition-colors hover:shadow-sm">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center mb-4 text-primary">
                  <Wind className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg mb-2">Lung Capacity</h3>
                <p className="text-sm text-muted-foreground">
                  Track your physical recovery in real-time as your body heals.
                </p>
              </div>

              {/* Health Feature 2 */}
              <div className="bg-card border border-border/50 p-6 rounded-[2rem] hover:border-primary/20 transition-colors hover:shadow-sm">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center mb-4 text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg mb-2">Craving Shield</h3>
                <p className="text-sm text-muted-foreground">
                  Smart notifications and breathing exercises when you need them most.
                </p>
              </div>

              {/* Community Card */}
              <div
                className="bg-secondary/50 border border-border/50 p-6 rounded-[2rem] flex flex-col justify-center items-center text-center hover:bg-secondary/80 transition-all cursor-pointer group hover:border-primary/20"
                onClick={() => setWaitlistOpen(true)}
              >
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-serif text-lg">Join the Waitlist</h3>
                <p className="text-xs text-muted-foreground mt-1">Get early access</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <footer className="border-t border-border/40 py-16 bg-secondary/20">
        <div className="max-w-6xl 2xl:max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Leaf className="w-6 h-6 text-muted-foreground" />
            <span className="font-serif text-xl text-muted-foreground">Recovery Compass</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Recovery Compass. Designed for clarity.
          </p>
        </div>
      </footer>
    </div>
  );
}
