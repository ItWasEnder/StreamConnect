/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	plugins: [require('daisyui'), require('tailwind-scrollbar')({ nocompatible: true })],
	daisyui: {
		themes: ['light', 'dark', 'dracula', 'sunset', 'forest', 'coffee'],
		darkTheme: 'dark',
		base: true,
		styled: true,
		utils: true,
		prefix: '',
		logs: false,
		themeRoot: ':root'
	}
};
