<script lang="ts">
	import { env } from '$env/dynamic/public';
	import type PostType from '@/types/post';
	import PostDescription from './PostStuff/PostDescription.svelte';
	import { Heart, Trash2 } from '@lucide/svelte';
	import { currentProfile } from '@/stores/profile';
	import { mainFeed } from '@/stores/feed';
	import { goto } from '$app/navigation';

	let testImages = [
		'https://i.pinimg.com/736x/c4/76/fe/c476fecc3440d3c1feb5a76162792c68.jpg',
		'http://172.20.0.2:9000/avatars/31/medium.jpg'
	];
	let { post }: { post: PostType } = $props();

	let likedTs = $state(post.likedByUser);
	let likeCnt: number = $state(post.likeCount);

	let deleteButtonDisabled = $state(false);
</script>

<div class="flex w-fit flex-col items-center justify-center">
	<div class="flex w-full flex-row justify-between">
		<a href={`/${post.user.handle}`}>{post.user.handle}</a>
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
					mainFeed.update((a) => {
						return a.filter((p) => p.id !== post.id);
					});
					deleteButtonDisabled = false;
				}}
			>
				<Trash2
					strokeWidth={2}
					class={`${deleteButtonDisabled ? '' : 'cursor-pointer hover:text-red-600'}`}
				></Trash2>
			</button>
		{:else}
			<span></span>
		{/if}
	</div>
	<img
		src={`${env.PUBLIC_CDN_URL}/${post.image}`}
		alt="awseomse sauce"
		class=" max-h-[600px] w-full rounded-md"
		loading="lazy"
	/>
	<div class=" flex w-full flex-col">
		<div class="flex w-full flex-row justify-between">
			<h1
				class=" text-2xl font-bold sm:max-w-[160px] md:max-w-[260px] lg:max-w-[300px] xl:max-w-[360px]"
			>
				{post.title}
			</h1>
			<button
				class="flex gap-x-2 font-bold"
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
				<p>
					{likeCnt}
				</p>
				{#if likedTs}
					<Heart
						class=" cursor-pointer font-bold text-red-600"
						fill="oklch(57.7% 0.245 27.325)"
						strokeWidth={4}
					></Heart>
				{:else}
					<Heart class=" cursor-pointer font-bold" strokeWidth={4}></Heart>
				{/if}
			</button>
		</div>
		<p class=" text-lg sm:max-w-[160px] md:max-w-[260px] lg:max-w-[300px] xl:max-w-[360px]">
			<PostDescription content={post.description}></PostDescription>
		</p>
	</div>
</div>
