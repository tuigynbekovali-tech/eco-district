# 🌿 ЭкоАудан KZ — Толық Нұсқаулық

## Жоба Сипаттамасы
Қазақстан қалалары мен аудандарының экологиялық рейтингі.
Мекенжайды енгізсеңіз — ИИ 5 критерий бойынша талдау жасайды.

---

## 📁 Жоба Құрылымы
```
eco-district/
├── index.html          ← Негізгі HTML бет
├── style.css           ← Барлық стильдер
├── app.js              ← Логика + API + Карта
├── data/
│   └── kazakhstan.js   ← Қазақстан деректері
└── README.md           ← Бұл файл
```

---

## ⚙️ ОРНАТУ — ҚАДАМ БОЙЫНША

### 1. VSCode-қа жүктеу
```bash
# Жобаны жүктеп алыңыз, содан кейін:
cd eco-district
code .
```

### 2. Live Server орнату
VSCode ішінде:
- `Ctrl+Shift+X` → Extensions
- "Live Server" деп іздеңіз (Ritwick Dey)
- Install басыңыз

### 3. API кілт алу
1. https://console.anthropic.com/ сайтына кіріңіз
2. "API Keys" → "Create Key"
3. Кілтті көшіріңіз

### 4. API кілтті орнату
`app.js` файлын ашыңыз, 1-ші жолды табыңыз:
```javascript
const CLAUDE_API_KEY = "YOUR_API_KEY_HERE";
```
Мұны өзіңіздің кілтіңізге алмастырыңыз:
```javascript
const CLAUDE_API_KEY = "sk-ant-api03-...";
```

### 5. Сайтты іске қосу
VSCode-та `index.html` ашып, төменгі оң жақтағы **"Go Live"** батырмасын басыңыз.
Немесе terminal-да:
```bash
npx live-server
```

Браузер автоматты ашылады: `http://127.0.0.1:5500`

---

## 🎯 Функционалдылық

| Мүмкіндік | Сипаттама |
|---|---|
| 🏙️ Қала таңдау | 15 Қазақстан қаласы |
| 🏘️ Аудан таңдау | Әр қаланың нақты аудандары |
| 📊 5 критерий | Жасыл, шу, шығарынды, зауыт, қалдық |
| 🤖 ИИ чат | Claude API арқылы нақты жауаптар |
| 🗺️ Карта | Leaflet + OpenStreetMap |
| 📱 Responsive | Мобильге бейімделген |

---

## 🔑 API жұмыс жасамаса

`app.js` ішіндегі `getFallbackAnalysis()` функциясы автоматты іске қосылады.
Сайт API-сыз да жұмыс жасайды, бірақ жауаптар статикалық болады.

---

## 🛠️ Кеңейту мүмкіндіктері

```bash
# npm орнату (опционалды)
npm init -y

# Vite (жылдам dev server) орнату
npm install -D vite
npx vite

# Build жасау
npx vite build
```

---

## 📝 Деректер туралы
Деректер демонстрациялық мақсатта жасалған.
Нақты экологиялық деректер үшін:
- ҚР Экология министрлігі API
- OpenAQ (ашық ауа сапасы деректері)
- Kazhydromet деректер базасы

---

## 🚀 Деплой (жариялау)

### GitHub Pages:
```bash
git init
git add .
git commit -m "ЭкоАудан KZ"
git branch -M main
git remote add origin https://github.com/USERNAME/eco-district.git
git push -u origin main
# GitHub Settings → Pages → Source: main branch
```

### Netlify (тегін):
```bash
# netlify.com → "Add new site" → "Deploy manually"
# eco-district папкасын сүйреп апарыңыз
```
