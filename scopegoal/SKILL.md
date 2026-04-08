# ScopeGoal v2.0 — SKILL.md
## LUMEN CO. Studio | Data & Schema Reference

Bu dosya index.html tarafından okunur. DEFAULT_STATE, ekran listesi,
gerçek yıldız verileri, survey soruları ve tüm sabit havuzları içerir.

---

## SCREEN IDs (31 ekran)

```
screen-splash        screen-menu          screen-mode-select
screen-star-select   screen-survey        screen-survey-summary
screen-hub           screen-pre-match     screen-match
screen-post-match    screen-league-table  screen-training-hub
screen-training-run  screen-training-pass screen-training-shoot
screen-training-fk   screen-home          screen-gambling
screen-gambling-slot screen-gambling-bj   screen-gambling-formula
screen-shop          screen-sponsors      screen-news
screen-friends       screen-stats         screen-national
screen-profile       screen-events        screen-transfer
screen-world-cup
```

---

## DEFAULT_STATE

```javascript
const DEFAULT_STATE = {
  version: "1.0.0",
  saveKey: "sg_save_v1",
  mode: "own",           // "own" | "real_star"
  realStarId: null,
  player: {
    name: "Oyuncu",
    age: 16,
    birthCountry: "TR",
    nationality: "TR",
    position: "ST",
    stats: {
      pace: 55, shooting: 50, passing: 50,
      dribbling: 55, defending: 30, physical: 50,
      goalkeeping: 30, morale: 75, form: 60, fitness: 100
    },
    boots: null,
    unlockedBoots: [],
    career: {
      currentClub: "Galatasaray",
      currentLeague: "Süper Lig",
      currentCountry: "TR",
      teamPrestige: 50,
      salary: 2000,
      goals: 0, assists: 0, appearances: 0,
      isNationalTeamMember: false,
      nationalCaps: 0, nationalGoals: 0,
      transferValue: 50000,
      contractWeeksLeft: 104,
      careerHistory: []
    },
    economy: {
      gold: 1000, taxRate: 0.22, agentFee: 0.10,
      sponsorGold: 0, weeklyIncome: 0, weeklyExpenses: 0
    },
    energy: 100,
    lifestyle: { homeLevel: 0, hasAgent: false, hasPet: false, hasPartner: false },
    sponsors: { active: [], totalEarned: 0 },
    story: { arcType: null, flags: {}, choices: [] },
    relationships: {
      coach: 50, teamMates: 50, fans: 50,
      family: 70, partner: 50, media: 50
    }
  },
  time: { week: 1, season: 1, totalWeeks: 0, phase: "preseason" },
  matchConfig: "medium",   // "short" | "medium" | "long"
  nationalTeam: {
    selectionThreshold: 70, performanceScore: 0,
    caps: 0, goals: 0, worldCupQualified: false, worldCupPhase: null
  },
  friends: [],
  seasonStats: {
    goals: 0, assists: 0, cleanSheets: 0,
    rating: 0, ratingCount: 0,
    yellowCards: 0, redCards: 0, appearances: 0
  },
  gamblingStats: { totalWon: 0, totalLost: 0, sessions: 0 },
  consecutiveNoTraining: 0,
  eventQueue: [],
  fixtures: [],
  leagueStandings: [],
  currentMatchday: 0,
  pendingTransferOffer: null,
  pendingSponsorOffer: null,
  newspaper: { lastGeneratedWeek: -1, headlines: [] },
  achievements: {}
};
```

---

## REAL_STARS (20 Gerçek Yıldız)

