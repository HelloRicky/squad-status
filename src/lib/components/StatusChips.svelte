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

<div class="summary-bar">
	<button
		class="summary-chip chip-all"
		class:active={currentFilter === 'all'}
		onclick={() => onFilterChange('all')}
	>
		All {agents.length}
	</button>
	<button
		class="summary-chip chip-working"
		class:active={currentFilter === 'working'}
		onclick={() => onFilterChange('working')}
	>
		<span class="dot"></span>
		{counts.working} working
	</button>
	<button
		class="summary-chip chip-idle"
		class:active={currentFilter === 'idle'}
		onclick={() => onFilterChange('idle')}
	>
		<span class="dot"></span>
		{counts.idle} idle
	</button>
	<button
		class="summary-chip chip-error"
		class:active={currentFilter === 'error'}
		onclick={() => onFilterChange('error')}
	>
		<span class="dot"></span>
		{counts.error} errors
	</button>
</div>

{#if currentFilter !== 'all'}
	<div class="filter-banner">
		Filtering by: <strong>{currentFilter}</strong>
		<button class="filter-clear" onclick={() => onFilterChange('all')}>×</button>
	</div>
{/if}

<style>
	.summary-bar {
		display: flex;
		gap: 6px;
		margin-bottom: 24px;
		flex-wrap: wrap;
	}

	.summary-chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 12px;
		border-radius: 20px;
		font-size: 12px;
		font-weight: 500;
		font-family: var(--font-mono);
		border: 1px solid transparent;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.summary-chip .dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.chip-all {
		background: var(--bg-elevated);
		color: var(--text-secondary);
		border-color: var(--border-default);
	}

	.chip-all:hover,
	.chip-all.active {
		background: var(--accent-blue-dim);
		color: var(--accent-blue);
		border-color: rgba(59,130,246,0.3);
	}

	.chip-working {
		background: var(--accent-green-dim);
		color: var(--accent-green);
	}

	.chip-working .dot {
		background: var(--accent-green);
		box-shadow: 0 0 6px var(--accent-green);
	}

	.chip-working:hover,
	.chip-working.active {
		background: var(--accent-green);
		color: white;
	}

	.chip-idle {
		background: var(--accent-amber-dim);
		color: var(--accent-amber);
	}

	.chip-idle .dot {
		background: var(--accent-amber);
	}

	.chip-idle:hover,
	.chip-idle.active {
		background: var(--accent-amber);
		color: white;
	}

	.chip-error {
		background: var(--accent-red-dim);
		color: var(--accent-red);
	}

	.chip-error .dot {
		background: var(--accent-red);
	}

	.chip-error:hover,
	.chip-error.active {
		background: var(--accent-red);
		color: white;
	}

	.filter-banner {
		background: var(--bg-elevated);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-sm);
		padding: 8px 12px;
		margin-bottom: 16px;
		font-size: 13px;
		color: var(--text-secondary);
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.filter-banner strong {
		color: var(--text-primary);
		text-transform: capitalize;
	}

	.filter-clear {
		margin-left: auto;
		background: transparent;
		border: none;
		color: var(--text-tertiary);
		font-size: 18px;
		cursor: pointer;
		padding: 0 4px;
		transition: color 0.15s ease;
	}

	.filter-clear:hover {
		color: var(--text-primary);
	}

	@media (max-width: 640px) {
		.summary-bar {
			margin-bottom: 14px;
		}
	}
</style>
