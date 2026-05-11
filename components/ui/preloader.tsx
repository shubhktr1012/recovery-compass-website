"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const [isInstant, setIsInstant] = useState(false);

  useEffect(() => {
    const hasSeenPreloader = sessionStorage.getItem("has_seen_preloader");

    if (hasSeenPreloader) {
      setTimeout(() => {
        setIsInstant(true);
        setLoading(false);
      }, 0);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("has_seen_preloader", "true");
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          exit={{ opacity: 0, filter: isInstant ? "none" : "blur(10px)" }}
          transition={{ duration: isInstant ? 0 : 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary [.skip-preloader_&]:!hidden"
        >
          <div className="relative flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.8, 1.4, 1],
                opacity: [0, 1, 1],
              }}
              transition={{
                duration: 3.5,
                times: [0, 0.6, 1],
                ease: [0.76, 0, 0.24, 1],
              }}
              className="relative z-20 flex h-16 w-16 items-center justify-center md:h-20 md:w-20"
            >
              <Image
                src="/rc-logo-white.svg"
                alt="Recovery Compass Logo"
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            <motion.div
              className="flex items-center overflow-hidden"
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: "auto",
                opacity: 1,
              }}
              transition={{
                delay: 2.1,
                duration: 1.4,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              <div className="whitespace-nowrap pt-1 pl-4 font-erode text-3xl font-medium leading-none text-white md:text-4xl">
                Recovery Compass
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
