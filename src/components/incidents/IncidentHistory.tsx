import React, { useMemo, useState } from 'react';
import { IncidentRecord, Language } from '../../types';
import { DEMO_HISTORICAL_INCIDENTS } from '../../data/ubGeoData';
import { getTranslation } from '../../i18n/translations';

interface IncidentHistoryProps {
  language: Language;
  onNavigateToMapWithDistrict?: (districtId: string) => void;
  onOpenDemoInfo: () => void;
}

export const IncidentHistory: React.FC<IncidentHistoryProps> = ({
  language,
  onNavigateToMapWithDistrict,
  onOpenDemoInfo,
}) => {
  const t = getTranslation(language);
  const isMn = language === 'mn';
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeIncident, setActiveIncident] = useState<IncidentRecord | null>(
    DEMO_HISTORICAL_INCIDENTS[0]
  );

  const years = ['all', '2026', '2025', '2024', '2023', '2022'];

  const categories = [
    { id: 'all', nameMn: 'Бүх ангилал', nameEn: 'All Categories' },
    { id: 'residential_ger', nameMn: 'Гэр хороолол', nameEn: 'Residential Ger' },
    { id: 'residential_apt', nameMn: 'Орон сууц', nameEn: 'Apartment' },
    { id: 'electrical', nameMn: 'Цахилгаан шугам', nameEn: 'Electrical' },
    { id: 'grass_forest', nameMn: 'Шар өвс / Ой', nameEn: 'Brush & Forest' },
    { id: 'commercial', nameMn: 'Аж ахуйн нэгж', nameEn: 'Commercial' },
  ];

  const filteredIncidents = useMemo(
    () =>
      DEMO_HISTORICAL_INCIDENTS.filter((inc) => {
        const matchYear = selectedYear === 'all' || inc.date.startsWith(selectedYear);
        const matchCategory = selectedCategory === 'all' || inc.category === selectedCategory;
        return matchYear && matchCategory;
      }),
    [selectedYear, selectedCategory]
  );

  // Keep the detail card meaningful when the active row is filtered away
  const shownIncident =
    activeIncident && filteredIncidents.some((i) => i.id === activeIncident.id)
      ? activeIncident
      : filteredIncidents[0] ?? null;

  const categoryLabel = (cat: IncidentRecord['category']) =>
    cat === 'residential_ger'
      ? (isMn ? 'Гэр хороолол' : 'Ger settlement')
      : cat === 'grass_forest'
        ? (isMn ? 'Шар өвс / Ой' : 'Brush & forest')
        : cat === 'electrical'
          ? (isMn ? 'Цахилгаан' : 'Electrical')
          : cat === 'commercial'
            ? (isMn ? 'Аж ахуйн нэгж' : 'Commercial')
            : (isMn ? 'Орон сууц' : 'Apartment');

  const severityLabel = (sev: IncidentRecord['severity']) =>
    sev === 'critical'
      ? (isMn ? 'ХҮНД' : 'CRITICAL')
      : sev === 'moderate'
        ? (isMn ? 'ДУНД' : 'MODERATE')
        : (isMn ? 'ХӨНГӨН' : 'MINOR');

  const khorooLabel = (n: number) => (isMn ? `${n}-р хороо` : `Khoroo ${n}`);

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-[#F7F8FA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#0B124D]/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold tracking-widest text-[#FF633C] uppercase">
                {language === 'mn' ? 'ТҮҮХЭН ДУУДЛАГЫН ТАНДАЛТ' : 'HISTORICAL INCIDENT DATABASE'}
              </span>
              <button
                onClick={onOpenDemoInfo}
                className="text-[10px] font-mono bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded"
              >
                DEMO DATA
              </button>
            </div>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0B124D]">
              {language === 'mn'
                ? 'Галын түүхэн дуудлагын орон зай, цаг хугацааны шинжилгээ'
                : 'Temporal Incident Records & Spatial Concentration Analysis'}
            </h1>
          </div>

          <span className="text-xs font-mono text-[#72778A]">
            {filteredIncidents.length} {language === 'mn' ? 'бүртгэл харуулж байна' : 'records filtered'}
          </span>
        </div>

        {/* Timeline & Category Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#0B124D]/8 shadow-xs">
          
          {/* Year Timeline Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono font-semibold text-[#72778A] mr-2">
              {language === 'mn' ? 'Он:' : 'Year:'}
            </span>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                  selectedYear === y
                    ? 'bg-[#0B124D] text-white'
                    : 'bg-[#F7F8FA] text-[#72778A] hover:text-[#0B124D]'
                }`}
              >
                {y === 'all' ? (language === 'mn' ? 'Бүгд' : 'All') : y}
              </button>
            ))}
          </div>

          {/* Category Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-[#FF633C] text-white'
                    : 'bg-[#F7F8FA] text-[#72778A] hover:text-[#0B124D]'
                }`}
              >
                {language === 'mn' ? c.nameMn : c.nameEn}
              </button>
            ))}
          </div>

        </div>

        {/* Main Content: Incident Table + Detail View Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Table (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-[#0B124D]/8 shadow-xs">
            <h3 className="font-editorial text-lg font-bold text-[#0B124D] mb-4">
              {language === 'mn' ? 'Бүртгэгдсэн тохиолдлууд' : 'Incident Log Table'}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[#72778A] font-mono">
                    <th className="py-2.5 px-3">{language === 'mn' ? 'Огноо' : 'Date'}</th>
                    <th className="py-2.5 px-3">{language === 'mn' ? 'Байршил' : 'Location'}</th>
                    <th className="py-2.5 px-3">{language === 'mn' ? 'Ангилал' : 'Category'}</th>
                    <th className="py-2.5 px-3">{language === 'mn' ? 'Түвшин' : 'Severity'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredIncidents.map((inc) => {
                    const isSelected = shownIncident?.id === inc.id;
                    return (
                      <tr
                        key={inc.id}
                        tabIndex={0}
                        aria-selected={isSelected}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setActiveIncident(inc);
                          }
                        }}
                        onClick={() => setActiveIncident(inc)}
                        className={`hover:bg-[#F7F8FA] cursor-pointer transition-colors ${
                          isSelected ? 'bg-orange-50/70 font-semibold' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-mono text-[#0B124D]">
                          {inc.date}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-[#0B124D]">
                            {language === 'mn' ? inc.districtNameMn : inc.districtNameEn}
                          </span>{' '}
                          <span className="text-[#72778A] text-[11px]">({khorooLabel(inc.khoroo)})</span>
                        </td>
                        <td className="py-3 px-3 text-[#72778A]">{categoryLabel(inc.category)}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                              inc.severity === 'critical'
                                ? 'bg-red-100 text-[#E93B2F]'
                                : inc.severity === 'moderate'
                                ? 'bg-orange-100 text-[#FF633C]'
                                : 'bg-slate-100 text-[#72778A]'
                            }`}
                          >
                            {severityLabel(inc.severity)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredIncidents.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-[#72778A]">
                        {isMn
                          ? 'Эдгээр шүүлтүүрт тохирох бичлэг олдсонгүй.'
                          : 'No records match these filters.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Selected Incident Detail Card (5 cols) */}
          <div className="lg:col-span-5">
            {shownIncident ? (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#0B124D]/8 shadow-xs sticky top-20 space-y-6">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-[#72778A] mb-1">
                    <span>{shownIncident.id}</span>
                    <span>{shownIncident.date}</span>
                  </div>
                  <h3 className="font-editorial text-2xl font-bold text-[#0B124D]">
                    {language === 'mn' ? shownIncident.districtNameMn : shownIncident.districtNameEn},{' '}
                    {khorooLabel(shownIncident.khoroo)}
                  </h3>
                </div>

                {/* Severity Card */}
                <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#0B124D]/5">
                  <span className="text-[10px] font-mono text-[#72778A] uppercase block mb-1">
                    {language === 'mn' ? 'Урьдчилсан шалтгаан & Шинж чанар' : 'Probable Cause Vector'}
                  </span>
                  <p className="text-sm font-semibold text-[#0B124D]">
                    {isMn ? shownIncident.causeGuessMn : shownIncident.causeGuessEn}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#0B124D]/5">
                    <span className="text-[10px] text-[#72778A] block">
                      {language === 'mn' ? 'Координат' : 'Coordinates'}
                    </span>
                    <span className="font-mono font-bold text-[#0B124D]">
                      {shownIncident.coordinates[0].toFixed(4)}, {shownIncident.coordinates[1].toFixed(4)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F7F8FA] border border-[#0B124D]/5">
                    <span className="text-[10px] text-[#72778A] block">
                      {language === 'mn' ? 'Ойролцоо хохирол' : 'Est. Damage (MNT)'}
                    </span>
                    <span className="font-mono font-bold text-[#FF633C]">
                      ₮{shownIncident.estimatedDamageMnt.toLocaleString()}
                    </span>
                  </div>
                </div>

                {onNavigateToMapWithDistrict && (
                  <button
                    onClick={() => onNavigateToMapWithDistrict(shownIncident.districtId)}
                    className="w-full py-2.5 bg-[#0B124D] hover:bg-[#11166B] text-white text-xs font-bold rounded-xl transition-colors text-center"
                  >
                    {isMn ? 'Энэ дүүргийг газрын зураг дээр шинжлэх' : 'Inspect area on risk map'} →
                  </button>
                )}
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl text-[#72778A] text-xs">
                {isMn ? 'Тохиолдол сонгоно уу' : 'Select an incident record to inspect'}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
