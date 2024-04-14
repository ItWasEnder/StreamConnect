<script lang="ts">
	import '../app.css';
	import 'iconify-icon';
	import LeftNavbar from '$lib/components/LeftNavbar.svelte';
	import Header from '$lib/components/Header.svelte';
	import { browser } from '$app/environment';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	const themes = ['dark', 'dracula', 'sunset', 'forest', 'coffee', 'light'];
	let themeIndex = 0;

	import { onMount } from 'svelte';
	onMount(() => {
		// Listen for settings changes from application
		if (window.electron) {
			window.electron.on('get-cookie-reply', (cookies) => {
				console.log('cookie recieved', cookies);
				const theme = cookies.find((cookie) => cookie.name === 'theme')?.value;

				console.log('theme found', theme);
				data.session.theme = theme ?? data.session.theme;
			});

			console.log('getting theme');
			window.electron.send('get-cookie', {});
		}
	});

	function nextTheme() {
		if (themeIndex === themes.length - 1) {
			themeIndex = 0;
		}

		data.session.theme = themes[themeIndex];
		themeIndex++;

		updateThemeCookie();
	}

	async function updateThemeCookie() {
		window.electron.send('set-cookie', { name: 'theme', value: data.session.theme });
	}
</script>

<div id="theme-container" data-theme={data.session.theme}>
	<div id="app-content">
		<Header />
		<div class="flex overflow-hidden page-max">
			<LeftNavbar />
			<button on:click={nextTheme} class="btn btn-info btn-square">Next Theme</button>
			<div class="w-full m-5">
				<div
					class="pg-content bg-base-200 p-5 rounded-box
				scrollbar-thumb-neutral
				scrollbar-track-base-300
				scrollbar-thumb-rounded
				scrollbar-track-rounded
				scrollbar-thin"
				>
					<slot />
				</div>
			</div>
		</div>
	</div>
</div>
