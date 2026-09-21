# İstanbul Mafia V2 — Gece Vardiyası

**Sürüm: 2.0.0-preview.1** · 17 Eylül 2026

Bu, mevcut oyundan ayrılan, oynanabilir bir grafik ve arayüz yenilemesidir. V1 kaynakları değiştirilmedi. Yayın sürümü değildir; gerçek Android cihazda uzun oyun ve görsel onay bekler.

## Çalıştırma

- Windows: `BASLAT.bat` dosyasını aç. Node.js kurulu olmalı. Geliştirme sunucusu yalnızca `127.0.0.1:8795` adresini dinler.
- Terminal: `npm start`, ardından `http://127.0.0.1:8795`.
- Grafik atölyesi: `http://127.0.0.1:8795/atelier.html`.
- Web önizlemesi için `npm install` gerekmez. Uygulama çevrimdışı çalışır; font ve görseller yereldir.
- Android kaynaklarını yeniden derlemek için `npm ci`, `npm run cap:sync`, ardından `android/gradlew.bat -p android assembleDebug`. JDK 21 ve Android SDK gerekir.

## Değişenler

- Sekiz özgün 24×32 karakter, dört kare yürüyüş döngüsü, yön çevirme ve karaktere özel kıyafet/silah ayrıntıları.
- Düşmanların piksel ölçeği birleştirildi. Çay, para ruhu, nazar, halı, araçlar, martı ve nargile ayrı siluetlerini korur. TESTERE'nin testere silueti ve boss can göstergesi vardır.
- Kapalıçarşı tenteleri, ahşap tezgâhlar ve ürünler; Balat cepheleri; Üsküdar tekneleri; Taksim büfeleri; taş zemin, varil ve sütun çizimleri.
- Altı açık harita yeni çizim katmanını kullanır. Dokuz zemin paleti, gelecekteki kapalı haritalar için de hazırdır; harita kilitleri açılmadı.
- Yeni İstanbul silueti, ana menü, karakter kartları, harita önizlemeleri ve daha sakin metal/taş renk paleti.
- Keskin XP, altın ve sağlık simgeleri; küçük, konturlu hasar sayıları; oyuncu üzerindeki sürekli büyük parlama kaldırıldı.
- Görünmeyen büyük yapısal çarpışma engelleri çiziliyor. Nazar ışınındaki çift kamera ofseti düzeltildi.
- Atılma ayrı düğmeye ve Shift tuşuna taşındı. Atılma yolu duvarlarla sınanır; duraklatılmış oyunda çalışmaz. Çift dokunmanın hem atılma hem duraklatma yapması kaldırıldı.
- Sakin efektler ve sade HUD tercihleri kalıcı olarak saklanır.
- PNG doku paketi doğrudan değiştirilebilir. Eksik veya yanlış boyuttaki paketler kodla çizilen varsayılan görsele düşer.

## Kontroller

WASD / yön tuşları: hareket · Mobil: sürükleme · Shift / ATIL: atılma · Boşluk / Ⅱ: duraklatma.
Silahlar otomatik ateş eder. Seviye atlama ve karakter/harita seçim akışı korunur.

## V1 güvenliği ve geri dönüş

| Alan | V1 | V2 |
|---|---|---|
| Android uygulama kimliği | `com.lumenco.istanbulmafia` | `com.lumenco.istanbulmafia.v2` |
| Tarayıcı kayıt anahtarı | `imv7` | `istanbul-mafia-v2` |
| Görüntü ayarları | — | `istanbul-mafia-v2-display` |

V2 APK, farklı uygulama kimliği sayesinde V1'in yanına kurulabilir. V1'e dönmek için eski uygulamayı/projeyi açmak yeterlidir. V2'yi kaldırmak V1'i kaldırmaz.

Menüdeki **V1 KAYDINI KOPYALA**, yalnızca aynı tarayıcı origin'inde erişilebilen V1 kaydını, henüz oynanmamış V2 kaydına kopyalar. Farklı portlar ve Android uygulamaları ayrı depolama alanlarıdır; bu düğme başka bir Android uygulamasının verisini okuyamaz. V1 kaydı hiçbir zaman değiştirilmez. Aktarım otomatik değildir ve tek seferliktir.

`v1-baseline.json`, başlangıç HTML dosyasının SHA256 değerini içerir. QA bu dosyanın değişmediğini doğruladı. Commit veya push yapılmadı.

## Dosya düzeni

- `www/index.html`: oyun mantığı ve ekranlar.
- `www/art-v2.js`: özgün piksel çizimleri, sprite ve zemin önbellekleri, PNG yükleyici.
- `www/v2.css`: V2 arayüzü ve mobil düzen.
- `www/textures/`: sekiz karakter şeridi ve dokuz zemin şeridi.
- `www/atelier.html`: gerçek çizim fonksiyonlarıyla çalışan hareketli grafik galerisi.
- `android/`: V2 uygulama kimliğine sahip Android kaynakları.
- `qa/`: test sonuçları, ekran görüntüleri ve paket doğrulaması.

## Doğrulama ve sınırlar

`qa/results.json` otomatik kontrolleri içerir: ekran boyutları, dokunma, atılma/duvar, duraklatma, tek seferlik XP, kayıt ayrımı, altı harita, karakterler/düşmanlar, TESTERE, eksik PNG fallback ve 60 saniyelik hareketli simülasyon.

Simülasyon testi hasar bağışıklığıyla çalıştırıldı; denge testi değildir. Çizim süresi ölçümü masaüstü Edge'de 120 düşmanla yalnızca render maliyetini ölçer; mobil FPS sonucu değildir. Gerçek telefonda 10–15 dakikalık oynanış, batarya ve dokunma ergonomisi ayrıca doğrulanmalı. Mevcut ekonomi, görevler ve kilit koşulları korunur. Bu teslim tüm eski oyun mantığının yeniden yazılması değildir.

Görseller bu proje için kodla çizildi. Vampire Survivors görselleri kopyalanmadı; küçük ölçekte okunabilirlik referans alındı. API anahtarı, keystore, node_modules ve derleme önbelleği teslim paketine eklenmedi.
