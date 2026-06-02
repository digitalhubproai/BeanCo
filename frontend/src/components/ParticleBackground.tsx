'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  type: 'bean' | 'circle' | 'star';
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    const types: Particle['type'][] = ['bean', 'circle', 'star'];
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.3 + 0.1,
      opacity: Math.random() * 0.3 + 0.05,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      type: types[Math.floor(Math.random() * types.length)],
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
    particlesRef.current = Array.from({ length: particleCount }, () => createParticle(canvas));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const drawBean = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#d4af37';

      // Coffee bean shape
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 1.5, size, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bean line
      ctx.strokeStyle = '#b8942e';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(-size, 0);
      ctx.quadraticCurveTo(0, size * 0.5, size, 0);
      ctx.stroke();

      ctx.restore();
    };

    const drawCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#d4af37';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#d4af37';

      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const px = Math.cos(angle) * size;
        const py = Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;

        // Mouse interaction - gentle repulsion
        const dx = particle.x - mouseRef.current.x;
        const dy = particle.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          particle.x += (dx / dist) * force * 2;
          particle.y += (dy / dist) * force * 2;
        }

        // Wrap around edges
        if (particle.x < -20) particle.x = canvas.width + 20;
        if (particle.x > canvas.width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = canvas.height + 20;
        if (particle.y > canvas.height + 20) particle.y = -20;

        // Draw particle
        if (particle.type === 'bean') {
          drawBean(ctx, particle.x, particle.y, particle.size, particle.rotation, particle.opacity);
        } else if (particle.type === 'circle') {
          drawCircle(ctx, particle.x, particle.y, particle.size, particle.opacity);
        } else {
          drawStar(ctx, particle.x, particle.y, particle.size, particle.rotation, particle.opacity);
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, [createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}