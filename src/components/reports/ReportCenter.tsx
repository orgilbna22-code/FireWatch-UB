import React, { useState } from 'react';
import { Language } from '../../types';
import { UB_DISTRICTS, DEMO_HISTORICAL_INCIDENTS } from '../../data/ubGeoData';
import { getTranslation } from '../../i18n/translations';

interface ReportCenterProps {
  language: Language;
}

export const ReportCenter: React.FC<ReportCenterProps> = ({ language }) => {
  const t = getTranslation(language);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('2026');

  const targetDistrict =
    selectedDistrictId === 'all'
      ? null
      : UB_DISTRICTS.find((d) => d.id === selectedDistrictId);

  // Trigger Print to PDF
  const handlePrint = () => {
    window.print();
  };

  // Generate and download CSV
  const handleDownloadCSV = () => {
    const headers = ['District_ID', 'Name_MN', 'Name_EN', 'Risk_Score', 'Risk_Level', 'Population', 'Ger_Percent', 'Stations_Count', 'Nearest_Station_KM', 'Road_Grade'];
    const rows = UB_DISTRICTS.map((d) => [
      d.id,
      `"${d.nameMn}"`,
      `"${d.nameEn}"`,
      d.riskScore,
      d.riskLevel,
      d.population,
      d.gerHouseholdPercent,
      d.fireStationsCount,
      d.nearestStationDistKm,
      d.roadAccessibilityGrade,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FireWatch_UB_Risk_Report_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-[#F7F8FA] p-4 sm:p-6 lg:p-8 print:p-0 print:bg-white">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Screen-Only Header & Controls */}
        <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#0B124D]/10">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-[#FF633C] uppercase block mb-1">
              {language === 'mn' ? 'ТАЙЛАНГИЙН ТӨВ' : 'REPORT & INTELLIGENCE CENTER'}
            </span>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0B124D]">
              {language === 'mn' ? 'Аналитик тайлан үүсгэх ба экспортлох' : 'Generate & Export Analytical Reports'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2.5 bg-white text-[#0B124D] hover:bg-slate-50 border border-[#0B124D]/10 text-xs font-mono font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>📥 CSV {language === 'mn' ? 'Татах' : 'Export'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-[#FF633C] hover:bg-[#e05430] text-white text-xs font-bold rounded-xl shadow-md shadow-[#FF633C]/20 transition-all flex items-center gap-1.5"
            >
              <span>🖨️ PDF / {language === 'mn' ? 'Хэвлэх' : 'Print'}</span>
            </button>
          </div>
        </div>

        {/* Filter bar for Report Generation */}
        <div className="print:hidden bg-white p-4 rounded-2xl border border-[#0B124D]/8 shadow-xs flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#0B124D]">{language === 'mn' ? 'Дүүрэг сонгох:' : 'Target District:'}</span>
            <select
              value={selectedDistrictId}
              onChange={(e) => setSelectedDistrictId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#0B124D]/10 bg-[#F7F8FA] font-medium"
            >
              <option value="all">{language === 'mn' ? 'Бүх 9 дүүрэг (Нэгдсэн)' : 'All 9 Districts (Consolidated)'}</option>
              {UB_DISTRICTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {language === 'mn' ? d.nameMn : d.nameEn} ({d.riskScore}/100)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#0B124D]">{language === 'mn' ? 'Хугацаа:' : 'Period:'}</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#0B124D]/10 bg-[#F7F8FA] font-medium"
            >
              <option value="2026">2026 (Live Cycle)</option>
              <option value="2025">2025 (Annual Log)</option>
              <option value="2024">2024 (Annual Log)</option>
            </select>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PRINTABLE REPORT DOCUMENT (Matches Reference Style)       */}
        {/* ========================================================= */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#0B124D]/10 shadow-lg text-[#12152A] space-y-8">
          
          {/* Document Header */}
          <div className="flex items-start justify-between pb-8 border-b-2 border-[#0B124D]">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#FF633C] flex items-center justify-center text-white font-bold text-sm">
                  🔥
                </div>
                <span className="font-editorial text-2xl font-bold tracking-tight text-[#0B124D]">
                  FIREWATCH<span className="text-[#FF633C] font-mono text-base ml-1">UB</span>
                </span>
              </div>
              <p className="text-xs text-[#72778A] italic">
                “{t.tagline}”
              </p>
            </div>

            <div className="text-right text-xs font-mono text-[#72778A]">
              <span className="block font-bold text-[#0B124D]">
                {language === 'mn' ? 'АНАЛИТИК ТАЙЛАН' : 'ANALYTICAL REPORT'}
              </span>
              <span>Doc Ref: FW-UB-{selectedYear}-{targetDistrict ? targetDistrict.id.toUpperCase() : 'METRO'}</span>
              <span className="block mt-0.5">Огноо: 2026-09-30</span>
            </div>
          </div>

          {/* Scope & Executive Summary */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FF633C] block mb-1">
              01 · {language === 'mn' ? 'ТАЙЛАНГИЙН ХАМРАХ ХҮРЭЭ' : 'EXECUTIVE SCOPE'}
            </span>
            <h2 className="font-editorial text-2xl font-bold text-[#0B124D] mb-3">
              {targetDistrict
                ? `${language === 'mn' ? targetDistrict.nameMn : targetDistrict.nameEn} ${language === 'mn' ? 'дүүргийн эрсдэлийн үнэлгээ' : 'District Risk Assessment'}`
                : language === 'mn' ? 'Нийслэл Улаанбаатар хотын нэгдсэн эрсдэлийн тайлан' : 'Consolidated Metropolitan Fire-Risk Intelligence'}
            </h2>
            <p className="text-xs leading-relaxed text-[#72778A]">
              {targetDistrict
                ? (language === 'mn' ? targetDistrict.keyObservationsMn : targetDistrict.keyObservationsEn)
                : language === 'mn'
                ? 'Энэхүү тайлан нь Улаанбаатар хотын 9 дүүрэг, түүхэн 1,937 дуудлага, ОБЕГ-ын гал унтраах ангиудын хүртээмж болон гэр хорооллын халаалтын улирлын бүтцэд үндэслэн тооцоолсон эрсдэлийн индексийн нэгтгэл юм.'
                : 'This document compiles spatial risk indexes across all 9 districts of Ulaanbaatar, incorporating 1,937 historical logs, emergency infrastructure proximities, and winter heating topologies.'}
            </p>
          </div>

          {/* Data Scoreboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#F7F8FA] border border-[#0B124D]/8">
            <div>
              <span className="text-[10px] font-mono text-[#72778A] block">
                {language === 'mn' ? 'Эрсдэлийн индекс' : 'Risk Indicator'}
              </span>
              <span className="font-mono text-3xl font-bold text-[#FF633C]">
                {targetDistrict ? targetDistrict.riskScore : '58'} / 100
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#72778A] block">
                {language === 'mn' ? 'Шинжилсэн дуудлага' : 'Records Analyzed'}
              </span>
              <span className="font-mono text-3xl font-bold text-[#0B124D]">
                {targetDistrict ? targetDistrict.historicalIncidentsCount : '1,937'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#72778A] block">
                {language === 'mn' ? 'Гэр өрхийн хувь' : 'Ger Settlement %'}
              </span>
              <span className="font-mono text-3xl font-bold text-[#0B124D]">
                {targetDistrict ? `${targetDistrict.gerHouseholdPercent}%` : '54%'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#72778A] block">
                {language === 'mn' ? 'Гал унтраах анги' : 'Fire Stations'}
              </span>
              <span className="font-mono text-3xl font-bold text-[#0B124D]">
                {targetDistrict ? targetDistrict.fireStationsCount : '8 анги'}
              </span>
            </div>
          </div>

          {/* District Breakdown Table if Consolidated */}
          {!targetDistrict && (
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0B124D] mb-3">
                02 · {language === 'mn' ? 'ДҮҮРГҮҮДИЙН НЭГДСЭН ХҮСНЭГТ' : 'DISTRICT SUMMARY MATRIX'}
              </h3>
              <table className="w-full text-left text-xs border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 font-mono text-[#72778A]">
                    <th className="p-2 border">{language === 'mn' ? 'Дүүрэг' : 'District'}</th>
                    <th className="p-2 border">{language === 'mn' ? 'Хүн ам' : 'Pop'}</th>
                    <th className="p-2 border">{language === 'mn' ? 'Гэр %' : 'Ger %'}</th>
                    <th className="p-2 border">{language === 'mn' ? 'Ойрын анги' : 'Station'}</th>
                    <th className="p-2 border">{language === 'mn' ? 'Зам' : 'Road'}</th>
                    <th className="p-2 border font-bold text-[#0B124D]">{language === 'mn' ? 'Индекс' : 'Score'}</th>
                  </tr>
                </thead>
                <tbody>
                  {UB_DISTRICTS.map((d) => (
                    <tr key={d.id} className="border-b">
                      <td className="p-2 border font-bold">{language === 'mn' ? d.nameMn : d.nameEn}</td>
                      <td className="p-2 border font-mono">{d.population.toLocaleString()}</td>
                      <td className="p-2 border font-mono">{d.gerHouseholdPercent}%</td>
                      <td className="p-2 border font-mono">~{d.nearestStationDistKm} км</td>
                      <td className="p-2 border font-mono">{d.roadAccessibilityGrade}</td>
                      <td className="p-2 border font-mono font-bold text-[#FF633C]">{d.riskScore}/100</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Factor Breakdown if Single District Selected */}
          {targetDistrict && (
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0B124D] mb-3">
                02 · {language === 'mn' ? 'ХҮЧИН ЗҮЙЛИЙН НӨЛӨӨЛӨЛ (EXPLAINABILITY)' : 'FACTOR CONTRIBUTIONS'}
              </h3>
              <div className="space-y-2 text-xs">
                {targetDistrict.contributions.map((c) => (
                  <div key={c.id} className="p-2.5 rounded-lg bg-[#F7F8FA] flex items-center justify-between">
                    <span className="font-semibold text-[#0B124D]">{language === 'mn' ? c.nameMn : c.nameEn}</span>
                    <span className="font-mono font-bold text-[#72778A]">{c.score} pt ({c.impact.toUpperCase()})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Methodology & Limitations Footer (Section 44 & 45 compliant) */}
          <div className="pt-6 border-t border-[#0B124D]/10 text-[11px] text-[#72778A] space-y-2">
            <span className="font-bold text-[#0B124D] block uppercase font-mono">
              {language === 'mn' ? 'АРГА ЗҮЙ & ХЯЗГААРЛАЛТ' : 'METHODOLOGY & STATUTORY DISCLAIMER'}
            </span>
            <p>
              {language === 'mn'
                ? 'Энэхүү тайлан нь боломжит нээлттэй өгөгдөл болон аналитик загварчлалд суурилсан судалгааны үзүүлэлт юм. Албан ёсны онцгой байдлын автомат сэрэмжлүүлгийн систем биш бөгөөд дуудлагын тактикийн хүрэх хугацааг шууд тодорхойлох баримт бичиг болохгүй.'
                : 'This intelligence report is compiled from public spatial indicators and mathematical sensitivity formulas. It is an analytical reference platform and does NOT serve as an official emergency warning or tactical guarantee.'}
            </p>
            <div className="flex items-center justify-between pt-4 font-mono text-[10px]">
              <span>FireWatch UB Platform · www.firewatch.ub.mn</span>
              <span>Prepared for: Public Safety Intelligence</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
