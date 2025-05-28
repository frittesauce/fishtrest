<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { authClient } from '@/auth-client';
	import { currentProfile } from '@/stores/profile';
	import { Home, LogOut, Pen, Search } from '@lucide/svelte';
	import type { Component } from 'svelte';
	import Avatar from './Avatar.svelte';
</script>

{#snippet BarButton(onclick: (event: Event) => Promise<void> | void, Icon: Component)}
	<button class="h-12 w-12 cursor-pointer" {onclick}><Icon class="h-full w-full" /></button>
{/snippet}

<div class=" fixed bottom-0 z-40 flex w-screen flex-col md:h-screen md:w-0 md:flex-col">
	<div
		class="mr-auto ml-auto flex w-fit flex-row gap-x-6 gap-y-6 rounded-full bg-indigo-800 px-8 py-2 text-3xl font-semibold text-white md:mt-auto md:mr-86 md:mb-auto md:ml-0 md:flex-col md:px-2 md:py-8"
	>
		{#if $currentProfile}
			{@render BarButton(() => {
				goto('/search');
			}, Search)}

			{@render BarButton(() => {
				goto('/');
			}, Home)}
			{@render BarButton(() => {
				goto('/posts/make');
			}, Pen)}

			{@render BarButton(() => {
				goto(`/${$currentProfile.handle}`);
			}, Avatar)}
		{:else}
			<button
				onclick={() => {
					goto('/');
				}}>login</button
			>
		{/if}
	</div>
</div>
