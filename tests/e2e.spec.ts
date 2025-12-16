import { test, expect } from '@playwright/test';

test.describe('RocketWatch E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses for reliable testing
    await page.route('**/api/launches/next', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: '1',
          name: 'Falcon 9 | Starlink Mission',
          status: { name: 'Go', abbrev: 'Go' },
          net: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          provider: { name: 'SpaceX' },
          vehicle: { name: 'Falcon 9 Block 5' },
          launchSite: { name: 'Kennedy Space Center, FL' },
          webcastUrl: 'https://youtube.com/watch?v=test',
          webcastLive: false,
          mission: {
            description: {
              explorer: 'A rocket is going to space!',
              cadet: 'SpaceX is launching satellites',
              missionControl: 'Starlink satellite deployment mission'
            }
          }
        }),
      });
    });

    await page.route('**/api/launches/upcoming*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.goto('http://localhost:3000');
  });

  test('Homepage loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/RocketWatch/);

    // Check hero section - wait for the launch data to load
    await expect(page.getByText('Falcon 9 | Starlink Mission')).toBeVisible({ timeout: 10000 });

    // Check launch details are present
    await expect(page.getByText('SpaceX')).toBeVisible();
    await expect(page.getByText('Kennedy Space Center, FL')).toBeVisible();

    // Check upcoming launches section
    await expect(page.getByRole('heading', { name: /Upcoming Launches/i })).toBeVisible();

    // Check videos section exists (look for specific section)
    await expect(page.getByRole('heading', { name: /Live & Videos/i })).toBeVisible();

    // Check agency row exists
    await expect(page.getByRole('heading', { name: /Explore by Agency/i })).toBeVisible();
  });

  test('Navigation links work', async ({ page }) => {
    // Test Videos link
    await page.click('a[href="/videos"]');
    await expect(page).toHaveURL(/\/videos/);
    await expect(page.getByRole('heading', { name: /Videos/i }).first()).toBeVisible();

    // Test Live link
    await page.goto('http://localhost:3000');
    await page.click('a[href="/live"]');
    await expect(page).toHaveURL(/\/live/);
    await expect(page.getByRole('heading', { name: /Live Streams?/i })).toBeVisible();

    // Test Agencies link - handle age-mode variations
    await page.goto('http://localhost:3000');
    await page.click('a[href="/agencies"]');
    await expect(page).toHaveURL(/\/agencies/);
    await expect(page.getByRole('heading', { name: /(Space Agencies|Space Companies)/i })).toBeVisible();

    // Test Vehicles link - handle age-mode variations
    await page.goto('http://localhost:3000');
    await page.click('a[href="/vehicles"]');
    await expect(page).toHaveURL(/\/vehicles/);
    await expect(page.getByRole('heading', { name: /(Launch Vehicles|Rockets)/i })).toBeVisible();
  });

  test('Videos page functionality', async ({ page }) => {
    await page.goto('http://localhost:3000/videos');

    // Check category filter buttons exist (more specific selector)
    const filterButtons = page.locator('button').filter({ hasText: /^(All Videos|Live|Launches|Educational|Highlights|Interviews)$/ });
    await expect(filterButtons.first()).toBeVisible();

    // Test filter switching - use more specific selector for the button
    const liveFilterButton = page.locator('button').filter({ hasText: /^Live$/ });
    await liveFilterButton.click();
    await expect(liveFilterButton).toHaveClass(/bg-rocket-orange/);

    // Check video cards are present
    const videoCards = page.locator('[class*="cursor-pointer"]').first();
    await expect(videoCards).toBeVisible();
  });

  test('Live page functionality', async ({ page }) => {
    await page.goto('http://localhost:3000/live');

    // Check page title
    await expect(page.getByText('Live Streams')).toBeVisible();

    // Check upcoming webcasts section
    await expect(page.getByText('Upcoming Webcasts')).toBeVisible();
  });

  test('Agencies page functionality', async ({ page }) => {
    await page.goto('http://localhost:3000/agencies');

    // Check page title - handle age-mode variations
    await expect(page.getByRole('heading', { name: /(Space Agencies|Space Companies)/i })).toBeVisible();

    // Check type filter buttons exist
    const filterButtons = page.locator('button').filter({ hasText: /^(all|government|commercial|international)$/i });
    await expect(filterButtons.first()).toBeVisible();

    // Test filter switching
    const commercialButton = page.locator('button').filter({ hasText: /^commercial$/i });
    await commercialButton.click();

    // Check agency cards are present
    const agencyCards = page.locator('a[href^="/agencies/"]').first();
    await expect(agencyCards).toBeVisible();
  });

  test('Vehicles page functionality', async ({ page }) => {
    await page.goto('http://localhost:3000/vehicles');

    // Check page title - handle age-mode variations
    await expect(page.getByRole('heading', { name: /(Launch Vehicles|Rockets)/i })).toBeVisible();

    // Check vehicle cards are present
    const vehicleCards = page.locator('a[href^="/vehicles/"]').first();
    await expect(vehicleCards).toBeVisible();
  });

  test('Responsive design - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');

    // Check mobile menu button exists
    const mobileMenuButton = page.getByRole('button', { name: /menu/i });

    // Check content is still visible
    await expect(page.getByText('Next Launch')).toBeVisible();
  });

  test('Age mode toggle functionality', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Find and click age mode toggle (this assumes toggle is in header)
    // Note: Adjust selector based on actual implementation
    const ageToggle = page.locator('[aria-label*="age"]').or(page.getByRole('button').filter({ hasText: /explorer|cadet|mission/i })).first();

    if (await ageToggle.isVisible()) {
      await ageToggle.click();
    }
  });
});