```javascript
const REAL_STARS = [
  {
    id: "mbappe", name: "K. Mbappé", age: 26,
    position: "ST", club: "Real Madrid", country: "FR", flag: "🇫🇷",
    overall: 92, rarity: "icon",
    stats: { pace:97, shooting:91, passing:80, dribbling:92, defending:36, physical:78 },
    special: "Turbo Sprint", specialDesc: "Hızlı kontra ataklarda +5 PAC bonus",
    story: "Paris'ten Madrid'e, dünyanın en hızlı forveti. 2024'te Real Madrid rüyasını gerçek yaptı.",
    startingGold: 5000
  },
  {
    id: "haaland", name: "E. Haaland", age: 24,
    position: "ST", club: "Manchester City", country: "NO", flag: "🇳🇴",
    overall: 91, rarity: "icon",
    stats: { pace:89, shooting:94, passing:66, dribbling:80, defending:45, physical:88 },
    special: "Clinical Finish", specialDesc: "1v1 pozisyonlarda gol ihtimali +10%",
    story: "Norveç'in makine forveti. Premier Lig rekorlarını alt üst etti.",
    startingGold: 5000
  },
  {
    id: "bellingham", name: "J. Bellingham", age: 21,
    position: "CAM", club: "Real Madrid", country: "GB", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    overall: 89, rarity: "gold",
    stats: { pace:78, shooting:83, passing:85, dribbling:87, defending:72, physical:80 },
    special: "Box-to-Box", specialDesc: "Her maçta hem gol hem asist potansiyeli",
    story: "Dortmund'dan Real Madrid'e, İngiltere'nin altın çocuğu.",
    startingGold: 4000
  },
  {
    id: "vinicius", name: "Vinícius Jr.", age: 24,
    position: "LW", club: "Real Madrid", country: "BR", flag: "🇧🇷",
    overall: 90, rarity: "icon",
    stats: { pace:95, shooting:80, passing:78, dribbling:94, defending:28, physical:68 },
    special: "Samba Dribble", specialDesc: "Dripling sahnelerinde rakip okuma -20%",
    story: "Brezilya'nın dans eden yıldızı. Ballon d'Or yolunda.",
    startingGold: 4500
  },
  {
    id: "rodri", name: "Rodri", age: 28,
    position: "CDM", club: "Manchester City", country: "ES", flag: "🇪🇸",
    overall: 91, rarity: "icon",
    stats: { pace:60, shooting:72, passing:91, dribbling:78, defending:90, physical:82 },
    special: "Metronome", specialDesc: "Pas sahnelerinde asist ihtimali +15%",
    story: "2024 Ballon d'Or sahibi. Dünyanın en iyi orta saha oyuncusu.",
    startingGold: 4000
  },
  {
    id: "debruyne", name: "K. De Bruyne", age: 33,
    position: "CM", club: "Manchester City", country: "BE", flag: "🇧🇪",
    overall: 90, rarity: "icon",
    stats: { pace:76, shooting:83, passing:96, dribbling:85, defending:64, physical:77 },
    special: "Vision Pass", specialDesc: "Uzak mesafe paslar hedefte +20%",
    story: "Premier Lig'in en iyi asist makinesi. Çalışkan yaratıcı dahi.",
    startingGold: 4000
  },
  {
    id: "salah", name: "M. Salah", age: 32,
    position: "RW", club: "Liverpool", country: "EG", flag: "🇪🇬",
    overall: 89, rarity: "gold",
    stats: { pace:90, shooting:88, passing:78, dribbling:87, defending:45, physical:68 },
    special: "Mısır Kraliyet Adımı", specialDesc: "Sağ kanat koşularında +5 PAC",
    story: "Mısır'ın firavunu. Premier Lig efsanesi olmaya devam ediyor.",
    startingGold: 4000
  },
  {
    id: "son", name: "H. Son", age: 32,
    position: "LW", club: "Tottenham", country: "KR", flag: "🇰🇷",
    overall: 87, rarity: "gold",
    stats: { pace:86, shooting:87, passing:76, dribbling:84, defending:43, physical:70 },
    special: "Asya Şimşeği", specialDesc: "Gol kutlamalarında moral +5",
    story: "Asya'nın en büyük futbol yıldızı. Tottenham'ın kaptanı.",
    startingGold: 3500
  },
  {
    id: "lewandowski", name: "R. Lewandowski", age: 36,
    position: "ST", club: "Barcelona", country: "PL", flag: "🇵🇱",
    overall: 89, rarity: "gold",
    stats: { pace:77, shooting:93, passing:72, dribbling:76, defending:43, physical:82 },
    special: "Penalty King", specialDesc: "Penaltı sahnelerinde +10% başarı",
    story: "Polonya'nın efsane forveti. Barcelona'da altın çağını yaşıyor.",
    startingGold: 4000
  },
  {
    id: "pedri", name: "Pedri", age: 22,
    position: "CM", club: "Barcelona", country: "ES", flag: "🇪🇸",
    overall: 88, rarity: "gold",
    stats: { pace:72, shooting:74, passing:90, dribbling:89, defending:66, physical:65 },
    special: "Tiki-Taka", specialDesc: "Dar alanlarda pas başarısı +15%",
    story: "Barça'nın çocuk dahisi. Xavi'nin mirasçısı.",
    startingGold: 3500
  },
  {
    id: "yamal", name: "L. Yamal", age: 17,
    position: "RW", club: "Barcelona", country: "ES", flag: "🇪🇸",
    overall: 87, rarity: "special",
    stats: { pace:90, shooting:79, passing:82, dribbling:91, defending:28, physical:59 },
    special: "Prodigy", specialDesc: "Her sezon stats +2 otomatik büyüme",
    story: "Futbolun en genç yıldızı. 2024 Euro şampiyonunun joker ismi.",
    startingGold: 3500
  },
  {
    id: "saka", name: "B. Saka", age: 23,
    position: "RW", club: "Arsenal", country: "GB", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    overall: 87, rarity: "gold",
    stats: { pace:84, shooting:82, passing:83, dribbling:85, defending:55, physical:68 },
    special: "Two-Footed", specialDesc: "Her iki ayakla şut eşit güçte",
    story: "Arsenal'in kalbi. İngiltere'nin geleceği.",
    startingGold: 3500
  },
  {
    id: "odegaard", name: "M. Ødegaard", age: 26,
    position: "CAM", club: "Arsenal", country: "NO", flag: "🇳🇴",
    overall: 88, rarity: "gold",
    stats: { pace:74, shooting:82, passing:90, dribbling:87, defending:68, physical:65 },
    special: "Captain Leader", specialDesc: "Kaptan olarak sahaya çıkınca takım uyumu +10",
    story: "Norveç'in kaptan dahisi. Arsenal'i zirveye taşıdı.",
    startingGold: 3500
  },
  {
    id: "kane", name: "H. Kane", age: 31,
    position: "ST", club: "Bayern Munich", country: "GB", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    overall: 90, rarity: "icon",
    stats: { pace:73, shooting:93, passing:82, dribbling:78, defending:46, physical:83 },
    special: "Hold-Up Play", specialDesc: "Sırtı dönük pozisyonlarda top tutma +15%",
    story: "Premier Lig'in en golcü oyuncusu. Bayern'de ilk sezon, şampiyon.",
    startingGold: 4500
  },
  {
    id: "osimhen", name: "V. Osimhen", age: 25,
    position: "ST", club: "Galatasaray", country: "NG", flag: "🇳🇬",
    overall: 88, rarity: "gold",
    stats: { pace:93, shooting:87, passing:64, dribbling:79, defending:38, physical:85 },
    special: "African Rocket", specialDesc: "Yüksek top sahnelerinde kafa gücü +10",
    story: "Napoli'den Galatasaray'a. Süper Lig'i kasıp kavurdu.",
    startingGold: 3500
  },
  {
    id: "rashford", name: "M. Rashford", age: 27,
    position: "LW", club: "Manchester United", country: "GB", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    overall: 85, rarity: "silver",
    stats: { pace:90, shooting:78, passing:72, dribbling:84, defending:40, physical:72 },
    special: "Pace Burst", specialDesc: "Karşı atakta sprint hızı +8",
    story: "Manchester United'ın yerli yetişme yıldızı. Doruk dönemini aşıyor.",
    startingGold: 3000
  },
  {
    id: "nunez", name: "D. Núñez", age: 25,
    position: "ST", club: "Liverpool", country: "UY", flag: "🇺🇾",
    overall: 84, rarity: "silver",
    stats: { pace:91, shooting:83, passing:61, dribbling:75, defending:34, physical:78 },
    special: "Uruguay Beast", specialDesc: "Bitişik savunmacılara güçlü ezme",
    story: "Uruguay'ın vahşi forveti. Anfield'da çılgın ritüeller.",
    startingGold: 3000
  },
  {
    id: "gavi", name: "Gavi", age: 20,
    position: "CM", club: "Barcelona", country: "ES", flag: "🇪🇸",
    overall: 87, rarity: "gold",
    stats: { pace:76, shooting:70, passing:87, dribbling:88, defending:72, physical:64 },
    special: "Engine Room", specialDesc: "Yüksek pressing sahnelerinde top kazanma +10%",
    story: "İspanya'nın en genç Ballon d'Or adayı. La Masia'nın incisi.",
    startingGold: 3500
  },
  {
    id: "modric", name: "L. Modrić", age: 39,
    position: "CM", club: "Real Madrid", country: "HR", flag: "🇭🇷",
    overall: 87, rarity: "legend",
    stats: { pace:72, shooting:76, passing:92, dribbling:87, defending:68, physical:65 },
    special: "Maestro", specialDesc: "Tecrübe bonusu: her sezon stats sabit kalır (yaşlanma yok)",
    story: "2018 Ballon d'Or efsanesi. Hâlâ sahada, hâlâ büyüsü bozulmamış.",
    startingGold: 4000
  },
  {
    id: "neymar", name: "Neymar Jr.", age: 32,
    position: "LW", club: "Al-Hilal", country: "BR", flag: "🇧🇷",
    overall: 87, rarity: "gold",
    stats: { pace:85, shooting:83, passing:84, dribbling:94, defending:35, physical:61 },
    special: "Samba Magic", specialDesc: "Dripling sahnelerinde her zaman +2 opsiyon",
    story: "Futbolun en eğlenceli oyuncusu. Sakatlanmalar yavaşlatamadı.",
    startingGold: 4000
  }
];
```

