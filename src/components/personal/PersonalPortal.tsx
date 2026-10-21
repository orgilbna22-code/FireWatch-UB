import React, { useState } from 'react';
import { Language } from '../../types';
import { UB_DISTRICTS, getKhoroosByDistrict } from '../../data/ubGeoData';
import { useLiveWeather } from '../../hooks/liveWeather';

interface PersonalPortalProps {
  language: Language;
  onExploreMap?: () => void;
  onSelectDistrict?: (districtId: string) => void;
}

interface AuditFactor {
  labelMn: string;
  labelEn: string;
  pts: number;
  reasonMn: string;
  reasonEn: string;
}

// Assembled at runtime so public HTML never contains the literal address
const CONTACT_USER = 'orgilbna22';
const CONTACT_HOST = 'gmail.com';

const CO_CREATORS = [
  {
    nameMn: 'Түмэнхүслэн',
    nameEn: 'TumenHuslen',
    initialMn: 'Т',
    initialEn: 'T',
    roleMn: 'UI/UX дизайн',
    roleEn: 'UI/UX Design',
    tone: 'bg-[#0B124D]',
  },
  {
    nameMn: 'Индра',
    nameEn: 'Indra',
    initialMn: 'И',
    initialEn: 'I',
    roleMn: 'Математик суурь',
    roleEn: 'Math Base',
    tone: 'bg-[#FF633C]',
  },
  {
    nameMn: 'Цолмон',
    nameEn: 'Tsolmon',
    initialMn: 'Ц',
    initialEn: 'T',
    roleMn: 'Дата судалгаа',
    roleEn: 'Data Research',
    tone: 'bg-[#12B89A]',
  },
];

