/* eslint-disable @typescript-eslint/no-explicit-any */
import { authClient } from '@/auth-client';
import { exDb } from '@/db';
import { follower, like, post, profile, user } from '@/db/schema';
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

async function seed(
	userNum: number = 1,
	postPerUser: number = 1,
	likesPerUser: number = 1,
	followesPerUser: number = 1
) {
	const sessions: any[] = [];
	const profiles: any[] = [];
	const posts: any[] = [];

	let index = 0;

	for (let i = 0; i < userNum; i++) {
		console.log(index);

		index++;

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

	// create posts for every user

	index = 0;

	for (let session of sessions) {
		index++;
		console.log(`creating users, ${Math.floor((index / sessions.length) * 100)}% done `);
		const userId = session.data.user.id;

		const { buffer } = randomCatImage();

		const image = new Blob([new Uint8Array(buffer)]);
		const username = faker.internet.username();

		const bio = faker.word.words({ count: { min: 5, max: 15 } });

		const [newProfile] = await exDb
			.insert(profile)
			.values({
				handle: `@${username}`,
				userId: userId,
				bio
			})
			.returning();

		await exDb.update(user).set({ finishedOnboard: true }).where(eq(user.id, newProfile.userId));

		const objectName = `avatars/${newProfile.id}/medium.webp`;

		const processedBuffer = await sharp(buffer, { animated: true })
			.resize(320, 320, { fit: 'fill', position: 'center' })
			.webp({ loop: 0 })
			.toBuffer();

		await exMinioClient.putObject('fishtrest', objectName, processedBuffer);

		const [finProfile] = await exDb
			.update(profile)
			.set({ avatarUrl: objectName })
			.where(eq(profile.id, newProfile.id))
			.returning();

		profiles.push(finProfile);

		for (let i = 0; i < postPerUser; i++) {
			process.stdout.write(`\rcreating user posts ${Math.floor((i / postPerUser) * 100)}% done`);

			const title = faker.word.words({ count: { min: 1, max: 10 } });
			const description = `${faker.word.words({ count: { min: 10, max: 25 } })} #${faker.word.words({ count: 1 })} ${Math.random() < 0.05 ? `@${profiles[Math.floor(Math.random() * profiles.length)].handle}` : ''}`;

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

			posts.push(finalPost);
		}
		console.log('✅created posts for user!');
	}

	console.log('✅ users made');

	for (const profile of profiles) {
		console.log('following profiles and liking posts');

		const userId = profile.id;

		const unLikedPosts = [...posts];
		const unFollowedProfiles = [...profiles];

		for (let i = 0; i < likesPerUser; i++) {
			const postToLike = unLikedPosts.splice(Math.floor(Math.random() * unLikedPosts.length), 1)[0];

			await exDb.insert(like).values({ postId: postToLike.id, userId: userId });
		}

		for (let i = 0; i < followesPerUser; i++) {
			const userToFollow = unFollowedProfiles.splice(
				Math.floor(Math.random() * unFollowedProfiles.length),
				1
			)[0];

			await exDb.insert(follower).values({ userId: userId, targetUserId: userToFollow.id });
		}
	}
	console.log('✅ done following profiles and liking posts');
}

seed(4, 1000, 1000, 0);
