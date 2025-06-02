import 'dotenv/config';
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/node-postgres';

if (!process.env.DATABASE_URL_DOCKER) {
	throw new Error('DATABASE_URL environment variable is not set');
}

export const db = drizzle({
	connection: {
		connectionString: process.env.DATABASE_URL_DOCKER
		// ssl: process.env.NODE_ENV === 'production' // Only use SSL in production
	},
	schema
});

export const exDb = drizzle({
	connection: {
		connectionString: process.env.DATABASE_URL
	},
	schema
})