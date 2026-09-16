# İstanbul Mafia — Durum Raporu (Keşif)
_2026-09-16 · Kaynak: bgokayk/istanbul-mafia klonu (61 commit, son 2026-04-21) · lokal: C:\Dev\CO\koza\istanbul-mafia_

## 1. Repoda ne var
Repo aslında **üç şeyin üst üste binmiş hali**:

| Katman | Yer | Durum |
|---|---|---|
| A. HTML5 oyun (v6.4) | `www/index.html` = `src/istanbul-mafia-v2.html` = `docs/index.html` (üçü md5 aynı, 385 KB, 5758 satır) | **Oynanabilir.** Lokal sunucuda test edildi: menü → karakter → harita → intro → run → run özeti akışı çalışıyor, konsol hatası yok |
| B. Android sarmalı | `android/`, `capacitor.config.json`, `package.json` (Capacitor 8.3) | Proje var, **hiç derlenmemiş** (JDK yoktu). `android/app/src/main/assets/public` boş → `cap sync` yapılmamış |
| C. Unity 6 (6000.4.3f1) URP 2D yeniden yazım | `unity/` — 5 .cs (332 satır), 4 CharacterData SO, 9 PNG, Cinemachine | 2026-04-21'de Adım 4/10'da durmuş: iskelet + hareket + kamera. Düşman/silah/dalga/UI yok. **~5%** |
| — Gürültü | `.claude/` (48 ajanlı "Claude Code Game Studios" şablonu, README/LICENSE/FUNDING şablon sahibine ait), `scopegoal/`, `docs/born-to-rise.html`, `docs/scopegoal.html`, `codemagic.yaml` (iOS) | Oyunla ilgisiz / yanıltıcı. Temizlenmeli |

Yarım kalma noktası: HTML oyun 2026-04-13'te "yayına hazır" seviyede bırakılmış; 2026-04-21'de Unity'ye geçiş denenmiş, 1 günde bırakılmış. Yani **asıl blokaj kodda değil, yayın operasyonunda** (build, hesap, görseller, hukuk).

## 2. HTML5 oyunun içeriği (kod sayımı)
- 8 karakter (4 açık, 4 altın/premium kilitli) · 8 harita (5 açık, 3 `comingSoon`) · 3 zorluk
- ~60 relic · ~32 dükkan eşyası · 21 başarım · 14 ana + ~35 yan görev + günlük görevler · 8 premium paket (test modu)
- Boss'lar, elite, baskın, combo, dash, evrim, jackpot, günlük giriş bonusu
- Grafik: tamamen canvas primitif (harici görsel yok) · Müzik/SFX: Web Audio prosedürel (ses dosyası yok) · Tek dış bağımlılık: Google Fonts `Press Start 2P`
- Kayıt: `localStorage` (`imv7*`), ağ isteği yok

## 3. Tamamlanma yüzdeleri
| Alan | % | Not |
|---|---|---|
| Oyun çekirdeği + içerik | 90 | Bug turu gerek (aşağıda) |
| Mobil kontrol/UX | 85 | Joystick, çift dokunuş dash, 44px butonlar yapılmış |
| Android build hattı | 40 | Proje var, sync/derleme/imza yok, ikon PNG'leri yok |
| Mağaza görselleri | 20 | Sadece HTML üretici var, çıktı alınmamış, ekran görüntüsü yok |
| Mağaza metinleri | 50 | TR/EN taslak var ama dizi karakter adları geçiyor |
| Para kazanma | 5 | IAP "test modu — ücretsiz aktif" ile sahte; billing yok, reklam SDK yok |
| Hukuk/uyum (IP, gizlilik, derecelendirme) | 0 | Hiç başlanmamış |
| Unity yeniden yazım | 5 | Park |
| **Yayına toplam** | **~55** | Kalan iş çoğunlukla operasyon + IP temizliği |

