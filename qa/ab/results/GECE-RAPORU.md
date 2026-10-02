# İstanbul Mafia — gece teslim raporu

1 Ekim 2026 · v2 dalı · commit yok. Bloklar tamamlandıkça bu dosyaya eklenir.

## Blok 1 — oynanabilirlik tamamlandı

Mevcut App.addListener('backButton') bağlantısı korunup gerçek kayıtlı callback üzerinden sınandı. Oyunda pause ve giriş sıfırlama, menüde onay/iptal/exitApp çağrısı geçti. [Köprü testi](night/block1/native-back.json). Bu test Capacitor köprüsünü taklit eder; fiziksel Android doğrulaması değildir.

HUD görünürlük + pozitif boyut + sınır + (0,0) reddi mevcut. 4 çözünürlük × 3 ardışık koşu geçti. [Koşu 1](night/layout-before-1/layout.json), [2](night/layout-before-2/layout.json), [3](night/layout-before-3/layout.json). 844×390 ultHud: (597,218), 36×42. [Sıfır boyut enjeksiyonu](night/layout-negative/negative.json) exit 1.

Doğal test gerçek hatada exit 1, çatışma ölümünde death:true ve exit 0 üretir. Donma, JS, çarpışma, erken bitiş ve ölümle birlikte hata senaryoları ayrı çocuk süreçlerde doğrulandı: [8 regresyon](night/exit/exit-regression.json). 15 sn değişmeyen oyun saati donma, 600 sn tamamlanmayan koşu timeout; yanıt vermeyen renderer için 630 sn watchdog vardır.

### Doğal oynanış — kontrollü testlerden ayrı

8 harita × 3 = **24 koşu**, 8 üç dakikalık tamamlanma, 16 çatışma ölümü. Donma 0, örneklenen çarpışma ihlali 0, JS hatası 0. Can/hız/silah/ölümsüzlük değiştirilmedi, tur gücü yok. Rota yalnız okunur durumla seçildi; hareket ve seçimler Playwright klavye/arayüz ile. İnsan telefon testi değildir. Kapalı harita kapsamı için Balat, Kasımpaşa ve Bursa'da yalnız QA kurulumunda harita seçildi; oyun içi kapıları açılmadı, kayıtlar boş. Önceki QA yardımcısının her Üsküdar dışı seçimi Beşiktaş'a yönlendirmesi düzeltildi; istenen/gerçek harita eşitliği artık doğrulanır.

| Harita | Koşu | 180 sn | Ölüm | Süreler (sn) |
|---|---:|---:|---:|---|
| kapalicarsi | 3 | 3 | 0 | 180.16 / 180.13 / 180.06 |
| uskudar | 3 | 3 | 0 | 180.08 / 180.19 / 180.08 |
| balat | 3 | 0 | 3 | 2.88 / 3.12 / 4.56 |
| besiktas | 3 | 2 | 1 | 4.05 / 180.13 / 180.08 |
| taksim | 3 | 0 | 3 | 1.81 / 2.05 / 2.02 |
| eminonu | 3 | 0 | 3 | 4.14 / 66.74 / 82.82 |
| kasimpasa | 3 | 0 | 3 | 2.46 / 2.70 / 2.50 |
| bursa | 3 | 0 | 3 | 2.08 / 2.21 / 2.37 |

[24 koşunun tüm sonuçları](night/natural-24.json). Zor haritalardaki 2–5 sn ölümler hata olarak sayılmadı; bu haritalarda uzun süreli oynanış kanıtı yok. Denge/telefon testi açısından açık risk olarak tutulur.

Görsel değişiklik öncesi: [menü](night/block1/before-menu.png), [çatışma](night/block1/before-combat.png).

## Blok 2 — C fazı tamamlandı

Mevcut PNG texture pack aynen korundu. Tek CSS palet bloğunda altın ana aksiyon, turkuaz görev/dükkân, ruby başarım/skor, mor ekstra/evrim renkleri tanımlandı. Kalın piksel çerçeve, iç parlak kenar ve kısa basılma hareketi eklendi. Aynı yedi menü düğmesi korundu; kategorilere aynı SVG piksel dilinde ikon + başlık + kısa açıklama eklendi. Yeni özellik, kart veya menü yok.

