# İstanbul Mafia V2 — güncel teslim planı

2 Ekim 2026 · v2 dalı · kaynak sürümü **1.0.0**. Commit/push yapılmadı. Gece teslimine Taksim hesap kilidi, Eminönü etiketi ve geçici Gradle sürüm dosyasının kaldırılması eklendi.

## Blok 1 — oynanabilirlik

- [x] Mevcut Capacitor App geri tuşu bağlantısı: oyunda pause, menüde çıkış onayı. Kayıtlı native callback ile QA; fiziksel cihaz kapısı aşağıda.
- [x] HUD görünür, genişlik/yükseklik pozitif; (0,0) ve sıfır boyut FAIL. Dikey/yatay dört boyutta üç ardışık koşu.
- [x] Doğal test hata/ölüm ayrımı: hata exit 1, ölüm ayrı death alanı ve exit 0; hata+ölüm birlikteyse exit 1.
- [x] Sekiz harita × üç doğal koşu: önce ve son sürümde ayrı ayrı 24, toplam 48. Son 24: 7 tamamlanma, 17 çatışma ölümü; 0 donma/çarpışma ihlali/JS hatası. Kilitli üç harita yalnız QA girişinde seçildi, oyun dengesi değiştirilmedi.
- [x] A1–A7 ve B1–B2 regresyonları; ortak dünya geometrisi, doğuş, hasar, giriş sıfırlama, kurtarma ve grid korunuyor.

## Blok 2 — görsel

- [x] Tek CSS palet bloğu: altın ana aksiyon, turkuaz/ruby/mor kategoriler.
- [x] Piksel çerçeve, metal kenar, basılma hareketi; aynı yedi menü düğmesi.
- [x] Menü, dükkân ve seviye kartlarında ortak piksel ikon dili.
- [x] Dört ödül olayı: 541–543 ms görsel, en fazla 380 ms ses; sakin hareket ayarına uyum.
- [x] Zemin kontrastı azaltıldı, sabit oyuncu işareti eklendi; 18 mevcut texture dosyası aynı. Yeni portre yok.
- [x] Menü/oyun önce-sonra görüntüleri; kumar ikonografisi kullanılmadı.

## Blok 3 — yayın dosyaları

- [x] Tek APP_VERSION 1.0.0; paket metadatası uyumlu, yeni runtime bağımlılığı yok.
- [x] Geçici Gradle sürüm dosyası kaldırıldı. Oyun içi APP_VERSION=1.0.0 korunuyor; gerçek Android sürüm değerleri Terminal tarafından yazılacak.
- [x] Beş 1080×1920 mağaza ekranı: menü, çatışma, seviye, boss, dükkân. Kontrollü sahne kurulumu raporda ayrı.
- [x] 512×512 Play ikonu, 1024×500 RGB feature graphic, 24 Android mipmap PNG; mevcut sanat dilinden üretildi.
- [x] docs/store-listing-tr.md ve docs/store-listing-en.md. Kapalı içerik vaat edilmez.
- [x] www yasak ifade taraması 0; üretim test kancası yok.
- [x] V1 ve Android ikon dışı kaynak hash'leri korundu. Unity yok; localStorage anahtarları aynı.

## 2 Ekim kabul düzeltmeleri

- [x] Taksim: hesap LVL 15 kilidi; tıklama/dokunma ve 14/15 seviye sınırı geçti.
- [x] Eminönü: ZOR rozeti; dört ekran boyutunda etiketler kart içinde.
- [x] Geçici Gradle init dosyası kaldırıldı; Android'e bu ajan tarafından müdahale edilmedi.
- [x] Son kaynakla açık 4 harita × 3 doğal koşu: 6 tamamlanma, 6 ölüm; donma/çarpışma/JS hatası 0.
- [x] QA hazine sandığında iki ayrı seçilebilir kartı kullanıyor; hata/ölüm çıkış kodu regresyonları geçti.

[2 Ekim test raporu](qa/ab/results/map-gates-20261002/TEST-RAPORU.md). Terminal son web kaynaklarını yeniden native kopyaya eşitlemeli.

## Terminal / hesap sahibinin yayın kapıları

- [ ] Fiziksel Android: geri tuşu, arka plan, uzun oyun ve zor harita dengesi. Çok kısa ölümle biten koşular uzun süreli stabilite kanıtı değildir.
- [ ] Native web asset sync; mevcut Android kopyası kaynak kısıtı nedeniyle güncellenmedi.
- [ ] Terminal: android/app/build.gradle içinde versionName 1.0.0 / versionCode 1 değerlerini yaz, ardından normal gradlew.bat bundleRelease ile imzalı AAB üret. Bu tur Android kaynaklarına dokunulmadı.
- [ ] Play paket kimliğini doğrula: kaynak com.lumenco.istanbulmafia.v2; eski checklist farklı kimlik belirtiyor.
- [ ] Gizlilik URL'si, geliştirici hesabı, içerik derecelendirme/veri formları ve Play yayını.

Bu teslim imzalı mağaza paketi veya fiziksel cihaz kabulü yerine geçmez. Tüm kanıtlar: [GECE-RAPORU](qa/ab/results/GECE-RAPORU.md). Önceki A/B kanıtı: [TEST-RAPORU](qa/ab/results/TEST-RAPORU.md).
