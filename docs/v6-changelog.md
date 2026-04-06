# Istanbul Mafia v6.0 — Changelog

**Yayın Tarihi:** 2026-04-06
**Önceki Sürüm:** v5.0

---

## Eklenen Özellikler

### Hikaye Sistemi
- **Açılış intro** güncellendi: 7 satır, typewriter efekti
- **Boss diyalogları** genişletildi: giriş + ölüm dialogu, portré ikon, ekranın altında 4 saniye
- **Karakter backstory**: Her karakterin kısa hikayesi karakter seçim ekranında görünür
- **Testere Necmi** giriş ve ölüm diyaloğu eklendi

### Görev Sistemi
- **5 Ana Görev** (story quest): İlk Kan → Son Hesaplaşma
- **Günlük Görevler**: Her gün tarih bazlı 3 görev, 6 görev tipinden seçilir
- **5 Yan Görev**: Koleksiyoncu, Gezgin, İntikamcı, Katil, Evrimci
- **GÖREVLER** menü butonu eklendi
- **Quest ekranı**: 3 sekme (ANA / GÜNLÜK / YAN)
- **Oyun içi quest tracker**: Sol üstte aktif günlük görev ve ilerleme

### Yeni Mekanikler
- **Combo sistemi** yükseltildi: 5/10/25/50 kill streak → 1.1x/1.3x/1.5x/2.0x hasar (3sn inactivity sıfırlar)
- **Dash**: Mobilde çift dokunuş ile kısa dash, 0.3sn dokunulmazlık, 5sn cooldown
- **Günlük giriş bonusu**: Gün 1-3: 500💰 | Gün 4-7: 1000💰 | 7+: 2500💰 streak bonusu

### Düşman AI
- **Elite düşmanlar**: Her 7. dalgada %10 spawn şansı — 3x HP, 1.5x hız, +100💰 ödül
- **Ambush sistemi**: Her 3. dalgada (3,6,9...) 3 yönden aynı anda 5'er düşman + "BASKINA UĞRADIN!" uyarısı

### UI/UX
- **Timer rengi**: 0-3dk yeşil, 3-7dk sarı, 7+dk kırmızı pulse animasyonu
- **Menü**: space-between layout, max-width kaldırıldı, stats bar en alta yapışık
- **CSS**: Quest stilleri, combo HUD, kart glow animasyonları (epic/rare)

### Denge
- Wave HP scaling: **0.22 → 0.18** (daha yavaş ölçekleme)
- Gold drop: **2x → 4x**
- Silah cooldown: Darbuka -20%, Kahve -50%, Kebap şiş -20%

---

## Düzeltilen Buglar
- Boss diyalog kutusu oyun ortasından alt konuma taşındı
- Intro metni sadeleştirildi (8→7 satır, gereksiz tekrar kaldırıldı)
- `_comboTimer` / `_comboKills` değişkenleri doğru başlatıldı

---

## Bilinen Sorunlar
- Elite düşman görsel aura henüz yok (sarı halka çizimi canvas entegrasyonu yapılmadı)
- Dash afterimage efekti henüz yok (sadece boom partikülü var)
- Yan görev ilerlemesi bazı metriklerde (evolutions, crits) run bazlı; kalıcı takip için pdata güncellenmeli
- Quest ekranında günlük görev tamamlandı kontrolü sadece client-side

---

## Tahmini Oynanış Süresi
- Tüm ana görevleri tamamlamak: ~3-5 saat
- Yan görev "Katil" (10.000 kill): 10+ saat
- Günlük görevler: ~15-20 dakika/gün
