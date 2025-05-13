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

	const bucket = 'fishtrest';
	const formdata = await request.formData();
	const file = formdata.get('image') as File;
	const username = formdata.get('username') as string;

	if (!(file instanceof File)) {
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
		const objectName = `avatars/${newProfile.id}/medium.webp`;
		const buffer = Buffer.from(await file?.arrayBuffer());

		const processedBuffer = await sharp(buffer, { animated: true })
			.resize(320, 320, { fit: 'fill', position: 'center' })
			.webp({ loop: 0 })
			.toBuffer();

		await minioClient.putObject(bucket, objectName, processedBuffer);

		await db.update(profile).set({ avatarUrl: objectName }).where(eq(profile.id, newProfile.id));

		return json({ message: 'done!' }, { status: 200 });
	} catch (error) {
		console.log(error);
		return json({ error: error }, { status: 400 });
	}
};
