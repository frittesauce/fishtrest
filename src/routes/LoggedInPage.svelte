<script lang="ts">
	import { env } from '$env/dynamic/public';
	import Avatar from '../components/Avatar.svelte';
	import { currentProfile } from '@/stores/profile';
</script>

<div>
	<aside>
		<p>kijk naar deze post</p>
		<Avatar alt="skibidi" src={`${env.PUBLIC_CDN_URL}/avatars/${$currentProfile?.avatarUrl}`}
		></Avatar>
	</aside>
	<main></main>
</div>
