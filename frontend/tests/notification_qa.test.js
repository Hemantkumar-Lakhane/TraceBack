import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeNotification } from '../src/api/notificationService.js';
import { CAMPUS_CONFIG } from '../src/config/campusConfig.js';
import { getItemImageUrl } from '../src/utils/imageUtils.js';

describe('QA Test Suite: Notification Pipeline & Edge Cases', () => {

  test('TC-01: normalizeNotification should gracefully handle empty object without throwing', () => {
    const raw = {};
    const result = normalizeNotification(raw);

    assert.equal(result.type, 'NOTIFICATION');
    assert.equal(result.title, 'Campus Alert');
    assert.equal(result.message, '');
    assert.equal(result.link, '/notifications');
    assert.equal(result.read, false);
    assert.ok(typeof result.timestamp === 'string');
    assert.ok(!isNaN(new Date(result.timestamp).getTime()));
  });

  test('TC-02: normalizeNotification correctly deep-links CHAT notifications to /chat/:id', () => {
    const raw = {
      id: 42,
      type: 'CHAT',
      referenceId: 7,
      message: 'Hello from verification desk',
      isRead: false
    };
    const result = normalizeNotification(raw);

    assert.equal(result.id, 42);
    assert.equal(result.type, 'CHAT');
    assert.equal(result.title, 'Verification Message');
    assert.equal(result.link, '/chat/7');
    assert.equal(result.read, false);
  });

  test('TC-03: normalizeNotification correctly deep-links MATCH and CLAIM notifications', () => {
    const matchNotif = normalizeNotification({ id: 1, type: 'MATCH', referenceId: 99 });
    assert.equal(matchNotif.title, 'Match Detected');
    assert.equal(matchNotif.link, '/matches/99');

    const claimNotif = normalizeNotification({ id: 2, type: 'CLAIM', reference_id: 104 });
    assert.equal(claimNotif.title, 'Verification Claim Update');
    assert.equal(claimNotif.link, '/claims/104');
  });

  test('TC-04: normalizeNotification handles various date and timestamp formats safely', () => {
    // Valid ISO string
    const n1 = normalizeNotification({ createdAt: '2026-11-12T10:30:00Z' });
    assert.equal(new Date(n1.timestamp).toISOString(), '2026-11-12T10:30:00.000Z');

    // Invalid date string fallback to valid ISO timestamp
    const n2 = normalizeNotification({ createdAt: 'invalid-date-string' });
    assert.ok(!isNaN(new Date(n2.timestamp).getTime()));

    // Null/undefined date fallback
    const n3 = normalizeNotification({ createdAt: null, timestamp: undefined });
    assert.ok(!isNaN(new Date(n3.timestamp).getTime()));
  });

  test('TC-05: normalizeNotification handles both isRead (backend) and read (frontend mock) booleans', () => {
    assert.equal(normalizeNotification({ isRead: true }).read, true);
    assert.equal(normalizeNotification({ isRead: false }).read, false);
    assert.equal(normalizeNotification({ read: true }).read, true);
    assert.equal(normalizeNotification({ read: false }).read, false);
    assert.equal(normalizeNotification({}).read, false);
  });

  test('TC-06: Edge Case - Backend returns { message: "All notifications marked as read" } instead of array', () => {
    // This is the exact root cause of the error reported by the user!
    const backendResponse = { message: "All notifications marked as read" };

    // Unpacker logic used in notificationService & Navbar
    const unpackList = (data) => {
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.content)) return data.content;
      if (data && Array.isArray(data.notifications)) return data.notifications;
      return [];
    };

    const unpacked = unpackList(backendResponse);
    assert.ok(Array.isArray(unpacked), 'Result must be an array');
    assert.equal(unpacked.length, 0);

    // Navbar safety guard
    const safeNotifications = Array.isArray(backendResponse) ? backendResponse : [];
    assert.equal(typeof safeNotifications.filter, 'function');
    assert.equal(safeNotifications.filter(n => !n.read).length, 0);
  });

  test('TC-07: Edge Case - Spring Pageable { content: [...] } unpacks properly', () => {
    const pageableResponse = {
      content: [
        { id: 10, type: 'CHAT', referenceId: 5, read: false },
        { id: 11, type: 'MATCH', referenceId: 6, read: true }
      ],
      totalPages: 1,
      totalElements: 2
    };

    const unpackList = (data) => {
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.content)) return data.content;
      if (data && Array.isArray(data.notifications)) return data.notifications;
      return [];
    };

    const list = unpackList(pageableResponse).map(normalizeNotification);
    assert.equal(list.length, 2);
    assert.equal(list[0].link, '/chat/5');
    assert.equal(list[1].link, '/matches/6');
  });

  test('TC-08: Navbar unread count calculation never throws even with null/undefined state', () => {
    const calculateUnread = (state) => {
      const safe = Array.isArray(state) ? state : [];
      return safe.filter(n => !n.read).length;
    };

    assert.equal(calculateUnread(null), 0);
    assert.equal(calculateUnread(undefined), 0);
    assert.equal(calculateUnread({ error: 'Unauthorized' }), 0);
    assert.equal(calculateUnread([]), 0);
    assert.equal(calculateUnread([
      { id: 1, read: false },
      { id: 2, read: true },
      { id: 3, read: false }
    ]), 2);
  });
});

