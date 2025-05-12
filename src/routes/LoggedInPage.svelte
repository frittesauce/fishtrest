<script lang="ts">
	import Post from '../components/Post.svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

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

<main class=" flex w-full flex-col items-center">
	{#each feed as feedItem}
		<Post post={feedItem}></Post>
	{/each}
</main>
