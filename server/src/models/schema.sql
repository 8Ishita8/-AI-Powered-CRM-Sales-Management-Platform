-- Reference DDL Schema for PostgreSQL Setup
-- Represents Member 1's planned database schema

CREATE TYPE user_role AS ENUM ('admin', 'manager', 'executive');
CREATE TYPE lead_stage AS ENUM ('new_lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost');
CREATE TYPE followup_status AS ENUM ('pending', 'completed', 'missed');
CREATE TYPE email_template_type AS ENUM ('follow_up', 'proposal', 'reminder');
CREATE TYPE email_log_status AS ENUM ('scheduled', 'sent', 'failed');

CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255) NOT NULL,
    source VARCHAR(255),
    stage lead_stage NOT NULL DEFAULT 'new_lead',
    conversion_score INT,
    ai_analysis_summary TEXT,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pipeline_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    from_stage lead_stage NOT NULL,
    to_stage lead_stage NOT NULL,
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS follow_ups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status followup_status NOT NULL DEFAULT 'pending',
    email_reminder_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS call_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    executive_id UUID REFERENCES users(id) ON DELETE SET NULL,
    summary TEXT NOT NULL,
    duration_seconds INT NOT NULL,
    call_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body_html TEXT NOT NULL,
    type email_template_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
    subject VARCHAR(255) NOT NULL,
    body_html TEXT NOT NULL,
    status email_log_status NOT NULL DEFAULT 'scheduled',
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE
);

-- Optimize queries for scoped reads and background queues
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_stage ON leads(stage);
CREATE INDEX idx_follow_ups_sched_pending ON follow_ups(scheduled_time, status) WHERE status = 'pending';
CREATE INDEX idx_email_logs_sched_scheduled ON email_logs(status, scheduled_time) WHERE status = 'scheduled';
