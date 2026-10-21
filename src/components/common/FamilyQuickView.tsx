import React, { useEffect, useState } from 'react';
import { Language } from '../../types';
import { CITY_AVERAGE_RISK } from '../../data/ubGeoData';
import { useLiveWeather } from '../../hooks/liveWeather';
import { useEscapeKey } from '../../hooks/useEscapeKey';

interface FamilyQuickViewProps {
  language: Language;
  onClose?: () => void;
  onOpenMap?: () => void;
}

/** Traffic-light bands a family can act on: green / amber / red. */
const BANDS = [
  {
    max: 45,
    dot: '🟢',
    chip: 'bg-[#12B89A]',
    card: 'from-emerald-50 to-teal-50 border-emerald-200/80',
    tone: 'text-emerald-900',
    title: 'text-emerald-950',
    kicker: 'text-emerald-800',
    mn: 'НОГООН ТҮВШИН · ТАЙВАН БАЙЖ БОЛНО',
    en: 'GREEN · ALL CLEAR',
    mnAdvice: 'Агаар хуурайшилт багатай өдөр. Гэхдээ үнс, залгуур, хүхээгийг шалгаад унтаарай.',
    enAdvice: 'Conditions are favourable today. Still check ash, plugs and the damper before sleeping.',
  },
  {
    max: 68,
    dot: '🟡',
    chip: 'bg-amber-500',
    card: 'from-amber-50 to-orange-50 border-amber-200/80',
    tone: 'text-amber-900',
    title: 'text-amber-950',
    kicker: 'text-amber-800',
    mn: 'ШАР ТҮВШИН · СЭРЭМЖТЭЙ БАЙХ',
    en: 'YELLOW · MODERATE CAUTION',
    mnAdvice: 'Хуурай, салхитай тул гадаа ил задгай гал түлж, үнс нурам асгаж болохгүй.',
    enAdvice: 'Air is dry with some wind — no open burning or dumping ash outside.',
  },
  {
    max: 999,
    dot: '🔴',
    chip: 'bg-[#E93B2F]',
    card: 'from-red-50 to-rose-50 border-red-200/80',
    tone: 'text-red-900',
    title: 'text-red-950',
    kicker: 'text-red-800',
    mn: 'УЛААН ТҮВШИН · ӨНДӨР СЭРЭМЖ',
    en: 'RED · HIGH CAUTION',
    mnAdvice: 'Хуурай, хатуу салхитай өдөр. Хүүхэд, ахмадуудыг гадаа дангаар үлдээмээс, галын бүх үүсгэрийг хяналттай байлгаарай.',
    enAdvice: 'Dry and windy. Keep children and elders accompanied and every ignition source under control.',
  },
];

