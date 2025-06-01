<script lang="ts">
	import { env } from '$env/dynamic/public';
	import type PostType from '@/types/post';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import Post from '../../components/Post.svelte';
	import { currentProfile } from '@/stores/profile';
	import { afterNavigate, goto } from '$app/navigation';
	import { authClient } from '@/auth-client';
	import { LogOut } from '@lucide/svelte';

	let { data } = $props<{
		profile: {
			id: number;
			avatarUrl: string;
			handle: string;
			bio: string;
			followers: number;
			following: number;
		};
	}>();

	let posts: PostType[] = $state([]);
	let following = $state();
	let followers = $state(data.profile.followers);

	async function loadUserPosts() {
		const response = await fetch(`/api/feed?type=profile&handle=${data.profile.handle}`);

		if (!response.ok) {
			return toast.error('failed to fetch posts, try again later!');
		}

		const body = await response.json();

		posts = body;
	}

	async function loadFollowing() {
		const response = await fetch(`/api/isFollowing?username=${data.profile.handle}`);

		if (!response.ok) {
			following = false;
		}

		const body = await response.json();

		following = body;
	}

	afterNavigate(async () => {
		loadUserPosts();

		loadFollowing();
	});

	onMount(async () => {
		loadUserPosts();

		loadFollowing();
	});
</script>

<div class="flex w-screen flex-col items-center">
	<div class="my-8 flex flex-col rounded bg-gray-300 p-8 shadow md:flex-row">
		<img
			src={`${env.PUBLIC_CDN_URL}/${data.profile.avatarUrl}`}
			alt={`profile image of ${data.profile.handle}`}
			class=" mr-6 w-auto rounded-lg"
		/>
		<div class="flex flex-col justify-between">
			<div>
				<h1 class=" text-3xl font-semibold">{data.profile.handle}</h1>
				<hr class="my-3 w-full" />
				<p class=" text-lg">
					{data.profile.bio}
				</p>
			</div>
			<div class="flex flex-col">
				<p>followers: {followers}</p>
				<p>following: {data.profile.following}</p>
			</div>
			{#if data.profile.id != $currentProfile?.id}
				<button
					onclick={async () => {
						if (!$currentProfile) goto('/');
						followers = following ? followers - 1 : Number(followers) + 1;
						following = !following;
						await fetch('/api/follow', {
							method: 'POST',
							body: JSON.stringify({ targetHandle: data.profile.handle })
						});
					}}
					class=" flex cursor-pointer flex-row items-center gap-x-2 rounded-md border-4 border-indigo-900 bg-indigo-400 p-2 align-middle text-xl font-bold text-white shadow shadow-indigo-800"
				>
					{following ? 'unfollow' : 'follow'}
				</button>
			{:else}
				<button
					onclick={() => {
						authClient.signOut({
							fetchOptions: {
								onSuccess: () => {
									goto('/', { invalidateAll: true });
								}
							}
						});
					}}
					class=" flex cursor-pointer flex-row items-center gap-x-2 rounded-md border-4 border-red-900 bg-red-400 p-2 align-middle text-xl font-bold text-white shadow shadow-red-800"
				>
					<LogOut />
					logout
				</button>
			{/if}
		</div>
	</div>

	<div class=" mx-8 flex flex-col gap-y-8">
		{#each posts as post (post.id)}
			<Post
				{post}
				onDeleteSucess={() => {
					goto(`/${post.user.handle}`);
				}}
			></Post>
		{/each}
	</div>
</div>
