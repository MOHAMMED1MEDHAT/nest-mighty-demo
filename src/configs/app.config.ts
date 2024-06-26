import { registerAs } from '@nestjs/config';

export default registerAs(
	'app',
	(): Record<string, number | string> => ({
		port: parseInt(process.env.PORT) || 3000,
		env: process.env.NODE_ENV || 'development',
		lang: process.env.LANG || 'en',
	}),
);
