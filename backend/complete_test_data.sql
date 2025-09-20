-- Complete Test Data Script for Users and User_Chats Tables
-- Run this in Supabase SQL Editor to test data insertion and retrieval

-- First, let's check if tables exist and their structure
SELECT 'Checking table structure...' as status;

-- Check users table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Check user_chats table structure  
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_chats' 
ORDER BY ordinal_position;

-- Temporarily disable RLS for testing (uncomment if needed)
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_chats DISABLE ROW LEVEL SECURITY;

-- Insert test users
INSERT INTO users (name, email, password, residence, is_lawyer) VALUES
('Test User', 'testuser@example.com', 'dummy_password', 'Sample City', false),
('Jane Doe', 'jane.doe@example.com', 'dummy_password', 'Mumbai', false),
('John Smith', 'john.smith@example.com', 'dummy_password', 'Delhi', true),
('Priya Sharma', 'priya.sharma@example.com', 'dummy_password', 'Bangalore', false),
('Rajesh Kumar', 'rajesh.kumar@example.com', 'dummy_password', 'Chennai', false);

-- Get user IDs for chat insertion
WITH user_ids AS (
    SELECT id, name, email FROM users WHERE email LIKE '%@example.com'
)
-- Insert test chats for each user
INSERT INTO user_chats (user_id, user_text_input, ai_text_output, user_document_submission, chatbot_document)
SELECT 
    u.id,
    'Hello AI, how are you?',
    'I am doing great, thank you! How can I help you with your legal questions today?',
    'dummy_doc.pdf',
    'summary.txt'
FROM user_ids u;

-- Insert more varied chat conversations
WITH user_ids AS (
    SELECT id, name FROM users WHERE email = 'testuser@example.com'
)
INSERT INTO user_chats (user_id, user_text_input, ai_text_output, user_document_submission, chatbot_document)
SELECT 
    u.id,
    conversation.user_input,
    conversation.ai_output,
    conversation.user_doc,
    conversation.ai_doc
FROM user_ids u
CROSS JOIN (
    VALUES 
    ('What are my rights as a tenant?', 'As a tenant in India, you have several rights including the right to peaceful enjoyment of the property, protection against arbitrary eviction, and the right to basic amenities as agreed in the lease.', 'lease_agreement.pdf', 'tenant_rights_summary.txt'),
    ('Can my landlord increase rent without notice?', 'Rent increases typically require proper notice as per your lease agreement and local rent control laws. Most states require 30-90 days notice for rent increases.', NULL, 'rent_increase_guidelines.txt'),
    ('I have a property dispute with my neighbor', 'Property disputes are common. Do you have the original property documents and survey records? These will be crucial for establishing your legal boundaries.', 'property_docs.pdf', 'property_dispute_guide.txt'),
    ('Thank you for the information!', 'You''re welcome! Feel free to ask if you have any more legal questions. I''m here to help with your legal concerns.', NULL, NULL)
) AS conversation(user_input, ai_output, user_doc, ai_doc);

-- Insert chats for Jane Doe (consumer rights case)
WITH user_ids AS (
    SELECT id FROM users WHERE email = 'jane.doe@example.com'
)
INSERT INTO user_chats (user_id, user_text_input, ai_text_output, user_document_submission, chatbot_document)
SELECT 
    u.id,
    conversation.user_input,
    conversation.ai_output,
    conversation.user_doc,
    conversation.ai_doc
FROM user_ids u
CROSS JOIN (
    VALUES 
    ('I bought a defective product online and the seller is refusing to refund', 'This falls under consumer protection laws. The Consumer Protection Act, 2019 gives you strong rights. Do you have proof of purchase and evidence of the defect?', 'purchase_receipt.pdf', 'consumer_rights_guide.txt'),
    ('Yes, I have the invoice and photos of the defective product', 'Great! You can file a complaint with the Consumer Forum. For claims up to ₹20 lakhs, approach the District Forum. The process is simple and you can represent yourself.', 'defect_photos.pdf', 'consumer_complaint_process.txt')
) AS conversation(user_input, ai_output, user_doc, ai_doc);

-- Now let's verify the inserted data
SELECT '=== VERIFICATION RESULTS ===' as status;

-- Count total records
SELECT 'RECORD COUNTS:' as info;
SELECT 
    'Users' as table_name, 
    COUNT(*) as total_records 
FROM users
UNION ALL
SELECT 
    'User Chats' as table_name, 
    COUNT(*) as total_records 
FROM user_chats;

-- Show all users
SELECT 'ALL USERS:' as info;
SELECT 
    id,
    name,
    email,
    residence,
    is_lawyer,
    created_at
FROM users 
ORDER BY created_at DESC;

-- Show all chats with user information
SELECT 'ALL CHATS WITH USER INFO:' as info;
SELECT 
    uc.id as chat_id,
    u.name as user_name,
    u.email as user_email,
    uc.user_text_input,
    uc.ai_text_output,
    uc.user_document_submission,
    uc.chatbot_document,
    uc.created_at
FROM user_chats uc
JOIN users u ON uc.user_id = u.id
ORDER BY uc.created_at;

-- Show conversation summary by user
SELECT 'CONVERSATION SUMMARY BY USER:' as info;
SELECT 
    u.name,
    u.email,
    COUNT(uc.id) as total_messages,
    MIN(uc.created_at) as first_message,
    MAX(uc.created_at) as last_message
FROM users u
LEFT JOIN user_chats uc ON u.id = uc.user_id
GROUP BY u.id, u.name, u.email
ORDER BY total_messages DESC;

-- Test the foreign key relationship
SELECT 'FOREIGN KEY RELATIONSHIP TEST:' as info;
SELECT 
    'Users with chats' as relationship_type,
    COUNT(DISTINCT u.id) as count
FROM users u
INNER JOIN user_chats uc ON u.id = uc.user_id
UNION ALL
SELECT 
    'Users without chats' as relationship_type,
    COUNT(u.id) as count
FROM users u
LEFT JOIN user_chats uc ON u.id = uc.user_id
WHERE uc.user_id IS NULL;

-- Show sample conversation flow
SELECT 'SAMPLE CONVERSATION FLOW:' as info;
SELECT 
    ROW_NUMBER() OVER (ORDER BY uc.created_at) as message_number,
    CASE 
        WHEN ROW_NUMBER() OVER (ORDER BY uc.created_at) % 2 = 1 THEN 'USER'
        ELSE 'AI'
    END as sender,
    CASE 
        WHEN ROW_NUMBER() OVER (ORDER BY uc.created_at) % 2 = 1 THEN uc.user_text_input
        ELSE uc.ai_text_output
    END as message,
    uc.created_at
FROM user_chats uc
JOIN users u ON uc.user_id = u.id
WHERE u.email = 'testuser@example.com'
ORDER BY uc.created_at;

-- Re-enable RLS after testing (uncomment if you disabled it)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_chats ENABLE ROW LEVEL SECURITY;

SELECT '=== TEST COMPLETED SUCCESSFULLY ===' as status;
SELECT 'Data has been inserted and verified in both users and user_chats tables' as message;
SELECT 'You can now test the Python scripts to read this data' as next_step;