# Geçersiz hareketli tanı — kabul kanıtı değildir

Bu klasördeki eski `replay.json`, hareketli tekrar çiziminde başlangıç sahnesi ile canlı nesnelerin aynı referansı paylaşması nedeniyle geçersizdir. Konum ofsetleri birikerek nesneleri ekran dışına taşıyabiliyordu. Hız sonucu performans iyileşmesi olarak kullanılamaz.

`ab-scene-replay.cjs` artık başlangıç sahnesini ayrı tutar. Bu klasördeki eski sonuçlar üzerine yazılmadı; ana SOAK raporu bunları kabul ölçümü olarak kullanmaz.
