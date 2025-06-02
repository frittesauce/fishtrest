import { expect, test } from '@playwright/test';
// import { idText } from 'typescript';

const apiUrl = 'http://localhost:3000/api/posts';

test('returns error 400 if id is missing ', async ({ request }) => {
	const response = await request.get(`${apiUrl}`);

	expect(response.status()).toBe(400);
});

test('return a post if post exists', async ({ request }) => {
	const response = await request.get(`${apiUrl}?id=36`);

	expect(response.ok()).toBeTruthy();
	expect(await response.json()).toHaveProperty('id', 36);
});
