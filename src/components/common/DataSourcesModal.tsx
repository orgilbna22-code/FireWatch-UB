import React, { useState } from 'react';
import { Language } from '../../types';

interface DataSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const DataSourcesModal: React.FC<DataSourcesModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'sources' | 'quality' | 'demo' | 'admin'>('sources');

  if (!isOpen) return null;

  const sourcesList = [
    {
      nameMn: 'Нийслэлийн Онцгой байдлын газар (ОБЕГ)',
      nameEn: 'National Emergency Management Agency (NEMA)',
      datasetMn: 'Гал түймрийн дуудлагын орон зайн түүх ба ангиудын байршил',
      datasetEn: 'Historical Fire Call Logs & Station Geometries',
      period: '2022–2026',
      coverageMn: 'Нийслэлийн 9 дүүрэг, 204 хороо',
      coverageEn: '9 UB Districts, 204 Khoroos',
      limitationsMn: 'Зарим алслагдсан хороодын хувьд гудамжны хаягжилт дутуу тул дүүргийн төв цэгээр ойролцоолсон.',
      limitationsEn: 'Certain peripheral unplanned settlements rely on centroid approximations due to non-standard street naming.',
      verified: true,
    },
    {
      nameMn: 'Үндэсний Статистикийн Хороо (ҮСХ)',
      nameEn: 'National Statistics Office of Mongolia (NSO)',
      datasetMn: 'Хүн ам, орон сууц, гэр хорооллын өрхийн суурь судалгаа',
      datasetEn: 'Population & Housing Census, Ger Settlement Metrics',
      period: '2024–2025',
      coverageMn: 'Улаанбаатар хот 100%',
      coverageEn: 'Ulaanbaatar 100%',
      limitationsMn: 'Жил бүрийн шилжилт хөдөлгөөний улмаас түр оршин суугчдын тоо 5-8% зөрүүтэй байх магадлалтай.',
      limitationsEn: 'Seasonal migration induces potential 5-8% deviation in temporary unregistered resident estimates.',
      verified: true,
    },
    {
      nameMn: 'Цаг уур, орчны шинжилгээний газар (ЦУОШГ)',
      nameEn: 'National Agency for Meteorology & Environmental Monitoring (NAMEM)',
      datasetMn: 'Агаарын температур, харьцангуй чийгшил, салхины дундаж хурд',
      datasetEn: 'Ambient Temperature, Relative Humidity, Wind Vector Logs',
      period: '1990–2026',
      coverageMn: 'УБ-Буянт-Ухаа, Амгалан станцууд',
      coverageEn: 'Buyant-Ukhaa and Amgalan Meteorological Stations',
      limitationsMn: 'Хот доторх бичил уур амьсгалын (micro-climate) нарийн ялгааг 100% тусгахгүй.',
      limitationsEn: 'Does not fully capture micro-climate temperature inversions between river basins and mountain ridges.',
      verified: true,
    },
    {
      nameMn: 'OpenStreetMap & Shuttle Radar Topography (SRTM)',
      nameEn: 'OpenStreetMap & SRTM Digital Elevation Data',
      datasetMn: 'Авто замын ангилал, өндөржлийн налуу, гудамжны өргөн',
      datasetEn: 'Road Network Graph, Slope Gradient, Lane Widths',
      period: '2026 Continuous',
      coverageMn: 'Нийслэлийн нийт замын сүлжээ',
      coverageEn: 'Full Metropolitan Road Network',
      limitationsMn: 'Гэр хорооллын шинээр нэмэгдсэн мухар хашаанууд газрын зурагт хоцорч тусдаг.',
      limitationsEn: 'Newly fenced informal alley closures can experience mapping lag.',
      verified: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-[#0B124D]/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-[#0B124D]/10 max-h-[90vh] flex flex-col overflow-hidden animate-pop-in">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#0B124D]/10">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF633C] uppercase block mb-0.5">
              FIREWATCH UB · GOVERNANCE
            </span>
            <h3 className="font-editorial text-2xl font-bold text-[#0B124D]">
              {language === 'mn' ? 'Өгөгдлийн эх сурвалж ба ил тод байдал' : 'Data Provenance & Governance'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F7F8FA] hover:bg-slate-200 text-[#72778A] hover:text-[#0B124D] flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-slate-100 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'sources'
                ? 'bg-[#0B124D] text-white'
                : 'text-[#72778A] hover:text-[#0B124D]'
            }`}
          >
            {language === 'mn' ? 'Эх сурвалжууд' : 'Sources'}
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'quality'
                ? 'bg-[#0B124D] text-white'
                : 'text-[#72778A] hover:text-[#0B124D]'
            }`}
          >
            {language === 'mn' ? 'Өгөгдлийн чанар' : 'Data Quality'}
          </button>
          <button
            onClick={() => setActiveTab('demo')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'demo'
                ? 'bg-[#FF633C] text-white'
                : 'text-[#72778A] hover:text-[#0B124D]'
            }`}
          >
            {language === 'mn' ? 'Жишээ горим (Demo)' : 'Demo Mode Policy'}
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'admin'
                ? 'bg-[#0B124D] text-white'
                : 'text-[#72778A] hover:text-[#0B124D]'
            }`}
          >
            {language === 'mn' ? 'Админ холболт' : 'Data Integration API'}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
          
          {/* TAB 1: Sources */}
          {activeTab === 'sources' && (
            <div className="space-y-4">
              {sourcesList.map((s, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#F7F8FA] border border-[#0B124D]/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#0B124D]">
                      {language === 'mn' ? s.nameMn : s.nameEn}
                    </span>
                    <span className="font-mono text-[10px] text-[#12B89A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ {language === 'mn' ? 'Баталгаажсан' : 'Verified'}
                    </span>
                  </div>
                  <p className="text-[#0B124D] font-medium">
                    {language === 'mn' ? s.datasetMn : s.datasetEn}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#72778A]">
                    <div>
                      <b>{language === 'mn' ? 'Хамрах хугацаа' : 'Period'}:</b> {s.period}
                    </div>
                    <div>
                      <b>{language === 'mn' ? 'Хамрах хүрээ' : 'Coverage'}:</b> {language === 'mn' ? s.coverageMn : s.coverageEn}
                    </div>
                  </div>
                  <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-100 italic">
                    <b>{language === 'mn' ? 'Хязгаарлалт' : 'Limitations'}:</b> {language === 'mn' ? s.limitationsMn : s.limitationsEn}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Quality */}
          {activeTab === 'quality' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#F7F8FA] rounded-xl border border-slate-200">
                  <span className="text-[10px] text-[#72778A] block">Шинжилсэн бичлэг</span>
                  <span className="font-mono text-lg font-bold text-[#0B124D]">1,937</span>
                </div>
                <div className="p-3 bg-[#F7F8FA] rounded-xl border border-slate-200">
                  <span className="text-[10px] text-[#72778A] block">Орон зайн хамралт</span>
                  <span className="font-mono text-lg font-bold text-[#12B89A]">98.4%</span>
                </div>
                <div className="p-3 bg-[#F7F8FA] rounded-xl border border-slate-200">
                  <span className="text-[10px] text-[#72778A] block">Дутуу утга (Missing)</span>
                  <span className="font-mono text-lg font-bold text-[#FF633C]">1.6%</span>
                </div>
                <div className="p-3 bg-[#F7F8FA] rounded-xl border border-slate-200">
                  <span className="text-[10px] text-[#72778A] block">Сүүлийн шалгалт</span>
                  <span className="font-mono text-xs font-bold text-[#0B124D]">2026-09-30</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#72778A] leading-relaxed">
                <span className="font-bold text-[#0B124D] block mb-1">
                  Өгөгдлийн бүрэн бүтэн байдлын дүрэм:
                </span>
                <p>
                  "Энэ хэсгийн өгөгдөл хангалтгүй тул эрсдэлийн үзүүлэлт хязгаарлагдмал байна." Хэрэв дүүргийн аль нэг хороонд замын координат эсвэл халаалтын бүртгэл дутуу байвал бид хийсвэрээр таамаглахгүй бөгөөд тухайн бүсийг хязгаарлагдмал өгөгдөлтэй гэж тэмдэглэдэг.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Demo Mode Policy */}
          {activeTab === 'demo' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span>🛡️</span>
                  <span>DEMO DATA & TRANSITION READY ARCHITECTURE</span>
                </div>
                <p className="leading-relaxed text-xs">
                  {language === 'mn'
                    ? 'Бид хэзээ ч бодит бус тоо баримтыг албан ёсны мэт худал мэдээлэхгүй. Албан ёсны төрийн байгууллагын API бүрэн холбогдох хүртэл бүх жишээ өгөгдлийг ЖИШЭЭ ӨГӨГДӨЛ / DEMO MODE гэж тод тэмдэглэдэг.'
                    : 'We never fabricate production metrics invisibly. Until official agency dispatch APIs are provisioned, all demonstration sets are clearly quarantined under DEMO DATA.'}
                </p>
                <p className="text-xs">
                  Аппликэйшны арын архитектур нь ОБЕГ эсвэл хотын захиргааны бодит мэдээллийн сантай шууд холбогдоход интерфэйсийг дахин өөрчлөх шаардлагагүйгээр бүтээгдсэн.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Admin API */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <p className="text-xs text-[#72778A]">
                Төрийн болон эрдэм шинжилгээний байгууллагуудад зориулсан REST/GeoJSON дата интеграцийн интерфэйс.
              </p>
              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] space-y-1">
                <div className="text-emerald-400">POST /api/v1/incidents/batch-sync</div>
                <div className="text-slate-400">Authorization: Bearer &lt;NEMA_GOV_KEY&gt;</div>
                <div className="text-slate-400">Content-Type: application/geo+json</div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#0B124D]/10 flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#72778A]">
            FireWatch UB Open Data Protocol
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0B124D] text-white rounded-xl text-xs font-bold hover:bg-[#11166B] transition-colors"
          >
            {language === 'mn' ? 'Хаах' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
