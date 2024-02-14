<script context="module" lang="ts">
	export { customError as error };
	export let status: number;
	export let customError: Error;
</script>

<main>
	<h1>Error {status}</h1>
	<pre>{customError.message}</pre>
</main>

<style>
	main {
		padding: 2em;
		text-align: center;
	}

	h1 {
		color: #ff3838;
	}

	pre {
		white-space: pre-wrap;
	}
</style>
