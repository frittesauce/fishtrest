import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import { env } from '$env/dynamic/private';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg' // or "mysql", "sqlite"
	}),
	socialProviders: {
		discord: {
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET
		}
	},
	emailAndPassword: {
		enabled: true,
		minPasswordLength: 3
	},
	user: {
		additionalFields: {
			finishedOnboard: {
				type: 'boolean',
				required: true,
				defaultValue: 'false',
				input: false
			}
		}
	}
});
