import { auth } from '@/auth';
import { db } from '@/db';
import { follower, profile } from '@/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import { and } from 'drizzle-orm';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }: { request: Request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session) {
		return json({ error: 'not logged in or session is expired' }, { status: 400 });
	}

	const [userProfile] = await db
		.select()
		.from(profile)
		.where(eq(profile.userId, session.user.id))
		.limit(1);

	const { targetHandle } = await request.json();

	if (!targetHandle) {
		return json({ error: 'missing a userhandle id!' }, { status: 400 });
	}
	if (!userProfile) {
		return json({ error: 'you dont have a profile' }, { status: 400 });
	}

	if (userProfile.handle == targetHandle)
		return json({ error: 'you cant follow yourself' }, { status: 400 });

	try {
		const [userExist] = await db
			.select()
			.from(profile)
			.where(eq(profile.handle, targetHandle))
			.limit(1);

		if (!userExist) {
			return json({ error: 'profile no longer exists!' }, { status: 400 });
		}

		const [follows] = await db
			.select()
			.from(follower)
			.where(and(eq(follower.userId, userProfile.id), eq(follower.targetUserId, userExist.id)))
			.limit(1);

		if (!follows) {
			const [newFollow] = await db
				.insert(follower)
				.values({
					targetUserId: userExist.id,
					userId: userProfile.id
				})
				.returning();
			return json(newFollow, { status: 200 });
		} else {
			await db
				.delete(follower)
				.where(and(eq(follower.targetUserId, userExist.id), eq(follower.userId, userProfile.id)));
			return json({ status: 200 });
		}
	} catch (error) {
		return json({ message: error }, { status: 400 });
	}
};
