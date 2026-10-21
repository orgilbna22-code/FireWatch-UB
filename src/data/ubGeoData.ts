import { DistrictData, FireStation, IncidentRecord, KhorooData, MonthRiskData, WeatherData } from '../types';
import { UB_KHOROOS_CURATED } from './ubKhorooData';
import { khorooRiskLevel, synthesizeKhoroos } from './ubKhorooGenerated';

// Coordinates for UB center: [47.9184, 106.9177]
export const UB_CENTER_COORDS: [number, number] = [47.9184, 106.9177];

export const UB_DISTRICTS: DistrictData[] = [
  {
    id: 'bayanzurkh',
    nameMn: 'Баянзүрх',
    nameEn: 'Bayanzurkh',
    center: [47.9255, 106.9850],
    polygon: [
      [47.9700, 106.9300],
      [47.9800, 107.0300],
      [47.9400, 107.1200],
      [47.8800, 107.1100],
      [47.8900, 106.9700],
      [47.9300, 106.9400],
      [47.9700, 106.9300]
    ],
    population: 385400,
    areaKm2: 1244,
    gerHouseholdPercent: 58,
    apartmentHouseholdPercent: 42,
    fireStationsCount: 3,
    nearestStationDistKm: 3.4,
    roadAccessibilityGrade: 'C',
    historicalIncidentsCount: 524,
    riskScore: 74,
    riskLevel: 'high',
    trend: 'increasing',
    khoroosCount: 43,
    keyObservationsMn: 'Энэ өгөгдлийн хүрээнд Дари-Эх, Амгалан, Цайз орчмын гэр хорооллын нягтрал, халаалтын улирлын зуухны ачаалал болон нарийн гудамжны нэвтрэх хязгаарлагдмал байдлаас шалтгаалан эрсдэлийн өндөр үзүүлэлт ажиглагдаж байна.',
    keyObservationsEn: 'Elevated risk indicators are observed in Dari-Ekh, Amgalan, and Tsaiz ger sectors due to high density, stove heating during cold seasons, and narrow alley access constraints.',
    contributions: [
      { id: '1', nameMn: 'Түүхэн дуудлагын нягтрал', nameEn: 'Incident History', weight: 30, score: 78, contributionValue: 23.4, impact: 'high', descriptionMn: 'Сүүлийн жилүүдэд гэр болон амины орон сууцны галын дуудлага өндөр давтамжтай бүртгэгдсэн.', descriptionEn: 'Consistently high historical incident records in ger areas.' },
      { id: '2', nameMn: 'Гэр хорооллын халаалт', nameEn: 'Stove & Solid Fuel Ratio', weight: 15, score: 82, contributionValue: 12.3, impact: 'high', descriptionMn: 'Төвлөрсөн бус хатуу түлшний зуух болон утааны яндангийн гэмтэл.', descriptionEn: 'High ratio of decentralized stoves and chimney overheating risks.' },
      { id: '3', nameMn: 'Хүн амын нягтрал', nameEn: 'Population Density', weight: 20, score: 72, contributionValue: 14.4, impact: 'moderate', descriptionMn: 'Нийслэлийн хамгийн олон хүн амтай дүүрэг.', descriptionEn: 'Highest total district population in Ulaanbaatar.' },
      { id: '4', nameMn: 'Замын нэвтрэх чадвар', nameEn: 'Road Accessibility', weight: 10, score: 68, contributionValue: 6.8, impact: 'moderate', descriptionMn: 'Хашааны нарийн гудамж, уулын бэлийн замын налуу саад учруулдаг.', descriptionEn: 'Narrow alleys and hill-slope approaches hinder heavy apparatus.' },
      { id: '5', nameMn: 'Гал унтраах ангийн зай', nameEn: 'Station Proximity', weight: 15, score: 62, contributionValue: 9.3, impact: 'moderate', descriptionMn: 'Зүүн захад хүрэх зайн саад харьцангуй өндөр.', descriptionEn: 'Peripheral eastern zones face extended transit distance.' },
      { id: '6', nameMn: 'Улирлын хүчин зүйл', nameEn: 'Seasonal Factor', weight: 10, score: 78, contributionValue: 7.8, impact: 'high', descriptionMn: 'Хаврын хуурайшилтын салхи ба өвлийн халаалтын оргил үе.', descriptionEn: 'Severe spring winds combined with winter heating peaks.' }
    ]
  },
  {
    id: 'songinokhairkhan',
    nameMn: 'Сонгинохайрхан',
    nameEn: 'Songinokhairkhan',
    center: [47.9350, 106.7900],
    polygon: [
      [48.0100, 106.6800],
      [48.0300, 106.8200],
      [47.9600, 106.8800],
      [47.8800, 106.8100],
      [47.8700, 106.6900],
      [47.9400, 106.6600],
      [48.0100, 106.6800]
    ],
    population: 341800,
    areaKm2: 1200,
    gerHouseholdPercent: 64,
    apartmentHouseholdPercent: 36,
    fireStationsCount: 3,
    nearestStationDistKm: 3.8,
    roadAccessibilityGrade: 'D',
    historicalIncidentsCount: 489,
    riskScore: 78,
    riskLevel: 'very_high',
    trend: 'increasing',
    khoroosCount: 43,
    keyObservationsMn: 'Толгойт, Баянхошуу, Баянхайрхан орчмын уулын бэл, өндөржилт ихтэй нарийн мухар гудамж, гэр хорооллын өндөр нягтрал зэргээс шалтгаалан тус дүүрэгт эрсдэлийн индекс маш өндөр түвшинд тооцогдож байна.',
    keyObservationsEn: 'Tolgoit and Bayankhoshuu hillside sectors display very high risk indicators driven by steep terrain, dead-end alleys, and intensive solid-fuel heating.',
    contributions: [
      { id: '1', nameMn: 'Түүхэн дуудлагын нягтрал', nameEn: 'Incident History', weight: 30, score: 84, contributionValue: 25.2, impact: 'high', descriptionMn: 'Хашаа, амбаар, гэрийн гал түймрийн дуудлагын давтамж хамгийн өндөр бүсүүдийн нэг.', descriptionEn: 'One of the highest frequencies of fence and dwelling fires.' },
      { id: '2', nameMn: 'Замын нэвтрэх чадвар', nameEn: 'Road Accessibility', weight: 10, score: 85, contributionValue: 8.5, impact: 'high', descriptionMn: 'Уулын налуу болон өвлийн халтиргаатай замууд тусламж хүрэхэд хүндрэл үүсгэдэг.', descriptionEn: 'Steep grades and icy alleys severely obstruct rescue units.' },
      { id: '3', nameMn: 'Гэр хорооллын халаалт', nameEn: 'Stove & Solid Fuel Ratio', weight: 15, score: 88, contributionValue: 13.2, impact: 'high', descriptionMn: 'Өрхийн 64%-д уламжлалт зуух, сайжруулсан түлшний хэрэглээ зонхилдог.', descriptionEn: '64% of households rely on individual heating stoves.' },
      { id: '4', nameMn: 'Гал унтраах ангийн зай', nameEn: 'Station Proximity', weight: 15, score: 70, contributionValue: 10.5, impact: 'moderate', descriptionMn: 'Алслагдсан хороод руу хүрэх зай хол.', descriptionEn: 'Significant transit distances to northwestern peripheral khoroos.' },
      { id: '5', nameMn: 'Хүн амын нягтрал', nameEn: 'Population Density', weight: 20, score: 68, contributionValue: 13.6, impact: 'moderate', descriptionMn: 'Хойд болон баруун бүсэд хүн ам шигүү суурьшсан.', descriptionEn: 'Concentrated population clusters along northern hillsides.' },
      { id: '6', nameMn: 'Улирлын хүчин зүйл', nameEn: 'Seasonal Factor', weight: 10, score: 70, contributionValue: 7.0, impact: 'moderate', descriptionMn: 'Салхины баруун хойд урсгалын нөлөөлөл ихтэй.', descriptionEn: 'Subject to predominant northwesterly wind corridors.' }
    ]
  },
  {
    id: 'sukhbaatar',
    nameMn: 'Сүхбаатар',
    nameEn: 'Sukhbaatar',
    center: [47.9550, 106.9200],
    polygon: [
      [48.0400, 106.8800],
      [48.0500, 106.9600],
      [47.9800, 106.9600],
      [47.9150, 106.9400],
      [47.9150, 106.9000],
      [47.9700, 106.8900],
      [48.0400, 106.8800]
    ],
    population: 145200,
    areaKm2: 208,
    gerHouseholdPercent: 32,
    apartmentHouseholdPercent: 68,
    fireStationsCount: 2,
    nearestStationDistKm: 2.1,
    roadAccessibilityGrade: 'B',
    historicalIncidentsCount: 218,
    riskScore: 52,
    riskLevel: 'moderate',
    trend: 'stable',
    khoroosCount: 20,
    keyObservationsMn: 'Хотын төвийн бүсэд инженерийн дэд бүтэц сайн боловч хойд хэсгийн (Бэлх, Сэлх, 7 буудал) зуслан болон гэр хороололд хавар, өвлийн улиралд дуудлага өсөх хандлага ажиглагддаг.',
    keyObservationsEn: 'Central sections have modern municipal infrastructure, but northern peripheral settlements (Belkh, Selkh, 7-buudal) experience seasonal spring and winter peaks.',
    contributions: [
      { id: '1', nameMn: 'Түүхэн дуудлагын нягтрал', nameEn: 'Incident History', weight: 30, score: 48, contributionValue: 14.4, impact: 'moderate', descriptionMn: 'Төв хэсэгт бага, хойд хэсэгт дунд түвшний давтамжтай.', descriptionEn: 'Low incident frequency in center, moderate in northern khoroos.' },
      { id: '2', nameMn: 'Дэд бүтэц ба станцын ойролцоо байдал', nameEn: 'Station Proximity', weight: 15, score: 35, contributionValue: 5.25, impact: 'low', descriptionMn: 'Гал түймэр унтраах ангиудын хүрэх хугацаа төвийн хороодод харьцангуй бага.', descriptionEn: 'Short response transit times in downtown core.' },
      { id: '3', nameMn: 'Орон сууцны цахилгааны ачаалал', nameEn: 'Electrical Load', weight: 20, score: 62, contributionValue: 12.4, impact: 'moderate', descriptionMn: 'Хуучны орон сууцны цахилгаан утасны элэгдэл, шинэ барилгын ачаалал.', descriptionEn: 'Aging electrical wiring in Soviet-era blocks.' },
      { id: '4', nameMn: 'Замын нэвтрэх чадвар', nameEn: 'Road Accessibility', weight: 10, score: 45, contributionValue: 4.5, impact: 'moderate', descriptionMn: 'Төвийн бүсэд авто замын түгжрэл гол саад болдог.', descriptionEn: 'Severe central traffic congestion creates peak-hour delays.' },
      { id: '5', nameMn: 'Гэр хорооллын халаалт', nameEn: 'Stove & Solid Fuel Ratio', weight: 15, score: 50, contributionValue: 7.5, impact: 'moderate', descriptionMn: 'Хойд бүсийн хороодын зуухны ашиглалт.', descriptionEn: 'Seasonal wood/coal stove usage in northern valleys.' },
      { id: '6', nameMn: 'Ойн ойролцоо бүс', nameEn: 'Forest Boundary Risk', weight: 10, score: 80, contributionValue: 8.0, impact: 'high', descriptionMn: 'Хаврын хуурайшилтын үед ногоон бүс рүү гал тархах эрсдэл.', descriptionEn: 'Proximity to northern green belt increases spring wildfire exposure.' }
    ]
  },
  {
    id: 'chingeltei',
    nameMn: 'Чингэлтэй',
    nameEn: 'Chingeltei',
    center: [47.9620, 106.8950],
    polygon: [
      [48.0600, 106.8600],
      [48.0500, 106.9200],
      [47.9500, 106.9150],
      [47.9150, 106.8950],
      [47.9250, 106.8700],
      [48.0000, 106.8500],
      [48.0600, 106.8600]
    ],
    population: 140600,
    areaKm2: 89,
    gerHouseholdPercent: 54,
    apartmentHouseholdPercent: 46,
    fireStationsCount: 1,
    nearestStationDistKm: 2.9,
    roadAccessibilityGrade: 'D',
    historicalIncidentsCount: 310,
    riskScore: 71,
    riskLevel: 'high',
    trend: 'stable',
    khoroosCount: 24,
    keyObservationsMn: 'Дэнжийн 1000, 17-р хороо орчмын өндөр налуу бүс, барилга байгууламжийн ойр зай, хашааны шугуй гудамж нь гал унтраах автомашин шуурхай нэвтрэхэд ихээхэн саад болж байна.',
    keyObservationsEn: 'Steep elevations around Denjiin 1000 and 17th khoroo, dense wooden fences, and severe alley gradients impose heavy physical access constraints.',
    contributions: [
      { id: '1', nameMn: 'Замын нэвтрэх чадвар', nameEn: 'Road Accessibility', weight: 10, score: 88, contributionValue: 8.8, impact: 'high', descriptionMn: 'Эгц өгсүүр, цастайд гулгаа үүсдэг мухар гудамжууд.', descriptionEn: 'Extremely steep inclines and narrow impassable alleyways.' },
      { id: '2', nameMn: 'Түүхэн дуудлагын нягтрал', nameEn: 'Incident History', weight: 30, score: 74, contributionValue: 22.2, impact: 'high', descriptionMn: 'Өвлийн улиралд зуух, цахилгааны дуудлагын өндөр төвлөрөл.', descriptionEn: 'High winter incidence of stove flare-ups and electrical shorting.' },
      { id: '3', nameMn: 'Гэр хорооллын халаалт', nameEn: 'Stove & Solid Fuel Ratio', weight: 15, score: 76, contributionValue: 11.4, impact: 'high', descriptionMn: 'Хатуу түлшний зуух, үнс нурмаа ил задгай хаях тохиолдол.', descriptionEn: 'Unprotected hot ash disposal in wooden perimeter bins.' },
      { id: '4', nameMn: 'Гал унтраах ангийн зай', nameEn: 'Station Proximity', weight: 15, score: 65, contributionValue: 9.75, impact: 'moderate', descriptionMn: 'Дүүргийн нутаг дэвсгэрт ганцхан гал унтраах анги байрладаг.', descriptionEn: 'Single active station covering topographically difficult khoroos.' },
      { id: '5', nameMn: 'Хүн амын нягтрал', nameEn: 'Population Density', weight: 20, score: 70, contributionValue: 14.0, impact: 'moderate', descriptionMn: 'Бага газар нутагт хүн амын төвлөрөл ихтэй.', descriptionEn: 'Compact land area with intense residential cluster density.' },
      { id: '6', nameMn: 'Улирлын хүчин зүйл', nameEn: 'Seasonal Factor', weight: 10, score: 48, contributionValue: 4.8, impact: 'low', descriptionMn: 'Өвлийн улиралд температурын огцом бууралтаар ачаалал нэмэгддэг.', descriptionEn: 'Sharp temperature drops trigger peak heating output.' }
    ]
  },
  {
    id: 'khan-uul',
    nameMn: 'Хан-Уул',
    nameEn: 'Khan-Uul',
    center: [47.8800, 106.8850],
    polygon: [
      [47.9100, 106.8400],
      [47.9100, 106.9400],
      [47.8400, 106.9700],
      [47.7800, 106.8700],
      [47.8100, 106.7500],
      [47.8800, 106.7600],
      [47.9100, 106.8400]
    ],
    population: 252100,
    areaKm2: 484,
    gerHouseholdPercent: 24,
    apartmentHouseholdPercent: 76,
    fireStationsCount: 3,
    nearestStationDistKm: 2.7,
    roadAccessibilityGrade: 'A',
    historicalIncidentsCount: 246,
    riskScore: 44,
    riskLevel: 'moderate',
    trend: 'decreasing',
    khoroosCount: 25,
    keyObservationsMn: 'Шинэ орон сууцны хотхонууд олноор баригдаж, замын сүлжээ болон дэд бүтэц сайн хөгжсөн ч Яармаг, Нисэх орчмын барилгажилт, үйлдвэрлэлийн бүс болон Туул голын зэгс шатах эрсдэл бий.',
    keyObservationsEn: 'Modern residential planning and wide road arteries minimize transit impedance, though reed grass along Tuul River and construction zones pose targeted hazards.',
    contributions: [
      { id: '1', nameMn: 'Түүхэн дуудлагын нягтрал', nameEn: 'Incident History', weight: 30, score: 42, contributionValue: 12.6, impact: 'moderate', descriptionMn: 'Орон сууцны цахилгаан ба Туул голын эргийн өвс шатсан дуудлагууд.', descriptionEn: 'Primarily grass fires near river basin and building electrical faults.' },
      { id: '2', nameMn: 'Гал унтраах ангийн зай', nameEn: 'Station Proximity', weight: 15, score: 32, contributionValue: 4.8, impact: 'low', descriptionMn: 'Шинээр ашиглалтад орсон ангиудын байршил оновчтой.', descriptionEn: 'Well-distributed emergency coverage along Yarmag-Nisekh corridor.' },
      { id: '3', nameMn: 'Замын нэвтрэх чадвар', nameEn: 'Road Accessibility', weight: 10, score: 30, contributionValue: 3.0, impact: 'low', descriptionMn: 'Өргөн өргөн чөлөө, хотхоны дотоод замууд харьцангуй сайн.', descriptionEn: 'Modern multi-lane avenues and organized subdivision roading.' },
      { id: '4', nameMn: 'Гэр хорооллын халаалт', nameEn: 'Stove & Solid Fuel Ratio', weight: 15, score: 38, contributionValue: 5.7, impact: 'low', descriptionMn: 'Дүүргийн нийт өрхийн дийлэнх нь төвийн шугамд холбогдсон.', descriptionEn: 'Over 75% connected to municipal central district heating.' },
      { id: '5', nameMn: 'Хүн амын нягтрал', nameEn: 'Population Density', weight: 20, score: 62, contributionValue: 12.4, impact: 'moderate', descriptionMn: 'Хурдацтай өсөн нэмэгдэж буй суурьшил.', descriptionEn: 'Fastest growing residential density in southern metropolitan zone.' },
      { id: '6', nameMn: 'Улирлын хүчин зүйл', nameEn: 'Seasonal Factor', weight: 10, score: 55, contributionValue: 5.5, impact: 'moderate', descriptionMn: 'Хаврын хуурай өвс, Туул голын сав газрын салхи.', descriptionEn: 'Spring riparian dried reed combustible material.' }
    ]
  },
  {
    id: 'bayangol',
    nameMn: 'Баянгол',
    nameEn: 'Bayangol',
    center: [47.9150, 106.8750],
    polygon: [
      [47.9350, 106.8500],
      [47.9350, 106.9050],
      [47.9000, 106.9050],
      [47.8900, 106.8650],
      [47.9100, 106.8400],
      [47.9350, 106.8500]
    ],
    population: 236400,
    areaKm2: 29.5,
    gerHouseholdPercent: 18,
    apartmentHouseholdPercent: 82,
    fireStationsCount: 1,
    nearestStationDistKm: 1.8,
    roadAccessibilityGrade: 'B',
    historicalIncidentsCount: 204,
    riskScore: 48,
    riskLevel: 'moderate',
    trend: 'stable',
    khoroosCount: 34,
    keyObservationsMn: 'Нийслэлийн хамгийн их нягтаршилтай орон сууцны дүүрэг. Хуучин 5 давхар угсармал байрнуудын цахилгааны утасны ачаалал, зогсоолын машин замын түгжрэл гол эрсдэлт хүчин зүйл болж байна.',
    keyObservationsEn: 'Densely populated residential core dominated by apartments. Overloaded electrical conduits in older blocks and parking congestion impeding emergency lanes are key factors.',
    contributions: [
      { id: '1', nameMn: 'Хүн ам ба орон сууцны нягтрал', nameEn: 'Population Density', weight: 20, score: 75, contributionValue: 15.0, impact: 'high', descriptionMn: '1 кв.км-т ноогдох хүн ам өндөр, нягт орон сууцны хороолол.', descriptionEn: 'High residential density in multi-storey Soviet and modern blocks.' },
      { id: '2', nameMn: 'Цахилгаан утасны хуучралт ба ачаалал', nameEn: 'Electrical Load', weight: 20, score: 65, contributionValue: 13.0, impact: 'high', descriptionMn: 'Хуучин орон сууцны дотоод цахилгааны кабель элэгдэл, олон цахилгаан хэрэгслийн зэрэг ачаалал.', descriptionEn: 'Aging electrical wiring conduits in older 5-story blocks.' },
      { id: '3', nameMn: 'Түүхэн дуудлагын давтамж', nameEn: 'Incident History', weight: 30, score: 38, contributionValue: 11.4, impact: 'moderate', descriptionMn: 'Орон сууцны хогийн суваг, подвал, тагтны жижиг галын дуудлага бүртгэгдсэн.', descriptionEn: 'Trash chute, basement, and balcony localized flare-ups.' },
      { id: '4', nameMn: 'Замын нэвтрэх чадвар & Зогсоол', nameEn: 'Road Accessibility', weight: 10, score: 45, contributionValue: 4.5, impact: 'moderate', descriptionMn: 'Байрнуудын дундах авто машины замбараагүй зогсоол галын автомеханик шат ороход саад учруулдаг.', descriptionEn: 'Courtyard parking congestion obstructing heavy aerial ladder apparatus.' },
      { id: '5', nameMn: 'Гал унтраах ангийн хүрэх зай', nameEn: 'Station Proximity', weight: 10, score: 25, contributionValue: 2.5, impact: 'low', descriptionMn: 'Хотын төвд байрладаг тул гал унтраах ангиас шуурхай очих боломжтой.', descriptionEn: 'Central proximity allows fast station response times.' },
      { id: '6', nameMn: 'Гэр хорооллын халаалт', nameEn: 'Stove & Solid Fuel Ratio', weight: 10, score: 16, contributionValue: 1.6, impact: 'low', descriptionMn: 'Гэр хорооллын өрх цөөн (18%), 82% нь төвлөрсөн дулаанд холбогдсон.', descriptionEn: 'Low ger proportion (18%), majority on district heating.' }
    ]
  },
  {
    id: 'nalaikh',
    nameMn: 'Налайх',
    nameEn: 'Nalaikh',
    center: [47.7700, 107.2800],
    polygon: [
      [47.8300, 107.2000],
      [47.8400, 107.3600],
      [47.7300, 107.3800],
      [47.7100, 107.2300],
      [47.7800, 107.1800],
      [47.8300, 107.2000]
    ],
    population: 39500,
    areaKm2: 687,
    gerHouseholdPercent: 62,
    apartmentHouseholdPercent: 38,
    fireStationsCount: 1,
    nearestStationDistKm: 4.8,
    roadAccessibilityGrade: 'C',
    historicalIncidentsCount: 88,
    riskScore: 56,
    riskLevel: 'high',
    trend: 'stable',
    khoroosCount: 8,
    keyObservationsMn: 'Улаанбаатар хотын зүүн урд дагуул дүүрэг. Хуучин уурхайн орчин, хатуу түлшний зуух болон задгай салхины коридор ихтэйгээс хаврын хуурайшилттай үед шар өвс, хашааны гал тархах эрсдэлтэй.',
    keyObservationsEn: 'Satellite district southeast of UB. Open wind plain corridors, coal heating, and spring dry brush generate episodic high-risk conditions.',
    contributions: [
      { id: '1', nameMn: 'Түүхэн дуудлагын нягтрал', nameEn: 'Incident History', weight: 30, score: 44, contributionValue: 13.2, impact: 'moderate', descriptionMn: 'Нийт дуудлагын тоо төвийн дүүргүүдээс цөөн боловч талбай ихтэй.', descriptionEn: 'Fewer total events, but large response territories.' },
      { id: '2', nameMn: 'Гэр хорооллын халаалт', nameEn: 'Stove & Solid Fuel Ratio', weight: 15, score: 76, contributionValue: 11.4, impact: 'high', descriptionMn: 'Зуухны ашиглалт, нүүрсний хэрэглээ өндөр (62% өрх).', descriptionEn: 'Extensive coal-fired stove heating.' },
      { id: '3', nameMn: 'Гал унтраах ангийн зай', nameEn: 'Station Proximity', weight: 15, score: 72, contributionValue: 10.8, impact: 'high', descriptionMn: 'Алслагдсан хороо, шинэ суурьшлын бүс хүртэлх зам 4.8+ км хол.', descriptionEn: 'Distance to dispersed settlements outside town center.' },
      { id: '4', nameMn: 'Улирлын салхи ба хуурайшилт', nameEn: 'Seasonal Factor', weight: 10, score: 82, contributionValue: 8.2, impact: 'high', descriptionMn: 'Нээлттэй тал хөндийн хүчтэй салхи галыг хурдан дэгдээдэг.', descriptionEn: 'High valley wind velocities accelerate fire spread.' },
      { id: '5', nameMn: 'Хүн амын нягтрал', nameEn: 'Population Density', weight: 20, score: 33, contributionValue: 6.6, impact: 'low', descriptionMn: 'Тархай суурьшилтай.', descriptionEn: 'Dispersed low-density settlement.' },
      { id: '6', nameMn: 'Замын нэвтрэх чадвар', nameEn: 'Road Accessibility', weight: 10, score: 58, contributionValue: 5.8, impact: 'moderate', descriptionMn: 'Шороон замууд цас, шавартай үед саад болдог.', descriptionEn: 'Unpaved local access roads compromised by seasonal mud and snow.' }
    ]
  },
  {
    id: 'baganuur',
    nameMn: 'Багануур',
    nameEn: 'Baganuur',
    center: [47.7800, 108.3600],
    polygon: [
      [47.8200, 108.3100],
      [47.8300, 108.4200],
      [47.7400, 108.4300],
      [47.7300, 108.3200],
      [47.8200, 108.3100]
    ],
    population: 29800,
    areaKm2: 620,
    gerHouseholdPercent: 48,
    apartmentHouseholdPercent: 52,
    fireStationsCount: 1,
    nearestStationDistKm: 3.2,
    roadAccessibilityGrade: 'B',
    historicalIncidentsCount: 42,
    riskScore: 38,
    riskLevel: 'moderate',
    trend: 'stable',
    khoroosCount: 5,
    keyObservationsMn: 'Нүүрсний ил уурхай ба аж үйлдвэрийн бүс байрладаг тусгай суурин. Төлөвлөлт цэгцтэй тул хотын төвтэй харьцуулахад замын нэвтрэлт сайн, эрсдэлийн ерөнхий үзүүлэлт тогтвортой.',
    keyObservationsEn: 'Planned industrial mining district. Structured Soviet urban grid provides good vehicular access, maintaining moderate risk levels.',
    contributions: [
      { id: '1', nameMn: 'Аж үйлдвэрийн бүс ба дэд бүтэц', nameEn: 'Industrial Proximity', weight: 20, score: 50, contributionValue: 10.0, impact: 'moderate', descriptionMn: 'Уурхай ба эрчим хүчний дэд бүтцийн эрсдэлийн тандалт.', descriptionEn: 'Coal mine perimeter and electrical transformer substations.' },
      { id: '2', nameMn: 'Гэр хорооллын халаалт', nameEn: 'Stove & Solid Fuel Ratio', weight: 15, score: 52, contributionValue: 7.8, impact: 'moderate', descriptionMn: 'Гэр хорооллын бүсэд зуухны ашиглалт зонхилно.', descriptionEn: 'Heating stove reliance in surrounding ger sectors.' },
      { id: '3', nameMn: 'Түүхэн дуудлагын нягтрал', nameEn: 'Incident History', weight: 30, score: 24, contributionValue: 7.2, impact: 'low', descriptionMn: 'Жилд дунджаар 20-30 дуудлага бүртгэгддэг.', descriptionEn: 'Low overall incident count due to smaller population.' },
      { id: '4', nameMn: 'Гал унтраах ангийн хүрэх зай', nameEn: 'Station Proximity', weight: 15, score: 36, contributionValue: 5.4, impact: 'low', descriptionMn: 'Төвлөрсөн ангиас төв хороод руу хүрэх хугацаа богино.', descriptionEn: 'Centralized fire department provides swift urban response.' },
      { id: '5', nameMn: 'Улирлын салхи ба хуурайшилт', nameEn: 'Seasonal Factor', weight: 10, score: 40, contributionValue: 4.0, impact: 'low', descriptionMn: 'Тал хээрийн салхины улирлын нөлөө.', descriptionEn: 'Moderate seasonal steppe wind effects.' },
      { id: '6', nameMn: 'Замын нэвтрэх чадвар', nameEn: 'Road Accessibility', weight: 10, score: 36, contributionValue: 3.6, impact: 'low', descriptionMn: 'Өргөн төлөвлөгдсөн гудамжууд.', descriptionEn: 'Broad wide streets facilitate emergency vehicle flow.' }
    ]
  },
  {
    id: 'bagakhangai',
    nameMn: 'Багахангай',
    nameEn: 'Bagakhangai',
    center: [47.3300, 107.4800],
    polygon: [
      [47.3600, 107.4200],
      [47.3700, 107.5400],
      [47.3000, 107.5500],
      [47.2900, 107.4400],
      [47.3600, 107.4200]
    ],
    population: 4600,
    areaKm2: 140,
    gerHouseholdPercent: 52,
    apartmentHouseholdPercent: 48,
    fireStationsCount: 1,
    nearestStationDistKm: 2.4,
    roadAccessibilityGrade: 'A',
    historicalIncidentsCount: 16,
    riskScore: 28,
    riskLevel: 'low',
    trend: 'stable',
    khoroosCount: 2,
    keyObservationsMn: 'Төмөр замын зангилаа, цөөн хүн амтай суурин. Дуудлагын давтамж хамгийн бага бөгөөд орон зайн эрсдэлийн индекс бага түвшинд тооцогдож байна.',
    keyObservationsEn: 'Railway junction municipality with small population footprint. Lowest incident frequency in capital area, yielding low baseline risk indicators.',
    contributions: [
      { id: '1', nameMn: 'Түүхэн дуудлагын нягтрал', nameEn: 'Incident History', weight: 30, score: 18, contributionValue: 5.4, impact: 'low', descriptionMn: 'Жилд цөөн тооны жижиг дуудлага бүртгэгддэг.', descriptionEn: 'Very few reported events per calendar year.' },
      { id: '2', nameMn: 'Гал унтраах ангийн зай', nameEn: 'Station Proximity', weight: 15, score: 30, contributionValue: 4.5, impact: 'low', descriptionMn: 'Суурин нягт тул ангиас шуурхай очих боломжтой.', descriptionEn: 'Compact footprint allows fast unit deployment.' },
      { id: '3', nameMn: 'Хүн амын нягтрал', nameEn: 'Population Density', weight: 20, score: 15, contributionValue: 3.0, impact: 'low', descriptionMn: 'Хүн ам бага.', descriptionEn: 'Very low population count.' },
      { id: '4', nameMn: 'Замын нэвтрэх чадвар', nameEn: 'Road Accessibility', weight: 10, score: 25, contributionValue: 2.5, impact: 'low', descriptionMn: 'Тэгш газарзүйтэй, зам саадгүй.', descriptionEn: 'Flat topography without steep hillside barriers.' },
      { id: '5', nameMn: 'Гэр хорооллын халаалт', nameEn: 'Stove & Solid Fuel Ratio', weight: 15, score: 52, contributionValue: 7.8, impact: 'moderate', descriptionMn: 'Зуухны ашиглалт.', descriptionEn: 'Stove heating in detached residences.' },
      { id: '6', nameMn: 'Улирлын хүчин зүйл', nameEn: 'Seasonal Factor', weight: 10, score: 48, contributionValue: 4.8, impact: 'low', descriptionMn: 'Хээрийн салхи.', descriptionEn: 'Open steppe winds.' }
    ]
  }
];

