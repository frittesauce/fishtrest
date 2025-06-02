import { auth } from '@/auth';
import { db } from '@/db';
import { follower, post, profile } from '@/db/schema';
import { postObject } from '@/types/post';
import { json, type RequestHandler } from '@sveltejs/kit';
import { desc, eq, exists, and } from 'drizzle-orm';

export const GET: RequestHandler = async ({ request, url }: { request: Request; url: URL }) => {
	const feedType = (await url.searchParams.get('type')) || 'main';
	const handle = await url.searchParams.get('handle');

	const tabs = ['main', 'profile', 'following'];

	if (!tabs.includes(feedType)) {
		return json({ error: 'incorrect feed type!' }, { status: 400 });
	}

	const session = await auth.api.getSession({
		headers: request.headers
	});

	const userId = session?.user.id;

	let profileId;

	if (userId) {
		[profileId] = await db.select().from(profile).where(eq(profile.userId, userId)).limit(1);
	}

	try {
		if (feedType == 'main') {
			if (!profileId) {
				return json({ error: 'you need a profile for this feed' }, { status: 400 });
			}
			const feed = await db
				.select(postObject(profileId.id))
				.from(post)
				.leftJoin(profile, eq(profile.id, post.userId))
				.orderBy(desc(post.createdAt))
				.limit(20);

			return json(feed);
		} else if (feedType == 'following') {
			if (!profileId) {
				return json({ error: 'you need a profile for this feed' }, { status: 400 });
			}
			const feed = await db
				.select(postObject(profileId.id))
				.from(post)
				.leftJoin(profile, eq(profile.id, post.userId))
				.orderBy(desc(post.createdAt))
				.where(
					exists(
						db
							.select()
							.from(follower)
							.where(and(eq(follower.targetUserId, profile.id), eq(follower.userId, profileId.id)))
					)
				)
				.limit(20);

			return json(feed);
		} else if (feedType == 'profile') {
			if (!handle) {
				return json({ error: 'missing profile!' }, { status: 400 });
			}

			const [userExist] = await db
				.select()
				.from(profile)
				.where(eq(profile.handle, handle))
				.limit(1);

			if (!userExist) {
				return json({ error: 'user doesnt exist!' }, { status: 404 });
			}

			const feed = await db
				.select(postObject(profileId ? profileId.id : 0))
				.from(post)
				.leftJoin(profile, eq(profile.id, post.userId))
				.orderBy(desc(post.createdAt))
				.where(eq(post.userId, userExist.id))
				.limit(20);

			return json(feed);
		} else {
			throw new Error();
		}
	} catch (error) {
		console.log(error);
		return json({ error: 'something went wrong sorry' }, { status: 400 });
	}
};
