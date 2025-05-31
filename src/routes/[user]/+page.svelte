<script lang="ts">
	import { env } from '$env/dynamic/public';
	import type PostType from '@/types/post';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import Post from '../../components/Post.svelte';
	import { currentProfile } from '@/stores/profile';
	import { afterNavigate, goto } from '$app/navigation';
	import { authClient } from '@/auth-client';

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

<div class="flex flex-col w-screen items-center">
	<div class="flex">
		<img
			src={`${env.PUBLIC_CDN_URL}/${data.profile.avatarUrl}`}
			alt={`profile image of ${data.profile.handle}`}
		/>
		<div>
			<h1>{data.profile.handle}</h1>
			<p>
				{data.profile.bio}
			</p>
			<div class="flex flex-row">
				<p>followers: {followers} ,</p>
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
				>
					{following ? 'unfollow' : 'follow'}
				</button>
			{:else}
			<button onclick={() => {
				authClient.signOut()
			}}>
				logout
			</button>
			{/if}
		</div>

	</div>
	<div>
		{#each posts as post (post.id)}
			<Post {post}></Post>
			<hr />
		{/each}
	</div>
</div>
