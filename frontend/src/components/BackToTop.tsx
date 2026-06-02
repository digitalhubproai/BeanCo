'use client';

import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`back-to-top ${visible ? 'visible' : ''}`}
      aria-label="Back to top"
    >
      <div className="w-12 h-12 rounded-full bg-primary/90 backdrop-blur-md border border-primary/30 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary hover:shadow-xl hover:shadow-primary/30 hover:scale-110 transition-all duration-300 group">
        <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </button>
  );
}