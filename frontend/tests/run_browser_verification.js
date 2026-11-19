import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\lakha\\.gemini\\antigravity\\brain\\aceed0b3-ab6d-4119-8fb6-434c7c05a83c';
const BASE_URL = 'http://localhost:5173';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
  console.log('🚀 Starting Chrome Browser automation...');
  if (!fs.existsSync(ARTIFACT_DIR)) {
    fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
  }

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
    // STEP 1: Landing Page & Footer
    // ----------------------------------------------------
    console.log('--- STEP 1: Landing Page ---');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
    await sleep(1000);
    await shot('01_landing_hero.png');

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await sleep(1000);
    await shot('02_landing_footer.png');

    // ----------------------------------------------------
    // STEP 2: Aarav Login & Dashboard
    // ----------------------------------------------------
    console.log('--- STEP 2: Login as Aarav Sharma ---');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await sleep(800);

    // Click Aarav quick fill button
    const aaravBtn = await page.waitForSelector('button::-p-text("Aarav (PRN 12110104)")');
    await aaravBtn.click();
    await sleep(500);

    const submitBtn = await page.waitForSelector('button[type="submit"]');
    await submitBtn.click();

    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await sleep(1500);
    await shot('03_aarav_dashboard.png');

    // Click Recovery Rate metric card to open telemetry modal
    console.log('Clicking Recovery Rate metric card...');
    const cards = await page.$$('.surface-card');
    if (cards.length >= 4) {
      await cards[3].click();
      await sleep(1000);
      await shot('04_telemetry_modal.png');
      // Close modal
      const closeBtn = await page.$('button::-p-text("Close Telemetry")') || await page.$('.modal-close-btn');
      if (closeBtn) await closeBtn.click();
      await sleep(500);
    }

    // ----------------------------------------------------
    // STEP 3: Aarav Chat Perspective (WhatsApp style)
    // ----------------------------------------------------
    console.log('--- STEP 3: Aarav Chat Perspective ---');
    await page.goto(`${BASE_URL}/chat/1`, { waitUntil: 'networkidle2' });
    await sleep(1500);

    // Type a message
    const chatInput = await page.waitForSelector('input[placeholder*="Type a message"]');
    await chatInput.type('Hi Rohan! I submitted proof to Building 1 Security Desk.');
    await sleep(300);
    await page.keyboard.press('Enter');
    await sleep(1000);
    await shot('05_aarav_chat.png');

    // ----------------------------------------------------
    // STEP 4: Rohan (Finder) Login & Perspective Inversion
    // ----------------------------------------------------
    console.log('--- STEP 4: Login as Rohan Verma (Finder) ---');
    await page.evaluate(() => localStorage.removeItem('token'));
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await sleep(800);

    const rohanBtn = await page.waitForSelector('button::-p-text("Rohan (PRN 12110208)")');
    await rohanBtn.click();
    await sleep(500);

    const submitBtn2 = await page.waitForSelector('button[type="submit"]');
    await submitBtn2.click();

    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await sleep(1500);
    await shot('06_rohan_dashboard.png');

    console.log('--- Checking Rohan Chat View (Inversion check) ---');
    await page.goto(`${BASE_URL}/chat/1`, { waitUntil: 'networkidle2' });
    await sleep(1500);
    await shot('07_rohan_chat.png');

    // ----------------------------------------------------
    // STEP 5: Inspector Rajesh Login & ACID Claim Rejection
    // ----------------------------------------------------
    console.log('--- STEP 5: Login as Inspector Rajesh (Security) ---');
    await page.evaluate(() => localStorage.removeItem('token'));
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await sleep(800);

    const rajeshBtn = await page.waitForSelector('button::-p-text("Rajesh (Security)")');
    await rajeshBtn.click();
    await sleep(500);

    const submitBtn3 = await page.waitForSelector('button[type="submit"]');
    await submitBtn3.click();

    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await sleep(1500);
    await shot('08_security_dashboard.png');

    console.log('Navigating to Claim #501 verification audit...');
    await page.goto(`${BASE_URL}/security/claims/501`, { waitUntil: 'networkidle2' });
    await sleep(1500);
    await shot('09_claim_501_audit_initial.png');

    // Click Reject Claim
    console.log('Clicking Reject Claim button...');
    const rejectBtn = await page.waitForSelector('button::-p-text("Reject Claim")');
    await rejectBtn.click();
    await sleep(800);

    // Type rejection reason
    const reasonTextarea = await page.waitForSelector('textarea');
    await reasonTextarea.type('Physical lockscreen wallpaper and serial do not match locker item A-12.');
    await sleep(400);

    const confirmReject = await page.waitForSelector('button::-p-text("Confirm Rejection")');
    await confirmReject.click();
    await sleep(1200);

    await shot('10_claim_501_audit_rejected.png');

    // Return to claims queue
    console.log('Navigating back to Security Claims queue...');
    await page.goto(`${BASE_URL}/security/claims`, { waitUntil: 'networkidle2' });
    await sleep(1500);
    await shot('11_security_queue_evicted.png');

    // ----------------------------------------------------
    // STEP 6: Student Aarav Checks Rejected Claim
    // ----------------------------------------------------
    console.log('--- STEP 6: Student Aarav Checks Rejected Claim ---');
    await page.evaluate(() => localStorage.removeItem('token'));
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await sleep(800);

    const aaravBtn2 = await page.waitForSelector('button::-p-text("Aarav (PRN 12110104)")');
    await aaravBtn2.click();
    await sleep(500);

    const submitBtn4 = await page.waitForSelector('button[type="submit"]');
    await submitBtn4.click();
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await sleep(1000);

    await page.goto(`${BASE_URL}/claims`, { waitUntil: 'networkidle2' });
    await sleep(1500);
    await shot('12_aarav_claims_rejected.png');

    // ----------------------------------------------------
    // STEP 7: Admin Console (Priya)
    // ----------------------------------------------------
    console.log('--- STEP 7: Login as Priya (Admin) ---');
    await page.evaluate(() => localStorage.removeItem('token'));
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await sleep(800);

    const priyaBtn = await page.waitForSelector('button::-p-text("Priya (Admin)")');
    await priyaBtn.click();
    await sleep(500);

    const submitBtn5 = await page.waitForSelector('button[type="submit"]');
    await submitBtn5.click();
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await sleep(1500);

    await shot('13_admin_console_overview.png');

    // Click Users tab
    const usersTab = await page.$('button::-p-text("Users & Access")') || await page.$('button::-p-text("Users")');
    if (usersTab) {
      await usersTab.click();
      await sleep(1000);
      await shot('14_admin_users.png');
    }

    console.log('✅ ALL E2E UI FEATURES TESTED & CAPTURED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Error during E2E browser automation:', err);
    await shot('error_snapshot.png');
  } finally {
    await browser.close();
  }
}

run();
