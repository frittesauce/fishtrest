<script lang="ts">
	import { env } from '$env/dynamic/public';
	import type PostType from '@/types/post';
	import PostDescription from './PostStuff/PostDescription.svelte';
	import { Heart, Trash2 } from '@lucide/svelte';
	import { currentProfile } from '@/stores/profile';
	import { mainFeed } from '@/stores/feed';
	import { goto } from '$app/navigation';
	import { combinedRegex, hashtagRegex, tagRegex } from '@/utils';
	import Avatar from './Avatar.svelte';
	import { PUBLIC_CDN_URL } from '$env/static/public';

	let {
		post = {
			id: 0,
			title: 'no posts found',
			description: 'post couldnt be found try another query',
			image: '404.webp',
			likedByUser: false,
			likeCount: 0,
			user: {
				id: 0,
				handle: '@404',
				avatarUrl: '404.webp'
			}
		},
		postPage,
		onDeleteSucess = () => {
			mainFeed.update((a) => {
				return a.filter((p) => p.id !== post.id);
			});
		}
	}: { post?: PostType; postPage?: boolean; onDeleteSucess?: Function } = $props();

	let likedTs = $state(post.likedByUser);
	let likeCnt: number = $state(post.likeCount);

	let deleteButtonDisabled = $state(false);
</script>

<div class="flex w-fit flex-col items-center justify-center rounded-xl bg-gray-300 p-8 shadow">
	<div class="mb-2 flex w-full flex-row justify-between">
		<button
			class="flex cursor-pointer items-center rounded-md bg-gray-400 p-2 align-middle shadow"
			onclick={() => {
				goto(`/${post.user.handle}`);
			}}
		>
			<Avatar src={`${env.PUBLIC_CDN_URL}/${post.user.avatarUrl}`} />
			<h1 class="ml-2 text-2xl font-semibold">{post.user.handle}</h1>
		</button>
		{#if post.user.id == $currentProfile?.id}
			<button
				disabled={deleteButtonDisabled}
				onclick={async () => {
					deleteButtonDisabled = true;
					await fetch('/api/deletePost', {
						method: 'DELETE',
						body: JSON.stringify({
							postId: post.id
						})
					});
					onDeleteSucess();
					deleteButtonDisabled = false;
				}}
			>
				<Trash2
					strokeWidth={2}
					class={`${deleteButtonDisabled ? '' : 'cursor-pointer hover:text-red-600'}`}
					size={48}
				></Trash2>
			</button>
		{:else}
			<span></span>
		{/if}
	</div>
	<button
		disabled={postPage}
		onclick={() => {
			goto(`/posts/${post.id}`);
		}}
		><img
			src={`${env.PUBLIC_CDN_URL}/${post.image}`}
			alt="awseomse sauce"
			class={` max-h-[600px] w-full ${postPage ? '' : 'cursor-pointer'} rounded-md shadow`}
			loading="lazy"
		/>
	</button>
	<div class=" flex w-full flex-col">
		<div class="flex w-full flex-row items-center justify-between">
			<div>
				<h1
					class=" text-2xl font-bold sm:max-w-[160px] md:max-w-[260px] lg:max-w-[300px] xl:max-w-[360px]"
				>
					{post.title}
				</h1>

				<p class=" text-lg sm:max-w-[160px] md:max-w-[260px] lg:max-w-[300px] xl:max-w-[360px]">
					<PostDescription content={post.description}></PostDescription>
				</p>
			</div>
			<button
				class="flex items-center gap-x-2 font-bold"
				onclick={async () => {
					if ($currentProfile) {
						likeCnt = likedTs ? likeCnt - 1 : Number(likeCnt) + 1;
						likedTs = !likedTs;
						await fetch('/api/like', {
							method: 'POST',
							body: JSON.stringify({ postId: post.id })
						});
					} else {
						goto('/');
					}
				}}
			>
				<p class="text-2xl font-semibold">
					{likeCnt}
				</p>
				{#if likedTs}
					<Heart
						class=" cursor-pointer font-bold text-red-600"
						fill="oklch(57.7% 0.245 27.325)"
						strokeWidth={4}
						size={42}
					></Heart>
				{:else}
					<Heart class=" cursor-pointer font-bold" strokeWidth={4} size={42}></Heart>
				{/if}
			</button>
		</div>
	</div>
</div>
