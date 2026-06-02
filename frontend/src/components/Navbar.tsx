'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Coffee, Menu, X, Moon, Sun, User, Calendar } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface NavbarProps {
  onCartToggle: () => void;
}

export default function Navbar({ onCartToggle }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { theme, toggleTheme, cart, user, logout } = useStore();
  
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Apply default theme to HTML tag
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [theme]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Reserve a Seat', href: '/reserve' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
      scrolled 
        ? 'bg-background/90 backdrop-blur-md border-b border-border/50 py-3 shadow-md' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 text-foreground font-semibold text-2xl tracking-wide group">
          <Coffee className="w-7 h-7 text-primary group-hover:rotate-12 transition-transform duration-300" />
          <span>Bean<span className="text-primary font-bold">Co</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-sm font-medium hover:text-primary transition-colors duration-200 relative py-1 ${
                  isActive ? 'text-primary' : 'text-foreground/80'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center space-x-5">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary transition-colors text-foreground/80 hover:text-foreground"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={onCartToggle}
            className="p-2 rounded-full hover:bg-secondary transition-colors text-foreground/80 hover:text-foreground relative"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {totalItems}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center space-x-4 border-l border-border/50 pl-4">
              <span className="text-sm font-medium text-foreground/80">{user.full_name || user.email}</span>
              <button 
                onClick={logout}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/auth"
              className="flex items-center space-x-1.5 text-sm font-semibold px-4 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Mobile controls toggle */}
        <div className="flex md:hidden items-center space-x-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary text-foreground/85"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={onCartToggle}
            className="p-2 rounded-full hover:bg-secondary text-foreground/85 relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full hover:bg-secondary text-foreground/85"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border/80 px-6 py-6 flex flex-col space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-foreground/90 hover:text-primary transition-colors py-2 border-b border-border/20"
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <div className="flex flex-col space-y-2 pt-2">
              <span className="text-sm font-medium text-foreground/75">Logged in as {user.full_name || user.email}</span>
              <button 
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-all duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              href="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold transition-all duration-300"
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