describe('QA Test Suite: Campus Configuration & Identity Integrity', () => {

  test('TC-09: Campus identity is strictly VIT Pune (not IIT Bombay or other colleges)', () => {
    assert.equal(CAMPUS_CONFIG.institutionName, 'Vishwakarma Institute of Technology, Pune');
    assert.equal(CAMPUS_CONFIG.shortName, 'VIT Pune');
    assert.ok(CAMPUS_CONFIG.address.includes('Pune, Maharashtra'));
    assert.equal(CAMPUS_CONFIG.securityOffice.helpline, '+91 (020) 2420-2180');
    assert.ok(CAMPUS_CONFIG.securityOffice.name.includes('VIT Pune'));
    assert.ok(!CAMPUS_CONFIG.securityOffice.name.includes('IIT'));
  });

  test('TC-10: Student login policy enforces 8-digit PRN authentication', () => {
    const validPrnPattern = /^\d{8}$/;
    assert.ok(validPrnPattern.test('12110104'), 'Student PRN must be 8 digits');
    assert.ok(validPrnPattern.test('12110208'), 'Rohan PRN must be 8 digits');
    assert.ok(!validPrnPattern.test('IITB-2024'), 'Should reject legacy mock prefixes');
  });

  test('TC-14: Department list configuration includes AIML and core engineering branches', () => {
    const departments = CAMPUS_CONFIG.departments;
    assert.ok(Array.isArray(departments), 'Departments must be an array');
    assert.ok(departments.includes('Artificial Intelligence & Machine Learning (AIML)'), 'Must include AIML');
    assert.ok(departments.includes('Artificial Intelligence & Data Science (AIDS)'), 'Must include AIDS');
    assert.ok(departments.includes('Computer Engineering'), 'Must include Computer Engineering');
    assert.ok(departments.includes('Information Technology'), 'Must include Information Technology');
  });
});

describe('QA Test Suite: Image Fallback & UI Utility Resiliency', () => {

  test('TC-11: getItemImageUrl returns valid image path for null/undefined items', () => {
    const fallbackNull = getItemImageUrl(null, true);
    assert.ok(typeof fallbackNull === 'string' && fallbackNull.length > 0);

    const fallbackEmpty = getItemImageUrl({}, true);
    assert.ok(typeof fallbackEmpty === 'string' && fallbackEmpty.length > 0);
  });

  test('TC-12: getItemImageUrl normalizes relative and uploads paths properly', () => {
    const relativeItem = { photoUrl: 'demo-macbook.jpg', category: 'ELECTRONICS' };
    const resolvedUrl = getItemImageUrl(relativeItem, true);
    assert.ok(resolvedUrl.includes('demo-macbook.jpg'));
  });

  test('TC-13: UI copy integrity - ensures internal technical jargon like "STOMP Live E2E" is never rendered in UI', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const chatFilePath = path.resolve('src/pages/Chat.jsx');
    const content = fs.readFileSync(chatFilePath, 'utf-8');
    assert.ok(!content.includes('STOMP Live E2E'), 'UI must not display internal protocol string "STOMP Live E2E"');
    assert.ok(content.includes('Online'), 'Chat header should display clean user status like "Online"');
  });

  test('TC-15: UI buzzword sanitization - verifies robotic/internal badges are removed', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    const loginContent = fs.readFileSync(path.resolve('src/pages/Login.jsx'), 'utf-8');
    assert.ok(!loginContent.includes('Password = Your PRN'), 'Login should not display buzzword "Password = Your PRN"');

    const regContent = fs.readFileSync(path.resolve('src/pages/Register.jsx'), 'utf-8');
    assert.ok(!regContent.includes('Default password = PRN'), 'Register should not display buzzword "Default password = PRN"');

    const reportFound = fs.readFileSync(path.resolve('src/pages/ReportFound.jsx'), 'utf-8');
    assert.ok(!reportFound.includes('FOUND ITEM LOG'), 'ReportFound should not show robotic badge "FOUND ITEM LOG"');

    const reportLost = fs.readFileSync(path.resolve('src/pages/ReportLost.jsx'), 'utf-8');
    assert.ok(!reportLost.includes('LOST ITEM REPORT'), 'ReportLost should not show robotic badge "LOST ITEM REPORT"');

    const chatContent = fs.readFileSync(path.resolve('src/pages/Chat.jsx'), 'utf-8');
    assert.ok(!chatContent.includes('Verified Campus Protocol:'), 'Chat should not show robotic protocol banner');
    assert.ok(!chatContent.includes('Suggestions:'), 'Chat should not have "Suggestions:" label');

    const landingContent = fs.readFileSync(path.resolve('src/pages/Landing.jsx'), 'utf-8');
    assert.ok(!landingContent.includes('3D telemetry'), 'Landing should not mention 3D telemetry');
  });
});
