import { expect, test } from '@playwright/test';
import { existingUsername } from './gloablconst';
const apiUrl = 'http://localhost:3000/api/profile';

test('returns error 400 if username is missing ', async ({ request }) => {
	const response = await request.get(`${apiUrl}`);

	expect(response.status()).toBe(400);
});

test('returns error 404 if profile doesnt exist ', async ({ request }) => {
	const response = await request.get(`${apiUrl}?username=123`);

	expect(response.status()).toBe(404);
});

test('returns a profile if profile does exist ', async ({ request }) => {
	const response = await request.get(`${apiUrl}?username=${existingUsername}`);

	expect(response.ok()).toBeTruthy;
});
