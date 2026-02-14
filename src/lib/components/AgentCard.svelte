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
	let borderColor = $derived(agentTimelineColors[agent.agent_name] || '#64748b');

	function getStatusColor(status: string): string {
		const colors = {
			working: 'border-green-500/50',
			idle: 'border-yellow-500/50',
			error: 'border-red-500/50'
		};
		return colors[status as keyof typeof colors] || 'border-slate-700';
	}

	function getStatusTextColor(status: string): string {
		const colors = {
			working: 'text-green-400',
			idle: 'text-yellow-400',
			error: 'text-red-400'
		};
		return colors[status as keyof typeof colors] || 'text-slate-400';
	}
</script>

<div
	class="agent-card bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-sm rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer relative {getStatusColor(agent.status)}"
	class:breathing-border={agent.status === 'working'}
	class:stale-warning={staleness === 'warning'}
	class:stale-critical={staleness === 'critical'}
	class:p-6={viewMode === 'card'}
	class:p-3={viewMode === 'compact'}
	class:p-4={viewMode === 'table'}
	class:flex={viewMode === 'table'}
	class:flex-row={viewMode === 'table'}
	class:items-center={viewMode === 'table'}
	class:gap-4={viewMode === 'table'}
	data-status={agent.status}
>
	<!-- Avatar -->
	<div class="flex items-center gap-4" class:mb-4={viewMode !== 'table'}>
		<div
			class="agent-avatar rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-br flex-shrink-0 {avatar.color}"
			class:w-14={viewMode === 'compact'}
			class:h-14={viewMode === 'compact'}
			class:w-16={viewMode === 'card'}
			class:h-16={viewMode === 'card'}
			class:w-12={viewMode === 'table'}
			class:h-12={viewMode === 'table'}
		>
			{#if avatar.svg}
				{@html avatar.svg}
			{:else if avatar.emoji}
				<span class="text-3xl" class:text-2xl={viewMode !== 'card'}>{avatar.emoji}</span>
			{/if}
		</div>

		<div class="flex-1 min-w-0" class:flex={viewMode === 'table'} class:items-center={viewMode === 'table'} class:justify-between={viewMode === 'table'}>
			<div>
				<h3 class="font-bold" class:text-xl={viewMode === 'card'} class:text-lg={viewMode !== 'card'}>
					{agent.agent_name}
				</h3>
				<p class="text-xs opacity-80" class:{role}>{role}</p>
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
				class="status-dot w-3 h-3 rounded-full flex-shrink-0"
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
			<p class="text-sm text-slate-300 line-clamp-2">
				{agent.current_task || 'No active task'}
			</p>
		</div>

		<!-- Last Active -->
		<div class="text-xs flex items-center justify-between">
			<span class="text-slate-500">Last active:</span>
			<span class:stale-timestamp={staleness === 'warning'} class:critical={staleness === 'critical'}>
				{formatTimeAgo(agent.last_active_at)}
			</span>
		</div>
	{/if}

	<!-- Click indicator arrow -->
	<div class="arrow absolute top-4 right-4 opacity-0 transition-opacity text-purple-400 text-xl">→</div>
</div>

<style>
	.agent-card {
		animation: slide-up 0.3s ease-out;
	}

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

	.agent-card:hover .arrow {
		opacity: 1;
	}

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

	.stale-timestamp {
		color: #cbd5e1 !important;
	}

	.stale-timestamp.critical {
		color: #fca5a5 !important;
	}
</style>
