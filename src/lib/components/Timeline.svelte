<script lang="ts">
	import { onMount } from 'svelte';
	import type { Activity } from '$lib/types';
	import { agentAvatars } from '$lib/types';
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

<div>
	<div data-open={open}>
		<div>
			<!-- Timeline Header -->
			<div>
				<div>
					<div>
						<h2>Activity Timeline</h2>
						<p>A chronicle of squad endeavors</p>
					</div>
					<button onclick={onClose} aria-label="Close timeline">
						<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>

				<!-- Filter Chips -->
				<div>
					{#each filterButtons as btn}
						<button onclick={() => handleFilterChange(btn.id)}>
							{btn.label}
						</button>
					{/each}
				</div>
			</div>

			<!-- Timeline Content -->
			<div onscroll={handleScroll}>
				<div>
					{#if loading && activities.length === 0}
						<div>
							<div></div>
							<p>Loading timeline...</p>
						</div>
					{:else if activities.length === 0}
						<div>
							<p>No activities found</p>
						</div>
					{:else}
						{#each activities as activity, index (activity.id)}
							{#if shouldShowDateBadge(activity)}
								<div>
									<div>
										<div>{formatDate(activity.started_at)}</div>
									</div>
								</div>
							{/if}

							<div>
								<!-- Icon Container (center) -->
								<div>
									<div>
										{#if agentAvatars[activity.agent_name]?.svg}
											{@html agentAvatars[activity.agent_name].svg}
										{:else if agentAvatars[activity.agent_name]?.emoji}
											<span>{agentAvatars[activity.agent_name].emoji}</span>
										{:else}
											<span>👤</span>
										{/if}
									</div>
								</div>

								<!-- Content wrapper (task + timestamp) -->
								<div>
									<div>
										<p>{activity.task || 'No description'}</p>
									</div>
									<div>
										<p>{formatTime(activity.started_at)}</p>
									</div>
								</div>
							</div>
						{/each}

						{#if loading}
							<div>
								<div></div>
							</div>
						{/if}

						{#if !hasMore}
							<div>
								<p>End of timeline</p>
							</div>
						{/if}
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
