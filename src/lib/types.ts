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
	// Alias for database compatibility
	'Ducki': {
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
	'Ducki': 'PM / Coordinator', // Alias
	Pixel: 'Frontend Engineer',
	Linus: 'Backend & DevOps',
	Tesla: 'QA & Research',
	Shakespeare: 'Content & Growth'
};

export const agentTimelineColors: Record<string, string> = {
	'Ducki (Main)': 'var(--accent-amber)',
	'Ducki': 'var(--accent-amber)', // Alias
	Pixel: 'var(--accent-pink)',
	Linus: 'var(--accent-cyan)',
	Tesla: 'var(--accent-purple)',
	Shakespeare: 'var(--accent-amber)'
};

/**
 * Resolves an agent name from the database to its canonical form used in lookups.
 * Handles case-insensitive matching and common name variants.
 */
export function resolveAgentName(name: string): string {
	// If exact match exists, return it
	if (agentAvatars[name]) return name;

	// Try case-insensitive + partial match
	const lower = name.toLowerCase();
	for (const key of Object.keys(agentAvatars)) {
		const keyLower = key.toLowerCase();
		// Check if keys match exactly (case-insensitive)
		if (keyLower === lower) return key;
		// Check if the canonical name starts with the database name
		if (keyLower.startsWith(lower)) return key;
		// Check if the database name is contained in canonical name (e.g., "Ducki" matches "Ducki (Main)")
		if (keyLower.includes(lower) && lower.length >= 3) return key;
	}

	// No match found, return original
	return name;
}
