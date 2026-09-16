# İstanbul Mafia

_KOZA Oyun (Claude Code Game Studios) · Sahip: LUMEN CO. · Repo: bgokayk/istanbul-mafia_

## Ne

Tek dosyalık HTML5/Canvas roguelite-arena oyunu (`www/index.html`). İstanbul temalı, top-down aksiyon: karakter seç, harita seç, dalga dalga düşman öldür, relic/eşya topla, run sonunda ilerleme kaydet. Android'e Capacitor ile sarmalanır, Google Play hedefli.

Unity ile paralel bir yeniden yazım denemesi `unity/` altında **park edilmiş** durumda — aktif geliştirme HTML5 tarafında sürüyor.

## Neden

Oyun mobil, dokunmatik, günlük görev/giriş bonusu mimarisiyle F2P olarak tasarlanmış. Capacitor sarmalı hazır olduğundan Android/Google Play'e çıkmak, Unity yeniden yazımını bitirmekten çok daha az iş. Detaylı gerekçe ve durum için `docs/DURUM-RAPORU-2026-09-16.md` ve yol haritası için `PLAN.md`.

## Nasıl çalıştırılır

### Web (hızlı test)
```
python -m http.server 8787 --directory www
```
Tarayıcıda `http://localhost:8787` aç.

### Android (Capacitor)
Ön koşul: Node 20, JDK 21, Android SDK cmdline-tools (`ANDROID_HOME` ayarlı).

```
npm install
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```
Çıktı: `android/app/build/outputs/apk/debug/app-debug.apk`

## Klasör yapısı

| Yer | İçerik |
|---|---|
| `www/index.html` | **Tek kaynak.** Oyunun tamamı (Canvas, vanilla JS). |
| `docs/index.html` | GitHub Pages'te yayınlanan kopya — sürüm anında `www/index.html`'den kopyalanır. |
| `android/` | Capacitor Android sarmalı (Gradle projesi). |
| `assets/store/` | Mağaza görseli üreticisi (`generate-icons.html`) ve çıktılar. |
| `unity/` | Park edilmiş Unity 6 yeniden yazım denemesi — dokunulmaz. |
| `production/` | Sürüm notları, session logları. |
| `docs/` | Brief, plan, rapor ve mağaza metni taslakları. |

## Ekip / Handoff akışı

Bkz. `C:\Dev\00-GENEL\EKOSISTEM.md`. Kısaca: **Astra (GPT) kodu yazar, Terminal (Claude Code) doğrular ve commit'ler.** `PLAN.md` durum tablosunu, `CHECKLIST.md` son teslim listesini tutar.

## Lisans

Henüz belirlenmedi (repodaki eski MIT şablon lisansı kaldırıldı — üçüncü taraf bir şablona aitti).
