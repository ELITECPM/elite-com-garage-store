const SUPABASE_URL = "https://mokjbshrwitinabzudrt.supabase.co/rest/v1/";
const SUPABASE_KEY = "sb_publishable_EBjXonUcfYLRLQQNw1bV0A_kPaSJ0KN";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

console.log("Elite CPM Garage connected!");
