<script lang="ts">
	import type PostType from '@/types/post';
	import Post from '../../components/Post.svelte';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { writable, derived } from 'svelte/store';

	// Set initial query from URL
	const query = writable(get(page).url.searchParams.get('prompt') ?? '');
	const posts = writable<PostType[]>([]);

	let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

	// Run search when query changes (with debounce)
	const unsubscribe = query.subscribe((value) => {
		if (debounceTimeout) clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			searchHandle();
		}, 500);
	});

	onDestroy(() => {
		if (debounceTimeout) clearTimeout(debounceTimeout);
		unsubscribe();
	});

	async function searchHandle(e?: Event) {
		e?.preventDefault();
		const currentQuery = get(query);

		if (!currentQuery.trim()) {
			return;
		}

		const response = await fetch(`/api/search?query=${encodeURIComponent(currentQuery)}`);

		if (response.ok) {
			const body = await response.json();
			if (!body || body.length < 1) {
				toast.error('No posts found');
			} else {
				posts.set(body);
			}
		} else {
			toast.error('Search failed');
		}
	}
</script>

<div class=" flex w-full flex-col items-center align-middle">
	<div>
		<p>We is searching vro</p>

		<form on:submit={searchHandle}>
			<input bind:value={$query} />
			<button type="submit">Search bro</button>
		</form>

		{#if $posts.length > 0}
			{#each $posts as post (post.id)}
				<Post {post} />
			{/each}
		{:else}
			<p>type someting</p>
		{/if}
	</div>
</div>
