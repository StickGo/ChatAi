"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music2, X, Minimize2, Maximize2 } from "lucide-react";

export default function SpotifyWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-[100]">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl w-[300px] sm:w-[350px]"
          >
            {/* Widget Header */}
            <div className="flex items-center justify-between p-3 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-2">
                <Music2 className="w-4 h-4 text-[#1DB954]" />
                <span className="text-xs font-mono uppercase tracking-widest text-white/70">On Air</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Spotify Iframe */}
            <div className="relative h-[152px]">
               <iframe 
                style={{ borderRadius: "0px" }} 
                src="https://open.spotify.com/embed/playlist/5nrzVJRiyc7FuPFi0Q7nFa?utm_source=generator&theme=0" 
                width="100%" 
                height="152" 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              />
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            layoutId="spotify-trigger"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-4 py-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-full shadow-lg hover:border-[#1DB954]/50 hover:shadow-[#1DB954]/20 transition-all group"
          >
            <div className="relative">
              <Music2 className="w-5 h-5 text-white/70 group-hover:text-[#1DB954] transition-colors" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DB954] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1DB954]"></span>
              </span>
            </div>
            <span className="text-sm font-mono uppercase tracking-widest text-white/70 group-hover:text-white hidden sm:block">
              Vibe With Me
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
