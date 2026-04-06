# Istanbul Mafia — Bug Report

**Tarih:** 2026-04-06
**Dosya:** `src/istanbul-mafia-v2.html` (4270 satır)
**Tarayıcı:** Tüm platform (mobil öncelikli)

---

## [BUG-001] menuScreen CSS display:flex Override Sorunu — KRİTİK

- **Konum:** Satır 20, CSS `#menuScreen` kuralı
- **Sorun:** `#menuScreen{...display:flex...}` ID seçicisi, `.screen{display:none}` class kuralından daha yüksek specificity taşıyor. Bu nedenle `goTo()` başka bir screen'e geçtiğinde menuScreen'den `.active` class'ı kaldırılsa da, ID CSS kuralındaki `display:flex` hâlâ geçerli kalıyor. Sonuç: tüm screen geçişlerinde menuScreen arka planda görünür kalıyor, özellikle mobil'de oyun sırasında menü canvas üstüne gelebiliyor.
- **Çözüm:** `#menuScreen` CSS kuralından `display:flex` satırını kaldır. Bu değer zaten `.screen.active{display:flex}` ile sağlanıyor. menuScreen'in flex yönünü/hizalamasını `flex-direction:column;justify-content:space-between` inline olarak ayarla.

---

## [BUG-002] goTo() İçinde questScreen ve evoGuideScreen İçin Build Çağrısı Eksik

- **Konum:** Satır 1926–1940, `goTo()` fonksiyonu
- **Sorun:** `goTo('questScreen')` ve `goTo('evoGuideScreen')` çağrılarında ilgili build fonksiyonları (`buildQuestScreen`, `buildEvoGuideScreen`) goTo içinden tetiklenmiyor. Şu an onclick'lerde manuel çağrılıyor (`onclick="buildQuestScreen();goTo('questScreen')"`), bu tutarsız bir pattern ve bakım zorluğuna yol açıyor. Birisi sadece `goTo('questScreen')` dediğinde içerik boş görünür.
- **Çözüm:** goTo fonksiyonuna `if(id==='questScreen')buildQuestScreen();` ve `if(id==='evoGuideScreen')buildEvoGuideScreen();` satırlarını ekle.

---

## [BUG-003] CSS .screen Pozisyon Sorunu — Tam Ekran Kapsaması

- **Konum:** Satır 16, `.screen` CSS kuralı
- **Sorun:** `.screen{display:none;position:absolute;inset:0;...}` kuralı var, ancak `#app` relative pozisyonlu. Bu genel olarak çalışıyor. Ama `body` CSS'inde `height:100svh` kullanılmış, `#app` ise `height:100vh`. Kısa ekranlarda (iPhone Safe Area) 100svh ile 100vh arasındaki fark görselde boşluk bırakabilir.
- **Çözüm:** `#app` yüksekliğini `100svh` olarak güncelle veya `height: 100%` yap. `body` da `height:100svh` yerine `height:100dvh` daha güvenli.

---

## [BUG-004] CHAR_AUTO Objesinde abdulhey ID Hatası

- **Konum:** Satır 696, `CHAR_AUTO` objesi
- **Sorun:** `CHARS` dizisinde karakter ID'si `'abdulhey'` iken `CHAR_AUTO` objesinde `abdulheyyi` (yanlış yazılmış, fazla `yi` var). Bu karakter için otomatik yetenek hiç tetiklenmiyor.
- **Çözüm:** `CHAR_AUTO` içindeki `abdulheyyi` key'ini `abdulhey` olarak düzelt.

---

## [BUG-005] touchend Eksikliği — Kritik Butonlar

- **Konum:** Çeşitli menu butonları
- **Sorun:** Ana menü butonları (`SAVAŞA GİR`, `DÜKKAN`, `BAŞARIM`, `SKOR`, `EKSTRA`, `EVRİM`, `PREMIUM`, `GÖREVLER`) sadece `onclick` kullanıyor, `ontouchend` yok. iOS Safari'de touchend olmadan 300ms gecikme oluşabilir.
- **Çözüm:** Kritik butonlara `ontouchend="event.preventDefault();this.onclick();"` ekle ya da CSS `touch-action:manipulation` yeterli — zaten var. Bu bir düşük öncelikli uyarı, mevcut CSS çözümü yeterli.

---

## [BUG-006] JS Syntax Durumu — TEMİZ

- **Kontrol:** `new Function()` ile tüm JS bloğu test edildi.
- **Sonuç:** SYNTAX OK — Hata yok.

---

## [BUG-007] confirm() / alert() Kullanımı — TEMİZ

- **Kontrol:** Dosyada `confirm(` ve `alert(` arama yapıldı.
- **Sonuç:** Hiç kullanılmamış. `showModal()` custom modal sistemi kullanılıyor.

---

## [BUG-008] window Expose Kontrol — TAMAM

Tüm kritik fonksiyonların window'a expose edildiği doğrulandı:
- `window.goTo` ✓ (satır 1941)
- `window.confirmChar` ✓ (satır 2012)
- `window.startGame` ✓ (satır 3990)
- `window.setDiff` ✓ (satır 2386)
- `window.clearLB` ✓ (satır 2421)
- `window.buildPremiumScreen` ✓ (satır 1983)
- `window.buildEvoGuideScreen` ✓ (satır 1781)
- `window.buildQuestScreen` ✓ (satır 4083)
- `window.switchQuestTab` ✓ (satır 4076)
- `window.toggleSelectedRelic` ✓ (satır 2462)
- `window.applyModifier` ✓ (satır 1455)
- `window.toggleSound` ✓ (satır 4004)
- `window.togglePause` ✓ (satır 2710)
- `window.restartFromPause` ✓ (satır 2710)
- `window.menuFromPause` ✓ (satır 2710)

---

## Öncelik Sırası

| Bug | Öncelik | Durum |
|-----|---------|-------|
| BUG-001 menuScreen display override | KRİTİK | Düzeltilecek |
| BUG-002 goTo eksik build çağrıları | YÜKSEK | Düzeltilecek |
| BUG-004 abdulhey ID hatası | YÜKSEK | Düzeltilecek |
| BUG-003 CSS height svh/vh | DÜŞÜK | Düzeltilecek |
| BUG-005 touchend eksikliği | DÜŞÜK | CSS ile çözülmüş |
| BUG-006 JS Syntax | — | Temiz |
| BUG-007 confirm/alert | — | Temiz |
| BUG-008 window expose | — | Tamam |
