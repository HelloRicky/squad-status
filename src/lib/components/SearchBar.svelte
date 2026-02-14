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

<div class="bg-slate-800/40 backdrop-blur-sm rounded-xl p-3 mb-4 border border-slate-700/30">
	<div class="relative">
		<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
		</svg>
		<input
			type="text"
			bind:value
			oninput={(e) => onChange(e.currentTarget.value)}
			placeholder="Search agents by name or role..."
			class="w-full bg-slate-900/50 border border-slate-700 rounded-lg pl-10 pr-10 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
		/>
		{#if value}
			<button
				onclick={clearSearch}
				class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
			>
				✕
			</button>
		{/if}
	</div>
</div>
