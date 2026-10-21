import React, { useMemo, useState } from 'react';
import { Language } from '../../types';
import {
  CITY_AVERAGE_RISK,
  DEMO_HISTORICAL_INCIDENTS,
  TOTAL_CITY_POPULATION,
  TOTAL_HISTORICAL_INCIDENTS,
  UB_DISTRICTS,
  UB_FIRE_STATIONS,
} from '../../data/ubGeoData';
import { getTranslation } from '../../i18n/translations';
import { unitKm } from '../../i18n/labels';
import { useLiveWeather } from '../../hooks/liveWeather';

interface ReportCenterProps {
  language: Language;
}

const IMPACT_LABEL: Record<string, { mn: string; en: string }> = {
  high: { mn: 'ӨНДӨР', en: 'HIGH' },
  medium: { mn: 'ДУНД', en: 'MEDIUM' },
  moderate: { mn: 'ДУНД', en: 'MEDIUM' },
  low: { mn: 'БАГА', en: 'LOW' },
};

const CATEGORY_LABEL: Record<string, { mn: string; en: string }> = {
  residential_ger: { mn: 'Гэр хороолол', en: 'Ger settlement' },
  residential_apt: { mn: 'Орон сууц', en: 'Apartment' },
  commercial: { mn: 'Ажил төмөрлөг', en: 'Commercial' },
  grass_forest: { mn: 'Хөвсгөр / ой', en: 'Grass & forest' },
  electrical: { mn: 'Цахилгаан', en: 'Electrical' },
};

const CSV_FORMULA_GUARD = /^[=+\-@\t\r]/;

/** RFC-4180 quoting + spreadsheet formula-injection guard. */
const csvCell = (value: string | number) => {
  const raw = String(value ?? '');
  const safe = CSV_FORMULA_GUARD.test(raw) ? `'${raw}` : raw;
  return `"${safe.replace(/"/g, '""')}"`;
};