---

## LEAGUES (20 Lig)

```javascript
const LEAGUES = [
  { id:"TR", name:"Süper Lig", country:"Türkiye", flag:"🇹🇷", prestige:65,
    clubs:["Galatasaray","Fenerbahçe","Beşiktaş","Trabzonspor","Başakşehir","Adana Demirspor"] },
  { id:"ES", name:"La Liga", country:"İspanya", flag:"🇪🇸", prestige:95,
    clubs:["Real Madrid","Barcelona","Atletico Madrid","Sevilla","Valencia","Athletic Bilbao"] },
  { id:"GB", name:"Premier Lig", country:"İngiltere", flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", prestige:98,
    clubs:["Manchester City","Arsenal","Liverpool","Chelsea","Tottenham","Manchester United","Newcastle"] },
  { id:"DE", name:"Bundesliga", country:"Almanya", flag:"🇩🇪", prestige:88,
    clubs:["Bayern Munich","Borussia Dortmund","RB Leipzig","Bayer Leverkusen","Wolfsburg"] },
  { id:"FR", name:"Ligue 1", country:"Fransa", flag:"🇫🇷", prestige:82,
    clubs:["PSG","Marseille","Lyon","Monaco","Lille","Nice"] },
  { id:"IT", name:"Serie A", country:"İtalya", flag:"🇮🇹", prestige:87,
    clubs:["Juventus","AC Milan","Inter Milan","Napoli","Roma","Lazio"] },
  { id:"PT", name:"Primeira Liga", country:"Portekiz", flag:"🇵🇹", prestige:75,
    clubs:["Porto","Benfica","Sporting CP","Braga","Vitoria"] },
  { id:"NL", name:"Eredivisie", country:"Hollanda", flag:"🇳🇱", prestige:72,
    clubs:["Ajax","PSV Eindhoven","Feyenoord","AZ Alkmaar","Utrecht"] },
  { id:"BE", name:"Pro League", country:"Belçika", flag:"🇧🇪", prestige:68,
    clubs:["Club Brugge","Anderlecht","Gent","Antwerp","Standard Liège"] },
  { id:"AT", name:"Bundesliga (AT)", country:"Avusturya", flag:"🇦🇹", prestige:62,
    clubs:["Red Bull Salzburg","Rapid Wien","Sturm Graz","LASK","Wolfsberger"] },
  { id:"MX", name:"Liga MX", country:"Meksika", flag:"🇲🇽", prestige:70,
    clubs:["Club América","Guadalajara","Cruz Azul","UNAM Pumas","Tigres UANL"] },
  { id:"US", name:"MLS", country:"Amerika", flag:"🇺🇸", prestige:65,
    clubs:["LA Galaxy","Atlanta United","Seattle Sounders","LAFC","New England Revolution"] },
  { id:"BR", name:"Brasileirão", country:"Brezilya", flag:"🇧🇷", prestige:80,
    clubs:["Flamengo","Palmeiras","São Paulo","Corinthians","Atlético Mineiro"] },
  { id:"AR", name:"Liga Profesional", country:"Arjantin", flag:"🇦🇷", prestige:78,
    clubs:["Boca Juniors","River Plate","Racing Club","Independiente","San Lorenzo"] },
  { id:"SA", name:"Pro League", country:"Suudi Arabistan", flag:"🇸🇦", prestige:75,
    clubs:["Al-Hilal","Al-Nassr","Al-Ittihad","Al-Ahli","Al-Qadsiah"] },
  { id:"JP", name:"J-League", country:"Japonya", flag:"🇯🇵", prestige:65,
    clubs:["Vissel Kobe","Urawa Red Diamonds","Gamba Osaka","Yokohama F Marinos","Kashima Antlers"] },
  { id:"KR", name:"K-League", country:"Güney Kore", flag:"🇰🇷", prestige:60,
    clubs:["Jeonbuk Hyundai","Ulsan HD","Seongnam","Seoul E-Land","Suwon Bluewings"] },
  { id:"CN", name:"Super League", country:"Çin", flag:"🇨🇳", prestige:62,
    clubs:["Shanghai Port","Guangzhou FC","Wuhan Three Towns","Shandong Taishan","Beijing Guoan"] },
  { id:"AU", name:"A-League", country:"Avustralya", flag:"🇦🇺", prestige:58,
    clubs:["Sydney FC","Melbourne City","Melbourne Victory","Perth Glory","Brisbane Roar"] },
  { id:"EG", name:"Egyptian Premier League", country:"Mısır", flag:"🇪🇬", prestige:55,
    clubs:["Al-Ahly","Zamalek","Pyramids FC","Ismaily","Al Masry"] }
];
```

