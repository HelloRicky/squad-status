export function formatTimeAgo(dateString: string): string {
	const now = new Date();
	const date = new Date(dateString);
	const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (seconds < 60) return 'just now';
	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	return `${days}d ago`;
}

export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return 'Today';
	if (diffDays === 1) return 'Yesterday';
	if (diffDays < 7) return `${diffDays} days ago`;

	return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function getStaleness(lastActiveAt: string | null): 'fresh' | 'warning' | 'critical' {
	if (!lastActiveAt) return 'critical';

	const now = new Date();
	const lastActive = new Date(lastActiveAt);
	const minutesAgo = (now.getTime() - lastActive.getTime()) / (1000 * 60);

	const STALE_WARNING_THRESHOLD = 15;
	const STALE_CRITICAL_THRESHOLD = 120;

	if (minutesAgo > STALE_CRITICAL_THRESHOLD) return 'critical';
	if (minutesAgo > STALE_WARNING_THRESHOLD) return 'warning';
	return 'fresh';
}

export function escapeHtml(text: string): string {
	const map: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.replace(/[&<>"']/g, (m) => map[m]);
}
