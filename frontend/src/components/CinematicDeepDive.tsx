'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const zoomLayers = [
  {
    title: "The Raw Essence",
    highlight: "Raw Essence",
    subtitle: "Phase 01: Macro Inspection",
    desc: "Every bean tells a story of volcanic soil and high-altitude winds. We begin by inspecting the molecular integrity of our harvest.",
    stats: ["Temp: 22°C", "Moisture: 11.2%", "Grade: Specialty"],
    url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=1600",
    scale: 4,
  },
  {
    title: "The Liquid Mastery",
    highlight: "Liquid Mastery",
    subtitle: "Phase 02: Precision Extraction",
    desc: "A rhythmic fusion of pressure and temperature. Witness the extraction of pure liquid gold, calibrated to the micro-gram.",
    stats: ["Pressure: 9 Bar", "Yield: 18.5g", "Time: 27s"],
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=1600",
    scale: 1,
  },
  {
    title: "The Sanctuary Ritual",
    highlight: "Sanctuary Ritual",
    subtitle: "Phase 03: Final Presentation",
    desc: "The culmination of our craft. Served in a space designed for silence, clarity, and the ultimate sensory connection.",
    stats: ["Vibe: Serene", "Flow: Focused", "Standard: Elite"],
    url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1600",
    scale: 1,
  }
];

export default function CinematicDeepDive() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=400%",
          pin: true,
          scrub: 1,
        }
      });

      // Layer Transitions Logic
      tl.to(".layer-0", { scale: 1, duration: 2, ease: "power1.inOut" });
      tl.to(".layer-0", { opacity: 0, scale: 0.8, duration: 1 }, "+=0.5");
      tl.fromTo(".layer-1", { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1, duration: 2 }, "-=1");
      tl.to(".layer-1", { opacity: 0, scale: 0.8, duration: 1 }, "+=0.5");
      tl.fromTo(".layer-2", { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1, duration: 2 }, "-=1");

      // Enhanced Text and UI Animation for each layer
      zoomLayers.forEach((_, i) => {
        const textWrapper = `.content-${i}`;
        const titleChars = `.title-${i} .char`;
        const stats = `.stats-${i} div`;

        // Entrance
        tl.fromTo(titleChars, 
            { y: 100, opacity: 0, rotateX: -90 },
            { y: 0, opacity: 1, rotateX: 0, stagger: 0.05, duration: 1, ease: "back.out(1.7)" },
            i * 3.5 + 0.5
        );
        
        tl.fromTo(`.subtitle-${i}`, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8 }, "<0.2");
        tl.fromTo(`.desc-${i}`, { opacity: 0 }, { opacity: 1, duration: 1 }, "<0.4");
        tl.fromTo(stats, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, stagger: 0.1, duration: 0.8 }, "<0.5");

        // Exit
        tl.to(textWrapper, { opacity: 0, y: -50, duration: 0.8, filter: "blur(10px)" }, i * 3.5 + 3);
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="h-screen min-h-[600px] bg-[#0a0604] overflow-hidden relative">
      
      {/* HUD Background Decorations */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-20">
        <div className="absolute top-6 md:top-10 left-6 md:left-10 w-20 md:w-40 h-20 md:h-40 border-t border-l border-primary/40 rounded-tl-2xl md:rounded-tl-3xl" />
        <div className="absolute bottom-6 md:bottom-10 right-6 md:right-10 w-20 md:w-40 h-20 md:h-40 border-b border-r border-primary/40 rounded-br-2xl md:rounded-br-3xl" />
      </div>

      <div className="relative w-full h-full">
        {zoomLayers.map((layer, idx) => (
          <div 
            key={idx}
            className={`zoom-layer layer-${idx} absolute inset-0 w-full h-full overflow-hidden ${idx === 0 ? 'opacity-100' : 'opacity-0'}`}
          >
            <img 
              src={layer.url} 
              alt="" 
              className="w-full h-full object-cover origin-center brightness-50 md:brightness-40"
              style={{ transform: idx === 0 ? `scale(${layer.scale})` : 'scale(1.5)' }}
            />
            
            {/* Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90" />

            {/* Content for this layer */}
            <div className={`content-${idx} absolute inset-0 flex flex-col items-center justify-center z-30 px-6 md:px-12 text-center`}>
              
              <div className={`subtitle-${idx} flex items-center gap-3 md:gap-4 mb-4 md:mb-6 opacity-0`}>
                <span className="w-6 md:w-8 h-px bg-primary" />
                <span className="text-primary font-mono text-[8px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em]">{layer.subtitle}</span>
                <span className="w-6 md:w-8 h-px bg-primary" />
              </div>

              <h2 className={`title-${idx} text-3xl md:text-8xl lg:text-9xl font-black text-white serif-font tracking-tighter uppercase leading-[1] md:leading-[0.9] mb-6 md:mb-8 perspective-[1000px]`}>
                {layer.title.split(" ").map((word, wIdx) => (
                  <span key={wIdx} className="inline-block overflow-hidden mr-2 md:mr-4">
                    <span className={`char inline-block ${layer.highlight.includes(word) ? 'text-primary italic' : ''}`}>
                      {word}
                    </span>
                  </span>
                ))}
              </h2>

              <p className={`desc-${idx} text-white/50 text-xs md:text-lg max-w-2xl leading-relaxed font-light mb-8 md:mb-12 opacity-0 px-4`}>
                {layer.desc}
              </p>

              {/* Technical Stats UI */}
              <div className={`stats-${idx} flex flex-wrap justify-center gap-3 md:gap-6 opacity-0`}>
                {layer.stats.map((stat, sIdx) => (
                  <div key={sIdx} className="px-4 md:px-6 py-2 md:py-3 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-xl">
                    <span className="text-white/80 font-mono text-[8px] md:text-[10px] tracking-widest uppercase">{stat}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Atmospheric Particles */}
      <div className="absolute inset-0 z-40 pointer-events-none mix-blend-screen opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(212,175,55,0.05)_0%,_transparent_70%)] animate-pulse-slow" />
      </div>
    </section>
  );
}
