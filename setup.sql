-- Agent Status Tracker - Database Setup
-- Copy and paste this entire file into Supabase SQL Editor
-- https://supabase.com/dashboard/project/your-project/sql

-- Current status (quick lookup)
CREATE TABLE IF NOT EXISTS agent_status (
  agent_id TEXT PRIMARY KEY,
  agent_name TEXT,
  status TEXT DEFAULT 'idle', -- idle, working, error
  current_task TEXT,
  last_active_at TIMESTAMPTZ DEFAULT now()
);

-- History (SCD Type 2)
CREATE TABLE IF NOT EXISTS agent_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT,
  status TEXT,
  task TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ
);

-- Enable RLS (Row Level Security)
ALTER TABLE agent_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_status_history ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anyone can view agent status)
DROP POLICY IF EXISTS "Allow public read access" ON agent_status;
CREATE POLICY "Allow public read access" ON agent_status
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access" ON agent_status_history;
CREATE POLICY "Allow public read access" ON agent_status_history
  FOR SELECT USING (true);

-- Allow updates via service key (agents can update their own status)
DROP POLICY IF EXISTS "Allow updates" ON agent_status;
CREATE POLICY "Allow updates" ON agent_status
  FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow inserts" ON agent_status;
CREATE POLICY "Allow inserts" ON agent_status
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow inserts" ON agent_status_history;
CREATE POLICY "Allow inserts" ON agent_status_history
  FOR INSERT WITH CHECK (true);

-- Seed agents (insert initial data)
INSERT INTO agent_status (agent_id, agent_name, status) VALUES
  ('ducki', 'Ducki (Main)', 'idle'),
  ('pixel', 'Pixel', 'idle'),
  ('linus', 'Linus', 'idle'),
  ('tesla', 'Tesla', 'idle'),
  ('shakespeare', 'Shakespeare', 'idle')
ON CONFLICT (agent_id) DO NOTHING;

-- Verify setup
SELECT 
  agent_id, 
  agent_name, 
  status, 
  last_active_at 
FROM agent_status 
ORDER BY agent_id;