---

## SURVEY_QUESTIONS (20 Soru)

```javascript
const SURVEY_QUESTIONS = [
  {
    id: 1, text: "Nerede doğdun?", type: "country",
    hint: "Doğum ülken milliyetini ve başlangıç ligini belirler",
    options: null, // Dinamik — LEAGUES'den ülkeler oluşturulur
    effect: (gs, val) => { gs.player.birthCountry = val; gs.player.nationality = val; }
  },
  {
    id: 2, text: "Ailenin ekonomik durumu nasıldı?",
    options: [
      { text:"💸 Çok yoksulaydık", icon:"🏚️",
        effect: gs => { gs.player.economy.gold -= 300; gs.player.stats.physical += 3; gs.player.story.arcType = "underdog"; }},
      { text:"🏠 Orta halliydi", icon:"🏘️",
        effect: gs => { gs.player.story.arcType = "classic"; }},
      { text:"💎 Varsıldık", icon:"🏰",
        effect: gs => { gs.player.economy.gold += 500; gs.player.stats.dribbling += 2; gs.player.story.arcType = "golden_boy"; }}
    ]
  },
  {
    id: 3, text: "Baban futbolla ilişkisi nasıldı?",
    options: [
      { text:"⚽ Eski bir futbolcuydu", icon:"👨‍🏫",
        effect: gs => { gs.player.stats.shooting += 3; gs.player.stats.passing += 2; gs.player.story.flags.hasMentorFather = true; }},
      { text:"📺 Tutkulu bir taraftardı", icon:"📺",
        effect: gs => { gs.player.stats.morale += 8; gs.player.story.flags.hasPassionateFan = true; }},
      { text:"🚫 Futbolu hiç sevmezdi", icon:"🚫",
        effect: gs => { gs.player.stats.physical += 5; gs.player.story.flags.hadOpposition = true; gs.player.story.arcType = "rebel"; }}
    ]
  },
  {
    id: 4, text: "İlk topla buluşman nasıl oldu?",
    options: [
      { text:"🏙️ Sokak maçlarında", icon:"🏙️",
        effect: gs => { gs.player.stats.dribbling += 4; gs.player.stats.pace += 2; }},
      { text:"🏫 Okul takımında", icon:"🏫",
        effect: gs => { gs.player.stats.passing += 3; gs.player.stats.defending += 2; }},
      { text:"🎁 Doğum günü hediyesiydi", icon:"🎁",
        effect: gs => { gs.player.stats.shooting += 4; gs.player.story.flags.lateStart = true; }}
    ]
  },
  {
    id: 5, text: "Fiziksel yapın nasıl?",
    options: [
      { text:"⚡ Çok hızlı, ince", icon:"⚡",
        effect: gs => { gs.player.stats.pace += 7; gs.player.stats.physical -= 3; }},
      { text:"💪 Güçlü ve dayanıklı", icon:"💪",
        effect: gs => { gs.player.stats.physical += 7; gs.player.stats.pace -= 2; }},
      { text:"⚖️ Dengeli yapı", icon:"⚖️",
        effect: gs => { gs.player.stats.pace += 3; gs.player.stats.physical += 3; }}
    ]
  },
  {
    id: 6, text: "Hangi mevkide oynamayı seviyorsun?",
    options: [
      { text:"⚽ Forvet (ST)", icon:"⚽", pos:"ST",
        effect: gs => { gs.player.position = "ST"; gs.player.stats.shooting += 8; gs.player.stats.pace += 3; }},
      { text:"🎯 İkinci Forvet (CAM)", icon:"🎯", pos:"CAM",
        effect: gs => { gs.player.position = "CAM"; gs.player.stats.passing += 8; gs.player.stats.dribbling += 3; }},
      { text:"🌊 Sol Kanat (LW)", icon:"🌊", pos:"LW",
        effect: gs => { gs.player.position = "LW"; gs.player.stats.pace += 7; gs.player.stats.dribbling += 5; }},
      { text:"⚡ Sağ Kanat (RW)", icon:"⚡", pos:"RW",
        effect: gs => { gs.player.position = "RW"; gs.player.stats.pace += 7; gs.player.stats.dribbling += 5; }},
      { text:"🔧 Orta Saha (CM)", icon:"🔧", pos:"CM",
        effect: gs => { gs.player.position = "CM"; gs.player.stats.passing += 8; gs.player.stats.defending += 3; }},
      { text:"🛡️ Defans (CB)", icon:"🛡️", pos:"CB",
        effect: gs => { gs.player.position = "CB"; gs.player.stats.defending += 10; gs.player.stats.physical += 4; }},
      { text:"🧤 Kaleci (GK)", icon:"🧤", pos:"GK",
        effect: gs => { gs.player.position = "GK"; gs.player.stats.goalkeeping = 65; gs.player.stats.physical += 3; }}
    ]
  },
  {
    id: 7, text: "İlk gerçek maçında nasıl hissettin?",
    options: [
      { text:"🦁 Korkusuz, saldırgandım", icon:"🦁",
        effect: gs => { gs.player.stats.shooting += 3; gs.player.relationships.fans += 5; }},
      { text:"😰 Çok gergindim ama dayandum", icon:"😰",
        effect: gs => { gs.player.stats.morale += 5; gs.player.stats.defending += 2; }},
      { text:"🌟 Doğal doğuştan yetenekliydim", icon:"🌟",
        effect: gs => { gs.player.stats.dribbling += 3; gs.player.stats.morale += 8; }}
    ]
  },
  {
    id: 8, text: "Ailen seni nasıl destekledi?",
    options: [
      { text:"💯 Her maçıma geldiler", icon:"💯",
        effect: gs => { gs.player.relationships.family += 15; gs.player.stats.morale += 5; }},
      { text:"📱 Uzaktan destek", icon:"📱",
        effect: gs => { gs.player.relationships.family += 5; gs.player.stats.morale += 3; }},
      { text:"😑 Pek umursamadılar", icon:"😑",
        effect: gs => { gs.player.stats.physical += 4; gs.player.story.flags.selfMade = true; }},
      { text:"🏋️ Sıkı antrenör gibi davrandılar", icon:"🏋️",
        effect: gs => { gs.player.stats.defending += 3; gs.player.stats.physical += 3; gs.player.relationships.family -= 5; }}
    ]
  },
  {
    id: 9, text: "Erken dönemde ciddi sakatlanma geçirdin mi?",
    options: [
      { text:"💪 Hayır, hep sağlamdım", icon:"💪",
        effect: gs => { gs.player.stats.fitness = 100; gs.player.stats.physical += 3; }},
      { text:"🩹 Evet, aylarımı aldı", icon:"🩹",
        effect: gs => { gs.player.stats.physical += 6; gs.player.stats.pace -= 2; gs.player.story.flags.hadInjury = true; gs.player.story.arcType = gs.player.story.arcType || "comeback"; }}
    ]
  },
  {
    id: 10, text: "Seni keşfeden akademi hocası nasıldı?",
    options: [
      { text:"🏆 Efsane eski profesyonel", icon:"🏆",
        effect: gs => { gs.player.stats.passing += 4; gs.player.stats.shooting += 3; gs.player.relationships.coach += 15; }},
      { text:"📚 Genç ve modern taktikçi", icon:"📚",
        effect: gs => { gs.player.stats.dribbling += 4; gs.player.stats.pace += 2; gs.player.relationships.coach += 10; }}
    ]
  },
  {
    id: 11, text: "Futbol dışında en büyük hobyin ne?",
    options: [
      { text:"🎮 Video oyunları", icon:"🎮",
        effect: gs => { gs.player.stats.morale += 5; gs.player.story.flags.gamer = true; }},
      { text:"🎵 Müzik", icon:"🎵",
        effect: gs => { gs.player.relationships.media += 8; gs.player.stats.morale += 5; }},
      { text:"📖 Okumak", icon:"📖",
        effect: gs => { gs.player.stats.passing += 2; gs.player.stats.defending += 2; gs.player.story.flags.intellectual = true; }},
      { text:"🏃 Koşu / fitness", icon:"🏃",
        effect: gs => { gs.player.stats.pace += 3; gs.player.stats.physical += 3; }},
      { text:"🤝 Yardım faaliyetleri", icon:"🤝",
        effect: gs => { gs.player.relationships.fans += 10; gs.player.relationships.media += 5; }}
    ]
  },
  {
    id: 12, text: "Okulla ilişkin nasıldı?",
    options: [
      { text:"📚 Çok başarılıydım", icon:"📚",
        effect: gs => { gs.player.stats.passing += 2; gs.player.story.flags.educated = true; }},
      { text:"⚽ Sadece futbol kafamdaydı", icon:"⚽",
        effect: gs => { gs.player.stats.shooting += 3; gs.player.stats.pace += 2; }},
      { text:"🚫 Okulu bıraktım futbol için", icon:"🚫",
        effect: gs => { gs.player.stats.physical += 4; gs.player.stats.shooting += 2; gs.player.story.flags.droppedOut = true; }}
    ]
  },
  {
    id: 13, text: "Çocukken idol olarak kim vardı?",
    options: [
      { text:"🇧🇷 Ronaldinho", icon:"🇧🇷",
        effect: gs => { gs.player.stats.dribbling += 5; gs.player.stats.morale += 3; }},
      { text:"⚡ Cristiano Ronaldo", icon:"⚡",
        effect: gs => { gs.player.stats.shooting += 4; gs.player.stats.physical += 3; gs.player.story.flags.perfectionist = true; }},
      { text:"🏅 Zinedine Zidane", icon:"🏅",
        effect: gs => { gs.player.stats.passing += 4; gs.player.stats.dribbling += 2; }},
      { text:"⭐ Messi", icon:"⭐",
        effect: gs => { gs.player.stats.dribbling += 4; gs.player.stats.passing += 3; }}
    ]
  },
  {
    id: 14, text: "Şu an ilişki durumun?",
    options: [
      { text:"❤️ Ciddi ilişkim var", icon:"❤️",
        effect: gs => { gs.player.lifestyle.hasPartner = true; gs.player.stats.morale += 8; gs.player.relationships.partner = 70; }},
      { text:"🔥 Flört dönemi", icon:"🔥",
        effect: gs => { gs.player.stats.morale += 4; gs.player.relationships.media += 5; }},
      { text:"💼 Sadece futbola odaklanıyorum", icon:"💼",
        effect: gs => { gs.player.stats.shooting += 2; gs.player.stats.passing += 2; gs.player.stats.fitness += 5; }}
    ]
  },
  {
    id: 15, text: "Kariyerinin en büyük hayal kırıklığı?",
    options: [
      { text:"❌ Büyük kulüp reddetti", icon:"❌",
        effect: gs => { gs.player.stats.physical += 4; gs.player.story.arcType = gs.player.story.arcType || "underdog"; gs.player.story.flags.wasRejected = true; }},
      { text:"🩹 Kritik sakatlık", icon:"🩹",
        effect: gs => { gs.player.stats.physical += 5; gs.player.stats.defending += 2; }},
      { text:"🎯 Önemli maçta kaçan penaltı", icon:"🎯",
        effect: gs => { gs.player.stats.shooting += 4; gs.player.stats.morale -= 3; }},
      { text:"👨‍👩‍👧 Aile sorunları", icon:"👨‍👩‍👧",
        effect: gs => { gs.player.relationships.family += 10; gs.player.stats.physical += 3; }}
    ]
  },
  {
    id: 16, text: "En büyük rakibin kim?",
    options: [
      { text:"🏙️ Aynı akademiden biri", icon:"🏙️",
        effect: gs => { gs.player.stats.dribbling += 3; gs.player.stats.shooting += 2; gs.player.story.flags.academyRival = true; }},
      { text:"🌍 Yabancı bir yıldız", icon:"🌍",
        effect: gs => { gs.player.stats.pace += 3; gs.player.stats.physical += 2; }},
      { text:"🪞 Kendimim", icon:"🪞",
        effect: gs => { gs.player.stats.morale += 8; gs.player.story.flags.selfImprover = true; }}
    ]
  },
  {
    id: 17, text: "Ailen futbolcu olmanı istedi mi?",
    options: [
      { text:"✅ Evet, tam destek", icon:"✅",
        effect: gs => { gs.player.relationships.family += 15; gs.player.stats.morale += 5; }},
      { text:"❌ Hayır, karşıydılar", icon:"❌",
        effect: gs => { gs.player.stats.physical += 5; gs.player.stats.morale -= 3; gs.player.story.flags.familyOpposed = true; gs.player.story.arcType = gs.player.story.arcType || "rebel"; }}
    ]
  },
  {
    id: 18, text: "Karakterini tanımla",
    options: [
      { text:"🦅 AÇGÖZLÜ — Şöhret ve para istiyorum", icon:"🦅", tone:"greedy",
        effect: gs => { gs.player.economy.gold += 200; gs.player.stats.shooting += 3; gs.player.story.flags.tone = "greedy"; }},
      { text:"🤝 SADIK — Takımım her şeydir", icon:"🤝", tone:"loyal",
        effect: gs => { gs.player.stats.passing += 4; gs.player.relationships.teamMates += 15; gs.player.story.flags.tone = "loyal"; }},
      { text:"🔥 ASİ — Kurallara uymam", icon:"🔥", tone:"rebel",
        effect: gs => { gs.player.stats.dribbling += 5; gs.player.relationships.coach -= 10; gs.player.story.flags.tone = "rebel"; gs.player.story.arcType = "rebel"; }},
      { text:"🌑 SESSİZ — Sahada konuşurum", icon:"🌑", tone:"silent",
        effect: gs => { gs.player.stats.defending += 3; gs.player.stats.physical += 3; gs.player.relationships.media -= 5; gs.player.story.flags.tone = "silent"; }}
    ]
  },
  {
    id: 19, text: "En sevdiğin futbol kulübü?", type: "club",
    hint: "Bu kulüple başlarsan ilk sezonda taraftar sevgisi +15",
    options: null, // Dinamik — Tüm liglerdeki kulüpler
    effect: (gs, val) => { gs.player.story.flags.favoriteClub = val; if (gs.player.career.currentClub === val) gs.player.relationships.fans += 15; }
  },
  {
    id: 20, text: "Adın ne?", type: "input",
    hint: "Oyunundaki adın — istediğin her şey olabilir",
    options: null,
    effect: (gs, val) => { gs.player.name = val || "Oyuncu"; }
  }
];
```

