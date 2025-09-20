-- SQL script to create test data for users and user_chats tables
-- Run this directly in Supabase SQL editor to bypass RLS

-- Temporarily disable RLS for testing (optional)
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_chats DISABLE ROW LEVEL SECURITY;

-- Insert test users
INSERT INTO users (id, name, email, password, residence, is_lawyer) VALUES
(
    gen_random_uuid(),
    'Test User',
    'testuser@example.com',
    'dummy_password',
    'Sample City',
    false
),
(
    gen_random_uuid(),
    'Jane Doe',
    'jane.doe@example.com',
    'dummy_password',
    'Mumbai',
    false
),
(
    gen_random_uuid(),
    'John Smith',
    'john.smith@example.com',
    'dummy_password',
    'Delhi',
    true
);

-- Get the user IDs for chat insertion
-- (You'll need to run this separately and use the actual UUIDs)

-- Example chat insertions (replace USER_ID_HERE with actual UUIDs from above)
-- INSERT INTO user_chats (user_id, user_text_input, ai_text_output, user_document_submission, chatbot_document) VALUES
-- (
--     'USER_ID_HERE',
--     'Hello AI, how are you?',
--     'I am doing great, thank you!',
--     'dummy_doc.pdf',
--     'summary.txt'
-- );

-- Select the inserted data to verify
SELECT 'USERS:' as table_name;
SELECT id, name, email, residence, is_lawyer, created_at FROM users ORDER BY created_at DESC LIMIT 5;

SELECT 'USER_CHATS:' as table_name;
SELECT id, user_id, user_text_input, ai_text_output, user_document_submission, chatbot_document, created_at FROM user_chats ORDER BY created_at DESC LIMIT 5;

-- Re-enable RLS after testing (if disabled)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_chats ENABLE ROW LEVEL SECURITY;