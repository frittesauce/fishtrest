import { json, type RequestHandler } from '@sveltejs/kit';
import { auth } from '@/auth';
import { db } from '@/db';
import { profile, user } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { minioClient } from '@/server/minio';
import sharp from 'sharp';

export const POST: RequestHandler = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	const bucket = 'avatars';
	const formdata = await request.formData();
	const file = formdata.get('image');
	const username = formdata.get('username');

	if (!(file instanceof File) && !(username instanceof String)) {
		return json({ error: 'file not valid!' }, { status: 400 });
	}

	console.log(file);

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
		const objectName = `${newProfile.id}/medium.jpg`;
		const buffer = Buffer.from(await file.arrayBuffer());

		const processedBuffer = await sharp(buffer)
			.resize(320, 320, { fit: 'cover', position: 'center' })
			.jpeg({ quality: 80 })
			.toBuffer();

		await minioClient.putObject(bucket, objectName, processedBuffer);

		await db.update(profile).set({ avatarUrl: objectName }).where(eq(profile.id, newProfile.id));

		return json({ error: 's' });
	} catch (error) {
		console.log(error);
		return json({ error: error });
	}
};
