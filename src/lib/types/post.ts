import { post, profile, like } from '@/db/schema';
import { sql } from 'drizzle-orm';

export default interface PostType {
	id: number;
	title: string;
	description?: string;
	image: string;
	likedByUser: boolean;
	likeCount: number;
	user: {
		id: number;
		handle: string;
		avatarUrl: string;
	};
}

export const postObject = (userId: number) => {
	const payload = {
		id: post.id,
		title: post.title,
		description: post.description,
		image: post.image,
		likedByUser: sql<boolean>`(select count(1) from ${like} where ${like.postId} = ${post.id} and ${like.userId} = ${userId}) > 0`,
		likeCount: sql<number>`(select count(*) from ${like} where ${like.postId} = ${post.id})`,
		user: {
			id: profile.id,
			handle: profile.handle,
			avatarUrl: profile.avatarUrl
		}
	};
	return payload;
};
