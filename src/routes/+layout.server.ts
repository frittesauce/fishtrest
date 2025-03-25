import { env } from '$env/dynamic/public';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const sessionResponse = await fetch(`${env.PUBLIC_BASE_URL}/api/me`, {
		headers: event.request.headers
	});

	const body = await sessionResponse.json();

	return {
		userSession: body?.user || null,
		userProfile: body?.profile || null
	};
};