**Oynanabilir build var mı?** Web olarak evet (lokal, Vercel, GitHub Pages — Pages'taki kopya v6.1/6.2 footer gösteriyor, bayat). APK olarak **hayır**.

## 4. Testte görülen sorunlar
1. Run özeti açılırken tutorial popup'ı ("10. dakikada TESTERE NECMİ gelir") üstüne biniyor.
2. 17 sn'lik ilk run sonrası "HESAP LVL 109!" — hesap seviyesi formülü şüpheli.
3. Aynı dosyada v6.0/v6.2/v6.4 sürüm etiketleri karışık.
4. `revize-raporu.md` "Bilinen Kalan Sorunlar": minimap CSS, gardiyan/kumarbaz_elite spawn tablosunda yok, `minimapAlways` fog, espresso/sigara buff süresi.
5. Font internetten yükleniyor → offline APK'da monospace'e düşer.

## 5. Eksik asset / bağımlılık
- JDK 17/21, Android SDK (cmdline-tools yeter; Android Studio şart değil)
- `npm install` çalıştırılmamış (node var)
- İkon PNG'leri (mipmap), splash, feature graphic, ekran görüntüleri
- Gizlilik politikası URL'si (`lumenco.com/privacy/istanbul-mafia` yok)
- Keystore
- `gh auth login` yapılmamış

## 6. "Yayına alınabilir minimum" (MVP v1.0)
**Şart:** 4 açık karakter + 5 açık harita + relic/dükkan/başarım/görev sistemi (var) · offline tam çalışma · Android geri tuşu · IP-temiz isimler · sürüm 1.0.0 · gizlilik politikası · IARC.
**Kes:** premium paketler + abonelik + REKLAMSIZ (sahte IAP mağaza reddi sebebi) · iOS · online skor · Unity · comingSoon haritalar gizli kalır.
**Yumuşat:** Jackpot → "Şans Çarkı", yalnız oyun içi altın.

## 7. Platform + mağaza kararı: Android / Google Play
Gerekçe:
- Oyun dikey, dokunmatik, günlük görev/giriş bonusu mimarisiyle **mobil F2P olarak tasarlanmış**; Steam/PC'ye zorlamak yeniden tasarım demek.
- Capacitor projesi hazır; kalan iş 1-2 gün operasyon. Unity yolu 2-3 ay.
- Tek dosya HTML, Astra'nın (ChatGPT) doğrudan çalışabildiği format; Unity Editor gerektiren iş Astra'ya verilemez.
- iOS için Mac + $99/yıl; Play $25 tek sefer.
- Alternatifler: itch.io web (0 maliyet, ama gelir/keşfedilebilirlik yok — test vitrini olarak Faz 1'de ücretsiz kullanılabilir, hedef değil); Poki/CrazyGames (kalite/yatay ekran şartı, uymuyor).

## 8. Riskler
| Risk | Seviye | Aksiyon |
|---|---|---|
| **Karakter adları** dizi IP'si: Polat, Memati, Çakır, Abdülhey, Testere Necmi (Kurtlar Vadisi / Pana Film), Dayı, Kemal (Ezel), Eşref (Eşref Rüya); intro metni Polat'ın hikâyesi; listing'de adlar geçiyor | **Yüksek** — Pana Film hak takibinde agresif; Play "impersonation/IP" ile kaldırır | Faz 1.3: tümünü özgün lakaplarla değiştir |
| "Mafia" kelimesi: Take-Two'nun video oyunlarında tescilli "Mafia" markası var | Orta-düşük — mağazalarda "X Mafia" adlı çok oyun var, tam eşleşme değil | Adı koru; yedek: "İstanbul: Kan ve Altın" (mevcut alt başlık) |
| Sahte IAP ("Test modu — ücretsiz aktif olacak"), abonelik ekranı, "REKLAMSIZ" satışı (reklam yok) | **Yüksek** — Play Billing politikası + yanıltıcı iddia | v1.0'da tamamen kapat |
| Jackpot / kumar temalı mekanikler, alkol eşyaları ("Alev İçkisi", "Sarhoş Şakir") | Orta — IARC'ta "simüle kumar" + "alkol referansı" → PEGI 12/16, Teen | Anket dürüst doldurulur; Teen hedeflenir; jackpot yalnız oyun içi altın |
| Yeni Play bireysel hesap: 12 testçi × 14 gün kapalı test zorunlu | Orta — takvimi 2+ hafta uzatır | Faz 2 başında hesabı aç, testçileri hazırla |
| Paket adı `com.lumenco.*` — yayından sonra değişmez; marka KOZA mı LUMEN mi? | Orta | İlk yüklemeden önce karar (Gökay) |
| Şablon lisansı: README/LICENSE/FUNDING başkasına (Donchitos, MIT) ait; ko-fi linki repoda | Düşük ama utandırıcı | Temizle; şablon kalıntısı kalıyorsa MIT notu `THIRD_PARTY.md` |
| Font Press Start 2P — OFL, paketlemek serbest | Yok | Yerel dosya |
| Müzik/SFX prosedürel, görseller canvas | Yok | — |
| Unity `unity/Assets/_Project/Sprites/*.png` kaynağı belirsiz | Düşük (park) | Yayında kullanılmıyor |
| Yaş: silah, molotov, "Kan ve Altın" | — | Teen / PEGI 12 bekle; kan efekti yok |
