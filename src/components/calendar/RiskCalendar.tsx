import React, { useState } from 'react';
import { Language, MonthRiskData } from '../../types';
import { MONTH_RISK_CALENDAR } from '../../data/ubGeoData';
import { getTranslation } from '../../i18n/translations';

interface RiskCalendarProps {
  language: Language;
}

export const RiskCalendar: React.FC<RiskCalendarProps> = ({ language }) => {
  const t = getTranslation(language);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(3); // April

  const activeMonth: MonthRiskData = MONTH_RISK_CALENDAR[selectedMonthIndex];

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-[#F7F8FA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="pb-6 border-b border-[#0B124D]/10">
          <span className="text-xs font-mono font-bold tracking-widest text-[#FF633C] uppercase block mb-1">
            {language === 'mn' ? '12 САРЫН ЭРСДЭЛИЙН ХУАНЛИ' : '12-MONTH ANNUAL RISK SPECTRUM'}
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B124D]">
            {language === 'mn'
              ? 'Улаанбаатарын улирлын динамик ба сар бүрийн эрсдэлийн өөрчлөлт'
              : 'Seasonal Temperature, Wind, and Heating Risk Cycles'}
          </h1>
          <p className="text-xs sm:text-sm text-[#72778A] mt-2 max-w-2xl">
            {language === 'mn'
              ? 'Түүхэн дуудлага, дундаж температур, харьцангуй чийгшил болон салхины хүчин зүйлээр тооцсон загварчлал.'
              : 'Synthesized from historical incident density, ambient temperatures, relative humidity deficits, and wind speed.'}
          </p>
        </div>

        {/* 12 Month Tiles Grid (Inspired by the Phone Mockup in Reference) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-3">
          {MONTH_RISK_CALENDAR.map((m, idx) => {
            const isSelected = selectedMonthIndex === idx;
            const isVeryHigh = m.riskScore >= 80;
            const isHigh = m.riskScore >= 60 && m.riskScore < 80;

            return (
              <button
                key={m.month}
                onClick={() => setSelectedMonthIndex(idx)}
                className={`p-4 rounded-2xl text-left transition-all relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B124D] text-white shadow-lg shadow-[#0B124D]/20 ring-2 ring-[#FF633C]'
                    : 'bg-white text-[#12152A] border border-[#0B124D]/8 hover:border-[#0B124D]/25'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold">
                    {language === 'mn' ? m.shortMn : m.shortEn}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : isVeryHigh
                        ? 'bg-red-100 text-[#E93B2F]'
                        : isHigh
                        ? 'bg-orange-100 text-[#FF633C]'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {m.riskScore}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-400 block mb-1">
                  {m.avgTempCelsius > 0 ? `+${m.avgTempCelsius}` : m.avgTempCelsius}°C
                </div>

                <div className="w-full h-1 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full ${
                      isVeryHigh
                        ? 'bg-[#E93B2F]'
                        : isHigh
                        ? 'bg-[#FF633C]'
                        : 'bg-[#12B89A]'
                    }`}
                    style={{ width: `${m.riskScore}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Month In-Depth Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Month Analytics (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-[#0B124D]/8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#0B124D]/8">
              <div>
                <span className="text-[11px] font-mono text-[#72778A] uppercase tracking-wider block mb-1">
                  {language === 'mn' ? 'Сонгосон сар' : 'Selected Month Analysis'}
                </span>
                <h2 className="font-editorial text-3xl font-bold text-[#0B124D]">
                  {language === 'mn' ? activeMonth.nameMn : activeMonth.nameEn}
                </h2>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-[#72778A] uppercase block">
                  {language === 'mn' ? 'ЭРСДЭЛИЙН АНАЛИТИК ҮЗҮҮЛЭЛТ' : 'SEASONAL RISK INDICATOR'}
                </span>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`font-mono text-4xl font-bold ${
                      activeMonth.riskScore >= 80
                        ? 'text-[#E93B2F]'
                        : activeMonth.riskScore >= 60
                        ? 'text-[#FF633C]'
                        : 'text-[#12B89A]'
                    }`}
                  >
                    {activeMonth.riskScore}
                  </span>
                  <span className="font-mono text-xs text-[#72778A]">
                    / 100 ({t.riskLevels[activeMonth.riskLevel]})
                  </span>
                </div>
              </div>
            </div>

            {/* Context Prose */}
            <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#0B124D]/5 text-sm text-[#12152A] leading-relaxed italic">
              "{language === 'mn' ? activeMonth.seasonContextMn : activeMonth.seasonContextEn}"
            </div>

            {/* Meteorological Inputs */}
            <div>
              <h4 className="font-mono text-xs font-bold text-[#0B124D] uppercase tracking-wider mb-3">
                {language === 'mn' ? 'ЦАГ УУРЫН СУУРЬ ҮЗҮҮЛЭЛТҮҮД' : 'METEOROLOGICAL VECTORS'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#0B124D]/5">
                  <span className="text-[10px] text-[#72778A] block mb-1">
                    {language === 'mn' ? 'Дундаж температур' : 'Avg Temperature'}
                  </span>
                  <span className="font-mono text-xl font-bold text-[#0B124D]">
                    {activeMonth.avgTempCelsius}°C
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#0B124D]/5">
                  <span className="text-[10px] text-[#72778A] block mb-1">
                    {language === 'mn' ? 'Агаарын харьцангуй чийгшил' : 'Relative Humidity'}
                  </span>
                  <span className="font-mono text-xl font-bold text-[#0B124D]">
                    {activeMonth.relativeHumidity}%
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#0B124D]/5">
                  <span className="text-[10px] text-[#72778A] block mb-1">
                    {language === 'mn' ? 'Салхины дундаж хурд' : 'Wind Velocity'}
                  </span>
                  <span className="font-mono text-xl font-bold text-[#0B124D]">
                    {activeMonth.windSpeedKmh} км/ц
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Risk Drivers */}
            <div>
              <h4 className="font-mono text-xs font-bold text-[#0B124D] uppercase tracking-wider mb-3">
                {language === 'mn' ? 'ГОЛ ЭРСДЭЛТ ХҮЧИН ЗҮЙЛС' : 'PRIMARY RISK DRIVERS'}
              </h4>

              <div className="space-y-2">
                {(language === 'mn' ? activeMonth.primaryDriversMn : activeMonth.primaryDriversEn).map(
                  (driver, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#F7F8FA] border border-[#0B124D]/5 flex items-center gap-3 text-xs"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#FF633C] text-white flex items-center justify-center font-mono font-bold shrink-0">
                        {i + 1}
                      </div>
                      <span className="font-semibold text-[#0B124D]">{driver}</span>
                    </div>
                  )
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Provenance & Methodology Badge (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#0B124D] text-white p-6 sm:p-8 rounded-2xl shadow-xs space-y-4">
              <span className="text-[10px] font-mono text-[#FF633C] uppercase tracking-widest font-bold block">
                {language === 'mn' ? 'ӨГӨГДЛИЙН АНГИЛАЛ' : 'DATA TYPE DISTINCTION'}
              </span>

              <div className="space-y-3 text-xs">
                <div className="pb-3 border-b border-white/10">
                  <span className="font-bold text-white block mb-0.5">
                    ● {language === 'mn' ? 'Түүхэн өгөгдөл' : 'Historical Data'}
                  </span>
                  <p className="text-white/70 text-[11px]">
                    {language === 'mn'
                      ? 'Өнгөрсөн 3-5 жилийн ЦУОШГ болон онцгой байдлын нэгтгэсэн бүртгэл.'
                      : 'Aggregated from multi-year NEMA logs and national meteorological records.'}
                  </p>
                </div>

                <div className="pb-3 border-b border-white/10">
                  <span className="font-bold text-[#FF633C] block mb-0.5">
                    ● {language === 'mn' ? 'Загварчилсан тооцоолол' : 'Modelled / Estimated'}
                  </span>
                  <p className="text-white/70 text-[11px]">
                    {language === 'mn'
                      ? 'Хүйтний оргил ба хуурайшилтын өдрүүдийн эрсдэлийг тооцоолсон аналитик матриц.'
                      : 'Derived from multi-variable normalization formulas and historical seasonal curves.'}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-[#12B89A] block mb-0.5">
                    ● {language === 'mn' ? 'Бодит цагийн тандалт' : 'Current Weather Input'}
                  </span>
                  <p className="text-white/70 text-[11px]">
                    {language === 'mn'
                      ? 'Одоогийн салхи, чийгшлийн нөхцөлтэй динамикаар холбогдоно.'
                      : 'Live weather sensor integration adjusts real-time deviations.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
