'use client';

import React, { useEffect, useState } from 'react';
import { Coffee } from 'lucide-react';

export default function LoadingScreen() {
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setHidden(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`preloader ${hidden ? 'hidden' : ''}`}>
      <div className="flex flex-col items-center gap-6">
        {/* Animated coffee cup */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-2 border-primary/30 flex items-center justify-center animate-pulse-glow">
            <Coffee className="w-10 h-10 text-primary" style={{ animation: 'preloader-pulse 1.5s ease-in-out infinite' }} />
          </div>
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent" style={{ animation: 'preloader-spin 1s linear infinite' }} />
        </div>

        {/* Brand text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Bean<span className="text-primary font-bold">Co</span>
          </h2>
          <p className="text-xs text-muted-foreground font-light uppercase tracking-widest">
            Preparing your experience...
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-secondary/50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-[#ebd3b4] rounded-full"
            style={{ 
              animation: 'loadingProgress 1.8s ease-in-out forwards',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes loadingProgress {
          0% { width: 0%; }
          30% { width: 40%; }
          60% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}