/**
 * LIVE weather + fire-weather engine for Ulaanbaatar.
 *
 * Pulls real observations from Open-Meteo (no API key, CORS enabled) and derives
 * a 0-100 fire-weather index. A single shared engine is used app-wide so the map,
 * dashboard and weather module never issue duplicate requests, and so a failed
 * network call degrades to the modelled baseline instead of showing blanks.
 */
import { useSyncExternalStore } from 'react';
import { CURRENT_UB_WEATHER } from '../data/ubGeoData';
import type { RiskLevel, WeatherData } from '../types';

export interface LiveDailySlice {
  date: string;
  tempMaxC: number;
  tempMinC: number;
  precipitationMm: number;
  windMaxKmh: number;
  humidityMaxPct: number;
}

export type WeatherStatus = 'loading' | 'live' | 'fallback';

export interface LiveWeather extends WeatherData {
  status: WeatherStatus;
  isLive: boolean;
  /** Real ISO timestamp reported by the station/model grid */
  observedAtIso: string;
  apparentCelsius: number;
  gustKmh: number;
  precipitationMm: number;
  weatherCode: number;
  symbol: string;
  daily: LiveDailySlice[];
  fetchedAtMs: number | null;
}

export const UB_COORDS = { lat: 47.9184, lon: 106.9177 } as const;

const REFRESH_MS = 10 * 60 * 1000; // 10 minutes — weather does not move faster
const REQUEST_TIMEOUT_MS = 9000;

type Listener = () => void;

/** Fire-weather index: dry air and wind carry embers, rain and cold suppress ignition. */
export function computeFireWeatherIndex(input: {
  tempCelsius: number;
  humidityPercent: number;
  windSpeedKmh: number;
  precipitationMm: number;
  droughtDays: number;
}): number {
  const { tempCelsius, humidityPercent, windSpeedKmh, precipitationMm, droughtDays } = input;

  // 0-40 dryness (RH 100% -> 0, RH 0% -> 40)
  const dryness = (Math.max(0, Math.min(100, 100 - humidityPercent)) / 100) * 40;
  // 0-25 wind (0 km/h -> 0, 60+ km/h -> 25)
  const wind = Math.min(1, windSpeedKmh / 60) * 25;
  // 0-15 warmth-driven drying: cold UB winters still burn, so floor at mild weighting
  const thermal = Math.max(0, Math.min(1, (tempCelsius + 15) / 45)) * 15;
  // 0-12 dry spell persistence
  const persistent = Math.min(1, droughtDays / 21) * 12;
  // rain credit
  const rainPenalty = Math.min(20, precipitationMm * 12);

  const raw = dryness + wind + thermal + persistent - rainPenalty;
  return Math.max(5, Math.min(100, Math.round(raw)));
}

export function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 75) return 'very_high';
  if (score >= 55) return 'high';
  if (score >= 35) return 'moderate';
  return 'low';
}

const WEATHER_CODES: Record<number, { mn: string; en: string; symbol: string; condition: WeatherData['condition'] }> = {
  0: { mn: 'Цэлмэг', en: 'Clear sky', symbol: '☀️', condition: 'clear' },
  1: { mn: 'Цэлмэгээр бага үүл', en: 'Mainly clear', symbol: '🌤️', condition: 'clear' },
  2: { mn: 'Хуваарьтай үүл', en: 'Partly cloudy', symbol: '⛅', condition: 'clear' },
  3: { mn: 'Бүдэг үүл', en: 'Overcast', symbol: '☁️', condition: 'cold' },
  45: { mn: 'Манан', en: 'Fog', symbol: '🌫️', condition: 'cold' },
  48: { mn: 'Шигтгэмтгий манан', en: 'Rime fog', symbol: '🌫️', condition: 'cold' },
  51: { mn: 'Салхируутан үүл, хуурай', en: 'Dry breeze', symbol: '🌬️', condition: 'windy' },
  53: { mn: 'Салхируутан үүл, хуурай', en: 'Dry breeze', symbol: '🌬️', condition: 'windy' },
  55: { mn: 'Салхируутан үүл, хуурай', en: 'Dry breeze', symbol: '🌬️', condition: 'windy' },
  61: { mn: 'Хөнгөн бороо', en: 'Light rain', symbol: '🌦️', condition: 'snow' },
  63: { mn: 'Бороо', en: 'Rain', symbol: '🌧️', condition: 'snow' },
  65: { mn: 'Хүчтэй бороо', en: 'Heavy rain', symbol: '🌧️', condition: 'snow' },
  66: { mn: 'Мөстөрмөгц бороо', en: 'Freezing rain', symbol: '🌨️', condition: 'snow' },
  67: { mn: 'Хүчтэй мөстөрмөгц', en: 'Heavy freezing rain', symbol: '🌨️', condition: 'snow' },
  71: { mn: 'Хөнгөн цас', en: 'Light snow', symbol: '🌨️', condition: 'snow' },
  73: { mn: 'Цас орох', en: 'Snow', symbol: '❄️', condition: 'snow' },
  75: { mn: 'Хүчтэй цас', en: 'Heavy snow', symbol: '❄️', condition: 'snow' },
  77: { mn: 'Цас ширхэг', en: 'Snow grains', symbol: '❄️', condition: 'snow' },
  80: { mn: 'Аар шуурга', en: 'Rain showers', symbol: '🌦️', condition: 'snow' },
  81: { mn: 'Аар шуурга', en: 'Rain showers', symbol: '🌦️', condition: 'snow' },
  82: { mn: 'Хүчтэй аар шуурга', en: 'Violent showers', symbol: '⛈️', condition: 'snow' },
  85: { mn: 'Цасан шуурга', en: 'Snow showers', symbol: '🌨️', condition: 'snow' },
  86: { mn: 'Хүчтэй цасан шуурга', en: 'Heavy snow showers', symbol: '🌨️', condition: 'snow' },
  95: { mn: 'Аянгын дуу', en: 'Thunderstorm', symbol: '⛈️', condition: 'snow' },
  96: { mn: 'Аянгын цхэр', en: 'Thunderstorm with hail', symbol: '⛈️', condition: 'snow' },
  99: { mn: 'Хүчтэй аянгын цхэр', en: 'Severe thunderstorm', symbol: '⛈️', condition: 'snow' },
};

