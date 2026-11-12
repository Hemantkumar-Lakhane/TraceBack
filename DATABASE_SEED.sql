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
(1, 'Alex Johnson', 'alex.student@campus.edu', '$2a$12$cUR04ePksvFHe2FP9jbA9ej6tAHpPKCc8BUJ3hDApbudyJyE6NaL2', 'STUDENT', NOW()),
(2, 'David Kim', 'david.kim@campus.edu', '$2a$12$cUR04ePksvFHe2FP9jbA9ej6tAHpPKCc8BUJ3hDApbudyJyE6NaL2', 'STUDENT', NOW()),
(3, 'Officer Marcus Vance', 'officer.vance@campus.edu', '$2a$12$cUR04ePksvFHe2FP9jbA9ej6tAHpPKCc8BUJ3hDApbudyJyE6NaL2', 'SECURITY', NOW()),
(4, 'Dean Sarah Jenkins', 'admin.sarah@campus.edu', '$2a$12$cUR04ePksvFHe2FP9jbA9ej6tAHpPKCc8BUJ3hDApbudyJyE6NaL2', 'ADMIN', NOW());

-- 2. ITEMS
INSERT INTO items (id, category, name, description, color, brand, image_url, created_at) VALUES
(1, 'ELECTRONICS', 'Space Gray MacBook Pro 14"', '14-inch MacBook Pro M2 with React sticker on lid and minor scratch near the trackpad.', 'Space Gray', 'Apple', '/uploads/demo-macbook.jpg', NOW()),
(2, 'ELECTRONICS', 'Apple MacBook Pro 14" Space Gray', 'Found on study desk in 2nd floor library near the window. Turned in to Central Security Desk.', 'Space Gray', 'Apple', '/uploads/demo-macbook.jpg', NOW()),
(3, 'WALLETS_CARDS', 'Navy Blue Leather Wallet', 'Navy blue bi-fold leather wallet containing Student ID STU-89241 and campus meal pass.', 'Navy Blue', 'Fossil', NULL, NOW()),
(4, 'ELECTRONICS', 'Sony WH-1000XM5 Headphones', 'Black wireless over-ear noise-cancelling headphones found on bench near Quad Lawn. Currently secured in Locker B-04.', 'Black', 'Sony', NULL, NOW()),
(5, 'OTHER', 'HydroFlask Water Bottle 32oz', '32oz wide mouth teal flask with university computer club stickers.', 'Teal', 'HydroFlask', NULL, NOW()),
(6, 'OTHER', 'Teal HydroFlask 32oz', 'Teal water bottle retrieved from Engineering Lab 104.', 'Teal', 'HydroFlask', NULL, NOW());

-- 3. LOST REPORTS
INSERT INTO lost_reports (id, item_id, user_id, location, date_lost, status, created_at) VALUES
(1, 1, 1, 'Central Library - 2nd Floor Study Area', '2026-11-08', 'MATCHED', NOW()),
(2, 3, 1, 'Student Union - Food Court', '2026-11-09', 'OPEN', NOW()),
(3, 5, 1, 'Engineering Block B - Room 104 Lab', '2026-11-05', 'CLOSED', NOW());

-- 4. FOUND REPORTS
INSERT INTO found_reports (id, item_id, user_id, location, date_found, status, created_at) VALUES
(1, 2, 2, 'Central Library - 2nd Floor Study Area', '2026-11-08', 'MATCHED', NOW()),
(2, 4, 2, 'Main Campus Green / Quad Lawn', '2026-11-09', 'OPEN', NOW()),
(3, 6, 2, 'Engineering Block B - Room 104 Lab', '2026-11-05', 'RETURNED', NOW());

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
(1, 1, 2, 'Hi Alex! I found a MacBook Pro on the 2nd floor study table and turned it over to Central Security.', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(2, 1, 1, 'Hello David! Thank you so much! Does it have a React hexagon sticker on the top right lid?', DATE_SUB(NOW(), INTERVAL 90 MINUTE)),
(3, 1, 2, 'Yes it does, and a slight scratch on the left corner. Security has logged it under Locker A-12.', DATE_SUB(NOW(), INTERVAL 60 MINUTE)),
(4, 1, 1, 'That is definitely mine! I have submitted the verification claim with the serial number.', DATE_SUB(NOW(), INTERVAL 30 MINUTE));

-- 8. CLAIMS (Physical pickup verification)
INSERT INTO claims (id, match_id, claimant_id, verification_data, proof_file_url, pickup_date, pickup_time, status, created_at, reviewed_at) VALUES
(1, 1, 1, 'Serial Number: C02G876XMD6R. Has React sticker on top lid and custom wallpaper showing Yosemite Valley. Student ID: STU-89241.', NULL, '2026-11-12', '14:30:00', 'PENDING', NOW(), NULL),
(2, 2, 1, 'Student ID confirmed on retrieval desk receipt #4891.', NULL, '2026-11-06', '11:00:00', 'APPROVED', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY));

-- 9. NOTIFICATIONS
INSERT INTO notifications (id, user_id, type, message, reference_id, is_read, created_at) VALUES
(1, 1, 'MATCH', 'High confidence match found (100%) for your reported Space Gray MacBook Pro 14"!', 1, FALSE, NOW()),
(2, 1, 'CHAT', 'New message from David Kim regarding Space Gray MacBook Pro 14"', 1, FALSE, NOW()),
(3, 2, 'CLAIM', 'A verification claim was submitted by Alex Johnson for MacBook Pro.', 1, FALSE, NOW()),
(4, 3, 'VERIFICATION', 'New pending ownership claim submitted for Match #1 (MacBook Pro) awaiting physical inspection.', 1, FALSE, NOW());