// ============================================================
// Full 204-khoroo registry: curated sample + deterministic modelled units.
// Every khoroo's riskLevel is derived from its own score so the two never disagree.
// ============================================================
const UB_KHOROOS_BY_DISTRICT = new Map<string, KhorooData[]>();

UB_DISTRICTS.forEach((d) => {
  const curated = UB_KHOROOS_CURATED.filter((k) => k.districtId === d.id).map((k) => ({ ...k }));
  const all: KhorooData[] = [...curated, ...synthesizeKhoroos(d, curated)].sort(
    (a, b) => a.khorooNumber - b.khorooNumber
  );

  // Anchor khoroo scores to the district's own multi-factor score so the map,
  // the list and the district page never quote two different numbers for the
  // same ground truth. Relative ordering inside the district is preserved.
  const totalPeople = all.reduce((s, k) => s + k.population, 0) || 1;
  const weightedMean = all.reduce((s, k) => s + k.riskScore * k.population, 0) / totalPeople;
  const drift = d.riskScore - weightedMean;
  if (Math.abs(drift) > 2) {
    all.forEach((k) => {
      k.riskScore = Math.max(8, Math.min(97, Math.round(d.riskScore + (k.riskScore - weightedMean) * 0.85)));
      k.riskLevel = khorooRiskLevel(k.riskScore);
    });
  } else {
    all.forEach((k) => {
      k.riskLevel = khorooRiskLevel(k.riskScore);
    });
  }

  // Distribute the district's recorded incident total across its khoroos with
  // largest-remainder apportionment, so the street-level list sums to exactly
  // the number the district page quotes (plain Math.round drifts by ±a few).
  const incidentSum = all.reduce((s, k) => s + k.historicalIncidents2024_2026, 0);
  if (incidentSum > 0 && d.historicalIncidentsCount > 0) {
    const exact = all.map(
      (k) => (k.historicalIncidents2024_2026 / incidentSum) * d.historicalIncidentsCount
    );
    const allocated = exact.map((v) => Math.floor(v));
    let leftover = d.historicalIncidentsCount - allocated.reduce((s, v) => s + v, 0);
    const byFraction = exact
      .map((v, i) => ({ i, frac: v - Math.floor(v) }))
      .sort((a, b) => b.frac - a.frac);
    for (let j = 0; leftover > 0; j += 1) {
      allocated[byFraction[j % byFraction.length].i] += 1;
      leftover -= 1;
    }
    all.forEach((k, i) => {
      k.historicalIncidents2024_2026 = allocated[i];
    });
  } else {
    all.forEach((k) => {
      k.historicalIncidents2024_2026 = 0;
    });
  }

  UB_KHOROOS_BY_DISTRICT.set(d.id, all);
});

