import { db } from '@/db';
import { follower, profile } from '@/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq, sql } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url }: { url: URL }) => {
	const profileHandle = await url.searchParams.get('username');

	if (!profileHandle) {
		return json({ error: "missing url search param 'username' " }, { status: 400 });
	}

	const [userProfile] = await db

		.select({
			id: profile.id,
			handle: profile.handle,
			avatarUrl: profile.avatarUrl,
			bio: profile.bio,
			followers:
				sql<number>`(SELECT COUNT(*) FROM ${follower} WHERE ${follower.targetUserId} = ${profile.id})`.as(
					'followers'
				),
			following:
				sql<number>`(SELECT COUNT(*) FROM ${follower} WHERE ${follower.userId} = ${profile.id})`.as(
					'following'
				)
		})
		.from(profile)
		.where(eq(profile.handle, profileHandle))
		.limit(1);

	if (!userProfile) {
		return json({ error: 'user doesnt exist!' }, { status: 404 });
	}

	return json(userProfile, { status: 200 });
};
