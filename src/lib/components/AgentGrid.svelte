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

<div class="space-y-4" class:view-compact={viewMode === 'compact'} class:view-table={viewMode === 'table'}>
	{#if filteredAgents.length === 0}
		<div class="text-center py-16">
			<p class="text-slate-400">No agents match your search criteria</p>
		</div>
	{:else}
		<!-- Org Chart Layout (Card view only) -->
		{#if viewMode === 'card'}
			<div class="org-chart-container">
				<!-- Leader Card -->
				{#if leader}
					<div class="leader-card flex justify-center">
						<div class="w-full max-w-md">
							<AgentCard agent={leader} isLeader={true} {viewMode} />
						</div>
					</div>
				{/if}

				<!-- Team Grid -->
				{#if team.length > 0}
					<div class="team-container">
						<div class="connector-lines"></div>
						<div class="team-grid">
							{#each team as agent (agent.agent_id)}
								<div class="team-member">
									<AgentCard {agent} isLeader={false} {viewMode} />
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<!-- Compact/Table View - Simple List -->
			<div class="space-y-2">
				{#each filteredAgents as agent (agent.agent_id)}
					<AgentCard {agent} isLeader={agent.agent_name === 'Ducki (Main)'} {viewMode} />
				{/each}
			</div>
		{/if}
	{/if}
</div>

<style>
	.org-chart-container {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3rem;
	}

	.leader-card {
		position: relative;
		width: 100%;
		z-index: 10;
	}

	.team-container {
		position: relative;
		width: 100%;
	}

	/* Connector lines - only show on desktop */
	@media (min-width: 1024px) {
		.connector-lines {
			position: absolute;
			top: -3rem;
			left: 50%;
			transform: translateX(-50%);
			width: 100%;
			max-width: 900px;
			height: 3rem;
			pointer-events: none;
			z-index: 1;
		}

		/* Vertical line from leader */
		.connector-lines::before {
			content: '';
			position: absolute;
			top: 0;
			left: 50%;
			width: 2px;
			height: 1.5rem;
			background: linear-gradient(to bottom, #64748b, #475569);
			transform: translateX(-50%);
		}

		/* Horizontal line connecting team members */
		.connector-lines::after {
			content: '';
			position: absolute;
			top: 1.5rem;
			left: 0;
			width: 100%;
			height: 2px;
			background: linear-gradient(
				to right,
				transparent 5%,
				#475569 15%,
				#475569 85%,
				transparent 95%
			);
		}

		/* Individual vertical lines to each team member */
		:global(.team-member::before) {
			content: '';
			position: absolute;
			top: -1.5rem;
			left: 50%;
			width: 2px;
			height: 1.5rem;
			background: linear-gradient(to bottom, #475569, #334155);
			transform: translateX(-50%);
		}
	}

	/* Team grid layout */
	.team-grid {
		position: relative;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		max-width: 900px;
		margin: 0 auto;
		justify-content: center;
	}

	@media (min-width: 1024px) {
		.team-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.team-member {
		position: relative;
	}

	/* Compact View Styles */
	:global(.view-compact .team-grid) {
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
		gap: 0.75rem !important;
	}

	/* Table View Styles */
	:global(.view-table .team-container) {
		display: block !important;
	}

	:global(.view-table .connector-lines) {
		display: none !important;
	}

	:global(.view-table .team-grid) {
		display: flex !important;
		flex-direction: column !important;
		gap: 0.5rem !important;
	}
</style>
