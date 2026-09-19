const puppeteer = require('puppeteer');
const fs = require('fs');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Light Mode
    await page.setViewport({width: 1440, height: 768});
    await page.goto('http://localhost:8000/index.php?station=VIAR', {waitUntil: 'networkidle2'});
    await page.screenshot({path: '/home/love/.gemini/antigravity-ide/brain/ecfbd533-39fa-4306-912b-ac63ea94105b/scratch/desktop_light.png', fullPage: true});
    
    // Dark Mode
    await page.emulateMediaFeatures([{name: 'prefers-color-scheme', value: 'dark'}]);
    await page.screenshot({path: '/home/love/.gemini/antigravity-ide/brain/ecfbd533-39fa-4306-912b-ac63ea94105b/scratch/desktop_dark.png', fullPage: true});
    
    // Mobile Light
    await page.emulateMediaFeatures([{name: 'prefers-color-scheme', value: 'light'}]);
    await page.setViewport({width: 390, height: 844});
    await page.screenshot({path: '/home/love/.gemini/antigravity-ide/brain/ecfbd533-39fa-4306-912b-ac63ea94105b/scratch/mobile_light.png', fullPage: true});
    
    await browser.close();
})();
