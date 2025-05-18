import { auth } from '@/auth';
import { db } from '@/db';
import { post, profile } from '@/db/schema';
import { minioClient } from '@/server/minio';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import sharp from 'sharp';

export const POST: RequestHandler = async ({ request }: { request: Request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session) {
		return json({ error: 'not logged in or session is expired' }, { status: 400 });
	}

	const formdata = await request.formData();
	const title = formdata.get('title') as string;
	const desc = formdata.get('desc') as string;
	const image = formdata.get('image') as File;
	const [userProfile] = await db
		.select()
		.from(profile)
		.where(eq(profile.userId, session.user.id))
		.limit(1);

	if (!title || !desc || !image) {
		return json({ error: 'title, desc and/or image are missing' }, { status: 400 });
	}

	try {
		const [newPost] = await db
			.insert(post)
			.values({
				userId: userProfile.id,
				title: title,
				description: desc
			})
			.returning();

		if (!newPost) {
			throw new Error('couldnt make post!');
		}

		const objectName = `posts/${newPost.id}/medium.jpg`;
		const buffer = Buffer.from(await image?.arrayBuffer());
		const processedBuffer = await sharp(buffer, { animated: true })
			.resize(800, 800, { fit: 'contain', position: 'center' })
			.webp({ loop: 0 })
			.toBuffer();

		console.log(await minioClient.putObject('fishtrest', objectName, processedBuffer));
		const [finalPost] = await db
			.update(post)
			.set({ image: `${objectName}` })
			.where(eq(post.id, newPost.id))
			.returning();

		return json(finalPost, { status: 200 });
	} catch (error) {
		return json({ message: error });
	}
};
