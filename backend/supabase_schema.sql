-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create lawyers table
CREATE TABLE lawyers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT NOT NULL,
    license_number TEXT UNIQUE NOT NULL,
    professional_information TEXT,
    years_of_experience INTEGER,
    primary_practice_area TEXT,
    practice_location TEXT,
    working_court TEXT,
    specialization_document TEXT,
    education_document TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    residence TEXT,
    is_lawyer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_chats table
CREATE TABLE user_chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_text_input TEXT,
    ai_text_output TEXT,
    user_document_submission TEXT,
    chatbot_document TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_lawyers_email ON lawyers(email);
CREATE INDEX idx_lawyers_license ON lawyers(license_number);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_chats_user_id ON user_chats(user_id);

-- Add Row Level Security (RLS) policies
ALTER TABLE lawyers ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_chats ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (you may want to customize these based on your needs)
CREATE POLICY "Allow public read access to lawyers" ON lawyers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow users to manage their own data" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Allow users to manage their own chats" ON user_chats FOR ALL USING (auth.uid() = user_id);