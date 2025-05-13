<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { authClient } from '@/auth-client';
	import { currentProfile } from '@/stores/profile';
	import { Home, LogOut, Pen } from '@lucide/svelte';
	import type { Component } from 'svelte';
	import Avatar from './Avatar.svelte';
</script>

{#snippet BarButton(onclick: (event: Event) => Promise<void> | void, Icon: Component)}
	<button class="h-16 w-16 cursor-pointer" {onclick}><Icon class="h-full w-full" /></button>
{/snippet}

<div class=" fixed bottom-0 z-50 flex w-screen flex-col">
	<div
		class="mr-auto ml-auto flex w-fit flex-row gap-x-8 rounded-full bg-indigo-800 px-12 py-4 text-3xl font-semibold text-white"
	>
		{#if $currentProfile}
			{@render BarButton(() => {
				goto('/posts/make');
			}, Pen)}

			{@render BarButton(() => {
				goto('/');
			}, Home)}

			{@render BarButton(async () => {
				await authClient.signOut({
					fetchOptions: {
						onSuccess: () => {
							goto('/', { replaceState: true });
							invalidateAll();
						}
					}
				});
			}, LogOut)}

			{@render BarButton(() => {}, Avatar)}
		{:else}
			<button
				onclick={() => {
					goto('/');
				}}>login</button
			>
		{/if}
	</div>
</div>
