"use client";

import { motion } from "framer-motion";
import { CigaretteOff, TrendingUp, Heart, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-zinc-950 text-zinc-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="p-4 bg-zinc-900 rounded-full">
            <CigaretteOff className="w-12 h-12 text-zinc-50" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold tracking-tight">Quit Smoking Today</h1>
        <p className="text-zinc-400 max-w-md mx-auto">
          Track your progress, save money, and reclaim your health with our advanced quitting companion.
        </p>

        <div className="flex gap-4 justify-center">
          <Button size="lg" className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200">
            Start Your Journey
          </Button>
          <Button size="lg" variant="outline" className="border-zinc-800 hover:bg-zinc-900">
            Learn More
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: Heart, label: "Health", desc: "Monitor recovery" },
            { icon: Wallet, label: "Savings", desc: "Track money saved" },
            { icon: TrendingUp, label: "Streak", desc: "Day by day progress" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-6 bg-zinc-900/50 rounded-xl border border-zinc-800"
            >
              <item.icon className="w-6 h-6 mb-2 text-zinc-400" />
              <h3 className="font-semibold">{item.label}</h3>
              <p className="text-sm text-zinc-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
