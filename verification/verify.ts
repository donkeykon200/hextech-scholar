import { chromium } from 'playwright';

async function verify() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Wait for server to be ready
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  await page.screenshot({ path: 'verification/home.png' });

  // Go to Learning path if exists
  await page.click('a[href="/learning-path"]');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'verification/learning_path.png' });

  // Go to playground/editor
  await page.goto('http://localhost:3000/playground'); // Assuming this route exists
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'verification/playground.png' });

  await browser.close();
}

verify().catch(console.error);
