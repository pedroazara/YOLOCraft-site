import { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  wobbleSpeed: number;
  wobbleRange: number;
  angle: number;
}

interface MinecraftBackgroundProps {
  activeTab: string;
}

export default function MinecraftBackground({ activeTab }: MinecraftBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const { language } = useLanguage();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const maxParticles = 100;

    // Standard Minecraft-themed color palette for particles based on the active tab
    // We use emerald greens, light golds, diamonds, and purple amethysts to match each tab's theme
    let particleColors = [
      '#4ADE80', // Emerald Green (YOLO primary)
      '#22C55E', // Deep Green
      '#86EFAC', // Mint Green
      '#10B981', // emerald
      '#059669', // dark emerald
    ];

    if (activeTab === 'entidades') {
      // Gold / Oak theme
      particleColors = [
        '#FACC15', // Gold / Yellow
        '#EAB308', // Yellow Gold
        '#F59E0B', // Amber
        '#D97706', // Deep Amber
        '#FB923C', // Orange
      ];
    } else if (activeTab === 'como-funciona') {
      // Diamond / Prismarine theme
      particleColors = [
        '#06B6D4', // Cyan
        '#22D3EE', // Light Cyan
        '#38BDF8', // Sky Blue
        '#0891B2', // Diamond Blue
        '#0284C7', // Deep Cyan
      ];
    } else if (activeTab === 'stats') {
      // Amethyst / Ender theme
      particleColors = [
        '#A855F7', // Purple
        '#C084FC', // Light Purple
        '#E879F9', // Magenta
        '#8B5CF6', // Indigo
        '#EC4899', // Pink
      ];
    }

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create a particle
    const createParticle = (x: number, y: number, isMouseSpawn = false): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = isMouseSpawn ? Math.random() * 1.5 + 0.5 : Math.random() * 0.4 + 0.2;
      const size = isMouseSpawn 
        ? Math.floor(Math.random() * 4) + 3 // 3px - 6px
        : Math.floor(Math.random() * 5) + 4; // 4px - 8px

      return {
        x,
        y,
        vx: isMouseSpawn ? Math.cos(angle) * speed : (Math.random() - 0.5) * 0.2,
        vy: isMouseSpawn ? Math.sin(angle) * speed - 0.5 : -speed,
        size,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        alpha: Math.random() * 0.6 + 0.4,
        decay: isMouseSpawn ? Math.random() * 0.015 + 0.01 : Math.random() * 0.005 + 0.003,
        wobbleSpeed: Math.random() * 0.05 + 0.02,
        wobbleRange: Math.random() * 0.8 + 0.2,
        angle: Math.random() * Math.PI * 2,
      };
    };

    // Initialize ambient particles
    for (let i = 0; i < 40; i++) {
      particles.push(
        createParticle(
          Math.random() * window.innerWidth,
          Math.random() * window.innerHeight,
          false
        )
      );
    }

    // Mouse events
    const handleMouseMove = (e: MouseEvent) => {
      const oldX = mouseRef.current.x;
      const oldY = mouseRef.current.y;
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };

      // Spawn a spark on mouse drag/move if it's moved significantly
      const dist = Math.hypot(e.clientX - oldX, e.clientY - oldY);
      if (dist > 15 && particles.length < maxParticles + 40) {
        // Limit spawning rate to keep it performant and subtle
        for (let i = 0; i < 2; i++) {
          particles.push(createParticle(e.clientX, e.clientY, true));
        }
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleClick = (e: MouseEvent) => {
      // Spawn burst of pixel stars on click
      for (let i = 0; i < 12; i++) {
        particles.push(createParticle(e.clientX, e.clientY, true));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 1. Render & Update Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Wobble movement for floating effect
        p.angle += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.angle) * p.wobbleRange * 0.1;
        p.y += p.vy;

        // Interactive: Subtle repelling from mouse
        if (mouseRef.current.active) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 100) {
            const force = (100 - dist) / 1000;
            p.x += (dx / dist) * force * 5;
            p.y += (dy / dist) * force * 5;
          }
        }

        p.alpha -= p.decay;

        // Recycle or remove particle
        if (p.alpha <= 0 || p.y < -10 || p.x < -10 || p.x > window.innerWidth + 10) {
          if (particles.length > maxParticles) {
            particles.splice(i, 1);
          } else {
            // Respawn ambient particle at the bottom
            particles[i] = createParticle(
              Math.random() * window.innerWidth,
              window.innerHeight + 10,
              false
            );
          }
          continue;
        }

        // Draw crisp pixel/square particle with subtle glow border (Minecraft-style)
        ctx.save();
        ctx.globalAlpha = p.alpha;
        
        // Inner pixel color
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);

        // Dark pixel shadow border to match Minecraft inventory/GUI texture outlines
        ctx.strokeStyle = 'rgba(0,0,0,0.45)';
        ctx.lineWidth = 1;
        ctx.strokeRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTab]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-40 select-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
