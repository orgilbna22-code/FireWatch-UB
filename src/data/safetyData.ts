export interface SafetyGuide {
  id: string;
  topicNumber: string;
  titleMn: string;
  titleEn: string;
  category: 'residential' | 'electrical' | 'heating' | 'detection' | 'extinguisher' | 'schools' | 'protocol';
  summaryMn: string;
  summaryEn: string;
  keySteps: {
    step: string;
    actionMn: string;
    actionEn: string;
    detailsMn: string;
    detailsEn: string;
  }[];
  criticalRulesMn: string[];
  criticalRulesEn: string[];
  officialSourceMn: string;
  officialSourceEn: string;
}

export const SAFETY_GUIDES: SafetyGuide[] = [
  {
    id: 'guide-home',
    topicNumber: '01',
    titleMn: 'Гэрийн галын аюулгүй байдал',
    titleEn: 'Residential Home & Yard Safety',
    category: 'residential',
    summaryMn: 'Гэр хорооллын хашаа, амины сууц, гэр орон зайд гал гарахаас урьдчилан сэргийлэх суурь зөвлөмжүүд.',
    summaryEn: 'Essential fire prevention practices for traditional gers, detached residential homes, and perimeter yards.',
    keySteps: [
      {
        step: '01',
        actionMn: 'Үнс нурмаа таглаатай төмөр саванд хадгалах',
        actionEn: 'Store hot ashes strictly in covered metal containers',
        detailsMn: 'Зуухнаас гаргасан халуун үнсийг хэзээ ч модон хашаа, ил задгай хог, эсгийний дэргэд асгаж болохгүй. Бүрэн хөрсний дараа 24 цагийн дараа хаяна.',
        detailsEn: 'Never dump stove ash near wooden fences, dry trash, or combustible felt. Use non-combustible metal bins with tight lids.'
      },
      {
        step: '02',
        actionMn: 'Хашааны шар өвс, хогийг цэвэрлэх',
        actionEn: 'Clear dry grass, leaves, and combustible yard debris',
        detailsMn: 'Хаврын хуурайшилтын үед хашааны шар өвс шатаахыг хатуу хориглоно. Галыг өөрсдөө шатаах биш тармуураар цэвэрлэж уутална.',
        detailsEn: 'Open burning of dry leaves or dead grass is strictly prohibited. Rake and bag combustible vegetation safely.'
      },
      {
        step: '03',
        actionMn: 'Гэрийн тооно, эсгий, ханын зайг зохицуулах',
        actionEn: 'Maintain clearances between stovepipes and felt insulation',
        detailsMn: 'Гэрийн тооноор гарч буй яндан эсгий, модтой шууд хүрэлцэхгүй байх төмөр цамц (яндангийн халхавч) заавал байрлуулна.',
        detailsEn: 'Install insulated roof collar thimbles so that hot metal flues never touch structural timbers or wool felt insulation.'
      }
    ],
    criticalRulesMn: [
      'Хашааны үүд болон гудамжийг галын машин чөлөөтэй эргэхүйц сул байлгах',
      'Бага насны хүүхдийг гэрт цоожилж, чүдэнз, асаагуур орхихгүй байх',
      'Гэрийн эсгий туурганаас ил зуухны хана хүртэл хамгийн багадаа 70 см зай барих'
    ],
    criticalRulesEn: [
      'Keep yard entrance and lane clear of parked cars for fire engine access',
      'Never leave children unattended with matches, lighters, or open flames',
      'Maintain at least 70cm clearance between metal stoves and wool felt walls'
    ],
    officialSourceMn: 'ОБЕГ-ын Урьдчилан сэргийлэх газар (NEMA Mongolia)',
    officialSourceEn: 'National Emergency Management Agency of Mongolia'
  },
  {
    id: 'guide-electrical',
    topicNumber: '02',
    titleMn: 'Цахилгааны аюулгүй байдал',
    titleEn: 'Electrical Safety & Circuit Protection',
    category: 'electrical',
    summaryMn: 'Цахилгааны утасны хэт ачаалал, олон залгуур залгах, богино холболтоос үүдэлтэй галыг таслан зогсоох дүрэм.',
    summaryEn: 'Guidelines to prevent electrical fires caused by multi-plug overloads, damaged insulation, and short circuits.',
    keySteps: [
      {
        step: '01',
        actionMn: 'Нэг залгуурт өндөр ваттын хэрэгсэл зэрэг залгахгүй байх',
        actionEn: 'Do not daisy-chain heavy heating appliances into a single strip',
        detailsMn: 'Цахилгаан халаагуур, бойлер, индукц плитка зэргийг нэг жирийн уртасгагч утсанд хамтад нь залгавал утас хайлж гал гарна.',
        detailsEn: 'Heavy current draws like electric space heaters, boilers, and induction stoves must have dedicated wall circuits.'
      },
      {
        step: '02',
        actionMn: 'Стандартын автомат таслуур (АВВ/Schneider) суурилуулах',
        actionEn: 'Install standard certified circuit breakers and RCD protection',
        detailsMn: 'Гал хамгаалагчийг төмөр утас (жучок)-оор хэзээ ч орлуулж болохгүй. Энэ нь богино холболтын үед шугам шатах гол шалтгаан болдог.',
        detailsEn: 'Never bridge blown fuses with bare copper wire or makeshift staples. Always use properly rated thermal-magnetic breakers.'
      },
      {
        step: '03',
        actionMn: 'Элэгдэж гэмтсэн кабель, залгуурыг яаралтай солих',
        actionEn: 'Immediately replace frayed wiring and discolored sockets',
        detailsMn: 'Хэрэв залгуур халж, түлэнхий үнэр гарч байвал ашиглахаа шууд зогсоож, мэргэжлийн цахилгаанчинд хандаарай.',
        detailsEn: 'Discolored, humming, or warm-to-touch electrical outlets must be switched off and re-wired by certified personnel.'
      }
    ],
    criticalRulesMn: [
      'Уртасгагч утсыг хивс, ор дэрний доогуур битүү далдлахгүй байх',
      'Гэрийн цахилгаан утаснуудыг зориулалтын шатдаггүй хуванцар хоолойд сүвлэх',
      'Гэрээс гарахдаа утсаа цэнэглэгч болон шаардлагагүй хэрэгслийг залгуураас салгах'
    ],
    criticalRulesEn: [
      'Never route extension cables underneath carpets, mattresses, or doorways',
      'Encase exposed ger wiring inside fire-resistant flame-retardant conduit sleeves',
      'Unplug phone chargers and idle electronics before leaving unattended'
    ],
    officialSourceMn: 'УБЦТС ТӨХК & Онцгой байдлын Ерөнхий газар',
    officialSourceEn: 'Ulaanbaatar Electricity Distribution Network (UBEDN)'
  },
  {
    id: 'guide-heating',
    topicNumber: '03',
    titleMn: 'Халаалтын үеийн аюулгүй байдал',
    titleEn: 'Stoves, Flues & Heating Season Safety',
    category: 'heating',
    summaryMn: 'Өвлийн зуух галлах, сайжруулсан түлшний хэрэглээ, угаарын хий болон яндангийн цооролтоос сэргийлэх заавар.',
    summaryEn: 'Protocols for safe solid fuel burning, stove flue maintenance, chimney cleaning, and CO poisoning prevention.',
    keySteps: [
      {
        step: '01',
        actionMn: 'Яндангаа улиралд дор хаяж 2-3 удаа хөөлөх, цэвэрлэх',
        actionEn: 'Sweep chimney flues 2-3 times every heating season',
        detailsMn: 'Сайжруулсан түлшний тортог яндангийн хананд хуримтлагдсанаар таталт муудаж, яндан улайсч, дээвэр шатах эрсдэл үүсгэдэг.',
        detailsEn: 'Creosote deposits restrict exhaust draft and can ignite into a 1000°C chimney flue fire that spreads to ceilings.'
      },
      {
        step: '02',
        actionMn: 'Зуухны өмнө 50х70 см төмөр пайз байрлуулах',
        actionEn: 'Place a 50x70 cm non-combustible metal sheet before the stove door',
        detailsMn: 'Гал түлэх болон түлш нэмэх үед зуухны хаалгаар цог үсрэхэд модон шал, хивс рүү гал авалцахаас найдвартай сэргийлнэ.',
        detailsEn: 'A floor-mounted sheet-metal hearth plate prevents escaping hot embers from igniting wooden floors or rugs.'
      },
      {
        step: '03',
        actionMn: 'Зууханд бензин, керосин зэрэг шингэн түлш асгахгүй байх',
        actionEn: 'Never pour accelerants, petrol, or kerosene to start a fire',
        detailsMn: 'Шингэн түлш ууршиж, шүдэнз зурмагц тэсрэлт үүсгэж, нүүр гар шатаах, орон сууцыг бүхэлд нь дэлбэлэх аюултай.',
        detailsEn: 'Vaporized petroleum flashes instantly upon contact with open spark, causing catastrophic flash fires and severe burns.'
      }
    ],
    criticalRulesMn: [
      'Зуухны дээгүүр хувцас, гутал унжуулж хатаахыг хатуу хориглоно',
      'Угаарын хий мэдрэгчийг (CO detector) унтлагын өрөө, гэрт заавал ажиллуулах',
      'Зуухны хүхээгний хаалтыг (заслонк) 100% хааж унтахгүй байх'
    ],
    criticalRulesEn: [
      'Never hang drying clothing or wet felt directly suspended above active stoves',
      'Equip sleeping quarters with calibrated Carbon Monoxide (CO) audible detectors',
      'Never completely seal the flue damper shut while embers are smoldering'
    ],
    officialSourceMn: 'Тавантолгой Түлш ХХК & ОБЕГ',
    officialSourceEn: 'Tavantolgoi Fuel & NEMA Safety Inspectorate'
  },
  {
    id: 'guide-detector',
    topicNumber: '04',
    titleMn: 'Галын утаа мэдрэгч ба дохиолол',
    titleEn: 'Smoke Detectors & Early Warning Systems',
    category: 'detection',
    summaryMn: 'Хүмүүс нойрондоо угаартах, галыг оройтож мэдэх аюулаас хамгаалах хамгийн энгийн бөгөөд ач холбогдолтой шийдэл.',
    summaryEn: 'How photoelectric and ionization smoke detectors provide life-saving early auditory warnings in bedrooms and living rooms.',
    keySteps: [
      {
        step: '01',
        actionMn: 'Унтлагын өрөө, хонгилын таазанд байрлуулах',
        actionEn: 'Mount optical smoke alarms on central ceiling locations',
        detailsMn: 'Утаа хамгийн түрүүнд дээшээ тааз руу хөөрдөг тул таазны голд, хананаас 30 см-ээс багагүй зайд суурилуулна.',
        detailsEn: 'Smoke rises immediately to highest room points. Fix detectors on ceilings at least 30cm away from wall corners.'
      },
      {
        step: '02',
        actionMn: 'Сар бүр туршилтын товчийг дарж шалгах',
        actionEn: 'Test alarm sounder monthly via the Test button',
        detailsMn: 'Төхөөрөмж дээрх Test товчийг 3 секунд дарахад чанга дохио дуугарч байвал зай болон систем хэвийн ажиллаж байна гэсэн үг.',
        detailsEn: 'Depress the physical test button for 3 seconds; verify that the 85dB horn emits a piercing sequence.'
      },
      {
        step: '03',
        actionMn: 'Зайг жилд нэг удаа тогтмол солих',
        actionEn: 'Replace alkaline 9V backup batteries annually',
        detailsMn: 'Төхөөрөмж 30-60 секунд тутам жиргэх чимээ (beep) гаргаж эхэлбэл зай нь дууссаны дохио тул даруй солих шаардлагатай.',
        detailsEn: 'Periodic chirps indicate low voltage. Renew power cells annually (e.g. at the start of heating season).'
      }
    ],
    criticalRulesMn: [
      'Утаа мэдрэгчийг гал тогооны плитканы яг дээр байрлуулахгүй (хуурамч дохиолол өгнө)',
      'Худалдаж авахдаа CE/UL олон улсын сертификаттай эсэхийг магадлах',
      'Гэрийн тоононоос холдуулан баганын дээд хэсэг эсвэл ханын дээд захад тогтоох'
    ],
    criticalRulesEn: [
      'Avoid placing alarms directly over cooking hobs to prevent false steam triggers',
      'Verify CE, UL, or EN 14604 standard compliance markings before purchase',
      'In traditional gers, mount on central wooden support pillars near ceiling height'
    ],
    officialSourceMn: 'ОБЕГ-ын Стандарт, хяналтын газар',
    officialSourceEn: 'Mongolian National Fire Safety Standards (MNS)'
  },
  {
    id: 'guide-extinguisher',
    topicNumber: '05',
    titleMn: 'Гал унтраагуур ашиглах журам (PASS дүрэм)',
    titleEn: 'Fire Extinguisher Protocol (P.A.S.S. Method)',
    category: 'extinguisher',
    summaryMn: 'Анхан шатны галыг дэгдэхээс нь өмнө аюулгүй, үр дүнтэй унтраах алхам алхмаар зааварчилгаа.',
    summaryEn: 'Step-by-step instructions to deploy dry-powder and CO2 fire extinguishers on incipient fires using the PASS technique.',
    keySteps: [
      {
        step: '01',
        actionMn: 'P (Pull) - Хамгаалалтын лац, сүлбээр зүүг сугалах',
        actionEn: 'P (Pull) - Pull the safety ring pin breaking the plastic seal',
        detailsMn: 'Бариулын дэргэдэх металл сүлбээрийг хүчтэй татаж сугалснаар хөшүүрэг ажиллахад бэлэн болно.',
        detailsEn: 'Tightly grasp and yank the metal locking pin to disarm the lever handle safety mechanism.'
      },
      {
        step: '02',
        actionMn: 'A (Aim) - Цоргыг галын дөл рүү биш суурь руу чиглүүлэх',
        actionEn: 'A (Aim) - Aim nozzle low, directly at the combustible base',
        detailsMn: 'Галын дээд дөл рүү цацвал үр дүнгүй. Шатаж буй материалын хамгийн доод суурь хэсэг рүү 2-3 метрийн зайнаас онилно.',
        detailsEn: 'Do not spray at top flame plumes; point nozzle squarely at the burning fuel bed from 2–3 meters standoff.'
      },
      {
        step: '03',
        actionMn: 'S (Squeeze) - Бариулыг тултал нь чанга базах',
        actionEn: 'S (Squeeze) - Squeeze operating lever to discharge extinguisher',
        detailsMn: 'Бариулыг эцэст нь хүртэл базсанаар хуурай нунтаг эсвэл хий өндөр даралтаар гадагшилна.',
        detailsEn: 'Firmly depress the squeeze handle to release the high-pressure suppressing agent.'
      },
      {
        step: '04',
        actionMn: 'S (Sweep) - Хажуу тийш нь жигд хагас дугуй хэлбэрээр шүүрдэх',
        actionEn: 'S (Sweep) - Sweep side to side covering the burning width',
        detailsMn: 'Цоргыг зүүнээс баруун тийш аажим савлаж, галын суурийг нунтгаар бүрхэж хүчилтөрөгчийг тасална.',
        detailsEn: 'Sweep the nozzle back and forth along the fuel edge until all visible flames are smothered.'
      }
    ],
    criticalRulesMn: [
      'Салхины эсрэг биш, салхины араас (салхины чигт) зогсож шүрших',
      'Цахилгааны галыг ус эсвэл хөөсөөр хэзээ ч бүү унтраа (хуурай нунтаг / хийн баллон ашиглах)',
      'Манометрийн зүү ногоон бүс дээр байгаа эсэхийг 6 сар тутам шалгах'
    ],
    criticalRulesEn: [
      'Always stand upwind so smoke and hot extinguishing powder blow away from you',
      'Never use water on energized electrical wiring or hot cooking oils',
      'Inspect the cylinder pressure gauge semi-annually to ensure needle rests in green'
    ],
    officialSourceMn: 'Монгол Улсын Галын аюулгүй байдлын тухай хууль',
    officialSourceEn: 'Law of Mongolia on Fire Safety & Technical Regulations'
  },
  {
    id: 'guide-schools',
    topicNumber: '06',
    titleMn: 'Сургууль, дотуур байрны аюулгүй байдал',
    titleEn: 'Schools, Dormitories & Public Assembly Guidelines',
    category: 'schools',
    summaryMn: 'Хүүхэд, залуучууд олноор цугларах байгууллага, оюутны байрны нүүлгэн шилжүүлэлтийн бэлэн байдал.',
    summaryEn: 'Emergency evacuation readiness, exit corridor regulations, and drill procedures for educational institutions.',
    keySteps: [
      {
        step: '01',
        actionMn: 'Аваарын гарц, коридорыг цоожлохгүй, эд зүйл хураахгүй байх',
        actionEn: 'Keep all marked emergency egress doors unlocked during operating hours',
        detailsMn: 'Сургуулийн аваарын шат, хонгилд хуучин ширээ, сандал, хайрцаг хураахыг хатуу хориглоно. Гарцын гэрлэн дохиог асаалттай байлгана.',
        detailsEn: 'Never padlock exit corridors or stack surplus furniture in stairwells. Illuminated exit signs must function 24/7.'
      },
      {
        step: '02',
        actionMn: 'Улирал бүр галын түргэвчилсэн сургуулилалт хийх',
        actionEn: 'Conduct scheduled fire evacuation drills each semester',
        detailsMn: 'Дохио дуугармагц багш, сурагчид цүнхээ орхин, ам хамраа норгосон алчуураар таглан, бөгтийн 3 минутын дотор цугларах талбайд гарна.',
        detailsEn: 'Students and staff must leave belongings, cover airway with damp cloth, crouch low, and assemble at designated yard rally points within 3 minutes.'
      },
      {
        step: '03',
        actionMn: 'Дотуур байрны өрөөнд плитка, халаагуур нууцаар ашиглахыг хориглох',
        actionEn: 'Strict ban on unapproved hot plates and heaters in student dorms',
        detailsMn: 'Оюутны байрны өрөөнд хүчин чадал ихтэй цахилгаан зуух, спираль халаагуур ашиглах нь шөнийн аюултай галын гол эх үүсвэр болдог.',
        detailsEn: 'High-wattage open coil heaters and unauthorized cookers in student sleeping quarters constitute severe fire risks.'
      }
    ],
    criticalRulesMn: [
      'Давхар бүрт нүүлгэн шилжүүлэлтийн зурмал төлөвлөгөөг ил тод хадах',
      'Гал унтраах анхан шатны самбар, гидрантын лац бүрэн бүтэн байдлыг шалгах',
      'Хөгжлийн бэрхшээлтэй сурагчдад туслах тусгай хариуцагчийг урьдчилан томилсон байх'
    ],
    criticalRulesEn: [
      'Post visual architectural evacuation diagrams visibly on every building floor',
      'Verify standpipe hydrants and fire alarm pull stations remain unblocked',
      'Appoint designated staff members to assist mobility-impaired students during alarms'
    ],
    officialSourceMn: 'Боловсрол, Шинжлэх Ухааны Яам & ОБЕГ',
    officialSourceEn: 'Ministry of Education & NEMA Public Safety Board'
  },
  {
    id: 'guide-protocol',
    topicNumber: '07',
    titleMn: 'Галын үед авах яаралтай арга хэмжээ',
    titleEn: 'Immediate Emergency Action Protocol (101 / 105)',
    category: 'protocol',
    summaryMn: 'Гал түймэр гарсан тохиолдолд секундийн дотор шийдвэр гаргах амь аврах дараалал.',
    summaryEn: 'Critical life-saving decision trees and telephone dispatch sequences when an active fire breaks out.',
    keySteps: [
      {
        step: '01',
        actionMn: '101, 105 дугаарт ЯАРАЛТАЙ залгах',
        actionEn: 'Immediately dial emergency dispatch 101 or 105',
        detailsMn: 'Галыг өөрөө унтраах гэж цаг алдалгүй хамгийн түрүүнд мэргэжлийн ангид хаяг, дүүрэг, хороо, орчны онцлогийг тодорхой хэлнэ.',
        detailsEn: 'Do not delay calling rescue dispatch. Clearly state district, khoroo, street, landmark, and if persons are trapped.'
      },
      {
        step: '02',
        actionMn: 'Утаанаас хамгаалж бөгтийх, мөлхөх',
        actionEn: 'Crouch down low beneath toxic thermal smoke layers',
        detailsMn: 'Утаа нь дээд давхаргаар хуримтлагддаг тул шалнаас 30-50 см өндөрт хамгийн цэвэр агаар байдаг. Нойтон алчуураар ам хамар таглан мөлхөнө.',
        detailsEn: 'Toxic gases and thermal heat concentrate at ceiling levels. Breathe cleanest air 30–50cm above floor; crawl to exit.'
      },
      {
        step: '03',
        actionMn: 'Хаалганы бариулын халууныг гарын араар шалгах',
        actionEn: 'Test door handles with the back of your hand before opening',
        detailsMn: 'Хэрэв төмөр бариул халуун байвал нөгөө талд гал асч байгаа тул хаалгыг онгойлгож болохгүй. Аваарын өөр гарц, цонхоор дохио өгнө.',
        detailsEn: 'If the metal knob is hot, opening it will cause an explosive backdraft. Keep door shut and signal for help at windows.'
      },
      {
        step: '04',
        actionMn: 'Лифтийг хэзээ ч бүү ашигла, шатаар буух',
        actionEn: 'Never use elevators during fires; descend strictly via stairwells',
        detailsMn: 'Цахилгаан тасарч лифтэнд түгжигдэх эсвэл лифтний хонгил яндан мэт утаа сорох асар их эрсдэлтэй.',
        detailsEn: 'Elevator power shafts can fail or act as smoke chimneys. Always evacuate through designated fire staircases.'
      }
    ],
    criticalRulesMn: [
      'Нэгэнт барилгаас гарсан бол эд зүйл авахаар буцаж орж ХЭЗЭЭ Ч болохгүй',
      'Хувцас шатвал: ЗОГС, ХЭВТ, ӨНХӨР (Stop, Drop, Roll) дүрмийг хэрэгжүүлэх',
      'Гал унтраах автомашины замыг чөлөөлөх'
    ],
    criticalRulesEn: [
      'Once outside, never re-enter a burning structure for pets or possessions',
      'If clothes catch fire: STOP, DROP, and ROLL to smother flames with your body',
      'Leave road approaches completely unimpeded for emergency vehicle arrivals'
    ],
    officialSourceMn: 'Монгол Улсын Онцгой байдлын нэгдсэн удирдамж',
    officialSourceEn: 'National Emergency Operational Standard Protocol'
  }
];
