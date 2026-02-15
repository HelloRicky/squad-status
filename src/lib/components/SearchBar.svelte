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

<div>
	<div>
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
			<button onclick={clearSearch}>✕</button>
		{/if}
	</div>
</div>
