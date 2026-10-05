# Dayanıklılık ve ilk oturum raporu — 2 Ekim 2026

Durum: **Ölçümler tamamlandı; kabul geçmedi**. 15 dakika (ısınmış heap ölçütü): 8/8 PASS; doğal son koşular: 12/12 PASS. Commit/push yapılmadı.

Üretim index.html SHA-256: `4ec9378256b1f698244ffac247e390ee6c75c5ac1522054733fa89e27c880c1a`. Her JSON kendi kaynak hash'lerini içerir; eski başarısız ölçümler son teslim sonucu sayılmaz.

4× performans kapısı: FAIL — p95 ≤ 33 ms hedefi sağlanmadı. Donma/JS hatası bulunmaması, düşük kare hızının geçtiği anlamına gelmez.

## Düzeltmeler ve kapsam

- Uzun koşularda dört haritada da boss sandığı yükseltmesi `applyUpgrade is not defined` hatasına ulaştı. Sandık artık gerçek UPG şemasındaki i/n/d/fn alanlarını kullanır; kapanmış sandık tekrar ödül vermez.
- QA, üstte boss sandığı varken arkadaki seviye kartına tıklamayı deniyordu. Modal önceliği düzeltildi. Bu otomasyon hatası üretim donması olarak sayılmadı; ham başarısız kayıtlar korundu.
- QA kontrolcüsü, modalın sıfırladığı yön tuşlarını kapanışta yeniden basar. İlk denemelerdeki ara duraklama bu yüzden test oyuncusundan kaynaklanıyordu. Son doğal/soak serileri bu düzeltmeyle çalıştırıldı.
- Temas sesi her düşman/her güncellemede yeni oscillator+gain üretiyordu. Aynı vurulma sesi en fazla 80 ms'de bir çalınır; temas hasarı aynı kalır. Biten ses düğümleri ayrılır; yankı kuyruğu 800 ms sonra kapanır. Ambient filtreler stop listesine eklendi; askıya alınmış ses bağlamında yeni kısa sesler birikmez.
- Dört açık haritada ilk dalganın başlangıç grubu 18 → 8. Dalga 1/2/3 spawn çarpanı 0,45 / 0,65 / 0,85; HP çarpanı 0,55 / 0,70 / 0,85. Normal aralıklar yaklaşık 1889 / 1231 / 882 ms. Dalga 4+ ve kilitli haritaların formülleri aynı. Hız, hasar, XP/altın ve boss dengesi değiştirilmedi.
- Mevcut tutorial metni hareket, mesafeyi koruma, XP/seviye kartı ve Dash/Shift kullanımını anlatır. Yeni adım veya ekran yok.
- Partiküllerdeki yüzdeyle azaltma 500 sınırını korumuyordu: 15 dakikalık denemede 1473, ayrı tanıda 1949 görüldü. Üretimde artık sert 500 sınırı var. Görünmeyen XP/altın/mermi/partiküller çizilmez; nesneler ve ödüller silinmez. Aynı rastgele sayı akışı korundu.
- Aynı HUD metnini her karede tekrar yazma kaldırıldı. [HUD regresyonu](soak/final-hud/hud-noop.json): 100 sabit güncellemede 1100 → 0 DOM metin mutasyonu; can/seviye/kill/süre/Dash değiştiğinde gösterge doğru güncellenir.
- Çizim yükünün bir bölümü, yerdeki güçlendirme ikonlarının hareketli gölgesiyle yeniden üretildi. Sabit ikon bitmap'i artık 32 girdiyi aşmayan önbellekten çizilir; aynı ikon, renk, gölge ve toplama davranışı korunur. [Önce yoğun sahne](soak/floor-gold-probe/scene-profile.json): p95 66,7 ms; yalnız floorItems kaldırılınca 12,2 ms. [Önbellek sonrası yoğun sahne](soak/floor-gold-cache-probe/scene-profile.json): 12,2 ms, ikonlar mevcut. Bunlar kısa tanı; tam kabul aşağıdaki 10 dk koşularıdır. Son uzun koşular, bu yerel iyileştirmenin genel 4× hedefini karşılamaya yetmediğini gösterdi.
- [Değişen kritik hasar metni](soak/dynamic-damage-probe/damage-render.json) ve [doğru başlangıç kopyasıyla hareketli sahne tekrarı](soak/corrected-scene-replay/replay.json), 4× kısa çizim probunda p95 6,2 ms: canlı uzun koşunun geç yavaşlamasını yeniden üretmedi. Kök neden bu deneylerle kapanmış sayılmaz; kısa probun iyi sonucu uzun koşudaki FAIL sonucunu geçersiz kılmaz.
- Mermi önbelleği, ayrı canvas katmanı, canvas sıfırlama ve 60 FPS sınırı tanıları uzun canlı yükte hedefi sağlamadı; bu değişiklikler üretimde bırakılmadı. [Mermi denemesi](soak/projectile-cache-pilot/kapalicarsi-4x-1.json) tanısaldır, kabul yerine geçmez.
- [İkon görüntü/sınır kontrolü](soak/final-floor-icons/floor-icons.json): sekiz mevcut ikon × dört alt piksel konumu; 96×96 koyu zemin üzerinde ortalama kanal farkı en fazla 0,573/255, tam piksel konumunda en yüksek fark 6/255. Raster alt piksel yumuşatması birebir aynı değildir; görünür ikon/ölçek/gölge korunur. 100 farklı boyut isteğinde önbellek 32'yi aşmaz. [Görsel kontrol](soak/final-floor-icons/floor-icons.png).

