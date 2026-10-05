# Monetization test raporu — 2 Ekim 2026

**Yerel kod/test kapısı: GEÇTİ. Native Play/AdMob kabulü: AÇIK. Mağazaya yayın onayı verilmedi.** Branch v2, APP_VERSION 1.0.0. Commit/push/sync/APK yapılmadı.

Önceki dayanıklılık teslimindeki açık performans/soğuk heap kapıları bu görevle kapanmaz; [SOAK-RAPORU](SOAK-RAPORU.md) geçerlidir.

## Teslim edilen kod

- Gizlenmiş eski paket kataloğu, sabit fiyatlar, ücretsiz altın verme/aktivasyon, eski satın alma ve restore ekranı silindi. Eski karakter/kayıt adlarının veri migrasyonu korundu. Yeni mağazada yalnız beş tek seferlik ürün var.
- CdvPurchase 13.18.0 ve AdMob 8.1.0 sabit sürümle kuruldu. CdvPurchase **Billing 9.0.0** içerir; brief'teki 7 yerine yayın süresi devam eden sürüm seçildi. Billing 7 normal son tarihi 31 Ağustos 2026. [Resmi takvim](https://developer.android.com/google/play/billing/deprecation-faq)
- Play teklifindeki yerel fiyat okunur. Ürün/fiyat veya HTTPS doğrulama adresi eksikse ücretlendirme düğmesi kapalı. Ürün ödülleri: remove_ads, başlangıçta 2.000 altın + çerçeve, 4.000/12.000/30.000 altın. Abonelik yok.
- Sunucu Google Publisher API ile ürün/token/durum/adet/test durumunu doğrular. İstemci onaylı teslimi bakiye ile aynı localStorage kaydına yazar; sonra finish çağırır. Bu SDK finish sonucunu erken döndürebildiğinden gerçek native finished/acknowledged/consumed durumu ayrıca beklenir. Depolama veya consume hatasında restore aynı ödeme için çift altın vermez.
- Kalıcı haklar Play sorgusuyla başlangıçta/restore'da güncellenir. Tüketilmiş altın yeniden verilmez. Başlangıç bonusu mevcut kayıtta tek seferdir; temiz oyun kaydında paket geri kurulur. Yerel altın cüzdanı bulut senkronizasyonu değildir.
- UMP gerekli form ve canRequestAds kontrolü reklam yüklemeden önce. V1.0 tüm isteklerde NPA kullanır; UMP istek izni vermezse reklam yok. Gerekli gizlilik seçenekleri Mağaza'da erişilebilir. [Google UMP](https://developers.google.com/admob/android/privacy)
- Açılış, aktif oyun, HUD veya banner reklamı yok. Geçiş yalnız tur sonu özeti Devam düğmesinde, dördüncü tamamlanmış turdan itibaren, ≥180 sn. remove_ads geçişi kapatır. İsteğe bağlı ödüllü ilk turdan itibaren açık düğmeyle kullanılabilir; ilk üç tur kısıtı otomatik geçiş reklamına aittir.
- Canlanma turda bir kez, %50 can + 3 sn koruma; tur sonu 2× altın bir kez. Native Rewarded olayı olmadan teslim yok; yalnız reklamı kapatma veya resolve olan gösterim çağrısı yeterli değil.

## Doğal oynanış — ayrı kanıt

Yeni tarayıcı bağlamı/kayıt; gerçek rAF, UI ve klavye otomasyonu; hile, can sabitleme, state mutasyonu veya reklam/Billing taklidi yok. Hedef 180 oyun saniyesi ya da gerçek çatışma ölümü. Masaüstü tarayıcıda native servisler kapalıdır. Bu bölüm gerçek Android reklam entegrasyonunu doğrulamaz.

