import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	// In production, missing env vars should be fixed in the hosting
	// environment (e.g. Vercel). However, throwing here causes a
	// hard client-side crash on any page that imports `supabase`.
	// Instead, log a clear error and fall back to a dummy client so
	// the UI can render and show its own error states.
	/* eslint-disable no-console */
	if (typeof window !== "undefined") {
		console.error(
			"Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. Frontend will use a dummy client and most auth features will not work."
		);
	} else {
		console.warn(
			"Supabase env vars missing at build/runtime. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment for full functionality."
		);
	}
}

// Use real values when provided; otherwise fall back to obvious dummy
// placeholders so the client can be constructed without throwing.
const effectiveUrl = supabaseUrl || "https://dummy.supabase.co";
const effectiveAnonKey = supabaseAnonKey || "public-anon-key";

export const supabase = createClient(effectiveUrl, effectiveAnonKey);