## Kontrollü testler — yöntem

- Gerçek duvar saati ve gerçek requestAnimationFrame; hızlandırılmış oyun saati yok. Her koşuda yeni tarayıcı bağlamı, USTURA, 390×844. Uzun ölçümün tamamlanabilmesi için yalnız QA belleğinde ölümsüzlük açılır. Eminönü'nün normal 180 saniyelik bitişi yalnız QA belleğinde uzatılır. Bunlar doğal hayatta kalma kanıtı değildir.
- 1× koşular dört harita eşzamanlı, iki seri halinde yürütülür. Doğal testler ve ek ilk oturum gözlemleri de bu seriler sırasında aynı masaüstünde çalışır; bu nedenle 1× zamanları paylaşılan makine yükünü içerir. 4×/6× ölçümleri başka QA tarayıcısı açık değilken, tek harita halinde çalıştırılır. CPU yavaşlatması CDP Emulation.setCPUThrottlingRate ile uygulanır; fiziksel telefon/GPU/termal test değildir.
- Full-frame = gerçekten gdraw çağrılan iki rAF zaman damgasının farkı; çizilmeyen callback'ler hızlı kare olarak sayılmaz. Bekleme süresi dahil, GPU sunumu ayrıca doğrulanmış değil. Tüm gloop callback CPU süresi ayrıca JSON'da. 0,1 ms çözünürlükte sabit boyutlu histogram; her dakikanın p50/p95'i saklanır. Son ölçüm sürümü 3. Ayrı canvas katmanı ve 60 FPS sınırı tanıları hedefi sağlamadığından üretimde bırakılmadı; oyun döngüsünün eski çizim sıklığı/simülasyon davranışı korunur.
- Heap tabanı 30 saniyelik ısınma sonrası alınır; cold ölçümü de JSON'da ve aşağıdaki tabloda. 5/10/15 dk noktaları ölçümün duvar saatidir, bitiş ayrıca 15 oyun dakikasını da doldurur. GC ile okuma arasında yeni oyun nesneleri oluşmasın diye rAF kısa süre durur; checkpointPauseMs bunu kaydeder. Ham ve GC sonrası heap birlikte saklanır. Ölçümden sonraki üç kare örneği dışlanır ve sayılır; normal GC kareleri dahil. Kabul: ısınmış tabandan tutulan heap büyümesi < %50; plato için 10. dakikadan bitişe artış ≤ %10 (en az son 5 dk, oyun saati gerideyse daha uzun). Cold açılış büyümesi bu kabul oranıyla aynı değildir.
- Donma: oyun saati 15 saniye ilerlemezse FAIL; JS hatası, çarpışma ihlali, beklenmeyen bitiş de FAIL. Hem duvar hem oyun süresi hedefe ulaşmadan tamamlandı sayılmaz. Nesne zirveleri her karede ölçülür; listener/DOM/cache sayıları heap noktalarında kaydedilir.

