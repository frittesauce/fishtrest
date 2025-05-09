import { auth } from '@/auth';
import { db } from '@/db';
import { post, profile } from '@/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

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
		.select({
			id: post.id,
			title: post.title,
			description: post.description,
			image: post.image,
			user: {
				id: profile.id,
				handle: profile.handle,
				avatarUrl: profile.avatarUrl
			}
		})
		.from(post)
		.leftJoin(profile, eq(profile.id, post.userId))
		.limit(20);

	return json(feed);
};
