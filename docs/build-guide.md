# Istanbul Mafia — Build Guide

## Gereksinimler
- Node.js 18+
- Android Studio (Android build için)
- Xcode (iOS build için, Mac gerekli)
- Java 17+

## Android APK Build

1. Bağımlılıkları kur:
   npm install

2. Web dosyalarını sync et:
   npx cap sync

3. Android Studio'da aç:
   npx cap open android

4. Android Studio'da:
   Build > Generate Signed Bundle / APK
   - AAB seç (Google Play için)
   - Keystore oluştur veya mevcut olanı kullan
   - Release seç

## Test

### Browser'da test:
Tarayıcıda istanbul-studio/www/index.html aç

### Android emülatörde test:
npx cap run android

## Versiyon Güncelleme
android/app/build.gradle dosyasında:
- versionCode: her yayında +1
- versionName: "1.0.1" şeklinde güncelle
