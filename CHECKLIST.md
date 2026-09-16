# CHECKLIST — Terminal kurulum (2026-09-17)

_Kaynak: `docs/BRIEF-TERMINAL-KURULUM.md`_

- [ ] Repo temizliği: şablon README/LICENSE/FUNDING/.claude/CLAUDE.md ve ilgisiz scopegoal/, docs/born-to-rise.html, docs/scopegoal.html, docs/WORKFLOW-GUIDE.md, docs/COLLABORATIVE-DESIGN-PRINCIPLE.md, docs/engine-reference/, docs/examples/, src/istanbul-mafia-v2.html, production/session-state/ kaldırıldı
- [ ] Yeni README.md, CHECKLIST.md, .env.example yazıldı; .gitignore'a `*.jks`, `*.keystore`, `android/app/build/` eklendi
- [ ] JDK 21 kuruldu (Adoptium Temurin)
- [ ] Android cmdline-tools kuruldu, `platform-tools` + `platforms;android-36` + `build-tools;36.0.0` indirildi
- [ ] `JAVA_HOME` / `ANDROID_HOME` ortam değişkenleri ayarlandı
- [ ] `npm install` çalıştı
- [ ] `npx cap sync android` çalıştı
- [ ] `gradlew assembleDebug` başarılı, `android/app/build/outputs/apk/debug/app-debug.apk` üretildi
- [ ] Store ikonları üretildi (`assets/store/out/`), mipmap ikonları android projesine kondu
- [ ] GitHub Pages kaynağı doğrulandı, `docs/index.html` = `www/index.html` (md5 eşleşti)
- [ ] Commit + push yapıldı
- [ ] **GitHub'a push edildi mi?**
