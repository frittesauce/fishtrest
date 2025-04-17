import { env } from '$env/dynamic/public';
import { loading } from '@/stores/loading';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	loading.set(true);
	const sessionResponse = await fetch(`${env.PUBLIC_BASE_URL}/api/me`, {
		headers: event.request.headers
	});

	const body = await sessionResponse.json();
	// loading.set(false);
	return {
		data: {
			userSession: body?.data?.session,
			userProfile: body?.data?.profile
		}
	};
};
