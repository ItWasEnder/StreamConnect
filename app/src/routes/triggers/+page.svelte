<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import TriggerCard from '$lib/components/TriggerCard.svelte';

	const URL = 'http://127.0.0.1:14228';

	const triggersStore = writable<Trigger[]>([]);
	$: visibleTriggers = search.length > 0 ? filter() : $triggersStore;

	let editingTrigger: FETrigger | null = null;
	let triggerManager: HTMLDialogElement;
	let modalTitle = '';
	let search = '';

	function filter() {
		console.log('Filtering triggers');
		let filtered = $triggersStore.filter((trigger) => {
			return trigger.name.toLowerCase().match(`${search.toLowerCase()}.*`);
		});

		return filtered;
	}

	async function loadTriggers() {
		try {
			const response = await fetch(URL + '/api/triggers');
			if (response.ok) {
				const triggers = await response.json();

				for (let trigger of triggers) {
					trigger.__cdSeconds = trigger.cooldown / 1000;
				}

				triggersStore.set(triggers);
			} else {
				console.error('Failed to fetch triggers:', response.status, response.statusText);
			}
		} catch (error) {
			console.error('Error fetching triggers:', error);
		}
	}

	onMount(loadTriggers);

	function selectTrigger(trigger?: Trigger) {
		if (trigger) {
			editingTrigger = { ...trigger };
		} else {
			editingTrigger = {
				name: 'New Trigger',
				enabled: true,
				log: true,
				cooldown: 5000,
				events: [],
				actions: [],
				id: crypto.randomUUID(),
				__newInstance: true,
				__cdSeconds: 5
			};
		}

		modalTitle = editingTrigger.name;
		if (triggerManager) triggerManager.showModal(); // Show the modal after setting the selected trigger
	}

	async function updateTrigger() {
		try {
			if (!editingTrigger) return;

			const response = await fetch(`${URL}/api/triggers`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(editingTrigger as Trigger)
			});

			if (response.ok) {
				console.log('Trigger updated successfully');
			} else {
				console.error('Failed to update trigger:', response.status, response.statusText);
			}

			await loadTriggers();
		} catch (error) {
			console.error('Error updating trigger:', error);
		}
	}

	async function createTrigger() {
		try {
			if (!editingTrigger) return;

			const response = await fetch(`${URL}/api/triggers`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(editingTrigger as Trigger)
			});

			if (response.ok) {
				console.log('Trigger created successfully');
			} else {
				console.error('Failed to create trigger:', response.status, response.statusText);
			}

			await loadTriggers();
		} catch (error) {
			console.error('Error creating trigger:', error);
		}
	}

	async function submitUpdateAndClose() {
		editingTrigger.cooldown = editingTrigger.__cdSeconds * 1000;

		if (editingTrigger.__newInstance) {
			await createTrigger();
		} else {
			await updateTrigger();
		}

		if (triggerManager) {
			triggerManager.close(); // Close the modal dialog
		}
	}
</script>

<div>
	<button class="btn btn-warning m-5" on:click={() => selectTrigger(undefined)}>New</button>

	<input
		type="text"
		placeholder="Search triggers"
		class="mb-5 w-full input input-primary input-bordered"
		bind:value={search}
	/>

	<div class="text-base font-medium">
		<p>
			Triggers are used to automate actions based on certain conditions. You can create triggers to
			automate actions provided by the different modules enabled.
		</p>
	</div>

	<div class="divider divider-start dy-5" />
</div>

<div class="grid md:grid-cols-3 sm:grid-cols-1 xl:grid-cols-5 gap-6">
	{#each visibleTriggers as trigger (trigger.id)}
		<TriggerCard {trigger} button={() => selectTrigger(trigger)} />
	{/each}
</div>

<dialog id="triggerManager" class="modal" bind:this={triggerManager}>
	<!-- Close by clicking out of -->
    <form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>

	<div class="modal-box w-11/12 max-w-5xl">
		{#if editingTrigger}
			<p class="font-bold md:text-lg sm:text-sm mb-3">{modalTitle}</p>

			<form class="manage-form" on:submit|preventDefault={submitUpdateAndClose}>
				{#if !editingTrigger.__newInstance}
					<p>ID: <span class="badge badge-accent">{editingTrigger.id}</span></p>
				{:else}
					<label>
						<p>ID:</p>
						<input class="manage-form-input" type="text" bind:value={editingTrigger.id} />
					</label>
				{/if}
				<label>
					<p>Status:</p>
					<input
						type="checkbox"
						class="toggle toggle-success"
						bind:checked={editingTrigger.enabled}
					/>
				</label>
				<label>
					<p>Log:</p>
					<input type="checkbox" class="toggle toggle-success" bind:checked={editingTrigger.log} />
				</label>
				<label>
					<p>Name:</p>
					<input class="manage-form-input" type="text" bind:value={editingTrigger.name} />
				</label>
				<label>
					<p>Cooldown:</p>
					<span class="w-10 gap">
						<input
							type="text"
							class="bg-transparent w-10"
							bind:value={editingTrigger.__cdSeconds}
						/></span
					>
					<input
						type="range"
						min="0"
						max="120"
						step="1"
						bind:value={editingTrigger.__cdSeconds}
						class="range range-xs max-w-md range-accent"
					/>
				</label>

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
