import { expect, test } from '@playwright/test';
import { existingPostId } from './gloablconst';

const apiUrl = 'http://localhost:3000/api/search';

test('returns error 400 if query is missing ', async ({ request }) => {
    const response = await request.get(`${apiUrl}`);

    expect(response.status()).toBe(400);
});

test('returns a list of posts and users ', async ({ request }) => {
    const response = await request.get(`${apiUrl}?query=sigma`);

    expect(response.ok()).toBeTruthy();
});
