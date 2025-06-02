import { expect, request, test } from '@playwright/test';
import { authcookie, existingPostId, existingUsername } from './gloablconst';

const apiUrl = 'http://localhost:3000/api/feed';
const baseUrl = 'http://localhost:3000';

test('returns error 400 if type isnt a real type ', async ({ request }) => {
	const response = await request.get(`${apiUrl}?type=21311231223`);

	expect(response.status()).toBe(400);
});

test('return an error if you arent logged in for the main page type', async ({ request }) => {
	const response = await request.get(`${apiUrl}?type=main`);

	expect(response.status()).toBe(400);
});

test('return a main feed if you are logged in for the main page type', async () => {
	const context = await request.newContext({
		baseURL: baseUrl,
		extraHTTPHeaders: {
			Cookie: `better-auth.session_token=${authcookie}`
		}
	});

	const response = await context.get(`${apiUrl}?type=main`);

	expect(response.ok()).toBe(true);
});

test('return an error if you arent logged in for the following page type', async ({ request }) => {
	const response = await request.get(`${apiUrl}?type=following`);

	expect(response.status()).toBe(400);
});

test('return a following feed if you are logged in for the following page type', async () => {
	const context = await request.newContext({
		baseURL: baseUrl,
		extraHTTPHeaders: {
			Cookie: `better-auth.session_token=${authcookie}`
		}
	});

	const response = await context.get(`${apiUrl}?type=main`);

	expect(response.ok()).toBe(true);
});

test('return an error if you dont give a username for the profile page type', async ({
	request
}) => {
	const response = await request.get(`${apiUrl}?type=profile`);

	expect(response.status()).toBe(400);
});

test('return an error if you if user doesnt exist for the profile page type', async ({
	request
}) => {
	const response = await request.get(`${apiUrl}?type=profile&handle=sdsa`);

	expect(response.status()).toBe(404);
});

test('return all uses post if you give a username for the profile page type', async ({
	request
}) => {
	const response = await request.get(`${apiUrl}?type=profile&handle=${existingUsername}`);

	expect(response.ok()).toBeTruthy();
});