export const FamilyQuickView: React.FC<FamilyQuickViewProps> = ({
  language,
  onClose,
  onOpenMap,
}) => {
  const isMn = language === 'mn';
  const live = useLiveWeather();
  // Family-facing level = the city's structural risk carried by today's weather
  const dailyScore = Math.round(CITY_AVERAGE_RISK * 0.6 + live.fireWeatherIndex * 0.4);
  const band = BANDS.find((b) => dailyScore <= b.max) ?? BANDS[2];
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

  // Without onClose the panel is embedded in a page section, not a modal overlay.
  const isOverlay = Boolean(onClose);
  useEscapeKey(isOverlay, () => onClose?.());

  // Stop any reading aloud when the panel unmounts (e.g. tab change).
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  // Text to speech for elderly and children with poor vision
  const handleSpeakStatus = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const conditions = isMn
      ? `Сайн байна уу. Өнөөдөр Улаанбаатарт агаар ${live.tempCelsius} градус, чийгшил ${live.humidityPercent} хувь, салхи ${live.windSpeedKmh} км/ц хурдтай байна. Өнөөдрийн галын эрсдэлийн үнэлгээ ${dailyScore} оноо, төлөв ${band.mn}.`
      : `Hello. Today in Ulaanbaatar the temperature is ${live.tempCelsius} degrees, humidity ${live.humidityPercent} percent, wind ${live.windSpeedKmh} kilometres per hour. Today's fire risk score is ${dailyScore}. Status: ${band.en}.`;

    const steps = isMn
      ? 'Гэрээс гарах болон орондоо орохдоо: Нэгдүгээрт, зуухны халуун үнсээ заавал таглаатай төмөр хувинд хийгээрэй. Хоёрдугаарт, утасны цэнэглэгч, халаагуураа салгаарай. Гуравдугаарт, яндангийн хүхээгийг бүтэн хааж болохгүй шүү. Хэрэв гал гарвал яаралтай 101, 105 дугаарт залгаарай.'
      : 'Please remember three simple steps: First, always store hot stove ashes in a covered metal bucket. Second, unplug phone chargers and heaters. Third, never completely close the chimney damper. In case of emergency, call 101 or 105 immediately.';

    const utterance = new SpeechSynthesisUtterance(`${conditions} ${steps}`);
    utterance.lang = isMn ? 'mn-MN' : 'en-US';
    utterance.rate = 0.95; // slightly slower for elderly/kids

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className={`animate-fade-in ${
        isOverlay
          ? 'fixed inset-0 z-[1200] bg-black/60 backdrop-blur-md overflow-y-auto flex items-center justify-center p-3 sm:p-6'
          : ''
      }`}
      onClick={
        isOverlay
          ? (e) => {
              if (e.target === e.currentTarget) onClose?.();
            }
          : undefined
      }
    >
      <div
        role={isOverlay ? 'dialog' : undefined}
        aria-modal={isOverlay ? true : undefined}
        aria-label={isMn ? 'Гэр бүлийн хялбар горим' : 'Family and elder easy mode'}
        className={`w-full max-w-4xl bg-white/98 backdrop-blur-2xl border border-black/[0.08] shadow-[0_25px_60px_rgba(11,18,77,0.25)] relative ${
          isOverlay
            ? 'max-h-[90vh] overflow-y-auto p-4 sm:p-6 lg:p-8 rounded-3xl sm:rounded-[32px] my-auto'
            : 'p-4 sm:p-6 lg:p-8 rounded-3xl'
        }`}
      >
      
      {/* Top Banner / Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-2xl shrink-0">
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
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={handleSpeakStatus}
            className={`px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs min-h-[44px] ${
              isSpeaking
                ? 'bg-[#FF633C] text-white animate-pulse'
                : 'bg-[#0B124D]/5 hover:bg-[#0B124D]/10 text-[#0B124D]'
            }`}
            title={isMn ? 'Чангаар уншиж сонсгох' : 'Read the safety brief aloud'}
          >
            <span>{isSpeaking ? `🔊 ${isMn ? 'Уншиж байна...' : 'Reading...'}` : `🔈 ${isMn ? 'Чангаар унших' : 'Read aloud'}`}</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold min-h-[44px] min-w-[44px]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Giant Traffic Light Status (Zero-confusion for all ages) */}
      <div className={`my-6 sm:my-8 p-4 sm:p-8 rounded-2xl sm:rounded-[28px] bg-gradient-to-br ${band.card} border flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6`}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-5 w-full sm:w-auto">
          <div className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl ${band.chip} text-white flex items-center justify-center text-3xl sm:text-4xl shadow-lg shadow-black/10 shrink-0`}>
            {band.dot}
          </div>
          <div>
            <span className={`text-xs font-mono uppercase tracking-widest ${band.kicker} font-bold`}>
              {isMn ? "ӨНӨӨДРИЙН БАЙДАЛ" : "TODAY'S STATUS"} ·{' '}
              {live.isLive ? 'LIVE' : isMn ? 'ДЕМО' : 'DEMO'}
            </span>
            <h3 className={`font-editorial text-xl sm:text-3xl font-bold mt-0.5 ${band.title}`}>
              {isMn ? band.mn : band.en}
            </h3>
            <p className={`text-xs sm:text-sm ${band.tone}/80 mt-1 max-w-md`}>
              {isMn ? band.mnAdvice : band.enAdvice}
            </p>
            <p className={`text-[11px] font-mono ${band.tone}/70 mt-1.5`}>
              {live.tempCelsius}°C · {isMn ? 'чийгшил' : 'RH'} {live.humidityPercent}% ·{' '}
              {live.windSpeedKmh} {isMn ? 'км/ц' : 'km/h'} ·{' '}
              {isMn ? 'эрсдэл' : 'risk'} {dailyScore}/100
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
            {allChecked ? (isMn ? '🎉 Бүгдийг шалгалаа!' : '🎉 All checked!') : (isMn ? 'Дарж тэмдэглэнэ үү' : 'Tap to tick')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Stove & Ash */}
          <div
            role="checkbox"
            aria-checked={checkedItems.stove}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCheck('stove');
              }
            }}
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
                    checkedItems.stove ? 'bg-[#12B89A] text-[#0B124D]' : 'border border-slate-300 text-transparent'
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
              {checkedItems.stove ? (isMn ? 'Шалгасан ✓' : 'Checked ✓') : (isMn ? 'Дарж шалгах' : 'Tap to check')}
            </span>
          </div>

          {/* Card 2: Electricity & Plugs */}
          <div
            role="checkbox"
            aria-checked={checkedItems.power}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCheck('power');
              }
            }}
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
                    checkedItems.power ? 'bg-[#12B89A] text-[#0B124D]' : 'border border-slate-300 text-transparent'
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
              {checkedItems.power ? (isMn ? 'Шалгасан ✓' : 'Checked ✓') : (isMn ? 'Дарж шалгах' : 'Tap to check')}
            </span>
          </div>

          {/* Card 3: Flue & Exit */}
          <div
            role="checkbox"
            aria-checked={checkedItems.chimney}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCheck('chimney');
              }
            }}
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
                    checkedItems.chimney ? 'bg-[#12B89A] text-[#0B124D]' : 'border border-slate-300 text-transparent'
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
              {checkedItems.chimney ? (isMn ? 'Шалгасан ✓' : 'Checked ✓') : (isMn ? 'Дарж шалгах' : 'Tap to check')}
            </span>
          </div>

        </div>
      </div>

      {/* Completion Banner */}
      {allChecked && (
        <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-lg shrink-0">🌟</span>
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
    </div>
  );
};
