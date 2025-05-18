import type PostType from '@/types/post';
import { writable } from 'svelte/store';

export const mainFeed = writable<PostType[]>(undefined);

export const activeFeed = writable<'main' | 'following'>('main');
