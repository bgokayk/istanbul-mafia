'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),cp=require('child_process');
const repo=path.resolve(__dirname,'../..'),dir=path.join(__dirname,'results/monetization');
const read=f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8')),hash=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const baseline=read('baseline.json'),changed=[],missing=[];
for(const [rel,before]of Object.entries(baseline.hashes)){const f=path.join(repo,rel);if(!fs.existsSync(f))missing.push(rel);else if(hash(f)!==before)changed.push(rel);}
const wwwFiles=[];function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else wwwFiles.push(f);}}walk(path.join(repo,'www'));
const sourceFiles=wwwFiles.filter(f=>/\.(html|js|css)$/.test(f)&&!f.endsWith('.local.js'));
const scans={legacyPayments:[],fixedPrices:[],realAdIds:[],testHooks:[]};
for(const f of sourceFiles){const s=fs.readFileSync(f,'utf8'),rel=path.relative(repo,f).replaceAll('\\','/');for(const [key,rx]of Object.entries({legacyPayments:/PREMIUM_PKGS|RESERVED_PKGS|handlePremiumBuy|handleReservedBuy|activatePremium|activateReserved|buildReservedScreen|ABONELİK/gi,fixedPrices:/₺\s*\d+/g,realAdIds:/ca-app-pub-(?!3940256099942544)\d+[~/]\d+/g,testHooks:/__testEval|__deathTrace|__soak|sdkFixture|nativeAdFixture/g})){const m=s.match(rx);if(m)scans[key].push({file:rel,count:m.length});}}
const androidChanges=changed.filter(f=>f.startsWith('android/'));
const integrity={created:new Date().toISOString(),branch:cp.execFileSync('git',['-c','safe.directory='+repo.replaceAll('\\','/'),'branch','--show-current'],{cwd:repo,encoding:'utf8'}).trim(),baselineFiles:Object.keys(baseline.hashes).length,changed,missing,androidChanges,androidAllowed:['android/app/build.gradle','android/app/src/main/AndroidManifest.xml'],textureChanges:changed.filter(f=>f.startsWith('www/textures/')),scans,sourceHashes:Object.fromEntries(sourceFiles.map(f=>[path.relative(repo,f).replaceAll('\\','/'),hash(f)])),v1:'No file operation wrote into the V1 directory; no claim of a new before/after V1 hash comparison.',nativeSync:false,commit:false,push:false};
integrity.pass=integrity.branch==='v2'&&!missing.length&&androidChanges.length===2&&androidChanges.every(f=>integrity.androidAllowed.includes(f))&&!integrity.textureChanges.length&&Object.values(scans).every(x=>x.length===0);
fs.writeFileSync(path.join(dir,'integrity.json'),JSON.stringify(integrity,null,2));
const controlled=read('controlled.json'),sdk=read('sdk/sdk.json'),ui=read('ui/ui.json'),natural=read('natural/natural-summary.json'),layout=read('layout/layout.json'),game=read('controlled-game/controlled.json'),cooldown=read('cooldown-realtime.json');
const naturalPass=natural.length===12&&natural.every(r=>r.pass&&r.errors.length===0&&r.failures.length===0&&!r.collisionViolations);
const currentIndex=hash(path.join(repo,'www/index.html'));
const sourceMatches=natural.every(r=>r.sourceHash===currentIndex);
const localPass=!!(controlled.pass&&sdk.pass&&ui.pass&&naturalPass&&sourceMatches&&layout.errors.length===0&&game.errors.length===0&&cooldown.pass&&integrity.pass);
const summary={generated:new Date().toISOString(),localPass,nativeAccepted:false,overallAccepted:false,natural:{runs:natural.length,passed:natural.filter(r=>r.pass).length,completed:natural.filter(r=>r.completed).length,deaths:natural.filter(r=>r.death).length,jsErrors:natural.reduce((n,r)=>n+r.errors.length,0),collisionViolations:natural.reduce((n,r)=>n+(r.collisionViolations||0),0),failures:natural.flatMap(r=>r.failures),sourceMatches},controlledGroups:controlled.tests.length,cooldownIntervalMs:cooldown.intervalMs};
fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify(summary,null,2));
const rows=['kapalicarsi','uskudar','besiktas','eminonu'].map(map=>{const runs=natural.filter(r=>r.map===map).sort((a,b)=>a.run-b.run);return '| '+map+' | '+runs.length+' | '+runs.filter(r=>r.completed).length+' | '+runs.filter(r=>r.death).length+' | '+runs.map(r=>(r.final.elapsed/1000).toFixed(3)).join(' / ')+' | 0 / 0 / 0 |';}).join('\n');
const bt=String.fromCharCode(96);
const report=`# Monetization test raporu — 2 Ekim 2026

**Yerel kod/test kapısı: ${localPass?'GEÇTİ':'GEÇMEDİ'}. Native Play/AdMob kabulü: AÇIK. Mağazaya yayın onayı verilmedi.** Branch v2, APP_VERSION 1.0.0. Commit/push/sync/APK yapılmadı.

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
${rows}

**${summary.natural.passed}/12 teknik geçiş; ${summary.natural.completed} tamamlanma, ${summary.natural.deaths} ölüm.** Ölüm test hatası değildir. Doğal runner exit 0. Her koşuda komutsuz doğuş sıçraması 0. [Ham 12 koşu](monetization/natural/natural-summary.json). Kaynak index SHA-256 eşleşmesi: ${sourceMatches}. Hash: ${bt}${currentIndex}${bt}.

## Kontrollü testler — native köprülerin yerini tutmaz

| Kanıt | Sonuç |
|---|---|
| [Sözleşme testleri](monetization/controlled.json) | ${controlled.tests.length} grup geçti. Beş ürün × iptal/hata/pending/geçersiz makbuz, çift bildirim, depolama hatası, finish hatası, restore, iptal edilmiş sahiplik, rıza ve reklam kuralları |
| [Gerçek CdvPurchase JS](monetization/sdk/sdk.json) | 5 ürün: Play fiyatı €2,49 test verisinden; 2 acknowledge, 3 consume. Her üründe iptal ve hata. Pending→onay, native consume hatası→restore, temiz bağlamda iki kalıcı ürün restore; JS 0 |
| [Gerçek oyun UI](monetization/ui/ui.json) | Erken reklam kapatma can vermez; tamamlanınca bir kez canlanır. İkinci ölüm final olur. 2× altın doğru miktarda, tek teslim. İlk turda geçiş 0 |
| [Sanal saat sınır testi](monetization/controlled.json) | İlk 3 tur 0; 4. tur 1; 179.999 ms kapalı, 180.000 ms açık. Saat geri alma, remove_ads ve eşzamanlı ödül isteği kontrolü |
| [Gerçek duvar saati](monetization/cooldown-realtime.json) | İlk 3 tur 0; ilk/ikinci gösterim arası **${cooldown.intervalMs} ms**. 179 sn'de engellendi. Saat hızlandırılmadı; AdMob köprüsü kontrollü |
| [Oynanabilirlik regresyonu](monetization/controlled-game/controlled.json) | 8 harita ×100 doğuş, dash temas hasarı 0, blur/input, kurtarma, Üsküdar 38 görünür collider; JS 0 |
| [Dört çözünürlük](monetization/layout/layout.json) | Menü/HUD kontrolleri geçti; 844×390 ultHud (597,218), 36×42. Mağaza kartları/restore dört boyutta erişilebilir |

CdvPurchase testinde **kurulu eklentinin gerçek JavaScript kodu** ve oyunun gerçek IAP modülü kullanıldı; Android cordova.exec ve Google HTTP yanıtları QA içinden sağlandı. Bunlar lisans testçisiyle Play Store satın alma veya AdMob sunucusundan gelen gerçek test reklamı değildir. Fiyat görüntülerindeki €2,49 üretim sabiti değildir.

## Ekran görüntüleri

- [Mağaza 390×844](monetization/ui/store-390x844.png), [540×1310](monetization/ui/store-540x1310.png), [844×390](monetization/ui/store-844x390.png), [932×430](monetization/ui/store-932x430.png).
- [Geri yükle / gizlilik düğmeleri](monetization/ui/store-bottom-390x844.png).
- [Canlanma](monetization/ui/revive-390x844.png), [2× altın teslimi](monetization/ui/double-gold-390x844.png).
- [Menü 390×844](monetization/layout/menu-390x844.png), [menü 844×390](monetization/layout/menu-844x390.png).

## Kısıtlar ve taramalar

[Integrity kaydı](monetization/integrity.json): eski ödeme kodu 0, sabit ₺ fiyat 0, üretimde QA kancası 0, kaynak www içinde gerçek AdMob ID 0. ${Object.keys(baseline.hashes).filter(f=>f.startsWith('android/')).length} Android dosyasından yalnız app/build.gradle ve AndroidManifest.xml gerekli plugin ayarı için değişti; diğerleri aynı. Texture dosyaları aynı. V1/unity yazılmadı. Oyun kayıt anahtarı ${bt}istanbul-mafia-v2${bt} korundu; ticaret durumu aynı nesnenin commerce alanında.

Daha önce dokümanda bulunan gerçek AdMob kimlikleri yerel ignore edilen .env'e taşındı; bu görevin kaynak dokümanında değerler yok. Önceki Git geçmişi yeniden yazılmadı. npm audit: 0 açık (kurulumda görülen üç mevcut geçişli bağımlılık uyumlu yama ile düzeltildi).

## Kabul tablosu ve kalan native kapılar

| Kullanıcı kabulü | Durum |
|---|---|
| 1. Beş ürün, hata/iptal dahil uçtan uca | Gerçek SDK JS + kontrollü köprü geçti; Play lisans testçisiyle Android kabulü açık |
| 2. Temiz kurulumda kalıcı ürün restore | Temiz browser context + gerçek SDK JS geçti; cihaz değişimi/Play hesabı açık |
| 3. remove_ads sonrası geçiş 0 | Kontrollü geçti; cihaz kabulü açık |
| 4. İlk 3 tur + 180 sn | Sanal sınır + gerçek ${cooldown.intervalMs} ms ölçüm geçti; native reklam gösterimi açık |
| 5. UMP önceliği / ret sonrası NPA | Kontrollü sıra/ret/hata geçti; AdMob konsol mesajı ve EEA/UK/CH cihaz formu açık |
| 6. Dört harita ×3 doğal | GEÇTİ; donma/çarpışma/JS 0 |

Yerel yapılandırma kontrolünde **0/5 Play ürün kimliği ve doğrulama URL'si boş**. Doğrulama sunucusu kodu hazır ancak dağıtılmadı; Google hizmet hesabı/yetkisi eklenmedi. Bu nedenle gerçek ödemeler açılmadı. Terminal native sync + debug/iç test paketi; Gökay aktif Play ürünleri, lisans testçisi, UMP mesajı ve HTTPS validator kurulumu gerekiyor. [Somut kurulum/adım listesi](../../../docs/MONETIZATION-KURULUM.md).

Eski gizlilik ve Data Safety belgelerindeki “hiç veri yok / reklam ve IAP yok / INTERNET gereksiz” onayları bu kararla geçersiz. İlgili belgeler ve yayın checklist'i yeniden onay bekler duruma alındı. AdMob'un SDK verileri ayrıca beyan edilmelidir. [Google SDK veri açıklaması](https://developers.google.com/admob/android/privacy/play-data-disclosure)

## Yeniden çalıştırma

${bt}${bt}${bt}powershell
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
${bt}${bt}${bt}

Rapor üreticisi yerel kapıyı denetler; native/nihai kabul ${bt}false${bt} olarak kalır. Fiziksel cihaz kanıtı olmadan onay yükseltilmez. Commit ve push yapılmadı.
`;
fs.writeFileSync(path.join(__dirname,'results/MONETIZATION-RAPORU.md'),report);
console.log(JSON.stringify(summary));if(!localPass)process.exitCode=1;
