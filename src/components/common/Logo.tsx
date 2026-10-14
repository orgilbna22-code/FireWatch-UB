import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  variant?: 'light' | 'dark' | 'brand';
  showText?: boolean;
  tagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'brand',
  showText = true,
  tagline = false,
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    hero: 'w-20 h-20 md:w-24 md:h-24',
  };

  const textClasses = {
    light: 'text-white',
    dark: 'text-[#0B124D]',
    brand: 'text-[#0B124D]',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Original FireWatch UB geometric flame + spatial coordinate insignia */}
      <div
        className={`${sizeMap[size]} relative flex items-center justify-center rounded-2xl transition-transform hover:scale-105 duration-200 shrink-0 ${
          variant === 'light'
            ? 'bg-white/10 ring-1 ring-white/20'
            : 'bg-[#FF633C] shadow-sm shadow-[#FF633C]/20'
        }`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/5 h-3/5"
        >
          {/* Outer protective shield / GIS perimeter */}
          <path
            d="M24 4L38 10V22C38 31.5 32 39.5 24 44C16 39.5 10 31.5 10 22V10L24 4Z"
            stroke={variant === 'light' ? '#FF633C' : '#FFFFFF'}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeDasharray="40 2"
            opacity="0.9"
          />
          {/* Inner algorithmic flame core + radar pinpoint */}
          <path
            d="M24 14C24 14 28 19 28 23C28 25.5 26.2 27 24 27C21.8 27 20 25.5 20 23C20 20 22.5 17 24 14Z"
            fill={variant === 'light' ? '#FFFFFF' : '#FFFFFF'}
          />
          <path
            d="M24 22C24 22 29.5 25 29.5 29.5C29.5 32.5 27 35 24 35C21 35 18.5 32.5 18.5 29.5C18.5 26 21.5 23.5 24 22Z"
            fill={variant === 'light' ? '#FF633C' : '#FFE5DF'}
            opacity="0.95"
          />
          {/* Central geographic coordinate crosshair / UB telemetry node */}
          <circle
            cx="24"
            cy="29"
            r="2"
            fill="#0B124D"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-semibold tracking-tight ${
                size === 'hero' ? 'text-2xl md:text-3xl' : 'text-base font-bold'
              } ${textClasses[variant]}`}
            >
              FIREWATCH
            </span>
            <span
              className={`font-mono text-xs font-semibold px-1 py-0.5 rounded ${
                variant === 'light'
                  ? 'bg-white/15 text-[#FF633C]'
                  : 'bg-[#0B124D] text-white'
              }`}
            >
              UB
            </span>
          </div>
          {tagline && (
            <span
              className={`text-[11px] mt-1 font-editorial tracking-normal ${
                variant === 'light' ? 'text-white/70' : 'text-[#72778A]'
              }`}
            >
              Гал гарахаас өмнө эрсдэлийг нь харуулна
            </span>
          )}
        </div>
      )}
    </div>
  );
};
