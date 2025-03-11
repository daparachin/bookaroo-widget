
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCORS } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    // Accessing your environment variables
    const dbUrl = Deno.env.get('SUPABASE_DB_URL');
    
    // Return a sanitized version of the environment variable status
    return new Response(
      JSON.stringify({
        message: "Environment variable status",
        has_db_url: dbUrl ? true : false,
        vars_available: Object.keys(Deno.env.toObject()).length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