---

## BOOTS (7 Krampon)

```javascript
const BOOTS = [
  { id:"mercurial", name:"Nike Mercurial Superfly", brand:"Nike", price:800,
    emoji:"👟", color:"#FF6B00", rarity:"gold",
    bonus:{ pace:5, dribbling:2 }, special:"Hız Odaklı: Sprint'te +5 PAC" },
  { id:"predator", name:"Adidas Predator Elite", brand:"Adidas", price:750,
    emoji:"🥾", color:"#C1121F", rarity:"gold",
    bonus:{ shooting:4, passing:3 }, special:"Hassas Temas: Şut ve pas doğruluğu +" },
  { id:"future", name:"Puma Future Ultimate", brand:"Puma", price:650,
    emoji:"👞", color:"#6B48FF", rarity:"silver",
    bonus:{ dribbling:4, pace:2 }, special:"Esnek Form: Daralan alanlar için +" },
  { id:"furon", name:"New Balance Furon v7", brand:"New Balance", price:600,
    emoji:"🥿", color:"#FF9F1C", rarity:"silver",
    bonus:{ physical:4, defending:2 }, special:"Zemin Tutuşu: Tackle başarısı +" },
  { id:"magnetico", name:"Under Armour Magnetico", brand:"UA", price:500,
    emoji:"👡", color:"#00C45A", rarity:"bronze",
    bonus:{ passing:4, dribbling:2 }, special:"Kontrol: İlk dokunuş kalitesi +" },
  { id:"copa", name:"Adidas Copa Pure", brand:"Adidas", price:700,
    emoji:"🩴", color:"#B8922A", rarity:"gold",
    bonus:{ passing:5, shooting:2 }, special:"Klasik Topuk: Uzun pas ve frikik +" },
  { id:"phantom", name:"Nike Phantom GX", brand:"Nike", price:750,
    emoji:"🥾", color:"#1D3557", rarity:"gold",
    bonus:{ shooting:5, dribbling:2 }, special:"Gizem: Şut yönü kaleciye daha gizli" }
];
```

