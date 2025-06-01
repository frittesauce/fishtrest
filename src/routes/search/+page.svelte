<script lang="ts">
	import type PostType from '@/types/post';
	import Post from '../../components/Post.svelte';
	import { toast } from 'svelte-sonner';
	import { onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { writable } from 'svelte/store';
	import LoadingComponent from '../../components/LoadingComponent.svelte';
	import Avatar from '../../components/Avatar.svelte';
	import { env } from '$env/dynamic/public';
	import { goto } from '$app/navigation';

	let url = new URL(window.location.href);

	const query = writable(url.searchParams.get('prompt') ?? '');
	const posts = writable<PostType[]>([]);
	const users = writable<
		{
			id: number;
			handle: string;
			avatarUrl: string;
		}[]
	>([]);

	let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

	const unsubscribe = query.subscribe((value) => {
		const currentUrl = new URL(window.location.href);
		currentUrl.searchParams.set('prompt', value);
		history.replaceState(null, '', currentUrl.toString());

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
			if (!body || body.posts.length < 1) {
				toast.error('No posts found');
			} else {
				posts.set(body.posts);
				users.set(body.users);
			}
		} else {
			toast.error('Search failed');
		}
	}
</script>

<div class=" flex w-full flex-col items-center align-middle">
	<div>
		<form onsubmit={searchHandle}>
			<input
				class="mt-4 mb-2 w-full rounded-full border border-gray-400 p-1 px-2 text-2xl shadow"
				placeholder="search..."
				bind:value={$query}
			/>
		</form>
		<div class="mt-2 flex flex-col">
			{#if $users.length > 0}
				<p class="text-2xl font-bold">Users:</p>
				<div class="mb-5 flex">
					{#each $users as user (user.id)}
						<button
							class="flex cursor-pointer items-center rounded-md bg-gray-400 p-2 align-middle shadow"
							onclick={() => {
								goto(`/${user.handle}`);
							}}
						>
							<Avatar src={`${env.PUBLIC_CDN_URL}/${user.avatarUrl}`} />
							<h1 class="ml-2 text-2xl font-semibold">{user.handle}</h1>
						</button>
					{/each}
				</div>
			{/if}
			<div class="flex flex-col gap-y-4">
				<p class="text-2xl font-bold">Posts:</p>
				{#if $posts.length > 0}
					{#each $posts as post (post.id)}
						<Post {post} />
					{/each}
				{:else}
					<Post />
				{/if}
			</div>
		</div>
	</div>
</div>
