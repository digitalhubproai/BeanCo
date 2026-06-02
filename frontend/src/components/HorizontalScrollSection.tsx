'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const coffeeJourney = [
  {
    title: "The Source",
    description: "Ethically sourced beans from high-altitude volcanic estates in Ethiopia and Colombia.",
    image: "https://images.unsplash.com/photo-1524350300060-d39f447a243b?auto=format&fit=crop&q=80&w=800",
    step: "01"
  },
  {
    title: "The Roast",
    description: "Micro-batch roasting at precise temperatures to unlock unique flavor profiles.",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800",
    step: "02"
  },
  {
    title: "The Grind",
    description: "Precision grinding calibrated daily to ensure the ultimate flavor profile in every cup.",
    image: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&q=80&w=800",
    step: "03"
  },
  {
    title: "The Brew",
    description: "Artisanal brewing techniques, from pour-overs to perfectly pulled espresso shots.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
    step: "04"
  },
  {
    title: "The Sip",
    description: "An elevated sensory experience served in a sanctuary designed for coffee purists.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800",
    step: "05"
  }
];

export default function HorizontalScrollSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;

    if (!section || !container) return;

    let ctx = gsap.context(() => {
      const totalWidth = container.scrollWidth - window.innerWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${container.scrollWidth}`,
        }
      });

      // 1. Move container horizontally
      tl.to(container, {
        x: -totalWidth,
        ease: "none",
      });

      // 2. Sync progress bar
      tl.to("#scroll-progress", {
        width: "100%",
        ease: "none",
      }, 0);

      // 3. Precise Staged Reveal for each slide
      const slides = gsap.utils.toArray('.journey-slide');
      slides.forEach((slide: any) => {
        const content = slide.querySelector('.slide-content');
        const img = slide.querySelector('img');
        
        // Timeline for the specific slide's state
        const slideTl = gsap.timeline({
            scrollTrigger: {
                trigger: slide,
                containerAnimation: tl,
                start: "left 70%", // Start revealing when slide enters from right
                end: "right 30%",  // Start hiding when slide exits to left
                scrub: true,
            }
        });

        // Entrance: Text slides up and image brightens
        slideTl.fromTo(content, 
            { y: 60, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 
            0
        );
        slideTl.to(img, { filter: "brightness(0.9)", duration: 1 }, 0);

        // Exit: Text fades out as it leaves the center
        slideTl.to(content, { y: -40, opacity: 0, duration: 1, ease: "power2.in" }, 2);
        slideTl.to(img, { filter: "brightness(0.3)", duration: 1 }, 2);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen min-h-[600px] bg-[#0a0604] overflow-hidden">
      
      {/* 1. Fixed Heading */}
      <div className="absolute top-10 left-10 md:left-20 z-30 pointer-events-none">
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-primary/60 mb-2 block">The Masterclass</span>
        <h2 className="text-3xl md:text-5xl font-black text-white serif-font tracking-tight uppercase leading-none">
          Coffee <span className="text-primary italic">Journey</span>
        </h2>
      </div>

      {/* 2. Horizontal Container */}
      <div ref={containerRef} className="flex h-full items-center pl-[15vw] pr-[30vw] gap-20 md:gap-40">
        {coffeeJourney.map((item, idx) => (
          <div key={idx} className="journey-slide flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] h-[55vh] md:h-[65vh] relative group">
            
            <div className="w-full h-full rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-white/5 relative z-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] bg-[#0c0806]">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-all duration-700 brightness-[0.3]"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 opacity-80" />
              
              <div className="slide-content absolute bottom-0 left-0 p-10 md:p-16 space-y-4 md:space-y-6 z-20 opacity-0">
                <div className="flex items-center gap-3">
                    <span className="w-10 h-px bg-primary" />
                    <span className="text-primary font-mono text-xs md:text-sm tracking-[0.4em] uppercase">{item.step}</span>
                </div>
                <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-none">{item.title}</h3>
                <p className="text-white/60 text-sm md:text-xl font-light max-w-lg leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Back Numbers */}
            <div className="absolute -top-20 -left-16 text-[22vw] font-black text-white/[0.01] select-none z-0">
              {item.step}
            </div>
          </div>
        ))}
        
        {/* End Card */}
        <div className="flex-shrink-0 w-[60vw] md:w-[35vw] flex flex-col justify-center space-y-10">
            <h3 className="text-5xl md:text-8xl font-black text-white leading-none uppercase tracking-tighter">The <br /><span className="text-primary italic serif-font">Legacy.</span></h3>
            <div className="w-16 h-px bg-primary/30" />
            <p className="text-white/30 text-sm md:text-base max-w-sm leading-relaxed font-light">Witness the culmination of craft in every drop. Join the circle of coffee purists.</p>
        </div>
      </div>
      
      {/* 3. Refined Progress bar */}
      <div className="absolute bottom-10 left-10 md:left-20 right-10 md:right-20 h-[2px] bg-white/5 rounded-full overflow-hidden z-20">
        <div 
          className="h-full bg-primary/40 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
          style={{ width: '0%' }}
          id="scroll-progress"
        />
      </div>
    </section>
  );
}
