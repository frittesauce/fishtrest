import { expect, request, test } from '@playwright/test';
import { authcookie, existingUsername } from './gloablconst';

const apiUrl = 'http://localhost:3000/api/isFollowing';
const baseUrl = 'http://localhost:3000';

test('returns error 400 if username is missing ', async ({ request }) => {
	const response = await request.get(`${apiUrl}`);

	expect(response.status()).toBe(400);
});

test('returns error 400 if youre not logged in', async ({ request }) => {
	const response = await request.get(`${apiUrl}?username=test`);

	expect(response.status()).toBe(400);
});

test('returns error 404 if user doesnt exist', async ({}) => {
	const context = await request.newContext({
		baseURL: baseUrl,
		extraHTTPHeaders: {
			Cookie: `better-auth.session_token=${authcookie}`
		}
	});

	const response = await context.get(`${apiUrl}?username=123`);

	expect(response.status()).toBe(404);
});

test('returns following status if the user exists', async ({}) => {
	const context = await request.newContext({
		baseURL: baseUrl,
		extraHTTPHeaders: {
			Cookie: `better-auth.session_token=${authcookie}`
		}
	});

	const response = await context.get(`${apiUrl}?username=${existingUsername}`);

	expect(response.ok()).toBeTruthy();
});
