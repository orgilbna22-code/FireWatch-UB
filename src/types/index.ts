export type Language = 'mn' | 'en';
export type ViewMode = 'public' | 'pro';
export type Theme = 'light' | 'dark';
export type ActiveTab = 
  | 'landing' 
  | 'overview' 
  | 'map' 
  | 'explorer' 
  | 'districts' 
  | 'incidents' 
  | 'calendar' 
  | 'emergency' 
  | 'weather' 
  | 'safety' 
  | 'reports' 
  | 'sources'
  | 'personal';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'very_high';

export interface FactorContribution {
  id: string;
  nameMn: string;
  nameEn: string;
  weight: number; // percentage of total score
  score: number; // 0 - 100
  contributionValue: number; // weight * score / 100
  impact: 'low' | 'moderate' | 'high';
  descriptionMn: string;
  descriptionEn: string;
}

export interface KhorooData {
  id: string; // e.g. 'bzd-1'
  districtId: string;
  khorooNumber: number;
  nameMn: string;
  nameEn: string;
  center: [number, number]; // [lat, lng]
  population: number;
  households: number;
  gerHouseholdPercent: number;
  apartmentHouseholdPercent: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  primaryRiskFactorMn: string;
  primaryRiskFactorEn: string;
  fireHydrantCount: number;
  roadAccessibility: 'Сайн' | 'Дунд' | 'Муу' | 'Маш муу';
  avgResponseTimeMin: number; // минут
  historicalIncidents2024_2026: number;
  photoUrl: string;
  landmarksMn: string[];
  landmarksEn: string[];
}

export interface DistrictData {
  id: string;
  nameMn: string;
  nameEn: string;
  center: [number, number]; // [lat, lng]
  polygon: [number, number][]; // Geo coordinates
  population: number;
  areaKm2: number;
  gerHouseholdPercent: number;
  apartmentHouseholdPercent: number;
  fireStationsCount: number;
  nearestStationDistKm: number;
  roadAccessibilityGrade: 'A' | 'B' | 'C' | 'D';
  historicalIncidentsCount: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  contributions: FactorContribution[];
  trend: 'increasing' | 'stable' | 'decreasing';
  keyObservationsMn: string;
  keyObservationsEn: string;
  khoroosCount: number;
  khoroos?: KhorooData[];
  realWorldPhoto?: string;
  satellitePhoto?: string;
}

export interface IncidentRecord {
  id: string;
  date: string;
  districtId: string;
  districtNameMn: string;
  districtNameEn: string;
  khoroo: number;
  category: 'residential_ger' | 'residential_apt' | 'commercial' | 'grass_forest' | 'electrical';
  coordinates: [number, number];
  severity: 'minor' | 'moderate' | 'critical';
  causeGuessMn: string;
  causeGuessEn: string;
  estimatedDamageMnt: number;
  isDemo: boolean;
}

export interface FireStation {
  id: string;
  code: string;
  nameMn: string;
  nameEn: string;
  districtId: string;
  addressMn: string;
  addressEn: string;
  coordinates: [number, number];
  vehiclesCount: number;
  personnelActive: number;
  coverageRadiusKm: number;
  servingDistrictsMn: string[];
  servingDistrictsEn: string[];
}

export interface MonthRiskData {
  month: number;
  nameMn: string;
  nameEn: string;
  shortMn: string;
  shortEn: string;
  riskScore: number;
  riskLevel: RiskLevel;
  primaryDriversMn: string[];
  primaryDriversEn: string[];
  historicalAvgIncidents: number;
  avgTempCelsius: number;
  relativeHumidity: number;
  windSpeedKmh: number;
  seasonContextMn: string;
  seasonContextEn: string;
}

export interface WeatherData {
  tempCelsius: number;
  humidityPercent: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  windDirectionCompass: string;
  condition: 'dry' | 'clear' | 'windy' | 'cold' | 'snow';
  conditionMn: string;
  conditionEn: string;
  fireWeatherIndex: number; // 0 - 100
  droughtDays: number;
  lastUpdated: string;
}

export interface RiskModelWeights {
  incidentHistoryWeight: number; // default 0.30
  populationDensityWeight: number; // default 0.20
  stationProximityWeight: number; // default 0.15
  gerProportionWeight: number; // default 0.15
  roadAccessibilityWeight: number; // default 0.10
  seasonalWeatherWeight: number; // default 0.10
}
