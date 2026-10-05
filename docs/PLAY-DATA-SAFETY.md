> **2 Ekim 2026 — BU ESKİ METİN V1.0 REKLAM + IAP SÜRÜMÜ İÇİN YAYINA HAZIR DEĞİLDİR.** Aşağıdaki reklamsız/çevrimdışı sürüm beyanı arşiv bilgisidir. AdMob SDK ve Google Play satın alma doğrulaması eklendi. “Veri toplanmıyor”, “reklam/IAP yok” ve “INTERNET gereksiz” cevapları artık kullanılamaz. Güncel teknik veri akışı ve yayın kapıları: [MONETIZATION-KURULUM](MONETIZATION-KURULUM.md). Native SDK Data Safety beyanı ve sunucu işletim/saklama bilgileri doğrulanıp TR+EN metin yeniden onaylanmadan bu metni yayımlama.

# Google Play — Data Safety formu cevapları
_Kanıt: `www/` içinde 0 dış URL, 0 fetch/XHR/WebSocket/sendBeacon; manifest izinleri: INTERNET, VIBRATE._

| Soru | Cevap |
|---|---|
| Uygulamanız kullanıcı verisi topluyor veya paylaşıyor mu? | **Hayır** |
| Veriler aktarımda şifreleniyor mu? | Soru düşer (veri aktarılmıyor) — form zorlarsa "Evet, veri toplanmıyor" açıklaması |
| Kullanıcı veri silme talebinde bulunabilir mi? | Veri toplanmıyor; ilerleme uygulama kaldırılınca silinir |
| Reklam kimliği kullanılıyor mu? | Hayır |
| Üçüncü taraf SDK | Yok (yalnız Capacitor çalışma zamanı) |
| Hedef kitle | 13+ (Teen). Çocuklar için tasarlanmış değil → Families politikası kapsamı dışı |
| Uygulama içi satın alma | Hayır (v1.0) |
| Reklam içerir | Hayır |

**Yapılacak:** `AndroidManifest.xml`'deki `INTERNET` izni kullanılmıyor → kaldırılması önerilir ("veri toplanmıyor" beyanını güçlendirir, inceleme sorusu doğurmaz). Bu dosya Terminal'in alanı; kaldırdıktan sonra APK'nın açıldığı doğrulanmalı.
