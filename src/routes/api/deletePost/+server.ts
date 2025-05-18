import { auth } from '@/auth';
import { db } from '@/db';
import { post, profile } from '@/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const DELETE: RequestHandler = async ({ request }: { request: Request }) => {
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

	try {
		const [existencePost] = await db.select().from(post).where(eq(post.id, postId)).limit(1);

		if (!existencePost) {
			throw new Error('post doesnt exist');
		}

		if (existencePost.userId != userProfile.id) {
			throw new Error('youre not the author of this tweet!');
		}

		await db.delete(post).where(eq(post.id, existencePost.id));
		return json({ status: 200 });
	} catch (error) {
		return json({ error: error }, { status: 400 });
	}
};
