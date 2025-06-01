<script lang="ts">
	import type PostType from '@/types/post';
	import Post from '../../../components/Post.svelte';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	let { data } = $props<{
		post: PostType;
	}>();

	let post = $state(data.post);
</script>

<main class="flex w-full justify-center">
	<Post
		{post}
		onDeleteSucess={() => {
			goto('/');
			toast.success('delted post sucesfully!');
		}}
		postPage
	></Post>
</main>
