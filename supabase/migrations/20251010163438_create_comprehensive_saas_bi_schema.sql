/*
  # SaaS BI Application - Comprehensive Database Schema
  
  ## Overview
  Complete database schema for the TrendRadar Hub SaaS BI application with RBAC,
  audit logging, and multi-tenant architecture.

  ## 1. New Tables Created
  
  ### Authentication & Users
  - `profiles` - Extended user profiles linking to Supabase auth.users
    - id (uuid, references auth.users)
    - full_name (text)
    - avatar_url (text)
    - role (enum: admin, account_owner, analyst, viewer)
    - status (enum: active, inactive, pending, suspended)
    - phone (text)
    - company (text)
    - department (text)
    - timezone (text)
    - language (text)
    - created_at, updated_at, last_login (timestamptz)
  
  ### Audit & Logging
  - `audit_logs` - Complete audit trail for compliance
    - id (uuid, primary key)
    - user_id (uuid, references profiles)
    - action (text) - Action performed
    - target_type (text) - Type of resource affected
    - target_id (text) - ID of affected resource
    - details (jsonb) - Additional context
    - ip_address (inet) - Source IP
    - user_agent (text) - Browser/client info
    - created_at (timestamptz)

  ### Business Intelligence
  - `dashboards` - Custom dashboard configurations
  - `kpis` - Key performance indicators
  - `trends` - Trending hashtags and analytics
  - `alerts` - Alert configurations
  - `notifications` - User notifications

  ### Integration & Data
  - `integrations` - Connected platforms (TikTok, Shopee, etc.)
  - `data_uploads` - User uploaded data files
  - `charts` - Saved chart configurations

  ### Content & Reports
  - `content_templates` - Content generation templates
  - `scheduled_content` - Scheduled social media posts
  - `reports` - Report configurations
  - `scheduled_reports` - Automated report delivery
  - `report_history` - Generated report history

  ### Automation
  - `automation_workflows` - Workflow configurations
  - `workflow_runs` - Execution history

  ## 2. Security
  
  - Row Level Security (RLS) enabled on ALL tables
  - Policies enforce role-based access control
  - Audit logging for all sensitive operations
  - Secure defaults with explicit grants

  ## 3. Important Notes
  
  - All tables use UUID primary keys for security
  - Timestamps use timestamptz for timezone awareness
  - JSONB used for flexible schema extensions
  - Indexes added for performance on key lookups
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'account_owner', 'analyst', 'viewer');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'pending', 'suspended');
CREATE TYPE integration_status AS ENUM ('connected', 'error', 'syncing', 'pending');
CREATE TYPE workflow_status AS ENUM ('active', 'paused', 'error');
CREATE TYPE report_status AS ENUM ('draft', 'scheduled', 'completed', 'error');

-- =====================================================================
-- PROFILES TABLE (Extended user information)
-- =====================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'viewer',
  status user_status NOT NULL DEFAULT 'pending',
  phone TEXT,
  company TEXT,
  department TEXT,
  timezone TEXT DEFAULT 'UTC',
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins and account owners can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'account_owner')
    )
  );

CREATE POLICY "Admins and account owners can manage users"
  ON profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'account_owner')
    )
  );

-- =====================================================================
-- AUDIT LOGS TABLE (Compliance and security tracking)
-- =====================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for audit logs
CREATE POLICY "Admins and account owners can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'account_owner')
    )
  );

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- =====================================================================
-- DASHBOARDS TABLE (Custom dashboard layouts)
-- =====================================================================
CREATE TABLE IF NOT EXISTS dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  layout JSONB NOT NULL DEFAULT '[]',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own dashboards"
  ON dashboards FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================================
-- KPIS TABLE (Key Performance Indicators)
-- =====================================================================
CREATE TABLE IF NOT EXISTS kpis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  value NUMERIC NOT NULL,
  previous_value NUMERIC,
  change_percentage NUMERIC,
  unit TEXT,
  category TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view KPIs"
  ON kpis FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================================
-- TRENDS TABLE (Trending hashtags and analytics)
-- =====================================================================
CREATE TABLE IF NOT EXISTS trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hashtag TEXT NOT NULL UNIQUE,
  rank INTEGER,
  volume TEXT,
  growth TEXT,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  price_range TEXT,
  engagement TEXT,
  velocity TEXT,
  platforms TEXT[] DEFAULT ARRAY[]::TEXT[],
  peak_hours TEXT,
  demographics TEXT,
  competition TEXT CHECK (competition IN ('Low', 'Medium', 'High')),
  category TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE trends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view trends"
  ON trends FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_trends_hashtag ON trends(hashtag);
CREATE INDEX IF NOT EXISTS idx_trends_rank ON trends(rank);
CREATE INDEX IF NOT EXISTS idx_trends_category ON trends(category);

-- =====================================================================
-- INTEGRATIONS TABLE (Connected platforms)
-- =====================================================================
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  status integration_status DEFAULT 'pending',
  credentials JSONB DEFAULT '{}',
  config JSONB DEFAULT '{}',
  last_sync TIMESTAMPTZ,
  sync_frequency TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own integrations"
  ON integrations FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all integrations"
  ON integrations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- =====================================================================
-- DATA UPLOADS TABLE (User uploaded data files)
-- =====================================================================
CREATE TABLE IF NOT EXISTS data_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  status TEXT DEFAULT 'processing',
  rows_count INTEGER,
  columns JSONB DEFAULT '[]',
  preview_data JSONB DEFAULT '[]',
  insights JSONB DEFAULT '[]',
  storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

ALTER TABLE data_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own data uploads"
  ON data_uploads FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================================
-- CHARTS TABLE (Saved chart configurations)
-- =====================================================================
CREATE TABLE IF NOT EXISTS charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  data_source_id UUID REFERENCES data_uploads(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE charts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own charts"
  ON charts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================================
-- ALERTS TABLE (Alert configurations)
-- =====================================================================
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  conditions JSONB NOT NULL DEFAULT '{}',
  channels TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  last_triggered TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own alerts"
  ON alerts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================================
-- NOTIFICATIONS TABLE (User notifications)
-- =====================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notifications"
  ON notifications FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- =====================================================================
-- CONTENT TEMPLATES TABLE (Content generation templates)
-- =====================================================================
CREATE TABLE IF NOT EXISTS content_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tone TEXT,
  platform TEXT,
  template TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own content templates"
  ON content_templates FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================================
-- SCHEDULED CONTENT TABLE (Scheduled social media posts)
-- =====================================================================
CREATE TABLE IF NOT EXISTS scheduled_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  content TEXT NOT NULL,
  media_urls TEXT[] DEFAULT ARRAY[]::TEXT[],
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending',
  posted_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE scheduled_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own scheduled content"
  ON scheduled_content FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================================
-- REPORTS TABLE (Report configurations)
-- =====================================================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  template TEXT NOT NULL,
  sections JSONB DEFAULT '[]',
  filters JSONB DEFAULT '{}',
  format TEXT DEFAULT 'pdf',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own reports"
  ON reports FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================================
-- SCHEDULED REPORTS TABLE (Automated report delivery)
-- =====================================================================
CREATE TABLE IF NOT EXISTS scheduled_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  frequency TEXT NOT NULL,
  recipients TEXT[] DEFAULT ARRAY[]::TEXT[],
  next_run TIMESTAMPTZ NOT NULL,
  last_run TIMESTAMPTZ,
  status workflow_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE scheduled_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own scheduled reports"
  ON scheduled_reports FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================================
-- REPORT HISTORY TABLE (Generated report history)
-- =====================================================================
CREATE TABLE IF NOT EXISTS report_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  format TEXT NOT NULL,
  file_size BIGINT,
  storage_path TEXT,
  status report_status DEFAULT 'completed',
  downloads_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

ALTER TABLE report_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own report history"
  ON report_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================================
-- AUTOMATION WORKFLOWS TABLE (Workflow configurations)
-- =====================================================================
CREATE TABLE IF NOT EXISTS automation_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  triggers JSONB NOT NULL DEFAULT '[]',
  actions JSONB NOT NULL DEFAULT '[]',
  status workflow_status DEFAULT 'active',
  last_run TIMESTAMPTZ,
  next_run TIMESTAMPTZ,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE automation_workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own workflows"
  ON automation_workflows FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =====================================================================
-- WORKFLOW RUNS TABLE (Execution history)
-- =====================================================================
CREATE TABLE IF NOT EXISTS workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID REFERENCES automation_workflows(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  result JSONB DEFAULT '{}',
  error_message TEXT,
  duration_ms INTEGER,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workflow runs"
  ON workflow_runs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM automation_workflows
      WHERE id = workflow_runs.workflow_id
      AND user_id = auth.uid()
    )
  );

-- =====================================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboards_updated_at BEFORE UPDATE ON dashboards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kpis_updated_at BEFORE UPDATE ON kpis
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trends_updated_at BEFORE UPDATE ON trends
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_charts_updated_at BEFORE UPDATE ON charts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_templates_updated_at BEFORE UPDATE ON content_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_content_updated_at BEFORE UPDATE ON scheduled_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_reports_updated_at BEFORE UPDATE ON scheduled_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_workflows_updated_at BEFORE UPDATE ON automation_workflows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
