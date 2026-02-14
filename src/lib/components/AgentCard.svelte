<script lang="ts">
	import type { Agent, ViewMode } from '$lib/types';
	import { agentAvatars, agentRoles, agentTimelineColors } from '$lib/types';
	import { formatTimeAgo, getStaleness } from '$lib/utils';

	interface Props {
		agent: Agent;
		isLeader: boolean;
		viewMode: ViewMode;
	}

	let { agent, isLeader, viewMode }: Props = $props();

	let staleness = $derived(getStaleness(agent.last_active_at));
	let avatar = $derived(agentAvatars[agent.agent_name] || { emoji: '👤', color: 'from-gray-400 to-gray-500' });
	let role = $derived(agentRoles[agent.agent_name] || 'Agent');

	function getStatusTextColor(status: string): string {
		const colors = {
			working: 'text-green-400',
			idle: 'text-yellow-400',
			error: 'text-red-400'
		};
		return colors[status as keyof typeof colors] || 'text-slate-400';
	}

	let cardClasses = $derived(() => {
		const base = 'agent-card bg-slate-800/50 backdrop-blur-sm rounded-xl transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer relative';
		const breathing = agent.status === 'working' ? 'breathing-border' : '';
		const border = agent.status === 'working' || agent.status === 'error' ? 'border-2' : 'border';
		const borderColor = agent.status === 'working' ? 'border-green-500/50' : agent.status === 'error' ? 'border-red-500/50' : 'border-slate-700/50';
		const shadow = agent.status === 'working' || agent.status === 'error' ? 'shadow-lg' : '';
		const shadowColor = agent.status === 'working' ? 'shadow-green-500/20' : agent.status === 'error' ? 'shadow-red-500/20' : '';
		const stale = staleness === 'warning' ? 'stale-warning' : staleness === 'critical' ? 'stale-critical' : '';
		const padding = viewMode === 'card' ? 'p-5 md:p-6' : viewMode === 'compact' ? 'p-3' : 'p-4 lg:p-5';
		const layout = viewMode === 'table' ? 'flex flex-row items-center gap-4' : '';
		
		return `${base} ${breathing} ${border} ${borderColor} ${shadow} ${shadowColor} ${stale} ${padding} ${layout}`;
	});
</script>

<div
	class={cardClasses()}
	data-status={agent.status}
>
	<!-- Avatar -->
	<div class="flex items-center gap-4" class:mb-4={viewMode !== 'table'}>
		<div
			class="agent-avatar rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br flex-shrink-0 {avatar.color}"
			class:w-10={viewMode === 'compact'}
			class:h-10={viewMode === 'compact'}
			class:w-14={viewMode === 'card'}
			class:h-14={viewMode === 'card'}
			class:lg:w-16={viewMode === 'card'}
			class:lg:h-16={viewMode === 'card'}
			class:w-12={viewMode === 'table'}
			class:h-12={viewMode === 'table'}
		>
			{#if avatar.svg}
				{@html avatar.svg}
			{:else if avatar.emoji}
				<span class="text-2xl lg:text-3xl" class:text-xl={viewMode === 'compact'}>{avatar.emoji}</span>
			{/if}
		</div>

		<div class="flex-1 min-w-0" class:flex={viewMode === 'table'} class:items-center={viewMode === 'table'} class:justify-between={viewMode === 'table'}>
			<div>
				<h3 class="font-bold text-xl" class:text-lg={viewMode === 'compact'}>
					{agent.agent_name}
				</h3>
				<p class="text-xs opacity-80">{role}</p>
			</div>

			{#if viewMode === 'table'}
				<div class="flex items-center gap-4">
					<!-- Status Badge (table view) -->
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 rounded-full {agent.status === 'working' ? 'bg-green-500' : agent.status === 'idle' ? 'bg-yellow-500' : 'bg-red-500'}"></div>
						<span class="text-sm capitalize {getStatusTextColor(agent.status)}">{agent.status}</span>
					</div>
					<!-- Task (table view) -->
					<div class="text-sm text-slate-300 max-w-xs truncate">
						{agent.current_task || 'No active task'}
					</div>
					<!-- Timestamp (table view) -->
					<div class="text-xs text-slate-500 whitespace-nowrap" class:stale-timestamp={staleness === 'warning'} class:critical={staleness === 'critical'}>
						{formatTimeAgo(agent.last_active_at)}
					</div>
				</div>
			{/if}
		</div>
	</div>

	{#if viewMode !== 'table'}
		<!-- Status Badge -->
		<div class="flex items-center gap-2 mb-3">
			<div
				class="status-dot w-4 h-4 flex-shrink-0"
				class:rounded-full={agent.status === 'working'}
				class:rounded-sm={agent.status === 'idle'}
				class:triangle={agent.status === 'error'}
				class:bg-green-500={agent.status === 'working'}
				class:bg-yellow-500={agent.status === 'idle'}
				class:bg-red-500={agent.status === 'error'}
				class:pulse-dot={agent.status === 'working'}
			></div>
			<span class="text-sm font-medium capitalize {getStatusTextColor(agent.status)}">
				{agent.status}
			</span>
		</div>

		<!-- Current Task -->
		<div class="mb-3">
			<p class="text-sm text-slate-300 line-clamp-2 leading-relaxed">
				{agent.current_task || 'No active task'}
			</p>
		</div>

		<!-- Last Active -->
		<div class="text-xs flex items-center justify-between">
			<span class="text-slate-400">Last active:</span>
			<span class="text-slate-300" class:stale-timestamp={staleness === 'warning'} class:critical={staleness === 'critical'}>
				{formatTimeAgo(agent.last_active_at)}
			</span>
		</div>
	{/if}
</div>

<style>
	.agent-card {
		animation: slide-up 0.3s ease-out;
	}

	/* Breathing border for working status */
	.breathing-border {
		animation: breathe 2s ease-in-out infinite;
	}

	@keyframes breathe {
		0%,
		100% {
			box-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
		}
		50% {
			box-shadow: 0 0 20px rgba(34, 197, 94, 0.8), 0 0 40px rgba(34, 197, 94, 0.4);
		}
	}

	/* Pulse animation for working status dot */
	.pulse-dot {
		animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse-glow {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	/* Slide up animation on card appearance */
	@keyframes slide-up {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Triangle shape for error status */
	.triangle {
		width: 0 !important;
		height: 0 !important;
		background: transparent !important;
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-bottom: 14px solid #ef4444;
	}

	/* Hover arrow indicator */
	.agent-card::after {
		content: '→';
		position: absolute;
		top: 1rem;
		right: 1rem;
		opacity: 0;
		transition: opacity 0.2s ease;
		color: rgba(139, 92, 246, 0.6);
		font-size: 1.25rem;
		pointer-events: none;
	}

	.agent-card:hover::after {
		opacity: 1;
	}

	/* Stale agent visual treatment */
	.stale-warning {
		opacity: 0.85;
	}

	.stale-critical {
		opacity: 0.6;
	}

	.stale-warning:hover,
	.stale-critical:hover {
		opacity: 1;
	}

	/* Improved timestamp contrast */
	.stale-timestamp {
		color: #cbd5e1 !important; /* slate-300 for better contrast */
	}

	.stale-timestamp.critical {
		color: #fca5a5 !important; /* red-300 for better contrast */
	}
</style>
