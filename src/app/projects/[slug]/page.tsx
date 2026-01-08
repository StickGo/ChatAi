"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import ChatWidget from "@/components/ChatWidget";

import { use } from "react";

export default function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const project = PORTFOLIO_DATA.projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--color-darkest)] text-white font-sans selection:bg-[var(--color-medium)] selection:text-white pb-24">
       <ChatWidget />
       
       <div className="max-w-4xl mx-auto px-6 pt-12">
          {/* BACK BUTTON */}
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group">
             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             Back to Portfolio
          </Link>

          {/* HEADER */}
          <div className="mb-12">
            <span className="text-[var(--color-medium)] font-bold tracking-widest uppercase text-sm mb-2 block">{project.category}</span>
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6">{project.title}</h1>
            <div className="flex flex-wrap gap-2">
               {project.stack.map((tech: string, i: number) => (
                 <span key={i} className="px-3 py-1 border border-white/20 rounded-full text-xs font-mono uppercase bg-white/5">
                   {tech}
                 </span>
               ))}
            </div>
          </div>

          {/* MAIN IMAGE */}
          <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden border border-white/10 mb-12 shadow-2xl bg-[var(--color-dark)]">
             <Image 
               src={project.image} 
               alt={project.title} 
               fill 
               className="object-cover"
               priority
             />
          </div>

          {/* CONTENT GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
             
             {/* LEFT: DESCRIPTION */}
             <div className="md:col-span-2 space-y-8">
                <div>
                   <h2 className="text-2xl font-bold mb-4 font-heading border-b border-white/10 pb-2">Overview</h2>
                   <p className="text-white/80 leading-relaxed text-lg font-light">
                      {project.description} 
                      {/* Extending dummy content slightly */}
                      {" "}Project ini dikerjakan dengan fokus pada user experience yang smooth dan visual yang menarik. Kami menggunakan pendekatan modern dalam development untuk memastikan skalabilitas dan performa yang optimal.
                   </p>
                </div>

                <div>
                   <h2 className="text-2xl font-bold mb-4 font-heading border-b border-white/10 pb-2 flex items-center gap-3">
                     <AlertTriangle className="text-[var(--color-medium)]" /> Key Challenges
                   </h2>
                   <p className="text-white/70 leading-relaxed">
                     {project.challenges}
                   </p>
                </div>
             </div>

             {/* RIGHT: FEATURES */}
             <div className="space-y-6">
                <div className="bg-[var(--color-dark)]/50 p-6 rounded-lg border border-white/5">
                   <h3 className="text-xl font-bold mb-4 font-heading mb-6">Key Features</h3>
                   <ul className="space-y-4">
                      {project.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex gap-3 items-start text-sm text-white/80">
                           <CheckCircle className="w-5 h-5 text-[var(--color-medium)] shrink-0" />
                           {feature}
                        </li>
                      ))}
                   </ul>
                </div>
             </div>

          </div>

       </div>
    </div>
  );
}
