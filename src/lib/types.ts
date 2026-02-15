export interface Agent {
	agent_id: string;
	agent_name: string;
	status: 'idle' | 'working' | 'error';
	current_task: string | null;
	last_active_at: string;
	created_at: string;
	updated_at: string;
}

export interface Activity {
	id: string;
	agent_name: string;
	task: string;
	status: string;
	started_at: string;
	ended_at: string | null;
	created_at: string;
}

export type ViewMode = 'card' | 'compact' | 'table';
export type SortBy = 'status' | 'name' | 'lastActive';
export type StatusFilter = 'all' | 'working' | 'idle' | 'error';

export const agentAvatars: Record<string, { emoji?: string; svg?: string; color: string }> = {
	'Ducki (Main)': {
		emoji: '🦆',
		color: 'linear-gradient(135deg, #f59e0b, #f97316)'
	},
	Pixel: {
		emoji: '🎨',
		color: 'linear-gradient(135deg, #ec4899, #f43f5e)'
	},
	Linus: {
		emoji: '🤖',
		color: 'linear-gradient(135deg, #06b6d4, #0ea5e9)'
	},
	Tesla: {
		emoji: '⚡',
		color: 'linear-gradient(135deg, #a78bfa, #8b5cf6)'
	},
	Shakespeare: {
		emoji: '📜',
		color: 'linear-gradient(135deg, #f59e0b, #eab308)'
	}
};

export const agentRoles: Record<string, string> = {
	'Ducki (Main)': 'PM / Coordinator',
	Pixel: 'Frontend Engineer',
	Linus: 'Backend & DevOps',
	Tesla: 'QA & Research',
	Shakespeare: 'Content & Growth'
};

export const agentTimelineColors: Record<string, string> = {
	'Ducki (Main)': 'var(--accent-amber)',
	Pixel: 'var(--accent-pink)',
	Linus: 'var(--accent-cyan)',
	Tesla: 'var(--accent-purple)',
	Shakespeare: 'var(--accent-amber)'
};
