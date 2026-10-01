# Keystore üretimi ve yedekleme (KRİTİK)
_Keystore kaybolursa uygulamanın güncellemesi bir daha yayınlanamaz. Yeni paket adıyla sıfırdan başlamak gerekir._

## 1. Üret (Terminal, bir kez)
```
cd C:\Dev\CO\koza\istanbul-mafia-v2\android
keytool -genkey -v -keystore istanbul-mafia.jks -keyalg RSA -keysize 4096 -validity 10000 -alias istanbulmafia
```
Sorular: ad/kurum = LUMEN CO., ülke = TR. Parolayı parola yöneticisine kaydet; bu dosyaya veya sohbete YAZMA.

## 2. android/keystore.properties (gitignore'da)
```
storeFile=istanbul-mafia.jks
storePassword=<parola yöneticisinden>
keyAlias=istanbulmafia
keyPassword=<parola yöneticisinden>
```
`.gitignore` içinde `*.jks`, `keystore.properties` olduğu doğrulandı. Repoya asla girmez.

## 3. build.gradle imzalama bloğu
`android/app/build.gradle` içine `signingConfigs.release` eklenir, `buildTypes.release` bunu kullanır; `minifyEnabled false` kalsın (WebView oyunu).

## 4. AAB üret
```
cd android && .\gradlew.bat bundleRelease
```
Çıktı: `android\app\build\outputs\bundle\release\app-release.aab`

## 5. Yedekle (üç ayrı yer)
1. Parola yöneticisi (dosya eki olarak .jks + parolalar)
2. Şifreli harici disk
3. Kişisel bulut (şifreli arşiv içinde)

Play App Signing açılırsa Google imza anahtarını tutar, ama **upload key** yine sende; kaybı yine sorun yaratır (Google'dan sıfırlama istenir).
