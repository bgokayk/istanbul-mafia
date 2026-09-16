# İstanbul Mafia — PLAN

_Güncelleme: 2026-09-16 · Sahip: KOZA Oyun (CO) · Repo: bgokayk/istanbul-mafia_
_Durum işaretleri: ✅ bitti · 🔄 sürüyor · ⏳ bekliyor · ❌ kesildi_

## Karar özeti
- **Motor:** HTML5 / Vanilla JS + Canvas (tek dosya `www/index.html`, 5758 satır). Unity yeniden yazımı **park edildi** (`unity/`, dokunulmaz).
- **Platform + mağaza:** Android · **Google Play** (Capacitor 8 sarmalı). Tek hedef.
- **Ürün:** Ücretsiz, **IAP yok, reklam yok** (v1.0). Para kazanma v1.1'de.
- **Karakter adları (onaylı 2026-09-17):** POLAT→KURT · MEMATI→ÇELİK · ÇAKIR→USTURA · ABDÜLHEY→ZARCI · DAYI→AMCA · KEMAL BABA→BABA · EŞREF TAKSİCİ→ŞOFÖR · TESTERE NECMİ→TESTERE
- **Paket adı (onaylı):** `com.lumenco.istanbulmafia` kalır.
- **Tek kaynak:** `www/index.html`. `src/` kopyası kaldırılır, `docs/index.html` sürüm anında Terminal kopyalar.

---

## Faz 1 — Oynanabilir build (release candidate APK)
Hedef: telefonda kurulup çalışan, mağaza politikasına uygun, IP-temiz APK.

| # | İş | Sahip | Durum |
|---|---|---|---|
| 1.1 | Repo temizliği: şablon README/LICENSE/FUNDING/.claude ve ilgisiz `scopegoal/`, `docs/born-to-rise.html`, `docs/scopegoal.html` kaldır; KOZA README yaz | Terminal | ⏳ |
| 1.2 | `src/istanbul-mafia-v2.html` sil, `www/index.html` tek kaynak | Terminal | ⏳ |
| 1.3 | **IP temizliği:** 8 karakter + boss + intro + görev metinlerinde dizi karakter adları (Polat, Memati, Çakır, Abdülhey, Dayı, Kemal Baba, Eşref, Testere Necmi) → özgün isimler | Astra | ⏳ |
| 1.4 | Font `Press Start 2P` (OFL) yerel dosya olarak paketlenir; Google Fonts çağrısı kalkar (offline çalışmalı) | Astra | ⏳ |
| 1.5 | PREMIUM ekranı ve `PREMIUM_PKGS` (abonelik, REKLAMSIZ, paketler) v1.0'da **kapatılır**; premium-kilitli içerik ya altınla açılır ya gizlenir; "Test modu" satın alma yolu kaldırılır | Astra | ⏳ |
| 1.6 | JACKPOT → "Şans Çarkı" (yalnız oyun içi altın, gerçek para/ödül ima yok); "lanet oku" metni gözden geçir | Astra | ⏳ |
| 1.7 | Bilinen bug turu: tutorial popup run-özeti üstüne biniyor; ilk run sonrası "HESAP LVL 109" sıçraması; `revize-raporu.md` "Bilinen Kalan Sorunlar" 4 madde | Astra | ⏳ |
| 1.8 | Android donanım geri tuşu (menüye dön / çıkış onayı), ekran uyku engeli, portrait kilit doğrulama | Astra | ⏳ |
| 1.9 | Sürüm etiketi tek yerden (`APP_VERSION`), footer/menü "v6.x" karışıklığı bitsin → **v1.0.0** | Astra | ⏳ |
| 1.10 | Store görselleri: `assets/store/generate-icons.html` ile 512 ikon + 1024×500 feature + mipmap ikonlar | Terminal | ⏳ |
| 1.11 | JDK 21 + Android cmdline-tools kur, `npx cap sync android`, `gradlew assembleDebug` → APK | Terminal | ⏳ |
| 1.12 | Gerçek cihazda 10 dk oynanış testi, CHECKLIST | Gökay + Terminal | ⏳ |

**Faz 1 kabul:** APK cihazda açılır, offline çalışır, 10 dk run tamamlanır, IP'li isim kalmaz, premium/IAP ekranı görünmez, versionName 1.0.0.

## Faz 2 — Mağaza sayfası + yayın
| # | İş | Sahip | Durum |
|---|---|---|---|
| 2.1 | Google Play Developer hesabı ($25) · paket adı `com.lumenco.istanbulmafia` (onaylı) | Gökay | ⏳ |
| 2.2 | Gizlilik politikası sayfası (lumenco/koza sitesi) — oyun veri toplamıyor, yalnız localStorage | Terminal | ⏳ |
| 2.3 | Listing TR+EN yeniden yaz (dizi isimleri çıkar), 4+ ekran görüntüsü 1080×1920 | Sohbet + Gökay | ⏳ |
| 2.4 | IARC anketi (fantezi şiddet, simüle kumar, alkol referansı → beklenen PEGI 12 / Teen) · Data Safety formu | Gökay | ⏳ |
| 2.5 | Keystore üret ve **yedekle** (kayıp = uygulama kaybı) · `bundleRelease` → AAB | Terminal | ⏳ |
| 2.6 | Kapalı test: **12 test kullanıcısı × 14 gün** (yeni bireysel hesaplarda zorunlu) | Gökay | ⏳ |
| 2.7 | Production'a gönder, inceleme | Gökay | ⏳ |

## Faz 3 — İlk güncelleme (v1.1)
| # | İş | Durum |
|---|---|---|
| 3.1 | Kasımpaşa haritası aç (kodda hazır, `comingSoon`) | ⏳ |
| 3.2 | Yorum/crash geri bildirimine göre denge + bug turu | ⏳ |
| 3.3 | Gerçek IAP: Google Play Billing (Capacitor eklentisi) — önce tek "Başlangıç Paketi", abonelik yok | ⏳ |
| 3.4 | Karar: Unity yeniden yazımı devam mı, iptal mi (metriklere göre) | ⏳ |

## Kesilenler (v1.0'da yok)
- Premium paketler, haftalık/yıllık abonelik, REKLAMSIZ (reklam SDK'sı zaten yok)
- iOS / Codemagic hattı (Mac + $99 hesap gerekir) — `codemagic.yaml` durur, kullanılmaz
- Vercel/GitHub Pages web sürümü mağaza hedefi değil; yalnız test vitrini
- Unity MVP (`unity/`) — park
- Online liderlik tablosu
