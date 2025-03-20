<script>
	import { authClient } from '$lib/auth-client';
	import Sidebar from './Sidebar.svelte';

	let { children } = $props();

	async function logout() {
		await authClient.signOut();
	}
</script>

<div>
	<Sidebar></Sidebar>
	<main>
		<button onclick={logout}> logout yahooo!! </button>
		{@render children?.()}
	</main>
</div>
