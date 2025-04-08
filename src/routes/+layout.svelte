<script lang="ts">
	import { currentUser } from '$lib/stores/user';
	import { Toaster } from 'svelte-sonner';

	import '../app.css';
	import { currentProfile } from '@/stores/profile';

	let { data, children } = $props<{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data: { userSession?: any };
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		children: any;
	}>();

	$effect(() => {
		if (data?.data.userSession) {
			currentUser.set(data.data.userSession);
		} else {
			currentUser.set(null);
		}
		if (data?.data?.userProfile) {
			currentProfile.set(data.data.userProfile);
		} else {
			currentProfile.set(null);
		}
	});
</script>

<svelte:head>
	<title>fishtrest | jaja</title>
	<meta name="description" content="jan willem" />
</svelte:head>

<Toaster richColors />
{@render children()}
