import { db } from '@/db';
import { profile } from '@/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url }: { url: URL }) => {
	const username = url.searchParams.get('username');

	if (!username) {
		return json({ error: 'username is missing!' }, { status: 400 });
	}

	if (username.length > 21) {
		return json({ error: 'username cant be longer than 21 characters' }, { status: 400 });
	}

	if (username.length < 3) {
		return json({ error: 'username must be atleast 3 characters' }, { status: 400 });
	}

	const available = await db.select().from(profile).where(eq(profile.handle, username)).limit(1);

	if (available.length > 0) {
		return json({ error: 'username already taken!' }, { status: 409 });
	}

	return json(true, { status: 200 });
};
