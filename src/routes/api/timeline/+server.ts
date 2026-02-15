import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseFetch } from '$lib/server/supabase';

export const GET: RequestHandler = async ({ url }) => {
	const offset = parseInt(url.searchParams.get('offset') || '0');
	const limit = parseInt(url.searchParams.get('limit') || '50');
	const agentName = url.searchParams.get('agent_name');

	try {
		let endpoint = `/rest/v1/agent_status_history?select=*&order=started_at.desc&offset=${offset}&limit=${limit}&status=neq.idle`;

		if (agentName && agentName !== 'all') {
			endpoint += `&agent_id=ilike.${encodeURIComponent(agentName)}`;
		}

		const response = await supabaseFetch(endpoint, {
			headers: {
				Prefer: 'count=exact'
			}
		});

		const raw = await response.json();
		const activities = raw.map((a: Record<string, unknown>) => ({
			...a,
			agent_name: a.agent_name ?? a.agent_id
		}));
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
