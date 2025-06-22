-- Create the notes table for the weekNotes application
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  content TEXT NOT NULL,
  day TEXT,
  month TEXT,
  year TEXT,
  iscomplete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on notes" ON notes
  FOR ALL USING (true);

-- Create an index for better performance when filtering by date
CREATE INDEX idx_notes_date ON notes(day, month, year);

-- Create an index for created_at for ordering
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);

-- Optional: Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_notes_updated_at 
    BEFORE UPDATE ON notes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO notes (title, content, day, month, year) VALUES
  ('Sample Note 1', 'This is a sample note for testing', '15', '11', '2024'),
  ('Sample Note 2', 'Another sample note for demonstration', '16', '11', '2024'),
  ('Sample Note 3', 'Third sample note to show the functionality', '17', '11', '2024'); 