| Harita | Koşu | 180 sn tamamlandı | Çatışmada ölüm | Bitiş oyun saniyeleri | Donma / çarpışma / JS |
|---|---:|---:|---:|---|---|
| kapalicarsi | 3 | 3 | 0 | 180.096 / 180.064 / 180.128 | 0 / 0 / 0 |
| uskudar | 3 | 2 | 1 | 128.960 / 180.000 / 180.064 | 0 / 0 / 0 |
| besiktas | 3 | 3 | 0 | 180.048 / 180.000 / 180.000 | 0 / 0 / 0 |
| eminonu | 3 | 0 | 3 | 78.992 / 82.848 / 58.416 | 0 / 0 / 0 |

**12/12 teknik geçiş; 8 tamamlanma, 4 ölüm.** Ölüm test hatası değildir. Doğal runner exit 0. Her koşuda komutsuz doğuş sıçraması 0. [Ham 12 koşu](monetization/natural/natural-summary.json). Kaynak index SHA-256 eşleşmesi: true. Hash: `db191b4a44b00b12382d3db46902e2e20f3c02b9cf62db708275f2d0fb7e406a`.

## Kontrollü testler — native köprülerin yerini tutmaz

| Kanıt | Sonuç |
|---|---|
| [Sözleşme testleri](monetization/controlled.json) | 13 grup geçti. Beş ürün × iptal/hata/pending/geçersiz makbuz, çift bildirim, depolama hatası, finish hatası, restore, iptal edilmiş sahiplik, rıza ve reklam kuralları |
| [Gerçek CdvPurchase JS](monetization/sdk/sdk.json) | 5 ürün: Play fiyatı €2,49 test verisinden; 2 acknowledge, 3 consume. Her üründe iptal ve hata. Pending→onay, native consume hatası→restore, temiz bağlamda iki kalıcı ürün restore; JS 0 |
| [Gerçek oyun UI](monetization/ui/ui.json) | Erken reklam kapatma can vermez; tamamlanınca bir kez canlanır. İkinci ölüm final olur. 2× altın doğru miktarda, tek teslim. İlk turda geçiş 0 |
| [Sanal saat sınır testi](monetization/controlled.json) | İlk 3 tur 0; 4. tur 1; 179.999 ms kapalı, 180.000 ms açık. Saat geri alma, remove_ads ve eşzamanlı ödül isteği kontrolü |
| [Gerçek duvar saati](monetization/cooldown-realtime.json) | İlk 3 tur 0; ilk/ikinci gösterim arası **180053 ms**. 179 sn'de engellendi. Saat hızlandırılmadı; AdMob köprüsü kontrollü |
| [Oynanabilirlik regresyonu](monetization/controlled-game/controlled.json) | 8 harita ×100 doğuş, dash temas hasarı 0, blur/input, kurtarma, Üsküdar 38 görünür collider; JS 0 |
| [Dört çözünürlük](monetization/layout/layout.json) | Menü/HUD kontrolleri geçti; 844×390 ultHud (597,218), 36×42. Mağaza kartları/restore dört boyutta erişilebilir |

CdvPurchase testinde **kurulu eklentinin gerçek JavaScript kodu** ve oyunun gerçek IAP modülü kullanıldı; Android cordova.exec ve Google HTTP yanıtları QA içinden sağlandı. Bunlar lisans testçisiyle Play Store satın alma veya AdMob sunucusundan gelen gerçek test reklamı değildir. Fiyat görüntülerindeki €2,49 üretim sabiti değildir.

## Ekran görüntüleri

- [Mağaza 390×844](monetization/ui/store-390x844.png), [540×1310](monetization/ui/store-540x1310.png), [844×390](monetization/ui/store-844x390.png), [932×430](monetization/ui/store-932x430.png).
- [Geri yükle / gizlilik düğmeleri](monetization/ui/store-bottom-390x844.png).
- [Canlanma](monetization/ui/revive-390x844.png), [2× altın teslimi](monetization/ui/double-gold-390x844.png).
- [Menü 390×844](monetization/layout/menu-390x844.png), [menü 844×390](monetization/layout/menu-844x390.png).

## Kısıtlar ve taramalar

