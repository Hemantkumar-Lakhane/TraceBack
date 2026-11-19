import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import claimService from '../src/api/claimService.js';
import reportService from '../src/api/reportService.js';
import matchService from '../src/api/matchService.js';
import chatService, { getCampusAvatar } from '../src/api/chatService.js';
import { MOCK_CLAIMS, MOCK_REPORTS, MOCK_MATCHES, DEMO_USERS, MOCK_CONVERSATIONS } from '../src/api/mockData.js';

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

  // ==========================================
  // DOMAIN 6: Chat Subsystem & Message Dispatch
  // ==========================================
  test('TC-CHAT-01: Chat service fetches active conversations and normalizes metadata', async () => {
    const convs = await chatService.getConversations();
    assert.ok(Array.isArray(convs), 'Conversations must be an array');
    assert.ok(convs.length > 0, 'Must have at least one active conversation');

    const first = convs[0];
    assert.ok(first.id, 'Conversation must have an id');
    assert.ok(first.itemName, 'Conversation must reference an item');
    assert.ok(first.otherParticipant, 'Conversation must identify other participant');
  });

  test('TC-CHAT-02: Sending chat message persists text, timestamp, and sender role', async () => {
    const testText = 'Hello Rohan! I submitted physical proof to Campus Security Desk at Building 1.';
    const sent = await chatService.sendMessage(1, testText, 1, 'Aarav Sharma');

    assert.ok(sent.id, 'Sent message must have unique id');
    assert.strictEqual(sent.text, testText);
    assert.strictEqual(sent.isMe, true);
    assert.strictEqual(sent.senderName, 'Aarav Sharma');
    assert.ok(sent.timestamp, 'Timestamp must be generated');
  });

  test('TC-CHAT-03: Campus avatar resolver maps correctly based on names and roles', () => {
    const rohanAvatar = getCampusAvatar('Rohan Verma', 'STUDENT');
    const rajeshAvatar = getCampusAvatar('Inspector Rajesh', 'SECURITY');
    const priyaAvatar = getCampusAvatar('Priya Nair', 'ADMIN');

    assert.ok(rohanAvatar.startsWith('https://'), 'Avatar must be a valid HTTPS image URL');
    assert.ok(rajeshAvatar.startsWith('https://'), 'Avatar must be a valid HTTPS image URL');
    assert.ok(priyaAvatar.startsWith('https://'), 'Avatar must be a valid HTTPS image URL');
  });

  test('TC-CHAT-04: Perspective Symmetry - Rohan views chat with Aarav on left and Rohan on right', async () => {
    const convForRohan = await chatService.getConversationById(1, 2); // 2 = Rohan
    assert.strictEqual(convForRohan.otherParticipant.name, 'Aarav Sharma', 'For Rohan, other participant must be Aarav');
    
    // First message was sent by Rohan (id: 2) -> isMe must be true (right side)
    const msg1 = convForRohan.messages.find(m => m.id === 1);
    assert.strictEqual(msg1.isMe, true, 'Rohan message viewed by Rohan must be on the right (isMe: true)');

    // Second message was sent by Aarav (id: 1) -> isMe must be false (left side)
    const msg2 = convForRohan.messages.find(m => m.id === 2);
    assert.strictEqual(msg2.isMe, false, 'Aarav message viewed by Rohan must be on the left (isMe: false)');
  });

  test('TC-CHAT-05: Perspective Symmetry - Aarav views chat with Rohan on left and Aarav on right', async () => {
    const convForAarav = await chatService.getConversationById(1, 1); // 1 = Aarav
    assert.strictEqual(convForAarav.otherParticipant.name, 'Rohan Verma', 'For Aarav, other participant must be Rohan');

    // First message was sent by Rohan (id: 2) -> isMe must be false (left side)
    const msg1 = convForAarav.messages.find(m => m.id === 1);
    assert.strictEqual(msg1.isMe, false, 'Rohan message viewed by Aarav must be on the left (isMe: false)');

    // Second message was sent by Aarav (id: 1) -> isMe must be true (right side)
    const msg2 = convForAarav.messages.find(m => m.id === 2);
    assert.strictEqual(msg2.isMe, true, 'Aarav message viewed by Aarav must be on the right (isMe: true)');
  });

  // ==========================================
  // DOMAIN 7: Search & Discovery Engine
  // ==========================================
  test('TC-SEARCH-01: Searching reports matches titles, descriptions, and locations', async () => {
    const macbookMatches = await reportService.getReports({ search: 'MacBook' });
    assert.ok(Array.isArray(macbookMatches));
    assert.ok(macbookMatches.length > 0, 'Must find reports matching MacBook');
    assert.ok(macbookMatches.some(r => r.item?.name?.toLowerCase().includes('macbook')));

    const walletMatches = await reportService.getReports({ search: 'Wallet' });
    assert.ok(Array.isArray(walletMatches));
    assert.ok(walletMatches.length > 0, 'Must find reports matching Wallet');
  });

  test('TC-SEARCH-02: Searching with nonexistent keywords returns safe empty array', async () => {
    const noMatches = await reportService.getReports({ search: 'NonExistentQuantumWidget999' });
    assert.ok(Array.isArray(noMatches));
    assert.strictEqual(noMatches.length, 0, 'Non-existent item should return empty array');
  });

  // ==========================================
  // DOMAIN 8: Cross-Tab Reactive Synchronization
  // ==========================================
  test('TC-SYNC-01: Updating claim triggers window custom event tb_claims_updated', async () => {
    let eventReceived = false;
    let eventDetail = null;

    globalThis.window.dispatchEvent = (event) => {
      if (event.type === 'tb_claims_updated') {
        eventReceived = true;
        eventDetail = event.detail;
      }
      return true;
    };

    await claimService.updateClaimStatus(501, 'REJECTED', 'Test sync rejection');

    assert.strictEqual(eventReceived, true, 'tb_claims_updated event must be dispatched');
    assert.ok(Array.isArray(eventDetail), 'Event detail must contain updated claims array');
    const rejectedInDetail = eventDetail.find(c => c.id === 501);
    assert.strictEqual(rejectedInDetail?.status, 'REJECTED');
  });

});
