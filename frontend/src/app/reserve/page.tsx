'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Users, Coffee, Check, AlertTriangle, Compass, ShieldCheck } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface Table {
  id: number;
  table_number: string;
  capacity: number;
  zone: string;
  description?: string;
}

interface Reservation {
  id: number;
  table_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
}

export default function ReservePage() {
  const router = useRouter();
  const { token, user } = useStore();

  const [tables, setTables] = useState<Table[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  
  // Selection States
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('14:00:00');
  const [guestCount, setGuestCount] = useState(2);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [specialRequests, setSpecialRequests] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      router.push('/auth');
      return;
    }

    const fetchData = async () => {
      try {
        const tableRes = await fetch('http://127.0.0.1:8000/api/reservations/tables');
        const tablesData = await tableRes.json();
        if (Array.isArray(tablesData)) {
          // Enrich with premium descriptions if not present
          const enriched = tablesData.map((t: Table) => ({
            ...t,
            description: t.table_number === "T1" ? "Leather wingbacks overlooking the garden"
                       : t.table_number === "T2" ? "Cozy velvet nook next to the primary window"
                       : t.table_number === "T3" ? "Sunny outdoor terrace with botanical surroundings"
                       : t.table_number === "T4" ? "Central handcrafted oak table with ambient lights"
                       : t.table_number === "T5" ? "Spacious patio dining next to the marble fountain"
                       : "The Grande Table - Premium oak for groups & coffee ceremonies"
          }));
          setTables(enriched);
        }

        const resRes = await fetch('http://127.0.0.1:8000/api/reservations/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const resData = await resRes.json();
        if (Array.isArray(resData)) {
          setReservations(resData);
        }
      } catch (err) {
        console.warn("Backend not running or unreachable, falling back to local mock data.", err);
        setTables([
          { id: 1, table_number: "T1", capacity: 2, zone: "Lounge", description: "Leather wingbacks overlooking the fireplace" },
          { id: 2, table_number: "T2", capacity: 2, zone: "Window", description: "Cozy velvet nook next to the primary window" },
          { id: 3, table_number: "T3", capacity: 4, zone: "Patio", description: "Sunny outdoor terrace with botanical surroundings" },
          { id: 4, table_number: "T4", capacity: 4, zone: "Main Room", description: "Central handcrafted oak table with ambient lights" },
          { id: 5, table_number: "T5", capacity: 6, zone: "Patio", description: "Spacious patio dining next to the marble fountain" },
          { id: 6, table_number: "T6", capacity: 8, zone: "Main Room", description: "The Grande Table - Premium oak for groups & coffee ceremonies" },
        ]);
      }
    };

    fetchData();
  }, [token, selectedDate]);

  const isTableReserved = (tableId: number) => {
    const requestedStart = selectedTime;
    const [h, m, s] = requestedStart.split(':').map(Number);
    const endH = (h + 2) % 24;
    const requestedEnd = `${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

    return reservations.some((res) => {
      if (res.table_id !== tableId || res.date !== selectedDate || res.status === 'cancelled') {
        return false;
      }
      return res.start_time < requestedEnd && res.end_time > requestedStart;
    });
  };

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTableId) {
      setError("Please choose a table from the Salon map.");
      return;
    }

    setError('');
    setMessage('');
    setLoading(true);

    const [h, m, s] = selectedTime.split(':').map(Number);
    const endH = (h + 2) % 24;
    const endTimeStr = `${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/reservations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          table_id: selectedTableId,
          date: selectedDate,
          start_time: selectedTime,
          end_time: endTimeStr,
          guest_count: guestCount,
          special_requests: specialRequests
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to make reservation");
      }

      const newRes = await response.json();
      setMessage(`Salon Reservation Confirmed! Reference ID: #${newRes.id}`);
      setSelectedTableId(null);
      setSpecialRequests('');
      setReservations([...reservations, newRes]);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    { name: '08:00 AM', val: '08:00:00' },
    { name: '10:00 AM', val: '10:00:00' },
    { name: '12:00 PM', val: '12:00:00' },
    { name: '02:00 PM', val: '14:00:00' },
    { name: '04:00 PM', val: '16:00:00' },
    { name: '06:00 PM', val: '18:00:00' },
    { name: '08:00 PM', val: '20:00:00' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
      
      {/* Page Title */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-2">
          <Compass className="w-4 h-4 animate-spin-slow" /> Salon Bookings
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">Select Your Sanctuary</h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm font-light">
          Reserve an exclusive dining table or lounge space calibrated to your party size.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Booking Parameters Form */}
        <div className="lg:col-span-5 glass-card p-10 rounded-3xl shadow-xl space-y-8">
          <div className="space-y-2 border-b border-border/40 pb-4">
            <h2 className="text-2xl font-bold text-foreground">Specify Reservation</h2>
            <p className="text-xs text-muted-foreground font-light">Enter details to update real-time layout options below.</p>
          </div>

          {message && (
            <div className="p-4 text-xs text-green-600 bg-green-500/10 border border-green-500/25 rounded-2xl flex items-center space-x-2">
              <Check className="w-4.5 h-4.5 text-green-600 shrink-0" />
              <span className="font-semibold">{message}</span>
            </div>
          )}

          {error && (
            <div className="p-4 text-xs text-red-500 bg-red-500/10 border border-red-500/25 rounded-2xl flex items-center space-x-2">
              <AlertTriangle className="w-4.5 h-4.5 text-red-500 shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleReserve} className="space-y-6">
            
            {/* Guests */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground/80 uppercase tracking-widest flex items-center space-x-2">
                <Users className="w-4 h-4 text-primary" />
                <span>Group Size</span>
              </label>
              <select 
                value={guestCount}
                onChange={(e) => {
                  setGuestCount(Number(e.target.value));
                  setSelectedTableId(null);
                }}
                className="w-full py-3.5 px-4 rounded-xl border border-border bg-background/50 text-sm text-foreground focus:outline-none focus:border-primary transition-all font-semibold"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                  <option key={g} value={g}>{g} {g === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground/80 uppercase tracking-widest flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Date</span>
              </label>
              <input 
                type="date" 
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTableId(null);
                }}
                className="w-full py-3.5 px-4 rounded-xl border border-border bg-background/50 text-sm text-foreground focus:outline-none focus:border-primary transition-all font-semibold"
              />
            </div>

            {/* Time Slots */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-foreground/80 uppercase tracking-widest flex items-center space-x-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>Hours</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((ts) => (
                  <button
                    key={ts.val}
                    type="button"
                    onClick={() => {
                      setSelectedTime(ts.val);
                      setSelectedTableId(null);
                    }}
                    className={`py-3 px-1 rounded-xl text-[10px] font-bold border tracking-wider transition-all uppercase ${
                      selectedTime === ts.val 
                        ? 'border-primary bg-primary text-primary-foreground font-black' 
                        : 'border-border bg-background/30 text-foreground/75 hover:border-foreground/20'
                    }`}
                  >
                    {ts.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Request note */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground/80 uppercase tracking-widest">Special Requests</label>
              <textarea 
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Highchairs, dietary/allergy requirements, fireplace view options..."
                className="w-full py-3.5 px-4 rounded-xl border border-border bg-background/50 text-sm text-foreground focus:outline-none focus:border-primary transition-all min-h-[90px] resize-none font-light leading-relaxed"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4.5 bg-gradient-to-r from-primary to-[#ebd3b4] text-[#080504] font-extrabold rounded-xl hover:opacity-95 shadow-lg shadow-primary/10 transition-opacity mt-4 disabled:opacity-50 text-xs uppercase tracking-wider glow-btn"
            >
              {loading ? 'Confirming with Vault...' : 'Secure Salon Table'}
            </button>
          </form>
        </div>

        {/* Room Visual Grid Layout */}
        <div className="lg:col-span-7 glass-card p-10 rounded-3xl shadow-xl flex flex-col space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Interactive Salon Map</h2>
              <p className="text-xs text-muted-foreground font-light mt-0.5">Pick your table. Green represents available spots matching criteria.</p>
            </div>
            
            {/* Key Legends */}
            <div className="flex space-x-4 text-[10px] font-bold uppercase tracking-wider text-foreground/70 shrink-0">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-secondary border border-border" />
                <span>Available</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-red-500/10 border border-red-500/20" />
                <span>Booked</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded bg-primary" />
                <span>Chosen</span>
              </div>
            </div>
          </div>

          {/* Table Choice grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tables.map((table) => {
              const reserved = isTableReserved(table.id);
              const capacityDeficit = table.capacity < guestCount;
              const isSelected = selectedTableId === table.id;

              let cardStyle = "border-border/60 bg-background/40 hover:border-primary/50 cursor-pointer";
              let statusText = "Select Table";
              let badgeStyle = "bg-primary/10 text-primary border-primary/20";

              if (reserved) {
                cardStyle = "border-red-500/10 bg-red-500/5 opacity-40 cursor-not-allowed";
                statusText = "Reserved";
                badgeStyle = "bg-red-500/20 text-red-500 border-transparent";
              } else if (capacityDeficit) {
                cardStyle = "border-orange-500/10 bg-orange-500/5 opacity-40 cursor-not-allowed";
                statusText = `Requires Max ${table.capacity} Guests`;
                badgeStyle = "bg-orange-500/20 text-orange-400 border-transparent";
              } else if (isSelected) {
                cardStyle = "border-primary bg-primary/10 shadow-lg shadow-primary/5";
                statusText = "Table Selected";
                badgeStyle = "bg-primary text-primary-foreground border-transparent";
              }

              return (
                <div
                  key={table.id}
                  onClick={() => {
                    if (!reserved && !capacityDeficit) {
                      setSelectedTableId(table.id);
                    }
                  }}
                  className={`p-6 rounded-2xl border flex flex-col justify-between space-y-6 transition-all duration-300 ${cardStyle}`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{table.zone}</span>
                        <h3 className="text-xl font-bold text-foreground mt-0.5">{table.table_number}</h3>
                      </div>
                      <span className={`text-[10px] font-bold border px-2.5 py-1 rounded-full ${badgeStyle}`}>
                        Fits {table.capacity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">{table.description}</p>
                  </div>

                  <div className="border-t border-border/20 pt-4 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                    <span className="text-foreground/50">2-Hour Block</span>
                    <span className={isSelected ? "text-primary" : "text-foreground/80"}>{statusText}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-border/40 pt-6 flex items-center space-x-2.5 text-xs text-muted-foreground font-light">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
            <span>Reservations are held for 15 minutes past booking time. Cancellation is free up to 24 hours prior.</span>
          </div>

        </div>

      </div>
    </div>
  );
}
