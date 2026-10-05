# V1.0 reklam ve tek seferlik satın alma kurulumu

2 Ekim 2026. Kod test varsayılanlarıyla hazırlanmıştır. Bu belge Play Console veya AdMob hesabında işlem yapmaz. Native sync, cihaz kabulü ve yayın Terminal/Gökay adımlarıdır.

## Sürümler ve yapılandırma

- Capacitor 8; `@capacitor-community/admob` 8.1.0; `cordova-plugin-purchase` 13.18.0. Son eklenti Billing **9.0.0** içerir. Brief'teki Billing 7'nin olağan yeni yayın süresi 31 Ağustos 2026'da bitti; desteklenen sürüm kullanıldı. [Google takvimi](https://developer.android.com/google/play/billing/deprecation-faq)
- `.env.example` dosyasını yerel `.env` için kullan. Gerçek kimlikler, service account dosyası ve üretilen yerel yapılandırma commit edilmez.
- `MONETIZATION_MODE=test` iken reklam **birimleri daima Google demo birimleridir**. Uygulama kimliği `.env` içinden gelir; UMP mesajı bu uygulamaya aittir. Kimlik yoksa demo uygulama kimliği kullanılır. [UMP kurulumu](https://developers.google.com/admob/android/privacy), [demo reklamlar](https://developers.google.com/admob/android/test-ads)
- `npm run monetization:prepare` yalnız seçilmiş istemci alanlarını `www/monetization-config.local.js` içine; app ID'yi kökteki `monetization.local.properties` içine yazar. İki dosya da ignore edilir. Hizmet hesabı anahtarı istemciye kopyalanmaz.
- Terminal: `npm run cap:sync -- --android` yerine `npm run monetization:prepare` ardından **`npx cap sync android`** çalıştır. Genel `npm run cap:sync` de hazırlama adımını içerir. Bu teslimde sync/build çalıştırılmadı.
- Android kaynak değişikliği yalnız AdMob app ID placeholder'ı ve rıza öncesi ölçüm başlatmayı erteleme metadatasıdır. Ağ/Billing izinleri eklentilerin manifest birleştirmesinden gelir; INTERNET artık gereklidir.

## Play Console ürünleri

Hepsi one-time product. Abonelik veya yenilenen ödeme yok. Kimlikleri `.env` alanlarına eşleştir; yerel fiyat ve satın alınabilir teklif Play'den gelir. Bir ürünün fiyatı yoksa satın alma devre dışıdır.

| Mantıksal ürün | Tür | Teslim |
|---|---|---|
| remove_ads | non-consumable | Tur sonu geçiş reklamları kapanır; isteğe bağlı ödüllü kalır |
| starter_pack | non-consumable | 2.000 altın + kalıcı altın karakter seçim çerçevesi |
| gold_small | consumable | 4.000 altın |
| gold_medium | consumable | 12.000 altın |
| gold_large | consumable | 30.000 altın |

Altın miktarları eski paketlerdeki karşılıkları korur; para fiyatı sabiti yok. Başlangıç paketi aynı kayıt üzerinde restore ile tekrar altın vermez; temiz oyun kaydında sahiplik ve başlangıç bonusu yeniden kurulur. Daha önce tüketilmiş altın paketleri geri yüklenmez; bu oyun bulut altın cüzdanı sağlamaz.

## Satın alma doğrulama servisi

`server/play-validator.cjs` Node 24 ile, ek sunucu paketi olmadan çalışır. Android Publisher API erişimli hizmet hesabı ve beş ürün kimliği gerekir. Hizmet hesabını **depo dışında**, yalnız sunucuda tut. `GOOGLE_APPLICATION_CREDENTIALS` dosyanın yoludur. Android Publisher API etkin ve uygulama için yetkilendirilmiş olmalıdır.

1. Sunucuda gerekli ortam değişkenlerini ver. `PLAY_TEST_PURCHASES_ONLY=true` ile gerçek para işlemleri reddedilir; lisans test aşamasında böyle kalmalı.
2. `node server/play-validator.cjs` loopback üzerinde açılır. HTTPS reverse proxy ile `/v1/verify` yolunu sun; istemcinin `IAP_VALIDATOR_URL` değeri bu HTTPS adresidir. `PLAY_VALIDATOR_ORIGINS` native köken için `https://localhost` içerir.
3. İstemci yalnız ürün kimliği ve Play purchase token gönderir. Sunucu, sabit paket adıyla Google `purchases.productsv2` API'sini sorgular; ürün, satın alma durumu, tüketim, adet ve test durumunu denetler. Pending veya başarısız doğrulama teslim edilmez. [Google API](https://developers.google.com/android-publisher/api-ref/rest/v3/purchases.productsv2/getproductpurchasev2)
4. Yerel oyun bakiyesi ve işlem özeti aynı `istanbul-mafia-v2` kaydında atomik yazılır. Kayıt başarısızsa finish yapılmaz. Doğrulanmış teslimden sonra CdvPurchase `finish()` çağrılır; SDK tüketilebilir ürünü consume, kalıcı ürünü acknowledge eder. Kod ayrıca native bitiş durumunu bekler. Tekrar gelen makbuz iki kez teslim edilmez. [Eklenti akışı](https://purchase.cordova.fovea.cc/use-cases/consumable-googleplay)
5. Servis satın alma verisini diske/loga yazmaz; proxy loglarında token/body kaydetme. Yerel teslim defteri sunucunun ürettiği token hash'ini kullanır. Oyun içi yerel bakiye, sunucuda tutulan bir cüzdan değildir. Ücretli bir rekabetçi ekonomi veya hesaplar arası tüketilebilir bakiye taşınması istenirse ayrıca kimlik doğrulamalı sunucu cüzdanı gerekir.

Servis adresi/ürünler yoksa **ücret tahsil edebilecek düğme açılmaz**. Uydurma doğrulama veya ücretsiz aktivasyon geri dönüşü yok. Play sorgusu olmadan yeni hak verilmez; önceden doğrulanmış kalıcı hak çevrimdışı önbellekten korunur. Başlangıçta ve geri yüklemede Play sorgusuyla eşleştirilir; Play'in artık bildirmediği kalıcı hak kaldırılır.

## Reklam yerleşimi ve rıza

- UMP her native açılışta yenilenir. Gerekli form kapanmadan, `canRequestAds=true` olmadan reklam SDK'sı başlatılmaz/reklam yüklenmez. Rıza veya ağ hatası oyunu reklam olmadan bırakır.
- V1.0 **tüm reklam isteklerinde `npa:true`** kullanır. Reddetme sonrasında UMP istek yapılmasına izin verirse kişiselleştirilmemiş/sınırlı reklam; izin vermezse hiç reklam yok. `OBTAINED` kişiselleştirme onayı varsayılmaz.
- UMP gerekli gördüğünde Mağaza'da **Gizlilik tercihleri** görünür. Form yapılandırması AdMob Privacy & messaging bölümünde yapılmalıdır. EEA testi yalnız test cihazlarında, `.env` içindeki test cihaz listesi ve `UMP_TEST_EEA=true` ile yapılır.
- İlk üç **tamamlanmış** turda geçiş reklamı yok. Dördüncü turdan itibaren yalnız tur özeti **Devam** geçişinde ve en az 180 saniye arayla. Açılış/oyun içi/banner/app-open reklam yok. Son gösterim zamanı kalıcıdır; aynı oturumda monoton saat de kontrol edilir.
- İsteğe bağlı ödüllü reklamlar ilk üç turda da yalnız oyuncunun açık düğme basışıyla mümkündür. Canlanma: turda bir kez, %50 can + 3 saniye koruma. Tur sonu: kazanılan tur altınını bir kez ikiye katlar. Reklamı kapatmak ödül sayılmaz. Ödüllü gösterim de sonraki geçiş reklamını 180 saniye erteler.

## Native kabul sırası

1. İmzalı iç test paketi, Play lisans testçisi, beş aktif tek seferlik ürün ve çalışan HTTPS doğrulama servisi hazır olsun.
2. Her ürün: onaylayan test kartı, iptal, reddeden test kartı, bekleyen → onaylanan ödeme. Ürün/para artışı bir kez; consumable tekrar alınabilir. Uygulamayı ödeme sonrasında kapatıp restore ile eksik teslimi tamamla.
3. Uygulama verisini temizle veya ikinci cihaz kullan; aynı Play hesabıyla iki kalıcı ürünü geri yükle. Tüketilen altın tekrar gelmemeli.
4. EEA/UK/CH UMP formu; ret/izin/ağ hatası ve gizlilik seçenekleri. Native logda rızadan önce load olmamalı; gerçek reklam birimine istek gitmemeli.
5. İlk üç tur / dördüncü tur / 179–180 saniye / remove_ads / gönüllü canlanma ve 2× altın. Native kapatma ve arka plan dönüşünü de dene.
6. Yenilenmiş gizlilik, Data Safety, reklam içerir, satın alma ve IARC beyanlarını gerçek APK manifesti/SDK davranışıyla doğrula. Eski “veri toplanmıyor” politikası bu sürüm için geçersizdir.

Yerel kanıtlar [MONETIZATION-RAPORU](../qa/ab/results/MONETIZATION-RAPORU.md). Native testler yapılana kadar mağaza kabulü kapalı sayılmaz. Commit/push bu görevde yok.
