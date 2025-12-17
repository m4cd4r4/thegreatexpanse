import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

// Listen for console messages
page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));

// Listen for errors
page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

await page.goto('http://localhost:3001');
await page.waitForLoadState('networkidle');

console.log('Page loaded, taking initial screenshot...');
await page.screenshot({ path: 'screenshots/before-arcade.png', fullPage: true });

console.log('Looking for Arcade button...');
const arcadeButton = await page.locator('button:has-text("Arcade")').first();
const isVisible = await arcadeButton.isVisible().catch(() => false);
console.log('Arcade button visible:', isVisible);

if (isVisible) {
  console.log('Clicking Arcade button...');
  await arcadeButton.click();
  await page.waitForTimeout(1000);

  console.log('Taking screenshot after click...');
  await page.screenshot({ path: 'screenshots/after-arcade-click.png', fullPage: true });

  // Check if modal is visible
  const modalVisible = await page.locator('[class*="fixed inset-0"]').isVisible().catch(() => false);
  console.log('Modal visible:', modalVisible);

  // Check what's on the page
  const bodyHTML = await page.locator('body').innerHTML();
  console.log('Body contains "Space Arcade":', bodyHTML.includes('Space Arcade'));
  console.log('Body contains "arcade-modal":', bodyHTML.includes('arcade-modal'));
}

await page.waitForTimeout(3000);
await browser.close();
