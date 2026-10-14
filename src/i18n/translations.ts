import { Language } from '../types';

export const UI_STRINGS = {
  mn: {
    brandName: 'FIREWATCH UB',
    tagline: 'Гал гарахаас өмнө эрсдэлийг нь харуулна.',
    subtitle: 'Улаанбаатар хотын галын эрсдэлийн тандалт, дүн шинжилгээ, олон нийтийн аюулгүй байдлын платформ',
    startupLabel: 'START UP · 2026–2027',
    pageIndicator: '01 / 06',
    directionPill: 'ЧИГЛЭЛ · Байгаль орчин · Хот',
    demoMode: 'ЖИШЭЭ ӨГӨГДӨЛ · DEMO MODE',
    demoNotice: 'Энэхүү платформ нь бэлтгэл шатны жишээ загвар ба баталгаажсан загварчлалд суурилж байна. Албан ёсны онцгой байдлын автомат систем биш.',
    searchPlaceholder: 'Дүүрэг, хороо, гал унтраах анги хайх...',
    analyzeCurrentArea: 'ЭНЭ ОРЧМЫГ ШИНЖЛЭХ',
    viewRiskMap: 'ЭРСДЭЛИЙН ГАЗРЫН ЗУРАГ ҮЗЭХ',
    problemKicker: 'АСУУДАЛ',
    solutionKicker: 'ШИЙДЭЛ · MVP',
    problemTitle: 'Гал гарсны дараа унтраах биш, гарахаас нь өмнө урьдчилан тандах тогтолцоо',
    problemText: 'Улаанбаатар хотын гэр хороолол, өвлийн халаалтын улирал, нарийн мухар гудамж, уулын налуу зам, цахилгааны хуучирсан шугам сүлжээ зэрэг нь галын аюулыг огцом нэмэгдүүлдэг. Гал унтраах ангиуд дуудлага авч хүрэх үед нэвтрэх зам хаагдах, байршил тодорхойлох хугацаа алдах зэрэг бодит хүндрэлүүд тулгардаг.',
    solution1Title: 'Урьдчилан сэргийлэх эрсдэлийн хяналт',
    solution1Desc: 'Дүүрэг, хороодын эрсдэлийн индекст суурилан урьдчилан сэргийлэх арга хэмжээг төлөвлөх боломж олгоно.',
    solution2Title: 'Өгөгдөлд суурилсан эрсдэлийн шинжилгээ',
    solution2Desc: 'Хүн амын нягтрал, халаалтын төрөл, түүхэн дуудлага, замын нэвтрэлтийг загварчлан тооцоолно.',
    solution3Title: 'Бүс нутагт тохирсон зөвлөмж',
    solution3Desc: 'Тухайн дүүргийн орчин нөхцөлд тохирсон бодит, хэрэгжихүйц аюулгүй байдлын чиглүүлэг олгоно.',
    solution4Title: 'Аюулгүй байдлын нээлттэй мэдээлэл',
    solution4Desc: 'Иргэдэд зориулсан ойлгомжтой, шалгагдсан галын аюулгүй байдлын гарын авлага, зааварчилгаа.',
    
    phoneBadgeWeek: 'Энэ 7 хоногийн эрсдэл',
    phoneRiskHigh: 'ӨНДӨР ЭРСДЭЛ',
    phoneCalendarTitle: 'Жилийн эрсдэлийн хуанли',
    phoneStepsTitle: 'Сэргийлэх 3 алхам',
    phoneStep1: 'Яндангаа хөөлөх, халхавч шалгах',
    phoneStep2: 'Цахилгаан залгуурын ачааллыг салгах',
    phoneStep3: 'Халуун үнсээ төмөр саванд таглаж хийх',

    navOverview: 'Ерөнхий тойм',
    navMap: 'Эрсдэлийн зураг',
    navExplorer: 'Шинжилгээний симулятор',
    navDistricts: 'Дүүргийн шинжилгээ',
    navIncidents: 'Түүхэн дуудлага',
    navEmergency: 'Гал унтраах ангиуд',
    navCalendar: '12 сарын хуанли',
    navWeather: 'Цаг агаар · Орчин',
    navSafety: 'Аюулгүй байдлын төв',
    navReports: 'Тайлан гаргах',
    navSources: 'Өгөгдлийн эх сурвалж',
    
    publicMode: 'Олон нийтийн горим',
    proMode: 'Мэргэжлийн горим (Pro)',
    
    areaTitle: 'БҮС НУТАГ',
    riskIndicatorTitle: 'АНАЛИТИК ЭРСДЭЛИЙН ҮЗҮҮЛЭЛТ',
    whyThisArea: 'ЯАГААД ЭНЭ ГАЗАР ИЙМ ҮЗҮҮЛЭЛТТЭЙ ГАРСАН БЭ?',
    contributionsExplain: 'Олон хүчин зүйлт нормчилсон загварын үзүүлэлтүүдийн нөлөөлөл',
    
    riskLevels: {
      low: 'БАГА ЭРСДЭЛ',
      moderate: 'ДУНД ЭРСДЭЛ',
      high: 'ӨНДӨР ЭРСДЭЛ',
      very_high: 'МАШ ӨНДӨР ЭРСДЭЛ',
    },
    
    factors: {
      incidentHistory: 'Түүхэн дуудлагын нягтрал',
      populationDensity: 'Хүн ам ба суурьшлын нягтрал',
      stationProximity: 'Гал унтраах ангийн хүрэх зай',
      gerProportion: 'Гэр хорооллын халаалт & зуух',
      roadAccessibility: 'Замын нэвтрэх чадвар',
      seasonalWeather: 'Улирал ба цаг агаарын нөхцөл'
    },
    
    stats: {
      totalIncidentsAnalyzed: 'Нийт шинжилсэн дуудлага',
      districtsCovered: 'Дүүргийн хамрах хүрээ',
      operationalStations: 'Гал унтраах, аврах анги',
      avgRiskScore: 'Нийслэлийн дундаж индекс',
      populationMonitored: 'Шинжилгээнд хамрагдсан хүн ам'
    },
    
    ctaHeadline: 'Улаанбаатарын эрсдэлийг өгөгдлөөр харцгаая.',
    ctaButton: 'ЭРСДЭЛИЙН ГАЗРЫН ЗУРАГ ҮЗЭХ',
    footerDisclaimer: 'Аналитик судалгааны платформ — албан ёсны гамшгийн автомат сэрэмжлүүлгийн систем биш.'
  },
  en: {
    brandName: 'FIREWATCH UB',
    tagline: 'Revealing fire risks before ignition occurs.',
    subtitle: 'Ulaanbaatar Fire-Risk Intelligence, Spatial Mapping, and Public Safety Platform',
    startupLabel: 'START UP · 2026–2027',
    pageIndicator: '01 / 06',
    directionPill: 'FOCUS · Environment · Urban Safety',
    demoMode: 'DEMO MODE · SAMPLE DATA',
    demoNotice: 'This platform operates on prototype models and verified analytical methods. It is an analytical tool, not an official emergency dispatch system.',
    searchPlaceholder: 'Search district, khoroo, fire station...',
    analyzeCurrentArea: 'ANALYZE MY AREA',
    viewRiskMap: 'VIEW RISK MAP',
    problemKicker: 'THE PROBLEM',
    solutionKicker: 'SOLUTION · MVP',
    problemTitle: 'Transitioning from reactive firefighting to predictive spatial prevention',
    problemText: 'Ulaanbaatar faces unique vulnerability vectors: informal ger settlements, harsh winter heating seasons, steep hillside road corridors, aging building wiring, and congested dead-end access routes. When emergency calls arrive, narrow lanes and difficult coordinates often challenge rapid arrival.',
    solution1Title: 'Proactive Fire-Risk Monitoring',
    solution1Desc: 'Enables preventive municipal planning and targeted localized warnings before emergencies escalate.',
    solution2Title: 'Data-Driven Risk Modeling',
    solution2Desc: 'Synthesizes population density, heating methods, incident records, and road accessibility into unified metrics.',
    solution3Title: 'District-Tailored Guidance',
    solution3Desc: 'Delivers actionable, pragmatic precautions matched directly to specific urban topography.',
    solution4Title: 'Transparent Public Safety Data',
    solution4Desc: 'Provides accessible, verified instructional protocols for households, schools, and dormitories.',
    
    phoneBadgeWeek: 'Current Weekly Risk',
    phoneRiskHigh: 'HIGH RISK',
    phoneCalendarTitle: 'Annual Risk Calendar',
    phoneStepsTitle: '3 Preventive Steps',
    phoneStep1: 'Clean flue pipe & inspect collar collar',
    phoneStep2: 'Unload overloaded power socket strips',
    phoneStep3: 'Deposit hot ash only in sealed metal bins',

    navOverview: 'Overview',
    navMap: 'Risk Map',
    navExplorer: 'Risk Simulator',
    navDistricts: 'District Analysis',
    navIncidents: 'Historical Incidents',
    navEmergency: 'Fire Stations',
    navCalendar: '12-Month Calendar',
    navWeather: 'Weather & Climate',
    navSafety: 'Safety Center',
    navReports: 'Report Center',
    navSources: 'Data Sources',
    
    publicMode: 'Public View',
    proMode: 'Professional View',
    
    areaTitle: 'AREA',
    riskIndicatorTitle: 'ANALYTICAL RISK INDICATOR',
    whyThisArea: 'WHY THIS AREA?',
    contributionsExplain: 'Breakdown of normalized multi-variable model weights',
    
    riskLevels: {
      low: 'LOW RISK',
      moderate: 'MODERATE RISK',
      high: 'HIGH RISK',
      very_high: 'VERY HIGH RISK',
    },
    
    factors: {
      incidentHistory: 'Historical Incident Density',
      populationDensity: 'Population & Density',
      stationProximity: 'Fire Station Distance',
      gerProportion: 'Ger Ratio & Stove Heating',
      roadAccessibility: 'Road Accessibility',
      seasonalWeather: 'Season & Weather Factors'
    },
    
    stats: {
      totalIncidentsAnalyzed: 'Incidents Analyzed',
      districtsCovered: 'Districts Covered',
      operationalStations: 'Fire & Rescue Stations',
      avgRiskScore: 'Capital Average Index',
      populationMonitored: 'Monitored Population'
    },
    
    ctaHeadline: 'Explore Ulaanbaatar fire risks through open data.',
    ctaButton: 'VIEW INTERACTIVE RISK MAP',
    footerDisclaimer: 'Analytical research platform — not an official emergency warning system.'
  }
};

export function getTranslation(lang: Language) {
  return UI_STRINGS[lang] || UI_STRINGS.mn;
}
