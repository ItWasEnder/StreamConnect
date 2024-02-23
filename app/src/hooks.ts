import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const { cookies, locals } = event;
	const theme = cookies.get('theme');

	if (!locals?.session?.theme) {
		locals.session = {
			theme: theme || 'light'
		};
	}

	// console.log('session:', locals.session);

	return await resolve(event);
};
