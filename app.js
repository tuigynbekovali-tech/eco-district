/* ============================================================
   app.js — ЭкоАудан KZ
   Anthropic Claude API арқылы ИИ-ассистент
   ============================================================ */

// ===== API КОНФИГУРАЦИЯ =====
// МАҢЫЗДЫ: API кілтіңізді мына жерге енгізіңіз
// Нақты өндірісте API кілтін серверде сақтаңыз!
const CLAUDE_API_KEY = "YOUR_API_KEY_HERE"; // <-- осыны алмастырыңыз
const CLAUDE_MODEL = "claude-sonnet-4-20250514";

// ===== КАРТА ҚАЛАЛАРЫ — КООРДИНАТТАР =====
const CITY_COORDS = {
  "Алматы":    { lat: 43.238, lng: 76.945, score: 58 },
  "Астана":    { lat: 51.180, lng: 71.446, score: 72 },
  "Шымкент":   { lat: 42.317, lng: 69.590, score: 52 },
  "Қарағанды": { lat: 49.807, lng: 73.088, score: 44 },
  "Ақтөбе":   { lat: 50.283, lng: 57.167, score: 61 },
  "Тараз":     { lat: 42.900, lng: 71.380, score: 55 },
  "Павлодар":  { lat: 52.287, lng: 76.967, score: 49 },
  "Өскемен":   { lat: 49.948, lng: 82.628, score: 47 },
  "Семей":     { lat: 50.411, lng: 80.226, score: 53 },
  "Атырау":    { lat: 47.113, lng: 51.880, score: 38 },
  "Қостанай":  { lat: 53.200, lng: 63.617, score: 64 },
  "Петропавл": { lat: 54.874, lng: 69.158, score: 62 },
  "Орал":      { lat: 51.229, lng: 51.366, score: 58 },
  "Теміртау":  { lat: 50.058, lng: 72.976, score: 31 },
  "Жезқазған": { lat: 47.783, lng: 67.700, score: 42 },
};

// ===== ИНИЦИАЛИЗАЦИЯ =====
let selectedCity = "";
let selectedDistrict = "";
let currentEcoData = null;
let map = null;

document.addEventListener("DOMContentLoaded", () => {
  initSelects();
  initMap();
  setupListeners();
});

// ===== SELECT ИНИЦИАЛИЗАЦИЯСЫ =====
function initSelects() {
  const citySelect = document.getElementById("city-select");
  KAZAKHSTAN_DATA.cities.forEach(city => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    citySelect.appendChild(opt);
  });
}

// ===== LISTENERS =====
function setupListeners() {
  const citySelect = document.getElementById("city-select");
  const districtSelect = document.getElementById("district-select");
  const analyzeBtn = document.getElementById("analyze-btn");
  const chatSendBtn = document.getElementById("chat-send-btn");
  const chatInput = document.getElementById("chat-input");

  citySelect.addEventListener("change", () => {
    selectedCity = citySelect.value;
    districtSelect.innerHTML = "";
    selectedDistrict = "";

    if (!selectedCity) {
      districtSelect.disabled = true;
      districtSelect.innerHTML = '<option value="">— Алдымен қаланы таңдаңыз —</option>';
      analyzeBtn.disabled = true;
      return;
    }

    districtSelect.disabled = false;
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.textContent = "— Ауданды таңдаңыз —";
    districtSelect.appendChild(defaultOpt);

    const districts = KAZAKHSTAN_DATA.districts[selectedCity] || [];
    districts.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      districtSelect.appendChild(opt);
    });

    // Картада белгіленген қаланы көрсет
    if (CITY_COORDS[selectedCity] && map) {
      map.flyTo([CITY_COORDS[selectedCity].lat, CITY_COORDS[selectedCity].lng], 11, {
        animate: true, duration: 1.5
      });
    }
  });

  districtSelect.addEventListener("change", () => {
    selectedDistrict = districtSelect.value;
    analyzeBtn.disabled = !selectedDistrict;
  });

  analyzeBtn.addEventListener("click", runAnalysis);

  // Чат
  chatSendBtn.addEventListener("click", sendChatMessage);
  chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter") sendChatMessage();
  });

  // Жылдам сұрақтар
  document.querySelectorAll(".qq-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      chatInput.value = btn.dataset.q;
      sendChatMessage();
    });
  });
}

