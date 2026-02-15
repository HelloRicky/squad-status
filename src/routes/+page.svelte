<script lang="ts">
	import { onMount } from 'svelte';
	import type { Agent, StatusFilter } from '$lib/types';
	import Header from '$lib/components/Header.svelte';
	import StatusChips from '$lib/components/StatusChips.svelte';
	import AgentGrid from '$lib/components/AgentGrid.svelte';
	import Timeline from '$lib/components/Timeline.svelte';

	let agents: Agent[] = $state([]);
	let loading = $state(true);
	let statusFilter: StatusFilter = $state('all');
	let timelineOpen = $state(false);
	let refreshCountdown = $state(30);
	let refreshKey = $state(0);

	let refreshInterval: ReturnType<typeof setInterval>;
	let countdownInterval: ReturnType<typeof setInterval>;

	onMount(() => {
		fetchAgents();
		startAutoRefresh();

		return () => {
			if (refreshInterval) clearInterval(refreshInterval);
			if (countdownInterval) clearInterval(countdownInterval);
		};
	});

	async function fetchAgents() {
		try {
			const response = await fetch('/api/agents');
			if (response.ok) {
				agents = await response.json();
				refreshKey++;
			}
		} catch (error) {
			console.error('Failed to fetch agents:', error);
		} finally {
			loading = false;
		}
	}

	function startAutoRefresh() {
		refreshCountdown = 30;

		if (refreshInterval) clearInterval(refreshInterval);
		if (countdownInterval) clearInterval(countdownInterval);

		refreshInterval = setInterval(() => {
			fetchAgents();
			refreshCountdown = 30;
		}, 30000);

		countdownInterval = setInterval(() => {
			refreshCountdown = Math.max(0, refreshCountdown - 1);
		}, 1000);
	}

	function handleManualRefresh() {
		fetchAgents();
		startAutoRefresh();
	}

	function handleFilterChange(filter: StatusFilter) {
		statusFilter = filter;
	}

	function toggleTimeline() {
		timelineOpen = !timelineOpen;
	}
</script>

<div class="app" class:timeline-closed={!timelineOpen}>
	<div class="main">
		<Header
			{refreshCountdown}
			onRefresh={handleManualRefresh}
			onToggleTimeline={toggleTimeline}
			{timelineOpen}
		/>

		<StatusChips
			{agents}
			currentFilter={statusFilter}
			onFilterChange={handleFilterChange}
		/>

		{#if loading}
			<div class="loading-container">
				<div class="spinner"></div>
				<p>Loading squad status...</p>
			</div>
		{:else}
			<AgentGrid
				{agents}
				viewMode="card"
				sortBy="status"
				searchQuery=""
				{statusFilter}
			/>
		{/if}
	</div>

	<Timeline open={timelineOpen} onClose={toggleTimeline} {refreshKey} />
</div>

<style>
	.app {
		display: grid;
		grid-template-columns: 1fr 380px;
		height: 100vh;
		height: 100dvh;  /* overrides on supporting browsers */
		position: relative;
		z-index: 1;
	}

	.app.timeline-closed {
		grid-template-columns: 1fr;
	}

	.main {
		padding: 32px 40px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 60px 20px;
		animation: fadeInUp 0.4s ease;
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid var(--border-default);
		border-top-color: var(--accent-blue);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		margin-bottom: 16px;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.loading-container p {
		color: var(--text-secondary);
		font-size: 14px;
	}

	@media (max-width: 900px) {
		.app {
			grid-template-columns: 1fr;
		}

		.main {
			padding: 24px 20px;
		}
	}

	@media (max-width: 640px) {
		.main {
			padding: 16px;
		}
	}
</style>
