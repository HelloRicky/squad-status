<script lang="ts">
	import { themeStore } from '$lib/stores/theme.svelte';

	function toggle() {
		themeStore.toggle();
	}
</script>

<button class="theme-toggle" onclick={toggle} aria-label="Toggle theme">
	{#if themeStore.theme === 'dark'}
		<!-- Sun Icon (light mode) -->
		<svg class="sun" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<circle cx="12" cy="12" r="4"></circle>
			<path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"></path>
		</svg>
	{:else}
		<!-- Moon Icon (dark mode) -->
		<svg class="moon" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
		</svg>
	{/if}
</button>

<style>
	.theme-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: var(--radius-sm);
		background: var(--bg-card);
		border: 1px solid var(--border-default);
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
		flex-shrink: 0;
	}

	.theme-toggle:hover {
		background: var(--bg-card-hover);
		color: var(--text-primary);
		border-color: var(--border-subtle);
	}

	.theme-toggle svg {
		width: 18px;
		height: 18px;
		stroke-width: 2;
	}

	.sun,
	.moon {
		animation: iconFade 0.3s ease;
	}

	@keyframes iconFade {
		from {
			opacity: 0;
			transform: rotate(-20deg) scale(0.9);
		}
		to {
			opacity: 1;
			transform: rotate(0) scale(1);
		}
	}
</style>
