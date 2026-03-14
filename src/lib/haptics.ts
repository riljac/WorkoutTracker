import { createWebHaptics } from 'web-haptics/svelte';

const { trigger, destroy } = createWebHaptics();

export const haptics = {
	/** Light tap — button presses, selections */
	tap: () => trigger('light'),
	/** Medium press — adding/removing items */
	medium: () => trigger('medium'),
	/** Success — saving, completing actions */
	success: () => trigger('success'),
	/** Warning — destructive confirmations */
	warning: () => trigger('warning'),
	/** Error — validation failures */
	error: () => trigger('error'),
	/** Selection change — category filters, toggles */
	selection: () => trigger('selection'),
	destroy
};
