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
  GraduationCap,
  MapPin
} from "lucide-react";
import dynamic from 'next/dynamic';
import BottomNav from "@/components/BottomNav";
import { PORTFOLIO_DATA } from "@/data/portfolio";

const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false });
const SpotifyWidget = dynamic(() => import('@/components/SpotifyWidget'), { ssr: false });
const TechMarquee = dynamic(() => import('@/components/TechMarquee'));

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
         <div className="absolute inset-0 grid grid-cols-3 opacity-100">
            <div className="relative h-full w-full">
               <Image 
                 src="/images/user_music_1.jpg" 
                 alt="Music Stage" 
                 fill 
                 priority
                 quality={25}
                 sizes="(max-width: 768px) 33vw, 33vw"
                 className="object-cover grayscale" 
               />
            </div>
            <div className="relative h-full w-full">
               <Image 
                 src="/images/user_music_2.jpg" 
                 alt="Guitar Solo" 
                 fill 
                 priority
                 quality={25}
                 sizes="(max-width: 768px) 33vw, 33vw"
                 className="object-cover grayscale" 
               />
            </div>
            <div className="relative h-full w-full">
               <Image 
                 src="/images/user_music_3.jpg" 
                 alt="Band Perform" 
                 fill 
                 priority
                 quality={25}
                 sizes="(max-width: 768px) 33vw, 33vw"
                 className="object-cover grayscale" 
               />
            </div>
         </div>
         <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
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
              <span className="hover:text-[var(--color-medium)] transition-colors cursor-default text-white/80">Web</span>
              <span className="text-white/50">•</span>
              <span className="hover:text-[var(--color-medium)] transition-colors cursor-default text-white/80">Game</span>
              <span className="text-white/50">•</span>
              <span className="hover:text-[var(--color-medium)] transition-colors cursor-default text-white/80">App</span>
              <span className="text-white/50">•</span>
              <span className="hover:text-[var(--color-medium)] transition-colors cursor-default text-white/80">Music</span>
            </div>

            {/* SOCIALS - Minimalist &Centered */}
            <div className="flex justify-center gap-8 mt-12">
               <a 
                 href={PORTFOLIO_DATA.identity.social.github} 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="group flex flex-col items-center gap-2 text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors"
                 aria-label="GitHub Profile"
               >
                 <div className="p-3 rounded-full border border-[var(--foreground)]/10 group-hover:border-[var(--foreground)]/50 group-hover:scale-110 transition-all duration-300">
                    <Github className="w-5 h-5" />
                 </div>
               </a>
               <a 
                 href={PORTFOLIO_DATA.identity.social.instagram} 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="group flex flex-col items-center gap-2 text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors"
                 aria-label="Instagram Profile"
               >
                 <div className="p-3 rounded-full border border-[var(--foreground)]/10 group-hover:border-[var(--foreground)]/50 group-hover:scale-110 transition-all duration-300">
                    <Instagram className="w-5 h-5" />
                 </div>
               </a>
               <a 
                 href={`mailto:${PORTFOLIO_DATA.identity.email}`} 
                 className="group flex flex-col items-center gap-2 text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors"
                 aria-label="Email Contact"
               >
                 <div className="p-3 rounded-full border border-[var(--foreground)]/10 group-hover:border-[var(--foreground)]/50 group-hover:scale-110 transition-all duration-300">
                    <Mail className="w-5 h-5" />
                 </div>
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
                <div className="relative w-full aspect-square overflow-hidden bg-white/5 rounded-2xl">
                  <Image 
                    src="/images/profile5.jpg" 
                    alt="Agil Faqih Ijsam" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-contain grayscale md:group-hover:grayscale-0 transition-all duration-700"
                  />
                  {/* Decorative Border */}
                  <div className="absolute inset-0 border-2 border-white/10 md:group-hover:border-white/20 transition-colors duration-500 rounded-2xl" />
                  {/* Corner Accents - Minimalist */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/20" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/20" />
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
                   <p className="text-lg md:text-xl leading-relaxed text-zinc-300 font-light">
                     {PORTFOLIO_DATA.identity.bio}
                   </p>
                </div>
                
                {/* Stats or Tags */}
                <div className="flex flex-wrap gap-3 pt-4">
                   <span className="px-4 py-2 bg-white/5 border border-white/10 text-sm font-mono text-zinc-300 hover:bg-white/10 transition-colors">
                     Developer
                   </span>
                   <span className="px-4 py-2 bg-white/5 border border-white/10 text-sm font-mono text-zinc-300 hover:bg-white/10 transition-colors">
                     Musician
                   </span>
                   <span className="px-4 py-2 bg-white/5 border border-white/10 text-sm font-mono text-zinc-300 hover:bg-white/10 transition-colors">
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
                   <p className="text-zinc-400 italic text-sm">
                     "Every step is a lesson, every milestone a memory."
                   </p>
                </div>
             </div>

             {/* Timeline Content */}
             <div className="md:col-span-8 space-y-24 relative pl-8 md:pl-16 py-12">
                {/* Vertical Line with Progress */}
                <div className="absolute left-0 md:left-4 top-0 bottom-0 w-[2px] bg-white/5 overflow-hidden">
                  <motion.div 
                    className="absolute top-0 left-0 right-0 bg-gradient-to-b from-transparent via-[var(--color-medium)] to-[var(--color-medium)] origin-top h-full"
                    style={{ scaleY: scrollY }}
                  />
                </div>

                {PORTFOLIO_DATA.journey.map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative group"
                  >
                     {/* Timeline Node with Glow */}
                     <div className="absolute -left-[41px] md:-left-[57px] top-2 z-10">
                        <div className="w-5 h-5 rounded-full bg-[var(--background)] border-4 border-white/20 group-hover:border-[var(--color-medium)] transition-all duration-500 relative">
                           <div className="absolute inset-0 rounded-full bg-[var(--color-medium)] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500" />
                           <div className="absolute inset-0 rounded-full bg-[var(--color-medium)] scale-0 group-hover:scale-100 transition-transform duration-500" />
                        </div>
                     </div>
                     
                     <div className="mb-2 flex items-center gap-4">
                        <span className="text-[var(--color-medium)] font-bold tracking-widest uppercase text-[10px] border border-[var(--color-medium)]/30 px-3 py-1 rounded-full bg-[var(--color-medium)]/5">
                          {item.date}
                        </span>
                     </div>
                     
                     <h3 className="text-3xl font-bold text-white mb-2 group-hover:tracking-wider transition-all duration-500">
                       {item.role}
                     </h3>
                      <h4 className="text-xl text-zinc-400 font-serif italic mb-6">
                       @ {item.company}
                     </h4>
                     
                     <p className="text-zinc-300 leading-relaxed text-lg font-light tracking-wide max-w-2xl">
                        {item.description}
                     </p>
                  </motion.div>
                ))}
             </div>
          </div>
        </section>

        {/* PROJECTS SECTION - TABBED CATEGORIES */}
        <section id="projects" className="relative">
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mb-16 text-center"
          >
             <h2 className="text-4xl md:text-7xl font-bold font-heading mb-4 text-white tracking-tighter">Featured Works</h2>
             <div className="w-24 h-1 bg-[var(--color-medium)] mx-auto mb-10" />
             
             {/* Category Tabs */}
             <div className="flex flex-wrap justify-center gap-4 mb-12">
               {categories.map((cat, idx) => (
                 <button
                   key={idx}
                   onClick={() => setActiveTab(cat)}
                   className={`px-6 py-2 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-500 border ${
                     activeTab === cat 
                       ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
                       : "bg-transparent text-zinc-400 border-white/10 hover:border-white/20 hover:text-white"
                   }`}
                 >
                   {cat}
                 </button>
               ))}
             </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project: any, index: number) => (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative aspect-[4/3] md:aspect-video bg-[var(--color-dark)] border border-white/5 hover:border-white/20 transition-all duration-700 overflow-hidden cursor-pointer"
                >
                  <Link href={`/projects/${project.slug}`}>
                    <Image 
                      src={project.image} 
                      alt={project.title} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover opacity-100 md:opacity-50 md:group-hover:opacity-100 transition-all duration-1000 md:grayscale md:group-hover:grayscale-0 md:group-hover:scale-105" 
                    />
                    
                    {/* Overlay with Content */}
                    <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end bg-gradient-to-t from-black via-black/60 to-transparent md:via-black/40 md:group-hover:via-black/20 transition-all duration-700">
                       <div className="translate-y-0 md:translate-y-8 md:group-hover:translate-y-0 transition-transform duration-700">
                         <div className="mb-4">
                           <span className="text-[var(--color-medium)] text-[10px] font-bold tracking-widest uppercase px-3 py-1 bg-[var(--color-medium)]/10 border border-[var(--color-medium)]/30 backdrop-blur-sm rounded-sm">
                             {project.category}
                           </span>
                         </div>
                         <h3 className="text-2xl md:text-4xl font-bold font-heading mb-3 text-white">
                           {project.title}
                         </h3>
                          <p className="text-zinc-300 md:text-white/80 text-xs md:text-base mb-4 md:mb-6 line-clamp-2 md:line-clamp-none font-light tracking-wide max-w-md opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 delay-100 italic">
                            {project.description}
                          </p>
                         
                         {/* View Project Indicator */}
                         <div className="flex items-center gap-2 text-white group-hover:text-white transition-colors duration-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-100 md:opacity-0 md:group-hover:opacity-100 transform translate-x-0 md:translate-x-4 md:group-hover:translate-x-0 delay-200">
                           <span>Lihat Detail</span>
                           <ExternalLink className="w-3 md:w-4 h-3 md:h-4" />
                         </div>
                       </div>
                    </div>

                    {/* Decorative Corner */}
                    <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-white/0 group-hover:border-white/20 transition-all duration-700 delay-300" />
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section className="relative">
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="mb-16 text-center"
          >
             <h2 className="text-4xl md:text-6xl font-bold font-heading mb-4 text-white">Expertise</h2>
             <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest">Solutions I provide</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PORTFOLIO_DATA.services.map((service: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-10 border border-white/5 bg-[var(--color-dark)]/50 hover:bg-[var(--color-dark)] transition-all duration-500 overflow-hidden"
              >
                {/* Background Number Accent */}
                <div className="absolute -top-4 -right-4 text-8xl font-black text-white/5 group-hover:text-white/10 transition-colors pointer-events-none">
                  0{index + 1}
                </div>

                <div className="w-14 h-14 mb-8 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-[var(--color-medium)] group-hover:text-black transition-all duration-500 rotate-3 group-hover:rotate-0">
                  {index === 0 && <Code className="w-7 h-7" />}
                  {index === 1 && <Gamepad2 className="w-7 h-7" />}
                  {index === 2 && <Music className="w-7 h-7" />}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[var(--color-medium)] transition-colors">{service.title}</h3>
                <p className="text-zinc-300 text-base leading-relaxed font-light">{service.description}</p>
                
                {/* Hover Line */}
                <div className="absolute bottom-0 left-0 h-1 bg-[var(--color-medium)] w-0 group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="relative">
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="mb-16 text-center"
          >
             <h2 className="text-4xl md:text-6xl font-bold font-heading mb-4 text-white tracking-tight">Kind Words</h2>
             <div className="flex justify-center gap-2">
                {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-[var(--color-medium)]/30" />)}
             </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {PORTFOLIO_DATA.testimonials.map((testimoni: any, index: number) => (
               <motion.div 
                 key={index}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: index * 0.1 }}
                 className="relative p-10 border border-white/5 bg-[var(--color-dark)] hover:border-white/10 transition-colors group"
               >
                 <div className="text-6xl text-[var(--color-medium)] opacity-20 font-serif absolute top-4 left-6 group-hover:opacity-40 transition-opacity">“</div>
                  <p className="text-zinc-300 italic mb-8 relative z-10 font-light text-lg leading-relaxed">
                    {testimoni.quote}
                  </p>
                 <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                   <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-white/50 border border-white/10 group-hover:bg-[var(--color-medium)] group-hover:text-black transition-colors">
                     {testimoni.name.charAt(0)}
                   </div>
                   <div>
                     <div className="font-bold text-white text-sm tracking-wide">{testimoni.name}</div>
                      <div className="text-[10px] text-zinc-400 uppercase tracking-[0.2em]">{testimoni.role}</div>
                   </div>
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
               <div className="flex flex-col items-center gap-12 mt-12">
                <p className="text-zinc-200 text-lg font-light max-w-lg mx-auto">
                  Tertarik berkolaborasi dalam proyek Game, Web, atau Musik? Jangan ragu untuk menghubungi saya.
                </p>

                <div className="flex flex-col items-center gap-6">
                  <a 
                    href="https://wa.me/6282124822008"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center gap-4 px-12 py-5 bg-white text-black font-bold tracking-[0.2em] uppercase hover:bg-[var(--color-medium)] hover:text-black transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span>Contact Me</span>
                  </a>

                  {/* Redesigned Domicile Badge - Compact & Horizontal */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-4 px-5 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full mb-12"
                  >
                    <div className="flex items-center gap-2 pr-3 border-r border-white/10">
                      <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DB954] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1DB954]"></span>
                      </div>
                      <span className="text-[10px] font-mono text-[#1DB954] uppercase tracking-widest font-bold">Online</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-white/50" />
                      <span className="text-[11px] font-bold text-white uppercase tracking-widest">Bandung, Indonesia</span>
                    </div>
                  </motion.div>
                </div>
              </div>
           </motion.div>
        </section>
      </main>
      
      <ChatWidget />
      <SpotifyWidget />
      <BottomNav />

      {/* FOOTER */}
      <footer className="relative z-20 border-t border-white/5 py-12 text-center text-zinc-400 text-xs font-mono uppercase tracking-widest">
        <p>&copy; 2026 Agil Faqih Ijsam.</p>
      </footer>
    </div>
  );
}