### 15 dakika × 8

| Harita/koşu | Durum | Ölçüm duvar/oyun sn | Kare p50/p95 ms | Callback p95 ms | Heap artışı ısınmış / cold | 10 dk → bitiş | En uzun saat bekleme sn | Donma/JS/ihlal |
|---|---|---:|---:|---:|---:|---:|---:|---|
| [besiktas #1](soak/final-1x/besiktas-1x-1.json) | PASS | 907.5 / 900.0 | 24.2 / 42.4 | 10.4 | 20.2% / 73.9% | 1.0% | 0.9 | 0/0/0 |
| [besiktas #2](soak/final-1x/besiktas-1x-2.json) | PASS | 905.2 / 900.4 | 18.2 / 30.3 | 7.0 | 22.1% / 89.1% | 0.6% | 0.7 | 0/0/0 |
| [eminonu #1](soak/final-1x/eminonu-1x-1.json) | PASS | 925.8 / 900.3 | 18.2 / 48.5 | 4.3 | 20.8% / 83.7% | 4.2% | 1.1 | 0/0/0 |
| [eminonu #2](soak/final-1x/eminonu-1x-2.json) | PASS | 912.6 / 900.3 | 12.1 / 30.3 | 3.4 | 20.5% / 86.3% | 6.2% | 1.0 | 0/0/0 |
| [kapalicarsi #1](soak/final-1x/kapalicarsi-1x-1.json) | PASS | 915.2 / 900.2 | 18.1 / 36.4 | 4.2 | 22.7% / 85.0% | 6.4% | 1.5 | 0/0/0 |
| [kapalicarsi #2](soak/final-1x/kapalicarsi-1x-2.json) | PASS | 914.5 / 900.4 | 18.2 / 36.4 | 4.1 | 25.4% / 92.1% | 6.9% | 1.1 | 0/0/0 |
| [uskudar #1](soak/final-1x/uskudar-1x-1.json) | PASS | 923.0 / 900.0 | 24.2 / 48.4 | 5.3 | 20.8% / 87.8% | 8.1% | 1.3 | 0/0/0 |
| [uskudar #2](soak/final-1x/uskudar-1x-2.json) | PASS | 900.8 / 900.1 | 6.1 / 18.1 | 4.1 | 16.3% / 81.6% | 1.7% | 0.4 | 0/0/0 |

Soğuk açılıştan bitişe artış ≥ %50 olan uzun koşu: 8/8. Bunlarda başlangıç şartı soğuk açılış olarak değerlendirilirse <%50 kapısı geçmez. Isınmış taban, ilk sprite/font/kod yüklemelerini ayırmak içindir; soğuk açılış artışı da tabloda gösterilir ve tek başına sızıntı kanıtı değildir.

Saat bekleme zirvesi modal seçimlerini de içerir. Donma sayacı 15 saniye ilerlememe eşiğidir; düşük FPS bu sayaç sıfır olsa bile ayrı bir performans sorunudur.

| Harita/koşu | Heap cold / başlangıç → 5 → 10 → 15 dk → bitiş (MiB, GC sonrası) | Zirve düşman / mermi / partikül / XP |
|---|---|---|
| besiktas #1 | 2.25 / 3.26 → 3.58 → 3.88 → 4.03 → 3.92 | 195 / 110 / 500 / 11 |
| besiktas #2 | 2.11 / 3.26 → 3.55 → 3.96 → 3.97 → 3.99 | 180 / 22 / 495 / 42 |
| eminonu #1 | 2.14 / 3.26 → 3.58 → 3.78 → 3.97 → 3.94 | 78 / 22 / 500 / 45 |
| eminonu #2 | 2.14 / 3.31 → 3.61 → 3.76 → 3.76 → 3.99 | 155 / 35 / 500 / 1690 |
| kapalicarsi #1 | 2.18 / 3.29 → 3.63 → 3.79 → 3.83 → 4.03 | 85 / 41 / 500 / 70 |
| kapalicarsi #2 | 2.13 / 3.26 → 3.64 → 3.83 → 3.87 → 4.09 | 82 / 200 / 500 / 130 |
| uskudar #1 | 2.15 / 3.34 → 3.63 → 3.73 → 3.80 → 4.03 | 123 / 97 / 500 / 162 |
| uskudar #2 | 2.10 / 3.29 → 3.55 → 3.76 → 3.69 → 3.82 | 195 / 16 / 248 / 4 |

Eminönü #2 XP gözlemi: kare başına zirve 1690; 5/10/15 dk/bitiş elde kalan küre sayıları 1175 / 1534 / 12 / 15. Bu koşuda birikim daha sonra toplandı; ödüller kesilmedi.

### CPU 4× / 6× — 10 dakika

| Hız | Durum | Duvar/oyun sn | Kare p50/p95 ms | Callback p95 ms | Heap artışı | Donma/JS |
|---|---|---:|---:|---:|---:|---|
| [4×](soak/final-4x/kapalicarsi-4x-1.json) | FAIL | 706.2 / 600.4 | 24.3 / 78.8 | 11.9 | 15.2% | 0/0 |
| [6×](soak/final-6x/kapalicarsi-6x-1.json) | TAMAMLANDI | 1015.3 / 600.0 | 54.5 / 145.5 | 28.7 | 23.3% | 0/0 |

4× için p95 ≤ 33 ms zorunlu kabul kapısıdır. 6× sonucu aynı 33 ms referansıyla karşılaştırılır; kullanıcı bu hız için ayrı bir geçiş eşiği koymadı. Her ikisinin yavaş bölümleri aşağıdadır.

4×, p95 > 33 ms bölümleri (ölçüm başlangıcından saniye): 60.1–120.5: 42.6 ms; 120.5–180.6: 60.7 ms; 180.6–240.8: 78.7 ms; 240.8–301.2: 84.8 ms; 301.2–361.5: 84.8 ms; 361.5–421.8: 96.9 ms; 421.8–481.9: 90.9 ms; 481.9–542.3: 78.8 ms; 542.3–602.9: 78.9 ms; 602.9–663.4: 90.9 ms; 663.4–706.2: 96.9 ms.

6×, p95 > 33 ms bölümleri (ölçüm başlangıcından saniye): 0.0–60.4: 48.5 ms; 60.4–120.9: 72.7 ms; 120.9–181.0: 90.8 ms; 181.0–241.0: 103.0 ms; 241.0–301.4: 133.2 ms; 301.4–361.5: 133.3 ms; 361.5–422.1: 151.5 ms; 422.1–482.5: 169.7 ms; 482.5–543.2: 169.8 ms; 543.2–603.5: 151.4 ms; 603.5–663.6: 163.6 ms; 663.6–724.4: 163.7 ms; 724.4–785.1: 157.6 ms; 785.1–846.0: 181.7 ms; 846.0–906.2: 181.8 ms; 906.2–966.9: 169.7 ms; 966.9–1015.3: 181.8 ms.

### Regresyon ve önceki hata kanıtları

- [Başlangıç/ses testi](soak/final-controlled/opening.json): 8 harita × 3 zorluk × 8 dalga = 192 sabit tohumlu karşılaştırma; HP dışı düşman alanları aynı. Dalga 4+ spawn/HP ve kapalı haritalar aynı. 1000 eşzamanlı ses isteği bir ses üretir; bitişte bağlantılar temizlenir.
- [Boss sandığı ve üst üste modal testi](soak/final-controlled/natural-ui.json): gerçek yükseltme, iki seçimli sandık, üstteki modal önceliği ve çift ödül engeli geçti.
- [Çizim/sınır testi](soak/final-render/render-bounds.json): 2000 partikül isteği 500 nesneyi aşmaz ve aynı 8000 rastgele sayı tüketilir. 1000'er XP/altın/mermi/partikülle önce/sonra görünür canvas piksel farkı 0; bütün nesneler korunur.
- [Hata/ölüm çıkış kodları](soak/final-exit/exit-regression.json): tamamlanma ve ölüm 0; donma, çarpışma, JS hatası, erken bitiş ve hatayla birlikte ölüm 1. Sekiz kontrollü senaryo geçti.
- Dört çözünürlük × üç ardışık ekran koşusu: [1](soak/final-layout-1/layout.json), [2](soak/final-layout-2/layout.json), [3](soak/final-layout-3/layout.json). HUD görünür/pozitif boyutlu ve sahne içinde; 844×390 ultHud ölçüsü (597,218), 36×42. [Dikey ekran](soak/final-layout-3/game-390x844.png) · [Yatay ekran](soak/final-layout-3/game-844x390.png).
- [Tutorial metni](soak/final-tutorial/tutorial.json): gerçek UI ile 390×844'te mevcut 10 adım tamamlandı; kutu/metin taşması ve JS hatası 0. [Mesafe talimatı ekranı](soak/final-tutorial/tutorial-2.png).
- [Ayrıntılı bellek tanısı](soak/heap-diagnostic/heap-summary.json): ilk 10 dakikada JS kodu InstructionStream +382784 bayt, TrustedByteArray +142804 bayt; canvas bağlamları +95 (sonlu sprite cache). Bu tek örnekte kalıcı heap artışı %24,2 ve bitişte düşüyor. Artışın tamamını sızıntı olarak adlandırmak doğru değil. Toplanmayan XP'ler ödül olduğu için kaybolacak biçimde kesilmedi.
- Çizim düzeltmesinden önceki dört tam 15 dk kaydı [pre-render-fix](soak/pre-render-fix/kapalicarsi-1x-1.json) altında: donma/JS 0, heap artışları %24,1 / %32,2 / %47,7 / %48,6; Kapalıçarşı son beş dakikada %10,394 artarak plato eşiğini az farkla kaçırdı. İkinci seri düzeltmeye geçmek için operatörce durduruldu; uygulama hatası veya kabul sonucu sayılmaz. Son sekiz koşu sıfırdan tekrarlandı.
- [Ölçüm aracı düzeltmesinden önce](soak/pre-checkpoint-fix/uskudar-1x-1.json) oyun GC ile heap okuması arasında çalışıyordu; yeni nesneler "tutulan heap" değerine karışabiliyordu. Bu seri durduruldu ve ayrı saklandı. Bu düzeltmenin ilk kontrolü measurementVersion=2 idi; son teslim ölçümleri sürüm 3 kullanır. [Yeni ölçüm smoke kontrolü](soak/checkpoint-smoke/kapalicarsi-1x-1.json) geçti.
- [İlk uzun denemeler](soak/baseline/summary.json), [tekrar hata kayıtları](soak/baseline-retry/summary.json): eski kaynakla boss yükseltmesi JS hataları; tamamlanmış soak kabulü değildir.
- [Önce CPU profili](soak/profile-before/profile-summary.json), [sonra CPU profili](soak/profile-after/profile-summary.json): aynı kontrollü 180 düşman/20 sn/4× probunda createOscillator örnek sayısı 1628 → 35. Toplam oyun performansının yüzdesi değildir. [Ayrı kısa kare probu](soak/profile-after-frames/profile-summary.json): p95 24,3 ms; 10 dk kabulünün yerine kullanılmaz.
- [Eski kaynakla 4× kısa pilot](soak/throttle-pilot/kapalicarsi-4x-1.json): diğer koşularla eşzamanlıydı, p95 115 ms. Son izole testle birebir hızlanma oranı olarak karşılaştırılmaz.
- [HUD öncesi sekiz tam uzun koşu](soak/pre-hud-fix-1x/summary.json): 8/8 PASS, teknik hata 0, heap +%14,6–25,5. Kaynak değiştiği için son teslim kabulü yerine geçmez. [İzole 4× tanı](soak/pre-hud-fix-4x/kapalicarsi-4x-1.json) geç kare süreleri yükseldiği için tamamlanmadan durduruldu; tam 10 dk sonucu değildir.
- [HUD sonrası kısa iz kaydı](soak/trace-4x/trace-summary.json): 1274 compositor Commit olayında toplam 31,07 sn; JS animation callback toplam 7,80 sn. İç içe olay süreleri toplanarak yüzde yapılmaz. Kısa tanı kabul ölçümü değildir.
- [İkon önbelleği öncesi tam 4× koşu](soak/pre-floor-cache-final-4x/kapalicarsi-4x-1.json): 600 oyun saniyesi / 949,5 ölçüm duvar saniyesi, p95 127,2 ms, heap +%15,3; donma/JS/çarpışma 0. Performans FAIL; bu tanıda 60 FPS sınırı denenmişti, sorunu çözmediği için kaldırıldı. Ardından başlayan 6× koşu tanıya dönmek için ısınma aşamasında durduruldu; tamamlanmış sonuç sayılmaz.

## Doğal oynanış — yeni kayıt, hile kapalı

Yeni tarayıcı bağlamında USTURA seçen; gerçek rAF, UI tıklaması ve klavye girdisi kullanan otomatik oyuncu. Harita başına üç koşu, hedef 180 saniye; erken çatışma ölümü normal sonuçtur. Teknik hata çıkış kodu 1; ölüm tek başına 0. Rastgele harita/düşman dağılımı nedeniyle bu küçük örneklem oyuncu başarı oranı tahmini değildir.

| Harita | Önce: süre sn / sonuç | Sonra: süre sn / sonuç | Son teknik hata |
|---|---|---|---|
| kapalicarsi | 180.0 tamam; 101.3 ölüm; 180.2 tamam | 180.1 tamam; 180.1 tamam; 180.1 tamam | 0 |
| uskudar | 180.0 tamam; 180.2 tamam; 180.1 tamam | 180.1 tamam; 180.1 tamam; 180.1 tamam | 0 |
| besiktas | 3.9 ölüm; 118.3 ölüm; 180.1 tamam | 169.3 ölüm; 180.1 tamam; 106.3 ölüm | 0 |
| eminonu | 180.0 tamam; 180.0 tamam; 66.3 ölüm | 45.3 ölüm; 96.0 ölüm; 111.3 ölüm | 0 |

Son doğal seride ilk 60 oyun saniyesinde ölüm: 1/12; eminonu #1 (45.3 sn). Teknik PASS, ilk oturumun her haritada kolay olduğu anlamına gelmez; ölüm ve teknik hata ayrı değerlendirilir.

### Ölüm anları

| Seri | Harita/koşu | Süre sn | Dalga | Oyuncu LVL | Son hasar kaynağı |
|---|---|---:|---:|---:|---|
| önce | besiktas #1 | 3.9 | 1 | 1 | cay / contact |
| önce | besiktas #2 | 118.3 | 7 | 5 | firin_usta / flame |
| önce | eminonu #3 | 66.3 | 4 | 6 | zeybek / contact |
| önce | kapalicarsi #2 | 101.3 | 6 | 3 | marti / contact |
| sonra | besiktas #3 | 106.3 | 6 | 5 | firin_usta / flame |
| sonra | besiktas #1 | 169.3 | 10 | 10 | patron / contact |
| sonra | eminonu #1 | 45.3 | 3 | 3 | taksi / contact |
| sonra | eminonu #2 | 96.0 | 6 | 4 | balikci / contact |
| sonra | eminonu #3 | 111.3 | 7 | 6 | firin_usta / contact |

### İlk 10 dakika için ek doğal gözlem

Her haritada bir ek yeni kayıt, hedef 600 oyun saniyesi veya çatışma ölümü; Eminönü doğal 180 saniyelik bitişini korur. Bu koşularda ölüm engellenmez. İlk üç dalga dışındaki güçlük değiştirilmedi.

| Harita | Hedef / gerçekleşen sn | Sonuç | Ölüm dalgası / LVL / kaynak | Teknik hata |
|---|---:|---|---|---|
| kapalicarsi | 600 / 600.0 | tamam | — | 0 |
| uskudar | 600 / 600.0 | tamam | — | 0 |
| besiktas | 600 / 600.1 | tamam | — | 0 |
| eminonu | 180 / 70.4 | ölüm | 4 / 6 / firin_usta (flame) | 0 |

Son kaynakla Kapalıçarşı ek koşusu: 600.0 sn, LVL 3, 71 kill, 180 düşman; en yakın düşmanın kenarı 1204.2 dünya birimi. Sürekli kaçışta çatışmadan kopma davranışı bu seride de görülüyor; dalga 4+ davranışı değiştirilmedi.

[Ek doğal gözlemlerin ham kayıtları](soak/first-session/summary.json).

Önceki kaynakla [ek doğal gözlem](soak/pre-hud-fix-first-session/summary.json) — kapsam dışı denge bulgusu: Kapalıçarşı koşusu 600,016 sn sonunda LVL 3 / 111 kill / 180 düşmanla bitti; en yakın düşman yaklaşık 1913 dünya birimi uzaktaydı. spawnEnemy 180 sınırında yeni düşman eklemiyor. Sürekli uzaklaşan oyuncu geride kalan düşmanlarla kotayı doldurup çatışmadan uzak kalabiliyor. Bu bir donma veya JS hatası değil; sonraki dalgaların davranışını değiştirmeme kısıtı nedeniyle bu tur değiştirilmedi. Uzun kontrollü soak oyuncusu doğuş çevresinde dolaştığından aktif çatışmayı da ayrıca sınadı.

Beşiktaş önce #1: güvenli doğuş (21192, 21000), komutsuz hareket 0; 18 düşman. İlk temas 1,36 sn, ölüm 3,872 sn, dalga 1/LVL 1. Toplam hasarın 59,33 puanı martı temasından; son 0,79 puan çay temasından geldi. Martı hızı 5,1306, HP 45,54. Merkez sütununun içinde doğuş değil; hızlı başlangıç kalabalığı. Son sürümde başlangıç 8 düşman, aynı martı HP 25,047; hız/hasar değiştirilmedi.

[Önce doğal ham kayıtlar](soak/deaths-before/natural-summary.json) · [Sonra doğal ham kayıtlar](soak/natural-final/natural-summary.json). Hasar izleme yalnız QA sunucu yanıtına eklenir; üretim HTML test kancası içermez.

## Kaynak sınırları ve kalan kapı

V1, unity/, android/ üzerinde yazma yapılmadı. Yeni runtime bağımlılığı, özellik veya localStorage anahtarı yok. Üretim değişikliği yalnız www/index.html; diğer değişiklikler QA ve PLAN.md. [Bütünlük kaydı](soak/integrity.json). Fiziksel Android uzun oyun/ısınma/dokunmatik deneyimi bu masaüstü ölçümünden ayrı doğrulanmalıdır.

Büyük ham tarayıcı/bellek izleri kayıpsız gzip arşivlerinde tutulur; açılarak özgün içerikle karşılaştırıldı. [Arşiv hash manifesti](soak/archive-manifest.json). Özet JSON ve nihai ölçümler düz dosyalardır.

## Tekrar çalıştırma

PowerShell, proje kökünde; her süreç için farklı PORT ve QA_OUT kullanın:

```powershell
$env:PORT='8831'; $env:QA_OUT='qa/ab/results/soak/final-1x'
$env:QA_SECONDS='900'; $env:QA_WARMUP_SECONDS='30'; $env:QA_CPU_RATE='1'
$env:QA_MAPS='kapalicarsi,uskudar,besiktas,eminonu'; $env:QA_SOAK_RUNS='2'
node qa/ab/ab-soak.cjs
# Bittikten sonra, izole 4×; 6× için rate/output/port değiştirin.
$env:PORT='8833'; $env:QA_OUT='qa/ab/results/soak/final-4x'
$env:QA_SECONDS='600'; $env:QA_CPU_RATE='4'; $env:QA_MAPS='kapalicarsi'; $env:QA_SOAK_RUNS='1'
node qa/ab/ab-soak.cjs
# Doğal koşular: ayrı süreçte, soak 4×/6× ile eşzamanlı çalıştırmayın.
$env:PORT='8839'; $env:QA_OUT='qa/ab/results/soak/natural-final'
$env:QA_RUNS='{"besiktas":3,"eminonu":3,"uskudar":3,"kapalicarsi":3}'; $env:QA_DAMAGE_TRACE='1'
node qa/ab/ab-natural.cjs
node qa/ab/ab-soak-report.cjs
```