// ===== ТАЛДАУ ЖАСАУ =====
async function runAnalysis() {
  if (!selectedDistrict) return;

  const resultPanel = document.getElementById("result-panel");
  const street = document.getElementById("street-input").value;
  const address = street
    ? `${selectedCity}, ${selectedDistrict}, ${street}`
    : `${selectedCity}, ${selectedDistrict}`;

  // Деректер алу
  currentEcoData = getDistrictData(selectedDistrict);
  const score = calculateEcoScore(currentEcoData);

  // Нәтиже панелін көрсет
  resultPanel.style.display = "block";
  resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });

  // Мекенжай
  document.getElementById("result-address").textContent = "📍 " + address;

  // Баллды анимациямен жаз
  animateScore(score);

  // Критерийлер
  renderCriteria(currentEcoData);

  // Чатты тазала
  const chatWindow = document.getElementById("chat-window");
  chatWindow.innerHTML = "";

  // ИИ-дан бастапқы талдау жасату
  await getAIAnalysis(address, currentEcoData, score);
}

// ===== БАЛЛ АНИМАЦИЯСЫ =====
function animateScore(score) {
  const scoreEl = document.getElementById("score-number");
  const ringFill = document.getElementById("ring-fill");
  const gradeEl = document.getElementById("score-grade");

  const circumference = 314;
  const offset = circumference - (score / 100) * circumference;

  setTimeout(() => {
    ringFill.style.strokeDashoffset = offset;
  }, 100);

  // Санауды анимациялау
  let current = 0;
  const step = score / 50;
  const timer = setInterval(() => {
    current = Math.min(current + step, score);
    scoreEl.textContent = Math.round(current);
    if (current >= score) clearInterval(timer);
  }, 20);

  // Баға
  let grade, gradeClass;
  if (score >= 75) { grade = "🌿 Өте жақсы"; gradeClass = "grade-excellent"; }
  else if (score >= 55) { grade = "✅ Жақсы"; gradeClass = "grade-good"; }
  else if (score >= 35) { grade = "⚠️ Орташа"; gradeClass = "grade-average"; }
  else { grade = "🔴 Нашар"; gradeClass = "grade-poor"; }

  gradeEl.textContent = grade;
  gradeEl.className = "score-grade " + gradeClass;
}

// ===== КРИТЕРИЙЛЕРДІ КӨРСЕТУ =====
function renderCriteria(data) {
  const items = [
    { bar: "bar-green", val: "val-green", value: data.greenZones, label: "жасыл", type: "green", invert: false },
    { bar: "bar-noise", val: "val-noise", value: data.noise, label: "шу", type: "red", invert: true },
    { bar: "bar-exhaust", val: "val-exhaust", value: data.exhaust, label: "шығарынды", type: "orange", invert: true },
    { bar: "bar-factories", val: "val-factories", value: data.factories, label: "зауыт", type: "red", invert: true },
    { bar: "bar-waste", val: "val-waste", value: data.waste, label: "қалдық", type: "orange", invert: true },
  ];

  items.forEach(item => {
    const barEl = document.getElementById(item.bar);
    const valEl = document.getElementById(item.val);

    setTimeout(() => {
      barEl.style.width = item.value + "%";
    }, 200);

    const label = item.invert
      ? (item.value < 30 ? "Төмен ✅" : item.value < 60 ? "Орташа ⚠️" : "Жоғары 🔴")
      : (item.value > 70 ? "Жоғары ✅" : item.value > 40 ? "Орташа ⚠️" : "Төмен 🔴");

    valEl.textContent = item.value + "% — " + label;
  });
}

