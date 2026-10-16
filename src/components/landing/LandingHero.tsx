import React, { useState } from 'react';
import { ActiveTab, Language } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { MONTH_RISK_CALENDAR } from '../../data/ubGeoData';
import { FireAnimation } from '../common/FireAnimation';
import { AmbientFireBackground } from '../common/AmbientFireBackground';

interface LandingHeroProps {
  language: Language;
  onExploreMap: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenDemoInfo: () => void;
  onOpenFamilyMode?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  language,
  onExploreMap,
  onSelectTab,
  onOpenDemoInfo,
  onOpenFamilyMode,
}) => {
  const t = getTranslation(language);
  const [activeSolutionIdx, setActiveSolutionIdx] = useState<number>(0);
  const [phoneMonthIdx, setPhoneMonthIdx] = useState<number>(3); // April (month 4)

  const solutions = [
    {
      num: '01',
      title: t.solution1Title,
      desc: t.solution1Desc,
      tag: language === 'mn' ? 'Хяналт & Тандалт' : 'Surveillance',
      tabTarget: 'map' as ActiveTab,
      icon: '🗺️',
    },
    {
      num: '02',
      title: t.solution2Title,
      desc: t.solution2Desc,
      tag: language === 'mn' ? 'Олон хүчин зүйл' : 'Multi-Factor',
      tabTarget: 'explorer' as ActiveTab,
      icon: '📊',
    },
    {
      num: '03',
      title: t.solution3Title,
      desc: t.solution3Desc,
      tag: language === 'mn' ? 'Бүс нутаг' : 'Zonal Action',
      tabTarget: 'districts' as ActiveTab,
      icon: '🏙️',
    },
    {
      num: '04',
      title: t.solution4Title,
      desc: t.solution4Desc,
      tag: language === 'mn' ? 'Олон нийт' : 'Civil Safety',
      tabTarget: 'safety' as ActiveTab,
      icon: '🛡️',
    },
  ];

  const selectedMonth = MONTH_RISK_CALENDAR[phoneMonthIdx];

  return (
    <div className="w-full bg-[#F7F8FA]">
      <div className="max-w-[1440px] mx-auto min-h-[calc(100vh-65px)] grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* ========================================================= */}
        {/* LEFT PANEL: Deep Navy Visual Foundation with Live Fire    */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 bg-[#0B124D] text-white p-5 sm:p-8 md:p-12 lg:p-14 flex flex-col justify-between relative overflow-hidden">
          
          {/* Ambient Living Fire Thermal Background */}
          <AmbientFireBackground intensity={1.15} />

          {/* Subtle noise/grid background overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(#FFFFFF 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Top Label & Page Indicator */}
          <div className="flex items-center justify-between text-xs tracking-wider text-white/60 font-mono z-10">
            <span className="uppercase font-semibold tracking-widest text-[#FF633C] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF633C] animate-pulse" />
              {t.startupLabel}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-white/40">{t.pageIndicator}</span>
              <span className="inline-block w-8 h-[1px] bg-white/20" />
            </div>
          </div>

          {/* Core Brand & Live Fire Emblem */}
          <div className="my-6 lg:my-10 z-10">
            
            {/* Organic Fluid Fire Showcase Glass Vitrine */}
            <div className="w-44 h-52 sm:w-52 sm:h-60 rounded-[32px] sm:rounded-[36px] bg-gradient-to-b from-white/12 to-white/5 backdrop-blur-2xl border border-white/20 flex flex-col items-center justify-between p-3 mb-6 shadow-[0_16px_50px_rgba(255,99,60,0.3)] relative group transition-all duration-300 hover:scale-105 active:scale-95 mx-auto sm:mx-0">
              <div className="w-full flex items-center justify-between text-[10px] font-mono text-white/60 px-2 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF633C] animate-pulse" />
                  <span>LIVING FLAME</span>
                </span>
                <span className="text-[#FF633C] font-bold">CLICK TO KINDLE</span>
              </div>

              <FireAnimation
                size="md"
                intensity="high"
                interactive={true}
                className="my-auto"
              />

              <div className="text-[10px] text-white/60 font-mono text-center pb-1">
                {language === 'mn' ? 'Хулганаар налуулж, дарж оч үсэргэх' : 'Drag draft or click to spark'}
              </div>

              <div className="absolute inset-0 bg-radial from-[#FF633C]/25 via-transparent to-transparent rounded-[32px] sm:rounded-[36px] -z-10 group-hover:from-[#FF633C]/45 transition-colors pointer-events-none" />
            </div>

            {/* Giant Title with Apple-grade tight tracking */}
            <h1 className="font-editorial text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.05] mb-4 text-balance">
              FIREWATCH<br />
              <span className="text-[#FF633C] font-mono text-2xl sm:text-4xl font-semibold">UB</span>
            </h1>

            {/* Editorial Tagline */}
            <p className="font-editorial text-lg sm:text-2xl text-white/90 leading-snug font-normal mb-6 italic text-balance">
              “{t.tagline}”
            </p>

            {/* Direction Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-mono tracking-wide mb-6 sm:mb-8 border border-white/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#12B89A]" />
              <span className="truncate">{t.directionPill}</span>
            </div>

            {/* Large Statistic Treatment */}
            <div className="pt-5 border-t border-white/10">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-4xl sm:text-6xl font-bold tracking-tight text-white tabular-nums">
                  1,937
                </span>
                <span className="text-xs font-mono text-[#FF633C] uppercase tracking-wider font-semibold">
                  records
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-xs text-white/70">
                  {language === 'mn'
                    ? 'Шинжилгээнд хамруулсан орон зайн дуудлагын өгөгдөл'
                    : 'Historical spatial incident records modeled'}
                </p>
                <button
                  onClick={onOpenDemoInfo}
                  className="text-[10px] font-mono bg-white/15 hover:bg-white/25 text-white/90 px-2 py-0.5 rounded-full transition-colors whitespace-nowrap"
                >
                  {t.demoMode.split('·')[0].trim()}
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Left Quick Meta */}
          <div className="z-10 pt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-white/50 border-t border-white/10 font-mono">
            <span>Ulaanbaatar · Mongolia</span>
            <span>Spatial Engine · Apple Grade</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT PANEL: White Storytelling & Interactive Mockup      */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 bg-[#FFFFFF] p-5 sm:p-8 md:p-12 lg:p-14 flex flex-col justify-between overflow-hidden">
          <div>
            
            {/* Alert Header Icon + Problem Kicker */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#FF633C]/10 flex items-center justify-center text-[#FF633C] shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono font-bold tracking-widest text-[#FF633C] uppercase">
                  {t.problemKicker}
                </span>
                <span className="text-xs text-[#72778A]">
                  {language === 'mn' ? 'Улаанбаатарын орон зайн сорилт' : 'Urban Vulnerability Matrix'}
                </span>
              </div>
            </div>

            {/* Headline Prose */}
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0B124D] leading-snug mb-3 text-balance">
              {t.problemTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#72778A] leading-relaxed mb-8 max-w-2xl text-balance">
              {t.problemText}
            </p>

            {/* Solution Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#12B89A]" />
                <span className="text-xs font-mono font-bold tracking-wider text-[#0B124D] uppercase">
                  {t.solutionKicker}
                </span>
              </div>
              <span className="text-xs text-[#72778A]">
                {language === 'mn' ? '4 үндсэн тулгуур' : '4 Core Pillars'}
              </span>
            </div>

            {/* 4 Numbered Solution Blocks with Apple-grade card styling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
              {solutions.map((item, idx) => {
                const isActive = activeSolutionIdx === idx;
                return (
                  <div
                    key={item.num}
                    onClick={() => {
                      setActiveSolutionIdx(idx);
                      onSelectTab(item.tabTarget);
                    }}
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left group ${
                      isActive
                        ? 'border-[#FF633C] bg-orange-50/50 shadow-sm'
                        : 'border-black/[0.06] hover:border-black/20 hover:bg-[#F7F8FA] hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-7 h-7 rounded-full bg-[#FF633C] text-white flex items-center justify-center font-mono text-xs font-bold shrink-0 shadow-xs">
                        {item.num}
                      </div>
                      <span className="text-[11px] font-mono text-[#72778A] group-hover:text-[#0B124D]">
                        {item.tag} →
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[#0B124D] mb-1 leading-snug flex items-center gap-1.5">
                      <span>{item.icon}</span>
                      <span>{item.title}</span>
                    </h3>
                    <p className="text-xs text-[#72778A] leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Interactive Smartphone App Preview Frame */}
          <div className="pt-6 border-t border-black/[0.06]">
            <div className="flex flex-col xl:flex-row items-center gap-6 bg-[#F7F8FA] p-3 sm:p-6 rounded-2xl sm:rounded-3xl border border-black/[0.05] w-full max-w-full overflow-hidden">
              
              {/* Phone Frame */}
              <div className="w-full max-w-[260px] sm:max-w-[290px] bg-[#0B124D] rounded-[36px] sm:rounded-[40px] p-2.5 sm:p-3 shadow-2xl ring-1 ring-black/10 shrink-0 mx-auto xl:mx-0">
                <div className="bg-white rounded-[28px] sm:rounded-[32px] p-3.5 sm:p-4 text-[#12152A] overflow-hidden flex flex-col justify-between min-h-[360px] sm:min-h-[380px]">
                  
                  {/* Phone Header */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF633C]" />
                        <span className="font-bold tracking-tight text-[#0B124D]">FIREWATCH UB</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">LIVE APP</span>
                    </div>

                    {/* Current Week Risk Indicator */}
                    <div className="mt-2.5 sm:mt-3 bg-red-50 p-2 sm:p-2.5 rounded-2xl border border-red-100">
                      <span className="text-[10px] text-red-600 font-medium block">
                        {t.phoneBadgeWeek}
                      </span>
                      <div className="flex items-baseline justify-between mt-0.5">
                        <span className="font-editorial text-base sm:text-lg font-bold text-[#E93B2F]">
                          {selectedMonth.riskLevel === 'very_high'
                            ? (language === 'mn' ? 'МАШ ӨНДӨР' : 'VERY HIGH')
                            : selectedMonth.riskLevel === 'high'
                            ? (language === 'mn' ? 'ӨНДӨР ЭРСДЭЛ' : 'HIGH RISK')
                            : (language === 'mn' ? 'ДУНД ЭРСДЭЛ' : 'MODERATE')}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#E93B2F] tabular-nums">
                          {selectedMonth.riskScore} / 100
                        </span>
                      </div>
                    </div>

                    {/* 12-Month Mini Calendar Strip */}
                    <div className="mt-2.5 sm:mt-3">
                      <span className="text-[10px] font-semibold text-slate-500 block mb-1.5">
                        {t.phoneCalendarTitle} ({selectedMonth.nameMn})
                      </span>
                      <div className="grid grid-cols-6 gap-1">
                        {MONTH_RISK_CALENDAR.map((m, i) => {
                          const isSel = phoneMonthIdx === i;
                          const isHigh = m.riskScore >= 75;
                          return (
                            <button
                              key={m.month}
                              onClick={() => setPhoneMonthIdx(i)}
                              className={`py-1 rounded-lg text-[10px] font-mono font-bold transition-all text-center ${
                                isSel
                                  ? 'bg-[#0B124D] text-white shadow-xs'
                                  : isHigh
                                  ? 'bg-orange-100 text-[#FF633C] hover:bg-orange-200'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {m.month}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* 3 Preventive Steps */}
                  <div className="mt-2.5 sm:mt-3 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-500 block mb-1.5">
                      {t.phoneStepsTitle}
                    </span>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#FF633C] text-white text-[9px] font-mono flex items-center justify-center font-bold shrink-0">
                          1
                        </span>
                        <span className="truncate">{t.phoneStep1}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#FF633C] text-white text-[9px] font-mono flex items-center justify-center font-bold shrink-0">
                          2
                        </span>
                        <span className="truncate">{t.phoneStep2}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <span className="w-3.5 h-3.5 rounded-full bg-[#FF633C] text-white text-[9px] font-mono flex items-center justify-center font-bold shrink-0">
                          3
                        </span>
                        <span className="truncate">{t.phoneStep3}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mini Map preview button */}
                  <button
                    onClick={onExploreMap}
                    className="w-full mt-2.5 sm:mt-3 py-2 text-[11px] font-bold text-center bg-[#0B124D] hover:bg-[#11166B] text-white rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 active:scale-95"
                  >
                    <span>{t.viewRiskMap}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Story Description & Action buttons */}
              <div className="flex-1 text-left w-full min-w-0">
                <span className="text-xs font-mono font-bold text-[#FF633C] uppercase tracking-wider block mb-1">
                  {language === 'mn' ? 'ИРГЭНД ЧИГЛЭСЭН ТЕХНОЛОГИ' : 'HUMAN-CENTERED INTELLIGENCE'}
                </span>
                <h4 className="font-editorial text-lg sm:text-xl font-bold text-[#0B124D] mb-2 leading-snug">
                  {language === 'mn'
                    ? 'Ахмад настан, хүүхэд гэр бүл бүр хараад шууд ойлгох энгийн шийдэл'
                    : 'Clear, compassionate spatial safety designed for families and elders'}
                </h4>
                <p className="text-xs text-[#72778A] leading-relaxed mb-4">
                  {language === 'mn'
                    ? 'Хотын дүүрэг, хорооны халаалтын улирал, салхины хуурайшилт, хамгийн ойрын гал түймэр унтраах ангийн хүртээмжийг гар утас болон компьютер дээр бодит цаг хугацаанд хянана.'
                    : 'Track seasonal heating shifts, wind desiccation, and station coverage buffers seamlessly.'}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={onExploreMap}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold text-white bg-[#FF633C] hover:bg-[#e05430] rounded-xl transition-all shadow-md shadow-[#FF633C]/20 flex items-center gap-1.5 active:scale-95"
                  >
                    <span>{t.ctaButton}</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => onSelectTab('personal')}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold text-[#0B124D] bg-[#0B124D]/8 hover:bg-[#0B124D]/15 rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <span>👤</span>
                    <span>{language === 'mn' ? 'Хувийн сууц' : 'Home Audit'}</span>
                  </button>
                  {onOpenFamilyMode && (
                    <button
                      onClick={onOpenFamilyMode}
                      className="px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold text-amber-900 bg-amber-500/15 hover:bg-amber-500/25 rounded-xl transition-colors border border-amber-500/20 flex items-center gap-1.5"
                    >
                      <span>🏡</span>
                      <span>{language === 'mn' ? 'Гэр бүл' : 'Family'}</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
