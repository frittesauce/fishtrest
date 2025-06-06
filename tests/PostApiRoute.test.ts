import { expect, test } from '@playwright/test';
import { existingPostId } from './gloablconst';

const apiUrl = 'http://localhost:3000/api/posts';

test('returns error 400 if id is missing ', async ({ request }) => {
	const response = await request.get(`${apiUrl}`);

	expect(response.status()).toBe(400);
});

test('returns error 404 if post doesnt exist ', async ({ request }) => {
	const response = await request.get(`${apiUrl}?id=312231`);

	expect(response.status()).toBe(404);
});

test('return a post if post exists', async ({ request }) => {
	const response = await request.get(`${apiUrl}?id=${existingPostId}`);

	expect(response.ok()).toBeTruthy();
	expect(await response.json()).toHaveProperty('id', existingPostId);
});
