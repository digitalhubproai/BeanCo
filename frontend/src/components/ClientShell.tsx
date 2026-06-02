'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import CartSidebar from './CartSidebar';
import Footer from './Footer';
import BackToTop from './BackToTop';
import LoadingScreen from './LoadingScreen';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const isAuthPage = pathname === '/auth';

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Loading Screen */}
      {loading && <LoadingScreen />}

      {/* Navbar - hidden on auth page */}
      {!isAuthPage && <Navbar onCartToggle={() => setCartOpen(true)} />}
      
      {/* Main Content */}
      <main className={`flex-grow ${!isAuthPage ? 'pt-20' : ''}`}>
        {children}
      </main>
      
      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      
      {/* Premium Footer - hidden on auth page */}
      {!isAuthPage && <Footer />}

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  );
}