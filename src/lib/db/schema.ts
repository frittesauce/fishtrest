import { pgTable, text, timestamp, boolean, serial, primaryKey } from 'drizzle-orm/pg-core';

export const follower = pgTable(
	'followers',
	{
		userId: serial('user_id')
			.notNull()
			.references(() => profile.id, { onDelete: 'cascade' }),
		targetUserId: serial('target_user_id')
			.notNull()
			.references(() => profile.id, { onDelete: 'cascade' }),
		followedAt: timestamp('followedAt').defaultNow()
	},
	(table) => [primaryKey({ columns: [table.targetUserId, table.userId], name: 'followers_pkey' })]
);

export const like = pgTable(
	'likes',
	{
		userId: serial('user_id')
			.notNull()
			.references(() => profile.id, { onDelete: 'cascade' }),
		postId: serial('post_id')
			.notNull()
			.references(() => post.id, { onDelete: 'cascade' }),
		likedAt: timestamp('liked_at').defaultNow()
	},
	(table) => [primaryKey({ columns: [table.postId, table.userId], name: 'likes_pkey' })]
);

export const post = pgTable('posts', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	image: text('image'),
	createdAt: timestamp('created_at').defaultNow(),
	userId: serial('user_id')
		.notNull()
		.references(() => profile.id, { onDelete: 'cascade' })
});

export const profile = pgTable('profile', {
	id: serial('id').primaryKey(),
	handle: text('handle').unique().notNull(),
	avatarUrl: text('avatar_url'),
	bio: text('bio').default('hello i like cats!'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	finishedOnboard: boolean('finished_onboard').default(false).notNull(),
	role: text('role').default('user').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' })
});

export const account = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at'),
	updatedAt: timestamp('updated_at')
});
