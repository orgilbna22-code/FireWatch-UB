import React, { useState } from 'react';
import { FireStation, Language } from '../../types';
import { UB_FIRE_STATIONS } from '../../data/ubGeoData';
import { getTranslation } from '../../i18n/translations';

interface EmergencyCoverageProps {
  language: Language;
  onNavigateToMap?: () => void;
}

export const EmergencyCoverage: React.FC<EmergencyCoverageProps> = ({
  language,
  onNavigateToMap,
}) => {
  const t = getTranslation(language);
  const [selectedStation, setSelectedStation] = useState<FireStation>(UB_FIRE_STATIONS[0]);

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-[#F7F8FA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#0B124D]/10">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-[#FF633C] uppercase block mb-1">
              {language === 'mn' ? 'ОНЦГОЙ БАЙДЛЫН ХАМРАХ ХҮРЭЭ' : 'EMERGENCY INFRASTRUCTURE & ACCESS'}
            </span>
            <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B124D]">
              {language === 'mn'
                ? 'Гал түймэр унтраах, аврах ангиудын орон зайн байршил & хүрэх тойрог'
                : 'Fire & Rescue Station Distribution, Coverage Buffers & Access Radiuses'}
            </h1>
          </div>

          {onNavigateToMap && (
            <button
              onClick={onNavigateToMap}
              className="px-4 py-2.5 bg-[#0B124D] hover:bg-[#11166B] text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap shadow-xs"
            >
              {language === 'mn' ? 'Газрын зураг дээр харах' : 'View on GIS Map'} →
            </button>
          )}
        </div>

        {/* Disclaimer Banner on Response Times */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
          <span className="text-base shrink-0">⚠️</span>
          <p className="leading-relaxed">
            {language === 'mn'
              ? 'Энэхүү платформ нь хүрэх радиусыг орон зайн шууд зай болон замын сүлжээний ерөнхий өгөгдлөөр харуулдаг бөгөөд онцгой байдлын бодит хугацааны хүрэх хугацааг шууд тооцоолоогүй болно. Тактикийн эцсийн баталгаа болгон ашиглаж болохгүй.'
              : 'Station coverage circles represent spatial proximity buffers and network geography; tactical arrival times depend on traffic congestion, icy hill grades, and operational dispatch conditions.'}
          </p>
        </div>

        {/* Grid Layout: Stations List & Station Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Station List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="font-editorial text-lg font-bold text-[#0B124D] mb-4">
              {language === 'mn' ? 'Нийслэлийн гал түймэр унтраах, аврах ангиуд' : 'Operational Stations List'}
            </h3>

            {UB_FIRE_STATIONS.map((sta) => {
              const isSelected = sta.id === selectedStation.id;
              return (
                <div
                  key={sta.id}
                  onClick={() => setSelectedStation(sta)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-white border-[#FF633C] shadow-md ring-1 ring-[#FF633C]/20'
                      : 'bg-white border-[#0B124D]/8 hover:border-[#0B124D]/25'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono font-bold text-[#FF633C] uppercase">
                      {sta.code}
                    </span>
                    <span className="text-[11px] font-mono text-[#72778A]">
                      Радиус: ~{sta.coverageRadiusKm} км
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#0B124D] mb-1">
                    {language === 'mn' ? sta.nameMn : sta.nameEn}
                  </h4>
                  <p className="text-xs text-[#72778A] truncate">
                    {language === 'mn' ? sta.addressMn : sta.addressEn}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Selected Station Inspection Card (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-[#0B124D]/8 shadow-xs space-y-6">
            <div className="pb-6 border-b border-[#0B124D]/8">
              <span className="text-xs font-mono font-bold text-[#FF633C] uppercase tracking-wider block mb-1">
                {selectedStation.code} · ОБЕГ
              </span>
              <h2 className="font-editorial text-3xl font-bold text-[#0B124D]">
                {language === 'mn' ? selectedStation.nameMn : selectedStation.nameEn}
              </h2>
              <p className="text-xs sm:text-sm text-[#72778A] mt-2">
                {language === 'mn' ? selectedStation.addressMn : selectedStation.addressEn}
              </p>
            </div>

            {/* Tactical Resource Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#0B124D]/5">
                <span className="text-[10px] text-[#72778A] block mb-1">
                  {language === 'mn' ? 'Гал унтраах техник' : 'Apparatus & Trucks'}
                </span>
                <span className="font-mono text-2xl font-bold text-[#0B124D]">
                  {selectedStation.vehiclesCount}
                </span>
                <span className="text-[10px] text-[#72778A] block mt-1">
                  {language === 'mn' ? 'Тусгай зориулалтын автомашин' : 'Specialized engines'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#0B124D]/5">
                <span className="text-[10px] text-[#72778A] block mb-1">
                  {language === 'mn' ? 'Байнгын бие бүрэлдэхүүн' : 'Active Duty Crew'}
                </span>
                <span className="font-mono text-2xl font-bold text-[#0B124D]">
                  {selectedStation.personnelActive}
                </span>
                <span className="text-[10px] text-[#72778A] block mt-1">
                  {language === 'mn' ? 'Ээлжийн аврагчид' : 'Shift personnel'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#0B124D]/5 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[#72778A] block mb-1">
                  {language === 'mn' ? 'Үйлчлэх бүсийн радиус' : 'Nominal Buffer Radius'}
                </span>
                <span className="font-mono text-2xl font-bold text-[#FF633C]">
                  {selectedStation.coverageRadiusKm} км
                </span>
                <span className="text-[10px] text-[#72778A] block mt-1">
                  {language === 'mn' ? 'Орон зайн шууд хүрэх зай' : 'Primary buffer'}
                </span>
              </div>
            </div>

            {/* Serving Districts */}
            <div>
              <h4 className="font-mono text-xs font-bold text-[#0B124D] uppercase tracking-wider mb-2">
                {language === 'mn' ? 'ҮЙЛЧЛЭХ БҮС & ХАРИУЦАХ ДҮҮРГҮҮД' : 'ASSIGNED DISTRICT CORRIDORS'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {(language === 'mn' ? selectedStation.servingDistrictsMn : selectedStation.servingDistrictsEn).map(
                  (d, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-[#0B124D]/5 text-[#0B124D] text-xs font-semibold"
                    >
                      {d}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Coverage Gap Observation */}
            <div className="p-4 rounded-xl bg-[#F7F8FA] border border-[#0B124D]/5 text-xs text-[#72778A] leading-relaxed">
              <span className="font-bold text-[#0B124D] block mb-1">
                {language === 'mn' ? 'Орон зайн дүн шинжилгээний тэмдэглэл' : 'Spatial Coverage Observation'}
              </span>
              <p>
                {language === 'mn'
                  ? 'Алслагдсан хороодын уулын налуу болон гэр хорооллын мухар гудамж руу хүрэхэд үндсэн замаас салаалах зай уртсаж, гал түймрийн эрсдэлийн индекст сөргөөр нөлөөлдөг гол хүчин зүйл болдог.'
                  : 'Transit into steep peri-urban settlement alleys extends actual travel distances significantly beyond direct aerial radiuses, elevating vulnerability indices.'}
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
