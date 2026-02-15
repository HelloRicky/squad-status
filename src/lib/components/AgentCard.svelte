<script lang="ts">
	import type { Agent, ViewMode } from '$lib/types';
	import { agentAvatars, agentRoles } from '$lib/types';
	import { formatTimeAgo, getStaleness } from '$lib/utils';

	interface Props {
		agent: Agent;
		viewMode: ViewMode;
		isLeader?: boolean;
	}

	let { agent, viewMode, isLeader = false }: Props = $props();

	let staleness = $derived(getStaleness(agent.last_active_at));
	let avatar = $derived(agentAvatars[agent.agent_name] || { emoji: '👤', color: 'from-gray-400 to-gray-500' });
	let role = $derived(agentRoles[agent.agent_name] || 'Agent');
</script>

<div data-status={agent.status}>
	<!-- Avatar -->
	<div>
		<div>
			{#if avatar.svg}
				{@html avatar.svg}
			{:else if avatar.emoji}
				<span>{avatar.emoji}</span>
			{/if}
		</div>

		<div>
			<div>
				<h3>{agent.agent_name}</h3>
				<p>{role}</p>
			</div>

			{#if viewMode === 'table'}
				<div>
					<!-- Status Badge (table view) -->
					<div>
						<div>●</div>
						<span>{agent.status}</span>
					</div>
					<!-- Task (table view) -->
					<div>{agent.current_task || 'No active task'}</div>
					<!-- Timestamp (table view) -->
					<div>{formatTimeAgo(agent.last_active_at)}</div>
				</div>
			{/if}
		</div>
	</div>

	{#if viewMode !== 'table'}
		<!-- Status Badge -->
		<div>
			<div>●</div>
			<span>{agent.status}</span>
		</div>

		<!-- Current Task -->
		<div>
			<p>{agent.current_task || 'No active task'}</p>
		</div>

		<!-- Last Active -->
		<div>
			<span>Last active:</span>
			<span>{formatTimeAgo(agent.last_active_at)}</span>
		</div>
	{/if}
</div>
