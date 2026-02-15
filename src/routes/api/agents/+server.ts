import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseFetch } from '$lib/server/supabase';
import type { Agent } from '$lib/types';
import { resolveAgentName } from '$lib/types';

export const GET: RequestHandler = async () => {
	try {
		const response = await supabaseFetch('/rest/v1/agent_status?select=*&order=agent_name.asc');
		const agents: Agent[] = await response.json();

		// Identify idle agents
		const idleAgents = agents.filter((agent) => agent.status === 'idle');

		// If there are idle agents, fetch their last tasks from history
		if (idleAgents.length > 0) {
			const historyResponse = await supabaseFetch(
				'/rest/v1/agent_status_history?status=neq.idle&order=started_at.desc&limit=50'
			);
			const history = await historyResponse.json();

			// Build a map of agent_name -> most recent task
			const lastTaskMap: Record<string, string> = {};
			for (const entry of history) {
				const name = resolveAgentName(entry.agent_name ?? entry.agent_id);
				if (!lastTaskMap[name]) {
					lastTaskMap[name] = entry.task;
				}
			}

			// Enrich idle agents with their last task
			for (const agent of idleAgents) {
				const name = resolveAgentName(agent.agent_name);
				agent.last_task = lastTaskMap[name] || null;
			}
		}

		return json(agents);
	} catch (error) {
		console.error('Error fetching agents:', error);
		return json({ error: 'Failed to fetch agent status' }, { status: 500 });
	}
};
