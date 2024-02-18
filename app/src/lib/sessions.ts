import { derived, writable } from 'svelte/store';
import { page } from '$app/stores';
import { dedupe } from './dedupe';

// internal store allows us to override the page data session without having to invalidate LayoutData
const internal = writable();

// derived store from page data for initial session data
export const external = dedupe(derived(page, ($page) => $page.data.session));

// derived store to handle "if overridden, otherwise default"
export const session = derived(
	[internal, external],
	([$internal, $external]) => $internal || $external
);