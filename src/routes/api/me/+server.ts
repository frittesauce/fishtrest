import { auth } from '@/auth';
import { db } from '@/db';
import { profile } from '@/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ request }: { request: Request }) => {
	const session = await auth.api.getSession({
		headers: request.headers
	});

	if (!session) {
		return json({ session, profile: {} });
	}

	const [profileDb] = await db
		.select()
		.from(profile)
		.where(eq(profile.userId, session?.user.id))
		.limit(1);

	return json(
		{
			data: {
				session: session.user,
				profile: profileDb
			}
		},
		{ status: 200 }
	);
};
