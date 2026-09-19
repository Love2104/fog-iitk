const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  await page.goto('http://localhost:8000');
  await page.waitForTimeout(5000);
  await browser.close();
})();
