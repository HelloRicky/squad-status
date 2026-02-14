import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
// Hardcoded for now - using MC Supabase credentials
const SUPABASE_URL = 'https://eetgrdpfxvlefcvshvjx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_tjVMDRXJaVZ2eScQe6oR_Q_2hdK1BLS';

export const GET: RequestHandler = async ({ url }) => {
	const offset = parseInt(url.searchParams.get('offset') || '0');
	const limit = parseInt(url.searchParams.get('limit') || '50');
	const agentName = url.searchParams.get('agent_name');

	try {
		let query = `${SUPABASE_URL}/rest/v1/agent_status_history?select=*&order=started_at.desc&offset=${offset}&limit=${limit}`;
		
		if (agentName && agentName !== 'all') {
			query += `&agent_name=eq.${encodeURIComponent(agentName)}`;
		}

		const response = await fetch(query, {
			headers: {
				apikey: SUPABASE_ANON_KEY,
				Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache',
				Prefer: 'count=exact'
			}
		});

		if (!response.ok) {
			throw new Error(`Supabase error: ${response.status} ${response.statusText}`);
		}

		const activities = await response.json();
		const contentRange = response.headers.get('content-range');
		const hasMore = contentRange ? offset + limit < parseInt(contentRange.split('/')[1]) : false;

		return json({
			activities,
			hasMore
		});
	} catch (error) {
		console.error('Error fetching timeline:', error);
		return json({ error: 'Failed to fetch timeline data' }, { status: 500 });
	}
};
