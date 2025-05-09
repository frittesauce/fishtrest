<script>
	import SideBar from './SideBar.svelte';

	let { children } = $props();
</script>

<div class="flex flex-row">
	<SideBar></SideBar>
	{@render children?.()}
</div>
