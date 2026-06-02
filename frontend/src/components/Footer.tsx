'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Coffee, Mail, MapPin, Phone, ArrowRight, Heart, Sparkles, Send } from 'lucide-react';
import { FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-background via-[#120a06] to-[#080504] text-white overflow-hidden">
      
      {/* Wave Separator */}
      <div className="footer-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            fill="var(--background)"
            opacity="1"
          />
        </svg>
      </div>

      {/* Ambient Glow Effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-primary/3 blur-3xl pointer-events-none" />

      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="reveal glass-card rounded-3xl p-10 md:p-14 bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Stay Connected</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-black tracking-tight">
                Join the <span className="gradient-text">Inner Circle</span>
              </h3>
              <p className="text-white/60 text-sm font-light leading-relaxed max-w-md">
                Receive exclusive roast announcements, tasting event invitations, and member-only pricing delivered to your inbox weekly.
              </p>
            </div>

            <div>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="newsletter-input w-full pl-11 pr-4 py-4 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-primary transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-primary to-[#ebd3b4] text-[#080504] font-extrabold rounded-2xl hover:shadow-xl hover:shadow-primary/20 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 text-sm uppercase tracking-wider glow-btn whitespace-nowrap"
                >
                  {subscribed ? (
                    <>
                      <Heart className="w-4 h-4 fill-current" />
                      <span>Subscribed!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Subscribe</span>
                    </>
                  )}
                </button>
              </form>
              <p className="text-white/30 text-xs mt-3 font-light">No spam. Unsubscribe anytime. We respect your privacy.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-wide group">
              <Coffee className="w-7 h-7 text-primary group-hover:rotate-12 transition-transform duration-300" />
              <span>Bean<span className="text-primary font-bold">Co</span></span>
            </Link>
            <p className="text-white/50 text-sm font-light leading-relaxed">
              A micro-roastery and immersive lounge engineered for coffee purists. Sourcing ethically from high-altitude volcanic estates worldwide.
            </p>
            <div className="flex gap-4">
              <a href="#" className="social-icon w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/60 hover:bg-primary/20 hover:border-primary/30 transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="social-icon w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/60 hover:bg-primary/20 hover:border-primary/30 transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="social-icon w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/60 hover:bg-primary/20 hover:border-primary/30 transition-colors">
                <FaFacebookF className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Explore</h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'Menu Catalog', href: '/menu' },
                { name: 'Reserve a Table', href: '/reserve' },
                { name: 'Our Story', href: '#' },
                { name: 'Roasting Process', href: '#' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-white/60 hover:text-white text-sm font-light transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Support</h4>
            <ul className="space-y-3">
              {[
                'FAQ & Help',
                'Shipping Policy',
                'Returns & Refunds',
                'Terms of Service',
                'Privacy Policy',
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="group flex items-center gap-2 text-white/60 hover:text-white text-sm font-light transition-colors">
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Visit Us</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-white/60 text-sm font-light">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>42 Artisan Lane<br />Coffee District, CD 10001</span>
              </div>
              <div className="flex items-center gap-3 text-white/60 text-sm font-light">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+1 (555) 234-5678</span>
              </div>
              <div className="flex items-center gap-3 text-white/60 text-sm font-light">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>hello@beanco.com</span>
              </div>
            </div>
            <div className="pt-2 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-widest text-white/40">Hours</h5>
              <p className="text-white/60 text-xs font-light">Mon - Fri: 7:00 AM - 9:00 PM</p>
              <p className="text-white/60 text-xs font-light">Sat - Sun: 8:00 AM - 10:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs font-light">
            © {currentYear} BeanCo. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/40 font-light">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
