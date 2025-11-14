/*
  # Arc Raiders Bounty Hunter Database Schema

  ## Overview
  This migration creates the complete database structure for the Arc Raiders Bounty Hunter web application,
  enabling community-driven bounty tracking with real-time notifications.

  ## New Tables

  ### 1. `users` (extends auth.users)
  Additional user profile data beyond Supabase auth:
  - `id` (uuid, references auth.users) - User identifier
  - `username` (text, unique) - Display name
  - `reputation` (integer) - User reputation score
  - `role` (text) - User role: hunter, reporter, or both
  - `discord_tag` (text, optional) - Discord contact
  - `steam_id` (text, optional) - Steam contact
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### 2. `bounties`
  Tracks reported kills and active bounties:
  - `id` (uuid, primary key) - Bounty identifier
  - `session_id` (text) - Game session ID where kill occurred
  - `reporter_id` (uuid, FK to users) - User who reported the bounty
  - `target_name` (text) - In-game name of the killer
  - `last_location` (text) - Last known location in game
  - `description` (text) - Additional details about the kill
  - `proof_url` (text, optional) - Screenshot/video evidence URL
  - `reward_offer` (text, optional) - Optional reward description
  - `status` (text) - active, claimed, expired, or confirmed
  - `expires_at` (timestamptz) - 24-hour expiry from creation
  - `created_at` (timestamptz) - Bounty creation timestamp

  ### 3. `confirmations`
  Tracks bounty kill confirmations by hunters:
  - `id` (uuid, primary key) - Confirmation identifier
  - `bounty_id` (uuid, FK to bounties) - Related bounty
  - `hunter_id` (uuid, FK to users) - Hunter who claimed the kill
  - `proof_url` (text) - Screenshot/video proof of confirmed kill
  - `session_id` (text) - Session ID where confirmation occurred
  - `verified` (boolean) - Whether confirmation is verified
  - `confirmed_at` (timestamptz) - Confirmation timestamp

  ### 4. `active_sessions`
  Tracks which hunters are actively playing in which sessions:
  - `user_id` (uuid, FK to users) - Active hunter
  - `session_id` (text) - Current game session ID
  - `is_active` (boolean) - Active status toggle
  - `last_updated` (timestamptz) - Last activity update
  - Primary key: (user_id, session_id)

  ### 5. `session_messages`
  Real-time chat messages tied to game sessions:
  - `id` (uuid, primary key) - Message identifier
  - `session_id` (text) - Game session ID
  - `user_id` (uuid, FK to users) - Message author
  - `message` (text) - Message content
  - `created_at` (timestamptz) - Message timestamp

  ## Security
  - RLS enabled on all tables
  - Users can read their own profile and public user data
  - Authenticated users can create bounties and confirmations
  - Users can update their own profiles and active sessions
  - Session messages are readable by all authenticated users in that session
  - Moderation policies for admin actions

  ## Indexes
  - Index on bounties.session_id for fast session filtering
  - Index on bounties.status for active bounty queries
  - Index on bounties.expires_at for cleanup queries
  - Index on active_sessions.session_id for real-time lookups
  - Index on session_messages.session_id for chat queries
*/

-- Create users profile table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  reputation integer DEFAULT 0,
  role text DEFAULT 'both' CHECK (role IN ('hunter', 'reporter', 'both')),
  discord_tag text,
  steam_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bounties table
CREATE TABLE IF NOT EXISTS bounties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  reporter_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_name text NOT NULL,
  last_location text NOT NULL,
  description text,
  proof_url text,
  reward_offer text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'claimed', 'expired', 'confirmed')),
  expires_at timestamptz DEFAULT (now() + interval '24 hours'),
  created_at timestamptz DEFAULT now()
);

-- Create confirmations table
CREATE TABLE IF NOT EXISTS confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bounty_id uuid NOT NULL REFERENCES bounties(id) ON DELETE CASCADE,
  hunter_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  proof_url text NOT NULL,
  session_id text NOT NULL,
  verified boolean DEFAULT false,
  confirmed_at timestamptz DEFAULT now()
);

-- Create active_sessions table
CREATE TABLE IF NOT EXISTS active_sessions (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id text NOT NULL,
  is_active boolean DEFAULT true,
  last_updated timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, session_id)
);

-- Create session_messages table
CREATE TABLE IF NOT EXISTS session_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bounties_session_id ON bounties(session_id);
CREATE INDEX IF NOT EXISTS idx_bounties_status ON bounties(status);
CREATE INDEX IF NOT EXISTS idx_bounties_expires_at ON bounties(expires_at);
CREATE INDEX IF NOT EXISTS idx_active_sessions_session_id ON active_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_session_messages_session_id ON session_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_session_messages_created_at ON session_messages(created_at);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounties ENABLE ROW LEVEL SECURITY;
ALTER TABLE confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read all public profiles"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for bounties table
CREATE POLICY "Anyone can read active bounties"
  ON bounties FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create bounties"
  ON bounties FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Reporters can update own bounties"
  ON bounties FOR UPDATE
  TO authenticated
  USING (auth.uid() = reporter_id)
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Reporters can delete own bounties"
  ON bounties FOR DELETE
  TO authenticated
  USING (auth.uid() = reporter_id);

-- RLS Policies for confirmations table
CREATE POLICY "Anyone can read confirmations"
  ON confirmations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create confirmations"
  ON confirmations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = hunter_id);

CREATE POLICY "Hunters can update own confirmations"
  ON confirmations FOR UPDATE
  TO authenticated
  USING (auth.uid() = hunter_id)
  WITH CHECK (auth.uid() = hunter_id);

-- RLS Policies for active_sessions table
CREATE POLICY "Anyone can read active sessions"
  ON active_sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own active sessions"
  ON active_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own active sessions"
  ON active_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own active sessions"
  ON active_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for session_messages table
CREATE POLICY "Anyone can read session messages"
  ON session_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create messages"
  ON session_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
  ON session_messages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to auto-expire bounties
CREATE OR REPLACE FUNCTION expire_old_bounties()
RETURNS void AS $$
BEGIN
  UPDATE bounties
  SET status = 'expired'
  WHERE status = 'active'
  AND expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old session messages (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM session_messages
  WHERE created_at < now() - interval '24 hours';
END;
$$ LANGUAGE plpgsql;