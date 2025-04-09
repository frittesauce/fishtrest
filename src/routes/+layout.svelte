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
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<Toaster richColors />
{@render children()}
