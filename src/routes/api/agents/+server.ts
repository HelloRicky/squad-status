import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseFetch } from '$lib/server/supabase';

export const GET: RequestHandler = async () => {
	try {
		const response = await supabaseFetch('/rest/v1/agent_status?select=*&order=agent_name.asc');
		const agents = await response.json();
		return json(agents);
	} catch (error) {
		console.error('Error fetching agents:', error);
		return json({ error: 'Failed to fetch agent status' }, { status: 500 });
	}
};
