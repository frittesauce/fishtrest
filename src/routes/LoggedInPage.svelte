<script lang="ts">
	import Post from '../components/Post.svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { activeFeed, mainFeed } from '@/stores/feed';

	async function loadPosts() {
		const response = await fetch(`/api/feed?type=${$activeFeed}`);

		if (!response.ok) {
			return toast.error('failed to fetch feed, try again later!');
		}

		mainFeed.set(await response.json());
	}

	onMount(async () => {
		loadPosts();
	});
</script>

<main class=" flex w-full flex-col items-center pb-48">
	<div class="flex flex-row">
		<button
			onclick={() => {
				activeFeed.set('main');
				loadPosts();
			}}>main</button
		>
		<button
			onclick={() => {
				activeFeed.set('following');
				loadPosts();
			}}>following</button
		>
	</div>
	<div class=" mx-8">
		{#each $mainFeed as feedItem (feedItem.id)}
			<Post post={feedItem}></Post>
			<hr />
		{/each}
	</div>
</main>
