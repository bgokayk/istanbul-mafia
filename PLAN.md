# İstanbul Mafia V2 — A/B planı

Temel: 17 Eylül 2026 denetimi. Teslim sürümü: 2.0.0-preview.2.

## Kapsam ve sınırlar

- A: oynanabilirlik ve giriş/hasar/dünya geometrisi.
- B: dikey ana düzen ve 540 px yatay sahne.
- C bu turda yok. Yeni sprite/portre üretilmedi; mevcut dosyaların karakter kimlikleriyle eşleşen adları değiştirildi. Palet ve materyal korunuyor.
- V1, unity/ ve android/ üzerinde değişiklik yok. Android portrait kilidi korunuyor. Bu tur APK/sync üretilmedi.
- localStorage anahtarları değişmedi. Eski kayıt kimlikleri okuma sırasında yeni kimliklere dönüştürülüyor.
- Commit/push yapılmayacak; Terminal doğrulayacak.

## Uygulama

- [x] A1: WorldRules.objects çizim ve çarpışmanın tek kaynağı. Boyut eşiği kaldırıldı; Üsküdar 38 yapısal duvarı çiziliyor. Sütunların görsel boyutu ve çarpışma sınırı aynı tanımdan geliyor.
- [x] A2: tüm haritalarda çarpışmasız doğuş araması; Beşiktaş merkezi dahil. Hareket alt adımlarla doğrulanıyor, pasif çarpışma düzeltmesiyle konum sıçratılmıyor.
- [x] A3: aura/zehir/alev/nişancı/temas applyDamage üzerinden. Dash, süreli/kapasiteli kalkan ve zırh ortak kapıda.
- [x] A4: merkezi resetInput; blur, arka plan, pause, modal ve yeni tur. Birincil dokunma identifier ile izleniyor. Modal sırasında oyun saati ve düşmanlar duruyor.
- [x] A5: kurtarma NPC, minimap ve ekran dışı yön işareti çizim döngüsüne bağlı.
- [x] A6 kod: düşman ayrışması spatial grid üzerinden. Ölçüm kabulü aşağıda ayrıca takip ediliyor.
- [x] A7 kod: özgün karakter kimlikleri, kapalı ticari ekranlar, kaldırılmış şans çarkı. Eski kayıt uyumluluğu için yalnızca geçiş tablosunda Unicode ile tanımlanan eski kimlikler bulunur; bunlar arayüze çıkmaz.
- [x] B1: dikey birincil; yatay sahne 540 px ortalı, statik yan paneller. Küçük ekranda modallar içeriden kaydırılır.
- [x] B2: logo sahnenin en az %70'i; mevcut karakter vitrini büyütüldü; dekor yüksekliği sınırlı; yeni kart/özellik eklenmedi.
- [x] Denemede saptanan ek A regresyonu: XP/altın/can toplama güncelleme döngüsüne geri getirildi; sıfır mesafede bölme korundu. Bu hata seviye atlamayı engelliyordu.

## Doğrulama durumu

- [x] Kontrollü: 8 harita × 100 üretim, güvenli doğuş ve sıfır komutsuz hareket.
- [x] Kontrollü: dash temas hasarı 0; kalkan/zırh; blur ve çoklu dokunma; modal saati; kurtarma çizimi; kayıt geçişi; XP/altın/can toplama.
- [x] Düzen: 390×844, 540×1310, 844×390, 932×430; logo ve boşluk sınırları, oyun kontrolleri ve kaydırılabilir modal erişimi.
- [x] Normal oyun akışı: iki haritada beşer yeni kayıtla üçer dakika. Gerçek RAF ve arayüz/klavye kullanılır; doğrudan durum değişikliği veya hile kullanılmaz. Ölümle biten denemeler ayrıca saklanır.
- [x] Tek tarayıcıda 180 düşmanlı tam oyun callback ve ana iş parçacığı kare süresi ölçümü.
- [x] Kaynak klasörde son bütünlük ve A7 taraması.

Ayrıntı ve kanıtlar teslimde qa/ab/results/TEST-RAPORU.md altında bulunacak.

Sonuç: Üsküdar 5 + Beşiktaş 5 başarılı üç dakikalık yeni kayıt (16 denemede 6 çatışma ölümü ayrıca kaydedildi). 180 düşmanda update p95 2,60 ms, tam callback 4,30 ms, ana iş parçacığı kare yükü 14,862 ms. GPU/sunum aralığı bu CPU kabulünden ayrıdır. A7 0 eşleşme. Son kanıtlar: qa/ab/results/TEST-RAPORU.md.