export const PersonalPortal: React.FC<PersonalPortalProps> = ({
  language,
  onExploreMap,
  onSelectDistrict,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'home_audit' | 'creator_profile'>('home_audit');
  const isMn = language === 'mn';
  const live = useLiveWeather();
  const [isEmailShown, setIsEmailShown] = useState(false);

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
  const [customMeetingPoint, setCustomMeetingPoint] = useState<string>(() =>
    language === 'mn' ? 'Гудамжны төв гэрлийн шонгийн дэргэд' : 'By the street lamp at our corner'
  );
  const [emergencyPhone, setEmergencyPhone] = useState<string>('+976 9911-XXXX');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Khoroos of selected district
  const availableKhoroos = getKhoroosByDistrict(districtId);
  const selectedKhorooData =
    availableKhoroos.find((k) => k.khorooNumber === khorooNumber) ?? null;
  const selectedDistrictData = UB_DISTRICTS.find((d) => d.id === districtId) || UB_DISTRICTS[0];

  // Calculate Personal Home Fire Risk (%)
  const calculatePersonalRisk = (): {
    score: number;
    level: 'low' | 'moderate' | 'high' | 'very_high';
    breakdown: AuditFactor[];
  } => {
    // Use the khoroo record when it exists so the answer reflects your street,
    // not only the district average.
    const areaScore = selectedKhorooData
      ? selectedKhorooData.riskScore
      : selectedDistrictData.riskScore;
    let baseScore = areaScore * 0.32;
    const breakdown: AuditFactor[] = [
      {
        labelMn: selectedKhorooData ? 'Хорооны суурь эрсдэл' : 'Орон зайн дүүргийн суурь эрсдэл',
        labelEn: selectedKhorooData ? 'Khoroo spatial base' : 'District spatial base',
        pts: Math.round(baseScore),
        reasonMn: selectedKhorooData
          ? `${selectedKhorooData.nameMn} (${selectedKhorooData.khorooNumber}-р хороо): анги хүрэх ~${selectedKhorooData.avgResponseTimeMin} мин, гидрант ${selectedKhorooData.fireHydrantCount} ширхэг.`
          : `${selectedDistrictData.nameMn} дүүргийн дэд бүтэц, галын анги хүрэх зайн нөлөө.`,
        reasonEn: selectedKhorooData
          ? `${selectedKhorooData.nameEn}: ~${selectedKhorooData.avgResponseTimeMin} min to a station, ${selectedKhorooData.fireHydrantCount} hydrants on record.`
          : `${selectedDistrictData.nameEn} infrastructure and station distance.`,
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
      labelEn: 'Dwelling structure',
      pts: homePts,
      reasonMn: homeReason,
      reasonEn:
        homeType === 'ger'
          ? 'A felt-and-timber ger ignites and flashes over within minutes.'
          : homeType === 'house_fence'
            ? 'Wooden fence and outbuildings carry fire across the yard.'
            : homeType === 'brick_cottage'
              ? 'Brick slows spread, but the roof void still burns.'
              : 'Concrete apartment walls limit spread inside the unit.',
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
      labelEn: 'Heating appliance',
      pts: heatPts,
      reasonMn: heatReason,
      reasonEn:
        heatingType === 'iron_stove'
          ? 'A plain iron stove radiates extreme heat and can crack the flue.'
          : heatingType === 'improved_stove'
            ? 'Improved stoves still need regular creosote cleaning.'
            : heatingType === 'boiler'
              ? 'Low-pressure boilers can overheat their flue channel.'
              : heatingType === 'electric'
                ? 'Electric heaters spike circuit load and overheat cords.'
                : 'Central heating removes the ignition source from the dwelling.',
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
      labelEn: 'Electrical load',
      pts: elecPts,
      reasonMn: elecReason,
      reasonEn:
        electricalState === 'overloaded'
          ? 'Many high-wattage devices on one extension lead melt the cable.'
          : electricalState === 'medium'
            ? 'Aging wiring should be inspected and renewed.'
            : 'New cable protected by automatic breakers.',
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
        labelEn: 'Ash disposal',
        pts: ashPts,
        reasonMn: ashReason,
        reasonEn:
          ashStorage === 'open_fence'
            ? 'Dumping hot ash by a wooden fence or dry grass is the most common ignition cause.'
            : ashStorage === 'plastic_bucket'
              ? 'Plastic melts in hot ash and sets the yard alight.'
              : 'Stored in a covered metal container — correct.',
      });
    }

    // Safety Equipment (Reductions!)
    let safetyDiscount = 0;
    if (hasSmokeDetector) {
      safetyDiscount += 8;
      breakdown.push({
        labelMn: 'Утаа мэдрэгчийн хамгаалалт',
        labelEn: 'Smoke detector credit',
        pts: -8,
        reasonMn: 'Утаа мэдрэгчтэй тул галыг эхний 60 секундэд илрүүлэх давуу талтай (-8%).',
        reasonEn: 'A smoke detector buys you the first 60 seconds (-8%).',
      });
    }
    if (hasFireExtinguisher) {
      safetyDiscount += 7;
      breakdown.push({
        labelMn: 'Гал унтраагуурын бэлэн байдал',
        labelEn: 'Extinguisher credit',
        pts: -7,
        reasonMn: 'Гал унтраагууртай тул анхны оч, дөлийг бие даан унтраах боломжтой (-7%).',
        reasonEn: 'You can kill a starter flame before crews arrive (-7%).',
      });
    }

    // Household members who need help to escape
    if (hasChildren || hasElderly) {
      const vulnPts = (hasChildren ? 6 : 0) + (hasElderly ? 9 : 0);
      breakdown.push({
        labelMn: 'Гэр бүлийн эмзэг гишүүн',
        labelEn: 'Members needing help',
        pts: vulnPts,
        reasonMn:
          hasChildren && hasElderly
            ? 'Хүүхэд болон ахмад гишүүн тус тусдаа тусламж шаарддаг тул хоёр гарц бэлтгэ.'
            : hasElderly
              ? 'Ахмад гишүүний унтлагыг гарцанд хамгийн ойр, гэрэлтэй байрлалд сонго.'
              : 'Хүүхдэд зориулсан гарцын дасгалжилтыг сард нэг удаа хий.',
        reasonEn:
          hasChildren && hasElderly
            ? 'Both a child and an elder need assistance, so plan two escape routes.'
            : hasElderly
              ? 'Place the elder\u2019s bedroom nearest a lit, level exit.'
              : 'Practise the escape route with the children once a month.',
      });
    }

    // Live meteorological pressure on top of the household profile
    const dryLoad = Math.max(0, (100 - live.humidityPercent) / 100);
    const windLoad = Math.min(1, live.windSpeedKmh / 40);
    const weatherPts = Math.round(dryLoad * 7 + windLoad * 6);
    if (weatherPts > 0) {
      breakdown.push({
        labelMn: 'Өнөөдрийн цаг агаар',
        labelEn: 'Today\u2019s weather',
        pts: weatherPts,
        reasonMn: `Чийгшил ${live.humidityPercent}%, салхи ${live.windSpeedKmh} км/ц${
          live.isLive ? '' : ' (сүртелц)'
        }.`,
        reasonEn: `Humidity ${live.humidityPercent}%, wind ${live.windSpeedKmh} km/h${
          live.isLive ? '' : ' (sample)'
        }.`,
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

  const handleCopyLink = async () => {
    const link = window.location.href;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // The async clipboard is unavailable over plain http and without focus.
      const area = document.createElement('textarea');
      area.value = link;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const copied = document.execCommand('copy');
      document.body.removeChild(area);
      if (!copied) {
        window.alert(isMn ? `Хуулбарлах боломжгүй байлаа: ${link}` : `Could not copy: ${link}`);
        return;
      }
    }
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 2000);
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
                  ? 'bg-white text-[#0B124D] shadow-md scale-[1.02]'
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
                  ? 'bg-[#FF633C] text-white shadow-md scale-[1.02]'
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
                    {isMn ? 'АЛХАМ 1' : 'STEP 1'}
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
                      {isMn ? 'Дүүрэг:' : 'District:'}
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
                          {isMn
                            ? `${d.nameMn} дүүрэг (Суурь: ${d.riskScore}/100)`
                            : `${d.nameEn} district (Base: ${d.riskScore}/100)`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0B124D] block mb-1.5">
                      {isMn ? 'Хороо:' : 'Khoroo:'}
                    </label>
                    <select
                      value={khorooNumber}
                      onChange={(e) => setKhorooNumber(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/[0.1] bg-[#F7F8FA] text-xs font-semibold text-[#0B124D] focus:outline-none focus:ring-2 focus:ring-[#FF633C]"
                    >
                      {availableKhoroos.map((kh) => (
                        <option key={kh.id} value={kh.khorooNumber}>
                          {isMn ? kh.nameMn : kh.nameEn}
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
                    {isMn ? 'АЛХАМ 2' : 'STEP 2'}
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-[#0B124D]">
                    {language === 'mn' ? 'Сууцны хийц ба Халаалтын төрөл' : 'Structure & Heating Setup'}
                  </h3>
                </div>

                {/* Home Type */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0B124D] block">
                    {isMn ? 'Сууцны төрөл:' : 'Dwelling type:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {[
                      { id: 'ger', labelMn: '🎪 Монгол гэр', labelEn: '🎪 Ger' },
                      { id: 'house_fence', labelMn: '🏡 Хашааны байшин', labelEn: '🏡 Fenced house' },
                      { id: 'brick_cottage', labelMn: '🧱 Амины сууц', labelEn: '🧱 Brick cottage' },
                      { id: 'apartment', labelMn: '🏢 Орон сууц', labelEn: '🏢 Apartment' },
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
                        {isMn ? t.labelMn : t.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Heating Type */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0B124D] block">
                    {isMn ? 'Халаалтын төрөл:' : 'Heating source:'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'iron_stove', labelMn: '🔥 Ердийн төмөр зуух', labelEn: '🔥 Plain iron stove' },
                      { id: 'improved_stove', labelMn: '🪵 Сайжруулсан зуух', labelEn: '🪵 Improved stove' },
                      { id: 'boiler', labelMn: '⚙️ Нам даралтын зуух', labelEn: '⚙️ Low-pressure boiler' },
                      { id: 'electric', labelMn: '⚡ Цахилгаан халаагуур', labelEn: '⚡ Electric heater' },
                      { id: 'central', labelMn: '🏢 Төвийн дулаан', labelEn: '🏢 Central heating' },
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
                        {isMn ? h.labelMn : h.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Electrical installation condition — drives the +4/+8/+16 factor */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0B124D] block">
                    {isMn ? 'Цахилгаан сүлжээний төлөв:' : 'Electrical wiring condition:'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'safe', labelMn: '🆕 Шинэ суурь шугам, автомат таслууртай', labelEn: '🆕 New wiring with breakers' },
                      { id: 'medium', labelMn: '🕰️ Хуучирсан утс, шалгаагүй', labelEn: '🕰️ Aged wiring, never inspected' },
                      { id: 'overloaded', labelMn: '⚠️ Нэг залгуурт олон хүчинтэй төхөөрөж', labelEn: '⚠️ Many appliances on one lead' },
                    ].map((el) => (
                      <button
                        key={el.id}
                        type="button"
                        onClick={() => setElectricalState(el.id as 'safe' | 'medium' | 'overloaded')}
                        className={`p-2.5 rounded-2xl border text-left transition-all ${
                          electricalState === el.id
                            ? 'bg-[#0B124D] text-white border-[#0B124D] font-bold shadow-xs'
                            : 'bg-[#F7F8FA] text-[#72778A] border-black/[0.06] hover:bg-slate-100'
                        }`}
                      >
                        {isMn ? el.labelMn : el.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ash Storage if ger or house */}
                {(homeType === 'ger' || homeType === 'house_fence') && (
                  <div className="space-y-2 pt-2 border-t border-black/[0.06]">
                    <label className="text-xs font-bold text-[#0B124D] block">
                      {isMn ? 'Үнс нурмаа хэрхэн хадгалдаг вэ?' : 'How do you store the stove ash?'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      {[
                        { id: 'metal_box', labelMn: '✓ Төмөр тагтай саванд', labelEn: '✓ Covered metal container' },
                        { id: 'open_fence', labelMn: '⚠️ Хашаандаа ил асгадаг', labelEn: '⚠️ Dumped by the fence' },
                        { id: 'plastic_bucket', labelMn: '⚠️ Хуванцар саванд', labelEn: '⚠️ Plastic bucket' },
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
                          {isMn ? a.labelMn : a.labelEn}
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
                    {isMn ? 'АЛХАМ 3' : 'STEP 3'}
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-[#0B124D]">
                    {language === 'mn' ? 'Аврах хэрэгсэл ба Гэр бүлийн гишүүд' : 'Safety Equipment & Family'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <button
                    type="button"
                    aria-pressed={hasSmokeDetector}
                    onClick={() => setHasSmokeDetector(!hasSmokeDetector)}
                    className={`w-full text-left p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      hasSmokeDetector
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-[#F7F8FA] border-black/[0.06] text-[#72778A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🚨</span>
                      <div>
                        <span>{isMn ? 'Утаа мэдрэгчтэй' : 'Smoke detector'}</span>
                        <span className="text-[10px] block opacity-75 font-normal">
                          {isMn ? 'Эрсдэлийг 8% бууруулна' : 'Cuts risk by 8%'}
                        </span>
                      </div>
                    </div>
                    <span className="text-base">{hasSmokeDetector ? '☑' : '☐'}</span>
                  </button>

                  <button
                    type="button"
                    aria-pressed={hasFireExtinguisher}
                    onClick={() => setHasFireExtinguisher(!hasFireExtinguisher)}
                    className={`w-full text-left p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      hasFireExtinguisher
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-[#F7F8FA] border-black/[0.06] text-[#72778A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🧯</span>
                      <div>
                        <span>{isMn ? 'Гал унтраагууртай' : 'Fire extinguisher'}</span>
                        <span className="text-[10px] block opacity-75 font-normal">
                          {isMn ? 'Эрсдэлийг 7% бууруулна' : 'Cuts risk by 7%'}
                        </span>
                      </div>
                    </div>
                    <span className="text-base">{hasFireExtinguisher ? '☑' : '☐'}</span>
                  </button>

                  <button
                    type="button"
                    aria-pressed={hasChildren}
                    onClick={() => setHasChildren(!hasChildren)}
                    className={`w-full text-left p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      hasChildren
                        ? 'bg-orange-50 border-orange-200 text-[#0B124D] font-bold'
                        : 'bg-[#F7F8FA] border-black/[0.06] text-[#72778A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">👶</span>
                      <div>
                        <span>{isMn ? '0-7 насны бага хүүхэдтэй' : 'Child aged 0-7 in the home'}</span>
                        <span className="text-[10px] block opacity-75 font-normal">
                          {isMn ? 'Зуухны хамгаалалт шаардлагатай' : 'Needs a stove guard'}
                        </span>
                      </div>
                    </div>
                    <span className="text-base">{hasChildren ? '☑' : '☐'}</span>
                  </button>

                  <button
                    type="button"
                    aria-pressed={hasElderly}
                    onClick={() => setHasElderly(!hasElderly)}
                    className={`w-full text-left p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      hasElderly
                        ? 'bg-orange-50 border-orange-200 text-[#0B124D] font-bold'
                        : 'bg-[#F7F8FA] border-black/[0.06] text-[#72778A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">👵</span>
                      <div>
                        <span>{isMn ? '65+ насны өндөр настантай' : 'Elder aged 65+ in the home'}</span>
                        <span className="text-[10px] block opacity-75 font-normal">
                          {isMn ? 'Шуурхай аврах төлөвлөгөө хэрэгтэй' : 'Needs an assisted escape plan'}
                        </span>
                      </div>
                    </div>
                    <span className="text-base">{hasElderly ? '☑' : '☐'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Personal Scorecard & Action Plan (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Personal Risk Result Card */}
              <div className="bg-[#0B124D] text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF633C] font-bold">
                    {isMn ? 'ТАНЫ ХУВИЙН ҮНЭЛГЭЭ' : 'YOUR PERSONAL VERDICT'}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-bold ${
                    personalRisk.score >= 75 ? 'bg-red-500 text-white' :
                    personalRisk.score >= 55 ? 'bg-[#FF633C] text-white' :
                    'bg-[#12B89A] text-[#0B124D]'
                  }`}>
                    {personalRisk.score >= 75
                      ? (isMn ? 'Маш өндөр эрсдэлтэй' : 'Very high risk')
                      : personalRisk.score >= 55
                        ? (isMn ? 'Өндөр эрсдэлтэй' : 'High risk')
                        : (isMn ? 'Дунд эрсдэлтэй' : 'Moderate risk')}
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-5xl sm:text-6xl font-bold tracking-tight text-white">
                      {personalRisk.score}%
                    </span>
                    <span className="text-sm font-mono text-white/70">
                      {isMn ? 'хувийн эрсдэл' : 'personal risk'}
                    </span>
                  </div>
                  <p className="text-xs text-white/80 mt-2 leading-relaxed">
                    {isMn
                      ? `Энэ үзүүлэлт ${
                          selectedKhorooData
                            ? `${selectedKhorooData.nameMn} (${selectedKhorooData.khorooNumber}-р хороо)`
                            : selectedDistrictData.nameMn
                        }, сууцны төрөл, халаалт, тоноглол болон өнөөдрийн цаг агаараас хамаарч байна.`
                      : `Derived from ${
                          selectedKhorooData ? selectedKhorooData.nameEn : selectedDistrictData.nameEn
                        }, your dwelling, heating, equipment and today's weather.`}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-white/60 mt-2">
                    <span className="flex items-center gap-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          live.isLive ? 'bg-[#12B89A] animate-pulse' : 'bg-amber-400'
                        }`}
                      />
                      {live.isLive ? 'LIVE' : isMn ? 'ДЕМО' : 'DEMO'}
                    </span>
                    <span>
                      {live.tempCelsius}°C · {isMn ? 'чийгшил' : 'RH'} {live.humidityPercent}% ·{' '}
                      {live.windSpeedKmh} {isMn ? 'км/ц' : 'km/h'}
                    </span>
                    <span className="text-[#FF633C] font-bold">FWI {live.fireWeatherIndex}</span>
                  </div>
                </div>

                {/* Factors List */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <span className="text-[11px] font-mono text-white/60 uppercase block">
                    {isMn ? 'БҮРДҮҮЛЭГЧ ХҮЧИН ЗҮЙЛСИЙН ЖАГСААЛТ:' : 'CONTRIBUTING FACTORS:'}
                  </span>
                  {personalRisk.breakdown.map((item) => (
                    <div
                      key={item.labelEn}
                      className="flex items-start justify-between text-xs py-1 border-b border-white/5"
                    >
                      <div className="pr-2">
                        <span className="font-semibold text-white/95 block">
                          {isMn ? item.labelMn : item.labelEn}
                        </span>
                        <span className="text-[10px] text-white/60">
                          {(isMn ? item.reasonMn : item.reasonEn) ?? item.reasonMn}
                        </span>
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
                    onClick={() => (onSelectDistrict ? onSelectDistrict(districtId) : onExploreMap())}
                    className="w-full py-3 bg-[#FF633C] hover:bg-[#ff5122] text-white text-xs font-bold rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>🗺️</span>
                    <span>{isMn ? 'Энэ байршлыг газрын зураг дээр шалгах' : 'Inspect this location on the map'}</span>
                  </button>
                )}
              </div>

              {/* Printable Family Evacuation Card */}
              <div id="evac-card-print" className="bg-white p-6 rounded-3xl border border-black/[0.06] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🪪</span>
                    <div>
                      <h4 className="font-bold text-sm text-[#0B124D]">
                        {isMn ? 'Гэр бүлийн хувийн аврах хуудас' : 'Family escape card'}
                      </h4>
                      <span className="text-[10px] text-[#72778A]">
                        {isMn
                          ? 'Хэвлэж аваад хаалга эсвэл хөргөгч дээрээ наана уу'
                          : 'Print it and stick it on a door or fridge'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handlePrintCard}
                    className="print:hidden p-2 bg-slate-100 hover:bg-slate-200 text-[#0B124D] rounded-xl text-xs font-semibold transition-colors"
                    title={isMn ? 'Хэвлэх' : 'Print'}
                  >
                    🖨️
                  </button>
                </div>

                <div className="space-y-3 bg-[#F7F8FA] p-4 rounded-2xl text-xs border border-black/[0.04]">
                  <div>
                    <span className="text-[#72778A] block text-[10px] uppercase font-mono">
                      {isMn ? 'Гэр бүлийн уулзах цэг (Muster Point):' : 'Family meeting point:'}
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
                      {isMn ? 'Яаралтай холбоо барих утас:' : 'Emergency contact:'}
                    </span>
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 bg-white border border-black/[0.08] rounded-xl text-xs font-semibold text-[#0B124D] focus:outline-none focus:ring-1 focus:ring-[#FF633C]"
                    />
                  </div>

                  <div className="pt-2 border-t border-black/[0.06] grid grid-cols-2 gap-2 text-center font-mono text-[11px]">
                    <div data-print-tone="fire" className="p-2 bg-red-100 text-red-700 rounded-xl font-bold">
                      {isMn ? '🚒 101 - Гал түймэр' : '🚒 101 - Fire'}
                    </div>
                    <div data-print-tone="medical" className="p-2 bg-amber-100 text-amber-800 rounded-xl font-bold">
                      {isMn ? '🚑 103 - Түргэн тусламж' : '🚑 103 - Ambulance'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCopyLink}
                  className="print:hidden w-full py-2.5 rounded-xl border border-black/[0.08] text-xs font-semibold text-[#0B124D] hover:bg-slate-100 transition-colors"
                >
                  {isCopied
                    ? (isMn ? '✓ Холбоос хуулагдлаа!' : '✓ Link copied!')
                    : (isMn ? '🔗 Энэ тооцоолуурыг бусдад хуваалцах' : '🔗 Share this calculator')}
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-TAB 2: CREATOR PROFILE & PERSONAL PORTFOLIO (ORGIL)                   */}
        {/* ========================================================================= */}
        {activeSubTab === 'creator_profile' && (
          <div className="space-y-8 animate-fade-in">
            
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
                  {isMn ? 'Оргил (Orgil)' : 'Orgil'}
                </h2>

                <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed max-w-2xl">
                  {language === 'mn'
                    ? 'Би орчин үеийн веб технологи, орон зайн математик өгөгдөл шинжилгээ болон хүн төвтэй дизайныг хослуулан бодит үр дүн авчрах системийг бүтээдэг инженер юм. FIREWATCH UB нь Улаанбаатар хотынхоо гэр бүл, иргэдийн амь насыг галын аюулаас сэргийлэхэд хувь нэмрээ оруулах зорилгоор бүтээсэн миний хувийн бие даасан төсөл билээ.'
                    : 'Software engineer building human-centered spatial platforms and modern web architectures. FIREWATCH UB is my personal flagship civic safety project designed to protect families in Ulaanbaatar.'}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                  {isEmailShown ? (
                    <a
                      href={`mailto:${CONTACT_USER}@${CONTACT_HOST}`}
                      className="px-5 py-2.5 bg-[#0B124D] hover:bg-[#11166B] text-white text-xs font-bold rounded-2xl shadow-md transition-all active:scale-95 flex items-center gap-2"
                    >
                      <span>✉️</span>
                      <span>
                        {CONTACT_USER}@{CONTACT_HOST}
                      </span>
                    </a>
                  ) : (
                    <button
                      onClick={() => setIsEmailShown(true)}
                      className="px-5 py-2.5 bg-[#0B124D]/8 hover:bg-[#0B124D]/15 text-[#0B124D] text-xs font-bold rounded-2xl transition-all active:scale-95 flex items-center gap-2"
                    >
                      <span>✉️</span>
                      <span>{isMn ? 'Имэйл харуулах' : 'Show email'}</span>
                    </button>
                  )}

                  <span className="px-3.5 py-2.5 bg-[#F7F8FA] border border-black/[0.06] rounded-2xl text-xs font-mono text-[#0B124D] font-semibold">
                    {isMn ? '📍 Улаанбаатар, Монгол' : '📍 Ulaanbaatar, Mongolia'}
                  </span>
                </div>
              </div>

            </div>

            {/* Co-Creators (Student Team) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-black/[0.06] shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#12B89A] font-bold block mb-1">
                {language === 'mn' ? 'ХАМТРАН БҮТЭЭГЧИД' : 'CO-CREATORS'}
              </span>
              <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#0B124D] mb-5">
                {language === 'mn' ? 'Төслийн хамтран зохиогчид' : 'Project Co-Authors'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {CO_CREATORS.map((c) => (
                  <div
                    key={c.nameEn}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-[#F7F8FA] border border-black/[0.05] hover:border-[#12B89A]/50 transition-all"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl ${c.tone} text-white flex items-center justify-center font-editorial text-2xl font-bold shrink-0 shadow-sm`}
                    >
                      {language === 'mn' ? c.initialMn : c.initialEn}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-[#0B124D] truncate">
                        {language === 'mn' ? c.nameMn : c.nameEn}
                      </div>
                      <div className="text-[11px] font-mono text-[#72778A]">
                        {language === 'mn' ? c.roleMn : c.roleEn}
                      </div>
                    </div>
                  </div>
                ))}
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
                <div className="w-10 h-10 rounded-2xl bg-[#12B89A] text-[#0B124D] flex items-center justify-center font-mono text-sm font-bold">
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
                    href={`mailto:${CONTACT_USER}@${CONTACT_HOST}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF633C] hover:underline"
                  >
                    <span>{isMn ? 'Санал илгээх →' : 'Send a suggestion →'}</span>
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