const downloadCsv = (rows: (string | number)[][], filename: string) => {
  const csvContent = rows.map((r) => r.map(csvCell).join(',')).join('\r\n');
  // UTF-8 BOM so Mongolian Cyrillic opens correctly in Excel
  const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const ReportCenter: React.FC<ReportCenterProps> = ({ language }) => {
  const t = getTranslation(language);
  const isMn = language === 'mn';
  const live = useLiveWeather();
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [reportDate] = useState<string>(() => new Date().toISOString().slice(0, 10));

  const targetDistrict =
    selectedDistrictId === 'all'
      ? null
      : UB_DISTRICTS.find((d) => d.id === selectedDistrictId) ?? null;

  // City-wide weighted averages so the consolidated report never quotes invented numbers
  const cityGerPercent = useMemo(
    () =>
      Math.round(
        UB_DISTRICTS.reduce((s, d) => s + d.gerHouseholdPercent * d.population, 0) /
          TOTAL_CITY_POPULATION
      ),
    []
  );

  const scopedIncidents = useMemo(
    () =>
      DEMO_HISTORICAL_INCIDENTS.filter((inc) => {
        if (selectedDistrictId !== 'all' && inc.districtId !== selectedDistrictId) return false;
        if (selectedYear !== 'all' && !inc.date.startsWith(selectedYear)) return false;
        return true;
      }).sort((a, b) => (a.date < b.date ? 1 : -1)),
    [selectedDistrictId, selectedYear]
  );

  const scopeName = targetDistrict
    ? isMn
      ? targetDistrict.nameMn
      : targetDistrict.nameEn
    : isMn
      ? 'Нийслэл'
      : 'Metropolitan';

  // Trigger Print to PDF
  const handlePrint = () => {
    window.print();
  };

  // District risk matrix, respecting the district filter
  const handleDownloadDistrictCSV = () => {
    const headers = ['District_ID', 'Name_MN', 'Name_EN', 'Risk_Score', 'Risk_Level', 'Population', 'Ger_Percent', 'Stations_Count', 'Nearest_Station_KM', 'Road_Grade', 'Incidents_2024_2026'];
    const rows: (string | number)[][] = (targetDistrict ? [targetDistrict] : UB_DISTRICTS).map((d) => [
      d.id,
      d.nameMn,
      d.nameEn,
      d.riskScore,
      d.riskLevel,
      d.population,
      d.gerHouseholdPercent,
      d.fireStationsCount,
      d.nearestStationDistKm,
      d.roadAccessibilityGrade,
      d.historicalIncidentsCount,
    ]);

    downloadCsv(
      [headers, ...rows],
      `FireWatch_UB_${targetDistrict ? targetDistrict.id : 'metro'}_risk_${reportDate}.csv`
    );
  };

  // Filtered incident log
  const handleDownloadIncidentCSV = () => {
    const headers = ['Date', 'District_MN', 'District_EN', 'Khoroo', 'Category', 'Severity', 'Latitude', 'Longitude', 'Damage_MNT', 'Source'];
    const rows: (string | number)[][] = scopedIncidents.map((inc) => [
      inc.date,
      inc.districtNameMn,
      inc.districtNameEn,
      inc.khoroo,
      inc.category,
      inc.severity,
      inc.coordinates[0],
      inc.coordinates[1],
      inc.estimatedDamageMnt,
      inc.isDemo ? 'demo' : 'log',
    ]);

    downloadCsv(
      [headers, ...rows],
      `FireWatch_UB_incidents_${selectedYear}_${targetDistrict ? targetDistrict.id : 'metro'}.csv`
    );
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
              onClick={handleDownloadDistrictCSV}
              className="px-4 py-2.5 bg-white text-[#0B124D] hover:bg-slate-50 border border-[#0B124D]/10 text-xs font-mono font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>📥 CSV {isMn ? 'Дүүргийн индекс' : 'District index'}</span>
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
            <span className="font-semibold text-[#0B124D]">{isMn ? 'Дүүрэг сонгох:' : 'Target district:'}</span>
            <select
              value={selectedDistrictId}
              onChange={(e) => setSelectedDistrictId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#0B124D]/10 bg-[#F7F8FA] font-medium"
            >
              <option value="all">
                {isMn ? `Бүх ${UB_DISTRICTS.length} дүүрэг (Нэгдсэн)` : `All ${UB_DISTRICTS.length} districts (Consolidated)`}
              </option>
              {UB_DISTRICTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {language === 'mn' ? d.nameMn : d.nameEn} ({d.riskScore}/100)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#0B124D]">{isMn ? 'Дуудлагын хугацаа:' : 'Call log period:'}</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#0B124D]/10 bg-[#F7F8FA] font-medium"
              aria-label={isMn ? 'Дуудлагын хугацаа сонгох' : 'Filter the call log by year'}
            >
              <option value="all">{isMn ? 'Бүх бүртгэл' : 'All years'}</option>
              {['2026', '2025', '2024', '2023', '2022'].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
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
              <span className="block mt-0.5">{isMn ? 'Огноо' : 'Issued'}: {reportDate}</span>
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
                : isMn
                ? `Энэхүү тайлан нь Улаанбаатар хотын ${UB_DISTRICTS.length} дүүрэг, ${TOTAL_HISTORICAL_INCIDENTS.toLocaleString()} дуудлагын нэгтгэл, ${UB_FIRE_STATIONS.length} гал унтраах ангийн хүртээмж болон гэр хорооллын халаалтын улирлын бүтцэд үндэслэн тооцоолсон эрсдэлийн индексийн нэгтгэл юм.`
                : `This document compiles spatial risk indexes across all ${UB_DISTRICTS.length} districts of Ulaanbaatar, incorporating ${TOTAL_HISTORICAL_INCIDENTS.toLocaleString()} aggregated call logs, ${UB_FIRE_STATIONS.length} fire stations and winter heating topology.`}
            </p>
          </div>

          {/* Data Scoreboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-[#F7F8FA] border border-[#0B124D]/8">
            <div>
              <span className="text-[10px] font-mono text-[#72778A] block">
                {language === 'mn' ? 'Эрсдэлийн индекс' : 'Risk Indicator'}
              </span>
              <span className="font-mono text-3xl font-bold text-[#FF633C]">
                {targetDistrict ? targetDistrict.riskScore : CITY_AVERAGE_RISK} / 100
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#72778A] block">
                {language === 'mn' ? 'Шинжилсэн дуудлага' : 'Records Analyzed'}
              </span>
              <span className="font-mono text-3xl font-bold text-[#0B124D]">
                {targetDistrict
                  ? targetDistrict.historicalIncidentsCount.toLocaleString()
                  : TOTAL_HISTORICAL_INCIDENTS.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#72778A] block">
                {language === 'mn' ? 'Гэр өрхийн хувь' : 'Ger Settlement %'}
              </span>
              <span className="font-mono text-3xl font-bold text-[#0B124D]">
                {targetDistrict ? `${targetDistrict.gerHouseholdPercent}%` : `${cityGerPercent}%`}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#72778A] block">
                {language === 'mn' ? 'Гал унтраах анги' : 'Fire Stations'}
              </span>
              <span className="font-mono text-3xl font-bold text-[#0B124D]">
                {targetDistrict ? targetDistrict.fireStationsCount : UB_FIRE_STATIONS.length}{' '}
                {isMn ? 'анги' : ''}
              </span>
            </div>
          </div>

          {/* District Breakdown Table if Consolidated */}
          {!targetDistrict && (
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0B124D] mb-3">
                02 · {language === 'mn' ? 'ДҮҮРГҮҮДИЙН НЭГДСЭН ХҮСНЭГТ' : 'DISTRICT SUMMARY MATRIX'}
              </h3>
              <div className="overflow-x-auto w-full scrollbar-none rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-100 font-mono text-[#72778A]">
                      <th className="p-2 border-b border-r border-slate-200">{language === 'mn' ? 'Дүүрэг' : 'District'}</th>
                      <th className="p-2 border-b border-r border-slate-200">{language === 'mn' ? 'Хүн ам' : 'Pop'}</th>
                      <th className="p-2 border-b border-r border-slate-200">{language === 'mn' ? 'Гэр %' : 'Ger %'}</th>
                      <th className="p-2 border-b border-r border-slate-200">{language === 'mn' ? 'Ойрын анги' : 'Station'}</th>
                      <th className="p-2 border-b border-r border-slate-200">{language === 'mn' ? 'Зам' : 'Road'}</th>
                      <th className="p-2 border-b font-bold text-[#0B124D]">{language === 'mn' ? 'Индекс' : 'Score'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {UB_DISTRICTS.map((d) => (
                      <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="p-2 border-r border-slate-100 font-bold">{language === 'mn' ? d.nameMn : d.nameEn}</td>
                        <td className="p-2 border-r border-slate-100 font-mono">{d.population.toLocaleString()}</td>
                        <td className="p-2 border-r border-slate-100 font-mono">{d.gerHouseholdPercent}%</td>
                        <td className="p-2 border-r border-slate-100 font-mono">~{d.nearestStationDistKm} {unitKm(language === 'mn')}</td>
                        <td className="p-2 border-r border-slate-100 font-mono">{d.roadAccessibilityGrade}</td>
                        <td className="p-2 font-mono font-bold text-[#FF633C]">{d.riskScore}/100</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                    <span className="font-mono font-bold text-[#72778A]">
                      {c.score} pt (
                      {(isMn ? IMPACT_LABEL[c.impact]?.mn : IMPACT_LABEL[c.impact]?.en) ??
                        c.impact.toUpperCase()}
                      )
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filtered call log — proves the period/district filters drive real rows */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0B124D]">
                03 ·{' '}
                {isMn
                  ? 'ДУУДЛАГЫН БҮРТГЭЛ (ДҮРСЛЭЛ)'
                  : 'CALL LOG EXTRACT (ILLUSTRATIVE)'}
              </h3>
              <button
                onClick={handleDownloadIncidentCSV}
                disabled={scopedIncidents.length === 0}
                className="text-[11px] font-mono font-bold text-[#0B124D] hover:text-[#FF633C] disabled:text-slate-300 disabled:cursor-not-allowed print:hidden"
              >
                📥 CSV ({scopedIncidents.length})
              </button>
            </div>

            {scopedIncidents.length === 0 ? (
              <p className="text-xs text-[#72778A] p-3 rounded-xl bg-[#F7F8FA] border border-dashed border-slate-300">
                {isMn
                  ? 'Сонгосон дүүрэг, онд дүрслэлийн бүртгэлд бичлэг гарахгүй байна. Дүүрэг эсвэл хугацааг өөрчлөөрэй.'
                  : 'No sample records match this district and period. Change the filters above.'}
              </p>
            ) : (
              <div className="overflow-x-auto w-full scrollbar-none rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs min-w-[560px]">
                  <thead>
                    <tr className="bg-slate-100 font-mono text-[#72778A]">
                      <th className="p-2 border-b border-r border-slate-200">{isMn ? 'Огноо' : 'Date'}</th>
                      <th className="p-2 border-b border-r border-slate-200">{isMn ? 'Дүүрэг' : 'District'}</th>
                      <th className="p-2 border-b border-r border-slate-200">{isMn ? 'Хороо' : 'Khoroo'}</th>
                      <th className="p-2 border-b border-r border-slate-200">{isMn ? 'Ангилал' : 'Category'}</th>
                      <th className="p-2 border-b border-r border-slate-200">{isMn ? 'Хүндэц' : 'Severity'}</th>
                      <th className="p-2 border-b font-bold text-[#0B124D]">{isMn ? 'Хохирол (₮)' : 'Damage (₮)'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scopedIncidents.map((inc) => (
                      <tr key={inc.id} className="border-b border-slate-100 align-top">
                        <td className="p-2 border-r border-slate-100 font-mono whitespace-nowrap">{inc.date}</td>
                        <td className="p-2 border-r border-slate-100 font-semibold">
                          {isMn ? inc.districtNameMn : inc.districtNameEn}
                        </td>
                        <td className="p-2 border-r border-slate-100 font-mono">{inc.khoroo}</td>
                        <td className="p-2 border-r border-slate-100">
                          {isMn ? CATEGORY_LABEL[inc.category]?.mn : CATEGORY_LABEL[inc.category]?.en}
                        </td>
                        <td className="p-2 border-r border-slate-100 font-mono">
                          {inc.severity === 'critical'
                            ? (isMn ? 'Хүнд' : 'Critical')
                            : inc.severity === 'moderate'
                              ? (isMn ? 'Дунд' : 'Moderate')
                              : (isMn ? 'Хөнгөн' : 'Minor')}
                        </td>
                        <td className="p-2 font-mono">{inc.estimatedDamageMnt.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="text-[10px] text-[#72778A] mt-2">
              {isMn
                ? 'Эдгээр бичлэг нь загварчлалыг тайлбарлах дүрслэлийн зорилготой; албан ёсны мэдээллийн нөөц биш.'
                : 'These rows are illustrative records used to explain the model; they are not an official data source.'}
            </p>
          </div>

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
              <span>FireWatch UB · {isMn ? 'Иргэний мэдээллийн хөтөч' : 'Civic risk-intelligence prototype'}</span>
              <span>{live.isLive ? 'LIVE' : 'DEMO'} · {isMn ? 'Цаг агаар' : 'Meteo'} {live.lastUpdated}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
