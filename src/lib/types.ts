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
		svg: `<svg viewBox="0 0 100 100" class="w-full h-full">
			<defs>
				<linearGradient id="ducki-body" x1="0%" y1="0%" x2="0%" y2="100%">
					<stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
					<stop offset="100%" style="stop-color:#ffb700;stop-opacity:1" />
				</linearGradient>
				<radialGradient id="ducki-shine" cx="30%" cy="30%">
					<stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.4" />
					<stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
				</radialGradient>
			</defs>
			<ellipse cx="50" cy="60" rx="32" ry="28" fill="url(#ducki-body)"/>
			<ellipse cx="50" cy="60" rx="32" ry="28" fill="url(#ducki-shine)"/>
			<circle cx="50" cy="35" r="20" fill="url(#ducki-body)"/>
			<circle cx="50" cy="35" r="20" fill="url(#ducki-shine)"/>
			<circle cx="43" cy="32" r="3.5" fill="#1a1a1a"/>
			<circle cx="57" cy="32" r="3.5" fill="#1a1a1a"/>
			<circle cx="44" cy="31" r="1.5" fill="#ffffff"/>
			<circle cx="58" cy="31" r="1.5" fill="#ffffff"/>
			<ellipse cx="50" cy="40" rx="6" ry="4" fill="#ff8c00"/>
			<path d="M 44 40 Q 50 42 56 40" stroke="#d67000" stroke-width="0.8" fill="none"/>
			<ellipse cx="70" cy="58" rx="12" ry="16" fill="#ffb700" transform="rotate(-20 70 58)"/>
			<ellipse cx="30" cy="58" rx="12" ry="16" fill="#ffb700" transform="rotate(20 30 58)"/>
			<ellipse cx="38" cy="50" rx="8" ry="6" fill="#ffffff" opacity="0.3"/>
		</svg>`,
		color: 'from-white to-white'
	},
	Pixel: {
		emoji: '🎨',
		color: 'from-purple-400 to-pink-400'
	},
	Linus: {
		emoji: '🐧',
		color: 'from-blue-400 to-cyan-400'
	},
	Tesla: {
		emoji: '⚡',
		color: 'from-green-400 to-emerald-400'
	},
	Shakespeare: {
		emoji: '📜',
		color: 'from-amber-400 to-yellow-400'
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
	'Ducki (Main)': '#FFD700',
	Pixel: '#A855F7',
	Linus: '#06B6D4',
	Tesla: '#10B981',
	Shakespeare: '#F59E0B'
};
