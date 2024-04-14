<script lang="ts">
	export let trigger: Trigger = undefined;

	export let button = () => {
		console.log('Trigger card clicked');
	};
</script>

<button
	id={trigger.id}
	class="card p-5 bg-neutral shadow-xl card-normal w-auto min-h-36 h-auto max-w-[17em] text-left flex flex-col justify-between"
	on:click={button}
>
	<h2 class="card-title">{trigger.name}</h2>

	<div class="flex items-center">
	</div>

	<div class="flex items-center item-stats">
		<span class="tooltip tooltip-accent" data-tip={trigger.enabled ? "Enabled" : "Disabled"}>
			<iconify-icon
				inline
				class="mr-1 {trigger.enabled ? 'text-green-400' : 'text-red-400'}"
				icon="mdi:power"
			/>
			<!-- {trigger.enabled ? 'Enabled' : 'Disabled'} -->
		</span>

		<span class="tooltip tooltip-accent" data-tip="Conditions">
			<iconify-icon inline class="mr-1 text-yellow-400" icon="mdi:list-status" />
			{trigger.events.map((e) => e.conditions.length).reduce((a, b) => a + b)}
		</span>

		<span class="tooltip tooltip-accent" data-tip="Actions">
			<iconify-icon inline class="mr-1 text-teal-400" icon="mdi:cog-play" />
			{trigger.actions.length}
		</span>

		<span class="tooltip tooltip-accent" data-tip="Cooldown">
			<iconify-icon inline class="mr-1 text-orange-400" icon="mdi:history" />
			{trigger.cooldown / 1000}s
		</span>
	</div>
</button>

<style>
    .item-stats span {
        padding-right: 1rem;
    }
</style>
