import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveTab, Language, Theme } from '../../types';
import { soundEngine, useSoundStatus } from './AudioAmbiance';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenSources: () => void;
  onToggleFamilyMode: () => void;
  isFamilyModeOpen: boolean;
  theme: Theme;
  onToggleTheme: () => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onOpenSources,
  onToggleFamilyMode,
  isFamilyModeOpen,
  theme,
  onToggleTheme,
}) => {
  const isMn = language === 'mn';
  const soundOn = useSoundStatus();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => panelRef.current?.focus(), 80);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
    };
  }, [isOpen, onClose]);

  const selectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    onClose();
  };

  const sections = [
    {
      groupTitle: isMn ? 'ҮНДСЭН ХЭСГҮҮД' : 'CORE NAVIGATION',
      items: [
        { id: 'landing' as ActiveTab, label: isMn ? 'Эхлэл тойм' : 'Overview Landing', icon: '🏠' },
        { id: 'map' as ActiveTab, label: isMn ? 'Галын интерактив зураг' : '4K GIS Risk Map', icon: '🗺️', highlight: true },
        { id: 'explorer' as ActiveTab, label: isMn ? 'Эрсдэлийн шинжилгээ & Лаборатори' : 'Risk Explorer & Simulation', icon: '📊' },
        { id: 'districts' as ActiveTab, label: isMn ? '9 дүүргийн харьцуулалт' : '9 Districts Analysis', icon: '🏙️' },
      ],
    },
    {
      groupTitle: isMn ? 'ТАНДАЛТ БА ХЯНАЛТ' : 'INTELLIGENCE & DATA',
      items: [
        { id: 'overview' as ActiveTab, label: isMn ? 'Нийслэлийн нэгдсэн самбар' : 'Metropolitan Dashboard', icon: '📈' },
        { id: 'calendar' as ActiveTab, label: isMn ? '12 сарын улирлын хуанли' : '12-Month Risk Calendar', icon: '📅' },
        { id: 'weather' as ActiveTab, label: isMn ? 'Цаг агаар, салхины хуурайшилт' : 'Live Weather & Wind', icon: '🌤️' },
        { id: 'incidents' as ActiveTab, label: isMn ? 'Түүхэн дуудлагын архив' : 'Historical Incidents', icon: '📍' },
        { id: 'emergency' as ActiveTab, label: isMn ? 'Гал унтраах ангийн хүртээмж' : 'Fire Stations Coverage', icon: '🚒' },
        { id: 'reports' as ActiveTab, label: isMn ? 'Статистик & Тайлан' : 'Reports & Analytics', icon: '📄' },
      ],
    },
    {
      groupTitle: isMn ? 'ИРГЭН БА АЮУЛГҮЙ БАЙДАЛ' : 'CITIZEN & SAFETY',
      items: [
        { id: 'personal' as ActiveTab, label: isMn ? 'Хувийн портал & Орон сууцны аудит' : 'Personal Portal & Audit', icon: '👤', highlight: true },
        { id: 'safety' as ActiveTab, label: isMn ? 'Галын аюулгүй байдлын зөвлөмж' : 'Safety Guidelines & Protocols', icon: '🛡️' },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] lg:hidden flex justify-end">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={isMn ? 'Үндсэн цэс' : 'Main navigation menu'}
            tabIndex={-1}
            className="relative w-full max-w-[340px] bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden focus:outline-none"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-black/[0.08] flex items-center justify-between bg-[#F7F8FA]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#0B124D] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  🔥
                </div>
                <div>
                  <span className="font-editorial text-lg font-bold text-[#0B124D]">
                    FIREWATCH<span className="text-[#FF633C] font-mono text-xs ml-1">UB</span>
                  </span>
                  <p className="text-[10px] text-[#72778A] font-mono -mt-0.5">
                    {isMn ? 'Бүх цэс & Тохиргоо' : 'Navigation & Settings'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 border border-black/[0.08] flex items-center justify-center text-[#72778A] hover:text-[#0B124D] transition-colors"
                aria-label={isMn ? 'Хаах' : 'Close menu'}
              >
                ✕
              </button>
            </div>

            {/* Quick Actions Row in Header */}
            <div className="p-3 bg-white border-b border-black/[0.06] grid grid-cols-3 gap-2 text-xs">
              {/* Language Switch */}
              <button
                onClick={() => setLanguage(language === 'mn' ? 'en' : 'mn')}
                className="py-2 px-2 rounded-xl border border-black/[0.08] bg-[#F7F8FA] font-mono font-bold text-[#0B124D] hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>🌐</span>
                <span>{language === 'mn' ? 'English' : 'Монгол'}</span>
              </button>

              {/* Sound Ambiance */}
              <button
                onClick={() => soundEngine.toggle()}
                className={`py-2 px-2 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  soundOn
                    ? 'bg-[#FF633C]/10 border-[#FF633C]/40 text-[#FF633C]'
                    : 'bg-[#F7F8FA] border-black/[0.08] text-[#72778A] hover:bg-slate-100'
                }`}
              >
                <span>{soundOn ? '🔥' : '🔇'}</span>
                <span>{soundOn ? (isMn ? 'Чимээтэй' : 'Sound on') : (isMn ? 'Дуугүй' : 'Muted')}</span>
              </button>

              {/* Emergency Call 101 */}
              <a
                href="tel:101"
                className="py-2 px-2 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center gap-1 text-center shadow-xs hover:bg-red-700 transition-colors"
              >
                <span>🚨</span>
                <span>101</span>
              </a>
            </div>

            {/* Night Mode Toggle Row */}
            <div className="px-3 pt-3">
              <button
                onClick={onToggleTheme}
                className={`w-full px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#0B124D] text-white border-[#0B124D]'
                    : 'bg-[#F7F8FA] border-black/[0.08] text-[#0B124D] hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
                  <span>{isMn ? (theme === 'dark' ? 'Шөнийн горим асаасан' : 'Шөнийн горим') : (theme === 'dark' ? 'Night mode on' : 'Night mode')}</span>
                </span>
                <span
                  className={`w-9 h-5 rounded-full relative transition-colors ${
                    theme === 'dark' ? 'bg-[#FF633C]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                      theme === 'dark' ? 'left-[18px]' : 'left-0.5'
                    }`}
                  />
                </span>
              </button>
            </div>

            {/* Scrollable Navigation Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Family Mode Quick Toggle Banner */}
              <button
                type="button"
                aria-pressed={isFamilyModeOpen}
                onClick={() => {
                  onToggleFamilyMode();
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isFamilyModeOpen
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    : 'bg-amber-50 border-amber-200/80 text-amber-950 hover:bg-amber-100/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🏡</span>
                  <div>
                    <div className="font-bold text-xs">
                      {isMn ? 'Гэр бүлийн хялбар горим' : 'Family & Elder Mode'}
                    </div>
                    <div className={`text-[10px] ${isFamilyModeOpen ? 'text-white/80' : 'text-amber-800'}`}>
                      {isMn ? 'Том үсэг, энгийн зөвлөмжүүд' : 'Enlarged text & clear essentials'}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold">
                  {isFamilyModeOpen ? (isMn ? 'Нээлттэй' : 'Open') : (isMn ? 'Нээх →' : 'Open →')}
                </span>
              </button>

              {/* Navigation Sections */}
              {sections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-[#72778A] uppercase px-1 block">
                    {sec.groupTitle}
                  </span>
                  <div className="space-y-1">
                    {sec.items.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => selectTab(item.id)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all min-h-[44px] ${
                            isActive
                              ? 'bg-[#0B124D] text-white shadow-sm'
                              : 'text-[#12152A] hover:bg-[#F7F8FA]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{item.icon}</span>
                            <span>{item.label}</span>
                          </div>
                          {item.highlight && !isActive && (
                            <span className="w-2 h-2 rounded-full bg-[#FF633C]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Data Sources and Methodology */}
              <div className="pt-2 border-t border-black/[0.06]">
                <button
                  onClick={() => {
                    onOpenSources();
                    onClose();
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#72778A] hover:bg-[#F7F8FA] hover:text-[#0B124D] flex items-center justify-between min-h-[44px]"
                >
                  <div className="flex items-center gap-2.5">
                    <span>ℹ️</span>
                    <span>{isMn ? 'Өгөгдлийн эх сурвалж & Загварчлал' : 'Data Governance & Sources'}</span>
                  </div>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-black/[0.06] bg-[#F7F8FA] text-center">
              <span className="text-[10px] font-mono text-[#72778A]">
                {isMn ? 'FIREWATCH UB · Нийслэлийн галын эрсдэлийн тандалт' : 'FIREWATCH UB · Citywide fire risk intelligence'}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
