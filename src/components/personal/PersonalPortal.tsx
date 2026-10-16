import React, { useState } from 'react';
import { Language } from '../../types';
import { UB_DISTRICTS } from '../../data/ubGeoData';
import { getKhoroosByDistrict } from '../../data/ubKhorooData';

interface PersonalPortalProps {
  language: Language;
  onExploreMap?: () => void;
  onSelectDistrict?: (districtId: string) => void;
}

export const PersonalPortal: React.FC<PersonalPortalProps> = ({
  language,
  onExploreMap,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'home_audit' | 'creator_profile'>('home_audit');

  // Form states for Personal Home Audit
  const [districtId, setDistrictId] = useState<string>('bayanzurkh');
  const [khorooNumber, setKhorooNumber] = useState<number>(2);
  const [homeType, setHomeType] = useState<'ger' | 'house_fence' | 'brick_cottage' | 'apartment'>('ger');
  const [heatingType, setHeatingType] = useState<'iron_stove' | 'improved_stove' | 'boiler' | 'electric' | 'central'>('iron_stove');
  const [electricalState, setElectricalState] = useState<'safe' | 'medium' | 'overloaded'>('medium');
  const [hasSmokeDetector, setHasSmokeDetector] = useState<boolean>(false);
  const [hasFireExtinguisher, setHasFireExtinguisher] = useState<boolean>(false);
  const [hasChildren, setHasChildren] = useState<boolean>(true);
  const [hasElderly, setHasElderly] = useState<boolean>(false);
  const [ashStorage, setAshStorage] = useState<'metal_box' | 'open_fence' | 'plastic_bucket'>('metal_box');

  // Personal emergency plan notes
  const [customMeetingPoint, setCustomMeetingPoint] = useState<string>('Гудамжны төв гэрлийн шонгийн дэргэд');
  const [emergencyPhone, setEmergencyPhone] = useState<string>('+976 9911-XXXX');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Khoroos of selected district
  const availableKhoroos = getKhoroosByDistrict(districtId);
  const selectedDistrictData = UB_DISTRICTS.find((d) => d.id === districtId) || UB_DISTRICTS[0];

  // Calculate Personal Home Fire Risk (%)
  const calculatePersonalRisk = (): {
    score: number;
    level: 'low' | 'moderate' | 'high' | 'very_high';
    breakdown: { labelMn: string; labelEn: string; pts: number; reasonMn: string }[];
  } => {
    let baseScore = selectedDistrictData.riskScore * 0.35; // 35% based on geographical area
    const breakdown: { labelMn: string; labelEn: string; pts: number; reasonMn: string }[] = [
      {
        labelMn: 'Орон зайн дүүргийн суурь эрсдэл',
        labelEn: 'District Spatial Base',
        pts: Math.round(baseScore),
        reasonMn: `${selectedDistrictData.nameMn} дүүргийн дэд бүтэц, галын анги хүрэх зайн нөлөө.`,
      },
    ];

    // Home Type pts
    let homePts = 10;
    let homeReason = 'Орон сууцны галд тэсвэртэй хана, төвийн шугам сүлжээ.';
    if (homeType === 'ger') {
      homePts = 24;
      homeReason = 'Монгол гэр нь эсгий, мод зэрэг шатамхай материалаас бүрддэг тул гал амархан бадардаг.';
    } else if (homeType === 'house_fence') {
      homePts = 20;
      homeReason = 'Хашааны модон байшин болон ойролцоох амбаар нь гал авах магадлал өндөр.';
    } else if (homeType === 'brick_cottage') {
      homePts = 14;
      homeReason = 'Тоосгон хийц нь галын тархалтыг удаашруулдаг сайн талтай.';
    }
    breakdown.push({
      labelMn: 'Сууцны хийц бүтэц',
      labelEn: 'Dwelling Structure Material',
      pts: homePts,
      reasonMn: homeReason,
    });

    // Heating Type pts
    let heatPts = 4;
    let heatReason = 'Төвийн дулаан тул галын шууд дөл ашигладаггүй.';
    if (heatingType === 'iron_stove') {
      heatPts = 25;
      heatReason = 'Ердийн төмөр зуух нь өндөр температурт улайсдаг бөгөөд яндангийн цоорол үүсгэх магадлал их.';
    } else if (heatingType === 'improved_stove') {
      heatPts = 18;
      heatReason = 'Сайжруулсан зуух дулаанаа удаан барьдаг ч утааны яндангийн хөө тортог цэвэрлэх шаардлагатай.';
    } else if (heatingType === 'boiler') {
      heatPts = 15;
      heatReason = 'Нам даралтын зуух нь даралт ихсэх болон утааны суваг халах эрсдэлтэй.';
    } else if (heatingType === 'electric') {
      heatPts = 12;
      heatReason = 'Цахилгаан халаагуур нь шугамын ачааллыг огцом ихэсгэж богино холболт үүсгэж болзошгүй.';
    }
    breakdown.push({
      labelMn: 'Халаалтын төхөөрөмж',
      labelEn: 'Heating Mechanism',
      pts: heatPts,
      reasonMn: heatReason,
    });

    // Electrical state
    let elecPts = 4;
    let elecReason = 'Шинэ кабель, автомат таслууртай.';
    if (electricalState === 'overloaded') {
      elecPts = 16;
      elecReason = 'Олон өндөр хүчин чадалтай хэрэгслийг нэг уртасгагчид залгах нь утас хайлуулдаг.';
    } else if (electricalState === 'medium') {
      elecPts = 8;
      elecReason = 'Хуучин утсыг тогтмол шалгаж шинэчлэх шаардлагатай.';
    }
    breakdown.push({
      labelMn: 'Цахилгааны аюулгүй байдал',
      labelEn: 'Electrical Wiring Load',
      pts: elecPts,
      reasonMn: elecReason,
    });

    // Ash Disposal
    if (homeType === 'ger' || homeType === 'house_fence') {
      let ashPts = 2;
      let ashReason = 'Төмөр тагтай саванд үнсээ хийдэг нь маш зөв.';
      if (ashStorage === 'open_fence') {
        ashPts = 15;
        ashReason = 'Хашааны модон хана, шар өвсний дэргэд үнсээ ил асгах нь гал гарах №1 шалтгаан болдог!';
      } else if (ashStorage === 'plastic_bucket') {
        ashPts = 12;
        ashReason = 'Хуванцар сав халуун үнсэнд хайлж шатдаг аюултай.';
      }
      breakdown.push({
        labelMn: 'Үнс нурмын хадгалалт',
        labelEn: 'Ash Disposal Protocol',
        pts: ashPts,
        reasonMn: ashReason,
      });
    }

    // Safety Equipment (Reductions!)
    let safetyDiscount = 0;
    if (hasSmokeDetector) {
      safetyDiscount += 8;
      breakdown.push({
        labelMn: 'Утаа мэдрэгчийн хамгаалалт',
        labelEn: 'Smoke Detector Credit',
        pts: -8,
        reasonMn: 'Утаа мэдрэгчтэй тул галыг эхний 60 секундэд илрүүлэх давуу талтай (-8%).',
      });
    }
    if (hasFireExtinguisher) {
      safetyDiscount += 7;
      breakdown.push({
        labelMn: 'Гал унтраагуурын бэлэн байдал',
        labelEn: 'Fire Extinguisher Credit',
        pts: -7,
        reasonMn: 'Гал унтраагууртай тул анхны оч, дөлийг бие даан унтраах боломжтой (-7%).',
      });
    }

    const totalRaw = breakdown.reduce((sum, item) => sum + item.pts, 0);
    const score = Math.min(98, Math.max(8, totalRaw));

    let level: 'low' | 'moderate' | 'high' | 'very_high' = 'low';
    if (score >= 75) level = 'very_high';
    else if (score >= 55) level = 'high';
    else if (score >= 35) level = 'moderate';

    return { score, level, breakdown };
  };

  const personalRisk = calculatePersonalRisk();

  const handlePrintCard = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-[#F7F8FA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#0B124D] via-[#11166B] to-[#0B124D] text-white p-6 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold tracking-widest text-[#FF633C] uppercase block">
                {language === 'mn' ? 'ХУВИЙН ПОРТАЛ & ВЭБСАЙТ' : 'PERSONAL PORTAL & CREATOR'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 font-mono text-[10px] text-white/90">
                FIREWATCH UB
              </span>
            </div>
            
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {language === 'mn'
                ? 'Хувийн аюулгүй байдал ба Зохиогчийн хуудас'
                : 'Personal Safety Hub & Creator Platform'}
            </h1>
            
            <p className="text-xs sm:text-sm text-white/80 mt-2 leading-relaxed">
              {language === 'mn'
                ? 'Та өөрийн амьдардаг байшин, гэр, орон сууцныхаа галын эрсдэлийг хувьчилж тооцоолж, гэр бүлийнхээ аюулгүйн төлөвлөгөөг боловсруулах эсвэл энэхүү платформыг бүтээгч Оргилын хувийн танилцуулгатай танилцана уу.'
                : 'Calculate your personal household fire probability, generate your customized evacuation card, or view the creator profile of Orgil.'}
            </p>
          </div>

          {/* Sub Navigation Segmented Switcher */}
          <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-6 pt-6 border-t border-white/10">
            <button
              onClick={() => setActiveSubTab('home_audit')}
              className={`px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm min-h-[44px] ${
                activeSubTab === 'home_audit'
                  ? 'bg-white text-[#0B124D] shadow-md scale-102'
                  : 'bg-white/15 text-white/90 hover:bg-white/25 hover:text-white'
              }`}
            >
              <span>🏠</span>
              <span>{language === 'mn' ? 'Миний хувийн орон сууцны эрсдэл' : 'My Personal Home Audit'}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('creator_profile')}
              className={`px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm min-h-[44px] ${
                activeSubTab === 'creator_profile'
                  ? 'bg-[#FF633C] text-white shadow-md scale-102'
                  : 'bg-white/15 text-white/90 hover:bg-white/25 hover:text-white'
              }`}
            >
              <span>👨‍💻</span>
              <span>{language === 'mn' ? 'Зохиогч: Оргил (Хувийн вэбсайт)' : 'Creator: Orgil (Portfolio)'}</span>
            </button>
          </div>

          {/* Background Ambient Glow */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#FF633C]/20 blur-3xl pointer-events-none" />
        </div>

        {/* ========================================================================= */}
        {/* SUB-TAB 1: PERSONAL HOME FIRE RISK AUDIT & FAMILY EVACUATION CARD         */}
        {/* ========================================================================= */}
        {activeSubTab === 'home_audit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Interactive Questionnaire (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/[0.06] shadow-xs space-y-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF633C] font-bold block mb-1">
                    АЛХАМ 1
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-[#0B124D]">
                    {language === 'mn' ? 'Таны хувийн амьдардаг байршил' : 'Your Residential Location'}
                  </h3>
                  <p className="text-xs text-[#72778A] mt-1">
                    {language === 'mn'
                      ? 'Оршин суугаа дүүрэг болон хороогоо сонгосноор тухайн орчны бодит өгөгдөл холбогдоно.'
                      : 'Selecting your district and khoroo pulls municipal infrastructure metrics.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#0B124D] block mb-1.5">
                      Дүүрэг:
                    </label>
                    <select
                      value={districtId}
                      onChange={(e) => {
                        setDistrictId(e.target.value);
                        const khoroos = getKhoroosByDistrict(e.target.value);
                        if (khoroos.length > 0) setKhorooNumber(khoroos[0].khorooNumber);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.1] bg-[#F7F8FA] text-xs font-semibold text-[#0B124D] focus:outline-none focus:ring-2 focus:ring-[#FF633C]"
                    >
                      {UB_DISTRICTS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.nameMn} дүүрэг (Суурь: {d.riskScore}%)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0B124D] block mb-1.5">
                      Хороо:
                    </label>
                    <select
                      value={khorooNumber}
                      onChange={(e) => setKhorooNumber(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.1] bg-[#F7F8FA] text-xs font-semibold text-[#0B124D] focus:outline-none focus:ring-2 focus:ring-[#FF633C]"
                    >
                      {availableKhoroos.map((kh) => (
                        <option key={kh.id} value={kh.khorooNumber}>
                          {kh.nameMn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Dwelling & Heating Details */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/[0.06] shadow-xs space-y-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF633C] font-bold block mb-1">
                    АЛХАМ 2
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-[#0B124D]">
                    {language === 'mn' ? 'Сууцны хийц ба Халаалтын төрөл' : 'Structure & Heating Setup'}
                  </h3>
                </div>

                {/* Home Type */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0B124D] block">
                    Сууцны төрөл:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {[
                      { id: 'ger', label: '🎪 Монгол гэр' },
                      { id: 'house_fence', label: '🏡 Хашааны байшин' },
                      { id: 'brick_cottage', label: '🧱 Амины сууц' },
                      { id: 'apartment', label: '🏢 Орон сууц' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setHomeType(t.id as any)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          homeType === t.id
                            ? 'bg-[#0B124D] text-white border-[#0B124D] font-bold shadow-xs'
                            : 'bg-[#F7F8FA] text-[#72778A] border-black/[0.06] hover:bg-slate-100'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Heating Type */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0B124D] block">
                    Халаалтын төрөл:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'iron_stove', label: '🔥 Ердийн төмөр зуух' },
                      { id: 'improved_stove', label: '🪵 Сайжруулсан зуух' },
                      { id: 'boiler', label: '⚙️ Нам даралтын зуух' },
                      { id: 'electric', label: '⚡ Цахилгаан халаагуур' },
                      { id: 'central', label: '🏢 Төвийн дулаан' },
                    ].map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setHeatingType(h.id as any)}
                        className={`p-2.5 rounded-2xl border text-left transition-all ${
                          heatingType === h.id
                            ? 'bg-[#FF633C] text-white border-[#FF633C] font-bold shadow-xs'
                            : 'bg-[#F7F8FA] text-[#72778A] border-black/[0.06] hover:bg-slate-100'
                        }`}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ash Storage if ger or house */}
                {(homeType === 'ger' || homeType === 'house_fence') && (
                  <div className="space-y-2 pt-2 border-t border-black/[0.06]">
                    <label className="text-xs font-bold text-[#0B124D] block">
                      Үнс нурмаа хэрхэн хадгалдаг вэ?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      {[
                        { id: 'metal_box', label: '✓ Төмөр тагтай саванд' },
                        { id: 'open_fence', label: '⚠️ Хашаандаа ил асгадаг' },
                        { id: 'plastic_bucket', label: '⚠️ Хуванцар саванд' },
                      ].map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => setAshStorage(a.id as any)}
                          className={`p-2.5 rounded-2xl border text-left transition-all ${
                            ashStorage === a.id
                              ? 'bg-[#0B124D] text-white border-[#0B124D] font-bold'
                              : 'bg-[#F7F8FA] text-[#72778A] border-black/[0.06]'
                          }`}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Safety Equipment & Family Vulnerability */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/[0.06] shadow-xs space-y-6">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF633C] font-bold block mb-1">
                    АЛХАМ 3
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-[#0B124D]">
                    {language === 'mn' ? 'Аврах хэрэгсэл ба Гэр бүлийн гишүүд' : 'Safety Equipment & Family'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div
                    onClick={() => setHasSmokeDetector(!hasSmokeDetector)}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      hasSmokeDetector
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-[#F7F8FA] border-black/[0.06] text-[#72778A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🚨</span>
                      <div>
                        <span>Утаа мэдрэгчтэй</span>
                        <span className="text-[10px] block opacity-75 font-normal">Эрсдэлийг 8% бууруулна</span>
                      </div>
                    </div>
                    <span className="text-base">{hasSmokeDetector ? '☑' : '☐'}</span>
                  </div>

                  <div
                    onClick={() => setHasFireExtinguisher(!hasFireExtinguisher)}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      hasFireExtinguisher
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-[#F7F8FA] border-black/[0.06] text-[#72778A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🧯</span>
                      <div>
                        <span>Гал унтраагууртай</span>
                        <span className="text-[10px] block opacity-75 font-normal">Эрсдэлийг 7% бууруулна</span>
                      </div>
                    </div>
                    <span className="text-base">{hasFireExtinguisher ? '☑' : '☐'}</span>
                  </div>

                  <div
                    onClick={() => setHasChildren(!hasChildren)}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      hasChildren
                        ? 'bg-orange-50 border-orange-200 text-[#0B124D] font-bold'
                        : 'bg-[#F7F8FA] border-black/[0.06] text-[#72778A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">👶</span>
                      <div>
                        <span>0-7 насны бага хүүхэдтэй</span>
                        <span className="text-[10px] block opacity-75 font-normal">Зуухны хамгаалалт шаардлагатай</span>
                      </div>
                    </div>
                    <span className="text-base">{hasChildren ? '☑' : '☐'}</span>
                  </div>

                  <div
                    onClick={() => setHasElderly(!hasElderly)}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      hasElderly
                        ? 'bg-orange-50 border-orange-200 text-[#0B124D] font-bold'
                        : 'bg-[#F7F8FA] border-black/[0.06] text-[#72778A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">👵</span>
                      <div>
                        <span>65+ насны өндөр настантай</span>
                        <span className="text-[10px] block opacity-75 font-normal">Шуурхай аврах төлөвлөгөө хэрэгтэй</span>
                      </div>
                    </div>
                    <span className="text-base">{hasElderly ? '☑' : '☐'}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Personal Scorecard & Action Plan (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Personal Risk Result Card */}
              <div className="bg-[#0B124D] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF633C] font-bold">
                    ТАНЫ ХУВИЙН ҮНЭЛГЭЭ
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-bold ${
                    personalRisk.score >= 75 ? 'bg-red-500 text-white' :
                    personalRisk.score >= 55 ? 'bg-[#FF633C] text-white' :
                    'bg-[#12B89A] text-white'
                  }`}>
                    {personalRisk.score >= 75 ? 'Маш өндөр эрсдэлтэй' :
                     personalRisk.score >= 55 ? 'Өндөр эрсдэлтэй' : 'Дунд эрсдэлтэй'}
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-5xl sm:text-6xl font-bold tracking-tight text-white">
                      {personalRisk.score}%
                    </span>
                    <span className="text-sm font-mono text-white/70">
                      хувийн эрсдэл
                    </span>
                  </div>
                  <p className="text-xs text-white/80 mt-2 leading-relaxed">
                    Энэ нь таны сонгосон дүүрэг, сууцны төрөл, халаалт болон тоноглолын байдалд үндэслэсэн бодит магадлал юм.
                  </p>
                </div>

                {/* Factors List */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <span className="text-[11px] font-mono text-white/60 uppercase block">
                    БҮРДҮҮЛЭГЧ ХҮЧИН ЗҮЙЛСИЙН ЖАГСААЛТ:
                  </span>
                  {personalRisk.breakdown.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between text-xs py-1 border-b border-white/5">
                      <div className="pr-2">
                        <span className="font-semibold text-white/95 block">{item.labelMn}</span>
                        <span className="text-[10px] text-white/60">{item.reasonMn}</span>
                      </div>
                      <span className={`font-mono text-xs font-bold shrink-0 ${
                        item.pts < 0 ? 'text-emerald-400' : 'text-[#FF633C]'
                      }`}>
                        {item.pts > 0 ? `+${item.pts}%` : `${item.pts}%`}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Quick Map Button */}
                {onExploreMap && (
                  <button
                    onClick={onExploreMap}
                    className="w-full py-3 bg-[#FF633C] hover:bg-[#ff5122] text-white text-xs font-bold rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>🗺️</span>
                    <span>Энэ байршлыг газрын зураг дээр шалгах</span>
                  </button>
                )}
              </div>

              {/* Printable Family Evacuation Card */}
              <div className="bg-white p-6 rounded-3xl border border-black/[0.06] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🪪</span>
                    <div>
                      <h4 className="font-bold text-sm text-[#0B124D]">
                        Гэр бүлийн хувийн аврах хуудас
                      </h4>
                      <span className="text-[10px] text-[#72778A]">
                        Хэвлэж аваад хаалга эсвэл хөргөгч дээрээ наана уу
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handlePrintCard}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-[#0B124D] rounded-xl text-xs font-semibold transition-colors"
                    title="Хэвлэх"
                  >
                    🖨️
                  </button>
                </div>

                <div className="space-y-3 bg-[#F7F8FA] p-4 rounded-2xl text-xs border border-black/[0.04]">
                  <div>
                    <span className="text-[#72778A] block text-[10px] uppercase font-mono">
                      Гэр бүлийн уулзах цэг (Muster Point):
                    </span>
                    <input
                      type="text"
                      value={customMeetingPoint}
                      onChange={(e) => setCustomMeetingPoint(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 bg-white border border-black/[0.08] rounded-xl text-xs font-semibold text-[#0B124D] focus:outline-none focus:ring-1 focus:ring-[#FF633C]"
                    />
                  </div>

                  <div>
                    <span className="text-[#72778A] block text-[10px] uppercase font-mono">
                      Яаралтай холбоо барих утас:
                    </span>
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 bg-white border border-black/[0.08] rounded-xl text-xs font-semibold text-[#0B124D] focus:outline-none focus:ring-1 focus:ring-[#FF633C]"
                    />
                  </div>

                  <div className="pt-2 border-t border-black/[0.06] grid grid-cols-2 gap-2 text-center font-mono text-[11px]">
                    <div className="p-2 bg-red-100 text-red-700 rounded-xl font-bold">
                      🚒 101 - Гал түймэр
                    </div>
                    <div className="p-2 bg-amber-100 text-amber-800 rounded-xl font-bold">
                      🚑 103 - Түргэн тусламж
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCopyLink}
                  className="w-full py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-[#0B124D] hover:bg-slate-100 transition-colors"
                >
                  {isCopied ? '✓ Холбоос хуулагдлаа!' : '🔗 Энэ тооцоолуурыг бусдад хуваалцах'}
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 2: CREATOR PROFILE & PERSONAL PORTFOLIO (ORGIL)                   */}
        {/* ========================================================================= */}
        {activeSubTab === 'creator_profile' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Developer Hero Card */}
            <div className="bg-white p-8 sm:p-12 rounded-3xl border border-black/[0.06] shadow-sm flex flex-col md:flex-row items-center gap-8">
              
              {/* Avatar / Monogram */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-gradient-to-tr from-[#0B124D] via-[#11166B] to-[#FF633C] p-1.5 shadow-2xl shrink-0 group">
                <div className="w-full h-full bg-[#0B124D] rounded-[22px] flex flex-col items-center justify-center text-white relative overflow-hidden">
                  <span className="font-editorial text-5xl font-bold text-[#FF633C]">
                    O
                  </span>
                  <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest mt-1">
                    ENGINEER
                  </span>
                  <div className="absolute inset-0 bg-radial from-[#FF633C]/20 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Bio & Intro */}
              <div className="flex-1 space-y-3 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#FF633C] text-xs font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#FF633C] animate-pulse" />
                  <span>CREATOR & SOFTWARE ENGINEER</span>
                </div>

                <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#0B124D]">
                  Оргил (Orgil)
                </h2>

                <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed max-w-2xl">
                  {language === 'mn'
                    ? 'Би орчин үеийн веб технологи, орон зайн математик өгөгдөл шинжилгээ болон хүн төвтэй дизайныг хослуулан бодит үр дүн авчрах системийг бүтээдэг инженер юм. FIREWATCH UB нь Улаанбаатар хотынхоо гэр бүл, иргэдийн амь насыг галын аюулаас сэргийлэхэд хувь нэмрээ оруулах зорилгоор бүтээсэн миний хувийн бие даасан төсөл билээ.'
                    : 'Software engineer building human-centered spatial platforms and modern web architectures. FIREWATCH UB is my personal flagship civic safety project designed to protect families in Ulaanbaatar.'}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                  <a
                    href="mailto:orgilbna22@gmail.com"
                    className="px-5 py-2.5 bg-[#0B124D] hover:bg-[#11166B] text-white text-xs font-bold rounded-2xl shadow-md transition-all active:scale-95 flex items-center gap-2"
                  >
                    <span>✉️</span>
                    <span>orgilbna22@gmail.com</span>
                  </a>

                  <span className="px-3.5 py-2.5 bg-[#F7F8FA] border border-black/[0.06] rounded-2xl text-xs font-mono text-[#0B124D] font-semibold">
                    📍 Улаанбаатар, Монгол
                  </span>
                </div>
              </div>

            </div>

            {/* Project Showcase & Architecture Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-3xl bg-white border border-black/[0.06] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0B124D] text-white flex items-center justify-center font-mono text-sm font-bold">
                  01
                </div>
                <h3 className="font-editorial text-xl font-bold text-[#0B124D]">
                  {language === 'mn' ? 'Зорилго & Нийгмийн ач холбогдол' : 'Civic Impact & Mission'}
                </h3>
                <p className="text-xs text-[#72778A] leading-relaxed">
                  {language === 'mn'
                    ? 'Улаанбаатарын гэр хорооллын өвлийн халаалтын улирал, нарийн гудамж, уулын налуугийн саадыг шинжлэх ухааны үндэслэлтэй орон зайн өгөгдлөөр загварчлан урьдчилан тандах боломжийг олгох.'
                    : 'Providing accessible predictive spatial intelligence to mitigate household fire loss across dense urban ger settlements.'}
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-black/[0.06] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FF633C] text-white flex items-center justify-center font-mono text-sm font-bold">
                  02
                </div>
                <h3 className="font-editorial text-xl font-bold text-[#0B124D]">
                  {language === 'mn' ? 'Технологийн стек' : 'Engineering Stack'}
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'React 19',
                    'TypeScript',
                    'Tailwind CSS v4',
                    'Leaflet GIS',
                    'Esri 4K Satellite',
                    'HTML5 Canvas',
                    'Hardware Acceleration',
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-xl bg-[#F7F8FA] border border-black/[0.04] text-[11px] font-mono text-[#0B124D] font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-black/[0.06] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#12B89A] text-white flex items-center justify-center font-mono text-sm font-bold">
                  03
                </div>
                <h3 className="font-editorial text-xl font-bold text-[#0B124D]">
                  {language === 'mn' ? 'Хамтран ажиллах' : 'Connect & Collaborate'}
                </h3>
                <p className="text-xs text-[#72778A] leading-relaxed">
                  {language === 'mn'
                    ? 'Энэхүү платформтой холбоотой шинэ санал, өгөгдлийн хамтын ажиллагаа эсвэл технологийн төсөл дээр хамтрахыг хүсвэл чөлөөтэй холбогдоорой.'
                    : 'Open to engineering collaboration, municipal data partnerships, and high-impact software design initiatives.'}
                </p>
                <div className="pt-2">
                  <a
                    href="mailto:orgilbna22@gmail.com"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF633C] hover:underline"
                  >
                    <span>Санал илгээх →</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
