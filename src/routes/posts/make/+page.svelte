<script lang="ts">
	import { currentProfile } from '@/stores/profile';
	import AppLayout from '../../../components/AppLayout.svelte';

	let image = $state('/default.png');
	let fileInput: Blob = $state(new Blob());

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
</script>

<AppLayout>
	{#if $currentProfile}
		<div class="flex flex-row">
			<div class="max-w-[600px] min-w-[600px] flex-grow">
				<button
					onclick={() => {
						handleImageUpload();
					}}
				>
					<img
						src={image}
						alt="cool"
						class="flex max-w-[600px] min-w-[600px] flex-grow rounded-lg hover:cursor-pointer"
					/>
				</button>
			</div>
			<div class=" min-w-[600px]">
				<p>title</p>
				<input />
				<p>desciprtion</p>
				<input />
			</div>
		</div>
	{:else}
		<p>login</p>
	{/if}
</AppLayout>
