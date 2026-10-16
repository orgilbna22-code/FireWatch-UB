import React, { useState } from 'react';
import { DistrictData, Language, RiskModelWeights } from '../../types';
import { DEFAULT_RISK_WEIGHTS, RISK_VARIABLES_METADATA } from '../../data/riskConfig';
import { UB_DISTRICTS } from '../../data/ubGeoData';

interface RiskExplorerProps {
  language: Language;
  onNavigateToMapWithDistrict?: (districtId: string) => void;
}

export const RiskExplorer: React.FC<RiskExplorerProps> = ({
  language,
  onNavigateToMapWithDistrict,
}) => {
  const [weights, setWeights] = useState<RiskModelWeights>({ ...DEFAULT_RISK_WEIGHTS });
  const [activeFactors, setActiveFactors] = useState<{ [key: string]: boolean }>({
    incidentHistory: true,
    populationDensity: true,
    stationProximity: true,
    gerProportion: true,
    roadAccessibility: true,
    seasonalWeather: true,
  });
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  // Recalculate district scores based on dynamic weights & active toggles
  const recalculateDistricts = (): { district: DistrictData; currentScore: number; originalScore: number }[] => {
    // Effective weights considering active toggles
    const effInc = activeFactors.incidentHistory ? weights.incidentHistoryWeight : 0;
    const effPop = activeFactors.populationDensity ? weights.populationDensityWeight : 0;
    const effSta = activeFactors.stationProximity ? weights.stationProximityWeight : 0;
    const effGer = activeFactors.gerProportion ? weights.gerProportionWeight : 0;
    const effRoad = activeFactors.roadAccessibility ? weights.roadAccessibilityWeight : 0;
    const effWeath = activeFactors.seasonalWeather ? weights.seasonalWeatherWeight : 0;

    const totalWeight = effInc + effPop + effSta + effGer + effRoad + effWeath || 1;

    return UB_DISTRICTS.map((d) => {
      // Find raw contribution scores
      const incScore = d.contributions.find((c) => c.nameEn.includes('Incident'))?.score || 50;
      const popScore = d.contributions.find((c) => c.nameEn.includes('Population'))?.score || 50;
      const staScore = d.contributions.find((c) => c.nameEn.includes('Station') || c.nameEn.includes('Proximity'))?.score || 50;
      const gerScore = d.gerHouseholdPercent;
      const roadScore = d.roadAccessibilityGrade === 'D' ? 85 : d.roadAccessibilityGrade === 'C' ? 68 : d.roadAccessibilityGrade === 'B' ? 45 : 25;
      const weathScore = d.contributions.find((c) => c.nameEn.includes('Seasonal'))?.score || 60;

      const dynamicScore = Math.min(
        100,
        Math.max(
          0,
          Math.round(
            (incScore * effInc +
              popScore * effPop +
              staScore * effSta +
              gerScore * effGer +
              roadScore * effRoad +
              weathScore * effWeath) /
              totalWeight
          )
        )
      );

      return {
        district: d,
        currentScore: dynamicScore,
        originalScore: d.riskScore,
      };
    });
  };

  const calculatedDistricts = recalculateDistricts();

  const handleReset = () => {
    setWeights({ ...DEFAULT_RISK_WEIGHTS });
    setActiveFactors({
      incidentHistory: true,
      populationDensity: true,
      stationProximity: true,
      gerProportion: true,
      roadAccessibility: true,
      seasonalWeather: true,
    });
  };

  return (
    <div className="w-full min-h-[calc(100vh-65px)] bg-[#F7F8FA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#0B124D]/10">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-[#FF633C] uppercase block mb-1">
              {language === 'mn' ? 'ЭРСДЭЛИЙН СИМУЛЯТОР & ШИНЖИЛГЭЭ' : 'RISK EXPLORER & SENSITIVITY SANDBOX'}
            </span>
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0B124D]">
              {language === 'mn'
                ? 'Хүчин зүйлсийн мэдрэмжийн симуляци ба харьцуулалт'
                : 'Interactive Multi-Factor Sensitivity & Scenario Modeling'}
            </h1>
          </div>

          {/* Action Buttons: RESET, COMPARE, METHODOLOGY */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 text-xs font-mono font-bold text-[#72778A] hover:text-[#0B124D] bg-white rounded-xl border border-[#0B124D]/10 hover:bg-slate-50 transition-colors shadow-xs"
            >
              {language === 'mn' ? 'ДАХИН ТОХИРУУЛАХ' : 'RESET'}
            </button>
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-3.5 py-2 text-xs font-mono font-bold rounded-xl transition-colors shadow-xs ${
                compareMode
                  ? 'bg-[#0B124D] text-white'
                  : 'bg-white text-[#0B124D] border border-[#0B124D]/10 hover:bg-slate-50'
              }`}
            >
              {language === 'mn' ? 'ХАРЬЦУУЛАЛТ' : 'COMPARE'} {compareMode ? '✓' : ''}
            </button>
            <button
              onClick={() => setShowMethodologyModal(true)}
              className="px-3.5 py-2 text-xs font-mono font-bold text-white bg-[#FF633C] hover:bg-[#e05430] rounded-xl transition-colors shadow-xs"
            >
              {language === 'mn' ? 'АРГА ЗҮЙ' : 'METHODOLOGY'}
            </button>
          </div>
        </div>

        {/* Dynamic Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Factor Controls (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-[#0B124D]/8 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-[#0B124D]">
                  {language === 'mn' ? 'Хүчин зүйлс ба жингийн тохируулга' : 'Factor Weights & Toggles'}
                </h3>
                <span className="text-[11px] font-mono text-[#72778A]">
                  Dynamic Weight
                </span>
              </div>

              <div className="space-y-4 text-xs">
                {/* Variable 1: Incident History */}
                <div className="space-y-1.5 pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#0B124D]">
                      <input
                        type="checkbox"
                        checked={activeFactors.incidentHistory}
                        onChange={(e) =>
                          setActiveFactors({ ...activeFactors, incidentHistory: e.target.checked })
                        }
                        className="rounded text-[#FF633C] focus:ring-[#FF633C]"
                      />
                      <span>{language === 'mn' ? 'Түүхэн дуудлагын нягтрал' : 'Historical Incidents'}</span>
                    </label>
                    <span className="font-mono text-xs font-bold text-[#FF633C]">
                      {Math.round(weights.incidentHistoryWeight * 100)}%
                    </span>
                  </div>
                  {activeFactors.incidentHistory && (
                    <input
                      type="range"
                      min="0.05"
                      max="0.50"
                      step="0.05"
                      value={weights.incidentHistoryWeight}
                      onChange={(e) =>
                        setWeights({ ...weights, incidentHistoryWeight: parseFloat(e.target.value) })
                      }
                      className="w-full accent-[#FF633C]"
                    />
                  )}
                </div>

                {/* Variable 2: Population Density */}
                <div className="space-y-1.5 pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#0B124D]">
                      <input
                        type="checkbox"
                        checked={activeFactors.populationDensity}
                        onChange={(e) =>
                          setActiveFactors({ ...activeFactors, populationDensity: e.target.checked })
                        }
                        className="rounded text-[#FF633C] focus:ring-[#FF633C]"
                      />
                      <span>{language === 'mn' ? 'Хүн амын нягтрал' : 'Population Density'}</span>
                    </label>
                    <span className="font-mono text-xs font-bold text-[#0B124D]">
                      {Math.round(weights.populationDensityWeight * 100)}%
                    </span>
                  </div>
                  {activeFactors.populationDensity && (
                    <input
                      type="range"
                      min="0.05"
                      max="0.40"
                      step="0.05"
                      value={weights.populationDensityWeight}
                      onChange={(e) =>
                        setWeights({ ...weights, populationDensityWeight: parseFloat(e.target.value) })
                      }
                      className="w-full accent-[#0B124D]"
                    />
                  )}
                </div>

                {/* Variable 3: Ger Ratio / Stoves */}
                <div className="space-y-1.5 pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#0B124D]">
                      <input
                        type="checkbox"
                        checked={activeFactors.gerProportion}
                        onChange={(e) =>
                          setActiveFactors({ ...activeFactors, gerProportion: e.target.checked })
                        }
                        className="rounded text-[#FF633C] focus:ring-[#FF633C]"
                      />
                      <span>{language === 'mn' ? 'Гэр хорооллын халаалт & зуух' : 'Stove & Ger Ratio'}</span>
                    </label>
                    <span className="font-mono text-xs font-bold text-[#0B124D]">
                      {Math.round(weights.gerProportionWeight * 100)}%
                    </span>
                  </div>
                  {activeFactors.gerProportion && (
                    <input
                      type="range"
                      min="0.05"
                      max="0.35"
                      step="0.05"
                      value={weights.gerProportionWeight}
                      onChange={(e) =>
                        setWeights({ ...weights, gerProportionWeight: parseFloat(e.target.value) })
                      }
                      className="w-full accent-[#0B124D]"
                    />
                  )}
                </div>

                {/* Variable 4: Station Proximity */}
                <div className="space-y-1.5 pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#0B124D]">
                      <input
                        type="checkbox"
                        checked={activeFactors.stationProximity}
                        onChange={(e) =>
                          setActiveFactors({ ...activeFactors, stationProximity: e.target.checked })
                        }
                        className="rounded text-[#FF633C] focus:ring-[#FF633C]"
                      />
                      <span>{language === 'mn' ? 'Гал унтраах ангийн зай' : 'Station Distance Gap'}</span>
                    </label>
                    <span className="font-mono text-xs font-bold text-[#0B124D]">
                      {Math.round(weights.stationProximityWeight * 100)}%
                    </span>
                  </div>
                  {activeFactors.stationProximity && (
                    <input
                      type="range"
                      min="0.05"
                      max="0.30"
                      step="0.05"
                      value={weights.stationProximityWeight}
                      onChange={(e) =>
                        setWeights({ ...weights, stationProximityWeight: parseFloat(e.target.value) })
                      }
                      className="w-full accent-[#0B124D]"
                    />
                  )}
                </div>

                {/* Variable 5: Road Accessibility */}
                <div className="space-y-1.5 pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#0B124D]">
                      <input
                        type="checkbox"
                        checked={activeFactors.roadAccessibility}
                        onChange={(e) =>
                          setActiveFactors({ ...activeFactors, roadAccessibility: e.target.checked })
                        }
                        className="rounded text-[#FF633C] focus:ring-[#FF633C]"
                      />
                      <span>{language === 'mn' ? 'Замын нэвтрэх чадвар' : 'Road Accessibility'}</span>
                    </label>
                    <span className="font-mono text-xs font-bold text-[#0B124D]">
                      {Math.round(weights.roadAccessibilityWeight * 100)}%
                    </span>
                  </div>
                  {activeFactors.roadAccessibility && (
                    <input
                      type="range"
                      min="0.05"
                      max="0.25"
                      step="0.05"
                      value={weights.roadAccessibilityWeight}
                      onChange={(e) =>
                        setWeights({ ...weights, roadAccessibilityWeight: parseFloat(e.target.value) })
                      }
                      className="w-full accent-[#0B124D]"
                    />
                  )}
                </div>

                {/* Variable 6: Weather & Seasonality */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#0B124D]">
                      <input
                        type="checkbox"
                        checked={activeFactors.seasonalWeather}
                        onChange={(e) =>
                          setActiveFactors({ ...activeFactors, seasonalWeather: e.target.checked })
                        }
                        className="rounded text-[#FF633C] focus:ring-[#FF633C]"
                      />
                      <span>{language === 'mn' ? 'Цаг агаар ба улирал' : 'Weather & Seasonality'}</span>
                    </label>
                    <span className="font-mono text-xs font-bold text-[#0B124D]">
                      {Math.round(weights.seasonalWeatherWeight * 100)}%
                    </span>
                  </div>
                  {activeFactors.seasonalWeather && (
                    <input
                      type="range"
                      min="0.05"
                      max="0.25"
                      step="0.05"
                      value={weights.seasonalWeatherWeight}
                      onChange={(e) =>
                        setWeights({ ...weights, seasonalWeatherWeight: parseFloat(e.target.value) })
                      }
                      className="w-full accent-[#0B124D]"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Results Display (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#0B124D]/8 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#0B124D]/8 mb-6">
              <div>
                <h3 className="font-editorial text-lg font-bold text-[#0B124D]">
                  {language === 'mn' ? 'Шинжилгээний шууд үр дүн' : 'Simulated District Risk Scores'}
                </h3>
                <p className="text-xs text-[#72778A]">
                  {language === 'mn'
                    ? 'Тохируулсан жингийн дагуу дүүрэг бүрийн оноо бодит хугацаанд шинэчлэгдэнэ'
                    : 'Recalculated dynamically as model factor weights are modulated'}
                </p>
              </div>
              {compareMode && (
                <span className="text-[11px] font-mono font-bold bg-[#0B124D]/5 text-[#0B124D] px-2 py-1 rounded">
                  {language === 'mn' ? 'Суурь оноотой харьцуулж байна' : 'Comparing vs Baseline'}
                </span>
              )}
            </div>

            <div className="space-y-4">
              {[...calculatedDistricts]
                .sort((a, b) => b.currentScore - a.currentScore)
                .map(({ district, currentScore, originalScore }) => {
                  const delta = currentScore - originalScore;
                  const scoreColor =
                    currentScore >= 75
                      ? 'text-[#E93B2F]'
                      : currentScore >= 55
                      ? 'text-[#FF633C]'
                      : 'text-[#12B89A]';

                  return (
                    <div
                      key={district.id}
                      className="p-4 rounded-xl bg-[#F7F8FA] border border-[#0B124D]/5 hover:border-[#0B124D]/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-[#0B124D]">
                            {language === 'mn' ? district.nameMn : district.nameEn}
                          </span>
                          <span className="text-[10px] font-mono text-[#72778A]">
                            {district.population.toLocaleString()} хүн ам · {district.gerHouseholdPercent}% гэр
                          </span>
                        </div>

                        {/* Progress Indicator */}
                        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              currentScore >= 75
                                ? 'bg-[#E93B2F]'
                                : currentScore >= 55
                                ? 'bg-[#FF633C]'
                                : 'bg-[#12B89A]'
                            }`}
                            style={{ width: `${currentScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Scores & Delta */}
                      <div className="flex items-center gap-4 shrink-0 font-mono">
                        <div className="text-right">
                          <span className={`text-xl font-bold ${scoreColor} tabular-nums`}>
                            {currentScore}
                          </span>
                          <span className="text-xs text-[#72778A]"> / 100</span>
                        </div>

                        {compareMode && (
                          <div className="text-right text-xs">
                            <span className="text-[#72778A] block text-[10px]">
                              {language === 'mn' ? 'Суурь' : 'Base'}: {originalScore}
                            </span>
                            <span
                              className={`font-bold ${
                                delta > 0 ? 'text-[#FF633C]' : delta < 0 ? 'text-[#12B89A]' : 'text-slate-400'
                              }`}
                            >
                              {delta > 0 ? `+${delta}` : delta}
                            </span>
                          </div>
                        )}

                        {onNavigateToMapWithDistrict && (
                          <button
                            onClick={() => onNavigateToMapWithDistrict(district.id)}
                            className="p-1.5 rounded-lg bg-white border border-[#0B124D]/10 hover:bg-[#0B124D] hover:text-white transition-colors text-xs text-[#0B124D]"
                            title={language === 'mn' ? 'Зураг дээр харах' : 'View on map'}
                          >
                            🗺️
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

        </div>

      </div>

      {/* Methodology Modal */}
      {showMethodologyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#0B124D]/10 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#0B124D]/10 mb-4">
              <h3 className="font-editorial text-xl font-bold text-[#0B124D]">
                {language === 'mn' ? 'Арга зүй ба тооцооллын стандарт' : 'Methodology & Model Formulas'}
              </h3>
              <button
                onClick={() => setShowMethodologyModal(false)}
                className="w-8 h-8 rounded-full bg-[#F7F8FA] hover:bg-slate-200 flex items-center justify-center text-[#72778A] font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#72778A] leading-relaxed">
              <p>
                {language === 'mn'
                  ? 'FireWatch UB платформ нь 6 тусдаа орон зайн болон бүтцийн хувьсагчдыг 0-100 хуваарьт нормчилж, олон шалгуурт шийдвэрийн шинжилгээний (MCDA) загвараар нэгтгэн эрсдэлийн индексийг гаргадаг.'
                  : 'The platform aggregates 6 normalized structural and environmental variables into a standardized 0–100 index via Multi-Criteria Decision Analysis (MCDA).'}
              </p>

              <div className="space-y-3 pt-2">
                {RISK_VARIABLES_METADATA.map((m) => (
                  <div key={m.code} className="p-3 rounded-xl bg-[#F7F8FA] border border-[#0B124D]/5">
                    <div className="flex items-center justify-between font-mono text-[11px] font-bold text-[#0B124D] mb-1">
                      <span>{m.code} · {language === 'mn' ? m.nameMn : m.nameEn}</span>
                      <span>{m.weightPercent}% жин</span>
                    </div>
                    <code className="block bg-white p-1.5 rounded font-mono text-[10px] text-[#FF633C] mb-1 border border-[#0B124D]/5">
                      {m.normalizationFormula}
                    </code>
                    <p className="text-[11px]">
                      {language === 'mn' ? m.descriptionMn : m.descriptionEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#0B124D]/10 flex justify-end">
              <button
                onClick={() => setShowMethodologyModal(false)}
                className="px-5 py-2 bg-[#0B124D] text-white rounded-xl text-xs font-bold"
              >
                {language === 'mn' ? 'Хаах' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
