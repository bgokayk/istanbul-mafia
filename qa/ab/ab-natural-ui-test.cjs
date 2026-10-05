const assert = require('assert/strict');
const { fs, out, server, launch, ev, start } = require('./ab-harness.cjs');
const { chooseUpgrade } = require('./ab-ui.cjs');
(async () => {
  const browser = await launch(), result = { errors: [] };
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on('pageerror', e => result.errors.push(e.message));
    await start(page, 'kapalicarsi');
    await ev(page, 'stopTutorial();resetInput();showCards(true);');
    assert.equal(await chooseUpgrade(page), true);
    assert.equal(await page.locator('#lvlup.on').count(), 1);
    assert.equal(await page.locator('#lvlup.on .luc').first().evaluate(e => getComputedStyle(e).pointerEvents), 'none');
    assert.equal(await chooseUpgrade(page), true);
    assert.equal(await page.locator('#lvlup.on').count(), 0);
    result.treasureTwoDistinctChoices = true;
    await ev(page, 'showCards(false);');
    assert.equal(await chooseUpgrade(page), true);
    assert.equal(await page.locator('#lvlup.on').count(), 0);
    result.levelUpSingleChoice = true;
    await ev(page, "showCards(false);window.__chestProbe=0;showBossChestOverlay([{type:'upg',icon:'!',name:'QA',desc:'QA',_upg:{n:'QA',fn:function(){window.__chestProbe++;}}}]);");
    assert.equal(await chooseUpgrade(page), false, 'Covered level cards must wait for the boss chest');
    await page.locator('#bossChestOverlay button').first().click();
    assert.equal(await page.evaluate(()=>window.__chestProbe), 1);
    await page.locator('#bossChestOverlay button').first().dispatchEvent('click');
    assert.equal(await page.evaluate(()=>window.__chestProbe), 1, 'A closed chest cannot award twice');
    assert.equal(await chooseUpgrade(page), true);
    assert.equal(await page.locator('#lvlup.on').count(), 0);
    result.bossChestUpgradeAndStackedModal = true;
    await ev(page, 'openBossChest({_opened:false});');
    assert(!/undefined/.test(await page.locator('#bossChestOverlay').innerText()));
    await page.locator('#bossChestOverlay button').first().click();
    result.realBossUpgradeFields = true;
    assert.equal(result.errors.length, 0);
    result.pass = true;
  } finally {
    fs.writeFileSync(out + '/natural-ui.json', JSON.stringify(result, null, 2));
    await browser.close(); server.close();
  }
  console.log(JSON.stringify(result));
})().catch(e => { console.error(e); process.exitCode = 1; server.close(); });
