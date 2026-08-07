import { createClient } from "@supabase/supabase-js";

console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log(
  "SERVICE ROLE EXISTS:",
  !!process.env.SUPABASE_SERVICE_ROLE_KEY
);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is missing");
}

if (!supabaseKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);