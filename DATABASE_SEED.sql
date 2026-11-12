-- TraceBack Comprehensive Realistic Campus Seed Data
-- Passwords for all accounts: password123 (BCrypt hash)

USE traceback;

-- Disable foreign key checks for clean re-runnable seeding
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE messages;
TRUNCATE TABLE conversations;
TRUNCATE TABLE claims;
TRUNCATE TABLE match_records;
TRUNCATE TABLE found_reports;
TRUNCATE TABLE lost_reports;
TRUNCATE TABLE items;
TRUNCATE TABLE notifications;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS (Roles: STUDENT, SECURITY, ADMIN)
INSERT INTO users (id, name, email, password, role, created_at) VALUES
(1, 'Aarav Sharma', 'aarav.sharma@campus.edu', '$2a$12$cUR04ePksvFHe2FP9jbA9ej6tAHpPKCc8BUJ3hDApbudyJyE6NaL2', 'STUDENT', NOW()),
(2, 'Rohan Verma', 'rohan.verma@campus.edu', '$2a$12$cUR04ePksvFHe2FP9jbA9ej6tAHpPKCc8BUJ3hDApbudyJyE6NaL2', 'STUDENT', NOW()),
(3, 'Inspector Rajesh Kumar', 'rajesh.kumar@campus.edu', '$2a$12$cUR04ePksvFHe2FP9jbA9ej6tAHpPKCc8BUJ3hDApbudyJyE6NaL2', 'SECURITY', NOW()),
(4, 'Prof. Priya Nair', 'priya.nair@campus.edu', '$2a$12$cUR04ePksvFHe2FP9jbA9ej6tAHpPKCc8BUJ3hDApbudyJyE6NaL2', 'ADMIN', NOW()),
-- Backward compatibility accounts for legacy automated test suites
(5, 'Aarav Sharma (Test Alias)', 'alex.student@campus.edu', '$2a$12$cUR04ePksvFHe2FP9jbA9ej6tAHpPKCc8BUJ3hDApbudyJyE6NaL2', 'STUDENT', NOW()),
(6, 'Rohan Verma (Test Alias)', 'david.kim@campus.edu', '$2a$12$cUR04ePksvFHe2FP9jbA9ej6tAHpPKCc8BUJ3hDApbudyJyE6NaL2', 'STUDENT', NOW()),
(7, 'Inspector Rajesh Kumar (Test Alias)', 'officer.vance@campus.edu', '$2a$12$cUR04ePksvFHe2FP9jbA9ej6tAHpPKCc8BUJ3hDApbudyJyE6NaL2', 'SECURITY', NOW()),
(8, 'Prof. Priya Nair (Test Alias)', 'admin.sarah@campus.edu', '$2a$12$cUR04ePksvFHe2FP9jbA9ej6tAHpPKCc8BUJ3hDApbudyJyE6NaL2', 'ADMIN', NOW());

-- 2. ITEMS
INSERT INTO items (id, category, name, description, color, brand, image_url, created_at) VALUES
(1, 'ELECTRONICS', 'Space Gray MacBook Pro 14"', '14-inch MacBook Pro M2 with React sticker on lid and minor scratch near the trackpad.', 'Space Gray', 'Apple', '/uploads/demo-macbook.jpg', NOW()),
(2, 'ELECTRONICS', 'Apple MacBook Pro 14" Space Gray', 'Found on study desk in 2nd floor library near the window. Turned in to Ramanujan Central Security Vault.', 'Space Gray', 'Apple', '/uploads/demo-macbook.jpg', NOW()),
(3, 'WALLETS_CARDS', 'Navy Blue Leather Wallet', 'Navy blue bi-fold leather wallet containing Student ID IITB-2024-CS104 and campus canteen pass.', 'Navy Blue', 'Titan', '/uploads/demo-wallet.jpg', NOW()),
(4, 'ELECTRONICS', 'Sony WH-1000XM5 Headphones', 'Black wireless over-ear noise-cancelling headphones found on bench near Quad Lawn. Currently secured in Locker B-04.', 'Black', 'Sony', '/uploads/demo-headphones.jpg', NOW()),
(5, 'OTHER', 'Milton Thermosteel Water Bottle 1L', '1L wide mouth silver steel flask with university robotics club sticker.', 'Silver', 'Milton', '/uploads/demo-bottle.jpg', NOW()),
(6, 'OTHER', 'Silver Milton Thermosteel 1L', 'Milton water bottle retrieved from Visvesvaraya Engineering Lab 104.', 'Silver', 'Milton', '/uploads/demo-bottle.jpg', NOW());

