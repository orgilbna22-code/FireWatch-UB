import { KhorooData, RiskLevel } from '../types';

/**
 * Data files store some enums in Mongolian only. These helpers translate the
 * stored value at render time so the English UI never leaks Cyrillic labels.
 */

const RISK_LEVEL: Record<RiskLevel, { mn: string; en: string }> = {
  low: { mn: 'Бага', en: 'Low' },
  moderate: { mn: 'Дунд', en: 'Moderate' },
  high: { mn: 'Өндөр', en: 'High' },
  very_high: { mn: 'Маш өндөр', en: 'Very high' },
};

const ROAD_ACCESS: Record<KhorooData['roadAccessibility'], { mn: string; en: string }> = {
  Сайн: { mn: 'Сайн', en: 'Good' },
  Дунд: { mn: 'Дунд', en: 'Fair' },
  Муу: { mn: 'Муу', en: 'Poor' },
  'Маш муу': { mn: 'Маш муу', en: 'Very poor' },
};

const TREND: Record<'increasing' | 'stable' | 'decreasing', { mn: string; en: string }> = {
  increasing: { mn: 'Өсөх хандлагатай', en: 'Increasing' },
  stable: { mn: 'Тогтвортой', en: 'Stable' },
  decreasing: { mn: 'Буурах хандлагатай', en: 'Decreasing' },
};

export const riskLevelLabel = (level: RiskLevel, isMn: boolean) =>
  (RISK_LEVEL[level] ?? RISK_LEVEL.moderate)[isMn ? 'mn' : 'en'];

export const roadAccessLabel = (value: KhorooData['roadAccessibility'], isMn: boolean) =>
  (ROAD_ACCESS[value] ?? { mn: value, en: value })[isMn ? 'mn' : 'en'];

export const trendLabel = (trend: 'increasing' | 'stable' | 'decreasing', isMn: boolean) =>
  (TREND[trend] ?? TREND.stable)[isMn ? 'mn' : 'en'];

export const khorooLabel = (khorooNumber: number, isMn: boolean) =>
  isMn ? `${khorooNumber}-р хороо` : `Khoroo ${khorooNumber}`;

export const distanceLabel = (km: number, isMn: boolean) =>
  isMn ? `~${km} км` : `~${km} km`;

export const unitKm = (isMn: boolean) => (isMn ? 'км' : 'km');

export const unitKmPerHour = (isMn: boolean) => (isMn ? 'км/ц' : 'km/h');

export const unitKmSquared = (isMn: boolean) => (isMn ? 'км²' : 'km²');

export const unitStations = (count: number, isMn: boolean) =>
  isMn ? `${count} анги` : `${count} station${count === 1 ? '' : 's'}`;

/** Station codes are stored as '<n>-р анги'; English reads 'Company <n>'. */
export const stationCodeLabel = (code: string, isMn: boolean) => {
  if (isMn) return code;
  const num = code.match(/^(\d+)-р анги$/);
  return num ? `Company ${num[1]}` : code;
};
