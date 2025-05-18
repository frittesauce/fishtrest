<script lang="ts">
	import { currentProfile } from '@/stores/profile';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

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

		if (fileInput.size <= 0) {
			loadingPost = false;
			return toast.error('upload an image');
		}

		let formdata = new FormData();
		formdata.append('title', title);
		formdata.append('desc', desc);
		formdata.append('image', fileInput);

		const res = await fetch('/api/post', {
			method: 'POST',
			body: formdata
		});

		if (res.ok) {
			toast.success('post has been posted!');
			goto('/');
		}

		loadingPost = false;
	}

	if (!$currentProfile) {
		goto('/');
	}
</script>

{#if $currentProfile}
	<div class="flex flex-col lg:flex-row">
		<div class="max-w-[600px] min-w-[600px] flex-grow">
			<button
				onclick={() => {
					handleImageUpload();
				}}
			>
				<img
					src={image}
					alt="cool"
					class="flex max-w-[600px] min-w-[600px] flex-grow cursor-pointer rounded-lg"
				/>
			</button>
		</div>
		<div class=" min-w-[600px]">
			<form class="flex flex-col gap-y-4" onsubmit={handleForm}>
				<p class=" text-2xl font-semibold">title:</p>
				<input class="w-96 border" required name="title" bind:value={title} />
				<p class=" text-2xl font-semibold">description:</p>
				<input class="w-96 border" required name="desc" bind:value={desc} />
				<button
					disabled={loadingPost}
					class=" w-48 rounded-md bg-indigo-800 p-2 text-2xl text-white"
					type="submit">{!loadingPost ? 'post!' : 'loading...'}</button
				>
			</form>
		</div>
	</div>
{:else}{/if}
