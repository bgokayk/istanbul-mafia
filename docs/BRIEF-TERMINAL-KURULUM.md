PROJE: İstanbul Mafia (KOZA Oyun)   KLASÖR: C:\Dev\CO\koza\istanbul-mafia   REPO: bgokayk/istanbul-mafia (klonlanmış, main)
GÖREV: Repoyu KOZA standardına getir, Android derleme ortamını kur, ilk debug APK'yı üret.
STACK: HTML5/Vanilla JS tek dosya (www/index.html) + Capacitor 8.3 Android · Node 20 · JDK 21 · Android SDK cmdline-tools (API 35/36) · Gradle wrapper mevcut

ADIMLAR:
1. `gh auth login` (bgokayk). `git pull`.
2. Temizlik (tek commit "chore: KOZA repo düzeni"):
   - Sil: README.md (şablon), LICENSE (Donchitos MIT — oyun için yeni yazılacak), .github/FUNDING.yml, UPGRADING.md, "Claude Code Game Studios.code-workspace", .claude/ tamamı, scopegoal/, docs/born-to-rise.html, docs/scopegoal.html, docs/WORKFLOW-GUIDE.md, docs/COLLABORATIVE-DESIGN-PRINCIPLE.md, docs/engine-reference/, docs/examples/, src/istanbul-mafia-v2.html (www/index.html ile birebir aynı), production/session-state/.
   - Dur: unity/ (park, silinmez), codemagic.yaml (kullanılmaz ama dursun), vercel.json.
   - Yeni README.md (KOZA: ne/neden/nasıl çalıştırılır: `python -m http.server 8787 --directory www`), CHECKLIST.md (son madde "GitHub'a push edildi mi?"), .env.example (KEYSTORE_PATH, KEYSTORE_PASS, KEY_ALIAS — sadece isim), .gitignore'a `*.jks`, `*.keystore`, `android/app/build/`, `node_modules/` ekle.
   - PLAN.md ve docs/DURUM-RAPORU-2026-09-16.md zaten var; dokunma.
3. Ortam: JDK 21 (Adoptium Temurin, winget: `EclipseAdoptium.Temurin.21.JDK`), Android cmdline-tools → `sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0"`, ANDROID_HOME + JAVA_HOME ortam değişkenleri. `android/variables.gradle` içindeki compileSdk/targetSdk ile uyumlu platform indir.
4. `npm install` → `npx cap sync android` → `cd android && .\gradlew.bat assembleDebug`. Çıktı: android\app\build\outputs\apk\debug\app-debug.apk. Hata varsa raporla, düzeltme yapma.
5. assets/store/generate-icons.html'i tarayıcıda aç, 512 ikon + 1024×500 feature indir → assets/store/out/; ikonu android/app/src/main/res/mipmap-*/ic_launcher*.png yerine koy (capacitor-assets kullanılabilir: `npx @capacitor/assets generate --android`).
6. GitHub Pages bayat (v6.1 gösteriyor): Settings → Pages kaynağını doğrula (main /docs), docs/index.html'in www/index.html ile aynı olduğunu md5 ile kontrol et.
7. Commit + push. CHECKLIST.md'yi sun.
NOT: EKOSISTEM.md kurallarına uy. www/index.html'in İÇİNE dokunma — o Astra'nın. Keystore bu fazda üretilmez (Faz 2).
