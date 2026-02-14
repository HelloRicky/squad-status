<script lang="ts">
	import { onMount } from 'svelte';
	import type { Activity } from '$lib/types';
	import { agentAvatars, agentTimelineColors } from '$lib/types';
	import { formatDate, formatTime } from '$lib/utils';

	interface Props {
		open: boolean;
		onClose: () => void;
	}

	let { open, onClose }: Props = $props();

	let activities: Activity[] = $state([]);
	let loading = $state(false);
	let hasMore = $state(true);
	let offset = $state(0);
	let filter = $state('all');
	let displayedDates = $state(new Set<string>());

	onMount(() => {
		if (open) {
			loadTimeline();
		}
	});

	$effect(() => {
		if (open && activities.length === 0) {
			loadTimeline();
		}
	});

	async function loadTimeline(append = false) {
		if (loading) return;
		loading = true;

		try {
			const response = await fetch(`/api/timeline?offset=${append ? offset : 0}&limit=50&agent_name=${filter}`);
			if (response.ok) {
				const data = await response.json();
				
				if (append) {
					activities = [...activities, ...data.activities];
					offset += data.activities.length;
				} else {
					activities = data.activities;
					offset = data.activities.length;
					displayedDates = new Set();
				}
				
				hasMore = data.hasMore;
			}
		} catch (error) {
			console.error('Failed to load timeline:', error);
		} finally {
			loading = false;
		}
	}

	function handleFilterChange(newFilter: string) {
		filter = newFilter;
		offset = 0;
		displayedDates = new Set();
		loadTimeline(false);
	}

	function handleScroll(event: Event) {
		const target = event.target as HTMLElement;
		const scrolledToBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100;

		if (scrolledToBottom && hasMore && !loading) {
			loadTimeline(true);
		}
	}

	function shouldShowDateBadge(activity: Activity): boolean {
		const dateKey = new Date(activity.started_at).toDateString();
		if (displayedDates.has(dateKey)) {
			return false;
		}
		displayedDates.add(dateKey);
		return true;
	}

	let filterButtons = [
		{ id: 'all', label: 'All', color: '' },
		{ id: 'Ducki (Main)', label: '🦆 Ducki', color: '#FFD700' },
		{ id: 'Pixel', label: '🎨 Pixel', color: '#A855F7' },
		{ id: 'Linus', label: '🐧 Linus', color: '#06B6D4' },
		{ id: 'Tesla', label: '⚡ Tesla', color: '#10B981' },
		{ id: 'Shakespeare', label: '📜 Shakespeare', color: '#F59E0B' }
	];
</script>

