ROL: Bu projenin ana geliştiricisisin. C:\Dev\CO\koza\istanbul-mafia\README.md, PLAN.md ve docs/DURUM-RAPORU-2026-09-16.md'yi oku.
HEDEF: www/index.html'i (HTML5 roguelite, tek dosya, 5758 satır) Google Play'e çıkabilecek, IP-temiz, IAP'siz v1.0.0 sürümüne getir.

KAPSAM (PLAN.md Faz 1, sırayla; her madde ayrı, PLAN.md'de işaretle):
1. IP temizliği — CHARS (satır ~779), boss tanımları, INTRO_LINES, QUESTS/SIDE_QUESTS/ACHS metinleri, tutorial ve diyaloglar. Değişecek adlar: POLAT, MEMATI, CAKIR/ÇAKIR, ABDÜLHEY, DAYI, KEMAL BABA, EŞREF TAKSİCİ, TESTERE NECMİ ve diğer dizi göndermeleri. Yerine ONAYLI adlar: POLAT→KURT, MEMATI→ÇELİK, CAKIR→USTURA, ABDÜLHEY→ZARCI, DAYI→AMCA, KEMAL BABA→BABA, EŞREF TAKSİCİ→ŞOFÖR, TESTERE NECMİ→TESTERE. Intro hikâyesi 'Kurt' üzerinden yeniden yazılır (aynı ton, dizi göndermesi yok). id alanlarına dokunma (localStorage uyumu), yalnız görünen name/desc/story.
2. Font: `Press Start 2P` .ttf/.woff2 dosyasını www/fonts/ altına koy (OFL lisans dosyasıyla), @font-face yerel, Google Fonts <link> kaldır.
3. Premium kapat: menüdeki PREMIUM butonu ve buildPremiumScreen çağrıları gizlenir; PREMIUM_PKGS dizisi ve handlePremiumBuy ("Test modu") kodu `PREMIUM_ENABLED=false` bayrağı arkasına alınır (silinmez, v1.1'de billing gelecek). Premium-kilitli 4 karakter ve içerik: altınla açılabilir hale getir ya da kilit metnini "v1.1'de" yap. "REKLAMSIZ", "HAFTALIK/YILLIK ABONELİK" hiçbir ekranda görünmez.
4. Jackpot → "ŞANS ÇARKI"; metinlerde para/ödül iması yok, yalnız altın. "lanet oku" metnini gözden geçir.
5. Bug turu: (a) run-özeti üstüne binen tutorial popup sırası, (b) ilk run sonrası "HESAP LVL 109" sıçraması — hesap seviyesi formülünü düzelt, (c) docs/revize-raporu.md "Bilinen Kalan Sorunlar" 4 madde, (d) tek `APP_VERSION='1.0.0'` sabiti; tüm "v6.x" yazıları oradan okunur.
6. Android davranışı: Capacitor `App` eklentisiyle donanım geri tuşu (oyun içi → pause; menüde → çıkış onayı), `KeepAwake` opsiyonel; ağ isteği sıfır (offline tam çalışır). Yeni eklenti eklersen package.json'a yaz, Terminal sync edecek.

KISITLAR:
- SADECE www/index.html (ve www/fonts/) düzenlenir. Şunlara DOKUNULMAZ: unity/ (park edilmiş Unity 6 projesi — Assets/, Packages/, ProjectSettings/ dahil), android/ (Terminal `cap sync` ile yönetir), docs/index.html (Terminal kopyalar), capacitor.config.json, codemagic.yaml, vercel.json, .gitignore, PLAN.md dışındaki *.md.
- Dosyayı modüllere bölme, framework ekleme, build adımı ekleme yok — tek dosya kalır.
- Oyun mekaniği/denge değişikliği yok (yalnızca listelenen buglar).
- id/localStorage anahtarları (`imv7*`) değişmez; eski kayıtlar bozulmaz.
- Sır yok; .env gerektiren bir şey bu fazda yok.
- Commit ATMA.

KABUL KRİTERLERİ:
1. `grep -ci "polat\|memati\|çakır\|cakir\|abdülhey\|abdulhey\|necmi\|eşref\|esref"` www/index.html → 0 (id alanları hariç; id'ler varsa grep'i name/desc ile sınırla ve raporla).
2. İnternet kapalıyken `python -m http.server` ile açılır, font pixel görünür, konsolda 0 hata.
3. Menüde PREMIUM/JACKPOT butonları yok/yeniden adlandı; hiçbir ekranda "Test modu", "ABONELİK", "REKLAMSIZ" geçmez.
4. Yeni profilde 20 sn'lik run sonrası hesap seviyesi ≤ 2; run özeti üstünde başka popup yok.
5. Sayfada tek sürüm yazısı: v1.0.0.
ÇIKTI: Kodu yaz, PLAN.md Faz 1 durumlarını güncelle, değişen satır aralıklarını kısa listeyle bildir, commit ATMA — Terminal doğrulayacak.
