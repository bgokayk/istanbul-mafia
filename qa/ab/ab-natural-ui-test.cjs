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
    assert.equal(result.errors.length, 0);
    result.pass = true;
  } finally {
    fs.writeFileSync(out + '/natural-ui.json', JSON.stringify(result, null, 2));
    await browser.close(); server.close();
  }
  console.log(JSON.stringify(result));
})().catch(e => { console.error(e); process.exitCode = 1; server.close(); });
