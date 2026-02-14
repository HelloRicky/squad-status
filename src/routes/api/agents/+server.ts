import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { SUPABASE_URL, SUPABASE_SERVICE_KEY } from '$env/static/private';

export const GET: RequestHandler = async () => {
	try {
		const response = await fetch(
			`${SUPABASE_URL}/rest/v1/agent_status?select=*&order=agent_name.asc`,
			{
				headers: {
					apikey: SUPABASE_SERVICE_KEY,
					Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
					'Content-Type': 'application/json'
				}
			}
		);

		if (!response.ok) {
			throw new Error(`Supabase error: ${response.status} ${response.statusText}`);
		}

		const agents = await response.json();
		return json(agents);
	} catch (error) {
		console.error('Error fetching agents:', error);
		return json({ error: 'Failed to fetch agent status' }, { status: 500 });
	}
};
