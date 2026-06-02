'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const galleryImages = [
  {
    url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
    size: "md:col-span-2 md:row-span-2",
    speed: 0.15,
  },
  {
    url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800",
    size: "md:col-span-1 md:row-span-1",
    speed: 0.25,
  },
  {
    url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=800",
    size: "md:col-span-1 md:row-span-2",
    speed: 0.1,
  },
  {
    url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800",
    size: "md:col-span-1 md:row-span-1",
    speed: 0.3,
  },
  {
    url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800",
    size: "md:col-span-2 md:row-span-1",
    speed: 0.2,
  }
];

export default function ParallaxGallery() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.gallery-item');
      
      items.forEach((item: any) => {
        const speed = parseFloat(item.dataset.speed || "0.1");
        const img = item.querySelector('img');
        
        // Independent Parallax for each item
        gsap.to(item, {
          y: -100 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });

        // Subtle scale effect on the image inside
        gsap.to(img, {
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-[#0a0604] py-32 px-6 md:px-12 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-l border-primary/20 pl-8">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-primary/60">The Aesthetic</span>
            <h2 className="text-5xl md:text-8xl font-black text-white serif-font leading-none uppercase tracking-tighter">
                Visual <br /><span className="text-primary italic">Sanctuary</span>
            </h2>
          </div>
          <p className="text-white/30 text-sm max-w-xs leading-relaxed mb-2">
            A curated collection of moments captured in our space. Witness the intersection of design and craft.
          </p>
        </div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-10 auto-rows-[250px] md:auto-rows-[350px]">
          {galleryImages.map((img, idx) => (
            <div 
              key={idx}
              className={`gallery-item relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#120a06] group shadow-2xl ${img.size}`}
              data-speed={img.speed}
            >
              <img 
                src={img.url} 
                alt="" 
                className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
              
              {/* Corner Accent */}
              <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-white/20 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-white/20 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Decorative Quote */}
        <div className="pt-20 text-center">
            <p className="text-primary/40 font-mono text-[10px] tracking-[0.5em] uppercase italic">
                &mdash; Art is in the details &mdash;
            </p>
        </div>
      </div>
    </section>
  );
}
