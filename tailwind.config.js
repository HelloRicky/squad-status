/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				serif: ['EB Garamond', 'serif'],
				sans: ['Inter', 'sans-serif']
			}
		}
	},
	plugins: []
};
