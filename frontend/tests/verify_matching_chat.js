import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\lakha\\.gemini\\antigravity\\brain\\aceed0b3-ab6d-4119-8fb6-434c7c05a83c';
const BASE_URL = 'http://localhost:5173';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
  console.log('🚀 Starting Chrome Browser automation for Tanmay and Hemant matching & chat...');

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
    // ----------------------------------------------------
    // STEP 1: Login as Tanmay Kumbhare
    // ----------------------------------------------------
    console.log('--- STEP 1: Login as Tanmay Kumbhare ---');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await sleep(800);

    // Fill credentials for Tanmay
    await page.waitForSelector('input[type="email"]');
    await page.$eval('input[type="email"]', el => el.value = '');
    await page.type('input[type="email"]', 'tanmay.kumbhare24@vit.edu');

    await page.waitForSelector('input[type="password"]');
    await page.$eval('input[type="password"]', el => el.value = '');
    await page.type('input[type="password"]', 'password123');

    const submitBtn = await page.waitForSelector('button[type="submit"]');
    await submitBtn.click();

    await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
    await sleep(2000);

    // Navigate to /chat
    console.log('--- Navigating Tanmay to /chat ---');
    await page.goto(`${BASE_URL}/chat`, { waitUntil: 'networkidle2' });
    await sleep(2500);
    await shot('14_tanmay_chat_matched.png');

    // ----------------------------------------------------
    // STEP 2: Login as Hemantkumar Lakhane
    // ----------------------------------------------------
    console.log('--- STEP 2: Login as Hemantkumar Shivaji Lakhane ---');
    // Clear storage to log out
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await sleep(800);

    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'hemantkumar.lakhane24@vit.edu');
    await page.waitForSelector('input[type="password"]');
    await page.type('input[type="password"]', 'password123');

    const submitBtn2 = await page.waitForSelector('button[type="submit"]');
    await submitBtn2.click();

    await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
    await sleep(2000);

    // Navigate to Report #4 Details
    console.log('--- Navigating Hemant to Report #4 Details ---');
    await page.goto(`${BASE_URL}/report/lost/4`, { waitUntil: 'networkidle2' });
    await sleep(2500);
    await shot('15_hemant_report_4_details_matched.png');

    // Navigate to Matches page
    console.log('--- Navigating Hemant to /matches ---');
    await page.goto(`${BASE_URL}/matches`, { waitUntil: 'networkidle2' });
    await sleep(2000);
    await shot('16_hemant_matches_page.png');

    // Navigate to Chat
    console.log('--- Navigating Hemant to /chat?conversationId=4 ---');
    await page.goto(`${BASE_URL}/chat?conversationId=4`, { waitUntil: 'networkidle2' });
    await sleep(2500);
    await shot('17_hemant_chat_perspective.png');

    console.log('✅ ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Verification failed:', err);
  } finally {
    await browser.close();
  }
}

run();
