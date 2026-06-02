'use client';

import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, removeFromCart, getCartTotal, clearCart } = useStore();

  if (!isOpen) return null;

  const handleCheckout = () => {
    alert("Proceeding to Stripe Secure Checkout... Thank you for choosing BeanCo!");
    clearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-background border-l border-border flex flex-col shadow-2xl animate-in slide-in-from-right duration-350">
          
          {/* Header */}
          <div className="p-6 border-b border-border/80 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <span>Your Cart</span>
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-secondary text-foreground/80 hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-foreground/50">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Your cart is empty</h3>
                  <p className="text-sm text-foreground/60 mt-1">Add some signature roasts or delicious treats to start your day!</p>
                </div>
              </div>
            ) : (
              cart.map((item, index) => (
                <div 
                  key={`${item.id}-${index}`} 
                  className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/60 hover:border-primary/45 transition-all duration-300"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-foreground text-sm">{item.name}</h4>
                    <p className="text-xs text-foreground/60">
                      {item.size ? `Size: ${item.size} ` : ''}
                      {item.milk ? `| Milk: ${item.milk}` : ''}
                    </p>
                    <p className="text-sm font-semibold text-primary">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="p-2.5 text-foreground/50 hover:text-red-500 rounded-full hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-border bg-card/50 space-y-4">
              <div className="flex justify-between items-center text-foreground">
                <span className="font-medium text-sm">Subtotal</span>
                <span className="font-bold text-xl text-primary">${getCartTotal().toFixed(2)}</span>
              </div>
              <p className="text-xs text-foreground/50">Shipping and taxes calculated at checkout.</p>
              
              <button 
                onClick={handleCheckout}
                className="w-full flex items-center justify-center space-x-2 bg-primary text-primary-foreground font-bold py-3.5 px-4 rounded-xl hover:opacity-90 shadow-lg shadow-primary/10 hover:shadow-primary/20 transform active:scale-[0.98] transition-all duration-200"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
