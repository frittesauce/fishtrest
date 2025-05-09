<script lang="ts">
	import Post from '../components/Post.svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import SideBar from '../components/SideBar.svelte';
	import AppLayout from '../components/AppLayout.svelte';

	let feed: [] = [];

	onMount(async () => {
		const response = await fetch('/api/feed');

		if (!response.ok) {
			return toast.error('failed to fetch feed, try again later!');
		}

		feed = await response.json();
		console.log(feed);
	});
</script>

<AppLayout>
	<main class=" flex flex-wrap justify-between">
		{#each feed as feedItem}
			<Post post={feedItem}></Post>
		{/each}
	</main>
</AppLayout>
