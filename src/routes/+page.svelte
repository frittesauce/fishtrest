<script>
	import { authClient } from '$lib/auth-client';

	async function login() {
    console.log("test")
		await authClient.signIn.social({
			provider: 'discord',
		});
    console.log("done")
	}

	const session = authClient.useSession();
</script>

<h1>login of pepernoot</h1>

<p>{$session.data?.user.role}</p>

<button on:click={login}>skibidi</button>


<img src="http://127.0.0.2:9000/avatars/1/small.webp" alt="">
