# Istanbul Mafia v5.0 — Büyük Güncelleme Changelog

**Yayın Tarihi:** 2026-04-06  
**Önceki Sürüm:** v4.0  
**Dosya:** `src/istanbul-mafia-v2.html`

---

## Bölüm 1 — Kritik Buglar

- **Fullscreen menü**: `#app` ve `#menuScreen` artık `100vw × 100svh` kaplıyor
- **Silah HUD**: Her silah slotunda ikon (emoji) + kısa isim gösteriliyor (`renderWepSlots` güncellendi)
- **Timer ortalandı**: `#ibTime` pozisyonu `position:absolute; left:50%; transform:translateX(-50%)` ile tam ortada
- **Minimap fog of war**: Keşfedilmemiş bölgeler karanlık; `window._fogMap` sparse grid ile takip ediliyor; yalnızca keşfedilen hücrelerdeki düşmanlar minimapte görünüyor

## Bölüm 2 — Karakter Sistemi

- **DAYI kilidi**: 100.000 → **1.000.000 altın** gerektiriyor
- **DAYI gücü 2x**: `dmg: 18 → 36`; pasif: her öldürme 3 HP yeniler + chain multi
- **KEMAL BABA gücü 2x + bsize 3x**: `dmg: 28 → 56`; `bsize × 3`; pasif: geniş atış bonusu

## Bölüm 3 — Evrim Sistemi

- **40 evrim** (8 → 40): 32 yeni silah kombinasyonu eklendi
- Yeni evrimler: `lanet_kamasi`, `altin_firtina`, `cehennem_gozu`, `bogaz_korfezi`, `nazar_bombasi` ve 27 daha

## Bölüm 4 — Hikaye & Günlük Görevler

- **Ana hikaye intro**: Typewriter efektiyle 8 satır diyalog (55ms/karakter, satırlar arası 320ms); tıkla/dokun ile atla
- **Boss diyalogları**: Dalga 5/10/15/20'de ekran üstü boss konuşması (3 saniye görünür)
- **Testere Necmi**: 10. dakikada özel diyalog
- **Günlük görevler genişletildi**: 6 → 14 görev tipi (kill eşikleri, hayatta kalma süresi, kritik vuruş sayacı, Necmi öldürme, Taksim haritası, Dayı karakteri)

## Bölüm 5 — Denge

- **Dalga scaling**: 0.38 → 0.22 (önceki sürümde yapıldı, doğrulandı)
- **Altın dropu 2x**: `spawnGold(... * 2 * ...)`
- **10 yeni düşman tipi**:
  - `v5_taksici` — Hızlı taksi şoförü
  - `v5_balikci2` — Ağ atan balıkçı
  - `v5_caycı` — Fincan fırlatan çaycı
  - `v5_kebapci2` — Şiş kullanan kebapçı
  - `v5_berber` — Jilet atan berber
  - `v5_manav` — Zehirli meyve manav
  - `v5_dovizci` — Altın çalan dövizci
  - `v5_avukat` — Zırhlı avukat
  - `v5_insaatci` — Alan hasarı inşaatçı
  - `v5_kabaday` — Nadir boss benzeri kabadayı

## Bölüm 6 — Yeni Haritalar

- **Taksim**: Her 3 dalgada bir 5 adet `v5_taksici` sürüsü spawnar; `speedMult: 1.6`, `hpMult: 2.0`, `goldMult: 1.5`
- **Eminönü**: Balıkçı ağırlıklı spawn (%35 ekstra balıkçı şansı); `speedMult: 1.1`, `hpMult: 1.5`, `goldMult: 1.8`

## Bölüm 7 — Görseller

- **Level-up flash**: Mevcut `lvlFlashEl` aktif (önceden vardı, doğrulandı)
- **Combo banner**: Her 50 kill'de `COMBO x50!` animasyonlu banner (scale in/out)
- **Boss yavaş-mo**: Boss ölümünde 320ms boyunca zaman `0.2x` hıza iniyor
- **Büyük kritik sayılar**: Kritik vuruşlarda `💥` öneki, daha büyük font (18px), kırmızı parıltı efekti, scale animasyonu
- **Menü glitch animasyonu**: MAFIA başlığı her 8 saniyede bir `clip-path` tabanlı glitch efekti
- **Menü arka plan partikülleri**: Turuncu/altın renk kor parçacıkları menü arka planında yüzerek hareket ediyor (40 parçacık, `requestAnimationFrame` döngüsü)
- **Buton hover parıltısı**: `.mbtn:hover,.mbtn:active` → altın renk box-shadow

## Bölüm 8 — Deploy

- **Sözdizimi kontrolü**: `vm.Script` ile doğrulandı — SYNTAX OK
- **www/index.html senkronize** edildi
- **Hata düzeltmesi**: 10 yeni düşman tipinde `}));` → `});` fazla parantez düzeltildi
- **`_taksiciWaveSpawned` bug fix**: Global değişken eklendi, wave geçişinde reset
- **`_shownBossDialogs` reset**: `startGame()` içinde her oyun başında temizleniyor

---

## Teknik Notlar

- Tüm oyun tek HTML dosyasında (`istanbul-mafia-v2.html`, ~3900 satır)
- `pdata` nesnesi localStorage'da `imv7` anahtarıyla saklanıyor
- Menü canvas artık static değil, animasyonlu (`drawMenuCanvasFrame` RAF döngüsü)
- `_slowMoTimer` global değişkeni ile zaman dilatasyon efekti game loop'ta uygulanıyor
