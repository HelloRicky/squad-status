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

{#if filteredAgents.length === 0}
	<div class="empty-state">
		<p>No agents match your search criteria</p>
	</div>
{:else}
	<!-- Org Chart Layout (Card view only) -->
	{#if viewMode === 'card'}
		<div class="org-chart">
			<!-- Leader Card -->
			{#if leader}
				<div class="leader-wrapper">
					<AgentCard agent={leader} isLeader={true} {viewMode} />
				</div>
			{/if}

			<!-- Connector -->
			{#if leader && team.length > 0}
				<div class="connector"></div>
			{/if}

			<!-- Team Grid -->
			{#if team.length > 0}
				<div class="agents-grid">
					{#each team as agent (agent.agent_id)}
						<AgentCard {agent} isLeader={false} {viewMode} />
					{/each}
				</div>
			{/if}
		</div>
	{:else}
		<!-- Compact/Table View - Simple List -->
		<div class="agents-list">
			{#each filteredAgents as agent (agent.agent_id)}
				<AgentCard {agent} isLeader={agent.agent_name === 'Ducki (Main)'} {viewMode} />
			{/each}
		</div>
	{/if}
{/if}

<style>
	.empty-state {
		text-align: center;
		padding: 60px 20px;
		color: var(--text-tertiary);
		font-style: italic;
		font-size: 14px;
	}

	.org-chart {
		display: flex;
		flex-direction: column;
		flex: 1;  /* stretch to fill .main */
	}

	.leader-wrapper {
		display: flex;
		justify-content: center;
		max-width: 100%;
	}

	.leader-wrapper > :global(*) {
		width: 100%;
		max-width: 600px;
	}

	.connector {
		display: flex;
		justify-content: center;
		padding: 0;
		position: relative;
		height: 24px;
	}

	.connector::before {
		content: '';
		width: 1px;
		height: 100%;
		background: linear-gradient(180deg, var(--accent-blue), var(--border-default));
	}

	.agents-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 10px;
		flex: 1;              /* fill remaining org-chart space */
		align-content: start; /* keep cards pinned to top, not stretched */
	}

	.agents-list {
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex: 1;
	}

	@media (max-width: 900px) {
		.agents-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
