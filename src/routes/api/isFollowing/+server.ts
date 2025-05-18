import { auth } from '@/auth';
import { db } from '@/db';
import { follower, profile } from '@/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url, request }: { url: URL; request: Request }) => {
	const targetUser = await url.searchParams.get('username');

	if (!targetUser) return json({ error: 'no username provided' }, { status: 400 });

	const session = await auth.api.getSession({
		headers: request.headers
	});

	const userId = session?.user.id;

	if (!userId) return json({ error: 'youre not not logged in!' }, { status: 400 });

	const [userProfile] = await db.select().from(profile).where(eq(profile.userId, userId)).limit(1);

	if (!userProfile)
		return json({ error: 'you havent completed the account creation yet' }, { status: 400 });

	const [targetProfile] = await db
		.select()
		.from(profile)
		.where(eq(profile.handle, targetUser))
		.limit(1);

	if (!targetProfile) return json({ error: 'user doesnt exist' }, { status: 404 });

	const [following] = await db
		.select()
		.from(follower)
		.where(and(eq(follower.targetUserId, targetProfile.id), eq(follower.userId, userProfile.id)));

	return json(following ? true : false);
};
