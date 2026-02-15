<script lang="ts">
	import type { ViewMode, SortBy } from '$lib/types';

	interface Props {
		viewMode: ViewMode;
		sortBy: SortBy;
		refreshCountdown: number;
		onViewModeChange: (mode: ViewMode) => void;
		onSortChange: (sort: SortBy) => void;
		onRefresh: () => void;
		onToggleTimeline: () => void;
		timelineOpen: boolean;
	}

	let { viewMode, sortBy, refreshCountdown, onViewModeChange, onSortChange, onRefresh, onToggleTimeline, timelineOpen }: Props = $props();
</script>

<div class="header-wrapper">
	<div class="header">
		<div class="header-left">
			<h1>Squad Status</h1>
			<p>Real-time agent activity dashboard</p>
		</div>

		<div class="header-actions">
			<!-- View Mode Toggle -->
			<div class="view-toggle">
				<button
					class:active={viewMode === 'card'}
					onclick={() => onViewModeChange('card')}
					title="Card View"
				>
					<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
					</svg>
				</button>
				<button
					class:active={viewMode === 'compact'}
					onclick={() => onViewModeChange('compact')}
					title="Compact View"
				>
					<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
					</svg>
				</button>
				<button
					class:active={viewMode === 'table'}
					onclick={() => onViewModeChange('table')}
					title="Table View"
				>
					<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
					</svg>
				</button>
			</div>

			<!-- Sort Dropdown -->
			<select value={sortBy} onchange={(e) => onSortChange(e.currentTarget.value as SortBy)}>
				<option value="status">Sort: Status</option>
				<option value="name">Sort: Name</option>
				<option value="lastActive">Sort: Last Active</option>
			</select>

			<!-- Refresh Button -->
			<button class="btn" onclick={onRefresh} aria-label="Refresh agent status">
				<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
				</svg>
				<span>Refresh</span>
				<span class="refresh-badge">{refreshCountdown}s</span>
			</button>

			<!-- Timeline Button -->
			<button class="btn" onclick={onToggleTimeline} aria-label="Open activity timeline" aria-expanded={timelineOpen}>
				<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<span>Timeline</span>
			</button>
		</div>
	</div>
</div>

<style>
	.header-wrapper {
		margin-bottom: 28px;
	}

	.header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.header-left h1 {
		font-size: 26px;
		font-weight: 700;
		letter-spacing: -0.5px;
		color: var(--text-primary);
	}

	.header-left p {
		font-size: 13px;
		color: var(--text-tertiary);
		margin-top: 4px;
		font-weight: 400;
	}

	.header-actions {
		display: flex;
		gap: 8px;
		align-items: center;
	}

	.view-toggle {
		display: flex;
		gap: 0;
		background: var(--bg-card);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-sm);
		padding: 2px;
	}

	.view-toggle button {
		padding: 6px 10px;
		background: transparent;
		border: none;
		color: var(--text-tertiary);
		cursor: pointer;
		border-radius: calc(var(--radius-sm) - 2px);
		transition: all 0.15s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.view-toggle button:hover {
		color: var(--text-secondary);
		background: var(--bg-elevated);
	}

	.view-toggle button.active {
		background: var(--accent-blue);
		color: white;
	}

	.view-toggle button svg {
		width: 16px;
		height: 16px;
	}

	select {
		padding: 8px 32px 8px 14px;
		border-radius: var(--radius-sm);
		font-family: var(--font-display);
		font-size: 13px;
		font-weight: 500;
		border: 1px solid var(--border-default);
		background: var(--bg-card);
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.15s ease;
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b90a0' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 10px center;
	}

	select:hover {
		background-color: var(--bg-card-hover);
		color: var(--text-primary);
		border-color: rgba(255,255,255,0.1);
	}

	.refresh-badge {
		background: var(--accent-blue-dim);
		color: var(--accent-blue);
		font-size: 11px;
		font-weight: 600;
		padding: 1px 6px;
		border-radius: 10px;
		font-family: var(--font-mono);
	}
</style>
