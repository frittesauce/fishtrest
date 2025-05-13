import { auth } from '@/auth';
import { db } from '@/db';
import { post, profile } from '@/db/schema';
import { postObject } from '@/types/post';
import { json, type RequestHandler } from '@sveltejs/kit';
import { desc, eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ request }: { request: Request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	const userId = session?.user.id;

	if (!userId) {
		return json({ error: 'missing data' }, { status: 400 });
	}

	const [profileId] = await db.select().from(profile).where(eq(profile.userId, userId)).limit(1);

	if (!profileId) {
		return json({ error: 'havent made a profile yet!' }, { status: 400 });
	}

	const feed = await db
		.select(postObject(profileId.id))
		.from(post)
		.leftJoin(profile, eq(profile.id, post.userId))
		.orderBy(desc(post.createdAt))
		.limit(20);

	return json(feed);
};
