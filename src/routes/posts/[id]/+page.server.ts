import { env } from '$env/dynamic/public';
import type { PageServerLoad } from '../../$types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const load: PageServerLoad = async ({ params }: { params: any }) => {
	const response = await fetch(`${env.PUBLIC_BASE_URL}/api/posts?id=${params.id}`);

	if (response.ok) {
		const postDetails = await response.json();
		return { post: postDetails };
	}
};
