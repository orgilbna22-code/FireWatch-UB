import React from 'react';
import { ActiveTab, Language, ViewMode } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { UB_DISTRICTS, UB_FIRE_STATIONS, DEMO_HISTORICAL_INCIDENTS, CURRENT_UB_WEATHER } from '../../data/ubGeoData';

interface OverviewDashboardProps {
  language: Language;
  viewMode: ViewMode;
  onSelectTab: (tab: ActiveTab) => void;
  onSelectDistrict: (districtId: string) => void;
  onOpenDemoInfo: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  language,
  viewMode,
  onSelectTab,
  onSelectDistrict,
  onOpenDemoInfo,
}) => {
  const t = getTranslation(language);

  // Compute aggregate indicators
  const totalIncidents = DEMO_HISTORICAL_INCIDENTS.length;
  const avgRiskScore = Math.round(
    UB_DISTRICTS.reduce((acc, d) => acc + d.riskScore, 0) / UB_DISTRICTS.length
  );
  const totalMonitoredPop = UB_DISTRICTS.reduce((acc, d) => acc + d.population, 0);
  const highestRiskDistrict = [...UB_DISTRICTS].sort((a, b) => b.riskScore - a.riskScore)[0];

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-[#F7F8FA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title & Data Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#0B124D]/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold tracking-widest text-[#FF633C] uppercase">
                FIREWATCH UB · {language === 'mn' ? 'ЕРӨНХИЙ ТОЙМ' : 'OVERVIEW'}
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-xs text-[#72778A]">
                {viewMode === 'pro'
                  ? (language === 'mn' ? 'Мэргэжлийн хяналт' : 'Institutional Cockpit')
                  : (language === 'mn' ? 'Олон нийтийн тойм' : 'Public Intelligence')}
              </span>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B124D]">
              {language === 'mn'
                ? 'Улаанбаатар хотын галын эрсдэлийн нэгдсэн төлөв'
                : 'Metropolitan Fire-Risk Intelligence Overview'}
            </h1>
          </div>

          {/* Understated Data-Status Indicator */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#0B124D]/8 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#12B89A] animate-pulse" />
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#0B124D]">
                  {language === 'mn' ? 'Өгөгдлийн статус' : 'Data Integrity'}
                </span>
                <button
                  onClick={onOpenDemoInfo}
                  className="text-[10px] font-mono bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded"
                >
                  DEMO MODE
                </button>
              </div>
              <span className="text-[11px] text-[#72778A]">
                {language === 'mn' ? 'Сүүлийн шинэчлэл' : 'Last sync'}: 2026-09-30
              </span>
            </div>
          </div>
        </div>

        {/* 5 Analytical Scorecards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          <div className="p-5 rounded-2xl bg-white border border-[#0B124D]/8 shadow-xs">
            <span className="text-[11px] font-mono text-[#72778A] block mb-1">
              {t.stats.avgRiskScore}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-3xl sm:text-4xl font-bold text-[#FF633C] tabular-nums">
                {avgRiskScore}
              </span>
              <span className="text-xs text-[#72778A]">/100</span>
            </div>
            <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded inline-block mt-2">
              {language === 'mn' ? 'Дундаж түвшин' : 'Moderate Threshold'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#0B124D]/8 shadow-xs">
            <span className="text-[11px] font-mono text-[#72778A] block mb-1">
              {t.stats.districtsCovered}
            </span>
            <div className="font-mono text-3xl sm:text-4xl font-bold text-[#0B124D] tabular-nums">
              {UB_DISTRICTS.length}
            </div>
            <span className="text-[11px] text-[#72778A] mt-2 block">
              {language === 'mn' ? 'Бүх 9 дүүрэг бүрэн' : '100% Capital coverage'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#0B124D]/8 shadow-xs">
            <span className="text-[11px] font-mono text-[#72778A] block mb-1">
              {t.stats.totalIncidentsAnalyzed}
            </span>
            <div className="font-mono text-3xl sm:text-4xl font-bold text-[#0B124D] tabular-nums">
              1,937
            </div>
            <span className="text-[11px] text-[#72778A] mt-2 block">
              {language === 'mn' ? '2022–2026 түүхэн өгөгдөл' : '2022–2026 multi-year log'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#0B124D]/8 shadow-xs">
            <span className="text-[11px] font-mono text-[#72778A] block mb-1">
              {t.stats.operationalStations}
            </span>
            <div className="font-mono text-3xl sm:text-4xl font-bold text-[#0B124D] tabular-nums">
              {UB_FIRE_STATIONS.length}
            </div>
            <span className="text-[11px] text-[#12B89A] font-medium mt-2 block">
              {language === 'mn' ? 'ОБЕГ байнгын бэлэн' : 'NEMA Active Stations'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#0B124D]/8 shadow-xs col-span-2 sm:col-span-1">
            <span className="text-[11px] font-mono text-[#72778A] block mb-1">
              {language === 'mn' ? 'Цаг агаарын хуурайшилт' : 'Fire Weather Index'}
            </span>
            <div className="font-mono text-3xl sm:text-4xl font-bold text-[#FF633C] tabular-nums">
              {CURRENT_UB_WEATHER.fireWeatherIndex}
            </div>
            <span className="text-[11px] text-[#72778A] mt-2 block">
              {CURRENT_UB_WEATHER.windSpeedKmh} км/ц · {CURRENT_UB_WEATHER.conditionMn}
            </span>
          </div>

        </div>

        {/* Two-Column Strategic Layout: District Matrix & Risk Hotspots */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: District Risk Matrix (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#0B124D]/8 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#0B124D]/8 mb-4">
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#0B124D]">
                  {language === 'mn' ? 'Дүүргүүдийн эрсдэлийн харьцуулсан матриц' : 'District Risk Comparison Matrix'}
                </h3>
                <p className="text-xs text-[#72778A]">
                  {language === 'mn' ? 'Шалгуур үзүүлэлтүүдийн нэгдсэн үнэлгээ' : 'Ranked by normalized algorithmic vulnerability score'}
                </p>
              </div>
              <button
                onClick={() => onSelectTab('map')}
                className="text-xs font-mono font-semibold text-[#0B124D] hover:text-[#FF633C] transition-colors"
              >
                {language === 'mn' ? 'Газрын зураг дээр харах →' : 'View on Map →'}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[#72778A] font-mono">
                    <th className="py-2.5 px-3">{language === 'mn' ? 'Дүүрэг' : 'District'}</th>
                    <th className="py-2.5 px-3">{language === 'mn' ? 'Хүн ам' : 'Population'}</th>
                    <th className="py-2.5 px-3">{language === 'mn' ? 'Гэр өрх %' : 'Ger %'}</th>
                    <th className="py-2.5 px-3">{language === 'mn' ? 'Ангийн зай' : 'Station Dist'}</th>
                    <th className="py-2.5 px-3">{language === 'mn' ? 'Замын зэрэг' : 'Road Access'}</th>
                    <th className="py-2.5 px-3">{language === 'mn' ? 'Эрсдэлийн оноо' : 'Risk Score'}</th>
                    <th className="py-2.5 px-3 text-right">{language === 'mn' ? 'Үйлдэл' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-interface">
                  {[...UB_DISTRICTS]
                    .sort((a, b) => b.riskScore - a.riskScore)
                    .map((d) => (
                      <tr
                        key={d.id}
                        className="hover:bg-[#F7F8FA] transition-colors group cursor-pointer"
                        onClick={() => {
                          onSelectDistrict(d.id);
                          onSelectTab('map');
                        }}
                      >
                        <td className="py-3 px-3 font-bold text-[#0B124D]">
                          {language === 'mn' ? d.nameMn : d.nameEn}
                        </td>
                        <td className="py-3 px-3 font-mono text-[#72778A]">
                          {d.population.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 font-mono text-[#72778A]">
                          {d.gerHouseholdPercent}%
                        </td>
                        <td className="py-3 px-3 font-mono text-[#72778A]">
                          ~{d.nearestStationDistKm} км
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[#0B124D] font-bold">
                            {d.roadAccessibilityGrade}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-mono font-bold text-xs ${
                                d.riskScore >= 75
                                  ? 'text-[#E93B2F]'
                                  : d.riskScore >= 55
                                  ? 'text-[#FF633C]'
                                  : 'text-[#12B89A]'
                              }`}
                            >
                              {d.riskScore}
                            </span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                              <div
                                className={`h-full rounded-full ${
                                  d.riskScore >= 75
                                    ? 'bg-[#E93B2F]'
                                    : d.riskScore >= 55
                                    ? 'bg-[#FF633C]'
                                    : 'bg-[#12B89A]'
                                }`}
                                style={{ width: `${d.riskScore}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="text-[11px] text-[#FF633C] group-hover:underline font-medium">
                            {language === 'mn' ? 'Шинжлэх' : 'Inspect'} →
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Key Alerts & Seasonal Focus (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Top Risk Hotspot Focus Card */}
            <div className="bg-[#0B124D] text-white p-6 rounded-2xl shadow-xs relative overflow-hidden">
              <span className="text-[10px] font-mono tracking-widest text-[#FF633C] uppercase font-bold block mb-1">
                {language === 'mn' ? 'ОНЦГОЙ АНХААРАХ БҮС' : 'HIGHEST RISK INDEX ZONE'}
              </span>
              <h4 className="font-editorial text-2xl font-bold mb-2">
                {language === 'mn' ? highestRiskDistrict.nameMn : highestRiskDistrict.nameEn}
              </h4>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-mono text-4xl font-bold text-[#FF633C]">
                  {highestRiskDistrict.riskScore}
                </span>
                <span className="font-mono text-xs text-white/60">/ 100 МАШ ӨНДӨР</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed mb-4">
                {language === 'mn'
                  ? highestRiskDistrict.keyObservationsMn
                  : highestRiskDistrict.keyObservationsEn}
              </p>
              <button
                onClick={() => {
                  onSelectDistrict(highestRiskDistrict.id);
                  onSelectTab('map');
                }}
                className="w-full py-2 bg-[#FF633C] hover:bg-[#e05430] text-white rounded-xl text-xs font-bold transition-colors text-center"
              >
                {language === 'mn' ? 'Газрын зураг дээр төвлөрөх' : 'Focus on Map'} →
              </button>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white p-6 rounded-2xl border border-[#0B124D]/8 shadow-xs space-y-3">
              <h4 className="font-mono text-xs font-bold text-[#0B124D] uppercase tracking-wider mb-2">
                {language === 'mn' ? 'ШУУРХАЙ ҮЙЛДЛҮҮД' : 'QUICK ACTIONS'}
              </h4>

              <button
                onClick={() => onSelectTab('explorer')}
                className="w-full p-3 text-left rounded-xl bg-[#F7F8FA] hover:bg-slate-100 border border-[#0B124D]/5 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-[#0B124D] block">
                    {language === 'mn' ? 'Эрсдэлийн симулятор' : 'Risk Weight Simulator'}
                  </span>
                  <span className="text-[11px] text-[#72778A]">
                    {language === 'mn' ? 'Хүчин зүйлсийн жинг өөрчлөх' : 'Adjust model weights interactively'}
                  </span>
                </div>
                <span className="text-xs text-[#FF633C]">→</span>
              </button>

              <button
                onClick={() => onSelectTab('calendar')}
                className="w-full p-3 text-left rounded-xl bg-[#F7F8FA] hover:bg-slate-100 border border-[#0B124D]/5 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-[#0B124D] block">
                    {language === 'mn' ? '12 сарын эрсдэлийн хуанли' : '12-Month Calendar'}
                  </span>
                  <span className="text-[11px] text-[#72778A]">
                    {language === 'mn' ? 'Улирлын оргил сарууд' : 'Heating & dry season patterns'}
                  </span>
                </div>
                <span className="text-xs text-[#FF633C]">→</span>
              </button>

              <button
                onClick={() => onSelectTab('reports')}
                className="w-full p-3 text-left rounded-xl bg-[#F7F8FA] hover:bg-slate-100 border border-[#0B124D]/5 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-[#0B124D] block">
                    {language === 'mn' ? 'Тайлан татах (PDF/CSV)' : 'Export Analytics Report'}
                  </span>
                  <span className="text-[11px] text-[#72778A]">
                    {language === 'mn' ? 'Хэвлэх эсвэл өгөгдөл татах' : 'Download clean datasets'}
                  </span>
                </div>
                <span className="text-xs text-[#FF633C]">→</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
