-- Real Estate CRM Database Schema
-- For Neon PostgreSQL

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  address VARCHAR(500) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20),
  property_type VARCHAR(100), -- Single Family, Multi-Family, Commercial, Land, etc.
  bedrooms INTEGER,
  bathrooms DECIMAL(3,1),
  square_feet INTEGER,
  lot_size DECIMAL(10,2),
  year_built INTEGER,
  asking_price DECIMAL(15,2),
  estimated_value DECIMAL(15,2),
  status VARCHAR(50) DEFAULT 'prospect', -- prospect, under_contract, closed, lost
  description TEXT,
  notes TEXT,
  mls_number VARCHAR(100),
  images JSONB, -- Array of image URLs
  amenities JSONB, -- Array of amenities
  google_drive_folder_id VARCHAR(255), -- Link to Google Drive folder
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Deals/Transactions table
CREATE TABLE IF NOT EXISTS deals (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
  deal_name VARCHAR(500) NOT NULL,
  deal_type VARCHAR(100), -- Acquisition, Disposition, Lease, etc.
  stage VARCHAR(100) DEFAULT 'lead', -- lead, qualified, under_contract, due_diligence, closing, closed, dead
  probability INTEGER DEFAULT 0, -- 0-100%
  expected_close_date DATE,
  actual_close_date DATE,
  purchase_price DECIMAL(15,2),
  offer_price DECIMAL(15,2),
  estimated_value DECIMAL(15,2),
  down_payment DECIMAL(15,2),
  financing_type VARCHAR(100), -- Cash, Conventional, FHA, Hard Money, etc.
  estimated_repairs DECIMAL(15,2),
  estimated_arv DECIMAL(15,2), -- After Repair Value
  cap_rate DECIMAL(5,2),
  cash_on_cash_return DECIMAL(5,2),
  roi DECIMAL(5,2),
  contact_id INTEGER REFERENCES contacts(id) ON DELETE SET NULL,
  assigned_to INTEGER REFERENCES users(id),
  priority VARCHAR(50) DEFAULT 'medium', -- low, medium, high, urgent
  tags JSONB, -- Array of tags
  notes TEXT,
  google_calendar_event_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP
);

-- Contacts/Clients table
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  contact_type VARCHAR(100), -- Buyer, Seller, Agent, Contractor, Lender, Attorney, etc.
  address VARCHAR(500),
  city VARCHAR(255),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  notes TEXT,
  tags JSONB,
  social_media JSONB, -- LinkedIn, Facebook, etc.
  preferred_contact_method VARCHAR(50),
  rating INTEGER, -- 1-5 stars
  google_contact_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  deal_id INTEGER REFERENCES deals(id) ON DELETE CASCADE,
  contact_id INTEGER REFERENCES contacts(id) ON DELETE CASCADE,
  document_name VARCHAR(500) NOT NULL,
  document_type VARCHAR(100), -- Contract, Inspection, Appraisal, Title, Photo, etc.
  file_url TEXT,
  google_drive_file_id VARCHAR(255),
  file_size BIGINT,
  mime_type VARCHAR(100),
  uploaded_by INTEGER REFERENCES users(id),
  tags JSONB,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks/Activities table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  task_type VARCHAR(100), -- Call, Email, Meeting, Showing, Inspection, etc.
  status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  priority VARCHAR(50) DEFAULT 'medium',
  due_date TIMESTAMP,
  completed_at TIMESTAMP,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  deal_id INTEGER REFERENCES deals(id) ON DELETE CASCADE,
  contact_id INTEGER REFERENCES contacts(id) ON DELETE CASCADE,
  assigned_to INTEGER REFERENCES users(id),
  created_by INTEGER REFERENCES users(id),
  google_calendar_event_id VARCHAR(255),
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Financial records table
CREATE TABLE IF NOT EXISTS financial_records (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  deal_id INTEGER REFERENCES deals(id) ON DELETE CASCADE,
  record_type VARCHAR(100), -- Income, Expense, Investment, Return, etc.
  category VARCHAR(100), -- Rent, Mortgage, Repairs, Taxes, Insurance, etc.
  amount DECIMAL(15,2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  payment_method VARCHAR(100),
  receipt_url TEXT,
  google_drive_file_id VARCHAR(255),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes/Comments table
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  deal_id INTEGER REFERENCES deals(id) ON DELETE CASCADE,
  contact_id INTEGER REFERENCES contacts(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  note_type VARCHAR(50) DEFAULT 'general', -- general, call_log, email, meeting, etc.
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  team_name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team members (junction table)
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(100), -- Admin, Member, Viewer
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, user_id)
);

-- Deal team assignments
CREATE TABLE IF NOT EXISTS deal_team_assignments (
  id SERIAL PRIMARY KEY,
  deal_id INTEGER REFERENCES deals(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(100), -- Lead, Analyst, Closer, Support
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(deal_id, user_id)
);

-- Email tracking table
CREATE TABLE IF NOT EXISTS emails (
  id SERIAL PRIMARY KEY,
  gmail_message_id VARCHAR(255) UNIQUE,
  contact_id INTEGER REFERENCES contacts(id) ON DELETE SET NULL,
  deal_id INTEGER REFERENCES deals(id) ON DELETE SET NULL,
  subject VARCHAR(500),
  from_address VARCHAR(255),
  to_address VARCHAR(255),
  body TEXT,
  sent_at TIMESTAMP,
  thread_id VARCHAR(255),
  labels JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id SERIAL PRIMARY KEY,
  google_calendar_event_id VARCHAR(255) UNIQUE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  location VARCHAR(500),
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  deal_id INTEGER REFERENCES deals(id) ON DELETE CASCADE,
  contact_id INTEGER REFERENCES contacts(id) ON DELETE CASCADE,
  attendees JSONB,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_city_state ON properties(city, state);
CREATE INDEX IF NOT EXISTS idx_properties_created_by ON properties(created_by);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(stage);
CREATE INDEX IF NOT EXISTS idx_deals_property_id ON deals(property_id);
CREATE INDEX IF NOT EXISTS idx_deals_contact_id ON deals(contact_id);
CREATE INDEX IF NOT EXISTS idx_deals_assigned_to ON deals(assigned_to);
CREATE INDEX IF NOT EXISTS idx_deals_expected_close_date ON deals(expected_close_date);
CREATE INDEX IF NOT EXISTS idx_contacts_type ON contacts(contact_type);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_documents_property_id ON documents(property_id);
CREATE INDEX IF NOT EXISTS idx_documents_deal_id ON documents(deal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_financial_records_property_id ON financial_records(property_id);
CREATE INDEX IF NOT EXISTS idx_financial_records_deal_id ON financial_records(deal_id);
CREATE INDEX IF NOT EXISTS idx_financial_records_date ON financial_records(date);

-- Update triggers for updated_at columns
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
