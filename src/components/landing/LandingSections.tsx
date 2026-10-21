import React from 'react';
import { ActiveTab, Language } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { unitKmPerHour } from '../../i18n/labels';
import { UB_DISTRICTS, MONTH_RISK_CALENDAR } from '../../data/ubGeoData';
import { RISK_VARIABLES_METADATA } from '../../data/riskConfig';
import { SAFETY_GUIDES } from '../../data/safetyData';
import { FireSimulationLab } from '../simulation/FireSimulationLab';

interface LandingSectionsProps {
  language: Language;
  onSelectTab: (tab: ActiveTab) => void;
  onSelectDistrict?: (districtId: string) => void;
  onOpenDemoInfo: () => void;
}

export const LandingSections: React.FC<LandingSectionsProps> = ({
  language,
  onSelectTab,
  onSelectDistrict,
  onOpenDemoInfo,
}) => {
  const t = getTranslation(language);

  return (
    <div className="w-full bg-[#FFFFFF]">
      
      {/* ========================================================= */}
      {/* 02. АСУУДАЛ (THE PROBLEM DEEP DIVE)                       */}
      {/* ========================================================= */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#0B124D]/10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono font-bold tracking-widest text-[#FF633C] uppercase">
            02 · {language === 'mn' ? 'ХОТЫН СОРИЛТ' : 'URBAN CHALLENGE'}
          </span>
        </div>
        <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B124D] mb-6 text-balance">
          {language === 'mn'
            ? 'Улаанбаатар хотын орон зайн эрсдэлийг яагаад өгөгдлөөр харах шаардлагатай вэ?'
            : 'Why Ulaanbaatar urgently requires spatial intelligence for fire prevention'}
        </h2>
        <p className="text-base sm:text-lg text-[#72778A] max-w-3xl leading-relaxed mb-12 text-balance">
          {language === 'mn'
            ? 'Гал унтраах ажиллагаа нь хор уршгийг арилгах үе шат юм. Харин хүний амь нас, эд хөрөнгийг бодитой хамгаалах цорын ганц тогтвортой зам бол гал гарахаас өмнө хаана, яагаад эрсдэл хуримтлагдаж буйг олон хүчин зүйлээр тооцоолж, урьдчилан тандах явдал юм.'
            : 'Fire suppression responds after devastation begins. True civil safety demands identifying where and why hazards accumulate across dense informal settlements, rugged topography, and cold heating cycles before ignition happens.'}
        </p>

        {/* 3 Core Vulnerability Vectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-[#F7F8FA] border border-[#0B124D]/8">
            <div className="w-10 h-10 rounded-xl bg-[#0B124D] text-white flex items-center justify-center font-mono text-sm font-bold mb-4">
              01
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#0B124D] mb-2">
              {language === 'mn' ? 'Гэр хорооллын халаалтын улирал' : 'Stove Heating Season Cycle'}
            </h3>
            <p className="text-sm text-[#72778A] leading-relaxed">
              {language === 'mn'
                ? '9 сарын 15-наас 5 сарын 15 хүртэл 200,000 гаруй айл өрх зуух галладаг. Яндангийн цоорол, халуун үнс нурам, сайжруулсан түлшний тортог нь ахуйн галын 70 гаруй хувийг эзэлдэг.'
                : 'Over 200,000 households fire solid-fuel stoves throughout an 8-month winter. Hot ash dumps and chimney flue degradation constitute over 70% of residential emergencies.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F7F8FA] border border-[#0B124D]/8">
            <div className="w-10 h-10 rounded-xl bg-[#0B124D] text-white flex items-center justify-center font-mono text-sm font-bold mb-4">
              02
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#0B124D] mb-2">
              {language === 'mn' ? 'Замын нэвтрэх чадвар & Налуу' : 'Access Alley & Slope Impedance'}
            </h3>
            <p className="text-sm text-[#72778A] leading-relaxed">
              {language === 'mn'
                ? 'Уулын бэл дагасан нарийн мухар гудамж, тэгш бус хашаанууд нь 10-15 тонн жинтэй гал унтраах автомашин очиход дундаж хугацааг 2 дахин сунгадаг.'
                : 'Narrow dead-end lanes and steep hillside inclines double response transit times for heavy 15-ton fire engines during winter ice and snow.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F7F8FA] border border-[#0B124D]/8">
            <div className="w-10 h-10 rounded-xl bg-[#0B124D] text-white flex items-center justify-center font-mono text-sm font-bold mb-4">
              03
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#0B124D] mb-2">
              {language === 'mn' ? 'Хаврын хуурайшилтын салхи' : 'Spring Gale Desiccation'}
            </h3>
            <p className="text-sm text-[#72778A] leading-relaxed">
              {language === 'mn'
                ? '4 ба 5-р сард агаарын чийгшил 30%-иас буурч, салхи 20-30 км/ц хүрдэг. Хашааны шар өвс шатаах, ойн захын оч хоромхон зуур хэдэн зуун метр тархдаг.'
                : 'In April and May, relative humidity plunges under 30% while desiccating winds gust over 30 km/h, turning isolated embers into rapid wildfire vectors within minutes.'}
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 04. LIVE UB MAP PREVIEW CALLOUT                           */}
      {/* ========================================================= */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#0B124D]/10">
        <div className="bg-[#0B124D] rounded-3xl p-8 md:p-14 text-white relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <span className="text-xs font-mono font-bold tracking-widest text-[#FF633C] uppercase block mb-3">
              04 · {language === 'mn' ? 'ОРОН ЗАЙН ЗУРАГЛАЛ' : 'GIS SPATIAL PLATFORM'}
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">
              {language === 'mn'
                ? 'Улаанбаатарын 9 дүүрэг, бүх хороодын эрсдэлийг интерактив газрын зураг дээр'
                : 'Visualizing 9 districts & key sub-khoroos across high-resolution spatial layers'}
            </h2>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-8">
              {language === 'mn'
                ? 'Гал унтраах ангиудын хүрэх тойрог, түүхэн дуудлагын кластер, гэр хорооллын нягтрал болон цаг агаарын нөлөөллийг бүрэн хэмжээний газрын зураг дээр шууд шинжилнэ үү.'
                : 'Explore fire station buffer radiuses, historical incident clusters, residential ger density, and real-time weather constraints in our full GIS environment.'}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onSelectTab('map')}
                className="px-6 py-3 bg-[#FF633C] hover:bg-[#e05430] text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-[#FF633C]/30 flex items-center gap-2"
              >
                <span>{t.ctaButton}</span>
                <span>→</span>
              </button>
              <button
                onClick={() => onSelectTab('explorer')}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors border border-white/20"
              >
                {language === 'mn' ? 'Хүчин зүйлийн симулятор' : 'Open Risk Simulator'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SIGNATURE FEATURE: INTERACTIVE FLAME PHYSICS LAB          */}
      {/* ========================================================= */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#0B124D]/10">
        <FireSimulationLab
          language={language}
          onExploreMap={() => onSelectTab('map')}
        />
      </section>

      {/* ========================================================= */}
      {/* 05. HOW RISK IS CALCULATED (TRANSPARENT METHODOLOGY)      */}
      {/* ========================================================= */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#0B124D]/10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-bold tracking-widest text-[#FF633C] uppercase">
            05 · {language === 'mn' ? 'ИЛ ТОД ЗАГВАРЧЛАЛ' : 'TRANSPARENT METHODOLOGY'}
          </span>
          <button
            onClick={() => onSelectTab('sources')}
            className="text-xs font-mono text-[#0B124D] hover:underline"
          >
            {language === 'mn' ? 'Өгөгдлийн эх сурвалж харах →' : 'View Data Sources →'}
          </button>
        </div>
        <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#0B124D] mb-4 text-balance">
          {language === 'mn'
            ? 'Эрсдэлийн индексийг хэрхэн тооцоолдог вэ?'
            : 'How the Normalized Fire-Risk Indicator is Derived'}
        </h2>
        <p className="text-sm sm:text-base text-[#72778A] max-w-2xl leading-relaxed mb-10 text-balance">
          {language === 'mn'
            ? 'Бид ямар ч нууц, хаалттай дур мэдсэн жин ашигладаггүй. Бүх 6 үндсэн хувьсагчийн нормчилсон жин, математик тооцоолол болон эх сурвалж нээлттэй байна.'
            : 'We reject opaque arbitrary weights. All 6 core environmental and structural variables operate on fully documented, open normalization formulas.'}
        </p>

        {/* 6 Variables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RISK_VARIABLES_METADATA.map((v) => (
            <div
              key={v.variableId}
              className="p-5 rounded-2xl bg-[#F7F8FA] border border-[#0B124D]/8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold text-[#72778A] uppercase">
                    {v.code}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#0B124D] bg-white px-2 py-0.5 rounded border border-[#0B124D]/10">
                    {v.weightPercent}% {language === 'mn' ? 'жин' : 'weight'}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#0B124D] mb-1.5">
                  {language === 'mn' ? v.nameMn : v.nameEn}
                </h4>
                <p className="text-xs text-[#72778A] leading-relaxed mb-3">
                  {language === 'mn' ? v.descriptionMn : v.descriptionEn}
                </p>
              </div>
              <div className="pt-3 border-t border-[#0B124D]/8 text-[11px] font-mono text-[#72778A]">
                <span className="block text-[10px] uppercase text-[#72778A]/70 mb-0.5">
                  {language === 'mn' ? 'Эх сурвалж' : 'Data Source'}:
                </span>
                <span className="truncate block">
                  {language === 'mn' ? v.dataSourceMn : v.dataSourceEn}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 06. DISTRICT ANALYSIS HIGHLIGHTS                          */}
      {/* ========================================================= */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#0B124D]/10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-bold tracking-widest text-[#FF633C] uppercase">
            06 · {language === 'mn' ? 'ДҮҮРГҮҮДИЙН ТӨЛӨВ' : 'DISTRICT SPECTRUM'}
          </span>
          <button
            onClick={() => onSelectTab('districts')}
            className="text-xs font-mono text-[#0B124D] hover:underline"
          >
            {language === 'mn' ? 'Бүх 9 дүүргийг харьцуулах →' : 'Compare All 9 Districts →'}
          </button>
        </div>
        <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#0B124D] mb-4 text-balance">
          {language === 'mn'
            ? 'Улаанбаатарын дүүргүүдийн харьцуулсан үзүүлэлтүүд'
            : 'Comparative Risk Indicators across Ulaanbaatar'}
        </h2>
        <p className="text-sm sm:text-base text-[#72778A] max-w-2xl leading-relaxed mb-10 text-balance">
          {language === 'mn'
            ? 'Аналитик загвараар тооцсон эрсдэлийн индекс, гэр хорооллын эзлэх хувь болон түргэн тусламжийн хүртээмж.'
            : 'Normalized risk scores, ger settlement ratios, and emergency station proximity.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {UB_DISTRICTS.slice(0, 6).map((d) => (
            <div
              key={d.id}
              onClick={() => {
                if (onSelectDistrict) onSelectDistrict(d.id);
                onSelectTab('districts');
              }}
              className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#0B124D]/10 hover:border-[#FF633C] hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-editorial text-lg font-bold text-[#0B124D]">
                  {language === 'mn' ? d.nameMn : d.nameEn}
                </span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    d.riskLevel === 'very_high'
                      ? 'bg-red-100 text-red-700'
                      : d.riskLevel === 'high'
                      ? 'bg-orange-100 text-[#FF633C]'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {d.riskScore} / 100
                </span>
              </div>
              <p className="text-xs text-[#72778A] line-clamp-2 leading-relaxed mb-4">
                {language === 'mn' ? d.keyObservationsMn : d.keyObservationsEn}
              </p>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#0B124D]/8 text-center">
                <div>
                  <span className="text-[10px] text-[#72778A] block">
                    {language === 'mn' ? 'Гэр өрх' : 'Ger Ratio'}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#0B124D]">
                    {d.gerHouseholdPercent}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#72778A] block">
                    {language === 'mn' ? 'Ангийн тоо' : 'Stations'}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#0B124D]">
                    {d.fireStationsCount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#72778A] block">
                    {language === 'mn' ? 'Замын зэрэг' : 'Road Access'}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#0B124D]">
                    {d.roadAccessibilityGrade}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 07. 12-MONTH ANALYSIS STRIP                               */}
      {/* ========================================================= */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#0B124D]/10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-bold tracking-widest text-[#FF633C] uppercase">
            07 · {language === 'mn' ? 'УЛИРЛЫН ХУАНЛИ' : 'ANNUAL RISK CYCLE'}
          </span>
          <button
            onClick={() => onSelectTab('calendar')}
            className="text-xs font-mono text-[#0B124D] hover:underline"
          >
            {language === 'mn' ? 'Бүрэн 12 сарын дүн шинжилгээ үзэх →' : 'View Full 12-Month Calendar →'}
          </button>
        </div>
        <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#0B124D] mb-4 text-balance">
          {language === 'mn'
            ? 'Жилийн 12 сарын эрсдэлийн хэлбэлзэл ба онцлог үе шатууд'
            : 'Seasonal Dynamics & 12-Month Vulnerability Peaks'}
        </h2>
        <p className="text-sm sm:text-base text-[#72778A] max-w-2xl leading-relaxed mb-8 text-balance">
          {language === 'mn'
            ? 'Хаврын хуурай салхитай 4-р сар болон өвлийн тэсгим хүйтэн 1-р сар нийслэл хотод галын хамгийн өндөр эрсдэлтэй оргил сарууд болдог.'
            : 'April (extreme vegetation dryness and gales) and January (dead of winter freezing and constant stove firing) mark annual risk zeniths.'}
        </p>

        {/* 12 Months horizontal grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {MONTH_RISK_CALENDAR.map((m) => {
            const isVeryHigh = m.riskScore >= 80;
            const isHigh = m.riskScore >= 60 && m.riskScore < 80;
            return (
              <div
                key={m.month}
                onClick={() => onSelectTab('calendar')}
                className="p-4 rounded-xl bg-[#F7F8FA] border border-[#0B124D]/8 hover:border-[#0B124D]/30 transition-all cursor-pointer text-left"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono font-bold text-[#0B124D]">
                    {language === 'mn' ? m.shortMn : m.shortEn}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isVeryHigh
                        ? 'bg-red-100 text-red-700'
                        : isHigh
                        ? 'bg-orange-100 text-[#FF633C]'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {m.riskScore}
                  </span>
                </div>
                <div className="text-[11px] text-[#72778A] truncate mb-1">
                  {m.avgTempCelsius}°C · {m.windSpeedKmh} {unitKmPerHour(language === 'mn')}
                </div>
                <div className="text-[10px] text-[#0B124D] font-medium line-clamp-1">
                  {language === 'mn' ? m.primaryDriversMn[0] : m.primaryDriversEn[0]}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 08. SAFETY CENTER PREVIEW                                 */}
      {/* ========================================================= */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-[#0B124D]/10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-mono font-bold tracking-widest text-[#FF633C] uppercase">
            08 · {language === 'mn' ? 'ИРГЭДИЙН АЮУЛГҮЙ БАЙДАЛ' : 'PUBLIC SAFETY KNOWLEDGE'}
          </span>
          <button
            onClick={() => onSelectTab('safety')}
            className="text-xs font-mono text-[#0B124D] hover:underline"
          >
            {language === 'mn' ? 'Бүх 7 зааварчилгааг үзэх →' : 'View All 7 Safety Guides →'}
          </button>
        </div>
        <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#0B124D] mb-4 text-balance">
          {language === 'mn'
            ? 'Амь нас, эд хөрөнгөө хамгаалах шалгагдсан зааварчилгаа'
            : 'Verified Life Safety Guides & Prevention Checklists'}
        </h2>
        <p className="text-sm sm:text-base text-[#72778A] max-w-2xl leading-relaxed mb-10 text-balance">
          {language === 'mn'
            ? 'ОБЕГ-ын албан ёсны зөвлөмжид суурилсан гэр, сургууль, орон сууц, зуухны аюулгүй байдлын цэгцтэй гарын авлага.'
            : 'Concise protocols based on National Emergency Management Agency guidelines for homes, schools, and heating.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAFETY_GUIDES.slice(0, 3).map((g) => (
            <div
              key={g.id}
              onClick={() => onSelectTab('safety')}
              className="p-6 rounded-2xl bg-[#F7F8FA] border border-[#0B124D]/8 hover:border-[#FF633C] transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#FF633C] text-white flex items-center justify-center font-mono text-xs font-bold mb-3">
                {g.topicNumber}
              </div>
              <h3 className="font-bold text-base text-[#0B124D] mb-2">
                {language === 'mn' ? g.titleMn : g.titleEn}
              </h3>
              <p className="text-xs text-[#72778A] leading-relaxed mb-4">
                {language === 'mn' ? g.summaryMn : g.summaryEn}
              </p>
              <div className="space-y-1.5 pt-3 border-t border-[#0B124D]/8 text-xs text-[#0B124D]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#12B89A]" />
                  <span className="truncate">{language === 'mn' ? g.keySteps[0].actionMn : g.keySteps[0].actionEn}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#12B89A]" />
                  <span className="truncate">{language === 'mn' ? g.keySteps[1].actionMn : g.keySteps[1].actionEn}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 12. FINAL CTA: Улаанбаатарын эрсдэлийг өгөгдлөөр харцгаая */}
      {/* ========================================================= */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#0B124D] text-[#FF633C] flex items-center justify-center mx-auto mb-6 shadow-md">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C8 6 6 9 6 13a6 6 0 0 0 12 0c0-4-2-7-6-11z" />
              <circle cx="12" cy="15" r="2" fill="white" stroke="none" />
            </svg>
          </div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#0B124D] mb-4 text-balance">
            {t.ctaHeadline}
          </h2>
          <p className="text-sm sm:text-base text-[#72778A] mb-8 leading-relaxed max-w-xl mx-auto text-balance">
            {language === 'mn'
              ? 'Гал гарахаас өмнө сэргийлэх орон зайн тандалт, дүүргийн шинжилгээ, онцгой байдлын хамрах хүрээг нэг дороос хянана уу.'
              : 'Empower preventive civil safety through spatial intelligence, district breakdown, and emergency access metrics.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onSelectTab('map')}
              className="px-8 py-3.5 bg-[#FF633C] hover:bg-[#e05430] text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-[#FF633C]/25 flex items-center gap-2"
            >
              <span>{t.ctaButton}</span>
              <span>→</span>
            </button>
            <button
              onClick={() => onSelectTab('reports')}
              className="px-6 py-3.5 bg-[#F7F8FA] hover:bg-slate-200 text-[#0B124D] text-sm font-semibold rounded-xl transition-colors border border-[#0B124D]/10"
            >
              {language === 'mn' ? 'Аналитик тайлан үүсгэх' : 'Generate Analytical Report'}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
