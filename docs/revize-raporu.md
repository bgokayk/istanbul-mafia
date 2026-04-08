# Istanbul Mafia v6.2 — Revizyon Raporu

**Tarih:** 2026-04-06  
**Commit:** feat: v6.2 — kapsamlı revizyon, bug fix, yeni içerik

---

## Düzeltilen Buglar

| # | Bug | Düzeltme |
|---|-----|---------|
| B1 | Menü tam ekran | `.menu-over` justify → space-evenly, `.mbtns` padding:0 |
| B2 | Joystick aşağı | `#joy` CSS'e touch-action:none, dead zone 4px eklendi |
| B3 | Relic TAK/ÇIKAR | Butonlara min-height:44px eklendi |
| B4 | Gold drop 0 | Drop çarpanı 0.8x → 2.4x, v5_dovizci gold:0 → gold:2 |
| B5 | Shop çok pahalı | Tüm shop maliyetleri ×0.4 (min 2700, max 57000) |
| B6 | Wave scaling | HP scaling 0.18 → 0.15 |
| B7 | Minimap boyutu | Canvas explicit 90×90 yapıldı |
| B9 | Timer konumu | Zaten doğruydu, doğrulandı |
| B14 | Ölüm ekranı buton | min-height:44px, touch-action:manipulation |

---

## Eklenen Özellikler

| # | Özellik | Detay |
|---|---------|-------|
| B10 | Combo timer | 3sn → 5sn; "KIRIP GEÇİYOR!" banner 50 kill'de |
| B11 | Elite düşmanlar | wave%7 → %10 şans; 2.5x HP, sarı aura, garantili 15-25 altın |
| B12 | Boss takviye | Her 25sn aktif boss varken "TAKVİYE GELİYOR!" + 5-8 spawn |
| B13 | Intro hikayesi | Yeni metin, 1.5sn satır arası, ATLA butonu baştan görünür |
| B15 | Level up banner | "⬆ LVL X SEVİYE ATLADI!" scale animasyonu |
| B16 | 2 yeni düşman | `gardiyan` (flanklama, ustura), `kumarbaz_elite` (boss-lite) |
| B17 | 5 yeni relic | Taksici Direksiyonu, Balık Ağı, Berber Usturası, Döviz Çarkı, İnşaat Kaskı |
| B18 | 5 yeni shop item | Espresso, Nazar Kolye, İstanbul Haritası, Kayıp Tabanca, Patron Sigarası |

---

## Ekonomi Hedefleri

| Durum | Önceki | Sonraki |
|-------|--------|---------|
| 10 dakika altın | ~80-120 | ~300-400 |
| En ucuz shop | 6.750 | 2.700 |
| En pahalı shop | 142.500 | 57.000 |
| Elite drop | 0 (boss only) | 15-25 garantili |

---

## Bilinen Kalan Sorunlar

- Minimap CSS'inin `width/height` özelliği de explicit ayarlanmalı (sadece canvas attr değil)
- Gardiyan ve kumarbaz_elite düşmanlar spawn tablosuna henüz eklenmedi — wave ilerlendikçe yeni enemy type için ET seçici güncellenmeli
- `minimapAlways` (İstanbul Haritası shop) fog reset lojiği yok — pdata flag okunmuyor
- Espresso/Sigara buffs kalıcı (per-run), 60sn/45sn timer yok

---

## Test Edilmesi Gerekenler

- [ ] Menü tam ekran görünüyor mu?
- [ ] Joystick 4 yönde çalışıyor mu?
- [ ] 10 dakika oynayınca ~300-400 altın birikiyor mu?
- [ ] Shop'tan en ucuz item alınabiliyor mu?
- [ ] Wave 7, 14, 21'de elite düşman spawnar mı? (sarı aura)
- [ ] Boss aktifken 25sn sonra "TAKVİYE GELİYOR!" görünüyor mu?
- [ ] Level atlarken "SEVİYE ATLADI!" banner görünüyor mu?
- [ ] Relic ekranında TAK/ÇIKAR butonları mobilde çalışıyor mu?
- [ ] Yeni relicler (taksi_dir, balik_agi, vb.) equip edilebiliyor mu?
- [ ] Yeni shop itemleri (espresso, nazar, vb.) satın alınabiliyor mu?