<div class="timeline-container">
	<div class="timeline-panel" class:open>
		<div class="flex flex-col h-full">
			<!-- Timeline Header -->
			<div class="flex-shrink-0 p-6 pb-4 border-b border-slate-700/30 bg-gradient-to-b from-slate-900/50 to-transparent">
				<div class="flex items-start justify-between mb-3">
					<div>
						<h2 class="text-3xl font-bold font-serif mb-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
							Activity Timeline
						</h2>
						<p class="text-sm text-slate-400 font-sans italic">A chronicle of squad endeavors</p>
					</div>
					<button
						onclick={onClose}
						aria-label="Close timeline"
						class="text-slate-400 hover:text-white transition-all duration-200 p-2 hover:bg-slate-700/50 rounded-lg hover:scale-110 active:scale-95"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>

				<!-- Filter Chips -->
				<div class="flex flex-wrap gap-2 mt-4">
					{#each filterButtons as btn}
						<button
							onclick={() => handleFilterChange(btn.id)}
							class="timeline-filter-chip"
							class:active={filter === btn.id}
							style={btn.color ? `border-color: ${btn.color};` : ''}
						>
							{btn.label}
						</button>
					{/each}
				</div>
			</div>

			<!-- Timeline Content -->
			<div
				class="flex-1 overflow-y-auto py-8 relative"
				onscroll={handleScroll}
			>
				<div class="relative">
					<!-- Vertical Timeline Line -->
					<div class="timeline-line"></div>

					{#if loading && activities.length === 0}
						<div class="text-center py-12">
							<div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-purple-500 mb-4"></div>
							<p class="text-slate-400 font-serif italic">Loading timeline...</p>
						</div>
					{:else if activities.length === 0}
						<div class="text-center py-12">
							<p class="text-slate-400 font-serif italic">No activities found</p>
						</div>
					{:else}
						{#each activities as activity, index (activity.id)}
							{#if shouldShowDateBadge(activity)}
								<div class="day-node">
									<div class="day-badge">
										<div class="day-text">{formatDate(activity.started_at)}</div>
									</div>
								</div>
							{/if}

							<div class="timeline-item-container" class:left={index % 2 === 0} class:right={index % 2 !== 0}>
								<!-- Horizontal connector line -->
								<div class="timeline-horizontal-line"></div>

								<!-- Icon Container (center) -->
								<div class="timeline-icon-container">
									<div
										class="timeline-icon rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br {agentAvatars[activity.agent_name]?.color || 'from-gray-400 to-gray-500'}"
									>
										{#if agentAvatars[activity.agent_name]?.svg}
											{@html agentAvatars[activity.agent_name].svg}
										{:else if agentAvatars[activity.agent_name]?.emoji}
											<span class="text-2xl">{agentAvatars[activity.agent_name].emoji}</span>
										{:else}
											<span class="text-2xl">👤</span>
										{/if}
									</div>
								</div>

								<!-- Content wrapper (task + timestamp) -->
								<div class="timeline-content-wrapper">
									<div class="timeline-content">
										<p class="text-sm text-slate-200 font-medium">{activity.task || 'No description'}</p>
									</div>
									<div class="timeline-metadata">
										<p class="text-xs text-slate-400">{formatTime(activity.started_at)}</p>
									</div>
								</div>
							</div>
						{/each}

						{#if loading}
							<div class="text-center py-8">
								<div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-700 border-t-purple-500"></div>
							</div>
						{/if}

						{#if !hasMore}
							<div class="text-center py-8">
								<p class="text-slate-500 text-sm italic">End of timeline</p>
							</div>
						{/if}
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.timeline-container {
		position: fixed;
		top: 0;
		right: 0;
		height: 100vh;
		width: 100%;
		max-width: 480px;
		z-index: 1000;
		pointer-events: none;
	}

	.timeline-panel {
		position: absolute;
		top: 0;
		right: 0;
		height: 100%;
		width: 100%;
		background: linear-gradient(
			135deg,
			rgba(15, 23, 42, 0.98) 0%,
			rgba(30, 41, 59, 0.98) 50%,
			rgba(15, 23, 42, 0.98) 100%
		);
		backdrop-filter: blur(20px);
		transform: translateX(100%);
		transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
		pointer-events: auto;
		box-shadow: -8px 0 40px rgba(0, 0, 0, 0.6);
		border-left: 1px solid rgba(139, 92, 246, 0.1);
	}

	.timeline-panel.open {
		transform: translateX(0);
	}

	@media (max-width: 1024px) {
		.timeline-container {
			max-width: 380px;
		}
	}

	@media (max-width: 768px) {
		.timeline-container {
			max-width: 100%;
		}
	}

	.timeline-line {
		position: absolute;
		left: 50%;
		top: 0;
		height: 100%;
		width: 3px;
		background: linear-gradient(
			to bottom,
			transparent 0%,
			rgba(139, 92, 246, 0.3) 10%,
			rgba(139, 92, 246, 0.6) 50%,
			rgba(139, 92, 246, 0.3) 90%,
			transparent 100%
		);
		transform: translateX(-50%);
		box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
		pointer-events: none;
	}

	.day-node {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 2rem 0;
		animation: fadeInScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.day-badge {
		position: relative;
		z-index: 10;
		padding: 0.75rem 2rem;
		background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
		border: 1px solid rgba(139, 92, 246, 0.3);
		border-radius: 2rem;
		backdrop-filter: blur(10px);
		box-shadow: 0 4px 20px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	.day-text {
		font-family: 'EB Garamond', serif;
		font-size: 1.125rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		background: linear-gradient(135deg, #a78bfa, #e0e7ff);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.timeline-item-container {
		position: relative;
		margin: 2rem 0;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 1rem;
	}

	.timeline-content-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.timeline-item-container.left .timeline-content-wrapper {
		grid-column: 1;
		text-align: right;
		align-items: flex-end;
	}

	.timeline-item-container.right .timeline-content-wrapper {
		grid-column: 3;
		text-align: left;
		align-items: flex-start;
	}

	.timeline-icon-container {
		grid-column: 2;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.timeline-content {
		position: relative;
		padding: 0 0.75rem;
		max-width: 280px;
	}

	.timeline-metadata {
		position: relative;
		padding: 0 0.75rem;
	}

	@media (max-width: 640px) {
		.timeline-item-container {
			gap: 0.75rem;
		}
		.timeline-content {
			max-width: 240px;
		}
	}

	.timeline-icon {
		position: relative;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
		flex-shrink: 0;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
		transition: all 0.3s ease;
	}

	.timeline-icon:hover {
		transform: scale(1.1);
	}

	.timeline-horizontal-line {
		position: absolute;
		top: 50%;
		height: 2px;
		width: 100px;
		transform: translateY(-50%);
		z-index: 5;
		pointer-events: none;
	}

	.timeline-item-container.left .timeline-horizontal-line {
		right: 50%;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(139, 92, 246, 0.3) 20%,
			rgba(139, 92, 246, 0.5) 80%,
			rgba(139, 92, 246, 0.6)
		);
	}

	.timeline-item-container.right .timeline-horizontal-line {
		left: 50%;
		background: linear-gradient(
			90deg,
			rgba(139, 92, 246, 0.6),
			rgba(139, 92, 246, 0.5) 20%,
			rgba(139, 92, 246, 0.3) 80%,
			transparent
		);
	}

	.timeline-filter-chip {
		padding: 0.5rem 1rem;
		border-radius: 9999px;
		border: 1px solid rgba(100, 116, 139, 0.3);
		background: rgba(15, 23, 42, 0.5);
		font-size: 0.75rem;
		transition: all 0.2s;
		cursor: pointer;
	}

	.timeline-filter-chip:hover {
		background: rgba(100, 116, 139, 0.2);
		border-color: rgba(139, 92, 246, 0.4);
	}

	.timeline-filter-chip.active {
		background: rgba(139, 92, 246, 0.3);
		border-color: rgba(139, 92, 246, 0.6);
		color: #a78bfa;
	}

	@keyframes fadeInScale {
		from {
			opacity: 0;
			transform: scale(0.8);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	/* Custom Scrollbar */
	:global(.timeline-panel)::-webkit-scrollbar {
		width: 8px;
	}

	:global(.timeline-panel)::-webkit-scrollbar-track {
		background: rgba(15, 23, 42, 0.5);
		border-radius: 4px;
	}

	:global(.timeline-panel)::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, rgba(139, 92, 246, 0.5), rgba(99, 102, 241, 0.5));
		border-radius: 4px;
		transition: background 0.2s ease;
	}

	:global(.timeline-panel)::-webkit-scrollbar-thumb:hover {
		background: linear-gradient(180deg, rgba(139, 92, 246, 0.8), rgba(99, 102, 241, 0.8));
	}
</style>
