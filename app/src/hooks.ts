import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const { cookies, locals } = event;
	const theme = cookies.get('theme');

	// If there is no theme cookie set, then set it to 'dark'
	if (!theme) {
		cookies.set('theme', 'dark', {
			maxAge: 60 * 60 * 24 * 30,
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict'
		});
	}

	if (!locals?.session?.theme) {
		locals.session = {
			theme: theme || 'dark'
		};
	}

	console.log('session:', locals.session);

	return await resolve(event);
};
