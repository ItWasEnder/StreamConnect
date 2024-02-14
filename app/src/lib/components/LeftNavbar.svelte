<script lang="ts">
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';

	const route = derived(page, ($page) => $page.route.id);
</script>

<!-- <pre>
{JSON.stringify($page, null, 2)}
</pre> -->

<div class="flex h-full bg-base-200 w-56">
	<div>
		<ul class="nav-items menu menu-vertical w-56 bg-base-200">
			<div class="text-xl font-medium">
				<li class:active={$route === '/'}><a href="/">Start</a></li>
				<li class:active={$route === '/connections'}><a href="/connections">Connections</a></li>
				<li class:active={$route === '/settings'}><a href="/settings">Settings</a></li>
				<li class:active={$route === '/support'}><a href="/support">Support</a></li>
			</div>
		</ul>
	</div>
</div>

<style>
	.nav-items {
		padding: 0;
	}

	.nav-items li {
		list-style: none;
	}

	.nav-items a {
		justify-content: center;
		border-radius: 0;
		padding: 1rem 0;
	}

	.nav-items li.active {
		@apply bg-secondary text-secondary-content;
	}
</style>
