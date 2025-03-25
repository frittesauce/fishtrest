import { writable } from 'svelte/store';

export type Profile = {
	id: string;
	handle: string;
	avatarUrl: string;
	bio: string;
} | null;

export const currentProfile = writable<Profile>(undefined);
