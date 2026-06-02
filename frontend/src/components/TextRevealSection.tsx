'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TextRevealSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    // Split text into words for granular control
    const textElement = container.querySelector('h2');
    if (textElement) {
      const words = textElement.innerText.split(" ");
      textElement.innerHTML = words.map(word => 
        `<span class="word-reveal inline-block mr-[0.2em] transition-colors duration-500">${word}</span>`
      ).join("");
    }

    let ctx = gsap.context(() => {
      const words = gsap.utils.toArray('.word-reveal');
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 0.5,
        }
      });

      // Cinematic Intro: Text starts small, blurred and dark
      tl.from(words, {
        opacity: 0,
        y: 100,
        scale: 0.8,
        filter: "blur(20px)",
        rotateX: -45,
        stagger: 0.1,
        duration: 2,
        ease: "power2.out"
      });

      // Highlight Effect: A golden light sweeps through the words
      words.forEach((word: any, i) => {
        tl.to(word, {
          color: "#d4af37", // Primary Gold
          textShadow: "0 0 30px rgba(212,175,55,0.5)",
          scale: 1.1,
          duration: 0.5,
        }, i * 0.1 + 1); // Offset to start after they appear

        tl.to(word, {
          color: "#ffffff",
          textShadow: "0 0 0px rgba(212,175,55,0)",
          scale: 1,
          duration: 0.5,
        }, i * 0.1 + 1.5);
      });

      // Final State: Text zooms in and fades out elegantly
      tl.to(container, {
        scale: 1.2,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1,
      }, "+=0.5");

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="h-screen bg-[#0a0604] flex items-center justify-center overflow-hidden relative">
      
      {/* Background Ambient Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[150px] animate-pulse-slow" />
      </div>

      <div ref={containerRef} className="relative z-10 max-w-6xl px-6 md:px-20 text-center perspective-[1000px]">
        <h2 className="text-2xl md:text-6xl lg:text-7xl font-bold serif-font leading-[1.3] md:leading-[1.15] text-white tracking-tighter">
          We believe that coffee is more than just a morning routine. It's a meticulous craft, a sensory journey, and a moment of pure clarity in a chaotic world.
        </h2>
        
        {/* Subtle Decorative Line */}
        <div className="mt-10 md:mt-16 flex items-center justify-center gap-4">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary/30" />
          <div className="w-2 h-2 rounded-full border border-primary/30" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary/30" />
        </div>
      </div>
    </section>
  );
}
