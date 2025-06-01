<script lang="ts">
	import type PostType from '@/types/post';
	import Post from '../../../components/Post.svelte';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let { data } = $props<{
		post: PostType;
	}>();
</script>

<Post post={data.post} onDeleteSucess={() => {
	goto("/")
	toast.success("delted post sucesfully!")
}} postPage></Post>
