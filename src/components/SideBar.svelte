<script>
	import { goto, invalidateAll } from '$app/navigation';
	import { authClient } from '@/auth-client';
	import { currentProfile } from '@/stores/profile';
</script>

<div class=" sticky top-0 left-0 flex h-screen flex-col justify-center">
	{#if $currentProfile}
		<button
			onclick={() => {
				goto('/posts/make');
			}}>make a post!</button
		>
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
			}}>log out!</button
		>
	{:else}
		<button
			onclick={() => {
				goto('/');
			}}>login</button
		>
	{/if}
</div>
