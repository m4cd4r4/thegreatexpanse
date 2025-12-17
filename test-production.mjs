import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage();

// Listen for console messages
page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));

// Listen for errors
page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));

await page.goto('https://thegreatexpanse.com');
await page.waitForLoadState('networkidle');

console.log('Production page loaded, taking initial screenshot...');
await page.screenshot({ path: 'screenshots/prod-before-arcade.png', fullPage: true });

console.log('Looking for Arcade button...');
const arcadeButton = await page.locator('button:has-text("Arcade"), button[aria-label*="Arcade"]').first();
const isVisible = await arcadeButton.isVisible().catch(() => false);
console.log('Arcade button visible:', isVisible);

if (isVisible) {
  console.log('Clicking Arcade button...');
  await arcadeButton.click();
  await page.waitForTimeout(2000);

  console.log('Taking screenshot after click...');
  await page.screenshot({ path: 'screenshots/prod-after-arcade-click.png', fullPage: true });

  // Check if modal is visible
  const modalVisible = await page.locator('[class*="fixed inset-0"]').isVisible().catch(() => false);
  console.log('Modal visible:', modalVisible);

  // Check what's on the page
  const bodyHTML = await page.locator('body').innerHTML();
  console.log('Body contains "Space Arcade":', bodyHTML.includes('Space Arcade'));

  // Check if there are any error messages
  const hasErrors = await page.locator('text=/error|Error|ERROR/i').count();
  console.log('Error messages found:', hasErrors);
}

await page.waitForTimeout(3000);
await browser.close();
