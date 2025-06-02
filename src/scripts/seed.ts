import { authClient } from '@/auth-client';
import { exDb } from '@/db';
import { post, profile, user } from '@/db/schema';
import { exMinioClient } from '@/server/externalMinio';
import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';
import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import sharp from 'sharp';
const catDir = path.resolve(__dirname, 'cats');

function randomCatImage() {
	const catImages = readdirSync(catDir);

	const randomCatFile = catImages[Math.floor(Math.random() * catImages.length)];
	const fullPath = path.join(catDir, randomCatFile);
	const buffer = readFileSync(fullPath);

	return { buffer, name: randomCatFile };
}

async function seed(userNum: number = 1, postPerUser: number = 1) {
	let sessions: any[] = [];
	let users: any[] = [];

	for (let i = 0; i < userNum; i++) {
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();
		const email = faker.internet.email({ firstName });
		const password = 'password';

		await authClient.signUp
			.email({
				email,
				password,
				name: `${firstName} ${lastName}`
			})
			.then((e) => {
				sessions.push(e);
			});
	}

	for (let session of sessions) {
		const userId = session.data.user.id;

		const { buffer } = randomCatImage();

		const image = new Blob([new Uint8Array(buffer)]);
		const username = faker.internet.username();

		const [newProfile] = await exDb
			.insert(profile)
			.values({
				handle: username,
				userId: userId
			})
			.returning();

		await exDb.update(user).set({ finishedOnboard: true }).where(eq(user.id, newProfile.userId));

		const objectName = `avatars/${newProfile.id}/medium.webp`;

		const processedBuffer = await sharp(buffer, { animated: true })
			.resize(320, 320, { fit: 'fill', position: 'center' })
			.webp({ loop: 0 })
			.toBuffer();

		await exMinioClient.putObject('fishtrest', objectName, processedBuffer);

		await exDb.update(profile).set({ avatarUrl: objectName }).where(eq(profile.id, newProfile.id));

		for (let i = 0; i < postPerUser; i++) {
			const title = faker.book.title();
			const description = faker.animal.cat();

			const [newPost] = await exDb
				.insert(post)
				.values({
					userId: newProfile.id,
					title: title,
					description: description
				})
				.returning();

			const objectName = `posts/${newPost.id}/medium.jpg`;

			const { buffer } = randomCatImage();

			const processedBuffer = await sharp(buffer, { animated: true })
				.resize(800, 800, { fit: 'contain', position: 'center' })
				.webp({ loop: 0 })
				.toBuffer();

			await exMinioClient.putObject('fishtrest', objectName, processedBuffer);

			const [finalPost] = await exDb
				.update(post)
				.set({ image: `${objectName}` })
				.where(eq(post.id, newPost.id))
				.returning();
		}
	}
}

seed(10, 4);
