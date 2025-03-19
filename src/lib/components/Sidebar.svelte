<script lang="ts">
	import { signIn } from "$lib/auth-client";
	import { currentUser } from "$lib/stores/user";

  async function login() {
    await signIn.social({
      provider: "discord"
    })
  }

</script>

<div>
	<p>yahho this is a side bar!!</p>
  
  {#if $currentUser}
	<p>bro is locked in</p>
  {:else}
    <button on:click={login}>login my guy</button>
  {/if}
</div>
