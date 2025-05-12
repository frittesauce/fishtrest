import { auth } from '@/auth';
import { db } from '@/db';
import { post } from '@/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }: { request: Request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session) {
		return json({ error: 'not logged in or session is expired' }, { status: 400 });
	}

	const formdata = await request.formData();
	const title = formdata.get('title');
	const desc = formdata.get('desc');
	const image = formdata.get('image') as File;

	if (!title || !desc || !image) {
		return json({ error: 'title, desc and/or image are missing' }, { status: 400 });
	}

	try {
		const [newPost] = await db
			.insert(post)
			.values({
				title: title,
				description: desc
			})
			.returning();

		if (!newProfile) {
			throw new Error('couldnt make profile!');
		}

		const objectName = `posts/${newProfile.id}/medium.jpg`;
		const buffer = Buffer.from(await file?.arrayBuffer());
	} catch (error) {}
};
