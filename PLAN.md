# İstanbul Mafia V2 — güncel teslim planı

2 Ekim 2026 · v2 dalı · kaynak sürümü **1.0.0**. Bu tur commit/push yapılmadı. Güncel çalışma: reklam + tek seferlik IAP. **Yerel test kapısı geçti; gerçek Play/AdMob cihaz kabulü açık.** [MONETIZATION-RAPORU](qa/ab/results/MONETIZATION-RAPORU.md). Önceki dayanıklılık/performance kapıları ayrıca açık; [SOAK-RAPORU](qa/ab/results/SOAK-RAPORU.md).

## V1.0 reklam + IAP — yerel teslim

- [x] Gizlenmiş eski paket kataloğu, ücretsiz ödeme aktivasyonu, sabit fiyatlar ve eski kapalı mağaza tamamen silindi. Kayıt migrasyonu korundu; yenilenen ödeme yok.
- [x] CdvPurchase 13.18.0 + AdMob 8.1.0. Güncel eklenti Billing 9.0.0 içeriyor; Billing 7'nin 31 Ağustos 2026 normal yayın son tarihi nedeniyle 7'ye sabitlenmedi.
- [x] Beş ürün; yerel fiyat Play teklifinden. Doğrulama → tek yerel kayıtla teslim → native acknowledge/consume sonucu. Geri yükleme, iptal, hata, pending, çift bildirim ve native finish hatası ele alındı.
- [x] Google Publisher API doğrulama servisi kodu; HTTPS zorunlu istemci adresi, test kartı filtresi, ürün/paket/durum/adet denetimi. Servis yapılandırılmadan gerçek ödeme düğmesi kapalı.
- [x] UMP reklam yüklemeden önce; canRequestAds false ise reklam yok; tüm istekler NPA. Gerekli gizlilik tercihleri Mağaza'da.
- [x] İlk üç tamamlanmış turda geçiş yok; dördüncü turdan itibaren yalnız tur özeti Devam'da ≥180 sn. Gerçek saat ölçümü 180.053 ms; 179.014 ms engellendi. remove_ads sonrası geçiş 0.
- [x] İsteğe bağlı turda bir canlanma / tur sonu bir kez 2× altın. Rewarded olayı şart; erken kapatma ödül vermiyor. Ödüllüler remove_ads ile kullanılabilir.
- [x] Beş ürün gerçek CdvPurchase JS + kontrollü native köprüyle geçti; her ürünün iptal/hata yolu, temiz bağlam restore, pending→onay ve native consume hatasından kurtarma geçti. Fiziksel Play satın alımı sayılmadı.
- [x] 4 harita ×3 doğal: 8 tamamlanma, 4 çatışma ölümü; donma/çarpışma/JS 0. Temel oyun ve 4 çözünürlük regresyonları geçti. Mağaza/canlanma/2× altın görüntüleri raporda.
- [x] .env.example + ignore edilen build yapılandırması. Daha önce dokümanda bulunan gerçek reklam kimlikleri yalnız yerel .env'e taşındı. Kaynak www gerçek reklam ID ve sabit fiyat taraması 0; npm audit 0.
- [x] Android'de yalnız eklenti için app ID placeholder/ölçüm erteleme ayarları (2 dosya). Native sync/build yapılmadı. V1/unity/texture yazılmadı; oyun kayıt anahtarları aynı.
- [ ] 0/5 Play ürün kimliği / validator URL yerelde boş: Console ürünleri, hizmet hesabı yetkisi ve HTTPS servis kurulumu gerekli.
- [ ] Terminal native sync + iç test paketi; lisans testçisiyle 5 ürün, temiz kurulum/ikinci cihaz restore, UMP EEA/UK/CH ve gerçek Google test reklamı kabulü. ADB kontrolünde bağlı Android cihazı 0.
- [ ] Reklam + IAP için gizlilik/Data Safety/IARC/mağaza beyanları yeniden doğrulanacak. Eski “veri yok / reklam yok / satın alma yok” doküman onayları geçersiz olarak işaretlendi. INTERNET artık gerekli.

Kurulum ve somut cihaz test sırası: [MONETIZATION-KURULUM](docs/MONETIZATION-KURULUM.md). Yerel başarı native/yayın kabulü yerine geçmez. Commit/push yok.

## Dayanıklılık ve ilk oturum — ölçümler tamamlandı, kabul açık

