-- Fix RLS policies for agent_status tables
-- Issue: Anonymous users can INSERT/UPDATE/DELETE due to USING (true) policies
-- Fix: Restrict writes to service role only, keep public read access

-- ====== agent_status table ======

-- Drop insecure policies
DROP POLICY IF EXISTS "Allow service role full access" ON agent_status;
DROP POLICY IF EXISTS "Allow updates" ON agent_status;
DROP POLICY IF EXISTS "Allow inserts" ON agent_status;

-- Keep public read access (dashboard should be viewable)
-- This policy already exists and is correct
-- CREATE POLICY "Allow public read access" ON agent_status FOR SELECT USING (true);

-- Only service role can INSERT new agents
CREATE POLICY "Service role can insert" ON agent_status
  FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');

-- Only service role can UPDATE agent status
CREATE POLICY "Service role can update" ON agent_status
  FOR UPDATE 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Only service role can DELETE agents
CREATE POLICY "Service role can delete" ON agent_status
  FOR DELETE 
  USING (auth.role() = 'service_role');

-- ====== agent_status_history table ======

-- Drop insecure policies
DROP POLICY IF EXISTS "Allow service role full access" ON agent_status_history;
DROP POLICY IF EXISTS "Allow inserts" ON agent_status_history;

-- Keep public read access
-- This policy already exists and is correct
-- CREATE POLICY "Allow public read access" ON agent_status_history FOR SELECT USING (true);

-- Only service role can INSERT history records
CREATE POLICY "Service role can insert" ON agent_status_history
  FOR INSERT 
  WITH CHECK (auth.role() = 'service_role');

-- Only service role can UPDATE history (if needed)
CREATE POLICY "Service role can update" ON agent_status_history
  FOR UPDATE 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Only service role can DELETE history
CREATE POLICY "Service role can delete" ON agent_status_history
  FOR DELETE 
  USING (auth.role() = 'service_role');

-- Verify RLS is enabled
ALTER TABLE agent_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_status_history ENABLE ROW LEVEL SECURITY;
