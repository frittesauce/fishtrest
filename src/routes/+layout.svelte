<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
  <title>fishtrest</title>
  <meta name="description" content="jan willem">
</svelte:head>

{@render children()}
