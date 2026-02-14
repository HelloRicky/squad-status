import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
// Hardcoded for now - using MC Supabase credentials
const SUPABASE_URL = 'https://eetgrdpfxvlefcvshvjx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_tjVMDRXJaVZ2eScQe6oR_Q_2hdK1BLS';

export const GET: RequestHandler = async () => {
	try {
		console.log('SUPABASE_URL:', SUPABASE_URL);
		console.log('SUPABASE_ANON_KEY (first 20 chars):', SUPABASE_ANON_KEY ? SUPABASE_ANON_KEY.substring(0, 20) + '...' : 'NOT SET');
		console.log('SUPABASE_ANON_KEY length:', SUPABASE_ANON_KEY ? SUPABASE_ANON_KEY.length : 0);
		
		const response = await fetch(
			`${SUPABASE_URL}/rest/v1/agent_status?select=*&order=agent_name.asc`,
			{
				headers: {
					apikey: SUPABASE_ANON_KEY,
					Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
					'Content-Type': 'application/json',
					'Cache-Control': 'no-cache'
				}
			}
		);

		if (!response.ok) {
			console.error('Supabase response:', response.status, response.statusText);
			throw new Error(`Supabase error: ${response.status} ${response.statusText}`);
		}

		const agents = await response.json();
		return json(agents);
	} catch (error) {
		console.error('Error fetching agents:', error);
		return json({ error: 'Failed to fetch agent status' }, { status: 500 });
	}
};
