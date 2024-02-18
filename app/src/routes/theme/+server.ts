// PUT used to update the theme cookie
import type { RequestHandler } from '@sveltejs/kit';

export const PUT: RequestHandler = async (event) => {
	const theme = await event.request.text();

	const headers = new Headers({
		'Set-Cookie': `theme=${theme}; SameSite=Strict; Secure; HttpOnly`
	});

	console.log('put-theme:', theme);

	return new Response(JSON.stringify({ theme }), { headers });
};
