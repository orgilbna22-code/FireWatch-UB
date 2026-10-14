import React from 'react';
import { Language } from '../../types';
import { CURRENT_UB_WEATHER } from '../../data/ubGeoData';

interface WeatherModuleProps {
  language: Language;
}

export const WeatherModule: React.FC<WeatherModuleProps> = ({ language }) => {
  const w = CURRENT_UB_WEATHER;

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-[#F7F8FA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="pb-6 border-b border-[#0B124D]/10">
          <span className="text-xs font-mono font-bold tracking-widest text-[#FF633C] uppercase block mb-1">
            {language === 'mn' ? 'ЦАГ АГААР · ОРЧНЫ НӨХЦӨЛ' : 'METEOROLOGICAL & CLIMATE INPUTS'}
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold text-[#0B124D]">
            {language === 'mn'
              ? 'Улаанбаатар хотын цаг уурын шууд үзүүлэлтүүд ба хуурайшилтын индекс'
              : 'Real-Time Environmental Factors & Fire Weather Index (FWI)'}
          </h1>
          <p className="text-xs sm:text-sm text-[#72778A] mt-2 max-w-2xl">
            {language === 'mn'
              ? 'Цаг уурын хувьсагчид нь зөвхөн аналитик загварын орц өгөгдөл бөгөөд гал түймэр заавал гарна гэсэн баталгаа биш юм.'
              : 'Meteorological variables act strictly as analytical model inputs; weather conditions alone do not guarantee fire ignition.'}
          </p>
        </div>

        {/* Live Weather Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          
          <div className="p-5 rounded-2xl bg-white border border-[#0B124D]/8 shadow-xs">
            <span className="text-[10px] font-mono text-[#72778A] block mb-1 uppercase">
              {language === 'mn' ? 'Температур' : 'Ambient Temp'}
            </span>
            <div className="font-mono text-3xl sm:text-4xl font-bold text-[#0B124D]">
              +{w.tempCelsius}°C
            </div>
            <span className="text-[11px] text-[#72778A] mt-2 block">
              {language === 'mn' ? 'Шөнийн урьдчилсан: -2°C' : 'Forecast low: -2°C'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#0B124D]/8 shadow-xs">
            <span className="text-[10px] font-mono text-[#72778A] block mb-1 uppercase">
              {language === 'mn' ? 'Харьцангуй чийгшил' : 'Relative Humidity'}
            </span>
            <div className="font-mono text-3xl sm:text-4xl font-bold text-[#FF633C]">
              {w.humidityPercent}%
            </div>
            <span className="text-[11px] text-[#FF633C] mt-2 block font-medium">
              {language === 'mn' ? 'Хуурай бүс (<35%)' : 'Dry Threshold'}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#0B124D]/8 shadow-xs">
            <span className="text-[10px] font-mono text-[#72778A] block mb-1 uppercase">
              {language === 'mn' ? 'Салхины хурд' : 'Wind Speed'}
            </span>
            <div className="font-mono text-3xl sm:text-4xl font-bold text-[#0B124D]">
              {w.windSpeedKmh}
            </div>
            <span className="text-[11px] text-[#72778A] mt-2 block font-mono">
              км/ц · 4.6 м/с
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#0B124D]/8 shadow-xs">
            <span className="text-[10px] font-mono text-[#72778A] block mb-1 uppercase">
              {language === 'mn' ? 'Салхины чиглэл' : 'Wind Direction'}
            </span>
            <div className="font-mono text-3xl sm:text-4xl font-bold text-[#0B124D]">
              {w.windDirectionCompass}
            </div>
            <span className="text-[11px] text-[#72778A] mt-2 block font-mono">
              {w.windDirectionDeg}° азимут
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#0B124D]/8 shadow-xs col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-[#72778A] block mb-1 uppercase">
              {language === 'mn' ? 'Хуурай өдрүүд' : 'Dry Spell Days'}
            </span>
            <div className="font-mono text-3xl sm:text-4xl font-bold text-[#0B124D]">
              {w.droughtDays}
            </div>
            <span className="text-[11px] text-[#72778A] mt-2 block">
              {language === 'mn' ? 'Хур тунадасгүй хоног' : 'Days without rain'}
            </span>
          </div>

        </div>

        {/* Detailed Explanation on Meteorological Impact */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#0B124D]/8 shadow-xs space-y-4">
          <h3 className="font-editorial text-xl font-bold text-[#0B124D]">
            {language === 'mn'
              ? 'Цаг уурын хүчин зүйл загварт хэрхэн нөлөөлдөг вэ?'
              : 'Environmental Multiplier in Fire-Risk Computation'}
          </h3>
          <p className="text-sm text-[#72778A] leading-relaxed">
            {language === 'mn'
              ? 'Агаарын харьцангуй чийгшил 40%-иас доош унах үед шар өвс, модон хашаа, дээврийн модон эд ангиуд амархан асах бэлэн байдалд шилждэг. Үүн дээр 15+ км/ц салхи нэмэгдсэнээр галын дөл тархах хурд геометр прогрессоор нэмэгддэг тул манай аналитик загварт улирлын жингийн 10%-ийг эзлүүлдэг.'
              : 'When ambient humidity drops below 40%, combustible timber and desiccated vegetation ignite far more easily. Gusting winds over 15 km/h accelerate ignition spread exponentially, constituting a key normalized component in the FireWatch UB calculation.'}
          </p>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#72778A] font-mono">
            <span>ЦУОШГ-ын бодит станцын станц: Нийслэл-Буянт-Ухаа</span>
            <span>Шинэчлэгдсэн: {w.lastUpdated}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
