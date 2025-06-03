import type PostType from '@/types/post';
import { writable } from 'svelte/store';

export const mainFeed = writable<PostType[]>([]);

export const activeFeed = writable<'main' | 'following'>('main');
