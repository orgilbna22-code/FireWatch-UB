import React, { useState } from 'react';
import { ActiveTab, Language, ViewMode } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { soundEngine } from './AudioAmbiance';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onOpenDemoInfo: () => void;
  onToggleFamilyMode?: () => void;
  isFamilyModeOpen?: boolean;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  viewMode,
  setViewMode,
  onOpenDemoInfo,
  onToggleFamilyMode,
  isFamilyModeOpen,
  onOpenMobileMenu,
}) => {
  const t = getTranslation(language);
  const [soundOn, setSoundOn] = useState(false);

  const mainNavItems: { id: ActiveTab; label: string }[] = [
    { id: 'landing', label: language === 'mn' ? 'Эхлэл' : 'Overview' },
    { id: 'map', label: t.navMap },
    { id: 'explorer', label: t.navExplorer },
    { id: 'districts', label: t.navDistricts },
    { id: 'personal', label: language === 'mn' ? '👤 Хувийн танхим' : '👤 Personal Hub' },
    { id: 'safety', label: t.navSafety },
  ];

  const secondaryNavItems: { id: ActiveTab; label: string }[] = [
    { id: 'calendar', label: t.navCalendar },
    { id: 'overview', label: t.navOverview },
    { id: 'incidents', label: t.navIncidents },
    { id: 'emergency', label: t.navEmergency },
    { id: 'weather', label: t.navWeather },
    { id: 'reports', label: t.navReports },
    { id: 'sources', label: t.navSources },
  ];

  const toggleSound = () => {
    const s = soundEngine.toggle();
    setSoundOn(s);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-2xl border-b border-black/[0.06] px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Zone 1: Single text element wordmark + Apple-style subtle flame */}
        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF633C] rounded-2xl p-1 -ml-1 transition-transform active:scale-95 shrink-0"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-[#0B124D] to-[#11166B] flex items-center justify-center text-white shrink-0 shadow-sm shadow-[#0B124D]/20 group-hover:scale-105 transition-all">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF633C"
              strokeWidth="2.4"
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
            >
              <path d="M12 2C8 6 6 9 6 13a6 6 0 0 0 12 0c0-4-2-7-6-11z" />
              <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="#FFFFFF" stroke="none" />
            </svg>
          </div>
          <span className="font-editorial text-lg sm:text-xl font-bold tracking-tight text-[#0B124D] whitespace-nowrap">
            FIREWATCH<span className="text-[#FF633C] font-mono text-xs ml-1 font-semibold tracking-normal">UB</span>
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links with smooth hover and active state (Desktop Only) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#F7F8FA]/90 p-1 rounded-full border border-black/[0.04]">
          {mainNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all duration-200 relative ${
                  isActive
                    ? 'bg-white text-[#0B124D] shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                    : 'text-[#72778A] hover:text-[#0B124D]'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* More Dropdown */}
          <div className="relative group">
            <button className="px-3 py-1.5 text-xs font-semibold rounded-full text-[#72778A] hover:text-[#0B124D] transition-colors flex items-center gap-1">
              <span>{language === 'mn' ? 'Бусад' : 'More'}</span>
              <svg className="w-3 h-3 transition-transform group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="absolute top-full right-0 mt-1.5 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-black/[0.06] p-1.5 hidden group-hover:block group-focus-within:block z-50 animate-in fade-in zoom-in-95 duration-150">
              {secondaryNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium rounded-xl transition-colors ${
                    activeTab === item.id
                      ? 'bg-[#0B124D]/5 text-[#0B124D] font-semibold'
                      : 'text-[#72778A] hover:bg-[#F7F8FA] hover:text-[#0B124D]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Desktop Only: Personal Profile & Creator Chip */}
          <button
            onClick={() => setActiveTab('personal')}
            className={`hidden lg:flex px-3 py-1.5 rounded-full text-xs font-semibold items-center gap-1.5 transition-all ${
              activeTab === 'personal'
                ? 'bg-[#0B124D] text-white shadow-sm ring-2 ring-[#FF633C]/40'
                : 'bg-[#0B124D]/5 text-[#0B124D] hover:bg-[#0B124D]/10'
            }`}
            title="Хувийн портал ба Зохиогчийн хуудас"
          >
            <span className="w-4 h-4 rounded-full bg-[#FF633C] text-white flex items-center justify-center font-bold text-[9px]">
              O
            </span>
            <span className="font-bold">
              {language === 'mn' ? 'Хувийн' : 'Personal'}
            </span>
          </button>

          {/* Large Desktop Only: Family & Elder Quick Mode Button */}
          {onToggleFamilyMode && (
            <button
              onClick={onToggleFamilyMode}
              className={`hidden xl:flex px-3 py-1.5 rounded-full text-xs font-semibold items-center gap-1.5 transition-all ${
                isFamilyModeOpen
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-amber-500/10 text-amber-900 hover:bg-amber-500/20'
              }`}
              title="Хүүхэд, ахмадуудад зориулсан хялбаршуулсан төлөв"
            >
              <span>🏡</span>
              <span>
                {language === 'mn' ? 'Гэр бүл' : 'Family'}
              </span>
            </button>
          )}

          {/* Audio Ambient Fireplace Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-full text-xs w-9 h-9 flex items-center justify-center transition-all ${
              soundOn
                ? 'bg-[#FF633C]/10 text-[#FF633C]'
                : 'text-[#72778A] hover:text-[#0B124D] hover:bg-black/5'
            }`}
            title={soundOn ? 'Галын намуун чимээг хаах' : 'Галын намуун чимээ асаах'}
            aria-label="Галын чимээ асаах/унтраах"
          >
            {soundOn ? '🔥' : '🔇'}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'mn' ? 'en' : 'mn')}
            className="w-9 h-9 text-xs font-mono font-bold text-[#0B124D] hover:bg-[#0B124D]/5 rounded-full transition-colors border border-black/[0.08] flex items-center justify-center shrink-0"
            aria-label="Toggle language"
          >
            {language === 'mn' ? 'EN' : 'MN'}
          </button>

          {/* Primary CTA (View Map - Desktop only so header fits cleanly on mobile) */}
          <button
            onClick={() => setActiveTab('map')}
            className={`hidden lg:flex px-4 py-1.5 text-xs font-semibold rounded-full transition-all shadow-sm active:scale-95 whitespace-nowrap min-h-[36px] items-center justify-center ${
              activeTab === 'map'
                ? 'bg-[#FF633C] text-white ring-2 ring-[#FF633C]/40'
                : 'bg-[#0B124D] hover:bg-[#11166B] text-white'
            }`}
          >
            <span>{t.viewRiskMap}</span>
          </button>

          {/* Mobile Menu Trigger Button (Always visible on mobile & tablet) */}
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0B124D] flex items-center justify-center transition-colors text-base font-bold shrink-0 shadow-2xs"
              aria-label="Цэс нээх"
              title="Бүх цэс нээх"
            >
              ☰
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