---

## SPONSORS (12 Sponsor)

```javascript
const SPONSORS = [
  { id:"voltup_energy", name:"VoltUp Energy", tier:"platinum", emoji:"⚡",
    minOverall:75, goldPerMatch:150, goldPerGoal:80, goldPerRating:50,
    requirement:"Her maçta oyna", duration:26 },
  { id:"nike_pro", name:"Nike Pro Contract", tier:"platinum", emoji:"👟",
    minOverall:78, goldPerMatch:180, goldPerGoal:100, goldPerRating:60,
    requirement:"Haftada 8+ şut", duration:26 },
  { id:"adidas_team", name:"Adidas Team Partner", tier:"gold", emoji:"⚽",
    minOverall:65, goldPerMatch:100, goldPerGoal:60, goldPerRating:35,
    requirement:"8+ puan ortalama", duration:26 },
  { id:"puma_youth", name:"Puma Youth Star", tier:"gold", emoji:"🏅",
    minOverall:55, goldPerMatch:80, goldPerGoal:50, goldPerRating:30,
    requirement:"22 yaş altı oyuncu", duration:52 },
  { id:"pepsi_max", name:"Pepsi MAX", tier:"gold", emoji:"🥤",
    minOverall:60, goldPerMatch:120, goldPerGoal:40, goldPerRating:25,
    requirement:"5+ gol sezonda", duration:26 },
  { id:"ea_sports", name:"EA Sports FC", tier:"gold", emoji:"🎮",
    minOverall:70, goldPerMatch:140, goldPerGoal:70, goldPerRating:45,
    requirement:"Milli takım üyesi", duration:26 },
  { id:"haval_car", name:"Haval Motors", tier:"silver", emoji:"🚗",
    minOverall:50, goldPerMatch:60, goldPerGoal:35, goldPerRating:20,
    requirement:"Herhangi oyuncu", duration:52 },
  { id:"turkish_airlines", name:"Turkish Airlines", tier:"silver", emoji:"✈️",
    minOverall:55, goldPerMatch:70, goldPerGoal:40, goldPerRating:22,
    requirement:"Türk veya Türkiye liginde oynayan", duration:26 },
  { id:"konami", name:"eFootball/Konami", tier:"silver", emoji:"🕹️",
    minOverall:60, goldPerMatch:90, goldPerGoal:45, goldPerRating:28,
    requirement:"Oyuncu puanı 7.5+", duration:26 },
  { id:"rebook_classic", name:"Reebok Classic", tier:"bronze", emoji:"👕",
    minOverall:40, goldPerMatch:40, goldPerGoal:25, goldPerRating:15,
    requirement:"Herhangi oyuncu", duration:52 },
  { id:"gatorade", name:"Gatorade Sport", tier:"bronze", emoji:"💧",
    minOverall:45, goldPerMatch:50, goldPerGoal:30, goldPerRating:18,
    requirement:"Enerji tam sezon", duration:52 },
  { id:"ali_express", name:"AliExpress Sport", tier:"bronze", emoji:"📦",
    minOverall:35, goldPerMatch:30, goldPerGoal:20, goldPerRating:12,
    requirement:"Herhangi oyuncu", duration:52 }
];
```

