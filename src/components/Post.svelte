<script lang="ts">
	import { env } from '$env/dynamic/public';

	let testImages = [
		'https://i.pinimg.com/736x/c4/76/fe/c476fecc3440d3c1feb5a76162792c68.jpg',
		'http://172.20.0.2:9000/avatars/31/medium.jpg'
	];
	let {
		post = {
			id: 1,
			title: 'test',
			description: 'awesome sauce',
			image: testImages[Math.floor(Math.random() * testImages.length)],
			user: {
				id: 31,
				handle: 'chrisdevis',
				avatarUrl: 'http://172.20.0.2:9000/avatars/31/medium.jpg'
			}
		}
	}: {
		post?: {
			id: number;
			title: string;
			description?: string;
			image: string;
			user: {
				id: number;
				handle: string;
				avatarUrl: string;
			};
		};
	} = $props();
</script>

<div class="flex w-fit flex-col items-center justify-center">
	<img
		src={`${env.PUBLIC_CDN_URL}/fishtrest/${post.image}`}
		alt="awseomse sauce"
		class=" max-h-[600px] w-max rounded-md"
	/>
	<h1
		class=" text-2xl font-bold sm:max-w-[160px] md:max-w-[260px] lg:max-w-[300px] xl:max-w-[360px]"
	>
		{post.title}
	</h1>
	<p class=" text-lg sm:max-w-[160px] md:max-w-[260px] lg:max-w-[300px] xl:max-w-[360px]">
		{post.description}
	</p>
</div>
