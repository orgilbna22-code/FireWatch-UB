import React, { useState } from 'react';
import { Language } from '../../types';
import { CURRENT_UB_WEATHER } from '../../data/ubGeoData';

interface FamilyQuickViewProps {
  language: Language;
  onClose?: () => void;
  onOpenMap?: () => void;
}

export const FamilyQuickView: React.FC<FamilyQuickViewProps> = ({
  language,
  onClose,
  onOpenMap,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({
    stove: false,
    power: false,
    chimney: false,
  });

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allChecked = checkedItems.stove && checkedItems.power && checkedItems.chimney;

  // Text to speech for elderly and children with poor vision
  const handleSpeakStatus = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead =
      language === 'mn'
        ? 'Сайн байна уу. Өнөөдөр Улаанбаатар хотод цаг агаар сэрүүн, харьцангуй хуурай салхитай байна. Галын эрсдэл дунд зэрэг байна. Гэрээс гарах болон орондоо орохдоо: Нэгдүгээрт, зуухны халуун үнсээ заавал таглаатай төмөр хувинд хийгээрэй. Хоёрдугаарт, утасны цэнэглэгч, халаагуураа салгаарай. Гуравдугаарт, яндангийн хүхээгийг бүтэн хааж болохгүй шүү. Хэрэв гал гарвал яаралтай 101, 105 дугаарт залгаарай.'
        : 'Hello. Today in Ulaanbaatar, weather is cool and breezy. Fire risk is moderate. Please remember three simple steps: First, always store hot stove ashes in a covered metal bucket. Second, unplug phone chargers and heaters. Third, never completely close the chimney damper. In case of emergency, call 101 or 105 immediately.';

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = language === 'mn' ? 'mn-MN' : 'en-US';
    utterance.rate = 0.95; // slightly slower for elderly/kids

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-4 sm:p-6 lg:p-8 bg-white/90 backdrop-blur-2xl rounded-[32px] border border-black/[0.06] shadow-[0_20px_50px_rgba(11,18,77,0.08)]">
      
      {/* Top Banner / Navigation */}
      <div className="flex items-center justify-between pb-6 border-b border-black/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-2xl">
            🏡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-[#FF633C] uppercase">
                {language === 'mn' ? 'ГЭР БҮЛ, АХАМЖУУД, ХҮҮХДЭД ЗОРИУЛСАН' : 'FAMILY & SENIOR EASY MODE'}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#12B89A] animate-ping" />
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0B124D]">
              {language === 'mn' ? 'Өнөөдөр миний гэр аюулгүй юу?' : 'Is My Home Safe Today?'}
            </h2>
          </div>
        </div>

        {/* Audio Speech Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeakStatus}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs ${
              isSpeaking
                ? 'bg-[#FF633C] text-white animate-pulse'
                : 'bg-[#0B124D]/5 hover:bg-[#0B124D]/10 text-[#0B124D]'
            }`}
            title="Чангаар уншиж сонсгох"
          >
            <span>{isSpeaking ? '🔊 Уншиж байна...' : '🔈 Чангаар унших'}</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Giant Traffic Light Status (Zero-confusion for all ages) */}
      <div className="my-8 p-6 sm:p-8 rounded-[28px] bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-amber-500 text-white flex items-center justify-center text-4xl shadow-lg shadow-amber-500/25 shrink-0">
            🟡
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-800 font-bold">
              {language === 'mn' ? 'ӨНӨӨДРИЙН ЕРӨНХИЙ БАЙДАЛ' : 'TODAYS STATUS'}
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-amber-950 mt-0.5">
              {language === 'mn' ? 'ШАР ТҮВШИН · СЭРЭМЖТЭЙ БАЙХ' : 'YELLOW · MODERATE CAUTION'}
            </h3>
            <p className="text-xs sm:text-sm text-amber-900/80 mt-1 max-w-md">
              {language === 'mn'
                ? `Салхи ${CURRENT_UB_WEATHER.windSpeedKmh} км/ц хурдтай, чийгшил ${CURRENT_UB_WEATHER.humidityPercent}%. Хуурайшилттай өдөр тул гадаа ил задгай гал түлж, үнс нурам ил асгаж болохгүй!`
                : `Wind speed is ${CURRENT_UB_WEATHER.windSpeedKmh} km/h and dry. Avoid any open burning in yards.`}
            </p>
          </div>
        </div>

        {/* Big Tap-to-Call 101/105 emergency button */}
        <a
          href="tel:101"
          className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#E93B2F] hover:bg-[#d02c20] text-white font-bold text-center shadow-xl shadow-[#E93B2F]/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 shrink-0"
        >
          <span className="text-2xl">🚨</span>
          <div className="text-left">
            <span className="block text-[10px] tracking-wider uppercase text-white/80 font-mono">
              {language === 'mn' ? 'ГАЛ ГАРВАЛ ШУУД' : 'EMERGENCY CALL'}
            </span>
            <span className="text-xl font-mono font-extrabold tracking-tight">101 / 105</span>
          </div>
        </a>
      </div>

      {/* 3 Everyday Family Checks (With big friendly interactive checkboxes) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-editorial text-lg font-bold text-[#0B124D]">
            {language === 'mn' ? 'Орондоо орохоос өмнө шалгах 3 зүйл' : '3 Things to Check Before Bed'}
          </h4>
          <span className="text-xs font-mono text-slate-500">
            {allChecked ? '🎉 Бүгдийг шалгалаа!' : 'Дарж тэмдэглэнэ үү'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Stove & Ash */}
          <div
            onClick={() => toggleCheck('stove')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              checkedItems.stove
                ? 'bg-emerald-50/70 border-[#12B89A] shadow-xs'
                : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">🪣</span>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    checkedItems.stove ? 'bg-[#12B89A] text-white' : 'border border-slate-300 text-transparent'
                  }`}
                >
                  ✓
                </span>
              </div>
              <h5 className="font-bold text-sm text-[#0B124D] mb-1">
                {language === 'mn' ? '1. Халуун үнсээ шалгах' : '1. Hot Ash Storage'}
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'mn'
                  ? 'Зуухны үнсийг заавал таглаатай ТӨМӨР САВАНД хийсэн үү? Модон хашаа, хог руу хэзээ ч асгаж болохгүй!'
                  : 'Deposit all stove embers into a sealed non-combustible metal container.'}
              </p>
            </div>
            <span className="mt-3 text-[11px] font-semibold text-[#12B89A] block">
              {checkedItems.stove ? 'Шалгасан ✓' : 'Дарж шалгах'}
            </span>
          </div>

          {/* Card 2: Electricity & Plugs */}
          <div
            onClick={() => toggleCheck('power')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              checkedItems.power
                ? 'bg-emerald-50/70 border-[#12B89A] shadow-xs'
                : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">🔌</span>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    checkedItems.power ? 'bg-[#12B89A] text-white' : 'border border-slate-300 text-transparent'
                  }`}
                >
                  ✓
                </span>
              </div>
              <h5 className="font-bold text-sm text-[#0B124D] mb-1">
                {language === 'mn' ? '2. Цахилгаан залгуур' : '2. Electrical Plugs'}
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'mn'
                  ? 'Утасны цэнэглэгч, индукц плитка, ил халаагуураа залгуураас салгасан уу? Залгуур халаагүй биз?'
                  : 'Unplug phone chargers and space heaters before sleeping.'}
              </p>
            </div>
            <span className="mt-3 text-[11px] font-semibold text-[#12B89A] block">
              {checkedItems.power ? 'Шалгасан ✓' : 'Дарж шалгах'}
            </span>
          </div>

          {/* Card 3: Flue & Exit */}
          <div
            onClick={() => toggleCheck('chimney')}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
              checkedItems.chimney
                ? 'bg-emerald-50/70 border-[#12B89A] shadow-xs'
                : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">💨</span>
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    checkedItems.chimney ? 'bg-[#12B89A] text-white' : 'border border-slate-300 text-transparent'
                  }`}
                >
                  ✓
                </span>
              </div>
              <h5 className="font-bold text-sm text-[#0B124D] mb-1">
                {language === 'mn' ? '3. Хүхээг ба яндан' : '3. Flue Damper Safe'}
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'mn'
                  ? 'Зуухны хүхээгийг бүтэн хааж болохгүй (угаарын хий үүснэ). Гэрийн тооно, үүдний замаа сул байлгаарай!'
                  : 'Never seal the chimney damper shut completely to prevent deadly CO accumulation.'}
              </p>
            </div>
            <span className="mt-3 text-[11px] font-semibold text-[#12B89A] block">
              {checkedItems.chimney ? 'Шалгасан ✓' : 'Дарж шалгах'}
            </span>
          </div>

        </div>
      </div>

      {/* Completion Banner */}
      {allChecked && (
        <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌟</span>
            <span className="font-bold">
              {language === 'mn'
                ? 'Баяр хүргэе! Та өнөөдрийн 3 чухал шалгалтыг амжилттай хийлээ. Гэр бүл тань аюулгүй тайван амраарай.'
                : 'Great job! Your home passed all 3 essential safety checks tonight.'}
            </span>
          </div>
          {onOpenMap && (
            <button
              onClick={onOpenMap}
              className="text-xs font-bold text-[#0B124D] underline hover:text-[#FF633C]"
            >
              {language === 'mn' ? 'Газрын зураг харах' : 'View Risk Map'} →
            </button>
          )}
        </div>
      )}

    </div>
  );
};
