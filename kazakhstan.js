// Қазақстан қалалары мен аудандарының экологиялық деректері
const KAZAKHSTAN_DATA = {
  cities: [
    "Алматы", "Астана", "Шымкент", "Қарағанды", "Ақтөбе",
    "Тараз", "Павлодар", "Өскемен", "Семей", "Атырау",
    "Қостанай", "Петропавл", "Орал", "Теміртау", "Жезқазған"
  ],

  districts: {
    "Алматы": [
      "Алмалы ауданы", "Әуезов ауданы", "Бостандық ауданы",
      "Жетісу ауданы", "Медеу ауданы", "Наурызбай ауданы",
      "Түрксіб ауданы"
    ],
    "Астана": [
      "Алматы ауданы", "Байқоңыр ауданы", "Есіл ауданы",
      "Нұра ауданы", "Сарыарқа ауданы"
    ],
    "Шымкент": [
      "Абай ауданы", "Аль-Фараби ауданы", "Еңбекші ауданы", "Қаратау ауданы"
    ],
    "Қарағанды": [
      "Қазыбек би ауданы", "Октябрь ауданы"
    ],
    "Ақтөбе": [
      "Астана ауданы", "Нұра ауданы"
    ],
    "Тараз": ["Тараз орталығы", "Жамбыл ауданы"],
    "Павлодар": ["Павлодар орталығы", "Ленин ауданы"],
    "Өскемен": ["Өскемен орталығы", "Ульби ауданы"],
    "Семей": ["Семей орталығы", "Абай ауданы"],
    "Атырау": ["Атырау орталығы", "Индустриалды аудан"],
    "Қостанай": ["Қостанай орталығы"],
    "Петропавл": ["Петропавл орталығы"],
    "Орал": ["Орал орталығы"],
    "Теміртау": ["Теміртау орталығы"],
    "Жезқазған": ["Жезқазған орталығы"]
  },

  // Экологиялық рейтинг деректері (0-100 шкала)
  ecoData: {
    "Медеу ауданы": {
      greenZones: 88, noise: 25, exhaust: 20, factories: 5, waste: 10,
      description: "Тау бөктерінде орналасқан, жасыл аймақтарға бай аудан."
    },
    "Бостандық ауданы": {
      greenZones: 72, noise: 45, exhaust: 40, factories: 10, waste: 20,
      description: "Парктер мен бау-бақшалар көп, қозғалыс орташа."
    },
    "Алмалы ауданы": {
      greenZones: 55, noise: 70, exhaust: 65, factories: 15, waste: 35,
      description: "Қала орталығы, жоғары трафик және шу деңгейі."
    },
    "Әуезов ауданы": {
      greenZones: 45, noise: 75, exhaust: 70, factories: 30, waste: 45,
      description: "Тығыз қоныстанған, өнеркәсіп объектілері бар аудан."
    },
    "Жетісу ауданы": {
      greenZones: 60, noise: 55, exhaust: 50, factories: 20, waste: 30,
      description: "Тұрғын үй аймағы, орташа экологиялық жағдай."
    },
    "Наурызбай ауданы": {
      greenZones: 65, noise: 40, exhaust: 35, factories: 25, waste: 25,
      description: "Жаңа тұрғын үй кварталдары, нақты инфрақұрылым."
    },
    "Түрксіб ауданы": {
      greenZones: 35, noise: 80, exhaust: 75, factories: 60, waste: 55,
      description: "Өнеркәсіптік аудан, темір жол жанында."
    },
    "Есіл ауданы": {
      greenZones: 80, noise: 30, exhaust: 25, factories: 5, waste: 10,
      description: "Астананың заманауи жаңа аудандары, EXPO аймағы."
    },
    "Байқоңыр ауданы": {
      greenZones: 70, noise: 35, exhaust: 30, factories: 10, waste: 15,
      description: "Жаңа даму аймағы, жасыл парктер жоспарланған."
    },
    "Сарыарқа ауданы": {
      greenZones: 50, noise: 60, exhaust: 55, factories: 35, waste: 40,
      description: "Ескі аудан, өнеркәсіп объектілері жақын."
    },
    "Алматы ауданы": {
      greenZones: 65, noise: 50, exhaust: 45, factories: 15, waste: 25,
      description: "Астананың орталық тұрғын үй ауданы."
    },
    "Нұра ауданы": {
      greenZones: 75, noise: 25, exhaust: 20, factories: 8, waste: 12,
      description: "Жаңа тұрғын үй ауданы, Нұра өзені жағалауы."
    },
    "Индустриалды аудан": {
      greenZones: 20, noise: 85, exhaust: 90, factories: 95, waste: 80,
      description: "Мұнай өңдеу зауыттары мен өнеркәсіп орталығы."
    },
    "Атырау орталығы": {
      greenZones: 40, noise: 60, exhaust: 65, factories: 70, waste: 50,
      description: "Мұнай қаласының орталығы."
    },
    "Теміртау орталығы": {
      greenZones: 30, noise: 75, exhaust: 80, factories: 90, waste: 70,
      description: "Болат зауыты бар металлургия орталығы."
    }
  },

  // Әдепкі деректер белгісіз аудандар үшін
  defaultData: {
    greenZones: 50, noise: 50, exhaust: 50, factories: 30, waste: 35,
    description: "Бұл аудан туралы толық деректер жиналуда."
  }
};

// Аудан деректерін алу функциясы
function getDistrictData(districtName) {
  return KAZAKHSTAN_DATA.ecoData[districtName] || KAZAKHSTAN_DATA.defaultData;
}

// Жалпы экологиялық балл есептеу
function calculateEcoScore(data) {
  const greenScore = data.greenZones;
  const noisePenalty = data.noise * 0.2;
  const exhaustPenalty = data.exhaust * 0.25;
  const factoryPenalty = data.factories * 0.3;
  const wastePenalty = data.waste * 0.25;
  
  const score = greenScore - noisePenalty - exhaustPenalty - factoryPenalty - wastePenalty;
  return Math.max(0, Math.min(100, Math.round(score + 50)));
}
