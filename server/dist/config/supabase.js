"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl) {
    throw new Error("SUPABASE_URL environment variable is missing.");
}
if (!supabaseKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY environment variable is missing.");
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
