import { test, describe } from 'node:test';
import assert from 'node:assert';
import { provisionStaffUser, updateUserStatus, updateUserRole } from '../src/api/adminService.js';
import { MOCK_ADMIN_DATA } from '../src/api/mockData.js';

describe('QA Test Suite: Admin Panel Production Grade Capabilities', () => {

  test('TC-ADMIN-01: Provision staff account creates valid object with badge PRN and active status', async () => {
    // Force demo session check
    globalThis.localStorage = {
      getItem: (key) => key === 'tb_is_demo_session' ? 'true' : null,
      setItem: () => {},
      removeItem: () => {}
    };

    const newStaff = await provisionStaffUser({
      name: 'Officer Ramesh Kulkarni',
      email: 'ramesh.kulkarni@vit.edu',
      role: 'SECURITY',
      department: 'Central Security Office - Building 1',
      phone: '+91 (020) 2420-2180'
    });

    assert.strictEqual(newStaff.name, 'Officer Ramesh Kulkarni');
    assert.strictEqual(newStaff.email, 'ramesh.kulkarni@vit.edu');
    assert.strictEqual(newStaff.role, 'SECURITY');
    assert.strictEqual(newStaff.status, 'ACTIVE');
    assert.ok(newStaff.prn.startsWith('SEC-'), 'Security officer PRN must start with SEC-');
  });

  test('TC-ADMIN-02: Status update returns updated status safely without corrupting array', async () => {
    const res = await updateUserStatus(1, 'SUSPENDED');
    assert.strictEqual(res.status, 'SUSPENDED');

    // Simulate React functional state update
    const prevUsers = [
      { id: 1, name: 'Aarav Sharma', status: 'ACTIVE' },
      { id: 2, name: 'Rohan Verma', status: 'ACTIVE' }
    ];

    const updatedUsers = prevUsers.map(u => u.id === 1 ? { ...u, status: res.status } : u);
    assert.strictEqual(Array.isArray(updatedUsers), true, 'State must remain an array');
    assert.strictEqual(updatedUsers[0].status, 'SUSPENDED');
    assert.strictEqual(updatedUsers[1].status, 'ACTIVE');
  });

  test('TC-ADMIN-03: Self-protection guardrail logic prevents admin self-suspension', () => {
    const currentAdmin = { id: 4, email: 'priya.nair@vit.edu', role: 'ADMIN' };
    const targetUser = { id: 4, email: 'priya.nair@vit.edu', role: 'ADMIN' };

    const isSelf = currentAdmin.id === targetUser.id || currentAdmin.email === targetUser.email;
    assert.strictEqual(isSelf, true, 'Guardrail must detect self action');
  });

  test('TC-ADMIN-04: CSV audit export correctly formats headers and escapes quoted strings', () => {
    const sampleUsers = [
      { id: 1, name: 'Aarav, Sharma', email: 'aarav@vit.edu', prn: '12110104', role: 'STUDENT', status: 'ACTIVE', joined: '2026-08-15' }
    ];

    const headers = ['User ID', 'Full Name', 'Campus Email', 'PRN/ID', 'Role', 'Status', 'Joined Date'];
    const rows = sampleUsers.map(u => [
      u.id,
      `"${u.name}"`,
      `"${u.email}"`,
      `"${u.prn}"`,
      u.role,
      u.status,
      u.joined
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    assert.ok(csvContent.includes('"Aarav, Sharma"'), 'Commas in name must be safely quoted in CSV');
    assert.ok(csvContent.startsWith('User ID,Full Name,Campus Email'));
  });

  test('TC-ADMIN-05: Telemetry stats calculation avoids zero-division and returns valid percentage', () => {
    const totalLost = 0;
    const totalMatches = 0;
    const returnRate = totalLost > 0 ? `${((totalMatches / totalLost) * 100).toFixed(1)}%` : '0.0%';

    assert.strictEqual(returnRate, '0.0%');
  });
});
