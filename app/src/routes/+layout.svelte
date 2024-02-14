<script>
	import '../app.css';
	import LeftNavbar from '$lib/components/LeftNavbar.svelte';
	import TopNavbar from '$lib/components/TopNavbar.svelte';
</script>

<div class="flex-1">
	<TopNavbar />
</div>

<div class="flex overflow-hidden layout">
	<div>
		<LeftNavbar />
	</div>
	<div class="w-full m-5">
		<div
			class="content bg-base-200 p-5 rounded-box
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

<style>
	.layout {
		height: calc(100vh - 4rem);
	}

	.content {
		overflow-x: hidden;
		max-height: calc(100vh - 6.5rem);
		/* width: calc(100vw - 16rem); */
	}
</style>
