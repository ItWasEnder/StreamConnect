<script lang="ts">
	import type { EventMapping } from '$lib/types/Common';

	export let event: EventMapping;
</script>

<input class="manage-form-input" type="text" bind:value={event.event} />

<style lang="postcss">
</style>