const COMPASS_MN = ['Х', 'ХЗ', 'З', 'ЗӨ', 'Ө', 'ӨБ', 'Б', 'БХ'];
const COMPASS_EN = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export const compassIndex = (deg: number): number => Math.round(((deg % 360) / 45)) % 8;
export const compassEn = (deg: number): string => COMPASS_EN[compassIndex(deg)];
export const compassMn = (deg: number): string => COMPASS_MN[compassIndex(deg)];

/**
 * Consecutive days without measurable precipitation, counting back from TODAY.
 * `daily` carries 10 past days then 7 forecast days, so the today index must be
 * located first — scanning from the array end would read future predictions.
 */
function countDroughtDays(daily: LiveDailySlice[], todayIso: string): number {
  let i = daily.findIndex((d) => d.date >= todayIso);
  if (i === -1) i = daily.length - 1;
  let days = 0;
  for (; i >= 0; i--) {
    if (daily[i].precipitationMm < 0.2) days += 1;
    else break;
  }
  return days;
}

const FALLBACK: LiveWeather = {
  ...CURRENT_UB_WEATHER,
  windDirectionCompass: 'NW',
  status: 'loading',
  isLive: false,
  observedAtIso: '',
  apparentCelsius: CURRENT_UB_WEATHER.tempCelsius - 2.1,
  gustKmh: Math.round(CURRENT_UB_WEATHER.windSpeedKmh * 1.6),
  precipitationMm: 0,
  weatherCode: 2,
  symbol: '⛅',
  daily: [],
  fetchedAtMs: null,
};

class LiveWeatherEngine {
  private state: LiveWeather = FALLBACK;
  private listeners = new Set<Listener>();
  private timer: number | null = null;
  private started = false;
  private inflight: AbortController | null = null;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = (): LiveWeather => this.state;

  private emit() {
    this.listeners.forEach((l) => l());
  }

  private patch(next: Partial<LiveWeather>) {
    this.state = { ...this.state, ...next };
    this.emit();
  }

  /** Called once from App so every view shares one request and one timer. */
  public start() {
    if (this.started) {
      if (this.isStale()) void this.refresh();
      return;
    }
    this.started = true;
    void this.refresh();
    this.timer = window.setInterval(() => {
      if (!document.hidden) void this.refresh();
    }, REFRESH_MS);
    document.addEventListener('visibilitychange', this.onVisible);
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    document.removeEventListener('visibilitychange', this.onVisible);
    this.started = false;
  }

  private onVisible = () => {
    if (!document.hidden && this.isStale()) void this.refresh();
  };

  public isStale(): boolean {
    if (!this.state.fetchedAtMs) return true;
    return Date.now() - this.state.fetchedAtMs > REFRESH_MS;
  }

