import type PostType from '@/types/post';
import { writable } from 'svelte/store';

export const feed = writable<PostType[]>(undefined);
