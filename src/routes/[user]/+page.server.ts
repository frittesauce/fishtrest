import { env } from '$env/dynamic/public';
import type { PageServerLoad } from '../$types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load: PageServerLoad = async ({ params }: { params: any }) => {
	const response = await fetch(`${env.PUBLIC_BASE_URL}/api/profile?username=${params.user}`);

	if (response.ok) {
		const userProfile = await response.json();
		return { profile: userProfile };
	} else {
		return {
			profile: {
				id: 0,
				handle: 'unkown user',
				avatarUrl: 'ts.webp',
				bio: 'user not found',
				followers: 0,
				following: 0
			}
		};
	}
};
