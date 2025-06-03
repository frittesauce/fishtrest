<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { combinedRegex, hashtagRegex, tagRegex } from '@/utils';

	let { content } = $props();

	const parts = content.split(combinedRegex);
</script>

<div>
	{#each parts as part}
		{#if hashtagRegex.test(part)}
			<button
				onclick={() => {
					goto(`/search?prompt=${encodeURIComponent('#' + part.slice(1))}`, {
						invalidateAll: true,
						replaceState: true
					});
				}}
				class="cursor-pointer font-semibold text-indigo-800">#{part.slice(1)}</button
			>
		{:else if tagRegex.test(part)}
			<button
				onclick={() => {
					goto(`/@${part.slice(1)}`);
				}}
				class=" cursor-pointer font-semibold text-indigo-800">@{part.slice(1)}</button
			>
		{:else}
			<span>{part}</span>
		{/if}
	{/each}
</div>
