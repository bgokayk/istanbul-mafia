# A/B doğrulama

Proje kökünde:

```powershell
node qa/ab/ab-controlled.cjs
node qa/ab/ab-layout-test.cjs
node qa/ab/ab-natural.cjs
node qa/ab/ab-performance.cjs
```

Playwright ve Edge gerekir. PLAYWRIGHT_PATH mevcut Playwright modülünü, EDGE_PATH tarayıcı yürütücüsünü, GAME_ROOT test edilecek www klasörünü, QA_OUT kanıt klasörünü değiştirebilir. Testler eşzamanlı çalıştırılmamalı; özellikle performans testi yalnız çalıştırılmalı. Test sunucusu yalnız localhost'a bağlanır. Doğal test gerçek RAF + klavye/arayüz kullanır, durum okuması rota seçer; oyun durumunu değiştirmez. Kontrollü testler sentetik sahneler kurar. QA_MODIFIERS=1 sadece sunulan normal tur güçlerini seçer; QA_RUNS örneği: {"uskudar":5,"besiktas":5}. Her doğal deneme yeni tarayıcı kaydıdır. Ölümle biten denemeler JSON içinde pass:false olarak kalır.

results/TEST-RAPORU.md teslim kanıtlarını açıklar. Ham Chrome trace gzip ile saklanır. Korunan klasörler, kaynak hash'leri ve geçiş kapsamı integrity.json/change-manifest.json içinde.
