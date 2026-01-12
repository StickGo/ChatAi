"use client";

import { motion } from "framer-motion";
import { Home, User, Briefcase, Code, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "journey", label: "Journey", icon: Briefcase },
  { id: "projects", label: "Projects", icon: Code },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function BottomNav() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    NAV_ITEMS.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl pointer-events-auto"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              aria-label={item.label}
              className={`relative p-2 md:p-3 rounded-full transition-all duration-300 group ${
                isActive ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white/10 rounded-full"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                />
              )}
              <Icon className="w-5 h-5 relative z-10" />
              
              {/* Tooltip */}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-wider rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
}
