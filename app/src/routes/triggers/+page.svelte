<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import TriggerCard from '$lib/components/TriggerCard.svelte';
	import TriggerEditor from '$lib/components/TriggerEditor.svelte';

	const URL = 'http://127.0.0.1:14228';

	const triggersStore = writable<FETrigger[]>([]);
	$: visibleTriggers = search.length > 0 ? filter() : $triggersStore;

	let editingTrigger: FETrigger | null = null;
	let triggerEditor: TriggerEditor;
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
					trigger.__cd = trigger.cooldown / 1000;
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

	function editTrigger(trigger?: Trigger) {
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
				__new: true,
				__cd: 5
			};
		}

		openTriggerManager();
	}

	function openTriggerManager() {
		if (triggerEditor && editingTrigger) triggerEditor.openWith(editingTrigger);
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

	async function submitUpdateAndClose(editedTrigger: FETrigger) {
		editingTrigger.cooldown = editingTrigger.__cd * 1000;

		if (editingTrigger.__new) {
			await createTrigger();
		} else {
			await updateTrigger();
		}

		if (triggerEditor) triggerEditor.close();
	}
</script>

<div>
	<TriggerEditor bind:this={triggerEditor} clickOutExit={false}/>
</div>

<div>
	<button class="btn btn-warning m-5" on:click={() => editTrigger(undefined)}>New</button>

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
		<TriggerCard {trigger} button={() => editTrigger(trigger)} />
	{/each}
</div>

<style lang="postcss">
</style>
