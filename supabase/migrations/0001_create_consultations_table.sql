-- Create consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  response TEXT NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  card_name TEXT,
  card_meaning TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
-- Create index for faster queries
CREATE INDEX idx_consultations_email ON consultations(email);
CREATE INDEX idx_consultations_created_at ON consultations(created_at); 