<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { authClient } from '@/auth-client';
	import { currentProfile } from '@/stores/profile';
	import { LogOut, Pen } from '@lucide/svelte';
	import type { Component } from 'svelte';
</script>

{#snippet BarButton(onclick: (event: Event) => Promise<void> | void, Icon: Component)}
	<button class="h-24 w-24" {onclick}><Icon /></button>
{/snippet}

<div class=" fixed bottom-0 z-50 flex w-screen flex-col">
	<div
		class="mr-auto ml-auto w-fit rounded-full bg-[#C08552] p-6 text-3xl font-semibold text-white"
	>
		{#if $currentProfile}
			{@render BarButton(() => {
				goto('/posts/make');
			}, Pen)}

			<button
				onclick={async () => {
					await authClient.signOut({
						fetchOptions: {
							onSuccess: () => {
								goto('/', { replaceState: true });
								invalidateAll();
							}
						}
					});
				}}><LogOut /></button
			>
		{:else}
			<button
				onclick={() => {
					goto('/');
				}}>login</button
			>
		{/if}
	</div>
</div>
