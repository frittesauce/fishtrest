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

<main class="flex h-screen w-screen items-center justify-center align-middle">
	<Post
		{post}
		onDeleteSucess={() => {
			goto('/');
			toast.success('delted post sucesfully!');
		}}
		postPage
	></Post>
</main>