-- 3. LOST REPORTS
INSERT INTO lost_reports (id, item_id, user_id, location, date_lost, status, created_at) VALUES
(1, 1, 1, 'Dr. APJ Abdul Kalam Central Library - 2nd Floor Reading Hall', '2026-11-08', 'MATCHED', NOW()),
(2, 3, 1, 'Ramanujan Student Center - Cafeteria', '2026-11-09', 'OPEN', NOW()),
(3, 5, 1, 'Visvesvaraya Engineering Block B - IoT Lab 104', '2026-11-05', 'CLOSED', NOW());

-- 4. FOUND REPORTS
INSERT INTO found_reports (id, item_id, user_id, location, date_found, status, created_at) VALUES
(1, 2, 2, 'Dr. APJ Abdul Kalam Central Library - 2nd Floor Reading Hall', '2026-11-08', 'MATCHED', NOW()),
(2, 4, 2, 'Sarojini Naidu Campus Quadrangle Lawn', '2026-11-09', 'OPEN', NOW()),
(3, 6, 2, 'Visvesvaraya Engineering Block B - IoT Lab 104', '2026-11-05', 'RETURNED', NOW());

-- 5. MATCH RECORDS (Deterministic: Category=40 + Location=30 + Date=30)
INSERT INTO match_records (id, lost_id, found_id, score, status, created_at) VALUES
(1, 1, 1, 100, 'ACTIVE', NOW()),
(2, 3, 3, 100, 'CLOSED', NOW());

-- 6. CONVERSATIONS
INSERT INTO conversations (id, match_id, created_at) VALUES
(1, 1, NOW()),
(2, 2, NOW());

-- 7. MESSAGES (Chat history)
INSERT INTO messages (id, conversation_id, sender_id, content, timestamp) VALUES
(1, 1, 2, 'Namaste Aarav! I found a MacBook Pro on the 2nd floor study table and turned it over to Ramanujan Central Security Vault.', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(2, 1, 1, 'Hello Rohan! Thank you so much! Does it have a React hexagon sticker on the top right lid?', DATE_SUB(NOW(), INTERVAL 90 MINUTE)),
(3, 1, 2, 'Yes it does, and a slight scratch on the left corner. Security has logged it under Locker A-12.', DATE_SUB(NOW(), INTERVAL 60 MINUTE)),
(4, 1, 1, 'That is definitely mine! I have submitted the verification claim with the serial number.', DATE_SUB(NOW(), INTERVAL 30 MINUTE));

-- 8. CLAIMS (Physical pickup verification)
INSERT INTO claims (id, match_id, claimant_id, verification_data, proof_file_url, pickup_date, pickup_time, status, created_at, reviewed_at) VALUES
(1, 1, 1, 'Serial Number: C02G876XMD6R. Has React sticker on top lid and custom wallpaper showing Western Ghats. Student ID: IITB-2024-CS104.', NULL, '2026-11-12', '14:30:00', 'PENDING', NOW(), NULL),
(2, 2, 1, 'Student ID confirmed on retrieval desk receipt #4891.', NULL, '2026-11-06', '11:00:00', 'APPROVED', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY));

-- 9. NOTIFICATIONS
INSERT INTO notifications (id, user_id, type, message, reference_id, is_read, created_at) VALUES
(1, 1, 'MATCH', 'High confidence match found (100%) for your reported Space Gray MacBook Pro 14"!', 1, FALSE, NOW()),
(2, 1, 'CHAT', 'New message from Rohan Verma regarding Space Gray MacBook Pro 14"', 1, FALSE, NOW()),
(3, 2, 'CLAIM', 'A verification claim was submitted by Aarav Sharma for MacBook Pro.', 1, FALSE, NOW()),
(4, 3, 'VERIFICATION', 'New pending ownership claim submitted for Match #1 (MacBook Pro) awaiting physical inspection.', 1, FALSE, NOW());