Zemin görüntüsü .56 alfa ile koyu tabana çiziliyor; texture dosyaları değişmedi. Oyuncunun ayak hizasına sabit turkuaz işaret eklendi; düşman ve mermi çizimleri korunuyor. Tam ekran seviye parlaması kaldırıldı. Seviye/altın/başarım/ekstra geri bildirimi yerel alanla sınırlı; sakin hareket ayarında animasyon yok. [Gerçek olay testinde](night/block2/feedback.json) efektler 542–544 ms, en uzun ses dizisi 380 ms; JS hatası 0.

[Önce menü](night/block1/before-menu.png) → [sonra menü](night/block2/after-menu.png). [Önce oyun](night/block1/before-combat.png) → [sonra oyun](night/block2/after-combat.png). Bunlar başlangıç kadrajlarıdır; mağaza için yoğun çatışma kareleri Blok 3'te hazırlanır.

Görsel değişiklik sonrasında 4 çözünürlük × 3 ardışık layout geçti ([1](night/layout-after-1/layout.json), [2](night/layout-after-2/layout.json), [3](night/layout-after-3/layout.json)); [kontrollü oynanabilirlik](night/controlled-after/controlled.json) ve [geri tuşu](night/block2/native-back.json) yeniden geçti. Menü ve oyun ekranları görsel olarak incelendi.

## Blok 3 — yayın dosyaları tamamlandı

Oyun içi tek APP_VERSION=1.0.0. Başlık altı ve footer aynı sabitten beslenir; www içinde preview sürüm metni kalmadı. package.json/package-lock sürümü 1.0.0; runtime bağımlılıkları değişmedi.

1 Ekim'de geçici Gradle sürüm dosyasıyla ayrı Android kopyasında processDebugMainManifest doğrulandı: [tarihsel manifest kanıtı](night/release-manifest.xml). **2 Ekim kararıyla geçici dosya kaldırıldı ve bu yöntem artık kullanılmıyor.** Terminal, android/app/build.gradle içinde versionName=1.0.0 ve versionCode=1 değerlerini doğrudan yazacak. Bu kaynak henüz değiştirilmedi; tarihsel manifest güncel Android derlemesinin kanıtı değildir. AAB/APK üretilmedi.

Geçici kopyada Java Windows soket yolu ve Türkçe kullanıcı klasörü sorunları çıktı; yalnız doğrulama sürecinin geçici yol/Gradle ayarlarıyla çözüldü. Asıl proje ayarları değiştirilmedi.

### Mağaza dosyaları

- [Menü](screenshots/01-menu.png), [çatışma](screenshots/02-combat.png), [seviye seçimi](screenshots/03-level-up.png), [boss](screenshots/04-boss.png), [dükkân](screenshots/05-shop.png): beşi de **1080×1920 RGB PNG**.
- [Play ikonu](screenshots/play-icon-512.png): **512×512**, 1 MB altında. [Feature graphic](screenshots/feature-1024x500.png): **1024×500 RGB**, alfa yok.
- assets/ altında 1024×1024 ikon kaynakları; @capacitor/assets **3.0.5** ile Android üretimi ayrı staging klasöründe yapıldı. Yalnız 24 mipmap PNG ve launcher XML kaynakları aktarıldı. Runtime paketi eklenmedi.
- Ekranlar gerçek oyun çizicisinden alınan kontrollü sahnelerdir: düşman konumu, sayaç, boss canı ve dükkân bakiyesi yalnız geçici tarayıcı belleğinde hazırlanmıştır. Bunlar doğal oynanış kanıtı olarak kullanılmaz. [Çekim kaydı](screenshots/capture.json). Yeni portre üretilmedi; mevcut sprite/font/logo dili kullanıldı.
- TR/EN metinler docs/store-listing-tr.md ve docs/store-listing-en.md içinde. Başlıklar ≤30, kısa açıklamalar ≤80 karakter. Kapalı harita/karakterlerin oynanabilir olduğu vaat edilmedi.

