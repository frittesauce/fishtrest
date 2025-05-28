import { auth } from '@/auth';
import { db } from '@/db';
import { post, profile } from '@/db/schema';
import { postObject } from '@/types/post';
import { json, type RequestHandler } from '@sveltejs/kit';
import { desc, eq, ilike, or } from 'drizzle-orm';

export const GET: RequestHandler = async ({ request, url }: { request: Request; url: URL }) => {
	const query = await url.searchParams.get('query');

	const session = await auth.api.getSession({
		headers: request.headers
	});

	const userId = session?.user.id;

	let profileId;

	if (userId) {
		[profileId] = await db.select().from(profile).where(eq(profile.userId, userId)).limit(1);
	}

	try {
		const feed = await db
			.select(postObject(profileId ? profileId.id : 0))
			.from(post)
			.leftJoin(profile, eq(profile.id, post.userId))
			.where(or(ilike(post.title, `%${query}%`), ilike(post.description, `%${query}%`)))
			.orderBy(
				desc(ilike(post.title, `%${query}%`)),
				desc(ilike(post.description, `%${query}%`)),
				desc(post.createdAt)
			)
			.limit(20);

		return json(feed);
	} catch (error) {
		console.log(error);
		return json({ error: 'something went wrong sorry' }, { status: 400 });
	}
};
