# Test Raporu — istanbul-mafia-v2.html

**Tarih:** 2026-04-04
**Dosya:** `src/istanbul-mafia-v2.html`
**Toplam Satır:** ~2823

---

## BÖLÜM 1 — KOD ANALİZİ

### 1. HTML onclick → window expose kontrolü

| Fonksiyon | Kullanım Yeri | Expose Durumu | Sorun |
|-----------|---------------|---------------|-------|
| `goTo` | Tüm menü butonları | `window.goTo = goTo` ✓ | YOK |
| `confirmChar` | Karakter seçimi ONAYLA butonu | `window.confirmChar = confirmChar` ✓ | YOK |
| `setDiff` | Diff butonları (dN, dH, dP) | `window.setDiff = function(...)` ✓ | YOK |
| `startGame` | Harita seçimi SAVAŞA GİR, Game Over TEKRAR | `window.startGame = startGame` ✓ | YOK |
| `clearLB` | Skor tablosu SİL butonu | `window.clearLB = clearLB` ✓ | YOK |
| `togglePause` | Pause butonu, Devam Et | `window.togglePause = togglePause` ✓ | YOK |
| `restartFromPause` | Pause → TEKRAR | `window.restartFromPause = restartFromPause` ✓ | YOK |
| `menuFromPause` | Pause → MENÜ | `window.menuFromPause = menuFromPause` ✓ | YOK |
| `toggleSelectedRelic` | Relic TAK / ÇIKAR butonları | `window.toggleSelectedRelic = function(...)` ✓ | YOK |
| `handlePremiumBuy` | Premium satın al butonu | `window.handlePremiumBuy = function(...)` ✓ | YOK |
| `toggleSound` | Ses butonu | `window.toggleSound = function(...)` ✓ | YOK |
| `buildPremiumScreen` | Menü → 💎 PREMİUM MAĞAZA onclick | **YOKTU — EKSİK** ❌ | **DÜZELTİLDİ** |
| `buildLanetScreen` | goTo içinden çağrılır | `window.buildLanetScreen = buildLanetScreen` ✓ | YOK |
| `applyModifier` | Modifier kartları touchend/click | `window.applyModifier = function(...)` ✓ | YOK |

### 2. confirm() / alert() kullanımı

**Sonuç:** Kullanım yok. ✓
Tüm onay diyalogları `showModal()`, bildirimler `showToast()` ile yapılıyor.

### 3. touch-action:manipulation kontrolü

- `body`: `touch-action:manipulation` ✓
- `.screen`: `touch-action:manipulation` ✓
- `.mbtns`, `.mbtn`: `touch-action:manipulation` ✓
- `button` (global): `touch-action:manipulation` ✓
- `.relic-btn`: `touch-action:manipulation` ✓
- `.im-yes`, `.im-no`: `touch-action:manipulation` ✓
- Modifier butonları (dinamik): `touch-action:manipulation` ✓ (inline style)
- Dükkan itemleri: Programatik listener, `touch-action` CSS'de `button` global kuralı kapsar ✓

### 4. touchend handler kontrolü

- Modal butonları (im-yes, im-no): `touchend` ✓
- Karakter kartları: `touchend` ✓
- Harita kartları: `touchend` ✓
- Modifier kartları: `touchend` ✓
- Level-up kartları: `touchend` ✓
- Relic kartları: `touchend` ✓
- Premium satın al butonları: `touchend` ✓
- Global touch bridge (IIFE): tüm `<button>` elementleri için `touchend` → `click()` ✓

### 5. Tanımsız fonksiyon çağrıları

- `goTo('lanetScreen')` çağrısı var (satır 1214), ama HTML'de `id="lanetScreen"` ve `id="lanetContent"` elementleri **yoktu** ❌ → **DÜZELTİLDİ**

### 6. Syntax hataları

Dosya tarandı, syntax hatası bulunamadı. ✓

---

## BÖLÜM 2 — EKRAN EKRAN ANALİZ

### Menü Ekranı ✓
- `drawMenuCanvas()` tanımlı ve `goTo` ile çağrılıyor
- Tüm butonlar tıklanabilir
- `updateMenuStats()` doğru çalışıyor
- `buildPremiumScreen` expose edilmedi sorunu **düzeltildi**

### Karakter Seçimi ✓
- `confirmChar` expose edilmiş, çalışıyor
- Kart seçimi `click` + `touchend` listener'ları var
- Karakter kilit/açma sistemi çalışıyor
- Günlük görev widget'ı var

