import React from 'react';
import { Language } from '../../types';

interface RealPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  photoUrl: string;
  satelliteUrl?: string;
  descriptionMn?: string;
  descriptionEn?: string;
  riskScore?: number;
  language: Language;
  metrics?: { label: string; value: string }[];
}

export const RealPhotoModal: React.FC<RealPhotoModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  photoUrl,
  satelliteUrl,
  descriptionMn,
  descriptionEn,
  riskScore,
  language,
  metrics,
}) => {
  const [viewType, setViewType] = React.useState<'photo' | 'satellite'>('photo');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#0B124D] text-white w-full max-w-4xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#FF633C]/20 text-[#FF633C] text-sm">
              📷
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block">
                {language === 'mn' ? 'БОДИТ ОРОН ЗАЙН ХАРАГДАЦ' : 'REAL SPATIAL INSPECTION'}
              </span>
              <h3 className="font-editorial text-2xl font-bold tracking-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-white/60 font-mono">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher: Real Photo vs Satellite Tile */}
            {satelliteUrl && (
              <div className="flex items-center bg-white/10 p-1 rounded-full text-xs font-semibold">
                <button
                  onClick={() => setViewType('photo')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    viewType === 'photo'
                      ? 'bg-white text-[#0B124D]'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {language === 'mn' ? 'Бодит зураг' : 'Ground Photo'}
                </button>
                <button
                  onClick={() => setViewType('satellite')}
                  className={`px-3 py-1 rounded-full transition-all ${
                    viewType === 'satellite'
                      ? 'bg-[#FF633C] text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {language === 'mn' ? 'Хиймэл дагуул' : 'Satellite 4K'}
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Хаах"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Main Visual Display */}
          <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-inner group">
            <img
              src={viewType === 'photo' ? photoUrl : (satelliteUrl || photoUrl)}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Overlay Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/20">
                {viewType === 'photo' ? '📍 Бодит гэрэл зураг' : '🛰️ 4K Ортофото зураг'}
              </span>
              {riskScore !== undefined && (
                <span className="px-3 py-1 rounded-full bg-[#FF633C] text-white font-mono text-xs font-bold shadow-md">
                  Эрсдэл: {riskScore}/100
                </span>
              )}
            </div>

            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-mono text-white/60">
              Ulaanbaatar High-Resolution GIS Imagery
            </div>
          </div>

          {/* Description & Field Observations */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF633C] font-semibold block mb-1">
              {language === 'mn' ? 'Байршлын бодит нөхцөл байдал' : 'Field Condition Report'}
            </span>
            <p className="text-sm text-white/90 leading-relaxed">
              {language === 'mn' ? descriptionMn : descriptionEn}
            </p>
          </div>

          {/* Metrics Grid */}
          {metrics && metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {metrics.map((m, idx) => (
                <div key={idx} className="bg-white/5 p-3 rounded-2xl border border-white/10">
                  <span className="text-[10px] font-mono text-white/50 block mb-0.5">
                    {m.label}
                  </span>
                  <span className="font-mono text-sm font-bold text-white">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-black/30 flex items-center justify-between">
          <span className="text-xs text-white/50 font-mono">
            Эх сурвалж: Нийслэлийн газарзүйн мэдээллийн нэгдсэн сан & ОБЕГ
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white text-[#0B124D] hover:bg-slate-100 rounded-xl text-xs font-bold transition-all active:scale-95"
          >
            {language === 'mn' ? 'Ойлголоо, хаах' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
