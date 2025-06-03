<script lang="ts">
	import { currentProfile } from '@/stores/profile';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import Avatar from '../../../components/Avatar.svelte';
	import { mainFeed } from '@/stores/feed';
	import type PostType from '@/types/post';

	let image = $state('/default.png');
	let fileInput: Blob = $state(new Blob());

	let loadingPost = $state(false);

	let title = $state('');
	let desc = $state('');

	function handleImageUpload() {
		let inputElement = document.createElement('input');
		inputElement.type = 'file';
		inputElement.accept = 'image/*';
		inputElement.onchange = (e: any) => {
			let file = e.target?.files[0];
			if (file) {
				fileInput = file;
				image = URL.createObjectURL(fileInput);
			}
		};
		inputElement.click();
	}

	async function handleForm(e: Event) {
		e.preventDefault();
		loadingPost = true;

		if (!$currentProfile) {
			loadingPost = false;
			return toast.error('youre not logged in please login');
		}

		if (fileInput.size <= 0) {
			loadingPost = false;
			return toast.error('upload an image');
		}

		let formdata = new FormData();
		formdata.append('title', title);
		formdata.append('desc', desc);
		formdata.append('image', fileInput);

		const res = await fetch('/api/makePost', {
			method: 'POST',
			body: formdata
		});

		if (res.ok) {
			const body: PostType = await res.json();

			if (body) {
				toast.success('post has been posted!');
				goto(`/${$currentProfile.handle}`);
			}
		}

		loadingPost = false;
	}
</script>

<main class="flex h-screen w-screen items-center justify-center align-middle">
	<div class="flex w-fit flex-col items-center justify-center rounded-xl bg-gray-300 p-8 shadow">
		<div class="mb-2 flex w-full flex-row justify-between">
			<div class="flex items-center rounded-md bg-gray-400 p-2 align-middle shadow">
				<Avatar />
				<h1 class="ml-2 text-2xl font-semibold">
					{$currentProfile?.handle ? $currentProfile?.handle : '@login'}
				</h1>
			</div>
		</div>

		<button
			onclick={() => {
				handleImageUpload();
			}}
		>
			<img
				src={image}
				alt="cool"
				class={` max-h-[600px] w-full cursor-pointer rounded-md shadow`}
			/>
		</button>
		<div class=" flex w-full flex-col">
			<div class="flex w-full flex-row items-center justify-between">
				<form class="flex w-full flex-row justify-between gap-y-4" onsubmit={handleForm}>
					<div class="flex flex-col">
						<p>title:</p>
						<input
							class=" text-2xl font-bold sm:max-w-[160px] md:max-w-[260px] lg:max-w-[300px] xl:max-w-[360px]"
							placeholder="cats are interesting"
							required
							name="title"
							bind:value={title}
						/>
						<p>description:</p>
						<input
							class=" text-lg sm:max-w-[160px] md:max-w-[260px] lg:max-w-[300px] xl:max-w-[360px]"
							placeholder="just think about it"
							required
							name="desc"
							bind:value={desc}
						/>
					</div>
					<div class="flex items-center gap-x-2 font-bold">
						<button
							disabled={loadingPost}
							class=" w-24 rounded-md bg-indigo-800 p-2 text-2xl text-white"
							type="submit">{!loadingPost ? 'post!' : 'loading...'}</button
						>
					</div>
				</form>
			</div>
		</div>
	</div>
</main>
