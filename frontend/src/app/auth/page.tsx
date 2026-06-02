'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Coffee, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import { useStore } from '@/store/useStore';

export default function Auth() {
  const router = useRouter();
  const login = useStore((state) => state.login);
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const details = {
          'username': email,
          'password': password
        };
        const formBody = Object.keys(details)
          .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key as keyof typeof details]))
          .join('&');

        const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: formBody
        });

        if (!response.ok) {
          throw new Error('Invalid email or password');
        }

        const data = await response.json();
        const token = data.access_token;

        const userRes = await fetch('http://127.0.0.1:8000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!userRes.ok) throw new Error('Failed to load user profile');
        const userProfile = await userRes.json();

        login(token, userProfile);
        router.push('/reserve');
      } else {
        const response = await fetch('http://127.0.0.1:8000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password,
            full_name: fullName
          })
        });

        if (!response.ok) {
          const detail = await response.json();
          throw new Error(detail.detail || 'Registration failed');
        }

        setIsLogin(true);
        setEmail('');
        setPassword('');
        setFullName('');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      
      {/* Left Side - Cinematic Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#0e0705] via-[#090504] to-[#060302]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80&w=1200" 
            alt="Coffee artistry" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#090504]/50 to-[#080504]" />
        </div>

        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          {/* Brand */}
          <div className="flex items-center gap-3 text-white">
            <Coffee className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold tracking-wide">Bean<span className="text-primary font-bold">Co</span></span>
          </div>

          {/* Center content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Est. 2026</span>
            </div>

            <h1 className="text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight">
              The Art of <br />
              <span className="gradient-text">Perfect Coffee</span>
            </h1>

            <p className="text-white/60 text-base font-light leading-relaxed max-w-md">
              Join our community of coffee purists. Access exclusive roasts, reserve your favorite table, and experience coffee crafted with obsessive precision.
            </p>

            {/* Testimonial */}
            <div className="glass-card rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur-xl max-w-sm">
              <div className="flex gap-1 text-primary mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-sm">★</span>
                ))}
              </div>
              <p className="text-white/70 text-sm italic font-light leading-relaxed">
                "The Gold Espresso is pure liquid velvet. A sensory experience unlike any other."
              </p>
              <p className="text-white/40 text-xs mt-3 font-semibold">— Victoria Sterling, Coffee Connoisseur</p>
            </div>
          </div>

          {/* Bottom stats */}
          <div className="flex gap-12">
            <div>
              <div className="text-3xl font-black text-white">12K<span className="text-primary">+</span></div>
              <div className="text-white/40 text-xs uppercase tracking-widest font-light">Happy Members</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">47</div>
              <div className="text-white/40 text-xs uppercase tracking-widest font-light">Single Origins</div>
            </div>
            <div>
              <div className="text-3xl font-black text-white">15</div>
              <div className="text-white/40 text-xs uppercase tracking-widest font-light">Awards Won</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-background relative ${mounted ? 'auth-split-enter' : 'opacity-0'}`}>
        
        {/* Ambient glow */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Coffee className="w-7 h-7 text-primary" />
            <span className="text-2xl font-bold tracking-wide text-foreground">Bean<span className="text-primary font-bold">Co</span></span>
          </div>

          {/* Header */}
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
              {isLogin ? 'Welcome Back' : 'Join the Circle'}
            </h2>
            <p className="text-sm text-muted-foreground font-light">
              {isLogin 
                ? 'Access your reservations, orders, and exclusive member perks.' 
                : 'Create your account and begin your journey into exceptional coffee.'}
            </p>
          </div>

          {/* Toggle tabs */}
          <div className="flex bg-secondary/50 rounded-2xl p-1.5">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                isLogin 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/10' 
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                !isLogin 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/10' 
                  : 'text-foreground/60 hover:text-foreground'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 animate-fade-in-up">
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isLogin && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl text-xs text-foreground/70 font-light animate-fade-in-up">
              ✨ New members receive a complimentary tasting flight on their first visit.
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <label className="text-xs font-bold text-foreground/80 uppercase tracking-widest">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-foreground/40 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe" 
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-border bg-card/60 text-sm text-foreground focus:outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/5 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <label className="text-xs font-bold text-foreground/80 uppercase tracking-widest">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-foreground/40 group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" 
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-border bg-card/60 text-sm text-foreground focus:outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/5 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <label className="text-xs font-bold text-foreground/80 uppercase tracking-widest">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-foreground/40 group-focus-within:text-primary transition-colors" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl border border-border bg-card/60 text-sm text-foreground focus:outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/5 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-foreground/40 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
                <a href="#" className="text-xs font-semibold text-primary hover:underline">Forgot password?</a>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-[#ebd3b4] text-[#080504] font-extrabold py-4 px-4 rounded-2xl hover:shadow-xl hover:shadow-primary/20 transform hover:-translate-y-0.5 transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider glow-btn animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              <span>{loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-light">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-3 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <button className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-border bg-card/40 text-sm font-semibold text-foreground/80 hover:bg-card hover:border-primary/30 transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-border bg-card/40 text-sm font-semibold text-foreground/80 hover:bg-card hover:border-primary/30 transition-all">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              GitHub
            </button>
          </div>

          {/* Footer text */}
          <p className="text-center text-xs text-muted-foreground font-light animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
            By continuing, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}