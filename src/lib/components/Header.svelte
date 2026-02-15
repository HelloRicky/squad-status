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

<div>
	<div>
		<div>
			<h1>Squad Status</h1>
			<p>Real-time agent activity dashboard</p>
		</div>

		<div>
			<!-- View Mode Toggle -->
			<div>
				<button onclick={() => onViewModeChange('card')} title="Card View">
					<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
					</svg>
				</button>
				<button onclick={() => onViewModeChange('compact')} title="Compact View">
					<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
					</svg>
				</button>
				<button onclick={() => onViewModeChange('table')} title="Table View">
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
			<button onclick={onRefresh} aria-label="Refresh agent status">
				<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
				</svg>
				<span>Refresh ({refreshCountdown})</span>
			</button>

			<!-- Timeline Button -->
			<button onclick={onToggleTimeline} aria-label="Open activity timeline" aria-expanded={timelineOpen}>
				<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<span>Timeline</span>
			</button>
		</div>
	</div>
</div>
