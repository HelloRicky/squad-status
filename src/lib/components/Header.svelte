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

<div class="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 mb-6">
	<div class="flex items-start justify-between gap-4">
		<div class="flex-1 min-w-0">
			<h1 class="text-2xl md:text-3xl font-bold mb-1.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
				Squad Status
			</h1>
			<p class="text-slate-400 text-xs md:text-sm">Real-time agent activity dashboard</p>
		</div>

		<div class="flex-shrink-0 flex items-center gap-2 flex-wrap">
			<!-- View Mode Toggle -->
			<div class="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
				<button
					onclick={() => onViewModeChange('card')}
					class="view-mode-btn px-2 md:px-3 py-1.5 rounded text-xs transition-all"
					class:active={viewMode === 'card'}
					title="Card View"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
					</svg>
				</button>
				<button
					onclick={() => onViewModeChange('compact')}
					class="view-mode-btn px-2 md:px-3 py-1.5 rounded text-xs transition-all"
					class:active={viewMode === 'compact'}
					title="Compact View"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
					</svg>
				</button>
				<button
					onclick={() => onViewModeChange('table')}
					class="view-mode-btn px-2 md:px-3 py-1.5 rounded text-xs transition-all"
					class:active={viewMode === 'table'}
					title="Table View"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
					</svg>
				</button>
			</div>

			<!-- Sort Dropdown -->
			<select
				value={sortBy}
				onchange={(e) => onSortChange(e.currentTarget.value as SortBy)}
				class="bg-slate-800/50 border border-slate-700 rounded-lg px-2 md:px-3 py-2 text-xs md:text-sm text-white h-10"
			>
				<option value="status">Sort: Status</option>
				<option value="name">Sort: Name</option>
				<option value="lastActive">Sort: Last Active</option>
			</select>

			<!-- Refresh Button -->
			<button
				onclick={onRefresh}
				aria-label="Refresh agent status"
				class="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-3 py-2.5 md:px-4 md:py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 h-10 md:h-12"
			>
				<svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
				</svg>
				<span class="hidden sm:inline">Refresh</span>
				<span class="text-blue-200 text-sm">({refreshCountdown})</span>
			</button>

			<!-- Timeline Button -->
			<button
				onclick={onToggleTimeline}
				aria-label="Open activity timeline"
				aria-expanded={timelineOpen}
				class="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-3 py-2.5 md:px-4 md:py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 h-10 md:h-12"
			>
				<svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<span class="hidden sm:inline">Timeline</span>
			</button>
		</div>
	</div>
</div>

<style>
	.view-mode-btn {
		color: rgba(148, 163, 184, 0.8);
		transition: all 0.2s ease;
	}

	.view-mode-btn:hover {
		color: rgba(168, 139, 250, 0.9);
		background: rgba(139, 92, 246, 0.1);
	}

	.view-mode-btn.active {
		background: rgba(139, 92, 246, 0.3);
		color: #a78bfa;
	}
</style>