export const UB_KHOROOS: KhorooData[] = UB_DISTRICTS.flatMap(
  (d) => UB_KHOROOS_BY_DISTRICT.get(d.id) ?? []
);

export const getKhoroosByDistrict = (districtId: string): KhorooData[] =>
  UB_KHOROOS_BY_DISTRICT.get(districtId) ?? [];

export const MODELLED_KHOROO_COUNT = UB_KHOROOS.filter((k) => k.isModelled).length;

// Populate khoroos & real-world photos for each district
UB_DISTRICTS.forEach((d) => {
  d.khoroos = getKhoroosByDistrict(d.id);
  d.khoroosCount = d.khoroos.length;
  const photoMap: Record<string, { real: string; sat: string }> = {
    'bayanzurkh': {
      real: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80',
      sat: 'https://images.unsplash.com/photo-1524813686514-a57563d77d4f?auto=format&fit=crop&w=1200&q=80'
    },
    'songinokhairkhan': {
      real: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
      sat: 'https://images.unsplash.com/photo-1524813686514-a57563d77d4f?auto=format&fit=crop&w=1200&q=80'
    },
    'sukhbaatar': {
      real: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      sat: 'https://images.unsplash.com/photo-1524813686514-a57563d77d4f?auto=format&fit=crop&w=1200&q=80'
    },
    'chingeltei': {
      real: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
      sat: 'https://images.unsplash.com/photo-1524813686514-a57563d77d4f?auto=format&fit=crop&w=1200&q=80'
    },
    'khan-uul': {
      real: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      sat: 'https://images.unsplash.com/photo-1524813686514-a57563d77d4f?auto=format&fit=crop&w=1200&q=80'
    },
    'bayangol': {
      real: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      sat: 'https://images.unsplash.com/photo-1524813686514-a57563d77d4f?auto=format&fit=crop&w=1200&q=80'
    },
    'nalaikh': {
      real: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
      sat: 'https://images.unsplash.com/photo-1524813686514-a57563d77d4f?auto=format&fit=crop&w=1200&q=80'
    },
    'baganuur': {
      real: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      sat: 'https://images.unsplash.com/photo-1524813686514-a57563d77d4f?auto=format&fit=crop&w=1200&q=80'
    },
    'bagakhangai': {
      real: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80',
      sat: 'https://images.unsplash.com/photo-1524813686514-a57563d77d4f?auto=format&fit=crop&w=1200&q=80'
    }
  };
  if (photoMap[d.id]) {
    d.realWorldPhoto = photoMap[d.id].real;
    d.satellitePhoto = photoMap[d.id].sat;
  }
});