---

## SECRET_CODES

```javascript
const SECRET_CODES = {
  "2506": { reward:"gold", amount:5000,  msg:"🎉 Dev modu: +5000 💰 Gold!" },
  "9999": { reward:"stats", amount:10,   msg:"💪 Tüm statslar +10!" },
  "0001": { reward:"energy", amount:100, msg:"⚡ Enerji tam dolu!" },
  "7777": { reward:"jackpot", amount:0,  msg:"🎰 Jackpot! Tüm kramponlar açıldı!" },
  "1453": { reward:"golden", amount:0,   msg:"🏆 Altın Kart: Özel FIFA card aktif!" }
};
```

---

## NEWS_POOL (50+ Haber)

```javascript
const NEWS_POOL = [
  "Arda Güler Real Madrid tarihine geçti — 68 metreden uzak mesafe golü!",
  "Harry Kane Bayern'e ilk hattrick'ini yaptırdı",
  "Mbappé Real Madrid'de 50. golüne ulaştı",
  "Osimhen Galatasaray'ı zirveye taşıdı — 3 gol 1 asist",
  "Fenerbahçe Şampiyonlar Ligi'nde tarihi gece",
  "Türkiye Milli Takımı Dünya Kupası elemelerinde lider",
  "Ronaldo Al Nassr'da 100. golünü attı",
  "Bellingham Ballon d'Or favorisi gösterildi",
  "Leandro Paredes transfer piyasasında sıcak — Beşiktaş devrede",
  "Süper Lig'de gerilim — lider el değiştirdi",
  "Liverpool yeni Salah'ı Brezilya'dan transfer etti",
  "Haaland Premier Lig sezon gol rekorunu kırdı",
  "Barcelona La Masia'dan çıkan yeni deha ile sözleşme imzaladı",
  "Messi Inter Miami'de büyü yaratmaya devam ediyor",
  "PSG Şampiyonlar Ligi şampiyonu oldu!",
  "Galatasaray Avrupa arenasında Türk futbolunu temsil etti",
  "Vinicius Jr. Ballon d'Or ödülünü aldı",
  "Real Madrid 15. Şampiyonlar Ligi kupasını kaldırdı",
  "İngiltere Milli Takımı yeni başantrenör ile taze başlangıç",
  "Türkiye U21 Milli Takımı Avrupa şampiyonasında finale çıktı",
  "Premier Lig'in en pahalı transferi gerçekleşti: €200M",
  "Bundesliga'nın en genç golcüsü 17 yaşında hat-trick yaptı",
  "Neymar sakatlanmadan sonra ilk kez 90 dakika oynadı",
  "De Bruyne yeni sezonda 20 asist rekoru kırdı",
  "Japon futbolcular Avrupa liglerini domine ediyor",
  "Kore Cumhuriyeti Asya Kupası'nı 3. kez kazandı",
  "MLS artık dünyanın en izlenen liglerinden biri",
  "Suudi Pro League global yıldızları çekmeye devam ediyor",
  "Rodri 2024 Ballon d'Or'u kaldırdı",
  "Arsenal sezon şampiyonunu kaldırdı",
  "Atletico Madrid iki yıl üst üste La Liga şampiyonu",
  "Napoli Serie A'ya yeniden hakim oldu",
  "Ajax Amsterdam tarihsel gençlik akademisi ile öne çıktı",
  "Porto Avrupa kupasında şaşırttı",
  "Afrikalı futbolcular artık Avrupa'nın her kulübünde",
  "FIFA: Kadın futbolunun izlenme rekorları kırıldı",
  "Süper Lig'de yerli oyuncular yabancı kotasına rakip",
  "Robben futbola geri döndü mü? Çılgın iddia",
  "UEFA Şampiyonlar Ligi format değişikliği hayata geçirildi",
  "Trabzonspor 50 yıl sonra Şampiyonlar Ligi'nde",
  "Brezilya 6. Dünya Kupası'nı kazandı!",
  "Hırvatistan'dan bir dünya kupası macerası daha",
  "Türkiye Dünya Kupası yarı finaline çıktı",
  "İspanya Avrupa'da hakimiyetini sürdürüyor",
  "Maçın adamı ödülü 3 kez üst üste aynı oyuncuya",
  "Kulüp tarihinin en uzun seri galibiyet rekoru kırıldı",
  "Genç kaleci tam 3 penaltı kurtardı — efsane oldu",
  "Rakip stad ismine kavuştu — yıldıza 500M ödendi",
  "Transfer penceresi rekor kırdı: toplam 5 milyar €",
  "Yeni VAR kuralları tartışması bitmedi",
  "ScopeGoal oyuncusu milli takıma çağrıldı!"
];
```

