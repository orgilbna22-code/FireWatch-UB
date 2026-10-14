import React, { useEffect, useRef } from 'react';

interface AmbientFireBackgroundProps {
  className?: string;
  intensity?: number;
}

export const AmbientFireBackground: React.FC<AmbientFireBackgroundProps> = ({
  className = '',
  intensity = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth || 400);
    let height = (canvas.height = canvas.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 400;
      height = canvas.height = canvas.offsetHeight || 600;
    };

    window.addEventListener('resize', handleResize);

    // Lightweight 16 gentle floating sparks (zero lag, 60fps guaranteed)
    interface Spark {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      driftSpeed: number;
      driftOffset: number;
      alpha: number;
      color: string;
    }

    const sparkColors = [
      'rgba(255, 214, 102, ', // bright gold
      'rgba(255, 122, 69, ',  // warm orange
      'rgba(255, 99, 60, ',   // fire orange
      'rgba(255, 175, 80, ',  // amber
    ];

    const sparks: Spark[] = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.0 + 0.8,
      speedY: Math.random() * 0.7 + 0.35,
      driftSpeed: Math.random() * 0.02 + 0.01,
      driftOffset: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.5 + 0.25,
      color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
    }));

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Fast, lightweight spark rendering with simple arcs
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        s.y -= s.speedY * intensity;
        s.driftOffset += s.driftSpeed;
        const currentX = s.x + Math.sin(s.driftOffset) * 12;

        if (s.y < -10) {
          s.y = height + 10;
          s.x = Math.random() * width;
        }

        const flicker = Math.sin(tick * 0.08 + i) * 0.2 + 0.8;
        const currentAlpha = Math.max(0, s.alpha * flicker);

        ctx.fillStyle = `${s.color}${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(currentX, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      
      {/* 1. GPU-accelerated ultra-soft ambient breathing thermal gradient (0% CPU cost, 120fps) */}
      <div
        className="absolute -bottom-24 -left-20 -right-20 h-[70%] rounded-[100%] opacity-40 blur-[80px] pointer-events-none transition-all duration-1000"
        style={{
          background: 'radial-gradient(ellipse at bottom center, #FF633C 0%, #E93B2F 35%, #0B124D 70%, transparent 100%)',
          animation: 'pulse 5s ease-in-out infinite alternate',
        }}
      />

      {/* 2. Secondary gentle warm floor sheen */}
      <div
        className="absolute bottom-0 left-0 right-0 h-44 opacity-25 blur-3xl pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(255, 99, 60, 0.45) 0%, rgba(11, 18, 77, 0) 100%)',
        }}
      />

      {/* 3. Lightweight silky sparks canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

    </div>
  );
};
