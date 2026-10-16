import React, { useState } from 'react';
import { KhorooData, Language } from '../../types';
import { UB_DISTRICTS } from '../../data/ubGeoData';
import { getKhoroosByDistrict } from '../../data/ubKhorooData';
import { getTranslation } from '../../i18n/translations';
import { RealPhotoModal } from '../common/RealPhotoModal';
import { RiskBreakdownList } from '../common/RiskBreakdownList';

interface DistrictAnalysisProps {
  language: Language;
  initialDistrictId?: string;
  onNavigateToMapWithDistrict?: (districtId: string) => void;
}

export const DistrictAnalysis: React.FC<DistrictAnalysisProps> = ({
  language,
  initialDistrictId,
  onNavigateToMapWithDistrict,
}) => {
  const t = getTranslation(language);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(
    initialDistrictId || UB_DISTRICTS[0].id
  );

  const [khorooFilter, setKhorooFilter] = useState<'all' | 'high' | 'ger' | 'apt'>('all');
  const [inspectingKhoroo, setInspectingKhoroo] = useState<KhorooData | null>(null);

  const selectedDistrict =
    UB_DISTRICTS.find((d) => d.id === selectedDistrictId) || UB_DISTRICTS[0];

  const districtKhoroos = getKhoroosByDistrict(selectedDistrict.id);

  const filteredKhoroos = districtKhoroos.filter((k) => {
    if (khorooFilter === 'high') return k.riskScore >= 75;
    if (khorooFilter === 'ger') return k.gerHouseholdPercent >= 60;
    if (khorooFilter === 'apt') return k.apartmentHouseholdPercent >= 60;
    return true;
  });

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-[#F7F8FA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Title & Breadcrumb */}
        <div className="pb-6 border-b border-[#0B124D]/10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold tracking-widest text-[#FF633C] uppercase block">
              {language === 'mn' ? 'ДҮҮРЭГ БА ХОРООДЫН ДҮН ШИНЖИЛГЭЭ' : 'DISTRICT & KHOROO INTELLIGENCE REPORT'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#0B124D]/5 font-mono text-[#0B124D]">
              9 Дүүрэг • 204 Хороо
            </span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B124D]">
            {language === 'mn'
              ? 'Улаанбаатар хотын дүүргүүд ба хороодын орон зайн эрсдэл'
              : 'Granular Multi-Factor Analysis Across All 9 Districts & Khoroos'}
          </h1>
          <p className="text-xs sm:text-sm text-[#72778A] mt-2 max-w-2xl">
            {language === 'mn'
              ? 'Шинжлэх ухааны төвийг сахисан аналитик хэллэг, орон зайн өгөгдөл, халаалтын бүтэц, гидрантын хүртээмж болон хороо тус бүрийн түвшин.'
              : 'Neutral analytical terminology, spatial datasets, heating topology, hydrant coverage, and individual khoroo metrics.'}
          </p>
        </div>

        {/* District Selector Pill Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {UB_DISTRICTS.map((d) => {
            const isSelected = d.id === selectedDistrict.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDistrictId(d.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#0B124D] text-white shadow-md scale-102'
                    : 'bg-white text-[#72778A] hover:text-[#0B124D] border border-black/[0.06] hover:border-[#0B124D]/20'
                }`}
              >
                <span>{language === 'mn' ? d.nameMn : d.nameEn}</span>
                <span
                  className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : d.riskScore >= 75
                      ? 'bg-red-100 text-[#E93B2F]'
                      : d.riskScore >= 55
                      ? 'bg-orange-100 text-[#FF633C]'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {d.riskScore}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected District Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Analytics Card (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/[0.06] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.06]">
                <div>
                  <span className="text-[11px] font-mono text-[#72778A] uppercase tracking-wider block mb-1">
                    {language === 'mn' ? 'Шинжилгээний бүс' : 'Selected Target Area'}
                  </span>
                  <h2 className="font-editorial text-3xl font-bold text-[#0B124D]">
                    {language === 'mn' ? selectedDistrict.nameMn : selectedDistrict.nameEn}{' '}
                    <span className="text-base font-normal font-sans text-[#72778A]">
                      ({selectedDistrict.khoroosCount} {language === 'mn' ? 'хороотой' : 'khoroos'})
                    </span>
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {onNavigateToMapWithDistrict && (
                    <button
                      onClick={() => onNavigateToMapWithDistrict(selectedDistrict.id)}
                      className="px-4 py-2 bg-[#0B124D] hover:bg-[#11166B] text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <span>🗺️</span>
                      <span>{language === 'mn' ? 'Газрын зурагт харах' : 'View on Map'}</span>
                    </button>
                  )}
                  <div className="text-right pl-3 border-l border-black/[0.06]">
                    <span className="text-[10px] font-mono uppercase text-[#72778A] block">
                      {t.riskIndicatorTitle}
                    </span>
                    <span className={`font-mono text-3xl font-bold ${
                      selectedDistrict.riskScore >= 75 ? 'text-[#E93B2F]' :
                      selectedDistrict.riskScore >= 55 ? 'text-[#FF633C]' :
                      'text-[#12B89A]'
                    }`}>
                      {selectedDistrict.riskScore}
                      <span className="text-xs text-[#72778A]">/100</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* District Demographic & Infrastructure Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-black/[0.06]">
                <div>
                  <span className="text-[10px] font-mono text-[#72778A] uppercase block mb-1">
                    {language === 'mn' ? 'Хүн ам' : 'Population'}
                  </span>
                  <span className="font-mono text-lg font-bold text-[#0B124D]">
                    {selectedDistrict.population.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#72778A] uppercase block mb-1">
                    {language === 'mn' ? 'Газар нутаг' : 'Area Size'}
                  </span>
                  <span className="font-mono text-lg font-bold text-[#0B124D]">
                    {selectedDistrict.areaKm2} км²
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#72778A] uppercase block mb-1">
                    {language === 'mn' ? 'Гэр хороолол' : 'Ger Households'}
                  </span>
                  <span className="font-mono text-lg font-bold text-[#FF633C]">
                    {selectedDistrict.gerHouseholdPercent}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#72778A] uppercase block mb-1">
                    {language === 'mn' ? 'Түүхэн дуудлага' : 'Incidents'}
                  </span>
                  <span className="font-mono text-lg font-bold text-[#0B124D]">
                    {selectedDistrict.historicalIncidentsCount}
                  </span>
                </div>
              </div>

              {/* Neutral Analytical Key Observation */}
              <div className="pt-6">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#72778A] block mb-2 font-semibold">
                  {language === 'mn' ? 'Орон зайн шинжилгээний дүгнэлт' : 'Spatial Synthesis & Field Notes'}
                </span>
                <p className="text-sm text-[#12152A]/85 leading-relaxed bg-[#F7F8FA] p-4 rounded-2xl border border-black/[0.04]">
                  {language === 'mn'
                    ? selectedDistrict.keyObservationsMn
                    : selectedDistrict.keyObservationsEn}
                </p>
              </div>
            </div>

            {/* Contributing Multi-Factor Breakdown */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/[0.06] shadow-xs space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#72778A] block font-semibold">
                {language === 'mn' ? 'НӨЛӨӨЛӨГЧ ХҮЧИН ЗҮЙЛСИЙН ЭЗЛЭХ ХУВЬ' : 'CONTRIBUTING FACTOR WEIGHTS'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedDistrict.contributions.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-[#F7F8FA] border border-black/[0.04]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#0B124D]">
                        {language === 'mn' ? c.nameMn : c.nameEn}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#FF633C]">
                        {c.score} pt
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full ${
                          c.impact === 'high'
                            ? 'bg-[#FF633C]'
                            : c.impact === 'moderate'
                            ? 'bg-[#0B124D]'
                            : 'bg-[#12B89A]'
                        }`}
                        style={{ width: `${c.score}%` }}
                      />
                    </div>

                    <p className="text-xs text-[#72778A] leading-relaxed">
                      {language === 'mn' ? c.descriptionMn : c.descriptionEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Exact Itemized Mathematical & Causal List ("Яагаад ийм хувийн эрсдэлтэй бэ") */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/[0.06] shadow-xs">
              <RiskBreakdownList
                district={selectedDistrict}
                language={language}
              />
            </div>

          </div>

          {/* Right Column: Infrastructure & Emergency Access (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Fire Station & Response Card */}
            <div className="bg-white p-6 rounded-3xl border border-black/[0.06] shadow-xs space-y-4">
              <span className="text-[10px] font-mono text-[#72778A] uppercase tracking-wider block">
                {language === 'mn' ? 'ОНЦГОЙ БАЙДЛЫН ДЭД БҮТЭЦ' : 'EMERGENCY INFRASTRUCTURE'}
              </span>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs text-[#72778A]">
                  {language === 'mn' ? 'Үйлчлэх гал түймрийн анги' : 'Active Fire Stations'}
                </span>
                <span className="font-mono text-sm font-bold text-[#0B124D]">
                  {selectedDistrict.fireStationsCount} анги
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs text-[#72778A]">
                  {language === 'mn' ? 'Ойрын анги хүртэлх зай' : 'Avg Nearest Station Distance'}
                </span>
                <span className="font-mono text-sm font-bold text-[#0B124D]">
                  ~{selectedDistrict.nearestStationDistKm} км
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs text-[#72778A]">
                  {language === 'mn' ? 'Замын нэвтрэлтийн зэрэг' : 'Road Access Grade'}
                </span>
                <span className="font-mono text-sm font-bold text-[#FF633C]">
                  {selectedDistrict.roadAccessibilityGrade} түвшин
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#72778A]">
                  {language === 'mn' ? 'Эрсдэлийн хандлага' : 'Historical Trend'}
                </span>
                <span className="text-xs font-bold text-[#0B124D] uppercase">
                  {selectedDistrict.trend === 'increasing'
                    ? (language === 'mn' ? 'Өсөх хандлагатай' : 'Increasing')
                    : (language === 'mn' ? 'Тогтвортой' : 'Stable')}
                </span>
              </div>
            </div>

            {/* Practical District Advisory */}
            <div className="bg-[#0B124D] text-white p-6 rounded-3xl shadow-xs">
              <span className="text-[10px] font-mono text-[#FF633C] uppercase tracking-wider block mb-1">
                {language === 'mn' ? 'БҮСЭД ТОХИРСОН ЗӨВЛӨМЖ' : 'ZONAL PREVENTIVE GUIDELINES'}
              </span>
              <h4 className="font-editorial text-lg font-bold mb-3">
                {language === 'mn' ? 'Урьдчилан сэргийлэх арга хэмжээ' : 'Targeted Risk Mitigation'}
              </h4>
              <ul className="text-xs text-white/80 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF633C] font-bold">•</span>
                  <span>
                    {language === 'mn'
                      ? 'Хашааны гудамжны үзүүрийг галын автомашин эргэх боломжтой сул байлгах'
                      : 'Maintain unobstructed turning bays for heavy emergency vehicles in alley corridors'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF633C] font-bold">•</span>
                  <span>
                    {language === 'mn'
                      ? 'Халуун үнс нурмаа модон хашаа, шатамхай хог руу хэзээ ч бүү асга'
                      : 'Never deposit active stove cinders near timber fences or dry vegetation'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF633C] font-bold">•</span>
                  <span>
                    {language === 'mn'
                      ? 'Яндангийн халхавч, дулаалгыг улиралд 2-оос доошгүй удаа үзэж шалгах'
                      : 'Inspect roof flue insulation collars at least twice per cold cycle'}
                  </span>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* ============================================================== */}
        {/* NEW SECTION: GRANULAR KHOROO-LEVEL BREAKDOWN & INSPECTION     */}
        {/* ============================================================== */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/[0.06] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF633C] font-bold">
                  {language === 'mn' ? 'ДООД ТҮВШИН: ХОРООД' : 'SUB-DISTRICT DRILL-DOWN'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 font-mono text-[10px] text-[#0B124D]">
                  {filteredKhoroos.length} хороо жагсаав
                </span>
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#0B124D]">
                {language === 'mn'
                  ? `${selectedDistrict.nameMn} дүүргийн хороодын нарийвчилсан үзүүлэлт`
                  : `${selectedDistrict.nameEn} District Khoroos Detail`}
              </h3>
            </div>

            {/* Filter Pills with horizontal scroll on mobile */}
            <div className="flex items-center gap-1.5 bg-[#F7F8FA] p-1 rounded-2xl text-xs overflow-x-auto max-w-full scrollbar-none">
              <button
                onClick={() => setKhorooFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap shrink-0 transition-all ${
                  khorooFilter === 'all'
                    ? 'bg-[#0B124D] text-white shadow-xs'
                    : 'text-[#72778A] hover:text-[#0B124D]'
                }`}
              >
                Бүгд ({districtKhoroos.length})
              </button>
              <button
                onClick={() => setKhorooFilter('high')}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap shrink-0 transition-all ${
                  khorooFilter === 'high'
                    ? 'bg-[#E93B2F] text-white shadow-xs'
                    : 'text-[#72778A] hover:text-[#0B124D]'
                }`}
              >
                Өндөр эрсдэлтэй
              </button>
              <button
                onClick={() => setKhorooFilter('ger')}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap shrink-0 transition-all ${
                  khorooFilter === 'ger'
                    ? 'bg-[#FF633C] text-white shadow-xs'
                    : 'text-[#72778A] hover:text-[#0B124D]'
                }`}
              >
                Гэр хороолол
              </button>
              <button
                onClick={() => setKhorooFilter('apt')}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap shrink-0 transition-all ${
                  khorooFilter === 'apt'
                    ? 'bg-[#12B89A] text-white shadow-xs'
                    : 'text-[#72778A] hover:text-[#0B124D]'
                }`}
              >
                Орон сууц
              </button>
            </div>
          </div>

          {/* Khoroo Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredKhoroos.map((kh) => {
              const badgeClass =
                kh.riskScore >= 75 ? 'bg-red-500 text-white' :
                kh.riskScore >= 55 ? 'bg-[#FF633C] text-white' :
                'bg-[#12B89A] text-white';

              return (
                <div
                  key={kh.id}
                  className="p-5 rounded-2xl bg-[#F7F8FA] border border-black/[0.04] hover:border-[#FF633C]/40 transition-all flex flex-col justify-between group shadow-2xs hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-[#72778A] uppercase block">
                          {selectedDistrict.nameMn} • ХОРОО
                        </span>
                        <h4 className="font-bold text-sm text-[#0B124D] group-hover:text-[#FF633C] transition-colors leading-snug">
                          {language === 'mn' ? kh.nameMn : kh.nameEn}
                        </h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full font-mono text-xs font-bold shrink-0 ${badgeClass}`}>
                        {kh.riskScore} pt
                      </span>
                    </div>

                    <p className="text-xs text-[#72778A] leading-relaxed line-clamp-2">
                      {language === 'mn' ? kh.primaryRiskFactorMn : kh.primaryRiskFactorEn}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-black/[0.04]">
                      <div>
                        <span className="text-[#72778A] block">Өрхийн тоо:</span>
                        <b className="font-mono text-[#0B124D]">{kh.households.toLocaleString()} өрх</b>
                      </div>
                      <div>
                        <span className="text-[#72778A] block">Гэр хороолол:</span>
                        <b className="font-mono text-[#FF633C]">{kh.gerHouseholdPercent}%</b>
                      </div>
                      <div>
                        <span className="text-[#72778A] block">Гидрант:</span>
                        <b className="font-mono text-[#0B124D]">{kh.fireHydrantCount} ширхэг</b>
                      </div>
                      <div>
                        <span className="text-[#72778A] block">Хүрэх хугацаа:</span>
                        <b className="font-mono text-[#E93B2F]">~{kh.avgResponseTimeMin} мин</b>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 mt-2 border-t border-black/[0.04]">
                    <button
                      onClick={() => setInspectingKhoroo(kh)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#FF633C] hover:text-white border border-black/[0.08] text-[11px] font-bold text-[#0B124D] transition-colors flex items-center gap-1"
                    >
                      <span>📷</span>
                      <span>Бодит зураг</span>
                    </button>
                    {onNavigateToMapWithDistrict && (
                      <button
                        onClick={() => onNavigateToMapWithDistrict(selectedDistrict.id)}
                        className="flex-1 py-1.5 rounded-xl bg-[#0B124D] hover:bg-[#11166B] text-white text-[11px] font-semibold text-center transition-colors shadow-xs"
                      >
                        Газрын зурагт харах
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Real Photo Inspection Modal for Khoroos */}
      {inspectingKhoroo && (
        <RealPhotoModal
          isOpen={Boolean(inspectingKhoroo)}
          onClose={() => setInspectingKhoroo(null)}
          title={inspectingKhoroo.nameMn}
          subtitle={`${selectedDistrict.nameMn} дүүрэг • ${inspectingKhoroo.khorooNumber}-р хороо`}
          photoUrl={inspectingKhoroo.photoUrl}
          satelliteUrl={selectedDistrict.satellitePhoto}
          descriptionMn={inspectingKhoroo.primaryRiskFactorMn}
          descriptionEn={inspectingKhoroo.primaryRiskFactorEn}
          riskScore={inspectingKhoroo.riskScore}
          language={language}
          metrics={[
            { label: 'Эрсдэлийн индекс', value: `${inspectingKhoroo.riskScore}/100` },
            { label: 'Нийт өрх', value: `${inspectingKhoroo.households.toLocaleString()}` },
            { label: 'Гэр хороолол', value: `${inspectingKhoroo.gerHouseholdPercent}%` },
            { label: 'Гидрант', value: `${inspectingKhoroo.fireHydrantCount} ширхэг` },
          ]}
        />
      )}
    </div>
  );
};
