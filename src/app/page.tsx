"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  Github, 
  Mail, 
  Code, 
  ExternalLink, 
  ChevronDown, 
  Gamepad2, 
  Music, 
  Instagram,
  User,
  Briefcase,
  Smartphone,
  Globe,
  Award,
  GraduationCap
} from "lucide-react";
import ChatWidget from "@/components/ChatWidget";
import TechMarquee from "@/components/TechMarquee";
import SpotifyWidget from "@/components/SpotifyWidget";
import BottomNav from "@/components/BottomNav";
import { PORTFOLIO_DATA } from "@/data/portfolio";

export default function Home() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroY = useTransform(scrollY, [0, 300], [0, 100]);
  
  const [activeTab, setActiveTab] = useState("All");

  const categories = ["All", "Game Development", "Web Development", "App Development", "Music Production"];

  const filteredProjects = activeTab === "All" 
    ? PORTFOLIO_DATA.projects 
    : PORTFOLIO_DATA.projects.filter((p: any) => p.category === activeTab);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-[var(--color-medium)] selection:text-white transition-colors duration-300">


      {/* HERO BACKGROUND - COLLAGE OF USER PHOTOS */}
      <div className="fixed inset-0 z-0">
         <div className="absolute inset-0 grid grid-cols-3 opacity-80">
            <div className="relative h-full w-full">
               <Image src="/images/user_music_1.jpg" alt="Music Stage" fill className="object-cover grayscale" />
            </div>
            <div className="relative h-full w-full">
               <Image src="/images/user_music_2.jpg" alt="Guitar Solo" fill className="object-cover grayscale" />
            </div>
            <div className="relative h-full w-full">
               <Image src="/images/user_music_3.jpg" alt="Band Perform" fill className="object-cover grayscale" />
            </div>
         </div>
         <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
         <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/60 to-transparent" />
      </div>

      {/* HERO SECTION */}
      <section id="home" className="relative h-screen flex flex-col justify-center items-center px-4 overflow-hidden z-10">
        
        {/* Hero Content */}
        <motion.div 
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative text-center px-4 max-w-5xl mx-auto flex flex-col items-center justify-center h-full"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 font-heading text-[var(--foreground)] tracking-tighter mix-blend-screen">
              {PORTFOLIO_DATA.identity.nama}
            </h1>
            
            <div className="flex flex-wrap justify-center gap-6 text-[var(--foreground)]/70 text-lg md:text-2xl font-light uppercase tracking-[0.3em] mt-4 mb-12">
              <span className="hover:text-[var(--color-medium)] transition-colors cursor-default">Web</span>
              <span className="opacity-30">•</span>
              <span className="hover:text-[var(--color-medium)] transition-colors cursor-default">Game</span>
              <span className="opacity-30">•</span>
              <span className="hover:text-[var(--color-medium)] transition-colors cursor-default">App</span>
              <span className="opacity-30">•</span>
              <span className="hover:text-[var(--color-medium)] transition-colors cursor-default">Music</span>
            </div>

            {/* SOCIALS - Minimalist &Centered */}
            <div className="flex justify-center gap-8 mt-12">
               <a href={PORTFOLIO_DATA.identity.social.github} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 text-[var(--foreground)]/50 hover:text-[var(--foreground)] transition-colors">
                 <div className="p-3 rounded-full border border-[var(--foreground)]/10 group-hover:border-[var(--foreground)]/50 group-hover:scale-110 transition-all duration-300">
                    <Github className="w-5 h-5" />
                 </div>
                 <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">Github</span>
               </a>
               <a href={PORTFOLIO_DATA.identity.social.instagram} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-2 text-[var(--foreground)]/50 hover:text-[var(--foreground)] transition-colors">
                 <div className="p-3 rounded-full border border-[var(--foreground)]/10 group-hover:border-[var(--foreground)]/50 group-hover:scale-110 transition-all duration-300">
                    <Instagram className="w-5 h-5" />
                 </div>
                 <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">Instagram</span>
               </a>
               <a href={`mailto:${PORTFOLIO_DATA.identity.email}`} className="group flex flex-col items-center gap-2 text-[var(--foreground)]/50 hover:text-[var(--foreground)] transition-colors">
                 <div className="p-3 rounded-full border border-[var(--foreground)]/10 group-hover:border-[var(--foreground)]/50 group-hover:scale-110 transition-all duration-300">
                    <Mail className="w-5 h-5" />
                 </div>
                 <span className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">Email</span>
               </a>
            </div>

          </motion.div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 z-10"
        >
          <ChevronDown className="w-8 h-8 text-[var(--foreground)]/30" />
        </motion.div>
      </section>

      {/* TECH MARQUEE */}
      <TechMarquee />

      {/* MAIN CONTENT WRAPPER */}
      <main className="relative z-20 max-w-6xl mx-auto px-6 pb-24 space-y-40">
        
        {/* IDENTITY SECTION - SPLIT LAYOUT WITH PHOTO */}
        <section id="about" className="pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold font-heading mb-12 flex items-center justify-center gap-3 text-white/90">
              <User className="text-[var(--color-medium)]" /> About Me
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-16 items-center">
              {/* Profile Photo - Left Side */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative group w-full md:col-span-2"
              >
                <div className="relative w-full aspect-square overflow-hidden bg-black/5">
                  <Image 
                    src="/images/profile5.jpg" 
                    alt="Agil Faqih Ijsam" 
                    fill 
                    className="object-contain grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  {/* Decorative Border */}
                  <div className="absolute inset-0 border-4 border-white/10 group-hover:border-white/30 transition-colors duration-500" />
                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/50 -translate-x-2 -translate-y-2" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/50 translate-x-2 translate-y-2" />
                </div>
              </motion.div>

              {/* Bio Text - Right Side */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="space-y-8 md:col-span-3"
              >
                <div className="border-l-4 border-white/30 pl-8">
                  <p className="text-lg md:text-xl leading-relaxed text-[var(--color-light)]/80 font-light">
                    {PORTFOLIO_DATA.identity.bio}
                  </p>
                </div>
                
                {/* Stats or Tags */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <span className="px-4 py-2 bg-white/5 border border-white/10 text-sm font-mono text-white/70 hover:bg-white/10 transition-colors">
                    Developer
                  </span>
                  <span className="px-4 py-2 bg-white/5 border border-white/10 text-sm font-mono text-white/70 hover:bg-white/10 transition-colors">
                    Musician
                  </span>
                  <span className="px-4 py-2 bg-white/5 border border-white/10 text-sm font-mono text-white/70 hover:bg-white/10 transition-colors">
                    Creator
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* JOURNEY SECTION - STICKY AESTHETIC LAYOUT */}
        <section id="journey" className="relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
             
             {/* Sticky Heading */}
             <div className="md:col-span-4 relative">
                <div className="md:sticky md:top-32 text-center md:text-right md:pr-12">
                  <h2 className="text-4xl md:text-6xl font-bold font-heading mb-4 text-[var(--foreground)] text-transparent bg-clip-text bg-gradient-to-b from-[var(--foreground)] to-[var(--foreground)]/10">
                    My<br/>Journey
                  </h2>
                  <div className="hidden md:block w-full h-[1px] bg-[var(--foreground)]/20 my-6" />
                  <p className="text-[var(--foreground)]/50 italic text-sm">
                    "Every step is a lesson, every milestone a memory."
                  </p>
                </div>
             </div>

             {/* Timeline Content */}
             <div className="md:col-span-8 space-y-24 relative border-l border-[var(--foreground)]/10 pl-8 md:pl-16 py-12">
                {PORTFOLIO_DATA.journey.map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative group"
                  >
                     {/* Timeline Node */}
                     <div className="absolute -left-[41px] md:-left-[73px] top-2 w-5 h-5 rounded-full bg-[var(--background)] border-4 border-[var(--color-medium)] z-10 group-hover:scale-125 transition-transform duration-300" />
                     
                     <div className="mb-2 flex items-center gap-4">
                        <span className="text-[var(--color-medium)] font-bold tracking-widest uppercase text-xs border border-[var(--color-medium)]/30 px-3 py-1 rounded-full">
                          {item.date}
                        </span>
                     </div>
                     
                     <h3 className="text-3xl font-bold text-[var(--foreground)] mb-2 group-hover:text-[var(--color-medium)] transition-colors">
                       {item.role}
                     </h3>
                     <h4 className="text-xl text-[var(--foreground)]/60 font-serif italic mb-6">
                       @ {item.company}
                     </h4>
                     
                     <p className="text-[var(--foreground)]/80 leading-relaxed text-lg font-light tracking-wide">
                        {item.description}
                     </p>
                  </motion.div>
                ))}
             </div>
          </div>
        </section>

        {/* PROJECTS SECTION - TABBED CATEGORIES */}
        <section id="projects">
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mb-12 text-center"
          >
             <h2 className="text-3xl md:text-5xl font-bold font-heading mb-8 border-b border-white/10 pb-4 inline-block">Featured Works</h2>
             
             {/* Category Tabs */}
             <div className="flex flex-wrap justify-center gap-2 mb-12">
               {categories.map((cat, idx) => (
                 <button
                   key={idx}
                   onClick={() => setActiveTab(cat)}
                   className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                     activeTab === cat 
                       ? "bg-white text-black border-white" 
                       : "bg-transparent text-white/50 border-white/10 hover:border-white/30 hover:text-white"
                   }`}
                 >
                   {cat}
                 </button>
               ))}
             </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project: any, index: number) => (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group relative h-72 md:h-96 bg-[var(--color-dark)] border border-white/10 hover:border-white/30 transition-colors overflow-hidden"
                >
                  <Image 
                    src={project.image} 
                    alt={project.title} 
                    fill 
                    className="object-cover opacity-60 group-hover:opacity-40 transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black via-black/60 to-transparent">
                     <div className="mb-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                       <span className="text-[var(--color-light)] text-[10px] font-bold tracking-widest uppercase border border-white/20 px-3 py-1 bg-black/50 backdrop-blur-sm">
                         {project.category}
                       </span>
                     </div>
                     <h3 className="text-2xl font-bold font-heading mb-2 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{project.title}</h3>
                     <p className="text-white/70 text-sm mb-6 line-clamp-2 font-mono translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200">{project.description}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section>
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mb-12 text-center"
          >
             <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 border-b border-white/10 pb-4 inline-block">What I Do</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PORTFOLIO_DATA.services.map((service: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 border border-white/10 bg-[var(--color-dark)]/50 hover:bg-[var(--color-dark)] transition-colors text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                  {index === 0 && <Code className="w-8 h-8 text-white" />}
                  {index === 1 && <Gamepad2 className="w-8 h-8 text-white" />}
                  {index === 2 && <Music className="w-8 h-8 text-white" />}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section>
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mb-12 text-center"
          >
             <h2 className="text-3xl md:text-5xl font-bold font-heading mb-4 border-b border-white/10 pb-4 inline-block">Appreciation</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {PORTFOLIO_DATA.testimonials.map((testimoni: any, index: number) => (
               <motion.div 
                 key={index}
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.1 }}
                 className="relative p-8 border border-white/5 bg-[var(--color-dark)]"
               >
                 <div className="text-4xl text-white/10 font-serif absolute top-4 left-4">“</div>
                 <p className="text-white/80 italic mb-6 relative z-10 font-light">"{testimoni.quote}"</p>
                 <div>
                   <div className="font-bold text-white">{testimoni.name}</div>
                   <div className="text-xs text-white/40 uppercase tracking-wider">{testimoni.role}</div>
                 </div>
               </motion.div>
             ))}
          </div>
        </section>

        {/* CONTACT CTA SECTION */}
        <section id="contact" className="py-20 border-t border-b border-white/5 relative overflow-hidden">
           <div className="absolute inset-0 bg-[var(--color-dark)]/30" />
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="relative z-10 text-center max-w-2xl mx-auto px-4"
           >
             <h2 className="text-4xl md:text-6xl font-bold font-heading mb-6 text-white">Let's Create Together</h2>
             <p className="text-white/60 mb-8 text-lg font-light">
               Tertarik berkolaborasi dalam proyek Game, Web, atau Musik? Jangan ragu untuk menghubungi saya.
             </p>
             <a 
               href="https://wa.me/6282124822008"
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
               </svg>
               Contact Me
             </a>
           </motion.div>
        </section>
      </main>
      
      <ChatWidget />
      <SpotifyWidget />
      <BottomNav />

      {/* FOOTER */}
      <footer className="relative z-20 border-t border-white/5 py-12 text-center text-white/20 text-xs font-mono uppercase tracking-widest">
        <p>&copy; 2026 Agil Faqih Ijsam.</p>
      </footer>
    </div>
  );
}