export const UB_FIRE_STATIONS: FireStation[] = [
  {
    id: 'sta-10',
    code: '10-р анги',
    nameMn: 'Гал түймэр унтраах, аврах 10-р анги',
    nameEn: 'Fire & Rescue Station No. 10',
    districtId: 'chingeltei',
    addressMn: 'Чингэлтэй дүүрэг, 4-р хороо, Самбуугийн гудамж',
    addressEn: 'Sambuugiin Street, 4th Khoroo, Chingeltei District',
    coordinates: [47.9265, 106.9080],
    vehiclesCount: 6,
    personnelActive: 38,
    coverageRadiusKm: 5.5,
    servingDistrictsMn: ['Чингэлтэй', 'Сүхбаатар', 'Баянгол'],
    servingDistrictsEn: ['Chingeltei', 'Sukhbaatar', 'Bayangol']
  },
  {
    id: 'sta-14',
    code: '14-р анги',
    nameMn: 'Гал түймэр унтраах, аврах 14-р анги',
    nameEn: 'Fire & Rescue Station No. 14',
    districtId: 'khan-uul',
    addressMn: 'Хан-Уул дүүрэг, 3-р хороо, Үйлдвэрийн бүс',
    addressEn: 'Industrial District, 3rd Khoroo, Khan-Uul',
    coordinates: [47.8920, 106.8790],
    vehiclesCount: 7,
    personnelActive: 42,
    coverageRadiusKm: 6.0,
    servingDistrictsMn: ['Хан-Уул', 'Баянгол'],
    servingDistrictsEn: ['Khan-Uul', 'Bayangol']
  },
  {
    id: 'sta-26',
    code: '26-р анги',
    nameMn: 'Гал түймэр унтраах, аврах 26-р анги',
    nameEn: 'Fire & Rescue Station No. 26',
    districtId: 'songinokhairkhan',
    addressMn: 'Сонгинохайрхан дүүрэг, 20-р хороо, Толгойт',
    addressEn: 'Tolgoit, 20th Khoroo, Songinokhairkhan',
    coordinates: [47.9310, 106.7620],
    vehiclesCount: 5,
    personnelActive: 34,
    coverageRadiusKm: 6.5,
    servingDistrictsMn: ['Сонгинохайрхан'],
    servingDistrictsEn: ['Songinokhairkhan']
  },
  {
    id: 'sta-29',
    code: '29-р анги',
    nameMn: 'Гал түймэр унтраах, аврах 29-р анги',
    nameEn: 'Fire & Rescue Station No. 29',
    districtId: 'songinokhairkhan',
    addressMn: 'Сонгинохайрхан дүүрэг, Баянхошууны төв',
    addressEn: 'Bayankhoshuu Center, Songinokhairkhan',
    coordinates: [47.9620, 106.8150],
    vehiclesCount: 5,
    personnelActive: 36,
    coverageRadiusKm: 5.0,
    servingDistrictsMn: ['Сонгинохайрхан', 'Чингэлтэй'],
    servingDistrictsEn: ['Songinokhairkhan', 'Chingeltei']
  },
  {
    id: 'sta-63',
    code: '63-р анги',
    nameMn: 'Гал түймэр унтраах, аврах 63-р анги',
    nameEn: 'Fire & Rescue Station No. 63',
    districtId: 'bayanzurkh',
    addressMn: 'Баянзүрх дүүрэг, 8-р хороо, Улаанхуаран',
    addressEn: 'Ulaankhuaran, 8th Khoroo, Bayanzurkh',
    coordinates: [47.9150, 107.0120],
    vehiclesCount: 6,
    personnelActive: 40,
    coverageRadiusKm: 6.0,
    servingDistrictsMn: ['Баянзүрх'],
    servingDistrictsEn: ['Bayanzurkh']
  },
  {
    id: 'sta-34',
    code: '34-р анги',
    nameMn: 'Гал түймэр унтраах, аврах 34-р анги',
    nameEn: 'Fire & Rescue Station No. 34',
    districtId: 'sukhbaatar',
    addressMn: 'Сүхбаатар дүүрэг, 13-р хороо, 7 буудал',
    addressEn: '7-Buudal, 13th Khoroo, Sukhbaatar',
    coordinates: [47.9730, 106.9180],
    vehiclesCount: 5,
    personnelActive: 35,
    coverageRadiusKm: 5.5,
    servingDistrictsMn: ['Сүхбаатар', 'Чингэлтэй'],
    servingDistrictsEn: ['Sukhbaatar', 'Chingeltei']
  },
  {
    id: 'sta-65',
    code: '65-р анги',
    nameMn: 'Гал түймэр унтраах, аврах 65-р анги',
    nameEn: 'Fire & Rescue Station No. 65',
    districtId: 'khan-uul',
    addressMn: 'Хан-Уул дүүрэг, Яармаг, 4-р хороо',
    addressEn: 'Yarmag Avenue, 4th Khoroo, Khan-Uul',
    coordinates: [47.8820, 106.8450],
    vehiclesCount: 6,
    personnelActive: 38,
    coverageRadiusKm: 6.5,
    servingDistrictsMn: ['Хан-Уул'],
    servingDistrictsEn: ['Khan-Uul']
  },
  {
    id: 'sta-28',
    code: '28-р анги',
    nameMn: 'Гал түймэр унтраах, аврах 28-р анги',
    nameEn: 'Fire & Rescue Station No. 28',
    districtId: 'nalaikh',
    addressMn: 'Налайх дүүрэг, 2-р хороо, Төв зам дагуу',
    addressEn: 'Main Road, 2nd Khoroo, Nalaikh',
    coordinates: [47.7720, 107.2750],
    vehiclesCount: 4,
    personnelActive: 28,
    coverageRadiusKm: 12.0,
    servingDistrictsMn: ['Налайх'],
    servingDistrictsEn: ['Nalaikh']
  },
  {
    id: 'sta-22',
    code: '22-р анги',
    nameMn: 'Гал түймэр унтраах, аврах 22-р анги',
    nameEn: 'Fire & Rescue Station No. 22',
    districtId: 'bayangol',
    addressMn: 'Баянгол дүүрэг, 11-р хороо, Дунд голын дагуу',
    addressEn: 'Dund Gol riverside, 11th Khoroo, Bayangol',
    coordinates: [47.9130, 106.8560],
    vehiclesCount: 5,
    personnelActive: 33,
    coverageRadiusKm: 4.5,
    servingDistrictsMn: ['Баянгол', 'Хан-Уул'],
    servingDistrictsEn: ['Bayangol', 'Khan-Uul']
  },
  {
    id: 'sta-51',
    code: '51-р анги',
    nameMn: 'Гал түймэр унтраах, аврах 51-р анги',
    nameEn: 'Fire & Rescue Station No. 51',
    districtId: 'bayanzurkh',
    addressMn: 'Баянзүрх дүүрэг, 12-р хороо, 95-аас дээш',
    addressEn: 'Above 95th Block, 12th Khoroo, Bayanzurkh',
    coordinates: [47.9380, 106.9650],
    vehiclesCount: 6,
    personnelActive: 41,
    coverageRadiusKm: 6.5,
    servingDistrictsMn: ['Баянзүрх'],
    servingDistrictsEn: ['Bayanzurkh']
  },
  {
    id: 'sta-58',
    code: '58-р анги',
    nameMn: 'Гал түймэр унтраах, аврах 58-р анги',
    nameEn: 'Fire & Rescue Station No. 58',
    districtId: 'bayanzurkh',
    addressMn: 'Баянзүрх дүүрэг, 27-р хороо, Сэвдэний зам дагуу',
    addressEn: 'Sevdeniin Zam, 27th Khoroo, Bayanzurkh',
    coordinates: [47.9100, 107.0350],
    vehiclesCount: 5,
    personnelActive: 36,
    coverageRadiusKm: 7.0,
    servingDistrictsMn: ['Баянзүрх', 'Сонгинохайрхан'],
    servingDistrictsEn: ['Bayanzurkh', 'Songinokhairkhan']
  },
  {
    id: 'sta-24',
    code: '24-р анги',
    nameMn: 'Гал түймэр унтраах, аврах 24-р анги',
    nameEn: 'Fire & Rescue Station No. 24',
    districtId: 'songinokhairkhan',
    addressMn: 'Сонгинохайрхан дүүрэг, 28-р хороо, Амгалан',
    addressEn: 'Amgalan, 28th Khoroo, Songinokhairkhan',
    coordinates: [47.9500, 106.8500],
    vehiclesCount: 5,
    personnelActive: 34,
    coverageRadiusKm: 7.5,
    servingDistrictsMn: ['Сонгинохайрхан', 'Чингэлтэй'],
    servingDistrictsEn: ['Songinokhairkhan', 'Chingeltei']
  },
  {
    id: 'sta-31',
    code: '31-р анги',
    nameMn: 'Гал түймэр унтраах, аврах 31-р анги',
    nameEn: 'Fire & Rescue Station No. 31',
    districtId: 'baganuur',
    addressMn: 'Багануур дүүрэг, 1-р хороо, Уурхайчдын зам',
    addressEn: 'Uurkhachdyn Street, 1st Khoroo, Baganuur',
    coordinates: [47.7830, 108.3520],
    vehiclesCount: 4,
    personnelActive: 26,
    coverageRadiusKm: 14.0,
    servingDistrictsMn: ['Багануур'],
    servingDistrictsEn: ['Baganuur']
  },
  {
    id: 'sta-37',
    code: '37-р анги',
    nameMn: 'Гал түймэр унтраах, аврах 37-р анги',
    nameEn: 'Fire & Rescue Station No. 37',
    districtId: 'bagakhangai',
    addressMn: 'Багахангай дүүрэг, 1-р хороо, Өртөөний зам',
    addressEn: 'Station Road, 1st Khoroo, Bagakhangai',
    coordinates: [47.3330, 107.4840],
    vehiclesCount: 3,
    personnelActive: 21,
    coverageRadiusKm: 12.0,
    servingDistrictsMn: ['Багахангай'],
    servingDistrictsEn: ['Bagakhangai']
  }
];

