import { env } from '$env/dynamic/private';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';

/**
 * Supabase client configuration for server-side API routes
 *
 * Credentials are loaded from environment variables:
 * - SUPABASE_URL: Your Supabase project URL
 * - SUPABASE_ANON_KEY: Your Supabase anonymous/public key
 *
 * For local dev: Set in .env file
 * For production: Set in Cloudflare Pages dashboard or GitHub Secrets
 */

// Get credentials from environment variables with fallback for local dev
const supabaseUrl = SUPABASE_URL || env.SUPABASE_URL;
const supabaseAnonKey = SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error(
		'Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.'
	);
}

/**
 * Create a Supabase fetch request with proper headers
 */
export async function supabaseFetch(endpoint: string, options: RequestInit = {}) {
	const url = `${supabaseUrl}${endpoint}`;

	const response = await fetch(url, {
		...options,
		headers: {
			apikey: supabaseAnonKey,
			Authorization: `Bearer ${supabaseAnonKey}`,
			'Content-Type': 'application/json',
			'Cache-Control': 'no-cache',
			...options.headers
		}
	});

	if (!response.ok) {
		throw new Error(`Supabase error: ${response.status} ${response.statusText}`);
	}

	return response;
}

export { supabaseUrl, supabaseAnonKey };
