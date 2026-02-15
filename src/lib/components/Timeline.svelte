<script lang="ts">
	import type { Activity } from '$lib/types';
	import { agentAvatars, agentTimelineColors, resolveAgentName } from '$lib/types';
	import { formatDate, formatTime } from '$lib/utils';

	interface Props {
		open: boolean;
		onClose: () => void;
		refreshKey: number;
	}

	let { open, onClose, refreshKey }: Props = $props();

	let activities: Activity[] = $state([]);
	let loading = $state(false);
	let hasMore = $state(true);
	let offset = $state(0);
	let filter = $state('all');

	let displayActivities = $derived.by(() => {
		const live = activities.filter(a => !a.ended_at);
		const completed = activities.filter(a => !!a.ended_at);
		return [...live, ...completed];
	});

	let dateBadgeIndices = $derived.by(() => {
		const seen = new Set<string>();
		const indices = new Set<number>();
		for (let i = 0; i < displayActivities.length; i++) {
			const dateKey = new Date(displayActivities[i].started_at).toDateString();
			if (!seen.has(dateKey)) {
				seen.add(dateKey);
				indices.add(i);
			}
		}
		return indices;
	});

	$effect(() => {
		if (open) {
			// Track refreshKey so we reload when it changes
			refreshKey;
			loadTimeline(false);
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
		loadTimeline(false);
	}

	function handleScroll(event: Event) {
		const target = event.target as HTMLElement;
		const scrolledToBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100;

		if (scrolledToBottom && hasMore && !loading) {
			loadTimeline(true);
		}
	}

	function calculateDuration(startedAt: string, endedAt: string): string {
		const start = new Date(startedAt).getTime();
		const end = new Date(endedAt).getTime();
		const diffMs = end - start;
		const diffMins = Math.floor(diffMs / 60000);

		if (diffMins < 1) return '<1m';
		if (diffMins < 60) return `${diffMins}m`;

		const hours = Math.floor(diffMins / 60);
		const mins = diffMins % 60;
		return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
	}

	function getAgentColor(agentName: string): string {
		const resolved = resolveAgentName(agentName);
		return agentTimelineColors[resolved] || 'var(--text-tertiary)';
	}

	let filterButtons = [
		{ id: 'all', label: 'All' },
		{ id: 'Ducki', label: 'Ducki' },
		{ id: 'Pixel', label: 'Pixel' },
		{ id: 'Linus', label: 'Linus' },
		{ id: 'Tesla', label: 'Tesla' },
		{ id: 'Shakespeare', label: 'Shakespeare' }
	];
</script>

{#if open}
	<div class="timeline-panel">
		<!-- Timeline Header -->
		<div class="timeline-header">
			<div>
				<h2>Activity Timeline</h2>
				<p>Today's squad activity</p>
			</div>
			<button class="close-btn" onclick={onClose} aria-label="Close timeline">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M18 6 6 18"/>
					<path d="m6 6 12 12"/>
				</svg>
			</button>
		</div>

		<!-- Filter Chips -->
		<div class="timeline-filters">
			{#each filterButtons as btn}
				<button
					class="filter-chip"
					class:active={filter === btn.id}
					onclick={() => handleFilterChange(btn.id)}
				>
					{#if btn.id !== 'all'}
						<span style="color: {getAgentColor(btn.id)}">●</span>
					{/if}
					{btn.label}
				</button>
			{/each}
		</div>

		<!-- Timeline Content -->
		<div class="timeline-content" onscroll={handleScroll}>
			{#if loading && activities.length === 0}
				<div class="loading-state">
					<div class="spinner"></div>
					<p>Loading timeline...</p>
				</div>
			{:else if activities.length === 0}
				<div class="empty-state">
					<p>No activities found</p>
				</div>
			{:else}
				{#each displayActivities as activity, i (activity.id)}
					{#if dateBadgeIndices.has(i)}
						<div class="timeline-day-label">
							{formatDate(activity.started_at)}
						</div>
					{/if}

					<div class="timeline-item">
						<div class="agent-color-bar" style="background: {getAgentColor(activity.agent_name)}"></div>

						<div class="timeline-item-avatar" style="background: {agentAvatars[resolveAgentName(activity.agent_name)]?.color || 'linear-gradient(135deg, #6b7280, #9ca3af)'}">
							{#if agentAvatars[resolveAgentName(activity.agent_name)]?.svg}
								{@html agentAvatars[resolveAgentName(activity.agent_name)].svg}
							{:else if agentAvatars[resolveAgentName(activity.agent_name)]?.emoji}
								{agentAvatars[resolveAgentName(activity.agent_name)].emoji}
							{:else}
								👤
							{/if}
						</div>

						<div class="timeline-item-body">
							<div class="timeline-item-header">
								<span class="timeline-item-name">{activity.agent_name}</span>
								<span class="timeline-item-time">
									{formatTime(activity.started_at)}{#if activity.ended_at} · {calculateDuration(activity.started_at, activity.ended_at)}{/if}
								</span>
							</div>
							<div class="timeline-item-task">
								{activity.task || 'No description'}
								{#if !activity.ended_at}
									<span class="live-dot"></span>
								{/if}
							</div>
						</div>
					</div>
				{/each}

				{#if loading}
					<div class="loading-more">
						<div class="spinner small"></div>
					</div>
				{/if}

				{#if !hasMore}
					<div class="end-of-timeline">
						<p>End of timeline</p>
					</div>
				{/if}
			{/if}
		</div>
	</div>
{/if}

<style>
	.timeline-panel {
		background: var(--bg-secondary);
		border-left: 1px solid var(--border-default);
		display: flex;
		flex-direction: column;
		height: 100vh;
		position: sticky;
		top: 0;
	}

	.timeline-header {
		padding: 24px 20px 16px;
		border-bottom: 1px solid var(--border-default);
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-shrink: 0;
	}

	.timeline-header h2 {
		font-size: 15px;
		font-weight: 600;
	}

	.timeline-header p {
		font-size: 11px;
		color: var(--text-tertiary);
		margin-top: 2px;
	}

	.close-btn {
		width: 28px;
		height: 28px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border-default);
		background: transparent;
		color: var(--text-tertiary);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.15s ease;
	}

	.close-btn:hover {
		background: var(--bg-card-hover);
		color: var(--text-primary);
	}

	.close-btn svg {
		width: 14px;
		height: 14px;
	}

	/* ── Timeline Filters ── */
	.timeline-filters {
		display: flex;
		gap: 4px;
		padding: 12px 20px;
		border-bottom: 1px solid var(--border-default);
		flex-shrink: 0;
		overflow-x: auto;
	}

	.filter-chip {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 4px 10px;
		border-radius: 14px;
		font-size: 11px;
		font-weight: 500;
		border: 1px solid var(--border-default);
		background: transparent;
		color: var(--text-tertiary);
		cursor: pointer;
		white-space: nowrap;
		transition: all 0.15s ease;
		font-family: var(--font-display);
	}

	.filter-chip:hover {
		background: var(--bg-elevated);
		color: var(--text-secondary);
	}

	.filter-chip.active {
		background: var(--accent-blue-dim);
		color: var(--accent-blue);
		border-color: rgba(59,130,246,0.3);
	}

	.filter-chip span {
		font-size: 8px;
	}

	/* ── Timeline Content ── */
	.timeline-content {
		flex: 1;
		overflow-y: auto;
		padding: 16px 20px;
	}

	.timeline-day-label {
		font-size: 11px;
		font-weight: 600;
		color: var(--text-tertiary);
		text-transform: uppercase;
		letter-spacing: 0.8px;
		margin-bottom: 12px;
		margin-top: 12px;
		font-family: var(--font-mono);
	}

	.timeline-day-label:first-child {
		margin-top: 0;
	}

	.timeline-item {
		display: flex;
		gap: 12px;
		padding: 10px 0;
		position: relative;
		animation: fadeInUp 0.3s ease backwards;
	}

	.timeline-item + .timeline-item {
		border-top: 1px solid var(--border-subtle);
	}

	.agent-color-bar {
		width: 3px;
		border-radius: 2px;
		flex-shrink: 0;
		align-self: stretch;
	}

	.timeline-item-avatar {
		width: 30px;
		height: 30px;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		flex-shrink: 0;
		margin-top: 2px;
	}

	.timeline-item-body {
		flex: 1;
		min-width: 0;
	}

	.timeline-item-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		margin-bottom: 3px;
	}

	.timeline-item-name {
		font-size: 12px;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.timeline-item-time {
		font-size: 10px;
		color: var(--text-tertiary);
		font-family: var(--font-mono);
		white-space: nowrap;
		flex-shrink: 0;
	}

	.timeline-item-task {
		font-size: 12px;
		color: var(--text-secondary);
		line-height: 1.4;
	}

	.live-dot {
		width: 6px;
		height: 6px;
		background: var(--accent-green);
		border-radius: 50%;
		display: inline-block;
		margin-left: 4px;
		animation: blink 1.5s ease infinite;
		vertical-align: middle;
	}

	/* ── Loading & Empty States ── */
	.loading-state,
	.empty-state {
		text-align: center;
		padding: 40px 20px;
		color: var(--text-tertiary);
	}

	.loading-state p,
	.empty-state p {
		font-size: 13px;
		font-style: italic;
	}

	.spinner {
		width: 24px;
		height: 24px;
		border: 2px solid var(--border-default);
		border-top-color: var(--accent-blue);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
		margin: 0 auto 12px;
	}

	.spinner.small {
		width: 18px;
		height: 18px;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.loading-more {
		display: flex;
		justify-content: center;
		padding: 16px;
	}

	.end-of-timeline {
		text-align: center;
		padding: 20px;
		color: var(--text-tertiary);
		font-size: 12px;
		font-style: italic;
	}

	/* ── Responsive ── */
	@media (max-width: 900px) {
		.timeline-panel {
			position: fixed;
			right: 0;
			top: 0;
			width: 360px;
			z-index: 100;
			box-shadow: -8px 0 40px rgba(0,0,0,0.5);
		}
	}
</style>
