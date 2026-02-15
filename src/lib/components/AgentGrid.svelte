<script lang="ts">
	import type { Agent, ViewMode, SortBy, StatusFilter } from '$lib/types';
	import AgentCard from './AgentCard.svelte';

	interface Props {
		agents: Agent[];
		viewMode: ViewMode;
		sortBy: SortBy;
		searchQuery: string;
		statusFilter: StatusFilter;
	}

	let { agents, viewMode, sortBy, searchQuery, statusFilter }: Props = $props();

	let filteredAgents = $derived.by(() => {
		let filtered = agents;

		// Apply status filter
		if (statusFilter !== 'all') {
			filtered = filtered.filter((a) => a.status === statusFilter);
		}

		// Apply search filter
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(a) =>
					a.agent_name.toLowerCase().includes(query) ||
					(a.current_task && a.current_task.toLowerCase().includes(query))
			);
		}

		// Apply sorting
		const sortedAgents = [...filtered];
		if (sortBy === 'status') {
			const statusOrder = { working: 0, idle: 1, error: 2 };
			sortedAgents.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
		} else if (sortBy === 'name') {
			sortedAgents.sort((a, b) => a.agent_name.localeCompare(b.agent_name));
		} else if (sortBy === 'lastActive') {
			sortedAgents.sort(
				(a, b) =>
					new Date(b.last_active_at).getTime() - new Date(a.last_active_at).getTime()
			);
		}

		return sortedAgents;
	});

	// Separate leader (Ducki) from team
	let leader = $derived(filteredAgents.find((a) => a.agent_name === 'Ducki (Main)'));
	let team = $derived(filteredAgents.filter((a) => a.agent_name !== 'Ducki (Main)'));
</script>

<div>
	{#if filteredAgents.length === 0}
		<div>
			<p>No agents match your search criteria</p>
		</div>
	{:else}
		<!-- Org Chart Layout (Card view only) -->
		{#if viewMode === 'card'}
			<div>
				<!-- Leader Card -->
				{#if leader}
					<div>
						<div>
							<AgentCard agent={leader} isLeader={true} {viewMode} />
						</div>
					</div>
				{/if}

				<!-- Team Grid -->
				{#if team.length > 0}
					<div>
						<div>
							{#each team as agent (agent.agent_id)}
								<div>
									<AgentCard {agent} isLeader={false} {viewMode} />
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<!-- Compact/Table View - Simple List -->
			<div>
				{#each filteredAgents as agent (agent.agent_id)}
					<div>
						<AgentCard {agent} isLeader={agent.agent_name === 'Ducki (Main)'} {viewMode} />
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>