Teknik kaynaklar: [Google Play görsel ölçüleri](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en), [Capacitor Assets](https://github.com/ionic-team/capacitor-assets/blob/main/README.md).

### Nihai sürüm yeniden doğrulaması

Görsel ve sürüm değişikliklerinden **sonra** 8 harita × 3 yeni koşu daha yapıldı. Bu 24 koşunun kaynak SHA-256 değeri teslimdeki index.html ile aynı: `f53a353ab32ec2292086bb22f26e966d40e8a0661b0f042fb294cf91f0ea44a8`. Sonuç **7 tamamlanma + 17 çatışma ölümü**, donma/çarpışma ihlali/JS hatası **0**. Önceki 24 koşu ayrı tutuldu; toplam 48 deneme. Ölüm, başarıyla üç dakika hayatta kalma anlamına gelmez.

| Harita | Koşu | 180 sn | Ölüm | Süreler (sn) |
|---|---:|---:|---:|---|
| kapalicarsi | 3 | 3 | 0 | 180.08 / 180.03 / 180.14 |
| uskudar | 3 | 2 | 1 | 106.85 / 180.00 / 180.03 |
| balat | 3 | 0 | 3 | 3.02 / 3.04 / 3.26 |
| besiktas | 3 | 2 | 1 | 5.95 / 180.11 / 180.05 |
| taksim | 3 | 0 | 3 | 1.82 / 2.14 / 2.02 |
| eminonu | 3 | 0 | 3 | 59.46 / 63.41 / 64.82 |
| kasimpasa | 3 | 0 | 3 | 2.21 / 2.48 / 2.64 |
| bursa | 3 | 0 | 3 | 2.14 / 2.34 / 2.78 |

[Son 24 koşu](night/natural-final-24.json). Dört çözünürlük × üç ardışık layout son sürümde de geçti: [1](night/layout-final-1/layout.json), [2](night/layout-final-2/layout.json), [3](night/layout-final-3/layout.json). [Son ödül ölçümü](night/feedback-final/feedback.json): 541–543 ms, ses 380 ms.

[Son kaynak/asset denetimi](night/release-audit.json): www yasak ifade taraması **0**, üretim test kancası **yok**, 262 V1 dosyası ve 112 Android başlangıç dosyası (ikonlar hariç) korunuyor, 18 texture dosyası aynı. Başlangıç hash envanteri build/.gradle/node_modules önbelleklerini dışlar. localStorage anahtarları değişmedi. Unity dizini yok ve oluşturulmadı.

## Terminal'e kalan yayın adımları

1. Gerçek telefonda geri tuşu, arka plan/dönüş, 10–15 dakika oyun ve zor harita dengesi. Özellikle 2–6 sn ölümle biten haritalarda uzun süreli güvence yok.
2. Native web dosyalarını eşitle; bu tur android/assets kısıtı nedeniyle güncellenmedi. Terminal önce android/app/build.gradle sürümünü 1.0.0 / 1 yapacak, ardından Android klasöründen normal `gradlew.bat bundleRelease` ile derleyecek. Geçici init script kaldırıldı. Yayın anahtarıyla imzalı AAB ayrı bir kabul adımıdır.
3. Paket kimliği şu an **com.lumenco.istanbulmafia.v2**; eski yayın checklist'inde .v2 olmayan kimlik yazıyor. Play uygulaması oluşturulmadan doğru kimlik kesinleştirilmeli; kaynak kimlik değiştirilmedi.
4. Gizlilik politikası URL'si, Play hesabı, IARC/Data Safety ve mağaza formlarını tamamla. Mevcut INTERNET izni korundu; kaldırma/telefon doğrulaması Terminal kapsamındadır.

**Teknik ve görsel teslim hazır; imzalı mağaza paketi ve cihaz kontrolü henüz tamamlanmış değil. Commit/push yapılmadı.**

## 2 Ekim — kabul sonrası harita düzeltmeleri

Taksim hesap seviyesi 15 ile kilitlendi; Eminönü kartına ZOR etiketi eklendi. Geçici Gradle sürüm dosyası kaldırıldı. Son kaynakta 4 harita × 3 doğal koşu: 6 tamamlanma, 6 ölüm, teknik hata 0. Hazine sandığında ikinci seçimi yapamayan QA düzeltildi; oyun mekaniği değişmedi. [Güncel test raporu](map-gates-20261002/TEST-RAPORU.md). Önceki kaynak hash'i ve koşular 1 Ekim teslimine aittir.
