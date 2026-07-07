const supabaseUrl = 'https://iyggxbxvjhsnhszfpijv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5Z2d4Ynh2amhzbmhzemZwaWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzNTM5ODIsImV4cCI6MjA5ODkyOTk4Mn0.54nO2KVzo9me_X8EvnMpv8oDyxRAwa7l8lfR7S4Ka7A';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Make supabase client available globally
window.supabaseClient = supabase;
