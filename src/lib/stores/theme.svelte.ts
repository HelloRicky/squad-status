/**
 * Theme Store
 * Manages dark/light theme preference with localStorage persistence
 */

type Theme = 'dark' | 'light';

class ThemeStore {
	theme = $state<Theme>('dark');

	constructor() {
		// Load theme from localStorage on client
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('squad-theme') as Theme | null;
			this.theme = saved || 'dark';
			this.applyTheme(this.theme);
		}
	}

	toggle() {
		this.theme = this.theme === 'dark' ? 'light' : 'dark';
		this.applyTheme(this.theme);
		if (typeof window !== 'undefined') {
			localStorage.setItem('squad-theme', this.theme);
		}
	}

	setTheme(theme: Theme) {
		this.theme = theme;
		this.applyTheme(theme);
		if (typeof window !== 'undefined') {
			localStorage.setItem('squad-theme', theme);
		}
	}

	private applyTheme(theme: Theme) {
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute('data-theme', theme);
		}
	}
}

export const themeStore = new ThemeStore();
