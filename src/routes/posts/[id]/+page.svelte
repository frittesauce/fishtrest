<script lang="ts">
	import type PostType from '@/types/post';
	import Post from '../../../components/Post.svelte';

	let { data } = $props<{
		post: PostType;
	}>();
</script>

<Post post={data.post} postPage></Post>
