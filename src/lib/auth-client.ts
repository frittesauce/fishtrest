import { env } from '$env/dynamic/public';
import { createAuthClient } from 'better-auth/svelte';

export const authClient = createAuthClient({
	baseURL: env.PUBLIC_BASE_URL // the base url of your auth server
});

export const { signIn, signUp, useSession } = createAuthClient();
