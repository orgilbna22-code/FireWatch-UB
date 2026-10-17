import React, { useState, useEffect, useId, useRef } from 'react';

interface FireAnimationProps {
  intensity?: 'low' | 'moderate' | 'high' | 'extreme';
  windEffect?: number; // -1 to 1 (left to right draft)
  interactive?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showControls?: boolean;
  onSparkBurst?: () => void;
}

export const FireAnimation: React.FC<FireAnimationProps> = ({
  intensity = 'high',
  windEffect = 0,
  interactive = true,
  className = '',
  size = 'md',
  showControls = false,
  onSparkBurst,
}) => {
  const [currentIntensity, setCurrentIntensity] = useState(intensity);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const swayRef = useRef<HTMLDivElement | null>(null);
  const haloRef = useRef<HTMLDivElement | null>(null);
  // Mirror mouseDraft in a ref so the canvas loop and sway transform read live
  // values without restarting the rAF loop / re-rendering on every mousemove
  const mouseDraftRef = useRef(0);
  const clickFlutterRef = useRef(false);
  const uid = useId().replace(/:/g, '');

  const updateSway = React.useCallback(() => {
    const totalSway = windEffect * 14 + mouseDraftRef.current * 22;
    if (swayRef.current) {
      swayRef.current.style.transform = `translateX(${totalSway}px) skewX(${totalSway * -0.35}deg) scale(${clickFlutterRef.current ? 1.08 : 1})`;
    }
    if (haloRef.current) {
      haloRef.current.style.transform = `translateX(${totalSway * 0.4}px)`;
    }
  }, [windEffect]);

  useEffect(() => {
    updateSway();
  }, [updateSway]);

  // Scaled dimensions
  const sizeMap = {
    sm: { w: 90, h: 110, scale: 0.75 },
    md: { w: 130, h: 160, scale: 1.0 },
    lg: { w: 190, h: 230, scale: 1.45 },
    hero: { w: 250, h: 300, scale: 1.9 },
  };

  const dim = sizeMap[size];

  // Dynamic animation frequency and height scale based on intensity
  const intensitySettings = {
    low: { speed: 3.2, heightScale: 0.85, sparkCount: 10, flameClass: 'animate-flame-low' },
    moderate: { speed: 2.4, heightScale: 0.95, sparkCount: 16, flameClass: 'animate-flame-mod' },
    high: { speed: 1.8, heightScale: 1.05, sparkCount: 24, flameClass: 'animate-flame-high' },
    extreme: { speed: 1.3, heightScale: 1.2, sparkCount: 36, flameClass: 'animate-flame-ext' },
  };

  const curSettings = intensitySettings[currentIntensity];

  // High-performance Canvas Spark Simulation (Zero React State Churn = True 120fps)
  const sparksRef = useRef<
    {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      maxLife: number;
      life: number;
      color: string;
    }[]
  >([]);

  useEffect(() => {
    setCurrentIntensity(intensity);
  }, [intensity]);

  // Canvas loop running outside React state to prevent lag
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    canvas.width = dim.w;
    canvas.height = dim.h;

    const colors = ['#FFE58F', '#FFD666', '#FFA940', '#FF7A45', '#FF4D4F'];

    const spawnSpark = (burst = false) => {
      const angle = (windEffect + mouseDraftRef.current) * 1.5;
      sparksRef.current.push({
        x: dim.w / 2 + (Math.random() - 0.5) * (burst ? 40 : 20),
        y: dim.h - 20,
        vx: (Math.random() - 0.5) * (burst ? 4 : 1.2) + angle,
        vy: -(Math.random() * (burst ? 4.5 : 2.5) + (burst ? 2.5 : 1.5)),
        size: Math.random() * (burst ? 3.2 : 2.2) + 1.0,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 40 + (burst ? 50 : 35),
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    let tick = 0;
    const loop = () => {
      animId = requestAnimationFrame(loop);
      // Skip all work when the tab is hidden (battery + CPU saver)
      if (document.hidden) return;
      tick++;
      ctx.clearRect(0, 0, dim.w, dim.h);

      // Spawn periodic gentle embers
      const spawnRate = currentIntensity === 'extreme' ? 3 : currentIntensity === 'high' ? 5 : 8;
      if (tick % spawnRate === 0 && sparksRef.current.length < curSettings.sparkCount) {
        spawnSpark();
      }

      // Update & render sparks
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const s = sparksRef.current[i];
        s.life++;
        s.x += s.vx;
        s.y += s.vy;
        s.alpha = Math.max(0, 1 - s.life / s.maxLife);

        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowBlur = s.size * 3;
        ctx.shadowColor = '#FF7A45';
        ctx.globalAlpha = s.alpha;
        ctx.fill();
        ctx.restore();

        if (s.life >= s.maxLife || s.y < 0) {
          sparksRef.current.splice(i, 1);
        }
      }
    };

    animId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animId);
  }, [dim.w, dim.h, currentIntensity, curSettings.sparkCount, windEffect]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    mouseDraftRef.current = relativeX * 0.7;
    updateSway();
  };

  const handleMouseLeave = () => {
    mouseDraftRef.current = 0;
    updateSway();
  };

  const handleClick = () => {
    clickFlutterRef.current = true;
    updateSway();
    setTimeout(() => {
      clickFlutterRef.current = false;
      updateSway();
    }, 250);

    // Burst 8 golden sparks instantly in canvas
    for (let i = 0; i < 8; i++) {
      const angle = (windEffect + mouseDraftRef.current) * 2;
      sparksRef.current.push({
        x: dim.w / 2 + (Math.random() - 0.5) * 35,
        y: dim.h - 22,
        vx: (Math.random() - 0.5) * 4.5 + angle,
        vy: -(Math.random() * 4.5 + 2.5),
        size: Math.random() * 3.5 + 1.5,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 50 + 35,
        color: '#FFF1B8',
      });
    }

    if (onSparkBurst) onSparkBurst();
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ width: `${dim.w}px`, height: `${dim.h}px` }}
      className={`relative flex flex-col items-center justify-end select-none cursor-pointer transition-transform duration-200 active:scale-95 group ${className}`}
      title="Амьд галын дөл: Хулганаараа налуулж, дарж оч үсэргэнэ үү"
    >
      {/* 1. Soft Warm Ambient Halo Glow */}
      <div
        ref={haloRef}
        className="absolute bottom-2 w-3/4 h-3/4 rounded-full blur-2xl opacity-45 group-hover:opacity-65 transition-opacity pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #FF633C 0%, #E93B2F 45%, transparent 75%)',
        }}
      />

      {/* 2. Master SVG Flame Tongue (Mathematical Precision, Silky 60fps CSS Animation) */}
      <div
        ref={swayRef}
        className="relative z-10 w-full h-full flex items-end justify-center transition-transform duration-200 ease-out"
      >
        <svg
          viewBox="0 0 100 130"
          className="w-full h-full overflow-visible drop-shadow-[0_6px_20px_rgba(255,99,60,0.45)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Outer Flame Gradient: Deep burning crimson to vivid orange */}
            <linearGradient id={`flameOuterGrad-${uid}`} x1="50" y1="125" x2="50" y2="10" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E93B2F" />
              <stop offset="40%" stopColor="#FF633C" />
              <stop offset="80%" stopColor="#FFA940" />
              <stop offset="100%" stopColor="#FFD666" />
            </linearGradient>

            {/* Middle Flame Gradient: Rich golden amber */}
            <linearGradient id={`flameMidGrad-${uid}`} x1="50" y1="125" x2="50" y2="35" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF7A45" />
              <stop offset="50%" stopColor="#FFC069" />
              <stop offset="100%" stopColor="#FFF1B8" />
            </linearGradient>

            {/* Inner Flame Heart: Incandescent white-gold */}
            <linearGradient id={`flameCoreGrad-${uid}`} x1="50" y1="125" x2="50" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFD666" />
              <stop offset="40%" stopColor="#FFFBE6" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>

            {/* Blue Ignition Base */}
            <radialGradient id={`flameBaseBlue-${uid}`} cx="50" cy="120" r="16" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#85A5FF" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#2F54EB" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0B124D" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* LAYER 1: Outer Morphing Flame Body */}
          <path
            d="M50 8C50 8 68 32 68 58C68 84 58 100 62 118C62 122 56 125 50 125C44 125 38 122 38 118C42 100 32 84 32 58C32 32 50 8 50 8Z"
            fill={`url(#flameOuterGrad-${uid})`}
            className="origin-bottom"
            style={{
              animation: `flameWobbleOuter ${curSettings.speed}s ease-in-out infinite alternate`,
            }}
          />

          {/* Secondary dynamic licking tongue on the right */}
          <path
            d="M50 25C50 25 64 45 64 70C64 92 54 105 57 122C57 124 53 125 50 125C47 125 43 124 43 122C46 105 36 92 36 70C36 45 50 25 50 25Z"
            fill={`url(#flameOuterGrad-${uid})`}
            opacity="0.88"
            style={{
              animation: `flameWobbleMid ${curSettings.speed * 0.8}s ease-in-out infinite alternate-reverse`,
            }}
          />

          {/* LAYER 2: Middle Vivid Amber Core */}
          <path
            d="M50 38C50 38 60 55 60 78C60 98 54 110 56 122C56 124 53 125 50 125C47 125 44 124 44 122C46 110 40 98 40 78C40 55 50 38 50 38Z"
            fill={`url(#flameMidGrad-${uid})`}
            style={{
              animation: `flameWobbleInner ${curSettings.speed * 0.65}s ease-in-out infinite alternate`,
            }}
          />

          {/* LAYER 3: Incandescent White-Hot Flame Teardrop Heart */}
          <path
            d="M50 62C50 62 56 75 56 92C56 108 53 118 54 123C54 124.5 52 125 50 125C48 125 46 124.5 46 123C47 118 44 108 44 92C44 75 50 62 50 62Z"
            fill={`url(#flameCoreGrad-${uid})`}
            style={{
              animation: `flamePulse 1.2s ease-in-out infinite alternate`,
            }}
          />

          {/* Base Clean Blue Gas Spark */}
          <circle cx="50" cy="122" r="10" fill={`url(#flameBaseBlue-${uid})`} />
        </svg>

        {/* 3. High-Performance Silky Canvas Embers (NO LAG) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      </div>

      {/* Interactive Controls Overlay */}
      {showControls && (
        <div className="mt-3 flex items-center gap-1 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-black/[0.06] shadow-sm text-xs font-mono">
          <span className="text-[10px] text-slate-500 uppercase mr-1">Intensity:</span>
          {(['low', 'moderate', 'high', 'extreme'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIntensity(lvl);
              }}
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                currentIntensity === lvl
                  ? 'bg-[#FF633C] text-white shadow-xs'
                  : 'text-slate-600 hover:text-black hover:bg-black/5'
              }`}
            >
              {lvl.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
