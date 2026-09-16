# CHECKLIST — Terminal kurulum (2026-09-17)

_Kaynak: `docs/BRIEF-TERMINAL-KURULUM.md`_

- [x] Repo temizliği: şablon README/LICENSE/FUNDING/.claude/CLAUDE.md ve ilgisiz scopegoal/, docs/born-to-rise.html, docs/scopegoal.html, docs/WORKFLOW-GUIDE.md, docs/COLLABORATIVE-DESIGN-PRINCIPLE.md, docs/engine-reference/, docs/examples/, src/istanbul-mafia-v2.html, production/session-state/ kaldırıldı — tek commit (`039ba62`)
- [x] Yeni README.md, CHECKLIST.md, .env.example yazıldı; .gitignore'a `*.jks`, `*.keystore`, `android/app/build/` eklendi
- [x] JDK 21 kuruldu (Adoptium Temurin 21.0.12.1, winget)
- [x] Android cmdline-tools kuruldu (`C:\Android\sdk`), `platform-tools` (37.0.1) + `platforms;android-36` + `build-tools;36.0.0` indirildi — `variables.gradle`'daki compileSdk/targetSdk=36 ile uyumlu (brief'te örnek olarak geçen 35 değil, gerçek proje ayarı 36 kullanıldı)
- [x] `JAVA_HOME` / `ANDROID_HOME` ortam değişkenleri (User) kalıcı olarak ayarlandı
- [x] `npm install` çalıştı (92 paket; `npm audit` 3 zafiyet bildiriyor — 2 high, 1 critical, düzeltme bu fazda yapılmadı, bilgi amaçlı)
- [x] `npx cap sync android` çalıştı
- [x] `gradlew assembleDebug` **BUILD SUCCESSFUL** — `android/app/build/outputs/apk/debug/app-debug.apk` (4.1 MB). APK, `.gitignore`'daki `android/app/build/` kuralı gereği **commit edilmedi**, sadece lokalde duruyor.
- [x] Store ikonları üretildi: `assets/store/generate-icons.html` tarayıcıda çalıştırılıp `icon-1024.png`, `icon-512.png`, `feature-graphic.png` → `assets/store/out/` (bu klasör için `.gitignore`'daki genel `out/` kuralına istisna eklendi). `@capacitor/assets generate --android` ile `assets/icon.png` kaynağından adaptive icon + splash (light/dark, tüm yoğunluklar, 74 dosya) üretilip `android/app/src/main/res/` altına kondu. İkonlu APK ile yeniden derleme de başarılı.
- [x] GitHub Pages kaynağı doğrulandı — **sorun bulundu, düzeltilmedi (kullanıcı kararı):** Pages kaynağı `main`/`docs` değil, **`gh-pages` branch'i** (son commit 2026-04-07, "deploy: modifier auto-start..."). `docs/index.html` içeriği `www/index.html` ile md5 eşleşiyor (v6.4, güncel) ama hiç yayınlanmıyor çünkü Pages yanlış branch'ten build alıyor. Canlı site (`bgokayk.github.io/istanbul-mafia/`) hâlâ v6.1 gösteriyor. **Aksiyon gerekiyor:** Settings → Pages → Source'u `main` / `/docs` olarak değiştir (GitHub web arayüzünden veya onay verilirse `gh api -X PUT repos/bgokayk/istanbul-mafia/pages -f source[branch]=main -f source[path]=/docs` ile).
- [x] Commit + push yapıldı (`039ba62` repo düzeni, `bc184c8` Android build + ikonlar, bu commit)
- [x] **GitHub'a push edildi mi?** Evet.

## Ek notlar
- `gh auth login` bu oturumda tamamlandı (`bgokayk` olarak, Opera üzerinden device-code akışı).
- `www/index.html` içine **hiç dokunulmadı** — oyun kodu Astra'nın alanı.
- `unity/`, `codemagic.yaml`, `vercel.json` brief talimatınca dokunulmadan bırakıldı.
- LICENSE kaldırıldı, yeni bir lisans seçilmedi (README'de not var) — Faz kararı gerektirir.