// ===== ИИ АНАЛИЗ (Claude API) =====
async function getAIAnalysis(address, data, score) {
  const chatWindow = document.getElementById("chat-window");

  // Жүктелу индикаторы
  const loadingEl = document.createElement("div");
  loadingEl.className = "chat-bubble ai-bubble";
  loadingEl.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
  chatWindow.appendChild(loadingEl);

  const prompt = `Сен — Қазақстанның экологиялық ИИ-ассистентісің. Мекенжай: "${address}".

Ауданның экологиялық деректері:
- Жасыл аймақтар: ${data.greenZones}% (жоғары = жақсы)
- Шу деңгейі: ${data.noise}% (жоғары = нашар)
- Көлік шығарындысы: ${data.exhaust}% (жоғары = нашар)
- Зауыттарға жақындық: ${data.factories}% (жоғары = нашар)
- Қалдықтар: ${data.waste}% (жоғары = нашар)
- Жалпы экологиялық балл: ${score}/100

${data.description}

Қазақша (немесе орысша) қысқаша 3-4 сөйлеммен: бұл ауданда өмір сүрудің артықшылықтары мен кемшіліктерін, және 1-2 нақты кеңес бер. Дос сияқты жазылсын.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const result = await response.json();
    loadingEl.remove();

    if (result.content && result.content[0]) {
      addAIBubble(result.content[0].text);
    } else {
      addAIBubble(getFallbackAnalysis(data, score));
    }
  } catch (err) {
    console.error("API қатесі:", err);
    loadingEl.remove();
    addAIBubble(getFallbackAnalysis(data, score));
  }
}

// ===== ЧАТ ХАБАРЛАМАСЫ ЖІБЕРУ =====
async function sendChatMessage() {
  if (!currentEcoData) return;

  const chatInput = document.getElementById("chat-input");
  const question = chatInput.value.trim();
  if (!question) return;

  chatInput.value = "";
  addUserBubble(question);

  const chatWindow = document.getElementById("chat-window");
  const loadingEl = document.createElement("div");
  loadingEl.className = "chat-bubble ai-bubble";
  loadingEl.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
  chatWindow.appendChild(loadingEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  const score = calculateEcoScore(currentEcoData);
  const context = `Аудан деректері: жасыл аймақтар ${currentEcoData.greenZones}%, шу ${currentEcoData.noise}%, шығарынды ${currentEcoData.exhaust}%, зауыттар ${currentEcoData.factories}%, қалдықтар ${currentEcoData.waste}%. Жалпы балл: ${score}/100.`;

  const prompt = `Сен — экологиялық ИИ-ассистентсің. ${context}

Пайдаланушы сұрақ қойды: "${question}"

Қазақша немесе орысша қысқаша, нақты жауап бер (2-3 сөйлем).`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const result = await response.json();
    loadingEl.remove();

    if (result.content && result.content[0]) {
      addAIBubble(result.content[0].text);
    } else {
      addAIBubble(getQuickFallback(question, currentEcoData));
    }
  } catch (err) {
    loadingEl.remove();
    addAIBubble(getQuickFallback(question, currentEcoData));
  }
}

// ===== BUBBLE HELPERS =====
function addAIBubble(text) {
  const chatWindow = document.getElementById("chat-window");
  const el = document.createElement("div");
  el.className = "chat-bubble ai-bubble";
  el.textContent = text;
  chatWindow.appendChild(el);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addUserBubble(text) {
  const chatWindow = document.getElementById("chat-window");
  const el = document.createElement("div");
  el.className = "chat-bubble user-bubble";
  el.textContent = text;
  chatWindow.appendChild(el);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// ===== FALLBACK (API жоқ болса) =====
function getFallbackAnalysis(data, score) {
  if (score >= 75) {
    return `Бұл аудан Қазақстанның ең таза аудандарының бірі! Жасыл аймақтар өте мол (${data.greenZones}%), ауа таза. Отбасымен тұруға өте қолайлы. Спортпен сыртта шұғылдануға болады — ерте таңертең серуендеу ұсынылады. 🌿`;
  } else if (score >= 55) {
    return `Жалпы алғанда орташадан жоғары аудан. Жасыл аймақтары бар (${data.greenZones}%), бірақ шу деңгейі байқалады (${data.noise}%). Терезелерді жиі ашпаңыз, өсімдіктер өсіруге болады. Балалары бар отбасылар үшін жарамды. 🌱`;
  } else if (score >= 35) {
    return `Орташа экологиялық жағдай. Шығарынды (${data.exhaust}%) және шу (${data.noise}%) деңгейлері жоғарылау. Балаларды кіші жастан уличеде ұзақ ойнатуды шектеңіз. Үйде өсімдіктер — ауа тазартушы ретінде жақсы идея. ⚠️`;
  } else {
    return `Экологиялық жағдай күрделі. Зауыттар жақын (${data.factories}%), ауа ластанған. Тамақтандырудан бұрын кір жуыңыз, терезені ашық ұстамаңыз. Балалы отбасылар басқа ауданды қарастырғаны жөн. 🔴`;
  }
}

function getQuickFallback(question, data) {
  const q = question.toLowerCase();
  if (q.includes("бала") || q.includes("child")) {
    return data.noise < 50 && data.exhaust < 50
      ? "Балалар үшін жағдай қолайлы — шу мен шығарынды деңгейлері орташа. 👶✅"
      : "Шу мен ластану деңгейлері жоғарылау. Балаларды таза ауасы көп жерлерге апару ұсынылады. 👶⚠️";
  }
  if (q.includes("спорт") || q.includes("жүгір")) {
    return data.exhaust < 40
      ? "Ауа сапасы жақсы — сыртта спортпен шұғылдануға болады! 🏃✅"
      : "Шығарынды деңгейі жоғарылау, сондықтан жабық спорт залды таңдаңыз. 🏃⚠️";
  }
  if (q.includes("ауа") || q.includes("air")) {
    return `Ауа сапасы: шығарынды ${data.exhaust}%, жасыл аймақтар ${data.greenZones}%. ${data.exhaust < 40 ? "Ауа таза деп санауға болады. ✅" : "Ауаның сапасы орташа. ⚠️"}`;
  }
  return `Берілген деректер бойынша жалпы экологиялық жағдай ${data.greenZones > 60 ? "қолайлы" : "орташа"}. Толығырақ нақты мекенжай бойынша сұраңыз.`;
}

// ===== КАРТА ИНИЦИАЛИЗАЦИЯСЫ =====
function initMap() {
  map = L.map("map").setView([48.0, 68.0], 5);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 18
  }).addTo(map);

  // Маркерлер — барлық қалалар
  Object.entries(CITY_COORDS).forEach(([city, info]) => {
    const score = info.score;
    const color = score >= 65 ? "#4caf50" : score >= 45 ? "#ff9800" : "#f44336";

    const marker = L.circleMarker([info.lat, info.lng], {
      radius: 10 + (score / 20),
      fillColor: color,
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.85
    }).addTo(map);

    const grade = score >= 65 ? "Жақсы 🌿" : score >= 45 ? "Орташа ⚠️" : "Нашар 🔴";

    marker.bindPopup(`
      <div class="eco-popup">
        <h3>${city}</h3>
        <div class="pop-score" style="color:${color}">${score}</div>
        <div style="font-size:0.8rem;color:#666">/ 100 балл</div>
        <div style="margin-top:6px;font-weight:600">${grade}</div>
      </div>
    `);

    marker.on("click", () => {
      const citySelect = document.getElementById("city-select");
      citySelect.value = city;
      citySelect.dispatchEvent(new Event("change"));
    });
  });
}
