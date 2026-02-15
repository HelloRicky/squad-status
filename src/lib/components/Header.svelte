<script lang="ts">
	interface Props {
		refreshCountdown: number;
		onRefresh: () => void;
		onToggleTimeline: () => void;
		timelineOpen: boolean;
	}

	let { refreshCountdown, onRefresh, onToggleTimeline, timelineOpen }: Props = $props();
</script>

<div class="header-wrapper">
	<div class="header">
		<div class="header-left">
			<h1>Squad Status</h1>
		</div>

		<div class="header-actions">
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
		align-items: center;
		justify-content: space-between;
	}

	.header-left h1 {
		font-size: 26px;
		font-weight: 700;
		letter-spacing: -0.5px;
		color: var(--text-primary);
	}

	.header-actions {
		display: flex;
		gap: 8px;
		align-items: center;
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

	@media (max-width: 640px) {
		.header-wrapper {
			margin-bottom: 16px;
		}

		.header-left h1 {
			font-size: 22px;
			white-space: nowrap;
		}

		.header-actions {
			flex-wrap: wrap;
		}

		.btn span:not(.refresh-badge) {
			display: none;
		}
	}
</style>
