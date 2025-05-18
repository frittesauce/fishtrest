import { auth } from '@/auth';
import { db } from '@/db';
import { like, post, profile } from '@/db/schema';
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

	const { postId } = await request.json();

	if (!postId) {
		return json({ error: 'missing a post id!' }, { status: 400 });
	}

	if (!userProfile) {
		return json({ error: 'you dont have a profile' }, { status: 400 });
	}

	try {
		const [postExist] = await db.select().from(post).where(eq(post.id, postId)).limit(1);

		if (!postExist) {
			return json({ error: 'post no longer exists!' }, { status: 400 });
		}

		const [hasLiked] = await db
			.select()
			.from(like)
			.where(and(eq(like.postId, postId), eq(like.userId, userProfile.id)))
			.limit(1);

		if (!hasLiked) {
			const [newLike] = await db
				.insert(like)
				.values({
					postId,
					userId: userProfile.id
				})
				.returning();
			return json(newLike, { status: 200 });
		} else {
			await db.delete(like).where(and(eq(like.postId, postId), eq(like.userId, userProfile.id)));
			return json({ status: 200 });
		}
	} catch (error) {
		return json({ message: error }, { status: 400 });
	}
};
