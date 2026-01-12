"use client";

import { motion } from "framer-motion";
import { 
  Code2, 
  Database, 
  Gamepad2, 
  Globe, 
  Layout, 
  Music, 
  Server, 
  Smartphone, 
  Terminal, 
  Zap 
} from "lucide-react";

const SKILLS = [
  { name: "Next.js", icon: Globe },
  { name: "React", icon: Code2 },
  { name: "TypeScript", icon: Terminal },
  { name: "Tailwind CSS", icon: Layout },
  { name: "Flutter", icon: Smartphone },
  { name: "Unity Engine", icon: Gamepad2 },
  { name: "C#", icon: Code2 },
  { name: "PostgreSQL", icon: Database },
  { name: "Logic Pro X", icon: Music },
  { name: "Node.js", icon: Server },
  { name: "Framer Motion", icon: Zap },
];

export default function TechMarquee() {
  return (
    <section className="py-10 border-t border-white/5 bg-[var(--color-dark)]/50 overflow-hidden">
      <div className="relative flex">
        {/* Gradient Overlay for Fade Effect */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[var(--color-dark)] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[var(--color-dark)] to-transparent z-10" />

        {/* Marquee Track */}
        <motion.div
          className="flex flex-nowrap gap-12 sm:gap-20"
          animate={{ x: [0, -1000] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {/* Duplicate list 3 times to ensure seamless loop on wide screens */}
          {[...SKILLS, ...SKILLS, ...SKILLS].map((skill, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 text-white/40 hover:text-white/80 transition-colors group cursor-default"
              aria-hidden={index >= SKILLS.length ? "true" : "false"}
            >
              <skill.icon className="w-5 h-5 sm:w-6 sm:h-6 group-hover:text-[var(--color-medium)] transition-colors" />
              <span className="text-lg sm:text-lg font-mono tracking-widest uppercase whitespace-nowrap">
                {skill.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
