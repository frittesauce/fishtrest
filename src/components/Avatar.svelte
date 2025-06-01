<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { currentProfile } from '@/stores/profile';

	let {
		src = $currentProfile
			? `${env.PUBLIC_CDN_URL}/${$currentProfile?.avatarUrl}`
			: `${env.PUBLIC_CDN_URL}/404.webp`,
		alt = 'alt text',
		size = 12
	} = $props();
</script>

<img {src} {alt} class="h-{size} w-{size} justify-center rounded-lg object-cover" />
