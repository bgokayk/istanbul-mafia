// Drive the same available upgrade choices as a player, including two-pick treasure chests.
async function chooseUpgrade(page) {
  // A chest or tutorial can legitimately cover an already-open level-up panel.
  if (await page.locator('#bossChestOverlay').isVisible() || await page.locator('#tutOverlay').isVisible()) return false;
  const choices = page.locator('#lvlup.on .luc');
  for (const choice of await choices.all()) {
    if (await choice.evaluate(element => getComputedStyle(element).pointerEvents !== 'none')) {
      await choice.click({ timeout: 1000 });
      return true;
    }
  }
  return false;
}
module.exports = { chooseUpgrade };
