import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\lakha\\.gemini\\antigravity\\brain\\aceed0b3-ab6d-4119-8fb6-434c7c05a83c';
const BASE_URL = 'http://localhost:5173';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
  console.log('🚀 Starting Chrome Browser automation for Hemant Report Details and Matches...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,840']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 840 });

  const shot = async (filename) => {
    const dest = path.join(ARTIFACT_DIR, filename);
    await page.screenshot({ path: dest, fullPage: false });
    console.log(`📸 Saved screenshot: ${filename}`);
  };

  try {
    // Login as Hemantkumar Shivaji Lakhane
    console.log('--- Login as Hemantkumar Shivaji Lakhane ---');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await sleep(800);

    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'hemantkumar.lakhane24@vit.edu');
    await page.waitForSelector('input[type="password"]');
    await page.type('input[type="password"]', 'password123');

    const submitBtn = await page.waitForSelector('button[type="submit"]');
    await submitBtn.click();

    await sleep(2500);

    // Navigate to Report #4 Details at /reports/lost/4
    console.log('--- Navigating to /reports/lost/4 ---');
    await page.goto(`${BASE_URL}/reports/lost/4`, { waitUntil: 'networkidle2' });
    await sleep(2500);
    await shot('15_hemant_report_4_details_matched.png');

    // Navigate to /matches
    console.log('--- Navigating to /matches ---');
    await page.goto(`${BASE_URL}/matches`, { waitUntil: 'networkidle2' });
    await sleep(2000);
    await shot('16_hemant_matches_page.png');

    console.log('✅ SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Verification failed:', err);
  } finally {
    await browser.close();
  }
}

run();
