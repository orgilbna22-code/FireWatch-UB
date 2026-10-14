import React, { useState } from 'react';
import { DistrictData, KhorooData, Language } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { RealPhotoModal } from '../common/RealPhotoModal';
import { RiskBreakdownList } from '../common/RiskBreakdownList';

interface AreaAnalysisPanelProps {
  district: DistrictData | null;
  selectedKhoroo?: KhorooData | null;
  onSelectKhoroo?: (khoroo: KhorooData | null) => void;
  onClose: () => void;
  language: Language;
  onNavigateToDetail?: (districtId: string) => void;
}

export const AreaAnalysisPanel: React.FC<AreaAnalysisPanelProps> = ({
  district,
  selectedKhoroo,
  onSelectKhoroo,
  onClose,
  language,
  onNavigateToDetail,
}) => {
  const t = getTranslation(language);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'reasons' | 'khoroos' | 'infrastructure'>('reasons');

  if (!district && !selectedKhoroo) return null;

  const isKhorooView = Boolean(selectedKhoroo);
  const activeRiskScore = isKhorooView ? selectedKhoroo!.riskScore : district!.riskScore;
  const activeRiskLevel = isKhorooView ? selectedKhoroo!.riskLevel : district!.riskLevel;

  const riskBadgeColor =
    activeRiskLevel === 'very_high'
      ? 'bg-red-500 text-white'
      : activeRiskLevel === 'high'
      ? 'bg-[#FF633C] text-white'
      : activeRiskLevel === 'moderate'
      ? 'bg-amber-500 text-white'
      : 'bg-[#12B89A] text-white';

  const photoToShow = isKhorooView
    ? selectedKhoroo!.photoUrl
    : district?.realWorldPhoto || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80';

  const titleText = isKhorooView
    ? (language === 'mn' ? selectedKhoroo!.nameMn : selectedKhoroo!.nameEn)
    : (language === 'mn' ? `${district!.nameMn} дүүрэг` : `${district!.nameEn} District`);

  const subDistrictText = isKhorooView
    ? (language === 'mn' ? `${district?.nameMn} дүүрэг` : `${district?.nameEn} District`)
    : (language === 'mn' ? `${district!.khoroosCount} хороотой` : `${district!.khoroosCount} khoroos`);

  return (
    <>
      <div className="absolute top-4 right-4 bottom-4 w-full max-w-md bg-white/98 backdrop-blur-2xl rounded-3xl shadow-2xl border border-black/[0.08] z-[1000] flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-right-4">
        
        {/* Panel Header */}
        <div className="p-4 sm:p-5 border-b border-black/[0.06] flex items-center justify-between bg-[#F7F8FA]">
          <div className="flex-1 pr-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF633C] uppercase block">
                {isKhorooView ? 'ХОРООНЫ ЭРСДЭЛИЙН ЗАДАРГАА' : 'ДҮҮРГИЙН ЭРСДЭЛИЙН ЗАДАРГАА'}
              </span>
              {isKhorooView && onSelectKhoroo && (
                <button
                  onClick={() => onSelectKhoroo(null)}
                  className="text-[10px] font-mono text-[#0B124D] underline hover:text-[#FF633C] font-semibold"
                >
                  ← Дүүрэг рүү буцах
                </button>
              )}
            </div>
            <h3 className="font-editorial text-2xl font-bold text-[#0B124D] leading-tight">
              {titleText}
            </h3>
            <p className="text-xs text-[#72778A] font-mono mt-0.5">
              {subDistrictText}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-black/5 hover:bg-[#FF633C] hover:text-white text-[#0B124D] text-xs font-semibold transition-all flex items-center gap-1"
              title="Бодит фото зураг томруулах"
            >
              <span>📷</span>
              <span className="hidden sm:inline">Бодит</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 border border-black/[0.08] flex items-center justify-center text-[#72778A] hover:text-[#0B124D] transition-colors"
              aria-label="Хаах"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Navigation Tabs inside Panel for clean structure */}
        <div className="flex items-center gap-1 bg-[#F2F4F7] p-1 mx-4 mt-3 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('reasons')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              activeTab === 'reasons'
                ? 'bg-white text-[#0B124D] shadow-xs font-bold'
                : 'text-[#72778A] hover:text-[#0B124D]'
            }`}
          >
            📋 Яагаад энэ эрсдэлтэй вэ?
          </button>
          {!isKhorooView && district?.khoroos && district.khoroos.length > 0 && (
            <button
              onClick={() => setActiveTab('khoroos')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                activeTab === 'khoroos'
                  ? 'bg-white text-[#0B124D] shadow-xs font-bold'
                  : 'text-[#72778A] hover:text-[#0B124D]'
              }`}
            >
              🏘️ Хороод ({district.khoroos.length})
            </button>
          )}
          <button
            onClick={() => setActiveTab('infrastructure')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              activeTab === 'infrastructure'
                ? 'bg-white text-[#0B124D] shadow-xs font-bold'
                : 'text-[#72778A] hover:text-[#0B124D]'
            }`}
          >
            🚒 Дэд бүтэц
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          
          {/* TAB 1: ITEMIZED REASONS LIST (Answers "jagsaaj bich ygd ene gzr iim huviin gal grah mgdaltei bgg") */}
          {activeTab === 'reasons' && (
            <div className="space-y-4">
              
              {/* Photo Banner with Click to Zoom */}
              <div
                onClick={() => setIsPhotoModalOpen(true)}
                className="relative h-24 rounded-2xl overflow-hidden cursor-pointer group shadow-2xs border border-black/[0.06]"
              >
                <img
                  src={photoToShow}
                  alt={titleText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end justify-between p-3">
                  <div>
                    <span className="text-[10px] font-mono text-white/70 uppercase block">
                      Бодит нөхцөл байдал
                    </span>
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      🔍 4K Зураг томруулж шалгах
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md font-mono text-xs font-bold ${riskBadgeColor}`}>
                    {activeRiskScore}% эрсдэл
                  </span>
                </div>
              </div>

              {/* Explicit Numbered Itemized Risk List */}
              <RiskBreakdownList
                district={district}
                khoroo={selectedKhoroo}
                language={language}
              />
            </div>
          )}

          {/* TAB 2: KHOROOS BREAKDOWN */}
          {activeTab === 'khoroos' && !isKhorooView && district && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#72778A]">
                <span>ХОРООДЫН ЭРСДЭЛИЙН ЖАГСААЛТ:</span>
                <span>Нийт {district.khoroos?.length || 0} хороо</span>
              </div>

              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {district.khoroos?.map((kh) => (
                  <div
                    key={kh.id}
                    onClick={() => onSelectKhoroo && onSelectKhoroo(kh)}
                    className="p-3 rounded-2xl bg-[#F7F8FA] hover:bg-white hover:border-[#FF633C] border border-black/[0.04] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[#0B124D] group-hover:text-[#FF633C] transition-colors">
                        {language === 'mn' ? kh.nameMn : kh.nameEn}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        kh.riskScore >= 75 ? 'bg-red-100 text-red-700' :
                        kh.riskScore >= 55 ? 'bg-orange-100 text-[#FF633C]' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {kh.riskScore}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#72778A]">
                      <span>{kh.households.toLocaleString()} өрх • Гэр: {kh.gerHouseholdPercent}%</span>
                      <span>🚒 Хүрэх: ~{kh.avgResponseTimeMin} мин</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INFRASTRUCTURE & METRICS */}
          {activeTab === 'infrastructure' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#F7F8FA] border border-black/[0.04]">
                  <span className="text-[10px] text-[#72778A] block mb-0.5">
                    💧 Гал унтраах гидрант
                  </span>
                  <span className="font-mono font-bold text-[#0B124D] text-base">
                    {isKhorooView ? `${selectedKhoroo?.fireHydrantCount} ширхэг` : `${district?.fireStationsCount} анги`}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F7F8FA] border border-black/[0.04]">
                  <span className="text-[10px] text-[#72778A] block mb-0.5">
                    🚒 Гал сөнөөгч очих хугацаа
                  </span>
                  <span className="font-mono font-bold text-[#FF633C] text-base">
                    {isKhorooView ? `~${selectedKhoroo?.avgResponseTimeMin} мин` : `~${district?.nearestStationDistKm} км`}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F7F8FA] border border-black/[0.04]">
                  <span className="text-[10px] text-[#72778A] block mb-0.5">
                    🎪 Гэр хорооллын хувь
                  </span>
                  <span className="font-mono font-bold text-amber-600 text-base">
                    {isKhorooView ? `${selectedKhoroo?.gerHouseholdPercent}%` : `${district?.gerHouseholdPercent}%`}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F7F8FA] border border-black/[0.04]">
                  <span className="text-[10px] text-[#72778A] block mb-0.5">
                    🛣️ Замын нэвтрэлт
                  </span>
                  <span className="font-mono font-bold text-[#0B124D] text-base">
                    {isKhorooView ? selectedKhoroo?.roadAccessibility : `${district?.roadAccessibilityGrade} түвшин`}
                  </span>
                </div>
              </div>

              {/* Field Observations */}
              <div className="p-4 rounded-2xl bg-[#F7F8FA] border border-black/[0.04] space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF633C] font-bold block">
                  ШИНЖИЛГЭЭНИЙ ТЭМДЭГЛЭЛ
                </span>
                <p className="text-xs text-[#12152A]/85 leading-relaxed">
                  {isKhorooView
                    ? selectedKhoroo?.primaryRiskFactorMn
                    : district?.keyObservationsMn}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer Action Bar */}
        <div className="p-4 border-t border-black/[0.06] bg-[#F7F8FA] flex items-center gap-2">
          <button
            onClick={() => setIsPhotoModalOpen(true)}
            className="px-3.5 py-2.5 bg-white border border-black/[0.08] hover:bg-slate-100 text-[#0B124D] text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
          >
            <span>📷</span>
            <span>Бодит зураг</span>
          </button>

          {!isKhorooView && district && onNavigateToDetail && (
            <button
              onClick={() => onNavigateToDetail(district.id)}
              className="flex-1 py-2.5 text-xs font-bold text-white bg-[#0B124D] hover:bg-[#11166B] rounded-xl transition-all text-center shadow-xs active:scale-95"
            >
              Дүүргийн дэлгэрэнгүй шинжилгээ үзэх
            </button>
          )}

          {isKhorooView && (
            <button
              onClick={() => onSelectKhoroo && onSelectKhoroo(null)}
              className="flex-1 py-2.5 text-xs font-bold text-white bg-[#0B124D] hover:bg-[#11166B] rounded-xl transition-all text-center shadow-xs"
            >
              Дүүргийн харагдац руу буцах
            </button>
          )}
        </div>

      </div>

      {/* Real Photo Inspection Modal */}
      <RealPhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        title={titleText}
        subtitle={subDistrictText}
        photoUrl={photoToShow}
        satelliteUrl={district?.satellitePhoto}
        descriptionMn={
          isKhorooView
            ? selectedKhoroo?.primaryRiskFactorMn
            : district?.keyObservationsMn
        }
        descriptionEn={
          isKhorooView
            ? selectedKhoroo?.primaryRiskFactorEn
            : district?.keyObservationsEn
        }
        riskScore={activeRiskScore}
        language={language}
        metrics={[
          { label: 'Эрсдэлийн магадлал', value: `${activeRiskScore}%` },
          {
            label: isKhorooView ? 'Өрхийн тоо' : 'Хүн ам',
            value: isKhorooView
              ? `${selectedKhoroo?.households.toLocaleString()} өрх`
              : `${district?.population.toLocaleString()} хүн`,
          },
          {
            label: 'Гэр хороолол',
            value: `${isKhorooView ? selectedKhoroo?.gerHouseholdPercent : district?.gerHouseholdPercent}%`,
          },
          {
            label: 'Гал сөнөөгч хүрэх',
            value: isKhorooView ? `~${selectedKhoroo?.avgResponseTimeMin} мин` : `~${district?.nearestStationDistKm} км`,
          },
        ]}
      />
    </>
  );
};
