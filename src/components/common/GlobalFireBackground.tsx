import React, { useEffect, useRef, useState } from 'react';

export type FireBackgroundMode = 'vivid' | 'soft' | 'off';

interface GlobalFireBackgroundProps {
  initialMode?: FireBackgroundMode;
}

export const GlobalFireBackground: React.FC<GlobalFireBackgroundProps> = ({
  initialMode = 'soft',
}) => {
  const [mode, setMode] = useState<FireBackgroundMode>(() => {
    try {
      const saved = localStorage.getItem('firewatch_bg_mode');
      if (saved === 'vivid' || saved === 'soft' || saved === 'off') return saved;
    } catch {
      // ignore
    }
    return initialMode;
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // On phones the bottom nav (z-[1100]) fully covers the 80px ribbon,
  // so animating it there is pure wasted battery/CPU. Desktop only.
  const [isCompactViewport, setIsCompactViewport] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const onChange = (e: MediaQueryListEvent) => setIsCompactViewport(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('firewatch_bg_mode', mode);
    } catch {
      // ignore
    }
  }, [mode]);

  // Ultra-optimized, zero-shadowBlur 60fps Canvas (Bottom flame ribbon only: 120px height)
  useEffect(() => {
    if (mode === 'off' || isCompactViewport) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    const height = (canvas.height = mode === 'vivid' ? 120 : 80);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      canvas.height = mode === 'vivid' ? 120 : 80;
    };
    window.addEventListener('resize', onResize);

    const isVivid = mode === 'vivid';
    const flameHeight = isVivid ? 95 : 60;
    const sparkCount = isVivid ? 20 : 12;

    // Embers with zero shadowBlur for 100% fluid frame rate
    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }

    const sparkPalette = [
      'rgba(255, 230, 140, ', // gold
      'rgba(255, 140, 50, ',  // orange
      'rgba(255, 90, 40, ',   // flame red
    ];

    const sparks: Spark[] = Array.from({ length: sparkCount }, () => ({
      x: Math.random() * width,
      y: height - Math.random() * 20,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(Math.random() * 1.5 + 0.6),
      size: Math.random() * 2.2 + 1.0,
      alpha: Math.random() * 0.8 + 0.2,
      color: sparkPalette[Math.floor(Math.random() * sparkPalette.length)],
    }));

    let time = 0;
    let lastTime = performance.now();

    const render = (now: number) => {
      animId = requestAnimationFrame(render);
      // Browsers pause rAF in hidden tabs, but some embedded webviews
      // still deliver frames - skip all drawing work in that case
      if (document.hidden || now - lastTime < 16) {
        return;
      }
      lastTime = now;
      time += 0.04;

      ctx.clearRect(0, 0, width, height);

      // 1. Procedural Flame Base Wave A (Deep orange-red)
      ctx.beginPath();
      ctx.moveTo(0, height);
      const step = 28;
      for (let x = 0; x <= width + step; x += step) {
        const wave = Math.sin(x * 0.02 + time * 1.5) * Math.cos(x * 0.015 - time * 0.8);
        const y = height - (flameHeight * 0.7 + wave * (flameHeight * 0.3));
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();

      const gradA = ctx.createLinearGradient(0, height - flameHeight, 0, height);
      gradA.addColorStop(0, isVivid ? 'rgba(255, 99, 60, 0.85)' : 'rgba(255, 99, 60, 0.65)');
      gradA.addColorStop(1, isVivid ? 'rgba(217, 30, 24, 0.95)' : 'rgba(180, 20, 20, 0.8)');
      ctx.fillStyle = gradA;
      ctx.fill();

      // 2. Procedural Flame Core Wave B (Golden amber)
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width + step; x += step) {
        const wave = Math.sin(x * 0.035 - time * 2.1);
        const y = height - (flameHeight * 0.45 + wave * (flameHeight * 0.22));
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.closePath();

      const gradB = ctx.createLinearGradient(0, height - flameHeight * 0.5, 0, height);
      gradB.addColorStop(0, 'rgba(255, 214, 102, 0.95)');
      gradB.addColorStop(1, 'rgba(255, 120, 40, 0.9)');
      ctx.fillStyle = gradB;
      ctx.fill();

      // 3. Lightweight Rising Sparks (Zero shadowBlur = ZERO LAG)
      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        s.y += s.vy;
        s.x += s.vx + Math.sin(time + i) * 0.5;
        s.alpha -= 0.01;

        if (s.y < 0 || s.alpha <= 0) {
          s.x = Math.random() * width;
          s.y = height - 5;
          s.alpha = Math.random() * 0.8 + 0.3;
          s.vy = -(Math.random() * 1.5 + 0.6);
        }

        ctx.fillStyle = `${s.color}${s.alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, [mode, isCompactViewport]);

  const isOff = mode === 'off';

  return (
    <>
      {/* 
        Ultra-lightweight bottom flame ribbon (Only 80px - 120px at the very bottom):
        Fixed, hardware-accelerated, zero CPU lag.
      */}
      {!isOff && !isCompactViewport && (
        <div
          className={`fixed bottom-0 left-0 right-0 pointer-events-none z-[32] overflow-hidden select-none transition-all duration-300 ${
            mode === 'vivid' ? 'h-[120px]' : 'h-[80px]'
          }`}
          aria-hidden="true"
        >
          {/* Soft ambient floor sheen */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#E93B2F]/25 via-[#FF633C]/10 to-transparent pointer-events-none" />

          {/* Smooth Canvas with ZERO lag */}
          <canvas
            ref={canvasRef}
            className="absolute bottom-0 left-0 w-full h-full pointer-events-none"
          />
        </div>
      )}

      {/* Clean, Non-intrusive Control Pill (Bottom Right - Desktop only to keep mobile viewport clean) */}
      <div className="hidden lg:block fixed bottom-3 right-3 z-[45]">
        <div className="bg-white/95 backdrop-blur-xl px-3 py-1.5 rounded-full border border-black/[0.08] shadow-lg flex items-center gap-2 text-xs font-sans transition-all hover:bg-white">
          <span className="flex items-center gap-1 font-bold text-[#0B124D] text-[11px]">
            <span className={`w-2 h-2 rounded-full ${isOff ? 'bg-slate-300' : 'bg-[#FF633C] animate-pulse'}`} />
            🔥 Арын гал:
          </span>

          <div className="flex items-center bg-[#F2F4F7] p-0.5 rounded-full text-[10px] font-semibold">
            <button
              onClick={() => setMode('soft')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                mode === 'soft'
                  ? 'bg-[#0B124D] text-white font-bold shadow-xs'
                  : 'text-[#72778A] hover:text-black'
              }`}
              title="Зөөлөн, намуун галын дөл"
            >
              Зөөлөн
            </button>
            <button
              onClick={() => setMode('vivid')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                mode === 'vivid'
                  ? 'bg-[#FF633C] text-white font-bold shadow-xs'
                  : 'text-[#72778A] hover:text-black'
              }`}
              title="Тод галын дөл"
            >
              Тод
            </button>
            <button
              onClick={() => setMode('off')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                mode === 'off'
                  ? 'bg-slate-700 text-white font-bold shadow-xs'
                  : 'text-[#72778A] hover:text-black'
              }`}
              title="Галыг унтраах"
            >
              Хаах
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
