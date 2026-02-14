<script lang="ts">
	import { onMount } from 'svelte';
	import type { Agent, ViewMode, SortBy, StatusFilter } from '$lib/types';
	import Header from '$lib/components/Header.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import StatusChips from '$lib/components/StatusChips.svelte';
	import AgentGrid from '$lib/components/AgentGrid.svelte';
	import Timeline from '$lib/components/Timeline.svelte';

	let agents: Agent[] = $state([]);
	let loading = $state(true);
	let viewMode: ViewMode = $state('card');
	let sortBy: SortBy = $state('status');
	let searchQuery = $state('');
	let statusFilter: StatusFilter = $state('all');
	let timelineOpen = $state(false);
	let refreshCountdown = $state(30);

	let refreshInterval: ReturnType<typeof setInterval>;
	let countdownInterval: ReturnType<typeof setInterval>;

	onMount(() => {
		// Load preferences from localStorage
		if (typeof window !== 'undefined') {
			viewMode = (localStorage.getItem('viewMode') as ViewMode) || 'card';
			sortBy = (localStorage.getItem('sortBy') as SortBy) || 'status';
		}

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

	function handleViewModeChange(mode: ViewMode) {
		viewMode = mode;
		if (typeof window !== 'undefined') {
			localStorage.setItem('viewMode', mode);
		}
	}

	function handleSortChange(sort: SortBy) {
		sortBy = sort;
		if (typeof window !== 'undefined') {
			localStorage.setItem('sortBy', sort);
		}
	}

	function handleSearch(query: string) {
		searchQuery = query;
	}

	function handleFilterChange(filter: StatusFilter) {
		statusFilter = filter;
	}

	function toggleTimeline() {
		timelineOpen = !timelineOpen;
	}
</script>

<div class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen text-white overflow-x-hidden">
	<div class="container mx-auto px-4 py-6 max-w-5xl transition-transform duration-400 ease-out" 
	     class:shifted={timelineOpen}>
		
		<Header 
			{viewMode}
			{sortBy}
			{refreshCountdown}
			onViewModeChange={handleViewModeChange}
			onSortChange={handleSortChange}
			onRefresh={handleManualRefresh}
			onToggleTimeline={toggleTimeline}
			{timelineOpen}
		/>

		<SearchBar value={searchQuery} onChange={handleSearch} />

		<StatusChips 
			{agents}
			currentFilter={statusFilter}
			onFilterChange={handleFilterChange}
		/>

		{#if loading}
			<div class="text-center py-16">
				<div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-purple-500 mb-4"></div>
				<p class="text-slate-400">Loading squad status...</p>
			</div>
		{:else}
			<AgentGrid 
				{agents}
				{viewMode}
				{sortBy}
				{searchQuery}
				{statusFilter}
			/>
		{/if}
	</div>

	<Timeline bind:open={timelineOpen} onClose={toggleTimeline} />
</div>

<style>
	.shifted {
		transform: translateX(-240px);
	}

	@media (max-width: 1024px) {
		.shifted {
			transform: translateX(-120px);
		}
	}

	@media (max-width: 768px) {
		.shifted {
			transform: translateX(0);
			filter: brightness(0.7);
		}
	}
</style>
