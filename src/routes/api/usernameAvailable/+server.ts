import { db } from '@/db';
import { user } from '@/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url }: { url: URL }) => {
	const username = url.searchParams.get('username');

	if (!username) {
		return json({ error: 'username is missing!' }, { status: 400 });
	}

	const available = await db.select().from(user).where(eq(user.handle, username)).limit(1);

	if (available.length > 0) {
		return json({ error: 'username already taken!' }, { status: 409 });
	}

	return json('username is available!', { status: 200 });
};
