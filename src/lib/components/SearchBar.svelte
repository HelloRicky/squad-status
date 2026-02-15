<script lang="ts">
	interface Props {
		value: string;
		onChange: (value: string) => void;
	}

	let { value, onChange }: Props = $props();

	function clearSearch() {
		onChange('');
	}
</script>

<div class="search-wrapper">
	<div class="search-bar">
		<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
		</svg>
		<input
			type="text"
			value={value}
			oninput={(e) => onChange(e.currentTarget.value)}
			placeholder="Search agents by name or role..."
		/>
		{#if value}
			<button class="clear-button" onclick={clearSearch}>✕</button>
		{/if}
	</div>
</div>

<style>
	.search-wrapper {
		margin-bottom: 20px;
	}

	.search-bar {
		display: flex;
		align-items: center;
		gap: 12px;
		background: var(--bg-card);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-sm);
		padding: 10px 14px;
		transition: all 0.15s ease;
	}

	.search-bar:focus-within {
		border-color: var(--accent-blue);
		box-shadow: 0 0 0 3px var(--accent-blue-dim);
	}

	.search-bar svg {
		width: 18px;
		height: 18px;
		color: var(--text-tertiary);
		flex-shrink: 0;
	}

	input {
		flex: 1;
		background: transparent;
		border: none;
		outline: none;
		color: var(--text-primary);
		font-family: var(--font-display);
		font-size: 14px;
		font-weight: 400;
	}

	input::placeholder {
		color: var(--text-tertiary);
	}

	.clear-button {
		background: transparent;
		border: none;
		color: var(--text-tertiary);
		font-size: 16px;
		cursor: pointer;
		padding: 0 4px;
		transition: color 0.15s ease;
		line-height: 1;
	}

	.clear-button:hover {
		color: var(--text-primary);
	}
</style>
