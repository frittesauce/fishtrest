<script>
	import { authClient } from '$lib/auth-client';

	async function login() {
		await authClient.signIn.social({
			provider: 'discord'
			// disableRedirect: true
		});
	}

	const session = authClient.useSession();
</script>

<h1>login of pepernoot</h1>

<p>{$session.data?.user.email}</p>

<button on:click={login}>ddiscordddiscord</button>

<button on:click={async () => {
await authClient.signOut();
}}>logout</button>