export const DEMO_HISTORICAL_INCIDENTS: IncidentRecord[] = [
  {
    id: 'INC-2026-041',
    date: '2026-09-18',
    districtId: 'songinokhairkhan',
    districtNameMn: 'Сонгинохайрхан',
    districtNameEn: 'Songinokhairkhan',
    khoroo: 26,
    category: 'residential_ger',
    coordinates: [47.9540, 106.7820],
    severity: 'critical',
    causeGuessMn: 'Зуухны яндангийн халалт, хана шатсан',
    causeGuessEn: 'Chimney flue overheating adjacent to wooden wall',
    estimatedDamageMnt: 18000000,
    isDemo: true
  },
  {
    id: 'INC-2026-039',
    date: '2026-09-12',
    districtId: 'bayanzurkh',
    districtNameMn: 'Баянзүрх',
    districtNameEn: 'Bayanzurkh',
    khoroo: 27,
    category: 'residential_ger',
    coordinates: [47.9380, 107.0120],
    severity: 'moderate',
    causeGuessMn: 'Үнс нурмаа ил задгай модон хашаа руу асгасан',
    causeGuessEn: 'Hot ash dumped beside dry timber perimeter fence',
    estimatedDamageMnt: 8500000,
    isDemo: true
  },
  {
    id: 'INC-2026-035',
    date: '2026-08-28',
    districtId: 'bayangol',
    districtNameMn: 'Баянгол',
    districtNameEn: 'Bayangol',
    khoroo: 18,
    category: 'electrical',
    coordinates: [47.9180, 106.8820],
    severity: 'minor',
    causeGuessMn: 'Цахилгаан хуваарилах самбарын богино холболт',
    causeGuessEn: 'Electrical distribution board phase overload',
    estimatedDamageMnt: 3200000,
    isDemo: true
  },
  {
    id: 'INC-2026-029',
    date: '2026-07-14',
    districtId: 'chingeltei',
    districtNameMn: 'Чингэлтэй',
    districtNameEn: 'Chingeltei',
    khoroo: 17,
    category: 'residential_ger',
    coordinates: [47.9710, 106.8920],
    severity: 'critical',
    causeGuessMn: 'Гэрийн цахилгаан залгуурын хэт ачаалал',
    causeGuessEn: 'Extension lead power overload in traditional dwelling',
    estimatedDamageMnt: 24000000,
    isDemo: true
  },
  {
    id: 'INC-2026-022',
    date: '2026-05-19',
    districtId: 'khan-uul',
    districtNameMn: 'Хан-Уул',
    districtNameEn: 'Khan-Uul',
    khoroo: 12,
    category: 'grass_forest',
    coordinates: [47.8520, 106.8340],
    severity: 'moderate',
    causeGuessMn: 'Шар өвс шатаасны улмаас салхиар тархсан',
    causeGuessEn: 'Open burning of dry grass accelerated by gusts',
    estimatedDamageMnt: 5000000,
    isDemo: true
  },
  {
    id: 'INC-2026-015',
    date: '2026-04-10',
    districtId: 'sukhbaatar',
    districtNameMn: 'Сүхбаатар',
    districtNameEn: 'Sukhbaatar',
    khoroo: 19,
    category: 'grass_forest',
    coordinates: [48.0120, 106.9450],
    severity: 'high' as any,
    causeGuessMn: 'Ойн захын шар өвсний гал салхиар дэгдсэн',
    causeGuessEn: 'Forest perimeter grass fire spread by spring gale',
    estimatedDamageMnt: 12000000,
    isDemo: true
  },
  {
    id: 'INC-2025-188',
    date: '2025-12-24',
    districtId: 'bayanzurkh',
    districtNameMn: 'Баянзүрх',
    districtNameEn: 'Bayanzurkh',
    khoroo: 14,
    category: 'residential_ger',
    coordinates: [47.9290, 106.9890],
    severity: 'critical',
    causeGuessMn: 'Зуухны галлагааны аюулгүй байдал алдагдсан',
    causeGuessEn: 'Stove draft spark igniting nearby felt insulation',
    estimatedDamageMnt: 31000000,
    isDemo: true
  },
  {
    id: 'INC-2025-172',
    date: '2025-11-15',
    districtId: 'songinokhairkhan',
    districtNameMn: 'Сонгинохайрхан',
    districtNameEn: 'Songinokhairkhan',
    khoroo: 31,
    category: 'residential_ger',
    coordinates: [47.9480, 106.7550],
    severity: 'critical',
    causeGuessMn: 'Амины байшингийн дээврийн яндан шатсан',
    causeGuessEn: 'Chimney penetration box insulation failure',
    estimatedDamageMnt: 28000000,
    isDemo: true
  },
  {
    id: 'INC-2025-144',
    date: '2025-10-02',
    districtId: 'chingeltei',
    districtNameMn: 'Чингэлтэй',
    districtNameEn: 'Chingeltei',
    khoroo: 12,
    category: 'commercial',
    coordinates: [47.9420, 106.9030],
    severity: 'moderate',
    causeGuessMn: 'Хүнсний дэлгүүрийн хөргөлтийн цахилгаан богино холболт',
    causeGuessEn: 'Commercial refrigeration electrical short-circuit',
    estimatedDamageMnt: 16500000,
    isDemo: true
  },
  {
    id: 'INC-2025-098',
    date: '2025-06-18',
    districtId: 'nalaikh',
    districtNameMn: 'Налайх',
    districtNameEn: 'Nalaikh',
    khoroo: 3,
    category: 'grass_forest',
    coordinates: [47.7850, 107.2950],
    severity: 'moderate',
    causeGuessMn: 'Хээрийн хуурай өвс шатсан',
    causeGuessEn: 'Dry pasture brush combustion under hot sunshine',
    estimatedDamageMnt: 4200000,
    isDemo: true
  },
  {
    id: 'INC-2024-210',
    date: '2024-12-05',
    districtId: 'songinokhairkhan',
    districtNameMn: 'Сонгинохайрхан',
    districtNameEn: 'Songinokhairkhan',
    khoroo: 8,
    category: 'residential_ger',
    coordinates: [47.9220, 106.8120],
    severity: 'critical',
    causeGuessMn: 'Түлш нэмэх үед оч үсэрч эсгий шатсан',
    causeGuessEn: 'Furnace ember ignition during night refueling',
    estimatedDamageMnt: 21000000,
    isDemo: true
  },
  {
    id: 'INC-2024-150',
    date: '2024-09-19',
    districtId: 'bayanzurkh',
    districtNameMn: 'Баянзүрх',
    districtNameEn: 'Bayanzurkh',
    khoroo: 24,
    category: 'residential_apt',
    coordinates: [47.9120, 107.0320],
    severity: 'minor',
    causeGuessMn: 'Орон сууцны тагтан дээр тамхины ишнээс гал гарсан',
    causeGuessEn: 'Discarded cigarette on apartment exterior balcony',
    estimatedDamageMnt: 1500000,
    isDemo: true
  },
  {
    id: 'INC-2023-195',
    date: '2023-11-28',
    districtId: 'sukhbaatar',
    districtNameMn: 'Сүхбаатар',
    districtNameEn: 'Sukhbaatar',
    khoroo: 16,
    category: 'residential_ger',
    coordinates: [47.9850, 106.9280],
    severity: 'moderate',
    causeGuessMn: 'Хашааны модон байшингийн яндангийн бөглөрөл',
    causeGuessEn: 'Blocked stovepipe backdraught inside detached cabin',
    estimatedDamageMnt: 14000000,
    isDemo: true
  },
  {
    id: 'INC-2022-180',
    date: '2022-12-14',
    districtId: 'chingeltei',
    districtNameMn: 'Чингэлтэй',
    districtNameEn: 'Chingeltei',
    khoroo: 7,
    category: 'residential_ger',
    coordinates: [47.9510, 106.8870],
    severity: 'critical',
    causeGuessMn: 'Шөнийн цагаар зуухны халалтаас үүдэлтэй гал',
    causeGuessEn: 'Nocturnal stove wall radiation ignition',
    estimatedDamageMnt: 29000000,
    isDemo: true
  }
];

