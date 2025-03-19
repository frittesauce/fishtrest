<script lang="ts">
	import { currentUser } from '$lib/stores/user';
	import '../app.css';
  
  let {data, children} = $props<{
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		data: { userSession?: any; };
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		children: any;
	}>();


  $effect(() => {
    if (data?.userSession) {
      currentUser.set(data.userSession)
    } else {
      currentUser.set(null)
    }
  })

</script>

<svelte:head>
  <title>fishtrest</title>
  <meta name="description" content="jan willem">
</svelte:head>

{@render children()}
