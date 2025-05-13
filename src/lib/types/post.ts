import { post, profile } from '@/db/schema';
import { sql } from 'drizzle-orm';

export default interface PostType {
	id: number;
	title: string;
	description?: string;
	image: string;
	likedByUser: boolean;
	user: {
		id: number;
		handle: string;
		avatarUrl: string;
	};
}

export const postObject = {
	id: post.id,
	title: post.title,
	description: post.description,
	image: post.image,
	likedByUser: sql<boolean>,
	user: {
		id: profile.id,
		handle: profile.handle,
		avatarUrl: profile.avatarUrl
	}
};
