'use client';

import React, { useEffect, useState } from 'react';
import { Search, Plus, Sparkles, Check } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  customizable: boolean;
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Visual Customizer States
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [size, setSize] = useState<'Small' | 'Medium' | 'Large'>('Medium');
  const [milk, setMilk] = useState<'Whole Milk' | 'Oat Milk' | 'Almond Milk' | 'None'>('Whole Milk');
  const [syrup, setSyrup] = useState<'Vanilla' | 'Caramel' | 'None'>('None');

  const addToCart = useStore((state) => state.addToCart);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/menu/')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setItems(data);
        }
      })
      .catch((err) => {
        console.warn("Backend unreachable, fallback to premium mock roasts.", err);
        setItems([
          {
            id: 1,
            name: "Signature Gold Espresso",
            description: "A luxury micro-batch espresso extract highlighting notes of velvety dark cacao, orange blossom, and a toasted hazelnut finish.",
            price: 6.50,
            category: "Coffee",
            image_url: "https://images.unsplash.com/photo-1510972527409-cef6e4a4d6f2?auto=format&fit=crop&q=80&w=400",
            customizable: true
          },
          {
            id: 2,
            name: "Velvet Ristretto Flat White",
            description: "Rich, double-pulled ristretto extraction served with hand-textured organic oat microfoam at a perfect 140°F.",
            price: 7.20,
            category: "Coffee",
            image_url: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=400",
            customizable: true
          },
          {
            id: 3,
            name: "Nitro Cold Brew Draft",
            description: "Slow-steeped cold brew infused with pure nitrogen for a creamy, draft-beer cascading cascade texture.",
            price: 6.80,
            category: "Drinks",
            image_url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=400",
            customizable: false
          },
          {
            id: 4,
            name: "Pistachio Praline Croissant",
            description: "Flaky, twice-baked house pastry featuring stone-ground Sicilian pistachio praline and a light dusting of sea salt sugar.",
            price: 8.50,
            category: "Bakery",
            image_url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=400",
            customizable: false
          },
          {
            id: 5,
            name: "BeanCo Ceramic Tumbler",
            description: "Double-walled ceramic mug with matte-black finish and golden brass details.",
            price: 28.00,
            category: "Merch",
            image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400",
            customizable: false
          },
          {
            id: 6,
            name: "Ethiopian Roast Coffee Beans",
            description: "Ethically sourced single-origin Ethiopian beans with fruit forward lemon, berry, and jasmine floral notes.",
            price: 22.50,
            category: "Coffee Beans",
            image_url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=400",
            customizable: false
          }
        ]);
      });
  }, []);

  const categories = ['All', 'Coffee', 'Drinks', 'Bakery', 'Merch', 'Coffee Beans'];

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenCustomizer = (item: MenuItem) => {
    if (item.customizable) {
      setSelectedItem(item);
      setSize('Medium');
      setMilk('Whole Milk');
      setSyrup('None');
    } else {
      addToCart({ id: item.id, name: item.name, price: item.price });
    }
  };

  // Live Price Calculation based on Customization
  const getCustomizedPrice = () => {
    if (!selectedItem) return 0;
    let base = selectedItem.price;
    if (size === 'Large') base += 1.20;
    if (size === 'Small') base -= 0.60;
    if (milk !== 'None' && milk !== 'Whole Milk') base += 0.70; // Milk alternate charge
    if (syrup !== 'None') base += 0.50; // Syrup charge
    return base;
  };

  const handleAddCustomized = () => {
    if (!selectedItem) return;
    addToCart({ 
      id: selectedItem.id, 
      name: `${selectedItem.name} (${size})`, 
      price: getCustomizedPrice(),
      size,
      milk: milk !== 'None' ? milk : undefined
    });
    setSelectedItem(null);
  };

  // Determine liquid fill color inside the visual cup representation
  const getLiquidColor = () => {
    if (milk === 'None') return '#1A0D06'; // Deep Black Coffee
    if (milk === 'Whole Milk') return '#C8A27C'; // Classic Creamy Latte
    if (milk === 'Oat Milk') return '#D9BA9B'; // Slightly Lighter Beige
    return '#E1CBB6'; // Almond Milk (Pale cream)
  };

  const getCupScale = () => {
    if (size === 'Small') return 'scale-[0.85]';
    if (size === 'Large') return 'scale-[1.1]';
    return 'scale-[1.0]';
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
      
      {/* Editorial Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" /> House Roasts & Confections
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">Exquisite Offerings</h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm font-light">
          Savor micro-lot single origins roasted weekly, and daily baked specialty pastries.
        </p>
      </div>

      {/* Control bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/40 pb-6">
        
        {/* Horizontal Category Nav */}
        <div className="flex items-center space-x-2.5 overflow-x-auto pb-3 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/10' 
                  : 'bg-secondary/40 text-foreground/80 hover:bg-secondary border border-border/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Search */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-foreground/45" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roasts, blends, pastries..." 
            className="w-full pl-11 pr-4 py-3 rounded-full border border-border bg-card/60 text-sm text-foreground focus:outline-none focus:border-primary transition-all"
          />
        </div>

      </div>

      {/* Main Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="glass-card rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between"
          >
            <div>
              <div className="h-60 overflow-hidden relative">
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{item.category}</span>
                  <span className="font-extrabold text-foreground">${item.price.toFixed(2)}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">{item.name}</h3>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">{item.description}</p>
              </div>
            </div>

            <div className="p-8 pt-0">
              <button 
                onClick={() => handleOpenCustomizer(item)}
                className="w-full flex items-center justify-center space-x-2 bg-secondary/80 hover:bg-primary hover:text-primary-foreground text-secondary-foreground font-bold py-4 px-4 rounded-xl transition-all duration-300 text-xs uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" />
                <span>{item.customizable ? 'Customize Extract' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 5. SUPER AWESOME: Visual Drink Customizer Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md">
          <div className="bg-[#120a07] border border-primary/20 w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 grid grid-cols-1 md:grid-cols-12 text-white">
            
            {/* Left Column: Visual Dynamic Rendering */}
            <div className="md:col-span-5 bg-[#090504] p-10 flex flex-col justify-center items-center relative border-r border-white/5">
              
              {/* Gold light burst */}
              <div className="absolute w-60 h-60 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
              
              <div className="space-y-2 text-center z-10 mb-8">
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Visualizer</span>
                <h3 className="text-xl font-bold tracking-tight text-white">{selectedItem.name}</h3>
              </div>

              {/* Graphical Cup */}
              <div className={`relative w-48 h-48 flex items-end justify-center transition-all duration-500 ${getCupScale()}`}>
                
                {/* Steam vector effects */}
                <div className="absolute -top-10 flex space-x-4 animate-[pulse_2s_infinite]">
                  <span className="w-1.5 h-10 bg-white/10 rounded-full blur-[2px] animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-1.5 h-12 bg-white/15 rounded-full blur-[2px] animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span className="w-1.5 h-8 bg-white/10 rounded-full blur-[2px] animate-bounce" style={{ animationDelay: '0.5s' }} />
                </div>

                {/* Glassware shell outline */}
                <div className="w-32 h-36 border-2 border-white/40 rounded-b-[2.5rem] rounded-t-[0.5rem] relative overflow-hidden flex items-end shadow-inner bg-white/5">
                  
                  {/* Liquid volume */}
                  <div 
                    className="w-full transition-all duration-750 ease-out" 
                    style={{ 
                      height: milk === 'None' ? '60%' : '85%', 
                      backgroundColor: getLiquidColor(),
                      boxShadow: 'inset 0 10px 10px rgba(0,0,0,0.15)'
                    }} 
                  />

                  {/* Microfoam top cover */}
                  {milk !== 'None' && (
                    <div className="absolute top-[14%] left-0 w-full h-4 bg-white/80 rounded-full blur-[1px] animate-pulse" />
                  )}
                </div>

                {/* Cup handle */}
                <div className="absolute right-4 top-[35%] w-8 h-16 border-2 border-white/40 border-l-0 rounded-r-2xl" />

              </div>

              <div className="text-center z-10 mt-8">
                <p className="text-xs text-white/50 font-light">Real-Time Extraction Simulation</p>
              </div>

            </div>

            {/* Right Column: Choices */}
            <div className="md:col-span-7 p-10 flex flex-col justify-between space-y-8">
              
              <div className="space-y-6">
                
                {/* Header info */}
                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Recipe Modifiers</span>
                    <h2 className="text-2xl font-bold tracking-tight text-white mt-1">Calibrate Flavor</h2>
                  </div>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="text-white/60 hover:text-white text-xs uppercase tracking-widest font-bold border border-white/15 px-3 py-1.5 rounded-full hover:bg-white/5 transition-all"
                  >
                    Close
                  </button>
                </div>

                {/* Choice 1: Size */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/60">Cup Size</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['Small', 'Medium', 'Large'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`py-3 rounded-xl text-xs font-bold border tracking-wider uppercase transition-all ${
                          size === s 
                            ? 'border-primary bg-primary text-primary-foreground' 
                            : 'border-white/10 bg-white/5 text-white/80 hover:border-white/30'
                        }`}
                      >
                        {s} {s === 'Large' ? '(+$1.20)' : s === 'Small' ? '(-$0.60)' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Choice 2: Milk */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/60">Organic Milk Base</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['Whole Milk', 'Oat Milk', 'Almond Milk', 'None'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMilk(m)}
                        className={`py-3 rounded-xl text-[10px] font-bold border tracking-wider uppercase transition-all ${
                          milk === m 
                            ? 'border-primary bg-primary text-primary-foreground' 
                            : 'border-white/10 bg-white/5 text-white/80 hover:border-white/20'
                        }`}
                      >
                        {m === 'None' ? 'None' : m.split(' ')[0]} {m !== 'Whole Milk' && m !== 'None' ? '(+$0.70)' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Choice 3: Syrup Additives */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-white/60">Syrup Infusion</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['None', 'Vanilla', 'Caramel'] as const).map((sy) => (
                      <button
                        key={sy}
                        type="button"
                        onClick={() => setSyrup(sy)}
                        className={`py-3 rounded-xl text-xs font-bold border tracking-wider uppercase transition-all ${
                          syrup === sy 
                            ? 'border-primary bg-primary text-primary-foreground' 
                            : 'border-white/10 bg-white/5 text-white/80 hover:border-white/20'
                        }`}
                      >
                        {sy} {sy !== 'None' ? '(+$0.50)' : ''}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Checkout Block */}
              <div className="border-t border-white/10 pt-6 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/50">Customized Total</span>
                  <div className="text-3xl font-black text-primary">${getCustomizedPrice().toFixed(2)}</div>
                </div>
                
                <button 
                  onClick={handleAddCustomized}
                  className="px-10 py-4.5 bg-gradient-to-r from-primary to-[#ebd3b4] text-[#080504] font-black rounded-xl hover:opacity-95 shadow-lg shadow-primary/10 transition-opacity text-xs uppercase tracking-wider glow-btn"
                >
                  Add Custom Recipe
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