  public async refresh(): Promise<void> {
    if (this.inflight) this.inflight.abort();
    const controller = new AbortController();
    this.inflight = controller;
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const url =
      'https://api.open-meteo.com/v1/forecast' +
      `?latitude=${UB_COORDS.lat}&longitude=${UB_COORDS.lon}` +
      '&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m' +
      '&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,relative_humidity_2m_max' +
      '&past_days=10&forecast_days=7&timezone=Asia%2FUlaanbaatar';

    try {
      const res = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as {
        current?: Record<string, number | string>;
        daily?: { time?: string[]; temperature_2m_max?: number[]; temperature_2m_min?: number[]; precipitation_sum?: number[]; wind_speed_10m_max?: number[]; relative_humidity_2m_max?: number[] };
        utc_offset_seconds?: number;
      };

      const c = json.current;
      if (!c) throw new Error('Missing current block');

      const tempC = Number(c.temperature_2m);
      const humidity = Number(c.relative_humidity_2m);
      const windKmh = Number(c.wind_speed_10m);
      const windDeg = Number(c.wind_direction_10m);
      const gust = Number(c.wind_gusts_10m || windKmh * 1.4);
      const apparent = Number(c.apparent_temperature ?? tempC);
      const precip = Number(c.precipitation ?? 0);
      const code = Number(c.weather_code ?? 0);
      if ([tempC, humidity, windKmh].some((v) => Number.isNaN(v))) throw new Error('NaN observation');

      const daily: LiveDailySlice[] = (json.daily?.time ?? []).map((date, i) => ({
        date,
        tempMaxC: Number(json.daily?.temperature_2m_max?.[i] ?? 0),
        tempMinC: Number(json.daily?.temperature_2m_min?.[i] ?? 0),
        precipitationMm: Number(json.daily?.precipitation_sum?.[i] ?? 0),
        windMaxKmh: Number(json.daily?.wind_speed_10m_max?.[i] ?? 0),
        humidityMaxPct: Number(json.daily?.relative_humidity_2m_max?.[i] ?? 60),
      }));

      const observedAtIso = String(c.time ?? new Date().toISOString());
      const droughtDays = countDroughtDays(daily, observedAtIso.slice(0, 10));
      const fwIndex = computeFireWeatherIndex({
        tempCelsius: tempC,
        humidityPercent: humidity,
        windSpeedKmh: windKmh,
        precipitationMm: precip,
        droughtDays,
      });

      const meta = WEATHER_CODES[code] ?? { mn: 'Тодорхойгүй', en: 'Unknown', symbol: '🌡️', condition: 'cold' as const };
      const tzHours = Math.round((json.utc_offset_seconds ?? 28800) / 3600);

      this.patch({
        tempCelsius: round1(tempC),
        humidityPercent: Math.round(humidity),
        windSpeedKmh: round1(windKmh),
        windDirectionDeg: Math.round(windDeg),
        windDirectionCompass: compassEn(windDeg),
        condition: meta.condition,
        conditionMn: meta.mn,
        conditionEn: meta.en,
        fireWeatherIndex: fwIndex,
        droughtDays,
        lastUpdated: formatObserved(observedAtIso, tzHours),
        status: 'live',
        isLive: true,
        observedAtIso,
        apparentCelsius: round1(apparent),
        gustKmh: Math.round(gust),
        precipitationMm: round1(precip),
        weatherCode: code,
        symbol: meta.symbol,
        daily,
        fetchedAtMs: Date.now(),
      });
    } catch (err) {
      // Keep whatever we already have; only flag fallback on the very first attempt.
      if (!this.state.isLive) {
        this.patch({ status: 'fallback' });
      }
      console.warn('[FireWatch UB] Live weather feed unavailable, using modelled baseline.', err);
    } finally {
      window.clearTimeout(timeout);
      if (this.inflight === controller) this.inflight = null;
    }
  }
}

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}

function formatObserved(iso: string, tzHours: number): string {
  // Open-Meteo reports local wall-clock time for the requested timezone, so the
  // "YYYY-MM-DDTHH:MM" prefix is already Ulaanbaatar time.
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(iso);
  if (!match) return iso;
  const [, y, mo, d, hh, mm] = match;
  return `${y}-${mo}-${d} ${hh}:${mm} UTC+${tzHours}`;
}

export const liveWeather = new LiveWeatherEngine();

export const useLiveWeather = (): LiveWeather =>
  useSyncExternalStore(liveWeather.subscribe, liveWeather.getSnapshot, liveWeather.getSnapshot);

/** Minutes elapsed since the last successful observation. */
export const minutesSince = (fetchedAtMs: number | null): number | null =>
  fetchedAtMs ? Math.max(0, Math.round((Date.now() - fetchedAtMs) / 60000)) : null;
