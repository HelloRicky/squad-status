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

<div>
	<div>
		<div>
			<h2>Squad Overview:</h2>
			<div>
				<button onclick={() => onFilterChange('all')}>
					<span>All</span>
					<span>{agents.length}</span>
				</button>
				<button onclick={() => onFilterChange('working')}>
					<span>●</span>
					<span>Working</span>
					<span>{counts.working}</span>
				</button>
				<button onclick={() => onFilterChange('idle')}>
					<span>●</span>
					<span>Idle</span>
					<span>{counts.idle}</span>
				</button>
				<button onclick={() => onFilterChange('error')}>
					<span>●</span>
					<span>Error</span>
					<span>{counts.error}</span>
				</button>
			</div>
		</div>
		{#if currentFilter !== 'all'}
			<div>
				Filtering by: <strong>{currentFilter}</strong>
				<button onclick={() => onFilterChange('all')}>×</button>
			</div>
		{/if}
	</div>
</div>
