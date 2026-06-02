'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Coffee, ArrowRight, Star, Heart, CheckCircle2, ChevronRight, Award, Compass, Sparkles, TrendingUp, Users, Trophy, Leaf } from 'lucide-react';
import { useStore } from '@/store/useStore';
import ParticleBackground from '@/components/ParticleBackground';
import HorizontalScrollSection from '@/components/HorizontalScrollSection';
import TextRevealSection from '@/components/TextRevealSection';
import ParallaxGallery from '@/components/ParallaxGallery';
import CinematicDeepDive from '@/components/CinematicDeepDive';
import { useCounterAnimation } from '@/hooks/useScrollAnimation';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

// Stats counter component
function StatCounter({ end, suffix, label, icon: Icon }: { end: number; suffix: string; label: string; icon: React.ElementType }) {
  const { count, ref } = useCounterAnimation(end, 2500);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="stat-card glass-card rounded-2xl p-8 text-center group hover:border-primary/40 transition-all duration-500">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-4xl md:text-5xl font-black text-foreground mb-2">
        <span className="counter-value">{count.toLocaleString()}</span>
        <span className="text-primary">{suffix}</span>
      </div>
      <p className="text-xs text-muted-foreground font-light uppercase tracking-widest">{label}</p>
    </div>
  );
}

