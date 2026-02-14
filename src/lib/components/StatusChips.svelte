<script lang="ts">
	import type { Agent, StatusFilter } from '$lib/types';

	interface Props {
		agents: Agent[];
		currentFilter: StatusFilter;
		onFilterChange: (filter: StatusFilter) => void;
	}

	let { agents, currentFilter, onFilterChange }: Props = $props();

	let counts = $derived({
		working: agents.filter((a) => a.status === 'working').length,
		idle: agents.filter((a) => a.status === 'idle').length,
		error: agents.filter((a) => a.status === 'error').length
	});
</script>

<div class="bg-slate-800/40 backdrop-blur-sm rounded-xl p-4 mb-6 border border-slate-700/30">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div class="flex flex-wrap items-center gap-3">
			<h2 class="text-sm font-semibold text-slate-300 hidden sm:block">Squad Overview:</h2>
			<div class="flex flex-wrap items-center gap-2">
				<button
					onclick={() => onFilterChange('all')}
					class="status-chip bg-slate-700/50 hover:bg-slate-700 px-3 py-1.5 rounded-full text-xs font-medium transition-all border border-slate-600 hover:border-slate-500 flex items-center gap-1.5"
					class:active={currentFilter === 'all'}
				>
					<span>All</span>
					<span class="font-mono">{agents.length}</span>
				</button>
				<button
					onclick={() => onFilterChange('working')}
					class="status-chip hover:bg-green-500/20 px-3 py-1.5 rounded-full text-xs font-medium transition-all border border-green-500/30 hover:border-green-500/50 text-green-400 flex items-center gap-1.5"
					class:active={currentFilter === 'working'}
				>
					<span class="w-2 h-2 rounded-full bg-green-500"></span>
					<span>Working</span>
					<span class="font-mono">{counts.working}</span>
				</button>
				<button
					onclick={() => onFilterChange('idle')}
					class="status-chip hover:bg-yellow-500/20 px-3 py-1.5 rounded-full text-xs font-medium transition-all border border-yellow-500/30 hover:border-yellow-500/50 text-yellow-400 flex items-center gap-1.5"
					class:active={currentFilter === 'idle'}
				>
					<span class="w-2 h-2 rounded-full bg-yellow-500"></span>
					<span>Idle</span>
					<span class="font-mono">{counts.idle}</span>
				</button>
				<button
					onclick={() => onFilterChange('error')}
					class="status-chip hover:bg-red-500/20 px-3 py-1.5 rounded-full text-xs font-medium transition-all border border-red-500/30 hover:border-red-500/50 text-red-400 flex items-center gap-1.5"
					class:active={currentFilter === 'error'}
				>
					<span class="w-2 h-2 rounded-full bg-red-500"></span>
					<span>Error</span>
					<span class="font-mono">{counts.error}</span>
				</button>
			</div>
		</div>
		{#if currentFilter !== 'all'}
			<div class="text-xs text-slate-400">
				Filtering by: <strong>{currentFilter}</strong>
				<button onclick={() => onFilterChange('all')} class="ml-1 text-purple-400 hover:text-purple-300">×</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.status-chip.active {
		background: rgba(139, 92, 246, 0.3) !important;
		border-color: rgba(139, 92, 246, 0.6) !important;
		box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
	}
</style>
