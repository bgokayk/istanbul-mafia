# İstanbul Mafia — yayın checklist
_Durum: 2026-10-01. Sahip sütunu: G=Gökay (yalnız o yapabilir), T=Terminal, A=Astra, C=Claude_

## Teknik kapı (gece çalışması)
- [ ] A · 8 harita × 3 doğal koşu: donma/çarpışma/JS hatası 0
- [ ] A · ab-layout-test 4 çözünürlük × 3 koşu geçer, bozuk senaryoda exit 1
- [ ] A · Donanım geri tuşu bağlandı (oyunda pause, menüde çıkış onayı)
- [ ] A · C fazı görsel geçişi (palet, materyal, ikon, ödül geri bildirimi)
- [ ] A · Kumar/çark ikonografisi kaldırıldı — ekran görüntüsüyle kanıt
- [ ] A · versionName 1.0.0 / versionCode 1, tek APP_VERSION sabiti
- [ ] A · Yasak ifade taraması (dizi adları, premium/abonelik/jackpot) = 0
- [ ] T · INTERNET izni manifestten kaldırıldı, APK hâlâ açılıyor
- [ ] T · gradlew assembleDebug → telefonda 10-15 dk gerçek test (Üsküdar, Beşiktaş, boss, seviye seçimi, arka plan/dönüş)
- [ ] T · v2 dalı doğrulandı, commit + push

## Mağaza paketi
- [ ] A · 5+ ekran görüntüsü 1080×1920
- [ ] A · 512×512 ikon + 1024×500 feature graphic + mipmap'ler
- [ ] A · store-listing-tr.md / -en.md (dizi göndermesi yok, yeni adlar)
- [x] C · Gizlilik politikası metni → docs/GIZLILIK-POLITIKASI.md
- [ ] G · Gizlilik politikası yayında bir URL'de (GitHub Pages veya lumenco sitesi)
- [x] C · Data Safety cevapları → docs/PLAY-DATA-SAFETY.md
- [x] C · IARC cevapları → docs/IARC-CEVAPLARI.md
- [x] C · Keystore talimatı → docs/KEYSTORE-TALIMATI.md

## Play Console (yalnız Gökay)
- [~] G · Geliştirici hesabı — kimlik doğrulama sürüyor (2026-10-01)
- [ ] G · Keystore üret + 3 yere yedekle (docs/KEYSTORE-TALIMATI.md)
- [ ] T · gradlew bundleRelease → AAB
- [ ] G · Uygulama oluştur, paket adı com.lumenco.istanbulmafia (değişmez)
- [ ] G · Store listing + görseller + gizlilik URL'si
- [ ] G · IARC anketi + Data Safety formu
- [ ] G · Kapalı test: 12 testçi × 14 gün (bireysel hesap zorunluluğu) — testçi listesini şimdiden topla
- [ ] G · Production'a gönder → inceleme 1-3 gün

## Yayın sonrası
- [ ] T · v2 → main birleştirme (V1 arşiv dalına alınır: `git branch v1-archive main` sonra v2 main'e merge)
- [ ] G · Crash/ANR takibi, yorum yanıtlama
- [ ] A · v1.1: Kasımpaşa haritası + denge + ilk IAP değerlendirmesi
