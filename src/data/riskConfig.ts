import { RiskModelWeights } from '../types';

export const DEFAULT_RISK_WEIGHTS: RiskModelWeights = {
  incidentHistoryWeight: 0.30,
  populationDensityWeight: 0.20,
  stationProximityWeight: 0.15,
  gerProportionWeight: 0.15,
  roadAccessibilityWeight: 0.10,
  seasonalWeatherWeight: 0.10,
};

export interface RiskFormulaExplanation {
  variableId: keyof RiskModelWeights;
  code: string;
  nameMn: string;
  nameEn: string;
  descriptionMn: string;
  descriptionEn: string;
  dataSourceMn: string;
  dataSourceEn: string;
  normalizationFormula: string;
  weightPercent: number;
}

export const RISK_VARIABLES_METADATA: RiskFormulaExplanation[] = [
  {
    variableId: 'incidentHistoryWeight',
    code: 'HIST_INC',
    nameMn: 'Түүхэн дуудлагын нягтрал',
    nameEn: 'Historical Incident Density',
    descriptionMn: 'Сүүлийн 3 жилд тухайн бүсэд бүртгэгдсэн гал түймрийн давтамж болон нягтралын нормчилсон утга.',
    descriptionEn: 'Normalized frequency and spatial density of verified fire incidents reported over the past 3 years.',
    dataSourceMn: 'Онцгой байдлын нэгдсэн бүртгэл (Жишээ нэгтгэл)',
    dataSourceEn: 'Consolidated Emergency Log (Demo dataset)',
    normalizationFormula: 'score = min(100, (incidents / area_km2) / max_density * 100)',
    weightPercent: 30,
  },
  {
    variableId: 'populationDensityWeight',
    code: 'POP_DENS',
    nameMn: 'Хүн ам ба суурьшлын нягтрал',
    nameEn: 'Population & Settlement Density',
    descriptionMn: 'Нэг хавтгай дөрвөлжин километр дэх хүн амын тоо болон барилгажилтын ойролцоо нягтрал.',
    descriptionEn: 'Resident population and building cluster intensity per square kilometer.',
    dataSourceMn: 'Үндэсний статистикийн хороо (ҮСХ), Нийслэлийн Статистикийн газар',
    dataSourceEn: 'National Statistics Office of Mongolia',
    normalizationFormula: 'score = (population / area_km2) / 8000 * 100',
    weightPercent: 20,
  },
  {
    variableId: 'stationProximityWeight',
    code: 'STA_PROX',
    nameMn: 'Гал унтраах ангийн хүрэх зай',
    nameEn: 'Fire Station Proximity Gap',
    descriptionMn: 'Хамгийн ойрын ОБЕГ-ын Гал түймэр унтраах, аврах анги хүртэлх замын зай болон хүрэх хугацааны саад.',
    descriptionEn: 'Network distance and estimated route impedance to the nearest operational fire station.',
    dataSourceMn: 'ОБЕГ-ын салбар байршлын орон зайн координат',
    dataSourceEn: 'NEMA station spatial coordinates & road network geometry',
    normalizationFormula: 'score = min(100, (distance_km / 12.0) * 100)',
    weightPercent: 15,
  },
  {
    variableId: 'gerProportionWeight',
    code: 'GER_RATIO',
    nameMn: 'Гэр хорооллын эзлэх хувь ба халаалтын төрөл',
    nameEn: 'Ger District Proportion & Heating Type',
    descriptionMn: 'Төвлөрсөн бус халаалт, зуух, уламжлалт гэр болон амины орон сууцны эзлэх хувийн эрсдэлийн индекс.',
    descriptionEn: 'Proportion of decentralized solid-fuel stoves, traditional gers, and standalone wood structures.',
    dataSourceMn: 'Нийслэлийн Засаг даргын тамгын газрын орон сууцны судалгаа',
    dataSourceEn: 'Ulaanbaatar Municipal Housing & Settlement Survey',
    normalizationFormula: 'score = ger_household_percent',
    weightPercent: 15,
  },
  {
    variableId: 'roadAccessibilityWeight',
    code: 'ROAD_ACC',
    nameMn: 'Замын нэвтрэх чадвар ба налуугийн саад',
    nameEn: 'Road Accessibility & Gradient Constraint',
    descriptionMn: 'Нарийн гудамж, хашааны зохион байгуулалт, ус шахах машин нэвтрэх боломжгүй мухар замуудын индекс.',
    descriptionEn: 'Street width sufficiency, dead-end alley frequency, and steep slope terrain impedance for heavy engines.',
    dataSourceMn: 'OpenStreetMap замын сүлжээ & Газарзүйн өндөржлийн тоон загвар (DEM)',
    dataSourceEn: 'OpenStreetMap Road Network & Digital Elevation Model',
    normalizationFormula: 'score = 100 - road_access_score',
    weightPercent: 10,
  },
  {
    variableId: 'seasonalWeatherWeight',
    code: 'SEAS_WEATH',
    nameMn: 'Улирлын нөхцөл ба цаг агаарын хүчин зүйл',
    nameEn: 'Seasonality & Meteorological Factors',
    descriptionMn: 'Хуурайшилтын түвшин, салхины дундаж хурд, халаалтын улирлын ид үе болон хаврын хуурай өдрүүд.',
    descriptionEn: 'Relative humidity deficit, sustained wind velocity, and active winter stove heating cycle.',
    dataSourceMn: 'Цаг уур, орчны шинжилгээний газар (ЦУОШГ)',
    dataSourceEn: 'National Agency for Meteorology and Environmental Monitoring',
    normalizationFormula: 'score = (0.5 * wind_factor) + (0.5 * dryness_factor)',
    weightPercent: 10,
  },
];

export function calculateNormalizedScore(
  rawValues: {
    incidentDensityScore: number;
    populationDensityScore: number;
    stationDistanceScore: number;
    gerHouseholdScore: number;
    roadConstraintScore: number;
    weatherFactorScore: number;
  },
  weights: RiskModelWeights = DEFAULT_RISK_WEIGHTS
): { score: number; level: 'low' | 'moderate' | 'high' | 'very_high' } {
  const sumWeights =
    weights.incidentHistoryWeight +
    weights.populationDensityWeight +
    weights.stationProximityWeight +
    weights.gerProportionWeight +
    weights.roadAccessibilityWeight +
    weights.seasonalWeatherWeight;

  const normalizedTotal =
    (rawValues.incidentDensityScore * weights.incidentHistoryWeight +
      rawValues.populationDensityScore * weights.populationDensityWeight +
      rawValues.stationDistanceScore * weights.stationProximityWeight +
      rawValues.gerHouseholdScore * weights.gerProportionWeight +
      rawValues.roadConstraintScore * weights.roadAccessibilityWeight +
      rawValues.weatherFactorScore * weights.seasonalWeatherWeight) /
    (sumWeights || 1);

  const score = Math.min(100, Math.max(0, Math.round(normalizedTotal)));

  let level: 'low' | 'moderate' | 'high' | 'very_high' = 'low';
  if (score >= 75) level = 'very_high';
  else if (score >= 55) level = 'high';
  else if (score >= 35) level = 'moderate';
  else level = 'low';

  return { score, level };
}