- [x] Boss sandığındaki gerçek yükseltme hatası ve çift seçim koruması düzeltildi.
- [x] Temas sesi 80 ms ile sınırlı; biten ses düğümleri ve ambient filtreler temizlenir. Askıda kısa ses birikmez; hasar değişmedi.
- [x] Partikül üretimi 500 ile sınırlı; ekran dışı XP/altın/mermi/partikül çizimi atlanır. Ödül nesneleri ve rastgele sayı tüketimi korunur; görünür culling piksel farkı 0.
- [x] Gereksiz HUD metin yazımları kaldırıldı (100 sabit güncellemede 1100 → 0). Mevcut yer eşyası ikonları 32 girdiyi aşmayan çizim önbelleğinde.
- [x] Yalnız dört açık haritanın dalga 1–3 spawn/HP değerleri yumuşatıldı. Başlangıç grubu 18 → 8; spawn 0,45/0,65/0,85, HP 0,55/0,70/0,85. Dalga 4+ ve diğer alanlar 192 karşılaştırmada aynı.
- [x] Mevcut tutorial metni hareket, mesafe, XP/kart ve Dash/Shift kullanımını anlatır; 10 adım gerçek UI ile doğrulandı.
- [x] Son kaynakla 4 harita × 2 × 15 oyun dakikası tamamlandı. Donma/çarpışma/JS 0; en uzun saat beklemesi 1,485 sn (modal dahil).
- [x] Isınmış tabandan heap +%16,3–25,4; 10. dakikadan bitişe +%0,6–8,1. Bu yöntemle sekiz koşunun <%50 ve plato (≤%10) kontrolü geçti.
- [ ] Soğuk açılış tabanıyla <%50 koşulu geçmedi: artış +%73,9–92,1, 8/8 koşuda sınır üstü. Her iki başlangıç raporda açık; ilk kod/sprite yüklemesi ile kalıcı sızıntı aynı şey değildir.
- [ ] Düşük cihaz performans kapısı geçmedi: izole 4×, 10 oyun dakikası p95 **78,8 ms**, hedef ≤33 ms. 6×, 10 oyun dakikası p95 **145,5 ms**. Her iki koşuda donma/JS/çarpışma 0; yavaş bölümler raporda.
- [x] Son kaynakla 4 harita × 3 hilesiz doğal koşu: 7 tamamlanma, 5 çatışma ölümü; teknik hata 0. Eminönü'nde bir ölüm ilk 60 oyun saniyesinde (45,3 sn); erken ölüm riski tamamen kapanmış sayılmadı.
- [x] Ek ilk oturum: Kapalıçarşı/Üsküdar/Beşiktaş hilesiz 10 dk; Eminönü 70,4 sn'de ölüm. Teknik hata 0. Sürekli kaçışta geride kalan düşmanların kotayı doldurması raporlandı; dalga 4+ davranışı değiştirilmedi.
- [x] Hasar/dash, 800 doğuş, input reset, kurtarma, boss sandığı ve sınır regresyonları geçti. Dört çözünürlük × üç ardışık layout geçti; sekiz hata/ölüm çıkış senaryosu geçti.
- [x] Son kaynak SHA-256: 4ec9378256b1f698244ffac247e390ee6c75c5ac1522054733fa89e27c880c1a. 113 Android ve 18 texture dosyası aynı; localStorage anahtarları aynı, yasak ifade/test kancası 0.

Ayrıntılı kanıtlar ve yeniden çalıştırma: [SOAK-RAPORU](qa/ab/results/SOAK-RAPORU.md). Rapor üreticisi kabul sağlanmadığı için exit 1 döndürür; dosyanın oluşması kabul anlamına gelmez. Commit/push yapılmadı.

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
- [x] Geçici Gradle sürüm dosyası kaldırıldı. Oyun içi APP_VERSION=1.0.0; Terminal'in Android'e yazdığı versionName 1.0.0 / versionCode 1 salt okunur kontrolle doğrulandı.
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
- [x] Android sürüm değerleri: versionName 1.0.0 / versionCode 1. Bu tur Android kaynaklarına dokunulmadı; son web değişikliklerinin native pakete aktarımı Terminal'de.
- [x] Kaynak paket kimliği: Capacitor ve Android applicationId birlikte com.lumenco.istanbulmafia.
- [ ] Gizlilik URL'si, geliştirici hesabı, içerik derecelendirme/veri formları ve Play yayını.

Bu teslim imzalı mağaza paketi veya fiziksel cihaz kabulü yerine geçmez. Tüm kanıtlar: [GECE-RAPORU](qa/ab/results/GECE-RAPORU.md). Önceki A/B kanıtı: [TEST-RAPORU](qa/ab/results/TEST-RAPORU.md).