### Harita Seçimi ✓
- `confirmMap` yok, `startGame` kullanılıyor — doğru
- `setDiff` expose edilmiş, diff butonları çalışıyor
- Harita kartları `click` + `touchend` ile seçilabiliyor

### Modifier Seçimi ✓
- `applyModifier` `window.applyModifier` olarak expose edilmiş
- Butonlar `pointer-events:all`, `touch-action:manipulation`, `touchend` handler var

### Oyun İçi ✓
- Joystick `touchstart/move/end` ile çalışıyor
- Enemy spawn, hasar, gold, XP sistemi mevcut
- Level-up kart seçimi `click` + `touchend` var
- Boss spawn `checkBoss()` ile düzenli tetikleniyor
- Ölüm ekranı (`gover`) doğru gösteriliyor
- Pause `togglePause()` ile çalışıyor
- Ses butonu `window.toggleSound` expose edilmiş

### Dükkan ✓
- `buyItem` yok, itemler programatik `addEventListener` ile bağlı
- `touch-action` global `button` kuralı kapsar

### Ekstralar/Relic ✓
- `toggleSelectedRelic` expose edilmiş (window)
- Relic kartları `click` + `touchend` var
- `saveP()` / `buildRelicScreen()` çalışıyor

### Premium ✓
- `handlePremiumBuy` expose edilmiş
- Modal `showModal()` ile açılıyor
- `buildPremiumScreen` expose sorunu **düzeltildi**

### Başarımlar ✓
- `buildAchScreen()` verisi doğru
- `ACHS` dizisinden render ediliyor
- Tamamlanan/kilitli durumları gösteriliyor

### Skor Tablosu ✓
- `pdata.lb` localStorage'dan yükleniyor
- `buildLBScreen()` doğru render ediyor
- Veri yoksa "Henüz kayıt yok" mesajı gösteriliyor

### Lanet Kitabı ✓ (DÜZELTİLDİ)
- HTML ekranı (`id="lanetScreen"`) **eklendi**
- `id="lanetContent"` elementi **eklendi**
- `buildLanetScreen` expose edilmiş, çalışıyor

---

## BÖLÜM 3 — DÜZELTMELER ÖZETİ

### Düzeltme 1: `buildPremiumScreen` window expose

**Sorun:** Menü butonu `onclick="buildPremiumScreen();goTo('premiumScreen')"` şeklinde çağrıyor. `buildPremiumScreen` IIFE içinde tanımlı, ancak `window.buildPremiumScreen` olarak expose edilmemişti.

**Düzeltme:** `window.buildLanetScreen=buildLanetScreen;` satırının hemen altına eklendi:
```javascript
window.buildPremiumScreen=buildPremiumScreen;
```

**Satır:** ~1259

---

### Düzeltme 2: lanetScreen HTML elementi eksikti

**Sorun:** `goTo('lanetScreen')` çağrısı (satır 1214) yapılıyor ve `buildLanetScreen` fonksiyonu `document.getElementById('lanetContent')` arıyor, ancak HTML'de bu elementler yoktu. `goTo` fonksiyonu boş bir div'i `active` yapardı ya da hata verirdi.

**Düzeltme:** Relic ekranı ile game ekranı arasına `lanetScreen` eklendi:
```html
<div class="screen" id="lanetScreen">
  <div class="sh" style="border-color:#8844ff;color:#8844ff;">🔮 LANET KİTABI</div>
  <div id="lanetContent" ...></div>
  <div class="brow"><button class="bbk" onclick="goTo('menuScreen')">GERİ</button></div>
</div>
```

---

## BÖLÜM 4 — DOSYA GÜNCELLEME

- `src/istanbul-mafia-v2.html` → `www/index.html` kopyalandı ✓

---

## SONUÇ

| Kategori | Bulunan | Düzeltilen |
|----------|---------|------------|
| Expose edilmemiş fonksiyon | 1 (`buildPremiumScreen`) | 1 ✓ |
| confirm()/alert() | 0 | — |
| touch-action eksikliği | 0 | — |
| touchend handler eksikliği | 0 | — |
| Tanımsız fonksiyon çağrısı | 0 | — |
| Eksik HTML elementi (lanetScreen) | 1 | 1 ✓ |
| Syntax hatası | 0 | — |

**Toplam düzeltme: 2**
