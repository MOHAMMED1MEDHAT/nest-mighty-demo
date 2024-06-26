import { registerAs } from '@nestjs/config';

export default registerAs(
	'database',
	(): Record<string, string | number> => ({
		url: process.env.DB_URL,
		host: process.env.DB_HOST || 'localhost',
		port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
		username: process.env.DB_USERNAME || 'postgres',
		password: process.env.DB_PASSWORD || 'postgres',
		name: process.env.DB_NAME || 'demo',
	}),
);
