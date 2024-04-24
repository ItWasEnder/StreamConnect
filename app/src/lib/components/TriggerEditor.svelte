<script lang="ts">
	import { onMount } from 'svelte';
	import TriggerEventItem from './TriggerEventItem.svelte';

	import '../../app.css';

	const DEFAULT: FETrigger = JSON.parse(
		'{"lastExecuted":0,"id":"wthrow","name":"Wildcard Throw Command","events":[{"event":"tiktok-chat","conditions":[{"order":0,"data_path":"data.comment","negate":false,"ignore_case":true,"operation":"starts_with","value":"!throw"}]}],"actions":[{"caller":"internal","providerId":"tits","providerKey":{"categoryId":"tits-throw-items","actions":[]},"bypass_cooldown":false,"context":{"tryItem":"${data.comment}","count":1,"delay":0.1}}],"cooldown":0,"log":true,"enabled":true,"__cd":0}'
	);

	export let trigger: FETrigger = DEFAULT;
	export let onSubmit: (updatedTrigger: FETrigger) => void = () => {};
	export let closeOnSubmit: boolean = true;
	export let clickOutExit: boolean = true;

	let form: HTMLDialogElement;
	let modalTitle = DEFAULT.name;

	onMount(() => {
		if (form) form.showModal();
	});

	export function openWith(editing: FETrigger) {
		trigger = editing;
		modalTitle = trigger.name;
		if (form) form.showModal();
	}

	export function close() {
		trigger = undefined;
		if (form) form.close();
	}

	function isSpecialKey(event) {
		return (
			event.key === 'ArrowLeft' ||
			event.key === 'ArrowRight' ||
			event.key === 'Backspace' ||
			event.key === 'Delete' ||
			event.key === 'Tab' ||
			event.key === 'Home' ||
			event.key === 'End'
		);
	}

	function handlePressNumberInput(
		event: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement }
	) {
		if (!(event.key >= '0' && event.key <= '9') && !isSpecialKey(event)) {
			if (
				(event.ctrlKey || event.metaKey) &&
				(event.key === 'a' || event.key === 'z' || event.key === 'y')
			)
				return;

			event.preventDefault();
		}
	}

	function handleNumberInput(event: any) {
		var num = event.target.value;
		if (num < 0) {
			event.target.value = 0;
		} else if (num > Number.MAX_SAFE_INTEGER) {
			event.target.value = Number.MAX_SAFE_INTEGER - 1;
		}

		event.target.value = Math.floor(num);
	}
</script>

<dialog id="trigger-editor" class="modal" bind:this={form}>
	<!-- Close by clicking out of -->
	{#if clickOutExit}
		<form method="dialog" class="modal-backdrop">
			<button on:click={close}>close</button>
		</form>
	{/if}

	<div class="modal-box w-11/12 max-w-5xl v-scrollable">
		{#if trigger}
			<h2 class="font-bold text-lg mb-3">{modalTitle}</h2>

			<form
				class="manage-form"
				on:submit|preventDefault={() => {
					onSubmit(trigger);

					if (form && closeOnSubmit) form.close();
				}}
			>
				{#if !trigger.__new}
					<p>ID: <span class="badge badge-accent">{trigger.id}</span></p>
				{:else}
					<label>
						<p>ID:</p>
						<input class="manage-form-input" type="text" bind:value={trigger.id} />
					</label>
				{/if}
				<label>
					<p>Status:</p>
					<input type="checkbox" class="toggle toggle-success" bind:checked={trigger.enabled} />
				</label>
				<label>
					<p>Log:</p>
					<input type="checkbox" class="toggle toggle-success" bind:checked={trigger.log} />
				</label>
				<label>
					<p>Name:</p>
					<input class="manage-form-input" type="text" bind:value={trigger.name} />
				</label>
				<label>
					<p>Cooldown:</p>
					<span class="w-10 gap">
						<input
							type="text"
							class="bg-transparent w-10"
							bind:value={trigger.__cd}
							on:keydown={handlePressNumberInput}
							on:input={handleNumberInput}
						/></span
					>
					<input
						type="range"
						min="0"
						max="120"
						step="1"
						bind:value={trigger.__cd}
						class="range range-xs max-w-md range-accent"
					/>
				</label>

				<div class="divider divider-start dy-5" />

				<h2 class="font-bold text-lg mb-3">Events</h2>

				<!-- Events -->
				{#each trigger.events as event}
					<div class="">
						<TriggerEventItem {event} />
					</div>
				{/each}

				<pre>{JSON.stringify(trigger, null, 2)}</pre>

				<!-- Modal Actions -->
				<div class="modal-action">
					<form method="dialog">
						<button class="btn btn-sm btn-circle text-error btn-ghost absolute right-2 top-2"
							>✕</button
						>
					</form>

					<button type="submit" class="btn btn-success"> Submit </button>
				</div>
			</form>
		{:else}
			<p class="text-error">No trigger selected</p>
		{/if}
	</div>
</dialog>

<style lang="postcss">
	.manage-form label {
		@apply gap-2;
		margin-top: 1rem;
		display: flex;
		align-items: center;
	}

	.manage-form-input {
		@apply input input-info bg-slate-700 text-base-content w-3/6;
		outline: none;
	}
</style>
