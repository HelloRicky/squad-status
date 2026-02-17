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
	let avatar = $derived(agentAvatars[agent.agent_name] || { emoji: '👤', color: 'linear-gradient(135deg, #6b7280, #9ca3af)' });
	let role = $derived(agentRoles[agent.agent_name] || 'Agent');
</script>

{#if isLeader && viewMode === 'card'}
	<!-- Coordinator Card -->
	<div class="coordinator-card">
		<div class="coordinator-row">
			<div class="coordinator-info">
				<div class="avatar avatar-coordinator" style="background: {avatar.color}">
					{#if avatar.svg}
						{@html avatar.svg}
					{:else if avatar.emoji}
						{avatar.emoji}
					{/if}
					<span class="status-ring {agent.status}"></span>
				</div>
				<div class="coordinator-name-block">
					<h2>
						{agent.agent_name}
						<span class="status-badge badge-{agent.status}">● {agent.status}</span>
					</h2>
					<div class="role">{role}</div>
				</div>
			</div>
			<div class="coordinator-meta">
				{#if agent.current_task}
					<span class="task-label">{agent.current_task}</span>
				{:else if agent.last_task}
					<span class="task-label task-label-idle">Last: {agent.last_task}</span>
				{/if}
				<span class="meta-item">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10"/>
						<path d="M12 6v6l4 2"/>
					</svg>
					{formatTimeAgo(agent.last_active_at)}
				</span>
			</div>
		</div>
	</div>
{:else if viewMode === 'card'}
	<!-- Regular Agent Card -->
	<div class="agent-card" class:stale={staleness === 'critical'}>
		<div class="agent-card-top">
			<div class="avatar" style="background: {avatar.color}">
				{#if avatar.svg}
					{@html avatar.svg}
				{:else if avatar.emoji}
					{avatar.emoji}
				{/if}
				<span class="status-ring {agent.status}"></span>
			</div>
			<div class="agent-name-block">
				<h3>{agent.agent_name}</h3>
				<div class="role">{role}</div>
			</div>
		</div>
		<div class="agent-card-body">
			<div class="agent-task" class:has-task={agent.current_task}>
				{#if agent.current_task}
					{agent.current_task}
				{:else if agent.last_task}
					<span class="task-idle-label">Last: {agent.last_task}</span>
				{:else}
					<span class="task-idle-label">No active task</span>
				{/if}
			</div>
			<div class="agent-footer">
				<span class="last-active" class:stale-warning={staleness === 'warning' || staleness === 'critical'}>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10"/>
						<path d="M12 6v6l4 2"/>
					</svg>
					{formatTimeAgo(agent.last_active_at)}
				</span>
			</div>
		</div>
	</div>
{:else if viewMode === 'compact'}
	<!-- Compact View -->
	<div class="agent-card compact">
		<div class="compact-row">
			<div class="avatar small" style="background: {avatar.color}">
				{#if avatar.svg}
					{@html avatar.svg}
				{:else if avatar.emoji}
					{avatar.emoji}
				{/if}
				<span class="status-ring small {agent.status}"></span>
			</div>
			<div class="compact-info">
				<div class="compact-name">{agent.agent_name}</div>
				<div class="compact-task">{agent.current_task || (agent.last_task ? `Last: ${agent.last_task}` : 'No active task')}</div>
			</div>
			<div class="compact-time">{formatTimeAgo(agent.last_active_at)}</div>
		</div>
	</div>
{:else}
	<!-- Table View -->
	<div class="agent-card table">
		<div class="table-row">
			<div class="avatar small" style="background: {avatar.color}">
				{#if avatar.svg}
					{@html avatar.svg}
				{:else if avatar.emoji}
					{avatar.emoji}
				{/if}
				<span class="status-ring small {agent.status}"></span>
			</div>
			<div class="table-name">
				<div>{agent.agent_name}</div>
				<div class="table-role">{role}</div>
			</div>
			<div class="table-status">
				<span class="status-dot {agent.status}">●</span>
				{agent.status}
			</div>
			<div class="table-task">{agent.current_task || (agent.last_task ? `Last: ${agent.last_task}` : 'No active task')}</div>
			<div class="table-time">{formatTimeAgo(agent.last_active_at)}</div>
		</div>
	</div>
{/if}

<style>
	/* ── Coordinator Card ── */
	.coordinator-card {
		background: var(--bg-card);
		border: 1px solid var(--accent-blue);
		border-radius: var(--radius-lg);
		padding: 20px 24px;
		margin-bottom: 8px;
		box-shadow: 0 0 20px rgba(59,130,246,0.08), var(--shadow-card);
		position: relative;
		overflow: hidden;
		animation: fadeInUp 0.4s ease;
	}

	.coordinator-card::before {
		content: '';
		position: absolute;
		top: 0; left: 0; right: 0;
		height: 2px;
		background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple), var(--accent-blue));
		background-size: 200% 100%;
		animation: shimmer 3s ease infinite;
	}

	.coordinator-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.coordinator-info {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.avatar {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 22px;
		flex-shrink: 0;
		position: relative;
	}

	.coordinator-name-block h2 {
		font-size: 17px;
		font-weight: 600;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.coordinator-name-block .role {
		font-size: 12px;
		color: var(--text-tertiary);
		margin-top: 2px;
	}

	.status-badge {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 2px 8px;
		border-radius: 10px;
		font-size: 11px;
		font-weight: 600;
		font-family: var(--font-mono);
		text-transform: uppercase;
		letter-spacing: 0.3px;
	}

	.badge-working {
		background: var(--accent-green-dim);
		color: var(--accent-green);
	}

	.badge-idle {
		background: var(--accent-amber-dim);
		color: var(--accent-amber);
	}

	.badge-error {
		background: var(--accent-red-dim);
		color: var(--accent-red);
	}

	.coordinator-meta {
		display: flex;
		align-items: center;
		gap: 20px;
		font-size: 12px;
		color: var(--text-secondary);
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 5px;
	}

	.meta-item svg {
		width: 13px;
		height: 13px;
		opacity: 0.5;
	}

	.task-label {
		font-family: var(--font-mono);
		font-size: 12px;
		color: var(--text-secondary);
		background: var(--bg-elevated);
		padding: 4px 10px;
		border-radius: var(--radius-sm);
	}

	.task-label-idle {
		color: var(--text-tertiary);
		font-style: italic;
	}

	/* ── Status Ring ── */
	.status-ring {
		position: absolute;
		bottom: -2px;
		right: -2px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 2px solid var(--bg-card);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.status-ring.small {
		width: 12px;
		height: 12px;
	}

	.status-ring.working {
		background: var(--accent-green);
	}

	.status-ring.idle {
		background: var(--accent-amber);
	}

	.status-ring.error {
		background: var(--accent-red);
	}

	.status-ring.working::after {
		content: '';
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--accent-green);
		position: absolute;
		animation: pulse-ring 2s ease infinite;
	}

	/* ── Regular Agent Card ── */
	.agent-card {
		background: var(--bg-card);
		border: 1px solid var(--border-default);
		border-radius: var(--radius-md);
		padding: 16px 18px;
		cursor: pointer;
		transition: all 0.2s ease;
		position: relative;
		animation: fadeInUp 0.4s ease backwards;
	}

	.agent-card:nth-child(1) { animation-delay: 0.05s; }
	.agent-card:nth-child(2) { animation-delay: 0.1s; }
	.agent-card:nth-child(3) { animation-delay: 0.15s; }
	.agent-card:nth-child(4) { animation-delay: 0.2s; }

	.agent-card:hover {
		background: var(--bg-card-hover);
		border-color: rgba(255,255,255,0.1);
		transform: translateY(-1px);
		box-shadow: var(--shadow-elevated);
	}

	.agent-card.stale {
		opacity: 0.55;
	}

	.agent-card.stale:hover {
		opacity: 0.85;
	}

	.agent-card-top {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 12px;
	}

	.agent-card .avatar {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		font-size: 18px;
	}

	.agent-card .avatar .status-ring {
		width: 12px;
		height: 12px;
		bottom: -2px;
		right: -2px;
	}

	.agent-name-block h3 {
		font-size: 14px;
		font-weight: 600;
		line-height: 1.2;
	}

	.agent-name-block .role {
		font-size: 11px;
		color: var(--text-tertiary);
		margin-top: 1px;
	}

	.agent-card-body {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.agent-task {
		font-family: var(--font-mono);
		font-size: 11.5px;
		color: var(--text-secondary);
		background: var(--bg-elevated);
		padding: 8px 10px;
		border-radius: var(--radius-sm);
		border-left: 2px solid var(--border-default);
		line-height: 1.5;
	}

	.agent-task.has-task {
		border-left-color: var(--accent-green);
		color: var(--text-primary);
	}

	.agent-task .task-idle-label {
		color: var(--text-tertiary);
		font-style: italic;
	}

	.agent-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.last-active {
		font-size: 11px;
		color: var(--text-tertiary);
		display: flex;
		align-items: center;
		gap: 4px;
		font-family: var(--font-mono);
	}

	.last-active svg {
		width: 11px;
		height: 11px;
		opacity: 0.4;
	}

	.last-active.stale-warning {
		color: var(--accent-amber);
	}

	/* ── Compact View ── */
	.agent-card.compact {
		padding: 12px 16px;
	}

	.compact-row {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.avatar.small {
		width: 32px;
		height: 32px;
		font-size: 16px;
		border-radius: 8px;
	}

	.compact-info {
		flex: 1;
		min-width: 0;
	}

	.compact-name {
		font-size: 13px;
		font-weight: 600;
		color: var(--text-primary);
	}

	.compact-task {
		font-size: 11px;
		color: var(--text-secondary);
		font-family: var(--font-mono);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.compact-time {
		font-size: 11px;
		color: var(--text-tertiary);
		font-family: var(--font-mono);
		white-space: nowrap;
	}

	/* ── Table View ── */
	.agent-card.table {
		padding: 12px 16px;
		border-radius: var(--radius-sm);
	}

	.table-row {
		display: grid;
		grid-template-columns: 40px 1fr auto 2fr auto;
		gap: 16px;
		align-items: center;
	}

	.table-name {
		min-width: 0;
	}

	.table-name > div {
		font-size: 13px;
		font-weight: 600;
		color: var(--text-primary);
	}

	.table-role {
		font-size: 11px;
		color: var(--text-tertiary);
		margin-top: 1px;
	}

	.table-status {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		color: var(--text-secondary);
		text-transform: capitalize;
	}

	.status-dot {
		font-size: 10px;
	}

	.status-dot.working { color: var(--accent-green); }
	.status-dot.idle { color: var(--accent-amber); }
	.status-dot.error { color: var(--accent-red); }

	.table-task {
		font-size: 11px;
		color: var(--text-secondary);
		font-family: var(--font-mono);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.table-time {
		font-size: 11px;
		color: var(--text-tertiary);
		font-family: var(--font-mono);
		white-space: nowrap;
	}

	@media (max-width: 640px) {
		.coordinator-card {
			padding: 16px;
		}

		.coordinator-row {
			flex-direction: column;
			align-items: flex-start;
			gap: 12px;
		}

		.coordinator-name-block h2 {
			flex-wrap: wrap;
		}

		.coordinator-meta {
			width: 100%;
			gap: 12px;
		}
	}
</style>
