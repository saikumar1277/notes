const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

console.log('Testing Supabase connection...');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testConnection() {
  try {
    console.log('Attempting to connect to Supabase...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('notes')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('Data:', data);
    
    // Test a simple query
    const { data: notes, error: notesError } = await supabase
      .from('notes')
      .select('*')
      .limit(5);
    
    if (notesError) {
      console.error('Query error:', notesError);
      return;
    }
    
    console.log('✅ Query successful!');
    console.log('Notes count:', notes.length);
    console.log('Sample note:', notes[0]);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testConnection(); 