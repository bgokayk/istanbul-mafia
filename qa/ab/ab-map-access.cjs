const assert = require('assert/strict');
const crypto = require('crypto');
const { fs, out, root, server, launch, ev } = require('./ab-harness.cjs');

(async () => {
  const browser = await launch();
  const result = { errors: [], freshRecord: {}, boundaries: [], sourceHash: crypto.createHash('sha256').update(fs.readFileSync(root + '/index.html')).digest('hex') };
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
    const page = await context.newPage();
    page.on('pageerror', e => result.errors.push(e.message));
    await page.goto(`http://127.0.0.1:${process.env.PORT || 8798}`);
    await page.locator('.mb-play').click();
    await page.locator('.ccard').filter({ hasText: 'USTURA' }).click();
    await page.locator('#charScreen .bok').click();
    const card = name => page.locator('.mcard').filter({ hasText: name });
    result.freshRecord.level = await ev(page, 'getAccountLevel()');
    assert.equal(result.freshRecord.level, 1);
    assert.equal(await ev(page, 'MAPS.find(m=>m.id==="taksim").unlockLevel'), 15);
    const taksim = card('TAKSİM MEYDANI');
    assert.match(await taksim.innerText(), /HESAP LVL 15/);
    await taksim.click();
    assert.notEqual(await ev(page, 'selMap.id'), 'taksim');
    await taksim.tap();
    assert.notEqual(await ev(page, 'selMap.id'), 'taksim');
    assert.equal(await taksim.evaluate(e => e.classList.contains('sel')), false);
    result.freshRecord.taksimLockedForClickAndTouch = true;
    result.freshRecord.openMaps = [];
    for (const [id, name] of [['kapalicarsi','KAPALIÇARŞI'],['uskudar','ÜSKÜDAR SAHİLİ'],['besiktas','BEŞİKTAŞ MEYDANI'],['eminonu','EMİNÖNÜ']]) {
      await card(name).click();
      assert.equal(await ev(page, 'selMap.id'), id);
      result.freshRecord.openMaps.push(id);
    }
    assert.equal(await card('EMİNÖNÜ').locator('.mtag').filter({ hasText: /^ZOR$/ }).count(), 1);
    result.freshRecord.eminonuBadge = 'ZOR';
    const assertInsideCard = async (mapCard, label) => {
      const inside = await mapCard.evaluate((element, text) => {
        const label = [...element.querySelectorAll('div,span')].find(e => e.childElementCount === 0 && e.textContent.includes(text));
        if (!label) return false;
        const a = element.getBoundingClientRect(), r = label.getBoundingClientRect();
        return label.checkVisibility() && r.width > 0 && r.height > 0 && r.left >= a.left && r.right <= a.right && r.top >= a.top && r.bottom <= a.bottom;
      }, label);
      assert(inside, label + ' must fit inside its map card');
    };
    await assertInsideCard(taksim, 'HESAP LVL 15');
    await assertInsideCard(card('EMİNÖNÜ'), 'ZOR');
    result.freshRecord.labelsInsideCards = true;
    await page.locator('#im-toast.on').waitFor({state:'hidden'});
    await taksim.screenshot({ path: out + '/taksim-locked-card.png' });
    await card('EMİNÖNÜ').screenshot({ path: out + '/eminonu-hard-card.png' });
    await page.screenshot({ path: out + '/fresh-map-cards.png' });
    result.layouts = [];
    for (const [width, height] of [[390,844],[540,1310],[844,390],[932,430]]) {
      await page.setViewportSize({width, height});
      await assertInsideCard(taksim, 'HESAP LVL 15');
      await assertInsideCard(card('EMİNÖNÜ'), 'ZOR');
      result.layouts.push({width,height,labelsInsideCards:true});
    }
    // Only this controlled boundary test changes account XP in memory. Natural runs use fresh, unmodified records.
    for (const [xp, level, unlocked] of [[13999,14,false],[14000,15,true]]) {
      await ev(page, `pdata.totalXP=${xp};selMap=MAPS[0];buildMapScreen();`);
      assert.equal(await ev(page, 'getAccountLevel()'), level);
      await taksim.click();
      assert.equal((await ev(page, 'selMap.id')) === 'taksim', unlocked);
      assert.equal((await taksim.innerText()).includes('HESAP LVL 15'), !unlocked);
      result.boundaries.push({ xp, accountLevel: level, taksimSelectable: unlocked });
    }
    assert.equal(result.errors.length, 0);
    result.pass = true;
    await context.close();
  } finally {
    fs.writeFileSync(out + '/map-access.json', JSON.stringify(result, null, 2));
    await browser.close();
    server.close();
  }
  console.log(JSON.stringify(result));
})().catch(e => { console.error(e); process.exitCode = 1; server.close(); });
