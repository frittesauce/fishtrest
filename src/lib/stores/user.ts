import { writable } from 'svelte/store';

export type User = {
  id: string;
  name: string;
  role: string;
  image: string;
  finishedOnboard: boolean;
} | null;

export const currentUser = writable<User>(undefined);
