<script lang="ts">
	import { goto } from '$app/navigation';
	import { combinedRegex, hashtagRegex, tagRegex } from '@/utils';

	let { content } = $props();

	const parts = content.split(combinedRegex);
</script>

<div>
	{#each parts as part, index}
		{#if hashtagRegex.test(part)}
			<a href={`/search?prompt=${part.slice(1)}`} class="font-semibold text-indigo-800"
				>#{part.slice(1)}</a
			>
		{:else if tagRegex.test(part)}
			<button
				onclick={() => {
					goto(`/${part.slice(1)}`);
				}}
				class=" font-semibold text-indigo-800">@{part.slice(1)}</button
			>
		{:else}
			<span>{part}</span>
		{/if}
	{/each}
</div>
