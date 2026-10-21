import type { DistrictData, KhorooData, RiskLevel } from '../types';

/**
 * Deterministic synthesis of the khoroos that the hand-authored dataset does not
 * cover (Ulaanbaatar has 204 khoroos across its nine districts; only a sample is
 * curated). Generated units are flagged `isModelled` so every view can say so, and
 * their risk score is *derived* from their own attributes rather than typed in, so
 * the list stays internally consistent.
 */

const LEVEL = (s: number): RiskLevel =>
  s >= 75 ? 'very_high' : s >= 55 ? 'high' : s >= 35 ? 'moderate' : 'low';

/** Shared with the curated dataset so both halves obey the same rule. */
export const khorooRiskLevel = LEVEL;

type Access = KhorooData['roadAccessibility'];

const ACCESS_RISK: Record<Access, number> = {
  Сайн: 18,
  Дунд: 42,
  Муу: 68,
  'Маш муу': 86,
};

const ACCESS_BY_INDEX: Access[] = ['Сайн', 'Дунд', 'Муу', 'Маш муу'];

interface Profile {
  key: 'apartment' | 'mixed' | 'ger';
  nameMn: string;
  nameEn: string;
  factorMn: string;
  factorEn: string;
  photo: string;
}

const PROFILES: Profile[] = [
  {
    key: 'apartment',
    nameMn: 'Орон сууцны хороолол',
    nameEn: 'Apartment block',
    factorMn: 'Хуучарсан цахилгаан сүлжээ, орон сууцны орцны зам саад, дулааны сүлжээний засвар.',
    factorEn: 'Aged wiring risers, obstructed entryways and district-heating maintenance work.',
    photo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  },
  {
    key: 'mixed',
    nameMn: 'Хольсон суурин',
    nameEn: 'Mixed settlement',
    factorMn: 'Гэр ба орон сууц аралассан, хашаа модон, ахуйн хэрэглээний галын аюул.',
    factorEn: 'Timber fences between detached homes and apartments, household heating hazards.',
    photo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    key: 'ger',
    nameMn: 'Гэр хороолол',
    nameEn: 'Ger settlement',
    factorMn: 'Зуух, үнс, нүүрсний ил агуулах, нарийн гудамж ба уулын налуу нь гал тарах эрсдэлийг нэмэгдүүлнэ.',
    factorEn: 'Stove cinders, narrow lanes and hillside gradients let fire jump between plots.',
    photo: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  },
];

/** Small, fast, seedable PRNG so every build produces the identical city. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/**
 * Fill district `district.khoroosCount` from the curated units plus generated ones,
 * keeping the district population total and every khoroo's own attributes coherent.
 */
export function synthesizeKhoroos(district: DistrictData, curated: KhorooData[]): KhorooData[] {
  const missing: number[] = [];
  const taken = new Set(curated.map((k) => k.khorooNumber));
  for (let n = 1; n <= district.khoroosCount; n++) {
    if (!taken.has(n)) missing.push(n);
  }
  if (missing.length === 0) return [];

  const curatedPop = curated.reduce((s, k) => s + k.population, 0);
  const remainingPop = Math.max(missing.length * 400, district.population - curatedPop);

  // Spread generated centroids over an area proportional to the district footprint
  const footprintRadiusKm = Math.sqrt(district.areaKm2 / Math.PI);
  const spreadDeg = clamp((footprintRadiusKm / 111) * 0.62, 0.012, 0.085);

  const weights: number[] = [];
  const prng = mulberry32(hashSeed(district.id));
  for (let i = 0; i < missing.length; i++) weights.push(0.6 + prng() * 0.9);
  const weightSum = weights.reduce((s, w) => s + w, 0);

  // District road grade seeds the accessibility distribution of its khoroos
  const gradeOffset =
    district.roadAccessibilityGrade === 'A' ? -1 : district.roadAccessibilityGrade === 'B' ? -0.4 : district.roadAccessibilityGrade === 'C' ? 0.6 : 1.3;

  const out: KhorooData[] = [];
  let allocated = 0;

  for (let i = 0; i < missing.length; i++) {
    const number = missing[i];
    const isLast = i === missing.length - 1;
    const population = isLast
      ? Math.max(400, remainingPop - allocated)
      : Math.round((remainingPop * weights[i]) / weightSum);
    allocated += population;

    const r = mulberry32(hashSeed(`${district.id}:${number}`));

    const gerHouseholdPercent = Math.round(
      clamp(district.gerHouseholdPercent + (r() - 0.42) * 46 + gradeOffset * 4, 2, 98)
    );
    const profile: Profile =
      gerHouseholdPercent >= 62 ? PROFILES[2] : gerHouseholdPercent >= 26 ? PROFILES[1] : PROFILES[0];

    const households = Math.max(90, Math.round(population / (3.35 + (gerHouseholdPercent / 100) * 1.7)));

    const accessIdx = Math.round(clamp(1.4 + gradeOffset + (gerHouseholdPercent / 100) * 1.6 + (r() - 0.5) * 1.1, 0, 3));
    const roadAccessibility = ACCESS_BY_INDEX[accessIdx];

    const fireHydrantCount = Math.max(1, Math.round(clamp(13 - gerHouseholdPercent / 9 + r() * 4, 1, 16)));
    const avgResponseTimeMin = Math.round(clamp(4 + gerHouseholdPercent * 0.1 + accessIdx * 1.8 + r() * 3, 3, 22));

    // Risk is computed from this khoroo's own conditions — never typed in by hand
    const riskScore = Math.round(
      clamp(
        0.34 * gerHouseholdPercent +
          0.2 * ACCESS_RISK[roadAccessibility] +
          0.18 * clamp(100 - fireHydrantCount * 8, 0, 100) +
          0.16 * clamp((avgResponseTimeMin - 3) * 6.5, 0, 100) +
          0.12 * clamp(population / 240, 0, 100),
        12,
        96
      )
    );

    // Triangular clustering keeps most units near the district core
    const dLat = ((r() + r()) / 2 - 0.5) * 2 * spreadDeg;
    const dLng = ((r() + r()) / 2 - 0.5) * 2 * spreadDeg * 1.35;

    out.push({
      id: `${district.id}-${number}`,
      districtId: district.id,
      khorooNumber: number,
      nameMn: `${number}-р хороо (${profile.nameMn})`,
      nameEn: `${number}th Khoroo (${profile.nameEn})`,
      center: [
        +(district.center[0] + dLat).toFixed(4),
        +(district.center[1] + dLng).toFixed(4),
      ],
      population,
      households,
      gerHouseholdPercent,
      apartmentHouseholdPercent: 100 - gerHouseholdPercent,
      riskScore,
      riskLevel: LEVEL(riskScore),
      primaryRiskFactorMn: profile.factorMn,
      primaryRiskFactorEn: profile.factorEn,
      fireHydrantCount,
      roadAccessibility,
      avgResponseTimeMin,
      historicalIncidents2024_2026: Math.max(
        1,
        Math.round((population / 1000) * (riskScore / 100) * 2.1)
      ),
      photoUrl: profile.photo,
      landmarksMn: [],
      landmarksEn: [],
      isModelled: true,
    });
  }

  return out;
}
