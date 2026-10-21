import React, { useState } from 'react';
import { Language } from '../../types';
import { FireAnimation } from '../common/FireAnimation';
import { AmbientFireBackground } from '../common/AmbientFireBackground';
import { soundEngine, useSoundStatus } from '../common/AudioAmbiance';
import { useLiveWeather } from '../../hooks/liveWeather';

interface FireSimulationLabProps {
  language: Language;
  onExploreMap?: () => void;
}

// Slider bounds must cover real UB extremes (storm winds, saturated winter air)
// or a live value pins the thumb while the read-out shows the true number.
const WIND_MIN = 0;
const WIND_MAX = 90;
const HUM_MIN = 2;
const HUM_MAX = 100;
const clampWind = (v: number) => Math.min(WIND_MAX, Math.max(WIND_MIN, Math.round(v)));
const clampHumidity = (v: number) => Math.min(HUM_MAX, Math.max(HUM_MIN, Math.round(v)));

export const FireSimulationLab: React.FC<FireSimulationLabProps> = ({
  language,
  onExploreMap,
}) => {
  const isMn = language === 'mn';
  const live = useLiveWeather();
  const [windSpeed, setWindSpeed] = useState<number>(() => clampWind(live.windSpeedKmh));
  const [humidity, setHumidity] = useState<number>(() => clampHumidity(live.humidityPercent));
  const [fuelType, setFuelType] = useState<'grass' | 'stove' | 'electrical' | 'timber'>('grass');
  const soundActive = useSoundStatus();

  // Compute simulated danger index (0 - 100)
  const drynessFactor = Math.max(0, (100 - humidity) / 100);
  const windFactor = Math.min(1, windSpeed / 40);
  const fuelMultiplier = fuelType === 'grass' ? 1.2 : fuelType === 'timber' ? 1.0 : fuelType === 'stove' ? 0.9 : 0.8;

  const simulatedIndex = Math.min(
    100,
    Math.round((drynessFactor * 55 + windFactor * 45) * fuelMultiplier)
  );

  // Estimated spark drift distance in meters
  const sparkDriftMeters = Math.round((windSpeed * 1.8) * (drynessFactor * 1.2));

  // Determine intensity for the visual flame animation
  const flameIntensity =
    simulatedIndex >= 80 ? 'extreme' : simulatedIndex >= 55 ? 'high' : simulatedIndex >= 35 ? 'moderate' : 'low';

  const handleToggleSound = () => {
    soundEngine.toggle();
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-4 sm:my-8 p-2 sm:p-6 lg:p-8">
      <div className="bg-white/80 backdrop-blur-2xl rounded-3xl sm:rounded-[36px] border border-black/[0.06] shadow-[0_24px_60px_rgba(11,18,77,0.08)] p-4 sm:p-8 lg:p-10 overflow-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 sm:pb-8 border-b border-black/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold tracking-widest text-[#FF633C] uppercase">
                {language === 'mn' ? 'ИНТЕРАКТИВ ЛАБОРАТОРИ' : 'INTERACTIVE FIRE LAB'}
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-xs text-[#72778A]">
                {language === 'mn' ? 'Салхи ба хуурайшилтын симуляци' : 'Physics & Environment'}
              </span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-4xl font-bold text-[#0B124D]">
              {language === 'mn'
                ? 'Салхи, чийгшил галын дөлд хэрхэн нөлөөлдөг вэ?'
                : 'Interactive Flame Physics & Ignition Laboratory'}
            </h2>
          </div>

          {/* Sound Ambiance Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSound}
              className={`px-4 py-2 rounded-2xl text-xs font-mono font-semibold flex items-center gap-2 transition-all shadow-xs ${
                soundActive
                  ? 'bg-[#FF633C] text-white shadow-md shadow-[#FF633C]/20'
                  : 'bg-[#F7F8FA] hover:bg-slate-200 text-[#0B124D]'
              }`}
              title={isMn ? 'Галын дуу чимээ асах/унтраах' : 'Toggle crackling fire ambience'}
            >
              <span>
                {soundActive
                  ? (isMn ? '🔥 Чимээ асаалттай' : '🔥 Sound on')
                  : isMn
                    ? '🔇 Дуу асаах'
                    : '🔇 Sound off'}
              </span>
            </button>
            <button
              onClick={() => {
                setWindSpeed(clampWind(live.windSpeedKmh));
                setHumidity(clampHumidity(live.humidityPercent));
              }}
              className="px-4 py-2 rounded-2xl text-xs font-mono font-semibold flex items-center gap-2 transition-all shadow-xs bg-[#0B124D]/5 hover:bg-[#0B124D]/12 text-[#0B124D]"
              title={isMn ? 'Одоогийн бодит цаг агаарын утгуудыг ашиглах' : 'Load observed conditions'}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  live.isLive ? 'bg-[#12B89A] animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span>{isMn ? 'Өнөөдийн нөхцөл' : 'Use live data'}</span>
              <span className="text-[#FF633C] font-bold">FWI {live.fireWeatherIndex}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Lab Layout: Flame Stage & Sensitivity Sliders */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 my-6 sm:my-8 items-center">
          
          {/* Left: Interactive Flame Showcase Stage (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#0B124D] to-[#060927] rounded-2xl sm:rounded-[32px] p-4 sm:p-8 text-white text-center flex flex-col items-center justify-between min-h-[380px] sm:min-h-[420px] relative overflow-hidden shadow-2xl">
            {/* Ambient Fire Glow Background */}
            <AmbientFireBackground intensity={1.2} />

            {/* Ambient Background Grid */}
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#FFFFFF 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            />

            <div className="z-10 w-full flex items-center justify-between text-[11px] font-mono text-white/60">
              <span>LIVE RENDER</span>
              <span className="text-[#FF633C] font-bold uppercase">{flameIntensity} MODE</span>
            </div>

            {/* Canvas Animated Fire */}
            <div className="my-auto relative z-10 py-4">
              <FireAnimation
                intensity={flameIntensity}
                windEffect={(windSpeed / 40) * 0.7}
                size="lg"
                interactive={true}
              />
              <span className="text-[11px] text-white/50 block mt-2 font-mono">
                {language === 'mn'
                  ? 'Хулганаараа дөл дээгүүр хөдөлгөж агаарын урсгалыг сорино уу'
                  : 'Hover/move cursor to create aerodynamic turbulence'}
              </span>
            </div>

            {/* Spark Distance Gauge */}
            <div className="z-10 w-full p-3.5 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs gap-3">
              <div className="text-left">
                <span className="text-[10px] text-white/60 block font-mono">
                  {isMn ? 'Оч үсрэх аюултай зай' : 'Simulated spark drift'}
                </span>
                <span className="font-mono text-lg sm:text-xl font-bold text-[#FF633C]">
                  ~{sparkDriftMeters} {isMn ? 'метр' : 'm'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/60 block font-mono">
                  {language === 'mn' ? 'Дэгдэлтийн индекс' : 'Spread Index'}
                </span>
                <span className="font-mono text-lg sm:text-xl font-bold text-white">
                  {simulatedIndex} / 100
                </span>
              </div>
            </div>
          </div>

          {/* Right: Controls & Real-Time Physical Sliders (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Slider 1: Wind Velocity */}
            <div className="p-5 rounded-2xl bg-[#F7F8FA] border border-black/[0.05] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0B124D] flex items-center gap-2">
                  <span>💨</span>
                  <span>{language === 'mn' ? 'Салхины хурд' : 'Wind Velocity'}</span>
                </span>
                <span className="font-mono font-bold text-sm text-[#0B124D]">
                  {windSpeed} {isMn ? 'км/ц' : 'km/h'}
                </span>
              </div>
              <input
                type="range"
                min={WIND_MIN}
                max={WIND_MAX}
                value={windSpeed}
                onChange={(e) => setWindSpeed(clampWind(Number(e.target.value)))}
                aria-label={isMn ? 'Салхины хурд км/ц' : 'Wind speed in km/h'}
                className="w-full accent-[#FF633C] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>0 {isMn ? 'км/ц · Намуун' : 'km/h · Calm'}</span>
                <span>45 {isMn ? 'км/ц · Салхитай' : 'km/h · Breezy'}</span>
                <span>{WIND_MAX}+ {isMn ? 'км/ц · Шуурга' : 'km/h · Storm'}</span>
              </div>
            </div>

            {/* Slider 2: Relative Humidity */}
            <div className="p-5 rounded-2xl bg-[#F7F8FA] border border-black/[0.05] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0B124D] flex items-center gap-2">
                  <span>💧</span>
                  <span>{language === 'mn' ? 'Агаарын харьцангуй чийгшил' : 'Relative Humidity'}</span>
                </span>
                <span
                  className={`font-mono font-bold text-sm ${
                    humidity <= 35 ? 'text-[#E93B2F]' : 'text-[#12B89A]'
                  }`}
                >
                  {humidity}%
                </span>
              </div>
              <input
                type="range"
                min={HUM_MIN}
                max={HUM_MAX}
                value={humidity}
                onChange={(e) => setHumidity(clampHumidity(Number(e.target.value)))}
                aria-label={isMn ? 'Агаарын харьцангуй чийгшил хувиар' : 'Relative humidity in percent'}
                className="w-full accent-[#0B124D] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span className="text-[#E93B2F]">
                  {HUM_MIN}% {isMn ? '(Маш хуурай · Аюултай)' : '(Very dry · Hazardous)'}
                </span>
                <span>50% {isMn ? '(Хэвийн)' : '(Normal)'}</span>
                <span className="text-[#12B89A]">
                  {HUM_MAX}% {isMn ? '(Бороотой · Аюулгүй)' : '(Wet · Safe)'}
                </span>
              </div>
            </div>

            {/* Fuel Type Selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#0B124D] block">
                {language === 'mn' ? 'Шатамхай материалын орчин' : 'Combustible Material Type'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'grass', nameMn: 'Шар өвс', nameEn: 'Dry Grass', icon: '🌾' },
                  { id: 'stove', nameMn: 'Зуухны үнс', nameEn: 'Stove Cinders', icon: '🔥' },
                  { id: 'timber', nameMn: 'Модон хашаа', nameEn: 'Timber Fence', icon: '🪵' },
                  { id: 'electrical', nameMn: 'Цахилгаан утас', nameEn: 'Wiring', icon: '⚡' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFuelType(item.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 font-medium ${
                      fuelType === item.id
                        ? 'bg-[#0B124D] text-white border-[#0B124D] shadow-sm'
                        : 'bg-[#F7F8FA] text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{language === 'mn' ? item.nameMn : item.nameEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Analytical Takeaway Box */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 leading-relaxed">
              <span className="font-bold block mb-1">
                💡 {language === 'mn' ? 'Эрдэм шинжилгээний дүгнэлт:' : 'Scientific Insight:'}
              </span>
              <p>
                {language === 'mn'
                  ? `Одоогийн тохиргоогоор салхи ${windSpeed} км/ц, чийгшил ${humidity}% байхад яндан болон үнснээс гарсан оч ойролцоогоор ${sparkDriftMeters} метрийн радиуст хүрч, модон хашаа эсвэл шар өвсийг амархан ноцоох нөхцөл бүрдэж байна.`
                  : `At ${windSpeed} km/h wind and ${humidity}% humidity, airborne embers can traverse ~${sparkDriftMeters} meters, carrying sufficient heat to ignite dry fuel downwind.`}
              </p>
            </div>

            {onExploreMap && (
              <button
                onClick={onExploreMap}
                className="w-full py-3 bg-[#0B124D] hover:bg-[#11166B] text-white font-bold text-xs rounded-xl transition-all shadow-md text-center"
              >
                {language === 'mn' ? 'Бодит дүүргүүдийн газрын зураг дээр харах' : 'Inspect Real UB Districts on Map'} →
              </button>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
