# 2 Ekim 2026 — harita erişimi düzeltmeleri

## Değişiklikler

- Taksim: unlockLevel:15. Hesap seviyesi 15 altında kart seçilemiyor ve HESAP LVL 15 şartı görünüyor. Balat aynı kilit mekanizmasını kullanmaya devam ediyor.
- Eminönü: mevcut kart etiketindeki ORTA, ZOR olarak değiştirildi. diff ve düşman hızı/canı, doğuş, ödül, boss ve süre değerleri aynen korundu.
- Kilitli kartlar ve Eminönü kartının flex daralması engellendi; şart ve rozet kartın içinde kalıyor.
- Geçici qa/release/version.init.gradle dosyası kaldırıldı. APP_VERSION=1.0.0 korundu. Android sürüm kaynağı Terminal kapsamındadır.

## Kontrollü testler

[Harita erişimi](access/map-access.json): yeni hesap seviye 1. Taksim tıklama ve dokunmayla seçilemiyor. Kapalıçarşı, Üsküdar, Beşiktaş ve Eminönü arayüzden seçiliyor. 13999 hesap XP'sinde seviye 14/kilitli; 14000 XP'de seviye 15/açık. Yalnız bu sınır testi hesap XP'sini geçici bellekte değiştirir.

390×844, 540×1310, 844×390, 932×430: her boyutta kilit yazısı ve ZOR rozeti kart içinde. [Taksim](access/taksim-locked-card.png), [Eminönü](access/eminonu-hard-card.png).

İlk doğal denemede hazine sandığı ikinci seçim beklerken QA ilk, devre dışı kalmış kartı yeniden tıklıyordu. QA seçilebilir bir sonraki karta basacak şekilde düzeltildi; oyun kodunda hazine mekaniği değiştirilmedi. [İki seçim ve normal seviye seçimi regresyonu](natural-ui/natural-ui.json) geçti. [Hata/ölüm çıkış kodu regresyonları](exit/exit-regression.json): teknik hatalar exit 1, tek başına ölüm exit 0.

## Doğal oynanış

Son kaynakla açık dört haritada üçer koşu: **12 koşu, 6 üç dakikalık tamamlanma, 6 çatışma ölümü. Donma 0, örneklenen çarpışma ihlali 0, JS hatası 0.** Tüm kayıtlar yeni, harita seçimi gerçek arayüzden, hile/modifier kapalı. Hareket ve yükseltmeler Playwright klavye/tıklamalarıyla. Oyun zamanı hızlandırılmadı, tur gücü/can değiştirilmedi.

| Harita | Koşu | 180 sn | Ölüm | Oyun süresi (sn) |
|---|---:|---:|---:|---|
| kapalicarsi | 3 | 3 | 0 | 180.18 / 180.14 / 180.13 |
| uskudar | 3 | 3 | 0 | 180.08 / 180.06 / 180.16 |
| besiktas | 3 | 0 | 3 | 3.71 / 133.92 / 2.78 |
| eminonu | 3 | 0 | 3 | 37.46 / 45.18 / 77.6 |

Ölüm teknik hata sayılmaz; erken ölümler üç dakikalık stabilite veya denge onayı değildir. Taksim doğal koşuya zorla açılmadı; yeni hesapta kapalı olma koşulu kontrollü testte doğrulandı.

[12 koşunun tamamı](natural-final-12.json), [özet](FINAL-SUMMARY.json). Kaynak SHA-256: dc5534117d8302eb3730aaf6a77c08d9d8e97254818e391dd4e4e3e69c934cae.

İlk denemeler natural-a/ ve natural-b/ altında tutuldu; kabul sayısına eklenmedi. Eminönü'ndeki sandık beklemesi başarısız kayıt olarak korunuyor. İlk Üsküdar grubunda karakter seçimi zaman aşımına uğradığı için grup eksik kaldı; son dört-harita koşusunda tekrar edilmedi. Başarısız denemeler temizmiş gibi yeniden etiketlenmedi.

## Kapsam ve devir

[Kapsam kanıtı](scope.json): bu tur üretim HTML'sinde yalnız dört satırlık değişiklik; başka harita/denge/mekanik değeri değişmedi. Yasak ifade taraması 0; V1'de 262 başlangıç dosyası aynı. Bu ajan android/ ve unity/ dosyalarına yazmadı. Çalışma sırasında ayrı bir işlem Android web varlıklarını güncelledi; gözlenen farklar kapsam kaydında ayrıca belirtilir.

**Terminal son www/ değişikliklerini yeniden native kopyaya eşitlemeli.** Android'deki index.html son web kaynağıyla aynı hash'te değil. Geçici init komutu kullanılmayacak. Android kaynak sürümü ve imzalı paket doğrulaması Terminal'e aittir. Commit/push yapılmadı.