[Integrity kaydı](monetization/integrity.json): eski ödeme kodu 0, sabit ₺ fiyat 0, üretimde QA kancası 0, kaynak www içinde gerçek AdMob ID 0. 113 Android dosyasından yalnız app/build.gradle ve AndroidManifest.xml gerekli plugin ayarı için değişti; diğerleri aynı. Texture dosyaları aynı. V1/unity yazılmadı. Oyun kayıt anahtarı `istanbul-mafia-v2` korundu; ticaret durumu aynı nesnenin commerce alanında.

Daha önce dokümanda bulunan gerçek AdMob kimlikleri yerel ignore edilen .env'e taşındı; bu görevin kaynak dokümanında değerler yok. Önceki Git geçmişi yeniden yazılmadı. npm audit: 0 açık (kurulumda görülen üç mevcut geçişli bağımlılık uyumlu yama ile düzeltildi).

## Kabul tablosu ve kalan native kapılar

| Kullanıcı kabulü | Durum |
|---|---|
| 1. Beş ürün, hata/iptal dahil uçtan uca | Gerçek SDK JS + kontrollü köprü geçti; Play lisans testçisiyle Android kabulü açık |
| 2. Temiz kurulumda kalıcı ürün restore | Temiz browser context + gerçek SDK JS geçti; cihaz değişimi/Play hesabı açık |
| 3. remove_ads sonrası geçiş 0 | Kontrollü geçti; cihaz kabulü açık |
| 4. İlk 3 tur + 180 sn | Sanal sınır + gerçek 180053 ms ölçüm geçti; native reklam gösterimi açık |
| 5. UMP önceliği / ret sonrası NPA | Kontrollü sıra/ret/hata geçti; AdMob konsol mesajı ve EEA/UK/CH cihaz formu açık |
| 6. Dört harita ×3 doğal | GEÇTİ; donma/çarpışma/JS 0 |

Yerel yapılandırma kontrolünde **0/5 Play ürün kimliği ve doğrulama URL'si boş**. Doğrulama sunucusu kodu hazır ancak dağıtılmadı; Google hizmet hesabı/yetkisi eklenmedi. Bu nedenle gerçek ödemeler açılmadı. Terminal native sync + debug/iç test paketi; Gökay aktif Play ürünleri, lisans testçisi, UMP mesajı ve HTTPS validator kurulumu gerekiyor. [Somut kurulum/adım listesi](../../../docs/MONETIZATION-KURULUM.md).

Eski gizlilik ve Data Safety belgelerindeki “hiç veri yok / reklam ve IAP yok / INTERNET gereksiz” onayları bu kararla geçersiz. İlgili belgeler ve yayın checklist'i yeniden onay bekler duruma alındı. AdMob'un SDK verileri ayrıca beyan edilmelidir. [Google SDK veri açıklaması](https://developers.google.com/admob/android/privacy/play-data-disclosure)

## Yeniden çalıştırma

```powershell
npm run monetization:prepare
npm run test:monetization
node qa/ab/ab-monetization-sdk.cjs
node qa/ab/ab-monetization-ui.cjs
node qa/ab/ab-ad-cooldown.cjs
$env:QA_OUT='qa/ab/results/monetization/controlled-game'; node qa/ab/ab-controlled.cjs
$env:QA_OUT='qa/ab/results/monetization/layout'; node qa/ab/ab-layout-test.cjs
$env:PORT='8839'; $env:QA_OUT='qa/ab/results/monetization/natural'
$env:QA_RUNS='{"kapalicarsi":3,"uskudar":3,"besiktas":3,"eminonu":3}'
$env:QA_DAMAGE_TRACE='1'; $env:QA_NATURAL_SECONDS='180'
node qa/ab/ab-natural.cjs
node qa/ab/ab-monetization-report.cjs
```

Rapor üreticisi yerel kapıyı denetler; native/nihai kabul `false` olarak kalır. Fiziksel cihaz kanıtı olmadan onay yükseltilmez. Commit ve push yapılmadı.