---

## EVENTS_POOL (Kariyer Olayları)

```javascript
const EVENTS_POOL = [
  // Haftalık / tetikleyici olaylar
  { id:"e_media_interview", week: null, trigger:"fame>60",
    title:"📰 Medya Röportaj Talebi",
    desc:"Büyük bir gazeteci seni röportaj için istiyor.",
    choices:[
      { text:"Kabul Et", effect: gs => { gs.player.relationships.media += 10; gs.player.economy.gold += 200; }},
      { text:"Reddet", effect: gs => { gs.player.relationships.media -= 5; }}
    ]
  },
  { id:"e_rival_clash", week: null, trigger:"always",
    title:"⚔️ Rakip Provokasyonu",
    desc:"Rakip takımın yıldızı seni sosyal medyada tahrik etti.",
    choices:[
      { text:"Sessiz Kal", effect: gs => { gs.player.stats.morale -= 3; gs.player.relationships.media += 5; }},
      { text:"Cevap Ver", effect: gs => { gs.player.stats.morale += 5; gs.player.relationships.media -= 8; }},
      { text:"Sahada Cevap Ver", effect: gs => { gs.player.stats.shooting += 1; }}
    ]
  },
  { id:"e_fan_love", week:null, trigger:"goals>5",
    title:"💚 Taraftar Sevgisi",
    desc:"Taraftarlar sana özel tezahürat yaptı.",
    choices:[
      { text:"Kutla!", effect: gs => { gs.player.relationships.fans += 12; gs.player.stats.morale += 6; }},
      { text:"Odaklan", effect: gs => { gs.player.stats.morale += 3; }}
    ]
  },
  { id:"e_agent_offer", week:4, trigger:"always",
    title:"🤝 Menajer Teklifi",
    desc:"Tanınmış bir menajer seni temsil etmek istiyor.",
    choices:[
      { text:"Kabul Et (haftalık 200 gold)", effect: gs => { gs.player.lifestyle.hasAgent = true; gs.player.economy.weeklyExpenses += 200; }},
      { text:"Reddet", effect: gs => { }}
    ]
  },
  { id:"e_injury_minor", week:null, trigger:"fitness<40",
    title:"🩹 Küçük Sakatlanma",
    desc:"Antrenman sırasında ayak bileğini burktun.",
    choices:[
      { text:"1 Hafta Dinlen (-15⚡ sıfır antrenman)", effect: gs => { gs.time.week++; }},
      { text:"Risk Al ve Oyna", effect: gs => { gs.player.stats.pace -= 2; gs.player.stats.fitness -= 20; }}
    ]
  },
  { id:"e_new_contract", week:24, trigger:"always",
    title:"📋 Yeni Sözleşme Teklifi",
    desc:"Kulübün sana uzatma teklifi yapıyor.",
    choices:[
      { text:"İmzala", effect: gs => { gs.player.career.contractWeeksLeft += 104; gs.player.career.salary *= 1.3; }},
      { text:"Reddet (Özgür Transfer)", effect: gs => { gs.player.career.contractWeeksLeft = 0; }}
    ]
  }
];
```

---

## ARC_TYPES (Hikaye Arkleri)

```javascript
const ARC_TYPES = {
  underdog:   { label:"Sürgündeki Çocuk",  emoji:"🔥", desc:"Her şeye karşı çıktın ve yükseldik" },
  classic:    { label:"Klasik Kariyer",     emoji:"⚽", desc:"Normal başlangıç, büyük hedefler" },
  golden_boy: { label:"Altın Çocuk",        emoji:"👑", desc:"Her zaman favori, her zaman gözde" },
  rebel:      { label:"Asi Deha",           emoji:"⚡", desc:"Kurallara uymadın ama sahada harikasın" },
  comeback:   { label:"Büyük Dönüş",        emoji:"🩹", desc:"Sakatlanmadan sonra daha güçlü döndün" },
  silent:     { label:"Sessiz Efsane",      emoji:"🌑", desc:"Konuşma az, gol çok" }
};
```

---

## MATCH_CONFIG

```javascript
const MATCH_CONFIG = {
  short:  { seconds:30, criticals:[3,4],  energyCost:{ light:20, medium:30, heavy:45 } },
  medium: { seconds:60, criticals:[4,5],  energyCost:{ light:20, medium:35, heavy:55 } },
  long:   { seconds:90, criticals:[5,7],  energyCost:{ light:20, medium:35, heavy:55 } }
};

const ENERGY_COSTS = {
  match_light:20, match_medium:35, match_heavy:55,
  training_run:20, training_pass:15, training_shoot:25, training_fk:20,
  home_partner:25, home_family:5, home_game:10, home_music:5, home_pet:3,
  home_video:5, recovery_week:12
};
```
