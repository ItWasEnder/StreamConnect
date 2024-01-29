<script lang="ts">
	import { page } from '$app/stores';
</script>

<h1 class="text-3xl font-bold">Welcome to {$page.params.service}</h1>

<pre>
{JSON.stringify($page, null, 2)}
</pre>
