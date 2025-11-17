-- Sample data for Real Estate CRM
-- Run this AFTER realestate-schema.sql

-- Insert sample user (you'll need to update this with your actual GitHub user ID after first login)
-- This is just a placeholder - the real user will be created on first GitHub OAuth login

-- Insert sample properties
INSERT INTO properties (address, city, state, zip_code, property_type, asking_price, square_footage, bedrooms, bathrooms, year_built, status, description, created_at, updated_at)
VALUES
  ('123 Sunset Plaza Drive', 'Los Angeles', 'CA', '90069', 'Commercial', 2500000.00, 15000, NULL, NULL, 2010, 'active', 'Prime commercial property in heart of LA', NOW(), NOW()),
  ('456 Marina Bay Complex', 'San Francisco', 'CA', '94111', 'Mixed-Use', 4200000.00, 25000, NULL, NULL, 2015, 'active', 'Waterfront mixed-use development', NOW(), NOW()),
  ('789 Downtown Office Tower', 'Seattle', 'WA', '98101', 'Commercial', 6800000.00, 50000, NULL, NULL, 2018, 'under_contract', 'Class A office space with modern amenities', NOW(), NOW()),
  ('321 Residential Heights', 'Austin', 'TX', '78701', 'Residential', 1200000.00, 8000, 12, 8, 2019, 'active', 'Multi-family residential building', NOW(), NOW()),
  ('654 Industrial Center', 'Phoenix', 'AZ', '85001', 'Industrial', 3100000.00, 75000, NULL, NULL, 2012, 'active', 'Warehouse and distribution center', NOW(), NOW());

-- Insert sample contacts
INSERT INTO contacts (first_name, last_name, email, phone, company, contact_type, address, city, state, notes, created_at, updated_at)
VALUES
  ('John', 'Doe', 'john.doe@example.com', '555-0101', 'Sunset Realty', 'seller', '123 Main St', 'Los Angeles', 'CA', 'Owner of Sunset Plaza property', NOW(), NOW()),
  ('Sarah', 'Johnson', 'sarah.j@investment.com', '555-0102', 'Bay Area Investments', 'buyer', '456 Market St', 'San Francisco', 'CA', 'Interested in commercial properties', NOW(), NOW()),
  ('Michael', 'Chen', 'mchen@legal.com', '555-0103', 'Chen & Associates', 'attorney', '789 Legal Plaza', 'Seattle', 'WA', 'Real estate attorney', NOW(), NOW()),
  ('Lisa', 'Wang', 'lwang@appraisal.com', '555-0104', 'Premier Appraisals', 'appraiser', '321 Business Ave', 'Austin', 'TX', 'Licensed property appraiser', NOW(), NOW()),
  ('David', 'Brown', 'dbrown@inspect.com', '555-0105', 'Brown Inspections', 'inspector', '654 Industrial Pkwy', 'Phoenix', 'AZ', 'Property inspector', NOW(), NOW());

-- Insert sample deals (without created_by since we don't have real user IDs yet)
-- Note: You may need to update these with actual user IDs after first login
INSERT INTO deals (property_id, deal_name, stage, purchase_price, estimated_arv, down_payment_percent, interest_rate, loan_term_years, cap_rate, roi, noi, expected_closing_date, contact_id, notes, created_at, updated_at)
VALUES
  (1, 'Sunset Plaza Acquisition', 'under_contract', 2500000.00, 2800000.00, 25.0, 6.5, 30, 6.8, 18.5, 170000.00, NOW() + INTERVAL '45 days', 1, 'High priority commercial acquisition', NOW(), NOW()),
  (2, 'Marina Bay Development', 'due_diligence', 4200000.00, 5000000.00, 30.0, 6.2, 25, 7.2, 22.3, 302400.00, NOW() + INTERVAL '60 days', 2, 'Mixed-use development opportunity', NOW(), NOW()),
  (3, 'Downtown Office Tower', 'closing', 6800000.00, 7500000.00, 35.0, 5.9, 30, 6.5, 15.2, 442000.00, NOW() + INTERVAL '15 days', 3, 'Premium office space', NOW(), NOW()),
  (4, 'Residential Heights Project', 'lead', 1200000.00, 1400000.00, 20.0, 6.8, 30, 5.5, 12.8, 66000.00, NOW() + INTERVAL '90 days', 4, 'Multi-family residential', NOW(), NOW()),
  (5, 'Industrial Center Deal', 'qualified', 3100000.00, 3500000.00, 25.0, 6.3, 25, 7.8, 19.7, 241800.00, NOW() + INTERVAL '75 days', 5, 'Warehouse and distribution', NOW(), NOW());

-- Insert sample tasks
INSERT INTO tasks (title, description, deal_id, task_type, status, priority, due_date, created_at, updated_at)
VALUES
  ('Property Appraisal', 'Schedule and complete property appraisal for Sunset Plaza', 1, 'appraisal', 'completed', 'high', NOW() - INTERVAL '5 days', NOW(), NOW()),
  ('Environmental Assessment', 'Phase I Environmental Site Assessment for Marina Bay', 2, 'inspection', 'in_progress', 'high', NOW() + INTERVAL '10 days', NOW(), NOW()),
  ('Title Search', 'Complete title search and verification for Downtown Tower', 3, 'legal', 'completed', 'high', NOW() - INTERVAL '15 days', NOW(), NOW()),
  ('Financial Analysis', 'Complete financial modeling for Residential Heights', 4, 'financial', 'pending', 'medium', NOW() + INTERVAL '7 days', NOW(), NOW()),
  ('Property Inspection', 'Comprehensive property inspection for Industrial Center', 5, 'inspection', 'in_progress', 'medium', NOW() + INTERVAL '14 days', NOW(), NOW()),
  ('Loan Approval', 'Submit and follow up on loan application for Sunset Plaza', 1, 'financing', 'in_progress', 'high', NOW() + INTERVAL '20 days', NOW(), NOW()),
  ('Due Diligence Review', 'Complete all due diligence items for Downtown Tower', 3, 'legal', 'in_progress', 'high', NOW() + INTERVAL '5 days', NOW(), NOW());

-- Insert sample notes
INSERT INTO notes (deal_id, content, note_type, created_at, updated_at)
VALUES
  (1, 'Initial walkthrough completed. Property in excellent condition.', 'general', NOW() - INTERVAL '30 days', NOW()),
  (1, 'Negotiated 2% reduction in asking price.', 'negotiation', NOW() - INTERVAL '20 days', NOW()),
  (2, 'Seller motivated due to portfolio rebalancing.', 'general', NOW() - INTERVAL '25 days', NOW()),
  (3, 'All inspection items cleared. Ready for closing.', 'inspection', NOW() - INTERVAL '10 days', NOW()),
  (5, 'Received updated financial statements from seller.', 'financial', NOW() - INTERVAL '5 days', NOW());

-- Success message
SELECT 'Sample data inserted successfully!' as status,
       (SELECT COUNT(*) FROM properties) as properties_count,
       (SELECT COUNT(*) FROM contacts) as contacts_count,
       (SELECT COUNT(*) FROM deals) as deals_count,
       (SELECT COUNT(*) FROM tasks) as tasks_count,
       (SELECT COUNT(*) FROM notes) as notes_count;
