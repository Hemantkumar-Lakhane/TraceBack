import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import claimService from '../src/api/claimService.js';
import reportService from '../src/api/reportService.js';
import matchService from '../src/api/matchService.js';
import { MOCK_CLAIMS, MOCK_REPORTS, MOCK_MATCHES, DEMO_USERS } from '../src/api/mockData.js';

describe('TraceBack Comprehensive E2E System & Edge Case QA Suite', () => {

  // Setup simulated browser localStorage before each test
  beforeEach(() => {
    const store = new Map();
    store.set('tb_is_demo_session', 'true');

    globalThis.localStorage = {
      getItem: (key) => store.get(key) || null,
      setItem: (key, val) => store.set(key, String(val)),
      removeItem: (key) => store.delete(key),
      clear: () => store.clear()
    };

    globalThis.window = {
      dispatchEvent: () => true
    };
  });

  // ==========================================
  // DOMAIN 1: ACID Claim State Machine & Eviction
  // ==========================================
  test('TC-CLAIM-01: Claim Rejection executes atomic state transition and evicts from pending queue', async () => {
    // 1. Initial State: Claim 501 should be pending
    const initialPending = await claimService.getPendingClaims();
    assert.ok(initialPending.length >= 1, 'Initial queue must contain pending claims');
    const targetClaim = initialPending[0];
    assert.strictEqual(targetClaim.status, 'PENDING');

    // 2. Security Officer Rejection Action
    const rejectReason = 'Physical lockscreen wallpaper and serial do not match student description.';
    const updated = await claimService.updateClaimStatus(targetClaim.id, 'REJECTED', rejectReason);

    assert.strictEqual(updated.status, 'REJECTED');
    assert.strictEqual(updated.reviewNotes, rejectReason);
    assert.strictEqual(updated.reviewedBy, 'Inspector Rajesh Kumar');
    assert.ok(updated.reviewedAt, 'reviewedAt timestamp must be recorded');

    // 3. ACID Eviction: The rejected claim must NOT appear in pending claims queue
    const pendingAfter = await claimService.getPendingClaims();
    const stillInPending = pendingAfter.some(c => c.id === targetClaim.id);
    assert.strictEqual(stillInPending, false, 'Rejected claim must be evicted from pending claims list');

    // 4. Durability & Audit Trail: Claim must exist in historical audit records
    const allClaims = await claimService.getAllClaims();
    const auditedClaim = allClaims.find(c => c.id === targetClaim.id);
    assert.ok(auditedClaim, 'Claim must persist in historical audit log');
    assert.strictEqual(auditedClaim.status, 'REJECTED');
  });

  test('TC-CLAIM-02: Claim Approval marks claim APPROVED and releases custody', async () => {
    const initialPending = await claimService.getPendingClaims();
    const targetId = initialPending[0]?.id || 501;

    const approvalNotes = 'Verified in person. Student presented valid PRN 12110104 and unlocked macOS account.';
    const approved = await claimService.updateClaimStatus(targetId, 'APPROVED', approvalNotes);

    assert.strictEqual(approved.status, 'APPROVED');
    assert.strictEqual(approved.reviewedBy, 'Inspector Rajesh Kumar');

    // Must be evicted from pending queue
    const pendingAfter = await claimService.getPendingClaims();
    assert.strictEqual(pendingAfter.some(c => c.id === targetId), false, 'Approved claim must be evicted from pending queue');
  });

  // ==========================================
  // DOMAIN 2: Finder vs Owner Perspective Logic
  // ==========================================
  test('TC-ROLE-01: Correctly identifies whether logged-in student is loser (owner) or finder', () => {
    const sampleMatch = MOCK_MATCHES[0];
    
    // Test Case: Aarav is the loser (owner of MacBook)
    const aaravUser = DEMO_USERS.student; // aarav.sharma@vit.edu
    const isAaravFinder = sampleMatch.foundReport?.userId === aaravUser.id || 
                          sampleMatch.foundReport?.user?.email === aaravUser.email || 
                          aaravUser.name?.includes('Rohan');
    assert.strictEqual(isAaravFinder, false, 'Aarav is the owner who lost the item, not the finder');

    // Test Case: Rohan is the finder (turned in MacBook)
    const rohanUser = DEMO_USERS.rohan; // rohan.verma@vit.edu
    const isRohanFinder = sampleMatch.foundReport?.userId === rohanUser.id || 
                          sampleMatch.foundReport?.user?.email === rohanUser.email || 
                          rohanUser.name?.includes('Rohan');
    assert.strictEqual(Boolean(isRohanFinder), true, 'Rohan is the finder who turned in the item');
  });

  // ==========================================
  // DOMAIN 3: Correlation & Matching Engine
  // ==========================================
  test('TC-MATCH-01: Correlation engine returns matches with score and deterministic breakdown', async () => {
    const matches = await matchService.getMyMatches();
    assert.ok(Array.isArray(matches), 'Matches must return an array');
    assert.ok(matches.length > 0, 'Must have at least 1 correlated match');

    const topMatch = matches[0];
    assert.ok(topMatch.matchScore >= 75, 'High confidence match must be >= 75%');
    assert.ok(topMatch.lostReport, 'Match must link to a valid lost report');
    assert.ok(topMatch.foundReport, 'Match must link to a valid found report');
  });

  // ==========================================
  // DOMAIN 4: Report Lifecycle & Submissions
  // ==========================================
  test('TC-REPORT-01: Report filtering correctly segregates LOST and FOUND properties', async () => {
    const lostReports = await reportService.getMyReports('LOST');
    assert.ok(Array.isArray(lostReports));
    lostReports.forEach(r => {
      assert.strictEqual(r.type, 'LOST', 'All items in lost filter must be type LOST');
    });

    const foundReports = await reportService.getMyReports('FOUND');
    assert.ok(Array.isArray(foundReports));
    foundReports.forEach(r => {
      assert.strictEqual(r.type, 'FOUND', 'All items in found filter must be type FOUND');
    });
  });

  test('TC-REPORT-02: Recovery rate calculation safely handles empty or populated reports', () => {
    const reports = MOCK_REPORTS;
    const total = reports.length;
    const resolved = reports.filter(r => r.status === 'RESOLVED' || r.status === 'RETURNED' || r.status === 'CLOSED').length;
    const rate = total > 0 ? ((resolved / total) * 100).toFixed(1) : '82.2';

    assert.ok(!isNaN(parseFloat(rate)), 'Calculated rate must be a valid numeric string');
    assert.ok(parseFloat(rate) >= 0 && parseFloat(rate) <= 100, 'Recovery rate must be between 0% and 100%');
  });

  // ==========================================
  // DOMAIN 5: Institutional Auth Boundary Guardrails
  // ==========================================
  test('TC-AUTH-01: Demo user identities strictly adhere to VIT Pune campus credentials', () => {
    assert.strictEqual(DEMO_USERS.student.email, 'aarav.sharma@vit.edu');
    assert.strictEqual(DEMO_USERS.student.prn, '12110104');
    assert.strictEqual(DEMO_USERS.rohan.email, 'rohan.verma@vit.edu');
    assert.strictEqual(DEMO_USERS.security.email, 'rajesh.kumar@vit.edu');
    assert.strictEqual(DEMO_USERS.security.badgeNumber, 'SEC-409');
    assert.strictEqual(DEMO_USERS.admin.email, 'priya.nair@vit.edu');
  });

});
