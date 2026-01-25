"use client";

import { motion } from "framer-motion";
import { ArrowRight, Leaf, Wallet, Activity, Wind, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

// Animation variants for smooth entry
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
      {/* Navigation (Simple & Clean) */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight">Breath.</span>
          </div>
          <Button variant="ghost" className="text-muted-foreground hover:text-primary">
            Sign In
          </Button>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <span className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium border border-border/50">
              New: Community Challenges Available
            </span>
          </motion.div>

          {/* Hero Headline */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-serif font-medium text-foreground leading-[1.1]">
              Reclaim your <span className="italic text-primary">clarity</span>.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              A disciplined, premium companion for your journey to a smoke-free life.
              Track progress, health recovery, and savings with elegance.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="h-12 px-8 text-base rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
              Start Your Journey
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full border-border bg-transparent hover:bg-secondary/50">
              View Demo
            </Button>
          </motion.div>

          {/* App Preview / Bento Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20 text-left"
          >
            {/* Main Tracker Card (Large) */}
            <div className="md:col-span-2 bg-card border border-border/50 p-8 rounded-3xl shadow-sm relative overflow-hidden group hover:border-primary/20 transition-colors">
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
                    animate={{ width: "40%" }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="h-full bg-primary"
                  />
                </div>
                <p className="text-sm text-muted-foreground">Next milestone: 14 days (Oxygen levels normalized)</p>
              </div>
            </div>

            {/* Savings Card (Tall) */}
            <div className="md:col-span-1 bg-primary text-primary-foreground p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between group">
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
            <div className="bg-card border border-border/50 p-6 rounded-3xl hover:border-primary/20 transition-colors">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center mb-4 text-primary">
                <Wind className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg mb-2">Lung Capacity</h3>
              <p className="text-sm text-muted-foreground">
                Track your physical recovery in real-time as your body heals.
              </p>
            </div>

            {/* Health Feature 2 */}
            <div className="bg-card border border-border/50 p-6 rounded-3xl hover:border-primary/20 transition-colors">
              <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center mb-4 text-primary">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg mb-2">Craving Shield</h3>
              <p className="text-sm text-muted-foreground">
                Smart notifications and breathing exercises when you need them most.
              </p>
            </div>

            {/* Community Card */}
            <div className="bg-secondary/50 border border-border/50 p-6 rounded-3xl flex flex-col justify-center items-center text-center hover:bg-secondary/80 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <ArrowRight className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-serif text-lg">Join the Waitlist</h3>
              <p className="text-xs text-muted-foreground mt-1">Get early access</p>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <footer className="border-t border-border/40 py-12 bg-secondary/20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-muted-foreground" />
            <span className="font-serif text-lg text-muted-foreground">Breath.</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Breath Tracker. Designed for clarity.
          </p>
        </div>
      </footer>
    </div>
  );
}
