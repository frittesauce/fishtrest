import { expect, test } from '@playwright/test';
import { existingUsername } from './gloablconst';

const apiUrl = 'http://localhost:3000/api/usernameAvailable';

test('returns true if username is nonexistent', async ({ request }) => {
	const response = await request.get(`${apiUrl}?username=@sigmasasdadas`);

	expect(response.status()).toBe(200);
});

test('returns error code 400 if username is missing in request', async ({ request }) => {
	const response = await request.get(`${apiUrl}?`);

	expect(response.status()).toBe(400);
});

test('returns error code 400 if username is too short', async ({ request }) => {
	const response = await request.get(`${apiUrl}?username=@s`);

	expect(response.status()).toBe(400);
});

test('returns error code 400 if username is too long', async ({ request }) => {
	const response = await request.get(`${apiUrl}?username=@12345678901234567890123`);

	expect(response.status()).toBe(400);
});

test('returns error code 409 already exists', async ({ request }) => {
	const response = await request.get(`${apiUrl}?username=${existingUsername}`);

	expect(response.status()).toBe(409);
});
