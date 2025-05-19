import { db } from '@/db';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { post, profile } from '@/db/schema';
import { postObject } from '@/types/post';
import { auth } from '@/auth';

export const GET: RequestHandler = async ({ url, request }: { url: URL; request: Request }) => {
	const postId = await url.searchParams.get('id');

	if (!postId) {
		return json({ error: "missing url search param 'id' " }, { status: 400 });
	}

	const session = await auth.api.getSession({
		headers: request.headers
	});

	const userId = session?.user.id;

	let profileId;

	if (userId) {
		[profileId] = await db.select().from(profile).where(eq(profile.userId, userId)).limit(1);
	}

	const [userProfile] = await db
		.select(postObject(profileId ? profileId.id : 0))
		.from(post)
		.where(eq(post.id, Number(postId)))
		.leftJoin(profile, eq(profile.id, post.userId))
		.limit(1);

	if (!userProfile) {
		return json({ error: 'user doesnt exist!' }, { status: 404 });
	}

	return json(userProfile, { status: 200 });
};
