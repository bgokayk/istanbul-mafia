# AdMob yapılandırması
_Oluşturuldu: 2026-10-02 · Hesap: b.gokaykupeli@gmail.com_

| Alan | Değer |
|---|---|
| Uygulama | İstanbul Mafia (Android) |
| Uygulama kimliği | `yerel .env dosyasında` |
| Geçiş reklamı — `run_sonu_gecis` | `yerel .env dosyasında` |
| Ödüllü — `canlanma_2x_altin` (ödül: odul ×1) | `yerel .env dosyasında` |
| Durum | Uygulama "İnceleme gerekli"; mağazada yayınlanınca AdMob'a bağlanacak |
| İş ortağı teklif sistemi | Kapalı (üçüncü taraf veri paylaşımı yok) |

## Bekleyen (Gökay)
- **Ödeme profili** AdMob'da tamamlanmadı → onaylanana kadar reklam yayınlanmaz, kazanç ödenmez. Geliştirme bunu beklemez.
- Hesap doğrulaması sürüyor (24 saat - 2 hafta).
- Oyun Play'de yayınlandıktan sonra: AdMob > Uygulamalar > mağaza bağlantısı ekle.

## Geliştirme kuralı
Kod bu kimlikleri **gömmez**. Test aşamasında Google'ın resmi test birimleri kullanılır:
- geçiş: `ca-app-pub-3940256099942544/1033173712`
- ödüllü: `ca-app-pub-3940256099942544/5224354917`

Gerçek kimlikler `.env` üzerinden (bkz. `.env.example`) veya build adımında enjekte edilir.
Uygulama kimliği `AndroidManifest.xml`'e `com.google.android.gms.ads.APPLICATION_ID` meta-data olarak girer — bu dosya Terminal'in alanı.
