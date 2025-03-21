import { db } from '@/db';
import { user } from '@/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url }: { url: URL }) => {
	let username = url.searchParams.get('username');

	if (!username) {
		return json({ error: 'username is missing!' }, { status: 400 });
	}

	username = username.replace('@', '');

	// console.log(username);

	if (username.length > 21) {
		return json(
			{ error: 'username cant be longer than 21 characters(including @)' },
			{ status: 400 }
		);
	}

	if (username.length < 3) {
		return json({ error: 'username must be atleast 4 characters(including @)' }, { status: 400 });
	}

	const available = await db.select().from(user).where(eq(user.handle, username)).limit(1);

	if (available.length > 0) {
		return json({ error: 'username already taken!' }, { status: 409 });
	}

	return json(true, { status: 200 });
};
