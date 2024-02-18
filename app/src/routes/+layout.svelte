<script lang="ts">
	import '../app.css';
	import LeftNavbar from '$lib/components/LeftNavbar.svelte';
	import Header from '$lib/components/Header.svelte';
	import { browser } from '$app/environment';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	import { onMount } from 'svelte';
	onMount(() => {
		// Listen for settings changes from application
		window.electron.on('settings-save', (newData) => {
			console.log('data-recieved', newData);
			data.session.theme = newData?.theme ?? data.session.theme;
			// Update the theme in the DOM
			updateThemeCookie();
		});
	});

	function toggleTheme() {
		data.session.theme = data.session.theme === 'dark' ? 'light' : 'dark';
		updateThemeCookie();
	}

	async function updateThemeCookie() {
		window.electron.send('set-cookie', { name: 'theme', value: data.session.theme });
		// does not work in static
		if (browser) {
			console.log('updating theme in server.ts');
			await fetch('/theme', {
				method: 'PUT',
				body: data.session.theme
			});
		}
	}
</script>

<button on:click={toggleTheme}>Toggle Theme</button>

<div id="theme-container" data-theme={data.session.theme}>
	<div id="app-content">
		<Header />
		<div class="flex overflow-hidden page-max">
			<LeftNavbar />
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
