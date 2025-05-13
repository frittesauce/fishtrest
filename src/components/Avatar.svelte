<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { currentProfile } from '@/stores/profile';

	let {
		src = `${env.PUBLIC_CDN_URL}/${$currentProfile?.avatarUrl}`,
		alt = 'alt text',
		size = 16
	} = $props();
</script>

<img {src} {alt} class="h-{size} w-{size} justify-center rounded-lg object-cover" />
