import { json, type RequestHandler } from '@sveltejs/kit';
import { auth } from '@/auth';
import { db } from '@/db';
import { profile, user } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	const bucket = 'avatars';
	const formdata = await request.formData();
	const file = await formdata.get('image');
	const username = await formdata.get('username');

	if (!(file instanceof File) && !(username instanceof String)) {
		return json({ error: 'file not valid!' }, { status: 400 });
	}

	if (session?.user.finishedOnboard || !session?.user) {
		return json({ error: 'authentication error!' }, { status: 400 });
	}

	if (!/^@[A-Za-z0-9]{2,20}$/.test(username as string)) {
		return json({ error: 'username invalid' }, { status: 400 });
	}

	try {
		const [newProfile] = await db
			.insert(profile)
			.values({
				handle: username,
				userId: session.user.id
			})
			.returning();

		if (!newProfile) {
			throw new Error('couldnt make profile!');
		}

		await db.update(user).set({ finishedOnboard: true }).where(eq(user.id, newProfile.userId));
		const objectName = `${newProfile.id}`;

		return json({ error: 's' });
	} catch (error) {
		console.log(error);
		return json({ error: error });
	}
};