export default function Home() {
  const [featured, setFeatured] = useState<MenuItem[]>([]);
  const addToCart = useStore((state) => state.addToCart);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/menu/')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFeatured(data.slice(0, 3));
        }
      })
      .catch((err) => {
        setFeatured([
          {
            id: 1,
            name: "Signature Gold Espresso",
            description: "A luxury micro-batch espresso extract highlighting notes of velvety dark cacao, orange blossom, and a toasted hazelnut finish.",
            price: 6.50,
            category: "Coffee",
            image_url: "https://images.unsplash.com/photo-1510972527409-cef6e4a4d6f2?auto=format&fit=crop&q=80&w=400"
          },
          {
            id: 2,
            name: "Velvet Ristretto Flat White",
            description: "Rich, double-pulled ristretto extraction served with hand-textured organic oat microfoam at a perfect 140°F.",
            price: 7.20,
            category: "Coffee",
            image_url: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=400"
          },
          {
            id: 3,
            name: "Pistachio Praline Croissant",
            description: "Flaky, twice-baked house pastry featuring stone-ground Sicilian pistachio praline and a light dusting of sea salt sugar.",
            price: 8.50,
            category: "Bakery",
            image_url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400"
          }
        ]);
      });
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = sectionRef.current?.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [featured]);

  const [slideIdx, setSlideIdx] = useState(0);
  const [slideDir, setSlideDir] = useState(1);
  const [tIdx, setTIdx] = useState(0);

  const testimonials = [
    {
      name: "Victoria Sterling", role: "Coffee Connoisseur",
      comment: "The Gold Espresso is pure liquid velvet. The complexity of flavors they pull is equivalent to high-end wine tastings. The seat reservation lets me block my favorite window table easily.",
      rating: 5, img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Harrison Vance", role: "Design Director",
      comment: "The aesthetic of the cafe, the precision of extraction, and the digital reservation flow reflect sheer craftsmanship. A world-class standard.",
      rating: 5, img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Alister Crawford", role: "Gastronomy Writer",
      comment: "Exceptional beans, precise micro-roasts, and a warm interior atmosphere. It's not just a coffee shop; it's a sensory sanctuary.",
      rating: 5, img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=600"
    },
    {
      name: "Maya Chen", role: "Michelin Pastry Chef",
      comment: "The pistachio praline croissant paired with their single-origin Ethiopian pour-over is a combination that rivals any three-Michelin-star dessert experience.",
      rating: 5, img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=600"
    }
  ];

  const slides = [
    {
      img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=85&w=1920",
      badge: "The Fine Art of Specialty Coffee",
      heading: ["Pure Craft.", "Elevated Sip."],
      desc: "Micro-roastery and immersive lounge for coffee purists. Single-origins sourced ethically from high-altitude volcanic estates.",
      tags: ["Ethically Sourced", "Micro-Batch Roasted", "Direct Trade"]
    },
    {
      img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=85&w=1920",
      badge: "Direct-Trade Sourcing",
      heading: ["Single Origins.", "Singular Taste."],
      desc: "We travel to volcanic highlands across Ethiopia and Colombia, forging direct relationships with growers who share our obsession with quality.",
      tags: ["Ethiopia Yirgacheffe", "Colombia Huila", "Single Estate"]
    },
    {
      img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=85&w=1920",
      badge: "The Salon Experience",
      heading: ["An Immersive.", "Coffee Lounge."],
      desc: "Espresso counter, pour-over lab, and reserved salon seating. An evening of precision-crafted brew and elevated conversation awaits.",
      tags: ["Reserve Your Seat", "Sommelier Service", "Open Late"]
    }
  ];

  const goTo = useCallback((i: number) => {
    setSlideDir(i > slideIdx ? 1 : -1);
    setSlideIdx(i);
  }, [slideIdx]);

  const prev = useCallback(() => {
    setSlideDir(-1);
    setSlideIdx((p) => (p === 0 ? slides.length - 1 : p - 1));
  }, []);

  const next = useCallback(() => {
    setSlideDir(1);
    setSlideIdx((p) => (p + 1) % slides.length);
  }, []);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  useEffect(() => {
    const t = setInterval(() => setTIdx((p) => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next]);

  return (
    <div ref={sectionRef} className="space-y-24 pb-0 overflow-hidden">
      
      {/* 1. Hero — BG Slider + Right Side Numbers */}
      <section className="relative min-h-screen overflow-hidden bg-[#0a0604]">
        
        <ParticleBackground />

        {/* Cinematic background image slider — Ken Burns + dissolve */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${slideIdx}`}
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Ken Burns slow zoom layer */}
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.15 }}
              animate={{ scale: 1.05 }}
              transition={{ duration: 8, ease: 'linear' }}
            >
              <img src={slides[slideIdx].img} alt="" className="w-full h-full object-cover" />
            </motion.div>
            
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0604] via-[#0a0604]/80 to-[#0a0604]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0604] via-transparent to-black/10" />
            
            {/* Cinematic light sweep during transition */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ x: '-100%', opacity: 0.4 }}
              animate={{ x: '200%', opacity: 0 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.03) 30%, rgba(212,175,55,0.06) 50%, rgba(212,175,55,0.03) 70%, transparent 100%)',
              }}
            />

            {/* Subtle film grain overlay */}
            <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '256px 256px' }} />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 h-screen grid grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto px-8 lg:px-16">
          
          {/* Left — Text with zoom-in animation */}
          <div className="lg:col-span-7 flex items-center">
            <div className="w-full py-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`c-${slideIdx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
                    className="inline-flex items-center gap-2.5 bg-white/[0.04] backdrop-blur-md border border-white/[0.06] px-4 py-2 rounded-full mb-10"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/80">
                      {slides[slideIdx].badge}
                    </span>
                  </motion.div>

                  {/* Heading */}
                  <h1 className="serif-font text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5, y: 40 }}
                      animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
                      className="block"
                    >
                      {slides[slideIdx].heading[0]}
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5, y: 40 }}
                      animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
                      className="block text-primary"
                    >
                      {slides[slideIdx].heading[1]}
                    </motion.span>
                  </h1>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: 0.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
                    className="text-sm sm:text-base text-white/60 max-w-lg font-light leading-relaxed mb-8"
                  >
                    {slides[slideIdx].desc}
                  </motion.p>

                  {/* Tags */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.6, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
                    className="flex flex-wrap gap-2 mb-12"
                  >
                    {slides[slideIdx].tags.map((t) => (
                      <span key={t} className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/40 border border-white/10 rounded-full px-3.5 py-1.5">
                        {t}
                      </span>
                    ))}
                  </motion.div>

                  {/* Buttons */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1, transition: { delay: 0.75, duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
                    className="flex flex-col sm:flex-row items-center gap-4"
                  >
                    <Link 
                      href="/reserve"
                      className="group w-full sm:w-auto px-10 py-4.5 bg-primary text-[#0a0604] font-bold rounded-full hover:bg-primary/90 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2.5 text-sm uppercase tracking-wider"
                    >
                      <span>Reserve a Table</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <Link 
                      href="/menu"
                      className="w-full sm:w-auto px-10 py-4.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white font-bold rounded-full transition-all duration-300 flex items-center justify-center text-sm uppercase tracking-wider"
                    >
                      Browse Menu
                    </Link>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right — Cinematic Number Display */}
          <div className="lg:col-span-5 hidden lg:flex items-center justify-end relative overflow-hidden pr-4">
            <div className="relative flex flex-col items-center">
              
              {/* Large animated backdrop number */}
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`bg-${slideIdx}`}
                    className="font-mono font-black leading-none select-none"
                    initial={{ opacity: 0, scale: 1.5, y: 80, rotateX: 45 }}
                    animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: -80, rotateX: -45 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      fontSize: 'clamp(8rem, 25vw, 16rem)',
                      background: 'linear-gradient(180deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.03) 50%, transparent 80%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      perspective: '500px',
                    }}
                  >
                    {String(slideIdx + 1).padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Golden compass ring */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Outer fixed ring */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256">
                  <circle cx="128" cy="128" r="120" fill="none" stroke="rgba(212,175,55,0.04)" strokeWidth="0.5" />
                  <circle cx="128" cy="128" r="110" fill="none" stroke="rgba(212,175,55,0.02)" strokeWidth="0.5" strokeDasharray="2 4" />
                </svg>

                {/* Animated arc progress */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 256 256">
                  <circle cx="128" cy="128" r="115" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="2" />
                  <motion.circle
                    cx="128" cy="128" r="115" fill="none"
                    stroke="url(#goldGrad)" strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 115}`}
                    animate={{ strokeDashoffset: 2 * Math.PI * 115 * (1 - (slideIdx + 1) / slides.length) }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <defs>
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(212,175,55,0.3)" />
                      <stop offset="100%" stopColor="rgba(212,175,55,0.05)" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center number with flip animation */}
                <div className="relative z-10 w-32 h-32 flex items-center justify-center perspective-[800px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`n-${slideIdx}`}
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ rotateY: 90, opacity: 0, scale: 0.5 }}
                      animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                      exit={{ rotateY: -90, opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <span className="font-mono font-black text-6xl text-white drop-shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                        {String(slideIdx + 1).padStart(2, '0')}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Orbiting slide dots */}
                {slides.map((_, i) => {
                  const angle = (i / slides.length) * 360 - 90;
                  const rad = (angle * Math.PI) / 180;
                  const r = 115;
                  const x = 128 + r * Math.cos(rad);
                  const y = 128 + r * Math.sin(rad);
                  return (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className="absolute z-20"
                      style={{ left: `${(x / 256) * 100}%`, top: `${(y / 256) * 100}%`, transform: 'translate(-50%, -50%)' }}
                    >
                      <motion.span
                        className={`block rounded-full transition-all duration-500 ${
                          i === slideIdx
                            ? 'w-3 h-3 bg-primary shadow-lg shadow-primary/40'
                            : 'w-1.5 h-1.5 bg-white/[0.08] hover:bg-white/30'
                        }`}
                        animate={i === slideIdx ? { scale: [1, 1.3, 1] } : {}}
                        transition={{ duration: 2, repeat: i === slideIdx ? Infinity : 0 }}
                      />
                    </button>
                  );
                })}

                {/* Floating decorative markers */}
                <div className="absolute inset-0 pointer-events-none">
                  {[0, 90, 180, 270].map((a) => (
                    <div
                      key={a}
                      className="absolute top-0 left-1/2 w-[1px] h-3 origin-bottom"
                      style={{ transform: `translateX(-50%) rotate(${a}deg)`, background: 'linear-gradient(to top, rgba(212,175,55,0.1), transparent)' }}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom navigation strip */}
              <div className="relative z-10 mt-6 flex items-center gap-4">
                <button
                  onClick={prev}
                  className="w-8 h-8 rounded-full border border-white/[0.06] hover:border-primary/30 hover:bg-primary/5 flex items-center justify-center transition-all duration-300 group"
                  aria-label="Previous slide"
                >
                  <ArrowRight className="w-3 h-3 text-white/20 group-hover:text-primary rotate-180 transition-colors" />
                </button>

                <div className="flex items-center gap-3">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className="group relative"
                    >
                      <span className={`text-[11px] font-mono font-bold transition-all duration-500 block ${
                        i === slideIdx ? 'text-primary scale-110' : 'text-white/[0.05] hover:text-white/30'
                      }`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[7px] font-bold uppercase tracking-[0.2em] text-primary/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {slides[i].heading[1].replace('.', '')}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={next}
                  className="w-8 h-8 rounded-full border border-white/[0.06] hover:border-primary/30 hover:bg-primary/5 flex items-center justify-center transition-all duration-300 group"
                  aria-label="Next slide"
                >
                  <ArrowRight className="w-3 h-3 text-white/20 group-hover:text-primary transition-colors" />
                </button>
              </div>

              {/* Keyboard hint */}
              <div className="relative z-10 mt-4 flex items-center gap-2 text-[7px] font-bold uppercase tracking-[0.3em] text-white/[0.03]">
                <span>←</span>
                <span>Key</span>
                <span>→</span>
              </div>
            </div>
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
          <span className="text-[7px] font-bold uppercase tracking-[0.3em] text-white/10">Scroll</span>
          <div className="w-px h-6 bg-gradient-to-b from-white/10 to-transparent" />
        </div>
      </section>

      {/* NEW: Text Reveal Section */}
      <TextRevealSection />

      {/* 2. Stats Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          <StatCounter end={12500} suffix="+" label="Cups Served" icon={Coffee} />
          <StatCounter end={47} suffix="" label="Single Origins" icon={Leaf} />
          <StatCounter end={15} suffix="" label="Awards" icon={Trophy} />
          <StatCounter end={98} suffix="%" label="Rating" icon={Star} />
        </div>
      </section>


      {/* 3. Premium Grid Showcases */}
      <section className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 reveal">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Curated Exclusives
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-foreground">Sourced with Conviction</h2>
          </div>
          <Link href="/menu" className="group flex items-center space-x-2 text-primary font-bold hover:underline transition-all">
            <span>View Full Collection</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Luxury Featured Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((item, idx) => (
            <div 
              key={item.id} 
              className={`reveal premium-card rounded-3xl overflow-hidden flex flex-col group stagger-${idx + 1}`}
            >
              {/* Luxury Image Aspect */}
              <div className="h-68 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <span className="absolute top-4 right-4 bg-primary/20 backdrop-blur-md border border-primary/40 text-primary text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full z-20">
                  {item.category}
                </span>
              </div>

              {/* Information Area */}
              <div className="p-8 flex-grow flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-2xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">{item.name}</h3>
                    <span className="font-extrabold text-foreground tracking-wider pl-4">${item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-light">{item.description}</p>
                </div>
                
                <button 
                  onClick={() => addToCart({ id: item.id, name: item.name, price: item.price })}
                  className="w-full bg-secondary/80 hover:bg-primary hover:text-primary-foreground text-secondary-foreground font-bold py-4 px-4 rounded-2xl transition-all duration-300 text-xs uppercase tracking-wider ripple-container"
                >
                  Acquire / Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEW: Horizontal Scroll Journey */}
      <HorizontalScrollSection />

      {/* 4. High-End Editorial Presentation */}
      <section className="bg-gradient-to-r from-[#120a06] to-[#080504] text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] bg-cover bg-center pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=800')" }} />
        
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center">
          
          <div className="lg:col-span-7 space-y-6 md:space-y-8 reveal-left">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              <Award className="w-4 h-4" /> Sourcing Philosophy
            </span>
            
            <h2 className="text-3xl md:text-6xl font-black leading-[1.1] tracking-tight">
              Micro-Roastings <br />
              <span className="text-primary font-normal italic font-serif">of Singular Terroir</span>
            </h2>
            
            <p className="text-[#fcf9f6]/70 text-sm md:text-base leading-relaxed font-light max-w-2xl">
              We operate exclusively through Direct-Trade micro-purchases. By buying coffee cherries directly from volcanic cooperatives at up to 400% fair-trade minimums, we fund agricultural infrastructure while guaranteeing our patrons access to beans of exceptional density, sweetness, and floral expression.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-4">
              {[
                { title: "Direct Sourcing", desc: "No middle-agents, direct high-altitude estate contracts." },
                { title: "Micro-Batch Roasting", desc: "Monitored roasting profiles to bring out natural terroirs." },
                { title: "Sensory Calibration", desc: "Each extraction measured using state of the art refractometers." },
                { title: "Sustainable Packaging", desc: "Biodegradable, nitrogen-sealed bags preserving essential oils." }
              ].map((item, idx) => (
                <div key={idx} className={`flex space-x-3 items-start reveal stagger-${idx + 1}`}>
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-xs md:text-sm">{item.title}</h4>
                    <p className="text-[10px] md:text-xs text-white/50 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 h-[300px] md:h-[480px] rounded-3xl overflow-hidden border border-primary/20 shadow-2xl relative reveal-right">
            <img 
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800" 
              alt="Artisanal pour over coffee" 
              className="w-full h-full object-cover filter brightness-95 hover:scale-105 transition-transform duration-700"
            />
          </div>

        </div>
      </section>

      {/* 5. Why Choose Us - Feature Grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center space-y-4 reveal">
          <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> The BeanCo Difference
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground">Why Purists Choose Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm font-light">
            Every detail is calibrated for an unparalleled coffee experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Award,
              title: "Award-Winning Roasts",
              desc: "15 international roasting competition medals. Our master roaster brings 20 years of precision craftsmanship.",
              gradient: "from-primary/20 to-transparent"
            },
            {
              icon: Users,
              title: "Community Driven",
              desc: "Over 12,500 loyal members. Weekly cupping sessions and monthly origin storytelling events.",
              gradient: "from-accent/20 to-transparent"
            },
            {
              icon: Leaf,
              title: "Zero-Waste Mission",
              desc: "100% compostable packaging. Spent grounds donated to local urban farms. Carbon-neutral shipping.",
              gradient: "from-green-500/10 to-transparent"
            }
          ].map((feature, idx) => (
            <div key={idx} className={`reveal stagger-${idx + 1} glass-card rounded-3xl p-10 group hover:border-primary/40 transition-all duration-500 relative overflow-hidden`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEW: Parallax Image Gallery */}
      <ParallaxGallery />

      {/* 7. Testimonial Showcase */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex items-end justify-between reveal">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
              <Compass className="w-4 h-4" /> Guest Journal
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-foreground">Loved by Purists</h2>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setTIdx((p) => (p === 0 ? testimonials.length - 1 : p - 1))}
              className="w-10 h-10 rounded-full border border-border hover:border-primary/40 flex items-center justify-center transition-all duration-300 group"
            >
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary rotate-180 transition-colors" />
            </button>
            <button
              onClick={() => setTIdx((p) => (p + 1) % testimonials.length)}
              className="w-10 h-10 rounded-full border border-border hover:border-primary/40 flex items-center justify-center transition-all duration-300 group"
            >
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={tIdx}
              className="relative bg-gradient-to-br from-[#120a06] via-[#0e0705] to-[#080504] border border-primary/10 rounded-3xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="absolute inset-0 opacity-10">
                <img src={testimonials[tIdx].img} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#120a06] via-[#120a06]/90 to-[#120a06]/60" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 p-10 lg:p-14 items-center">
                <div className="lg:col-span-3 space-y-6">
                  <span className="text-6xl font-serif text-primary/20 leading-none">&ldquo;</span>
                  <p className="text-xl md:text-2xl text-white/80 font-light leading-relaxed serif-font italic">
                    {testimonials[tIdx].comment}
                  </p>
                  <div className="flex items-center gap-1 text-primary">
                    {[...Array(testimonials[tIdx].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary" />
                    ))}
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
                      {testimonials[tIdx].name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{testimonials[tIdx].name}</h4>
                      <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">{testimonials[tIdx].role}</span>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-2 hidden lg:block">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-primary/10 shadow-2xl">
                    <img src={testimonials[tIdx].img} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 right-6 text-[10px] font-mono font-bold text-white/10 z-20">
                {String(tIdx + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setTIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === tIdx ? 'w-8 bg-primary' : 'w-1.5 bg-border hover:bg-muted-foreground/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* NEW: Cinematic Macro-to-Micro Deep Dive */}
      <CinematicDeepDive />

      {/* 8. CTA Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="reveal glass-card rounded-3xl p-14 md:p-20 text-center relative overflow-hidden bg-gradient-to-br from-[#120a06] via-[#0e0705] to-[#080504] border border-primary/20">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_rgba(212,175,55,0.3)_0%,_transparent_60%)]" />
          <div className="relative z-10 space-y-8">
            <Sparkles className="w-8 h-8 text-primary mx-auto animate-bounce-slow" />
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
              Ready for Your <span className="gradient-text">Next Cup?</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto text-sm font-light leading-relaxed">
              Reserve your table today and experience coffee crafted with obsessive precision. Your first visit includes a complimentary tasting flight.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                href="/reserve"
                className="px-12 py-5 bg-gradient-to-r from-primary to-[#ebd3b4] text-[#080504] font-extrabold rounded-full hover:shadow-xl hover:shadow-primary/20 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2 text-sm uppercase tracking-wider glow-btn"
              >
                <span>Reserve Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/menu"
                className="px-12 py-5 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/20 text-white font-extrabold rounded-full transition-all flex items-center justify-center text-sm uppercase tracking-wider"
              >
                View Menu
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}