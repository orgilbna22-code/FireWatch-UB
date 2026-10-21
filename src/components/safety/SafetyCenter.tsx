import React, { useState } from 'react';
import { Language } from '../../types';
import { SAFETY_GUIDES, SafetyGuide } from '../../data/safetyData';

interface SafetyCenterProps {
  language: Language;
}

export const SafetyCenter: React.FC<SafetyCenterProps> = ({ language }) => {
  const [selectedGuideId, setSelectedGuideId] = useState<string>(SAFETY_GUIDES[0].id);
  const [searchFilter, setSearchFilter] = useState('');

  const filteredGuides = SAFETY_GUIDES.filter((g) => {
    const q = searchFilter.toLowerCase();
    return (
      g.titleMn.toLowerCase().includes(q) ||
      g.titleEn.toLowerCase().includes(q) ||
      g.summaryMn.toLowerCase().includes(q)
    );
  });

  const activeGuide: SafetyGuide =
    SAFETY_GUIDES.find((g) => g.id === selectedGuideId) || SAFETY_GUIDES[0];

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-[#F7F8FA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#0B124D]/10">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-[#FF633C] uppercase block mb-1">
              {language === 'mn' ? 'АЮУЛГҮЙ БАЙДЛЫН БОЛОВСРОЛЫН ТӨВ' : 'CIVIL SAFETY KNOWLEDGE CENTER'}
            </span>
            <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B124D]">
              {language === 'mn'
                ? 'Амь нас, эд хөрөнгийг хамгаалах албан ёсны зааварчилгаа'
                : 'Verified Protocols, Practical Procedures & Evacuation Knowledge'}
            </h1>
          </div>

          {/* Quick Search */}
          <div className="w-full md:w-72">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={language === 'mn' ? 'Сэдвээр хайх...' : 'Search safety topics...'}
              className="w-full px-4 py-2 bg-white rounded-xl text-xs border border-[#0B124D]/10 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#FF633C]"
            />
          </div>
        </div>

        {/* 2-Column Layout: Sidebar of 7 Topics + Rich Reading Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Topics List (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            {filteredGuides.map((guide) => {
              const isSelected = guide.id === activeGuide.id;
              return (
                <button
                  key={guide.id}
                  onClick={() => setSelectedGuideId(guide.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all border flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#0B124D] text-white border-[#0B124D] shadow-md'
                      : 'bg-white text-[#0B124D] border-[#0B124D]/8 hover:border-[#0B124D]/25'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full font-mono text-xs font-bold flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#FF633C] text-white' : 'bg-[#F7F8FA] text-[#72778A]'
                      }`}
                    >
                      {guide.topicNumber}
                    </span>
                    <span className="font-bold text-xs sm:text-sm">
                      {language === 'mn' ? guide.titleMn : guide.titleEn}
                    </span>
                  </div>
                  <span
                    className={`text-xs ${
                      isSelected ? 'text-[#FF633C]' : 'text-slate-300 group-hover:text-[#0B124D]'
                    }`}
                  >
                    →
                  </span>
                </button>
              );
            })}
          </div>

          {/* Guide Deep Dive (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-2xl border border-[#0B124D]/8 shadow-xs space-y-8">
            
            {/* Guide Header */}
            <div className="pb-6 border-b border-[#0B124D]/8">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-full bg-[#FF633C] text-white font-mono text-xs font-bold flex items-center justify-center">
                  {activeGuide.topicNumber}
                </span>
                <span className="text-xs font-mono font-bold text-[#FF633C] uppercase">
                  {language === 'mn' ? 'СЭДЭВ' : 'TOPIC'}
                </span>
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0B124D]">
                {language === 'mn' ? activeGuide.titleMn : activeGuide.titleEn}
              </h2>
              <p className="text-sm text-[#72778A] mt-2 leading-relaxed">
                {language === 'mn' ? activeGuide.summaryMn : activeGuide.summaryEn}
              </p>
            </div>

            {/* Key Practical Steps */}
            <div>
              <h3 className="font-mono text-xs font-bold text-[#0B124D] uppercase tracking-wider mb-4">
                {language === 'mn' ? 'ХЭРЭГЖҮҮЛЭХ АЛХМУУД' : 'ACTIONABLE PROCEDURES'}
              </h3>

              <div className="space-y-4">
                {activeGuide.keySteps.map((step) => (
                  <div
                    key={step.step}
                    className="p-5 rounded-xl bg-[#F7F8FA] border border-[#0B124D]/5 text-xs"
                  >
                    <div className="flex items-center gap-2 font-bold text-sm text-[#0B124D] mb-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#0B124D] text-white font-mono text-[10px] flex items-center justify-center">
                        {step.step}
                      </span>
                      <span>{language === 'mn' ? step.actionMn : step.actionEn}</span>
                    </div>
                    <p className="text-[#72778A] leading-relaxed pl-7">
                      {language === 'mn' ? step.detailsMn : step.detailsEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Red Rules */}
            <div className="p-6 rounded-2xl bg-red-50 border border-red-100">
              <h4 className="font-mono text-xs font-bold text-[#E93B2F] uppercase tracking-wider mb-3">
                ⚠️ {language === 'mn' ? 'ХАТУУ АНХААРАХ ШААРДЛАГУУД' : 'CRITICAL SAFETY MANDATES'}
              </h4>
              <ul className="space-y-2 text-xs text-[#E93B2F] leading-relaxed">
                {(language === 'mn' ? activeGuide.criticalRulesMn : activeGuide.criticalRulesEn).map(
                  (rule, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-bold">•</span>
                      <span>{rule}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Source Attribution */}
            <div className="pt-4 border-t border-[#0B124D]/8 flex items-center justify-between text-[11px] font-mono text-[#72778A]">
              <span>
                {language === 'mn' ? 'Албан ёсны эх сурвалж' : 'Official Citation'}:{' '}
                {language === 'mn' ? activeGuide.officialSourceMn : activeGuide.officialSourceEn}
              </span>
              <span>101 / 105 {language === 'mn' ? 'ОБЕГ' : 'NEMA'}</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