// ============================================================
// City-wide statistics derived from the datasets above, so every headline
// number on the site is computed rather than typed in.
// ============================================================
UB_DISTRICTS.forEach((d) => {
  d.fireStationsCount = UB_FIRE_STATIONS.filter((s) => s.districtId === d.id).length;
});

export const TOTAL_KHOROO_COUNT = UB_KHOROOS.length;

export const TOTAL_HISTORICAL_INCIDENTS = UB_DISTRICTS.reduce(
  (s, d) => s + d.historicalIncidentsCount,
  0
);

export const TOTAL_CITY_POPULATION = UB_DISTRICTS.reduce((s, d) => s + d.population, 0);

export const SAMPLE_INCIDENT_COUNT = DEMO_HISTORICAL_INCIDENTS.length;

/** Population-weighted city risk used by the dashboards and the landing page. */
export const CITY_AVERAGE_RISK = Math.round(
  UB_KHOROOS.reduce((s, k) => s + k.riskScore * k.population, 0) /
    (UB_KHOROOS.reduce((s, k) => s + k.population, 0) || 1)
);

export const MONTH_RISK_CALENDAR: MonthRiskData[] = [  {
    month: 1,
    nameMn: '1-р сар',
    nameEn: 'January',
    shortMn: '1-р сар',
    shortEn: 'JAN',
    riskScore: 88,
    riskLevel: 'very_high',
    primaryDriversMn: ['Өвлийн хүйтний оргил (-28°C)', 'Гэр хорооллын зуухны тасралтгүй галлагаа', 'Цахилгаан халаагуурын хэт ачаалал'],
    primaryDriversEn: ['Extreme sub-zero cold (-28°C)', 'Continuous solid fuel stove firing', 'Overloaded electrical heating circuits'],
    historicalAvgIncidents: 215,
    avgTempCelsius: -21.5,
    relativeHumidity: 68,
    windSpeedKmh: 8,
    seasonContextMn: 'Жилийн хамгийн хүйтэн үе. Зуухны хэт халалт болон яндангийн цооролт хамгийн олон гардаг эрсдэлт сар.',
    seasonContextEn: 'Peak winter freeze. Highest seasonal volume of stove overheating and flue chimney compromise.'
  },
  {
    month: 2,
    nameMn: '2-р сар',
    nameEn: 'February',
    shortMn: '2-р сар',
    shortEn: 'FEB',
    riskScore: 84,
    riskLevel: 'very_high',
    primaryDriversMn: ['Цагаан сарын баярын өдрүүд', 'Зуухны ачаалал', 'Үнс нурмын буруу хадгалалт'],
    primaryDriversEn: ['Lunar New Year cooking load', 'Active continuous heating', 'Unquenched ash dumping into timber enclosures'],
    historicalAvgIncidents: 198,
    avgTempCelsius: -16.8,
    relativeHumidity: 62,
    windSpeedKmh: 10,
    seasonContextMn: 'Уламжлалт баярын хоол бэлтгэл, цахилгааны ачаалал нэмэгдэж үнс нурам ил задгай хаях тохиолдол элбэгшдэг.',
    seasonContextEn: 'Heightened domestic cooking load and hot cinder deposition risks in residential sectors.'
  },
  {
    month: 3,
    nameMn: '3-р сар',
    nameEn: 'March',
    shortMn: '3-р сар',
    shortEn: 'MAR',
    riskScore: 76,
    riskLevel: 'high',
    primaryDriversMn: ['Шилжилтийн үеийн салхи', 'Шөнийн хүйтрэлт, зуухны хэрэглээ', 'Хуурайшилт эхлэх'],
    primaryDriversEn: ['Transitional wind gusts', 'Sub-zero nights requiring continued stoves', 'Rising vegetation dryness'],
    historicalAvgIncidents: 174,
    avgTempCelsius: -7.2,
    relativeHumidity: 48,
    windSpeedKmh: 18,
    seasonContextMn: 'Хаврын хуурай салхи эхэлж зуухны яндангийн оч хашаа саравч руу үсрэх эрсдэл өндөрсдөг.',
    seasonContextEn: 'Emergence of gusty spring winds carrying chimney sparks into dry yards and wooden sheds.'
  },
  {
    month: 4,
    nameMn: '4-р сар',
    nameEn: 'April',
    shortMn: '4-р сар',
    shortEn: 'APR',
    riskScore: 92,
    riskLevel: 'very_high',
    primaryDriversMn: ['Хүчтэй хуурай шуурга (30+ км/ц)', 'Шар өвс шатаах хандлага', 'Ой, хээрийн хуурайшилт'],
    primaryDriversEn: ['Severe dry gales (30+ km/h)', 'Open dry grass burning', 'Extreme forest/steppe fuel dryness'],
    historicalAvgIncidents: 238,
    avgTempCelsius: 3.5,
    relativeHumidity: 32,
    windSpeedKmh: 24,
    seasonContextMn: 'Хаврын гамшгийн эрсдэл хамгийн өндөр сар! Хуурайшилт, хүчтэй салхины улмаас жижиг оч ч асар хурдтай тархдаг.',
    seasonContextEn: 'Highest overall fire ignition & spread danger month due to desiccated vegetation and high-velocity windstorms.'
  },
  {
    month: 5,
    nameMn: '5-р сар',
    nameEn: 'May',
    shortMn: '5-р сар',
    shortEn: 'MAY',
    riskScore: 86,
    riskLevel: 'very_high',
    primaryDriversMn: ['Ногоон бүсийн аялал, зугаалга', 'Ил задгай гал түлэх', 'Хаврын хуурай халуун'],
    primaryDriversEn: ['Outdoor recreation & camping', 'Unattended open campfires', 'Persisting vegetation dryness before rain'],
    historicalAvgIncidents: 206,
    avgTempCelsius: 11.8,
    relativeHumidity: 36,
    windSpeedKmh: 22,
    seasonContextMn: 'Аялал зугаалгын улирал эхэлж, ногоон бүс болон хотын захад шар өвс, ой хээрийн түймрийн аюул онцгой нэмэгдэнэ.',
    seasonContextEn: 'Outing season escalates human-induced sparks in peri-urban forests and recreation spots.'
  },
  {
    month: 6,
    nameMn: '6-р сар',
    nameEn: 'June',
    shortMn: '6-р сар',
    shortEn: 'JUN',
    riskScore: 50,
    riskLevel: 'moderate',
    primaryDriversMn: ['Аянга цахилгаантай бороо', 'Үйлдвэрлэлийн бүсийн ачаалал', 'Халаалтын улирал дууссан'],
    primaryDriversEn: ['Convective thunderstorms & lightning strikes', 'Industrial facility activity', 'Stove heating dormant'],
    historicalAvgIncidents: 112,
    avgTempCelsius: 17.5,
    relativeHumidity: 54,
    windSpeedKmh: 14,
    seasonContextMn: 'Зуны борооны улирал эхэлж, ахуйн зуухны хэрэглээ зогссоноор эрсдэл мэдэгдэхүйц буурдаг.',
    seasonContextEn: 'Summer rainfall onset and cessation of residential stove firing dramatically lowers general risk.'
  },
  {
    month: 7,
    nameMn: '7-р сар',
    nameEn: 'July',
    shortMn: '7-р сар',
    shortEn: 'JUL',
    riskScore: 36,
    riskLevel: 'low',
    primaryDriversMn: ['Наадмын амралт, хотын хөдөлгөөн багасах', 'Хур бороо', 'Аянга цахилгаан'],
    primaryDriversEn: ['Naadam festival exodus (lower urban density)', 'High precipitation', 'Localized lightning'],
    historicalAvgIncidents: 78,
    avgTempCelsius: 19.8,
    relativeHumidity: 65,
    windSpeedKmh: 11,
    seasonContextMn: 'Жилийн хамгийн дулаан бөгөөд хур тунадас ихтэй үе. Галын дуудлага жилийн дунджаас хамгийн доод түвшинд байна.',
    seasonContextEn: 'Warmest and wettest period of the year. Historically lowest monthly fire call frequency in Ulaanbaatar.'
  },
  {
    month: 8,
    nameMn: '8-р сар',
    nameEn: 'August',
    shortMn: '8-р сар',
    shortEn: 'AUG',
    riskScore: 40,
    riskLevel: 'moderate',
    primaryDriversMn: ['Шөнөдөө сэрүүсэх', 'Хичээлийн шинэ жилийн бэлтгэл', 'Цахилгааны хэрэглээ өсөх'],
    primaryDriversEn: ['Night chill starting', 'Back-to-school settlement influx', 'Early morning auxiliary heating'],
    historicalAvgIncidents: 89,
    avgTempCelsius: 17.2,
    relativeHumidity: 66,
    windSpeedKmh: 10,
    seasonContextMn: 'Сарын сүүлчээр шөнө сэрүүсэж, хот руу чиглэсэн нүүдэл нэмэгдсэнээр жижиг халаалтын эрсдэл сэргэдэг.',
    seasonContextEn: 'Late August cool nights stimulate early stove relighting and peri-urban population reassembly.'
  },
  {
    month: 9,
    nameMn: '9-р сар',
    nameEn: 'September',
    shortMn: '9-р сар',
    shortEn: 'SEP',
    riskScore: 62,
    riskLevel: 'high',
    primaryDriversMn: ['Халаалтын улирлын эхлэл (9 сарын 15)', 'Яндан цэвэрлэгээ хангалтгүй байх', 'Шөнийн хасах хэм'],
    primaryDriversEn: ['Official heating season launch (Sept 15)', 'Uncleaned chimney deposits from previous year', 'Sub-zero night frosts'],
    historicalAvgIncidents: 145,
    avgTempCelsius: 10.4,
    relativeHumidity: 52,
    windSpeedKmh: 13,
    seasonContextMn: 'Халаалт эхлэх үе. Зуны турш хуримтлагдсан тортог, эвдэрсэн зуухыг анхлан галлах үед гал гарах тохиолдол огцом өсдөг.',
    seasonContextEn: 'Heating commencement period. Accumulated creosote and uninspected flues drive a sharp ignition spike.'
  },
  {
    month: 10,
    nameMn: '10-р сар',
    nameEn: 'October',
    shortMn: '10-р сар',
    shortEn: 'OCT',
    riskScore: 78,
    riskLevel: 'high',
    primaryDriversMn: ['Өвлийн эхэн сарын цэвдэг', 'Байнгын галлагаа эхлэх', 'Цахилгаан утасны ачаалал'],
    primaryDriversEn: ['Early winter freeze', 'Full daily stove firing routine', 'Heavy electrical baseboard loads'],
    historicalAvgIncidents: 182,
    avgTempCelsius: 1.8,
    relativeHumidity: 56,
    windSpeedKmh: 12,
    seasonContextMn: 'Өдрийн болон шөнийн температур хасах руу орж, бүх өрх зуух, халаагуураа 24 цагаар ажиллуулж эхэлнэ.',
    seasonContextEn: 'Sustained sub-zero temperatures force around-the-clock home heating across all unplanned neighborhoods.'
  },
  {
    month: 11,
    nameMn: '11-р сар',
    nameEn: 'November',
    shortMn: '11-р сар',
    shortEn: 'NOV',
    riskScore: 82,
    riskLevel: 'very_high',
    primaryDriversMn: ['Цас багатай үеийн хүйтрэлт', 'Зуухны яндангийн цоорол', 'Үнс нурам шатах'],
    primaryDriversEn: ['Severe cold without snow blanket', 'Stovepipe thermal degradation', 'Hot ash fires'],
    historicalAvgIncidents: 196,
    avgTempCelsius: -9.5,
    relativeHumidity: 64,
    windSpeedKmh: 10,
    seasonContextMn: 'Хүйтний эрч чангарч, зуухны яндангийн дулаалга хангалтгүйгээс дээвэр, хана руу гал алдах давтамж нэмэгдэнэ.',
    seasonContextEn: 'Deepening cold leads to high combustion intensity and thermal bridging into roof rafters.'
  },
  {
    month: 12,
    nameMn: '12-р сар',
    nameEn: 'December',
    shortMn: '12-р сар',
    shortEn: 'DEC',
    riskScore: 90,
    riskLevel: 'very_high',
    primaryDriversMn: ['Өвлийн тэсгим хүйтэн (-25°C хүрэх)', 'Шөнийн тасралтгүй галлагаа', 'Шинэ жилийн баярын чимэглэл, цахилгааны ачаалал'],
    primaryDriversEn: ['Dead of winter freeze (-25°C)', 'Continuous overnight heating', 'Holiday decorative light string fire hazards'],
    historicalAvgIncidents: 228,
    avgTempCelsius: -18.2,
    relativeHumidity: 70,
    windSpeedKmh: 8,
    seasonContextMn: 'Өвлийн оргил хүйтрэлт ба шинэ жилийн баяр давхацдаг. Дуудлагын тоо жилдээ дээд цэгт хүрдэг 2 сарын нэг.',
    seasonContextEn: 'Peak winter temperature depression and year-end celebrations combine to create peak emergency calls.'
  }
];

export const CURRENT_UB_WEATHER: WeatherData = {
  tempCelsius: 4.2,
  humidityPercent: 34,
  windSpeedKmh: 16.5,
  windDirectionDeg: 315,
  windDirectionCompass: 'БХ (NW)',
  condition: 'dry',
  conditionMn: 'Сэрүүн, хуурай, салхитай',
  conditionEn: 'Cool, dry, moderate breeze',
  fireWeatherIndex: 68,
  droughtDays: 14,
  lastUpdated: '2026-09-30 12:30 UTC+8'
};
