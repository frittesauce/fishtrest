<script lang="ts">
	import Post from '../components/Post.svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { activeFeed, mainFeed } from '@/stores/feed';

	let final;
	// &excludePosts=${$mainFeed.length > 0 ? $mainFeed.map((post: any) => post.id).join(',') : `0`}
	async function loadPosts(append = false) {
		const response = await fetch(`/api/feed?type=${$activeFeed}`);

		if (!response.ok) {
			return toast.error('failed to fetch feed, try again later!');
		}

		const body = await response.json();

		if (append) {
			if (body.length < 1) {
				return toast.error('cant load more posts sorry!');
			}
			mainFeed.update((f) => {
				if (f.length > 250) f = f.slice(50);
				return f.concat(body);
			});
		} else {
			mainFeed.set(body);
		}
	}

	onMount(async () => {
		if ($mainFeed.length > 0) {
		} else {
			loadPosts();
		}
	});
</script>

<main class=" flex w-full flex-col items-center pb-24 md:pb-0">
	<div class=" flex flex-row justify-between text-3xl">
		<button
			class={` cursor-pointer ${$activeFeed == 'main' ? 'text-indigo-500' : 'text-black'} m-4`}
			onclick={() => {
				activeFeed.set('main');
				loadPosts();
			}}>main</button
		>
		<button
			class={` cursor-pointer ${$activeFeed == 'following' ? 'text-indigo-500' : 'text-black'} m-4`}
			onclick={() => {
				activeFeed.set('following');
				loadPosts();
			}}>following</button
		>
	</div>
	<div class=" mx-8 flex flex-col gap-y-8">
		{#each $mainFeed as feedItem (feedItem.id)}
			<Post post={feedItem}></Post>
		{/each}
	</div>
</main>
